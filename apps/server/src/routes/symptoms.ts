import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { createSymptomSchema } from '@zophiel/shared';

export const symptomsRouter = Router();
symptomsRouter.use(authMiddleware);

// POST /api/symptoms
symptomsRouter.post('/', async (req: AuthRequest, res) => {
  try {
    const data = createSymptomSchema.parse(req.body);
    const log = await prisma.symptomLog.create({
      data: { ...data, userId: req.userId! },
    });
    res.status(201).json({ success: true, data: log });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/symptoms
symptomsRouter.get('/', async (req: AuthRequest, res) => {
  try {
    const { days = '30' } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const logs = await prisma.symptomLog.findMany({
      where: { userId: req.userId, timestamp: { gte: since } },
      orderBy: { timestamp: 'desc' },
      take: 200,
    });
    res.json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/symptoms/stats
symptomsRouter.get('/stats', async (req: AuthRequest, res) => {
  try {
    const { days = '30' } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const logs = await prisma.symptomLog.findMany({
      where: { userId: req.userId, timestamp: { gte: since } },
    });

    const bySymptom: Record<string, { totalSeverity: number; count: number }> = {};
    for (const log of logs) {
      if (!bySymptom[log.symptom]) bySymptom[log.symptom] = { totalSeverity: 0, count: 0 };
      bySymptom[log.symptom].totalSeverity += log.severity;
      bySymptom[log.symptom].count += 1;
    }

    const stats: Record<string, { averageSeverity: number; count: number }> = {};
    for (const [symptom, { totalSeverity, count }] of Object.entries(bySymptom)) {
      stats[symptom] = {
        averageSeverity: Math.round((totalSeverity / count) * 10) / 10,
        count,
      };
    }

    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
