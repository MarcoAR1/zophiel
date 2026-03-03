/**
 * Native Health Service — Health Connect (Android) + HealthKit (iOS)
 * Uses @capgo/capacitor-health plugin.
 * Falls back gracefully on web (non-native builds).
 */
import { Capacitor } from '@capacitor/core';

// Dynamically import to avoid issues on web
let Health: any = null;

async function getHealth() {
  if (Health) return Health;
  if (!Capacitor.isNativePlatform()) return null;
  try {
    const mod = await import('@capgo/capacitor-health');
    Health = mod.Health;
    return Health;
  } catch {
    return null;
  }
}

// ── Types ──
export interface NativeHealthData {
  steps: number | null;
  sleepMinutes: number | null;
  sleepStages: { deep: number; light: number; rem: number; awake: number } | null;
  heartRateAvg: number | null;
  heartRateMin: number | null;
  heartRateMax: number | null;
  calories: number | null;
  distance: number | null; // meters
  oxygenSaturation: number | null; // percent
  restingHeartRate: number | null;
}

export interface HealthAvailability {
  available: boolean;
  platform: 'ios' | 'android' | 'web';
  reason?: string;
}

// ── Data types we want to read ──
const READ_TYPES = [
  'steps',
  'sleep',
  'heartRate',
  'calories',
  'distance',
  'oxygenSaturation',
  'restingHeartRate',
] as const;

/**
 * Check if native health APIs are available on this device
 */
export async function isHealthAvailable(): Promise<HealthAvailability> {
  const h = await getHealth();
  if (!h) return { available: false, platform: 'web', reason: 'Not a native platform' };

  try {
    const result = await h.isAvailable();
    return result;
  } catch (err: any) {
    return { available: false, platform: 'web', reason: err.message };
  }
}

/**
 * Request permission to read health data
 */
export async function requestHealthPermissions(): Promise<boolean> {
  const h = await getHealth();
  if (!h) return false;

  try {
    const status = await h.requestAuthorization({
      read: [...READ_TYPES],
      write: [],
    });
    // If at least steps were authorized, consider it a success
    return status.readAuthorized?.length > 0;
  } catch (err: any) {
    console.error('[NativeHealth] Permission request failed:', err);
    return false;
  }
}

/**
 * Check current authorization status
 */
export async function checkHealthPermissions(): Promise<boolean> {
  const h = await getHealth();
  if (!h) return false;

  try {
    const status = await h.checkAuthorization({
      read: [...READ_TYPES],
      write: [],
    });
    return status.readAuthorized?.length > 0;
  } catch {
    return false;
  }
}

/**
 * Read health data for a given number of past days
 */
export async function readHealthData(days: number = 1): Promise<NativeHealthData> {
  const h = await getHealth();
  const empty: NativeHealthData = {
    steps: null,
    sleepMinutes: null,
    sleepStages: null,
    heartRateAvg: null,
    heartRateMin: null,
    heartRateMax: null,
    calories: null,
    distance: null,
    oxygenSaturation: null,
    restingHeartRate: null,
  };

  if (!h) return empty;

  const endDate = new Date().toISOString();
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const result = { ...empty };

  // ── Steps (aggregated sum) ──
  try {
    const { samples } = await h.queryAggregated({
      dataType: 'steps',
      startDate,
      endDate,
      bucket: 'day',
      aggregation: 'sum',
    });
    if (samples?.length) {
      result.steps = samples.reduce((sum: number, s: any) => sum + (s.value || 0), 0);
    }
  } catch {}

  // ── Sleep (raw samples for stages) ──
  try {
    const { samples } = await h.readSamples({
      dataType: 'sleep',
      startDate,
      endDate,
      limit: 200,
    });
    if (samples?.length) {
      let totalMinutes = 0;
      const stages = { deep: 0, light: 0, rem: 0, awake: 0 };

      for (const s of samples) {
        const mins = s.value || 0;
        totalMinutes += mins;

        if (s.sleepState === 'deep') stages.deep += mins;
        else if (s.sleepState === 'light') stages.light += mins;
        else if (s.sleepState === 'rem') stages.rem += mins;
        else if (s.sleepState === 'awake') stages.awake += mins;
        else if (s.sleepState === 'asleep') stages.light += mins; // generic asleep → light
      }

      result.sleepMinutes = totalMinutes;
      result.sleepStages = stages;
    }
  } catch {}

  // ── Heart Rate (aggregated) ──
  try {
    const [avgRes, minRes, maxRes] = await Promise.all([
      h.queryAggregated({ dataType: 'heartRate', startDate, endDate, bucket: 'day', aggregation: 'average' }),
      h.queryAggregated({ dataType: 'heartRate', startDate, endDate, bucket: 'day', aggregation: 'min' }),
      h.queryAggregated({ dataType: 'heartRate', startDate, endDate, bucket: 'day', aggregation: 'max' }),
    ]);

    if (avgRes.samples?.length) {
      const vals = avgRes.samples.map((s: any) => s.value).filter(Boolean);
      result.heartRateAvg = vals.length ? Math.round(vals.reduce((a: number, b: number) => a + b, 0) / vals.length) : null;
    }
    if (minRes.samples?.length) {
      result.heartRateMin = Math.min(...minRes.samples.map((s: any) => s.value).filter(Boolean));
    }
    if (maxRes.samples?.length) {
      result.heartRateMax = Math.max(...maxRes.samples.map((s: any) => s.value).filter(Boolean));
    }
  } catch {}

  // ── Calories (aggregated sum) ──
  try {
    const { samples } = await h.queryAggregated({
      dataType: 'calories',
      startDate,
      endDate,
      bucket: 'day',
      aggregation: 'sum',
    });
    if (samples?.length) {
      result.calories = Math.round(samples.reduce((sum: number, s: any) => sum + (s.value || 0), 0));
    }
  } catch {}

  // ── Distance (aggregated sum, meters) ──
  try {
    const { samples } = await h.queryAggregated({
      dataType: 'distance',
      startDate,
      endDate,
      bucket: 'day',
      aggregation: 'sum',
    });
    if (samples?.length) {
      result.distance = Math.round(samples.reduce((sum: number, s: any) => sum + (s.value || 0), 0));
    }
  } catch {}

  // ── Oxygen Saturation (latest sample) ──
  try {
    const { samples } = await h.readSamples({
      dataType: 'oxygenSaturation',
      startDate,
      endDate,
      limit: 1,
    });
    if (samples?.length) {
      result.oxygenSaturation = samples[0].value;
    }
  } catch {}

  // ── Resting Heart Rate (latest) ──
  try {
    const { samples } = await h.readSamples({
      dataType: 'restingHeartRate',
      startDate,
      endDate,
      limit: 1,
    });
    if (samples?.length) {
      result.restingHeartRate = Math.round(samples[0].value);
    }
  } catch {}

  return result;
}

/**
 * Open the Health Connect settings screen (Android only)
 */
export async function openHealthSettings(): Promise<void> {
  const h = await getHealth();
  if (h) {
    try {
      await h.openHealthConnectSettings();
    } catch {}
  }
}
