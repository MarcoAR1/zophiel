import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

export const pushRouter = Router();
pushRouter.use(authMiddleware);

// POST /api/push/subscribe — save push subscription
pushRouter.post('/subscribe', async (req: AuthRequest, res) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      res.status(400).json({ success: false, error: 'Subscription data incompleta' });
      return;
    }

    // Upsert — if endpoint exists, update; otherwise create
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        userId: req.userId!,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      create: {
        userId: req.userId!,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    });

    res.json({ success: true, data: { subscribed: true } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/push/unsubscribe — remove push subscription
pushRouter.delete('/unsubscribe', async (req: AuthRequest, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      res.status(400).json({ success: false, error: 'Endpoint requerido' });
      return;
    }

    await prisma.pushSubscription.deleteMany({
      where: { endpoint, userId: req.userId! },
    });

    res.json({ success: true, data: { unsubscribed: true } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/push/vapid-key — return public VAPID key for client
pushRouter.get('/vapid-key', (_req, res) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) {
    res.status(500).json({ success: false, error: 'VAPID key no configurada' });
    return;
  }
  res.json({ success: true, data: { publicKey } });
});
