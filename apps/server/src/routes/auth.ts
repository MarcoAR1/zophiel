import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../index.js';
import { signToken, authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { loginSchema, registerSchema } from '@zophiel/shared';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) {
      res.status(409).json({ success: false, error: 'Email ya registrado' });
      return;
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { email: data.email, passwordHash, name: data.name },
    });

    const accessToken = signToken(user.id);
    const refreshToken = signToken(user.id, '30d');

    res.status(201).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name, notificationLevel: user.notificationLevel, onboardingCompleted: user.onboardingCompleted, createdAt: user.createdAt.toISOString() },
      },
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      res.status(401).json({ success: false, error: 'Credenciales inválidas' });
      return;
    }

    const valid = user.passwordHash ? await bcrypt.compare(data.password, user.passwordHash) : false;
    if (!valid) {
      res.status(401).json({ success: false, error: 'Credenciales inválidas' });
      return;
    }

    const accessToken = signToken(user.id);
    const refreshToken = signToken(user.id, '30d');

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name, notificationLevel: user.notificationLevel, onboardingCompleted: user.onboardingCompleted, diagnosis: user.diagnosis, createdAt: user.createdAt.toISOString() },
      },
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/auth/refresh
authRouter.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, error: 'Refresh token requerido' });
      return;
    }
    // For now, issue a new access token from the refresh token
    const jwt = await import('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'zophiel-dev-secret-change-in-production';
    const payload = jwt.default.verify(refreshToken, JWT_SECRET) as { userId: string };
    const accessToken = signToken(payload.userId);
    res.json({ success: true, data: { accessToken } });
  } catch {
    res.status(401).json({ success: false, error: 'Refresh token inválido' });
  }
});

// GET /api/auth/me
authRouter.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      return;
    }
    const { passwordHash: _, ...userData } = user;
    res.json({ success: true, data: userData });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/google
authRouter.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400).json({ success: false, error: 'Google credential requerido' });
      return;
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(401).json({ success: false, error: 'Token de Google inválido' });
      return;
    }

    const { sub: googleId, email, name: googleName, picture } = payload;

    // Check if user exists by googleId or email
    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
    });

    if (user) {
      // Link Google account if not already linked
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      }
    } else {
      // Create new user from Google profile
      user = await prisma.user.create({
        data: {
          email,
          name: googleName || email.split('@')[0],
          googleId,
        },
      });
    }

    const accessToken = signToken(user.id);
    const refreshToken = signToken(user.id, '30d');

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          notificationLevel: user.notificationLevel,
          onboardingCompleted: user.onboardingCompleted,
          diagnosis: user.diagnosis,
          createdAt: user.createdAt.toISOString(),
        },
      },
    });
  } catch (err: any) {
    console.error('[Google Auth Error]', err.message);
    res.status(401).json({ success: false, error: 'Error al verificar con Google' });
  }
});
