import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [qol, setQol] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.pain.stats(7).catch(() => null),
      api.questions.pending().catch(() => []),
      api.analytics.qualityOfLife(7).catch(() => []),
    ]).then(([s, p, q]) => {
      setStats(s);
      setPending(p || []);
      setQol(q || []);
      setLoading(false);
    });
  }, []);

  const latestQol = qol.length > 0 ? qol[qol.length - 1] : null;

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title animate-in">Hola, {user?.name} 👋</h1>
      <p className="page-subtitle animate-in">Resumen de los últimos 7 días</p>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="card stat-card animate-in">
          <div className="stat-value">{stats?.average ?? '—'}</div>
          <div className="stat-label">Dolor promedio</div>
        </div>
        <div className="card stat-card animate-in">
          <div className="stat-value">{latestQol?.score ?? '—'}</div>
          <div className="stat-label">Calidad de vida</div>
        </div>
        <div className="card stat-card animate-in">
          <div className="stat-value">{stats?.count ?? 0}</div>
          <div className="stat-label">Registros</div>
        </div>
        <div className="card stat-card animate-in">
          <div className="stat-value">{pending.length}</div>
          <div className="stat-label">Preguntas pendientes</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-header">
        <h2 className="section-title">Acciones rápidas</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <Link to="/pain/new" className="card animate-in" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span style={{ fontSize: '1.5rem' }}>📝</span>
          <div>
            <div style={{ fontWeight: 600 }}>Registrar dolor</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Agregá una nueva entrada de dolor</div>
          </div>
        </Link>

        <Link to="/symptoms" className="card animate-in" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span style={{ fontSize: '1.5rem' }}>🩹</span>
          <div>
            <div style={{ fontWeight: 600 }}>Registrar síntomas</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Anotá los síntomas que sentís hoy</div>
          </div>
        </Link>

        {pending.length > 0 && (
          <Link to="/questions" className="card card-glow animate-in" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: '1.5rem' }}>❓</span>
            <div>
              <div style={{ fontWeight: 600 }}>Responder preguntas ({pending.length})</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Tenés preguntas pendientes hoy</div>
            </div>
          </Link>
        )}

        <Link to="/pain/history" className="card animate-in" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span style={{ fontSize: '1.5rem' }}>📊</span>
          <div>
            <div style={{ fontWeight: 600 }}>Ver historial</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Gráficos y tendencias de dolor</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
