import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { authRouter } from './routes/auth.js';
import { painRouter } from './routes/pain.js';
import { symptomsRouter } from './routes/symptoms.js';
import { questionsRouter } from './routes/questions.js';
import { analyticsRouter } from './routes/analytics.js';
import { onboardingRouter } from './routes/onboarding.js';
import { settingsRouter } from './routes/settings.js';
import { pushRouter } from './routes/push.js';
import { startNotificationCron } from './services/notificationCron.js';

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security ──
app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));

// Rate limiting — 100 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Demasiadas peticiones, intentá más tarde' },
});
app.use('/api/', limiter);

// Auth endpoints get stricter rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Demasiados intentos de login' },
});
app.use('/api/auth', authLimiter);

app.use(express.json({ limit: '1mb' }));

// ── Routes ──
app.use('/api/auth', authRouter);
app.use('/api/pain', painRouter);
app.use('/api/symptoms', symptomsRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/push', pushRouter);

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🩺 Zophiel API running on http://localhost:${PORT}`);
  startNotificationCron();
});
