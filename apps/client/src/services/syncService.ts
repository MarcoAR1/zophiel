import { getPendingEntries, getErrorEntries, markSynced, markError, retryErrors } from './offlineDb';
import { api } from './api';

type SyncListener = (status: SyncStatus) => void;

export interface SyncStatus {
  isSyncing: boolean;
  pendingCount: number;
  lastSyncAt: string | null;
  lastError: string | null;
}

class SyncService {
  private listeners: Set<SyncListener> = new Set();
  private syncing = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private status: SyncStatus = {
    isSyncing: false,
    pendingCount: 0,
    lastSyncAt: null,
    lastError: null,
  };

  constructor() {
    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.onOnline());
      window.addEventListener('offline', () => this.notify());
    }
  }

  subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.status);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn({ ...this.status }));
  }

  private async onOnline() {
    // When coming back online, retry errors first then sync pending
    await retryErrors();
    this.syncNow();
  }

  /** Trigger an immediate sync attempt */
  async syncNow() {
    if (this.syncing || !navigator.onLine) return;
    this.syncing = true;
    this.status.isSyncing = true;
    this.notify();

    try {
      const pending = await getPendingEntries();
      this.status.pendingCount = pending.length;

      for (const entry of pending) {
        try {
          const result = await api.pain.create({
            intensity: entry.intensity,
            bodyRegion: entry.bodyRegion,
            painTemporality: entry.painTemporality,
            moodStates: entry.moodStates,
            musclePainLevels: entry.musclePainLevels,
            notes: entry.notes,
          });
          await markSynced(entry.localId, result.id);
          this.status.pendingCount--;
          this.notify();
        } catch (err: any) {
          await markError(entry.localId, err.message || 'Sync failed');
          this.status.lastError = err.message;
        }
      }

      this.status.lastSyncAt = new Date().toISOString();
    } catch (err: any) {
      this.status.lastError = err.message;
    } finally {
      this.syncing = false;
      this.status.isSyncing = false;
      this.notify();
    }
  }

  /** Schedule a sync with delay (debounce) */
  scheduleSync(delayMs = 2000) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.syncNow(), delayMs);
  }

  /** Start periodic background sync */
  startPeriodicSync(intervalMs = 30_000) {
    this.syncNow(); // Immediate first sync
    setInterval(() => {
      if (navigator.onLine) this.syncNow();
    }, intervalMs);
  }
}

// Singleton
export const syncService = new SyncService();
