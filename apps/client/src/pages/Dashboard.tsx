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
        <div className="card card-health animate-in">
          <div className="card-health-header">
            <span className="card-health-title">📱 Google Fit — Hoy</span>
            <span className="card-health-badge">Auto-sync</span>
          </div>
          <div className="health-metrics">
            <div>
              <div className="health-metric-value">{healthData.steps ?? '—'}</div>
              <div className="health-metric-label">🚶 Pasos</div>
            </div>
            <div>
              <div className="health-metric-value">
                {healthData.sleepMinutes ? `${Math.floor(healthData.sleepMinutes / 60)}h${healthData.sleepMinutes % 60}m` : '—'}
              </div>
              <div className="health-metric-label">😴 Sueño</div>
            </div>
            <div>
              <div className="health-metric-value">{healthData.heartRateAvg ?? '—'}</div>
              <div className="health-metric-label">❤️ FC prom</div>
            </div>
          </div>
        </div>
      ) : !healthStatus?.connected ? (
        <Link to="/app/settings" className="card card-connect animate-in">
          <span className="card-connect-icon">🏃</span>
          <div>
            <div className="card-connect-title">Conectá Google Fit</div>
            <div className="card-connect-desc">Sueño, pasos y frecuencia cardíaca automáticos</div>
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

      <div className="action-list">
        <Link to="/app/pain/new" className="action-item animate-in">
          <span className="action-item-icon">📝</span>
          <div className="action-item-text">
            <div className="action-item-title">{t('dash_log_pain')}</div>
            <div className="action-item-desc">{t('dash_log_pain_desc')}</div>
          </div>
          <span className="action-item-arrow">›</span>
        </Link>

        <Link to="/app/symptoms" className="action-item animate-in">
          <span className="action-item-icon">🩹</span>
          <div className="action-item-text">
            <div className="action-item-title">{t('dash_log_symptoms')}</div>
            <div className="action-item-desc">{t('dash_log_symptoms_desc')}</div>
          </div>
          <span className="action-item-arrow">›</span>
        </Link>

        {pending.length > 0 && (
          <Link to="/app/questions" className="action-item action-item-glow animate-in">
            <span className="action-item-icon">❓</span>
            <div className="action-item-text">
              <div className="action-item-title">{t('dash_answer_questions', { count: pending.length })}</div>
              <div className="action-item-desc">{t('dash_answer_questions_desc')}</div>
            </div>
            <span className="action-item-arrow">›</span>
          </Link>
        )}

        <Link to="/app/pain/history" className="action-item animate-in">
          <span className="action-item-icon">📊</span>
          <div className="action-item-text">
            <div className="action-item-title">{t('dash_history')}</div>
            <div className="action-item-desc">{t('dash_history_desc')}</div>
          </div>
          <span className="action-item-arrow">›</span>
        </Link>
      </div>
    </div>
  );
}
