import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { notificationSettingsSchema, profileUpdateSchema } from '@zophiel/shared';

export const settingsRouter = Router();
settingsRouter.use(authMiddleware);

// PUT /api/settings/notifications
settingsRouter.put('/notifications', async (req: AuthRequest, res) => {
  try {
    const data = notificationSettingsSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        notificationLevel: data.notificationLevel,
        quietHoursStart: data.quietHoursStart,
        quietHoursEnd: data.quietHoursEnd,
      },
    });
    const { passwordHash: _, ...userData } = user;
    res.json({ success: true, data: userData });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/settings/profile
settingsRouter.put('/profile', async (req: AuthRequest, res) => {
  try {
    const data = profileUpdateSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
    });
    const { passwordHash: _, ...userData } = user;
    res.json({ success: true, data: userData });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});
