import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { I18nProvider } from './i18n/index';
import { useOnlineStatus, useSyncStatus } from './hooks/useOnlineStatus';
import { syncService } from './services/syncService';
import { notificationService } from './services/notificationService';
import Navbar, { Sidebar } from './components/Navbar';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import PainLog from './pages/PainLog';
import PainHistory from './pages/PainHistory';
import Symptoms from './pages/Symptoms';
import Questions from './pages/Questions';
import QualityOfLife from './pages/QualityOfLife';
import Settings from './pages/Settings';
import Clinics from './pages/Clinics';
import CaseStudies from './pages/CaseStudies';
import About from './pages/About';
import Blog from './pages/Blog';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Security from './pages/Security';

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

function AuthenticatedApp() {
  const { user, loading, updateUser } = useAuth();

  useEffect(() => {
    if (user) {
      syncService.startPeriodicSync(30_000);
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
            updateUser({ ...user, onboardingCompleted: true });
          }
        }}
      />
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content lg:ml-[280px]">
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
      </div>
      <Navbar />
    </div>
  );
}

import { Capacitor } from '@capacitor/core';

export default function App() {
  const isNative = Capacitor.isNativePlatform();

  return (
    <I18nProvider>
      <AuthProvider>
        <Routes>
          {/* On native (APK), skip Landing — go directly to auth/dashboard */}
          <Route path="/" element={isNative ? <Navigate to="/app" replace /> : <Landing />} />
          <Route path="/clinics" element={<Clinics />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/security" element={<Security />} />
          <Route path="/app/*" element={<AuthenticatedApp />} />
          <Route path="*" element={<Navigate to={isNative ? "/app" : "/"} replace />} />
        </Routes>
      </AuthProvider>
    </I18nProvider>
  );
}
