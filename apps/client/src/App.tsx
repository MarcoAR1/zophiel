import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import PainLog from './pages/PainLog';
import PainHistory from './pages/PainHistory';
import Symptoms from './pages/Symptoms';
import Questions from './pages/Questions';
import QualityOfLife from './pages/QualityOfLife';
import Settings from './pages/Settings';

function AppRoutes() {
  const { user, loading } = useAuth();

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

  return (
    <>
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
