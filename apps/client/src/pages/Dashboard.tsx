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
  const avgPain = stats?.average ?? 0;
  const qolScore = latestQol?.score ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col antialiased pb-8">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      {/* ══ Greeting (Stitch) ══ */}
      <div className="px-5 pt-6 mb-6">
        <h1 className="text-[28px] font-bold text-white tracking-tight">
          {t('dash_hello', { name: user?.name || '' })} 👋
        </h1>
        <p className="text-slate-400 text-base mt-1">{t('dash_summary')}</p>
      </div>

      {/* ══ Google Fit Banner (Stitch glass-card) ══ */}
      {healthStatus?.connected && healthData ? (
        <div className="mx-5 glass-card rounded-2xl p-5 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-[50px] rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-[20px]">phone_iphone</span>
              <span className="text-white font-semibold text-sm">Google Fit — Hoy</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">
              Auto-sync
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 divide-x divide-white/10">
            <div className="flex flex-col items-center gap-1 pr-2">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <span className="material-symbols-outlined text-[16px]">directions_walk</span>
                <span>Pasos</span>
              </div>
              <span className="text-xl font-bold text-white">{healthData.steps ?? '—'}</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-2">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <span className="material-symbols-outlined text-[16px]">bedtime</span>
                <span>Sueño</span>
              </div>
              <span className="text-xl font-bold text-white">
                {healthData.sleepMinutes ? `${Math.floor(healthData.sleepMinutes / 60)}h${healthData.sleepMinutes % 60}m` : '—'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 pl-2">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <span className="material-symbols-outlined text-[16px]">favorite</span>
                <span>Ritmo</span>
              </div>
              <span className="text-xl font-bold text-white">
                {healthData.heartRateAvg ?? '—'} <span className="text-xs font-normal text-slate-500">bpm</span>
              </span>
            </div>
          </div>
        </div>
      ) : !healthStatus?.connected ? (
        <Link to="/app/settings" className="mx-5 glass-card rounded-2xl p-5 mb-6 flex items-center gap-4 no-underline text-inherit hover:bg-white/5 transition-colors">
          <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
            <span className="material-symbols-outlined">fitness_center</span>
          </div>
          <div>
            <div className="text-white font-medium">Conectá Google Fit</div>
            <div className="text-slate-400 text-xs">Sueño, pasos y frecuencia cardíaca automáticos</div>
          </div>
        </Link>
      ) : null}

      {/* ══ Stats Grid (Stitch 2x2 glass cards with progress bars) ══ */}
      <div className="grid grid-cols-2 gap-4 mx-5 mb-8">
        {/* Pain Average */}
        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 p-3 opacity-5">
            <span className="material-symbols-outlined text-6xl">sentiment_dissatisfied</span>
          </div>
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">{t('dash_avg_pain')}</span>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">{stats?.average ?? '—'}</span>
            <span className="text-sm text-slate-500 ml-1">/10</span>
          </div>
          <div className="w-full bg-slate-700/30 h-1 mt-3 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${avgPain * 10}%` }} />
          </div>
        </div>

        {/* QoL Score */}
        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 p-3 opacity-5">
            <span className="material-symbols-outlined text-6xl">spa</span>
          </div>
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">{t('dash_qol')}</span>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">{latestQol?.score ?? '—'}</span>
            <span className="text-sm text-slate-500 ml-1">pts</span>
          </div>
          <div className="w-full bg-slate-700/30 h-1 mt-3 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full rounded-full" style={{ width: `${qolScore}%` }} />
          </div>
        </div>

        {/* Records */}
        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 p-3 opacity-5">
            <span className="material-symbols-outlined text-6xl">history</span>
          </div>
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">{t('dash_records')}</span>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">{stats?.count ?? 0}</span>
            <span className="text-sm text-slate-500 ml-1">esta sem.</span>
          </div>
        </div>

        {/* Pending (Stitch glass-card-accent) */}
        <div className="glass-card-accent p-4 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/30 blur-[30px] rounded-full -mr-6 -mt-6" />
          <div className="absolute bottom-0 right-0 p-3 opacity-10 text-primary">
            <span className="material-symbols-outlined text-6xl">checklist</span>
          </div>
          <span className="text-purple-300 text-xs font-medium uppercase tracking-wide">{t('dash_pending')}</span>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">{pending.length}</span>
            <span className="text-sm text-purple-200/60 ml-1">tareas</span>
          </div>
        </div>
      </div>

      {/* ══ Quick Actions (Stitch glass-card list) ══ */}
      <div className="mx-5 mb-4">
        <h3 className="text-white text-lg font-bold mb-4">{t('dash_quick_actions')}</h3>
        <div className="flex flex-col gap-3">
          {/* Log Pain */}
          <Link to="/app/pain/new" className="glass-card w-full p-4 rounded-xl flex items-center justify-between group active:scale-[0.98] transition-all duration-200 no-underline text-inherit">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">edit_square</span>
              </div>
              <div>
                <span className="text-white font-medium text-left block">{t('dash_log_pain')}</span>
                <span className="text-xs text-slate-400">{t('dash_log_pain_desc')}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-colors">chevron_right</span>
          </Link>

          {/* Log Symptoms */}
          <Link to="/app/symptoms" className="glass-card w-full p-4 rounded-xl flex items-center justify-between group active:scale-[0.98] transition-all duration-200 no-underline text-inherit">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">medical_services</span>
              </div>
              <div>
                <span className="text-white font-medium text-left block">{t('dash_log_symptoms')}</span>
                <span className="text-xs text-slate-400">{t('dash_log_symptoms_desc')}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-colors">chevron_right</span>
          </Link>

          {/* Answer Questions (Stitch highlighted with purple glow) */}
          {pending.length > 0 && (
            <Link to="/app/questions" className="glass-card w-full p-4 rounded-xl flex items-center justify-between group active:scale-[0.98] transition-all duration-200 border border-primary/50 shadow-[0_0_15px_rgba(140,37,244,0.15)] no-underline text-inherit">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors ring-2 ring-primary/20">
                  <span className="material-symbols-outlined">quiz</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium text-left">{t('dash_answer_questions', { count: pending.length })}</span>
                  <span className="text-xs text-primary font-medium">{pending.length} pendientes</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">chevron_right</span>
            </Link>
          )}

          {/* View History */}
          <Link to="/app/pain/history" className="glass-card w-full p-4 rounded-xl flex items-center justify-between group active:scale-[0.98] transition-all duration-200 no-underline text-inherit">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-slate-700/30 flex items-center justify-center text-slate-300 group-hover:bg-slate-600 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">bar_chart_4_bars</span>
              </div>
              <div>
                <span className="text-white font-medium text-left block">{t('dash_history')}</span>
                <span className="text-xs text-slate-400">{t('dash_history_desc')}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-colors">chevron_right</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
