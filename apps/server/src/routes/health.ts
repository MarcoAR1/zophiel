import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { getGoogleFitAuthUrl, exchangeGoogleFitCode, fetchGoogleFitData } from '../services/googleFit.js';

export const healthRouter = Router();
healthRouter.use(authMiddleware);

// GET /api/health/status — connection status + last sync
healthRouter.get('/status', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { healthProvider: true },
    });

    const lastSync = await prisma.healthSync.findFirst({
      where: { userId: req.userId },
      orderBy: { syncedAt: 'desc' },
      select: { syncedAt: true, date: true },
    });

    res.json({
      success: true,
      data: {
        connected: !!user?.healthProvider,
        provider: user?.healthProvider || null,
        lastSync: lastSync?.syncedAt || null,
        lastSyncDate: lastSync?.date || null,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/health/connect/google/url — get OAuth URL
healthRouter.get('/connect/google/url', async (_req: AuthRequest, res) => {
  try {
    const url = getGoogleFitAuthUrl();
    res.json({ success: true, data: { url } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/health/connect/google — exchange code for tokens
healthRouter.post('/connect/google', async (req: AuthRequest, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      res.status(400).json({ success: false, error: 'Code required' });
      return;
    }

    const { refreshToken } = await exchangeGoogleFitCode(code);

    await prisma.user.update({
      where: { id: req.userId },
      data: {
        healthProvider: 'google_fit',
        googleFitToken: refreshToken,
      },
    });

    // Sync today's data immediately
    const today = new Date().toISOString().slice(0, 10);
    try {
      const healthData = await fetchGoogleFitData(refreshToken, today);
      await prisma.healthSync.upsert({
        where: { userId_date_source: { userId: req.userId!, date: today, source: 'google_fit' } },
        create: { userId: req.userId!, date: today, source: 'google_fit', ...healthData },
        update: healthData,
      });
    } catch { /* first sync may fail, that's ok */ }

    res.json({ success: true, data: { connected: true, provider: 'google_fit' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/health/disconnect
healthRouter.post('/disconnect', async (req: AuthRequest, res) => {
  try {
    await prisma.user.update({
      where: { id: req.userId },
      data: { healthProvider: null, googleFitToken: null },
    });
    res.json({ success: true, data: { connected: false } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/health/sync — sync data (Google Fit from server, or Health Connect data from client)
healthRouter.post('/sync', async (req: AuthRequest, res) => {
  try {
    const { source, date, data } = req.body;
    const syncDate = date || new Date().toISOString().slice(0, 10);

    if (source === 'health_connect' && data) {
      // Health Connect: client sends data directly
      await prisma.healthSync.upsert({
        where: { userId_date_source: { userId: req.userId!, date: syncDate, source: 'health_connect' } },
        create: {
          userId: req.userId!,
          date: syncDate,
          source: 'health_connect',
          steps: data.steps ?? null,
          sleepMinutes: data.sleepMinutes ?? null,
          heartRateAvg: data.heartRateAvg ?? null,
          heartRateMax: data.heartRateMax ?? null,
          calories: data.calories ?? null,
          activeMinutes: data.activeMinutes ?? null,
        },
        update: {
          steps: data.steps ?? null,
          sleepMinutes: data.sleepMinutes ?? null,
          heartRateAvg: data.heartRateAvg ?? null,
          heartRateMax: data.heartRateMax ?? null,
          calories: data.calories ?? null,
          activeMinutes: data.activeMinutes ?? null,
        },
      });
    } else {
      // Google Fit: server fetches data
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { googleFitToken: true },
      });

      if (!user?.googleFitToken) {
        res.status(400).json({ success: false, error: 'Google Fit not connected' });
        return;
      }

      const healthData = await fetchGoogleFitData(user.googleFitToken, syncDate);
      await prisma.healthSync.upsert({
        where: { userId_date_source: { userId: req.userId!, date: syncDate, source: 'google_fit' } },
        create: { userId: req.userId!, date: syncDate, source: 'google_fit', ...healthData },
        update: healthData,
      });
    }

    // Return today's data
    const todayData = await prisma.healthSync.findFirst({
      where: { userId: req.userId, date: syncDate },
      orderBy: { syncedAt: 'desc' },
    });

    res.json({ success: true, data: todayData });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/health/data?date=YYYY-MM-DD&days=7
healthRouter.get('/data', async (req: AuthRequest, res) => {
  try {
    const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
    const days = Number(req.query.days || '1');

    if (days === 1) {
      const data = await prisma.healthSync.findFirst({
        where: { userId: req.userId, date },
        orderBy: { syncedAt: 'desc' },
      });
      res.json({ success: true, data });
    } else {
      const since = new Date(date);
      since.setDate(since.getDate() - days);
      const sinceStr = since.toISOString().slice(0, 10);

      const data = await prisma.healthSync.findMany({
        where: { userId: req.userId, date: { gte: sinceStr, lte: date } },
        orderBy: { date: 'asc' },
      });
      res.json({ success: true, data });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
