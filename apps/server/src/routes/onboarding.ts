import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

export const onboardingRouter = Router();
onboardingRouter.use(authMiddleware);

// POST /api/onboarding/complete — save onboarding data
onboardingRouter.post('/complete', async (req: AuthRequest, res) => {
  try {
    const { diagnosis, notificationLevel, quietHoursStart, quietHoursEnd } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        diagnosis: diagnosis || undefined,
        notificationLevel: notificationLevel || undefined,
        quietHoursStart: quietHoursStart || undefined,
        quietHoursEnd: quietHoursEnd || undefined,
        onboardingCompleted: true,
      },
    });

    const { passwordHash: _, ...userData } = user;
    res.json({ success: true, data: userData });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});
