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
      <h1 className="page-title animate-in">{t('dash_hello', { name: user?.name || '' })}</h1>
      <p className="page-subtitle animate-in">{t('dash_summary')}</p>

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
