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

// GET /api/analytics/pain-report?period=30 — comprehensive report
analyticsRouter.get('/pain-report', async (req: AuthRequest, res) => {
  try {
    const period = Number(req.query.period || '30');
    const since = new Date();
    since.setDate(since.getDate() - period);

    const entries = await prisma.painEntry.findMany({
      where: { userId: req.userId, timestamp: { gte: since } },
      orderBy: { timestamp: 'asc' },
    });

    if (entries.length === 0) {
      res.json({ success: true, data: null });
      return;
    }

    const intensities = entries.map((e) => e.intensity);

    // ── Summary ──
    const summary = {
      total: entries.length,
      average: Math.round((intensities.reduce((a, b) => a + b, 0) / intensities.length) * 10) / 10,
      min: Math.min(...intensities),
      max: Math.max(...intensities),
      daysWithPain: new Set(entries.map((e) => e.timestamp.toISOString().slice(0, 10))).size,
      periodDays: period,
    };

    // ── By Body Region ──
    const byRegion: Record<string, { total: number; count: number }> = {};
    for (const e of entries) {
      const region = e.bodyRegion || 'unknown';
      if (!byRegion[region]) byRegion[region] = { total: 0, count: 0 };
      byRegion[region].total += e.intensity;
      byRegion[region].count += 1;
    }
    const regionStats = Object.entries(byRegion)
      .map(([region, { total, count }]) => ({
        region,
        average: Math.round((total / count) * 10) / 10,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // ── By Sensation ──
    const bySensation: Record<string, { total: number; count: number }> = {};
    for (const e of entries) {
      const sensation = e.painSensation || 'no especificado';
      if (!bySensation[sensation]) bySensation[sensation] = { total: 0, count: 0 };
      bySensation[sensation].total += e.intensity;
      bySensation[sensation].count += 1;
    }
    const sensationStats = Object.entries(bySensation)
      .map(([sensation, { total, count }]) => ({
        sensation,
        average: Math.round((total / count) * 10) / 10,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // ── By Temporality ──
    const byTemporality: Record<string, number> = {};
    for (const e of entries) {
      const temp = e.painTemporality || 'no especificado';
      byTemporality[temp] = (byTemporality[temp] || 0) + 1;
    }
    const temporalityStats = Object.entries(byTemporality)
      .map(([temporality, count]) => ({ temporality, count, percentage: Math.round((count / entries.length) * 100) }))
      .sort((a, b) => b.count - a.count);

    // ── Weekly Heatmap (Mon=0…Sun=6) ──
    const weeklyMap: Record<number, { total: number; count: number }> = {};
    for (let i = 0; i < 7; i++) weeklyMap[i] = { total: 0, count: 0 };
    for (const e of entries) {
      const day = (e.timestamp.getDay() + 6) % 7; // Monday=0
      weeklyMap[day].total += e.intensity;
      weeklyMap[day].count += 1;
    }
    const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const weeklyHeatmap = DAYS.map((label, i) => ({
      day: label,
      average: weeklyMap[i].count > 0 ? Math.round((weeklyMap[i].total / weeklyMap[i].count) * 10) / 10 : 0,
      count: weeklyMap[i].count,
    }));

    // ── Mood correlation ──
    const moodPain: Record<string, { total: number; count: number }> = {};
    for (const e of entries) {
      if (!e.moodStates) continue;
      try {
        const moods: string[] = JSON.parse(e.moodStates);
        for (const mood of moods) {
          if (!moodPain[mood]) moodPain[mood] = { total: 0, count: 0 };
          moodPain[mood].total += e.intensity;
          moodPain[mood].count += 1;
        }
      } catch { /* ignore malformed */ }
    }
    const moodCorrelation = Object.entries(moodPain)
      .map(([mood, { total, count }]) => ({
        mood,
        averagePain: Math.round((total / count) * 10) / 10,
        count,
      }))
      .sort((a, b) => b.averagePain - a.averagePain);

    // ── Time of day ──
    const byHour: Record<number, { total: number; count: number }> = {};
    for (const e of entries) {
      const hour = e.timestamp.getHours();
      if (!byHour[hour]) byHour[hour] = { total: 0, count: 0 };
      byHour[hour].total += e.intensity;
      byHour[hour].count += 1;
    }
    const hourEntries = Object.entries(byHour).map(([h, { total, count }]) => ({
      hour: Number(h),
      average: Math.round((total / count) * 10) / 10,
    }));
    const peakHour = hourEntries.length > 0
      ? hourEntries.reduce((a, b) => (a.average > b.average ? a : b))
      : null;
    const bestHour = hourEntries.length > 0
      ? hourEntries.reduce((a, b) => (a.average < b.average ? a : b))
      : null;

    res.json({
      success: true,
      data: {
        summary,
        regionStats,
        sensationStats,
        temporalityStats,
        weeklyHeatmap,
        moodCorrelation,
        timeOfDay: { peak: peakHour, best: bestHour },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
