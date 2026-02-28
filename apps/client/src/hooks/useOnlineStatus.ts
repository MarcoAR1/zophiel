import { useState, useEffect, useSyncExternalStore } from 'react';
import { syncService, type SyncStatus } from '../services/syncService';

// ── Online status ──
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}

// ── Sync status ──
export function useSyncStatus(): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>({
    isSyncing: false,
    pendingCount: 0,
    lastSyncAt: null,
    lastError: null,
  });

  useEffect(() => {
    return syncService.subscribe(setStatus);
  }, []);

  return status;
}
