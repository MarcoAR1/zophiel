import { prisma } from '../index.js';
import { QOL_WEIGHTS } from '@zophiel/shared';
import type { QualityOfLife } from '@zophiel/shared';

export async function calculateQoL(userId: string, periodDays: number): Promise<QualityOfLife[]> {
  const since = new Date();
  since.setDate(since.getDate() - periodDays);

  const [painEntries, questionResponses] = await Promise.all([
    prisma.painEntry.findMany({
      where: { userId, timestamp: { gte: since } },
      orderBy: { timestamp: 'asc' },
    }),
    prisma.questionResponse.findMany({
      where: { userId, timestamp: { gte: since } },
      include: { question: true },
      orderBy: { timestamp: 'asc' },
    }),
  ]);

  // Group by date
  const dateMap: Record<
    string,
    { painValues: number[]; moodValues: number[]; activityValues: number[]; sleepValues: number[] }
  > = {};

  const ensureDate = (date: string) => {
    if (!dateMap[date]) {
      dateMap[date] = { painValues: [], moodValues: [], activityValues: [], sleepValues: [] };
    }
  };

  // Pain entries contribute pain + mood
  for (const entry of painEntries) {
    const date = entry.timestamp.toISOString().slice(0, 10);
    ensureDate(date);
    dateMap[date].painValues.push(entry.intensity);
    if (entry.mood) dateMap[date].moodValues.push(entry.mood);
  }

  // Question responses contribute to their category
  for (const resp of questionResponses) {
    const date = resp.timestamp.toISOString().slice(0, 10);
    ensureDate(date);
    const cat = resp.question.category;
    if (cat === 'mood') dateMap[date].moodValues.push(resp.value);
    else if (cat === 'activity') dateMap[date].activityValues.push(resp.value);
    else if (cat === 'sleep') dateMap[date].sleepValues.push(resp.value);
    else if (cat === 'pain') dateMap[date].painValues.push(resp.value);
  }

  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);

  const results: QualityOfLife[] = [];

  for (const [date, data] of Object.entries(dateMap).sort(([a], [b]) => a.localeCompare(b))) {
    const avgPain = avg(data.painValues);           // 0-10
    const avgMood = avg(data.moodValues);           // 1-5 or 0-10
    const avgActivity = avg(data.activityValues);   // 0-10
    const avgSleep = avg(data.sleepValues);         // 0-10

    // Normalize each to 0-100 (higher is better)
    const painScore = avgPain !== null ? ((10 - avgPain) / 10) * 100 : 50;
    const moodScore = avgMood !== null ? (avgMood / 5) * 100 : 50;
    const activityScore = avgActivity !== null ? (avgActivity / 10) * 100 : 50;
    const sleepScore = avgSleep !== null ? (avgSleep / 10) * 100 : 50;

    const score = Math.round(
      QOL_WEIGHTS.pain * painScore +
      QOL_WEIGHTS.mood * moodScore +
      QOL_WEIGHTS.activity * activityScore +
      QOL_WEIGHTS.sleep * sleepScore,
    );

    results.push({
      date,
      score: Math.max(0, Math.min(100, score)),
      breakdown: {
        pain: Math.round(painScore),
        mood: Math.round(moodScore),
        activity: Math.round(activityScore),
        sleep: Math.round(sleepScore),
      },
    });
  }

  return results;
}
