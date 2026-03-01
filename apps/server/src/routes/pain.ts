import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { createPainEntrySchema } from '@zophiel/shared';

export const painRouter = Router();
painRouter.use(authMiddleware);

// POST /api/pain — create pain entry
painRouter.post('/', async (req: AuthRequest, res) => {
  try {
    const data = createPainEntrySchema.parse(req.body);
    // Determine bodyRegion from explicit field or first muscle key
    const bodyRegion = data.bodyRegion
      || (data.musclePainLevels ? Object.keys(data.musclePainLevels)[0] : undefined)
      || 'general';
    const entry = await prisma.painEntry.create({
      data: {
        userId: req.userId!,
        intensity: data.intensity,
        bodyRegion,
        painSensation: data.painSensation,
        painIntensityLevel: data.painIntensityLevel,
        painTemporality: data.painTemporality,
        moodStates: data.moodStates ? JSON.stringify(data.moodStates) : null,
        musclePainLevels: data.musclePainLevels ? JSON.stringify(data.musclePainLevels) : null,
        notes: data.notes,
      },
    });
    res.status(201).json({ success: true, data: entry });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/pain — list entries (with optional ?from=&to=&region= filters)
painRouter.get('/', async (req: AuthRequest, res) => {
  try {
    const { from, to, region } = req.query;
    const where: any = { userId: req.userId };
    if (from || to) {
      where.timestamp = {};
      if (from) where.timestamp.gte = new Date(from as string);
      if (to) where.timestamp.lte = new Date(to as string);
    }
    if (region) where.bodyRegion = region;

    const entries = await prisma.painEntry.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 200,
    });
    res.json({ success: true, data: entries });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/pain/stats — averages per period
painRouter.get('/stats', async (req: AuthRequest, res) => {
  try {
    const { days = '30' } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const entries = await prisma.painEntry.findMany({
      where: { userId: req.userId, timestamp: { gte: since } },
    });

    if (entries.length === 0) {
      res.json({
        success: true,
        data: { average: 0, min: 0, max: 0, count: 0, byRegion: {} },
      });
      return;
    }

    const intensities = entries.map((e) => e.intensity);
    const average = intensities.reduce((a, b) => a + b, 0) / intensities.length;

    const byRegion: Record<string, { total: number; count: number }> = {};
    for (const e of entries) {
      const region = e.bodyRegion || 'unknown';
      if (!byRegion[region]) byRegion[region] = { total: 0, count: 0 };
      byRegion[region].total += e.intensity;
      byRegion[region].count += 1;
    }

    const byRegionAvg: Record<string, { average: number; count: number }> = {};
    for (const [region, { total, count }] of Object.entries(byRegion)) {
      byRegionAvg[region] = { average: Math.round((total / count) * 10) / 10, count };
    }

    res.json({
      success: true,
      data: {
        average: Math.round(average * 10) / 10,
        min: Math.min(...intensities),
        max: Math.max(...intensities),
        count: entries.length,
        byRegion: byRegionAvg,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
