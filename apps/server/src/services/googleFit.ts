import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
];

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_FIT_REDIRECT_URI || `${process.env.CLIENT_URL || 'http://localhost:5173'}/app/settings`,
  );
}

/** Generate the OAuth URL for Google Fit authorization */
export function getGoogleFitAuthUrl(): string {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
}

/** Exchange auth code for tokens */
export async function exchangeGoogleFitCode(code: string): Promise<{ refreshToken: string; accessToken: string }> {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);
  return {
    refreshToken: tokens.refresh_token || '',
    accessToken: tokens.access_token || '',
  };
}

/** Fetch health data from Google Fit for a given date */
export async function fetchGoogleFitData(refreshToken: string, dateStr: string) {
  const client = getOAuth2Client();
  client.setCredentials({ refresh_token: refreshToken });
  const fitness = google.fitness({ version: 'v1', auth: client });

  const startOfDay = new Date(dateStr + 'T00:00:00Z');
  const endOfDay = new Date(dateStr + 'T23:59:59Z');
  const startMillis = startOfDay.getTime();
  const endMillis = endOfDay.getTime();

  const [steps, sleep, heartRate, calories, activeMinutes] = await Promise.all([
    fetchSteps(fitness, startMillis, endMillis),
    fetchSleep(fitness, startMillis, endMillis),
    fetchHeartRate(fitness, startMillis, endMillis),
    fetchCalories(fitness, startMillis, endMillis),
    fetchActiveMinutes(fitness, startMillis, endMillis),
  ]);

  return { steps, sleepMinutes: sleep, heartRateAvg: heartRate.avg, heartRateMax: heartRate.max, calories, activeMinutes };
}

async function fetchSteps(fitness: any, startMillis: number, endMillis: number): Promise<number | null> {
  try {
    const res = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
        bucketByTime: { durationMillis: endMillis - startMillis },
        startTimeMillis: startMillis,
        endTimeMillis: endMillis,
      },
    });
    const bucket = res.data.bucket?.[0];
    const point = bucket?.dataset?.[0]?.point?.[0];
    return point?.value?.[0]?.intVal ?? null;
  } catch { return null; }
}

async function fetchSleep(fitness: any, startMillis: number, endMillis: number): Promise<number | null> {
  try {
    const res = await fitness.users.sessions.list({
      userId: 'me',
      startTime: new Date(startMillis).toISOString(),
      endTime: new Date(endMillis).toISOString(),
      activityType: 72, // sleep
    });
    const sessions = res.data.session || [];
    let totalMs = 0;
    for (const s of sessions) {
      totalMs += (Number(s.endTimeMillis) - Number(s.startTimeMillis));
    }
    return totalMs > 0 ? Math.round(totalMs / 60000) : null;
  } catch { return null; }
}

async function fetchHeartRate(fitness: any, startMillis: number, endMillis: number): Promise<{ avg: number | null; max: number | null }> {
  try {
    const res = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{ dataTypeName: 'com.google.heart_rate.bpm' }],
        bucketByTime: { durationMillis: endMillis - startMillis },
        startTimeMillis: startMillis,
        endTimeMillis: endMillis,
      },
    });
    const bucket = res.data.bucket?.[0];
    const point = bucket?.dataset?.[0]?.point?.[0];
    if (!point?.value) return { avg: null, max: null };
    const avg = point.value.find((v: any) => v.fpVal !== undefined)?.fpVal;
    const max = point.value.find((v: any) => v.intVal !== undefined)?.intVal;
    return { avg: avg ? Math.round(avg) : null, max: max ?? null };
  } catch { return { avg: null, max: null }; }
}

async function fetchCalories(fitness: any, startMillis: number, endMillis: number): Promise<number | null> {
  try {
    const res = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{ dataTypeName: 'com.google.calories.expended' }],
        bucketByTime: { durationMillis: endMillis - startMillis },
        startTimeMillis: startMillis,
        endTimeMillis: endMillis,
      },
    });
    const point = res.data.bucket?.[0]?.dataset?.[0]?.point?.[0];
    return point?.value?.[0]?.fpVal ? Math.round(point.value[0].fpVal) : null;
  } catch { return null; }
}

async function fetchActiveMinutes(fitness: any, startMillis: number, endMillis: number): Promise<number | null> {
  try {
    const res = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{ dataTypeName: 'com.google.active_minutes' }],
        bucketByTime: { durationMillis: endMillis - startMillis },
        startTimeMillis: startMillis,
        endTimeMillis: endMillis,
      },
    });
    const point = res.data.bucket?.[0]?.dataset?.[0]?.point?.[0];
    return point?.value?.[0]?.intVal ?? null;
  } catch { return null; }
}
