import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n/index';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [stats, setStats] = useState<any>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [qol, setQol] = useState<any[]>([]);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.pain.stats(7).catch(() => null),
      api.questions.pending().catch(() => []),
      api.analytics.qualityOfLife(7).catch(() => []),
      api.health.status().catch(() => null),
      api.health.getData().catch(() => null),
    ]).then(([s, p, q, hs, hd]) => {
      setStats(s);
      setPending(p || []);
      setQol(q || []);
      setHealthStatus(hs);
      setHealthData(hd);
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
      <h1 className="page-title animate-in">{t('dash_hello', { name: user?.name || '' })}</h1>
      <p className="page-subtitle animate-in">{t('dash_summary')}</p>

      {/* Health Data Banner */}
      {healthStatus?.connected && healthData ? (
        <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(34,197,94,0.08))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
            <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>📱 Google Fit — Hoy</span>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Auto-sync</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-sm)', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>{healthData.steps ?? '—'}</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>🚶 Pasos</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>
                {healthData.sleepMinutes ? `${Math.floor(healthData.sleepMinutes / 60)}h${healthData.sleepMinutes % 60}m` : '—'}
              </div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>😴 Sueño</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>{healthData.heartRateAvg ?? '—'}</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>❤️ FC prom</div>
            </div>
          </div>
        </div>
      ) : !healthStatus?.connected ? (
        <Link to="/app/settings" className="card animate-in" style={{ textDecoration: 'none', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)', background: 'linear-gradient(135deg, rgba(66,133,244,0.08), rgba(52,168,83,0.08))', border: '1px solid rgba(66,133,244,0.15)' }}>
          <span style={{ fontSize: '1.5rem' }}>🏃</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>Conectá Google Fit</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Sueño, pasos y frecuencia cardíaca automáticos</div>
          </div>
        </Link>
      ) : null}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="card stat-card animate-in">
          <div className="stat-value">{stats?.average ?? '—'}</div>
          <div className="stat-label">{t('dash_avg_pain')}</div>
        </div>
        <div className="card stat-card animate-in">
          <div className="stat-value">{latestQol?.score ?? '—'}</div>
          <div className="stat-label">{t('dash_qol')}</div>
        </div>
        <div className="card stat-card animate-in">
          <div className="stat-value">{stats?.count ?? 0}</div>
          <div className="stat-label">{t('dash_records')}</div>
        </div>
        <div className="card stat-card animate-in">
          <div className="stat-value">{pending.length}</div>
          <div className="stat-label">{t('dash_pending')}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-header">
        <h2 className="section-title">{t('dash_quick_actions')}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <Link to="/app/pain/new" className="card animate-in" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span style={{ fontSize: '1.5rem' }}>📝</span>
          <div>
            <div style={{ fontWeight: 600 }}>{t('dash_log_pain')}</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{t('dash_log_pain_desc')}</div>
          </div>
        </Link>

        <Link to="/app/symptoms" className="card animate-in" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span style={{ fontSize: '1.5rem' }}>🩹</span>
          <div>
            <div style={{ fontWeight: 600 }}>{t('dash_log_symptoms')}</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{t('dash_log_symptoms_desc')}</div>
          </div>
        </Link>

        {pending.length > 0 && (
          <Link to="/app/questions" className="card card-glow animate-in" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: '1.5rem' }}>❓</span>
            <div>
              <div style={{ fontWeight: 600 }}>{t('dash_answer_questions', { count: pending.length })}</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{t('dash_answer_questions_desc')}</div>
            </div>
          </Link>
        )}

        <Link to="/app/pain/history" className="card animate-in" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span style={{ fontSize: '1.5rem' }}>📊</span>
          <div>
            <div style={{ fontWeight: 600 }}>{t('dash_history')}</div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{t('dash_history_desc')}</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
