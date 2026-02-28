import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { BodyRegion, PainIntensityLevel, PainTemporality, MoodState } from '@zophiel/shared';

// ── IndexedDB Schema ──

export interface OfflinePainEntry {
  localId: string;
  serverId?: string;
  syncStatus: 'pending' | 'synced' | 'error';
  createdAt: string;
  intensity: number;
  bodyRegion?: string;
  painIntensityLevel?: PainIntensityLevel;
  painTemporality?: PainTemporality;
  moodStates?: MoodState[];
  musclePainLevels?: Partial<Record<BodyRegion, PainIntensityLevel>>;
  notes?: string;
  lastSyncAttempt?: string;
  errorMessage?: string;
}

interface ZophielDB extends DBSchema {
  painEntries: {
    key: string;
    value: OfflinePainEntry;
    indexes: {
      'by-sync': string;
      'by-date': string;
    };
  };
}

let dbInstance: IDBPDatabase<ZophielDB> | null = null;

async function getDB(): Promise<IDBPDatabase<ZophielDB>> {
  if (dbInstance) return dbInstance;
  dbInstance = await openDB<ZophielDB>('zophiel-offline', 1, {
    upgrade(db) {
      const store = db.createObjectStore('painEntries', { keyPath: 'localId' });
      store.createIndex('by-sync', 'syncStatus');
      store.createIndex('by-date', 'createdAt');
    },
  });
  return dbInstance;
}

// ── Generate local ID ──
function generateLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ── CRUD operations ──

export async function savePainEntry(data: Omit<OfflinePainEntry, 'localId' | 'syncStatus' | 'createdAt'>): Promise<OfflinePainEntry> {
  const db = await getDB();
  const entry: OfflinePainEntry = {
    ...data,
    localId: generateLocalId(),
    syncStatus: 'pending',
    createdAt: new Date().toISOString(),
  };
  await db.put('painEntries', entry);
  return entry;
}

export async function getAllPainEntries(): Promise<OfflinePainEntry[]> {
  const db = await getDB();
  return db.getAllFromIndex('painEntries', 'by-date');
}

export async function getPendingEntries(): Promise<OfflinePainEntry[]> {
  const db = await getDB();
  return db.getAllFromIndex('painEntries', 'by-sync', 'pending');
}

export async function getErrorEntries(): Promise<OfflinePainEntry[]> {
  const db = await getDB();
  return db.getAllFromIndex('painEntries', 'by-sync', 'error');
}

export async function markSynced(localId: string, serverId: string): Promise<void> {
  const db = await getDB();
  const entry = await db.get('painEntries', localId);
  if (entry) {
    entry.syncStatus = 'synced';
    entry.serverId = serverId;
    await db.put('painEntries', entry);
  }
}

export async function markError(localId: string, error: string): Promise<void> {
  const db = await getDB();
  const entry = await db.get('painEntries', localId);
  if (entry) {
    entry.syncStatus = 'error';
    entry.errorMessage = error;
    entry.lastSyncAttempt = new Date().toISOString();
    await db.put('painEntries', entry);
  }
}

export async function retryErrors(): Promise<void> {
  const db = await getDB();
  const errors = await db.getAllFromIndex('painEntries', 'by-sync', 'error');
  for (const entry of errors) {
    entry.syncStatus = 'pending';
    entry.errorMessage = undefined;
    await db.put('painEntries', entry);
  }
}

export async function getPendingCount(): Promise<number> {
  const db = await getDB();
  const pending = await db.countFromIndex('painEntries', 'by-sync', 'pending');
  const errors = await db.countFromIndex('painEntries', 'by-sync', 'error');
  return pending + errors;
}
