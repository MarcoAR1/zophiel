import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useOnlineStatus, useSyncStatus } from './hooks/useOnlineStatus';
import { syncService } from './services/syncService';
import { notificationService } from './services/notificationService';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import PainLog from './pages/PainLog';
import PainHistory from './pages/PainHistory';
import Symptoms from './pages/Symptoms';
import Questions from './pages/Questions';
import QualityOfLife from './pages/QualityOfLife';
import Settings from './pages/Settings';

function SyncBanner() {
  const isOnline = useOnlineStatus();
  const { pendingCount, isSyncing } = useSyncStatus();

  if (isOnline && pendingCount === 0) return null;

  return (
    <div className={`sync-banner ${isOnline ? 'syncing' : 'offline'}`}>
      {!isOnline ? (
        <>📴 Sin conexión — los datos se guardan localmente</>
      ) : isSyncing ? (
        <>🔄 Sincronizando {pendingCount} entrada{pendingCount > 1 ? 's' : ''}...</>
      ) : pendingCount > 0 ? (
        <>⏳ {pendingCount} entrada{pendingCount > 1 ? 's' : ''} pendiente{pendingCount > 1 ? 's' : ''} de sincronizar</>
      ) : null}
    </div>
  );
}

function AppRoutes() {
  const { user, loading, updateUser } = useAuth();

  useEffect(() => {
    if (user) {
      syncService.startPeriodicSync(30_000);
      // Initialize notifications (request permission + register push)
      notificationService.init(user.id).catch(() => {});
    }
  }, [user]);

  if (loading) {
    return (
      <div className="loading" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Onboarding gate
  if (!user.onboardingCompleted) {
    return (
      <Onboarding
        userName={user.name}
        onComplete={(userData) => {
          if (userData) {
            updateUser(userData);
          } else {
            // Offline fallback — mark locally
            updateUser({ ...user, onboardingCompleted: true });
          }
        }}
      />
    );
  }

  return (
    <>
      <SyncBanner />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pain/new" element={<PainLog />} />
        <Route path="/pain/history" element={<PainHistory />} />
        <Route path="/symptoms" element={<Symptoms />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/qol" element={<QualityOfLife />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Navbar />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
