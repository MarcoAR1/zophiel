import { Router } from 'express';
import { prisma } from '../index.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { calculateQoL } from '../services/qol.js';

export const analyticsRouter = Router();
analyticsRouter.use(authMiddleware);

// GET /api/analytics/pain-trend?period=7|30|90
analyticsRouter.get('/pain-trend', async (req: AuthRequest, res) => {
  try {
    const period = Number(req.query.period || '30');
    const since = new Date();
    since.setDate(since.getDate() - period);

    const entries = await prisma.painEntry.findMany({
      where: { userId: req.userId, timestamp: { gte: since } },
      orderBy: { timestamp: 'asc' },
    });

    // Group by date
    const byDate: Record<string, { total: number; count: number }> = {};
    for (const e of entries) {
      const date = e.timestamp.toISOString().slice(0, 10);
      if (!byDate[date]) byDate[date] = { total: 0, count: 0 };
      byDate[date].total += e.intensity;
      byDate[date].count += 1;
    }

    const trend = Object.entries(byDate).map(([date, { total, count }]) => ({
      date,
      average: Math.round((total / count) * 10) / 10,
      count,
    }));

    res.json({ success: true, data: trend });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/analytics/quality-of-life?period=30
analyticsRouter.get('/quality-of-life', async (req: AuthRequest, res) => {
  try {
    const period = Number(req.query.period || '30');
    const qol = await calculateQoL(req.userId!, period);
    res.json({ success: true, data: qol });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/analytics/symptom-correlation
analyticsRouter.get('/symptom-correlation', async (req: AuthRequest, res) => {
  try {
    const period = Number(req.query.period || '30');
    const since = new Date();
    since.setDate(since.getDate() - period);

    const [painEntries, symptoms] = await Promise.all([
      prisma.painEntry.findMany({
        where: { userId: req.userId, timestamp: { gte: since } },
      }),
      prisma.symptomLog.findMany({
        where: { userId: req.userId, timestamp: { gte: since } },
      }),
    ]);

    // Group pain by date
    const painByDate: Record<string, number[]> = {};
    for (const e of painEntries) {
      const date = e.timestamp.toISOString().slice(0, 10);
      if (!painByDate[date]) painByDate[date] = [];
      painByDate[date].push(e.intensity);
    }

    // Group symptoms by date
    const symptomsByDate: Record<string, string[]> = {};
    for (const s of symptoms) {
      const date = s.timestamp.toISOString().slice(0, 10);
      if (!symptomsByDate[date]) symptomsByDate[date] = [];
      symptomsByDate[date].push(s.symptom);
    }

    // Calculate average pain on days with each symptom
    const symptomPain: Record<string, { totalPain: number; days: number }> = {};
    for (const [date, syms] of Object.entries(symptomsByDate)) {
      const painVals = painByDate[date];
      if (!painVals) continue;
      const avgPain = painVals.reduce((a, b) => a + b, 0) / painVals.length;
      const uniqueSyms = [...new Set(syms)];
      for (const sym of uniqueSyms) {
        if (!symptomPain[sym]) symptomPain[sym] = { totalPain: 0, days: 0 };
        symptomPain[sym].totalPain += avgPain;
        symptomPain[sym].days += 1;
      }
    }

    const correlation = Object.entries(symptomPain).map(([symptom, { totalPain, days }]) => ({
      symptom,
      averagePainOnDaysWithSymptom: Math.round((totalPain / days) * 10) / 10,
      daysReported: days,
    }));

    res.json({ success: true, data: correlation });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
