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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0f] font-display text-slate-100 min-h-screen flex flex-col antialiased pb-24">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      {/* ══ Top bar with greeting + notification bell (Stitch PRO) ══ */}
      <div className="px-5 pt-6 mb-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Bienvenido de nuevo</div>
            <h1 className="text-[26px] font-bold text-white tracking-tight leading-tight">
              {t('dash_hello', { name: user?.name || '' })} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">{t('dash_summary')}</p>
          </div>
          <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mt-1">
            <span className="material-symbols-outlined text-slate-400 text-[20px]">notifications</span>
          </div>
        </div>
      </div>

      {/* ══ Google Fit Banner (Stitch PRO — 3-col with trends) ══ */}
      {healthStatus?.connected && healthData ? (
        <div className="mx-5 rounded-2xl p-5 mb-5 relative overflow-hidden bg-white/[0.03] border border-white/[0.06]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/15 blur-[50px] rounded-full -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px]">phone_iphone</span>
              </div>
              <span className="text-white font-semibold text-sm">Google Fit</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">
              ● Auto-sync
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Pasos</span>
              <span className="text-xl font-bold text-white">{healthData.steps ?? '—'}</span>
              <div className="flex items-center gap-1 text-green-400 text-[10px]">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                <span>+12%</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 border-l border-white/5 pl-3">
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Sueño</span>
              <span className="text-xl font-bold text-white">
                {healthData.sleepMinutes ? `${Math.floor(healthData.sleepMinutes / 60)}h ${healthData.sleepMinutes % 60}m` : '—'}
              </span>
              <span className="text-[10px] text-slate-500">Objetivo: 8h</span>
            </div>
            <div className="flex flex-col gap-1 border-l border-white/5 pl-3">
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Pulso</span>
              <span className="text-xl font-bold text-white">
                {healthData.heartRateAvg ?? '—'} <span className="text-xs font-normal text-slate-500">bpm</span>
              </span>
              <div className="w-full bg-primary/20 h-1 mt-1 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min((healthData.heartRateAvg || 72) / 120 * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      ) : !healthStatus?.connected ? (
        <Link to="/app/settings" className="mx-5 rounded-2xl p-5 mb-5 flex items-center gap-4 no-underline text-inherit hover:bg-white/5 transition-colors bg-white/[0.03] border border-white/[0.06]">
          <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
            <span className="material-symbols-outlined">fitness_center</span>
          </div>
          <div>
            <div className="text-white font-medium">Conectá Google Fit</div>
            <div className="text-slate-500 text-xs">Sueño, pasos y frecuencia cardíaca automáticos</div>
          </div>
        </Link>
      ) : null}

      {/* ══ Stats Grid (Stitch PRO — 2x2 with icons & indicators) ══ */}
      <div className="grid grid-cols-2 gap-3 mx-5 mb-6">
        {/* Pain Average */}
        <div className="rounded-2xl p-4 flex flex-col justify-between h-[120px] relative overflow-hidden bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="size-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[16px]">sentiment_dissatisfied</span>
            </div>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Dolor Promedio</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-white">{stats?.average ?? '—'}</span>
              <span className="text-xs text-slate-500">/10</span>
            </div>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${avgPain * 10}%` }} />
          </div>
        </div>

        {/* QoL Score */}
        <div className="rounded-2xl p-4 flex flex-col justify-between h-[120px] relative overflow-hidden bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-400 text-[16px]">spa</span>
            </div>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Calidad de Vida</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-white">{latestQol?.score ?? '—'}</span>
              <span className="text-xs text-slate-500">pts</span>
            </div>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${qolScore}%` }} />
          </div>
        </div>

        {/* Records */}
        <div className="rounded-2xl p-4 flex flex-col justify-between h-[120px] relative overflow-hidden bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="size-8 rounded-lg bg-slate-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-400 text-[16px]">history</span>
            </div>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Registros</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-white">{stats?.count ?? 0}</span>
              <span className="text-xs text-slate-500">esta semana</span>
            </div>
          </div>
        </div>

        {/* Pending — accent glow */}
        <div className="rounded-2xl p-4 flex flex-col justify-between h-[120px] relative overflow-hidden bg-primary/[0.06] border border-primary/20">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 blur-[30px] rounded-full -mr-6 -mt-6" />
          <div className="flex items-center justify-between">
            <div className="size-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[16px]">checklist</span>
            </div>
            <span className="text-[10px] text-primary font-bold">Pendientes</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-white">{pending.length}</span>
              <span className="text-xs text-primary/60">tareas hoy</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Quick Actions (Stitch PRO — cards with sublabels) ══ */}
      <div className="mx-5">
        <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] mb-3">Acciones Rápidas</h3>
        <div className="flex flex-col gap-2.5">
          {/* Log Pain */}
          <Link to="/app/pain/new" className="rounded-xl p-4 flex items-center justify-between group active:scale-[0.98] transition-all duration-200 no-underline text-inherit bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]">
            <div className="flex items-center gap-3.5">
              <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <span className="material-symbols-outlined text-[20px]">edit_square</span>
              </div>
              <div>
                <span className="text-white font-semibold text-sm block">{t('dash_log_pain')}</span>
                <span className="text-[11px] text-slate-500">¿Cómo te sentís ahora?</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-600 text-[18px] group-hover:text-white transition-colors">chevron_right</span>
          </Link>

          {/* Log Symptoms */}
          <Link to="/app/symptoms" className="rounded-xl p-4 flex items-center justify-between group active:scale-[0.98] transition-all duration-200 no-underline text-inherit bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]">
            <div className="flex items-center gap-3.5">
              <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                <span className="material-symbols-outlined text-[20px]">medical_services</span>
              </div>
              <div>
                <span className="text-white font-semibold text-sm block">{t('dash_log_symptoms')}</span>
                <span className="text-[11px] text-slate-500">Nuevos o recurrentes</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-600 text-[18px] group-hover:text-white transition-colors">chevron_right</span>
          </Link>

          {/* Answer Questions — highlighted purple */}
          {pending.length > 0 && (
            <Link to="/app/questions" className="rounded-xl p-4 flex items-center justify-between group active:scale-[0.98] transition-all duration-200 no-underline text-inherit bg-primary/[0.08] border border-primary/30 shadow-[0_0_20px_rgba(140,37,244,0.08)]">
              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary ring-1 ring-primary/20">
                  <span className="material-symbols-outlined text-[20px]">quiz</span>
                </div>
                <div>
                  <span className="text-white font-semibold text-sm block">Responder preguntas</span>
                  <span className="text-[11px] text-primary">{pending.length} pendientes de hoy</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-[18px]">chevron_right</span>
            </Link>
          )}

          {/* View History */}
          <Link to="/app/pain/history" className="rounded-xl p-4 flex items-center justify-between group active:scale-[0.98] transition-all duration-200 no-underline text-inherit bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]">
            <div className="flex items-center gap-3.5">
              <div className="size-10 rounded-xl bg-slate-700/30 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-[20px]">bar_chart_4_bars</span>
              </div>
              <div>
                <span className="text-white font-semibold text-sm block">{t('dash_history')}</span>
                <span className="text-[11px] text-slate-500">Revisá tus entradas anteriores</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-600 text-[18px] group-hover:text-white transition-colors">chevron_right</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
