import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

/**
 * Dashboard — 100% real data, zero hardcoded values.
 * Fetches from: pain.list, questions.pending, health.status, health.getData, analytics.qualityOfLife
 */
export default function Dashboard() {
  const { user } = useAuth();

  // ── Real data state ──
  const [stats, setStats] = useState({ avgPain: 0, entries: 0, pending: 0 });
  const [qol, setQol] = useState<number | null>(null);
  const [healthStatus, setHealthStatus] = useState<{ connected: boolean; provider: string | null }>({ connected: false, provider: null });
  const [healthData, setHealthData] = useState<{
    steps: number | null;
    sleepMinutes: number | null;
    heartRateAvg: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [entries, qs, hStatus, hData, qolData] = await Promise.all([
          api.pain.list({ days: '7' }).catch(() => [] as any[]),
          api.questions.pending().catch(() => [] as any[]),
          api.health.status().catch(() => ({ connected: false, provider: null })),
          api.health.getData(undefined, 7).catch(() => null),
          api.analytics.qualityOfLife(7).catch(() => null),
        ]);

        const painEntries = entries || [];
        const questions = qs || [];
        const avg = painEntries.length
          ? painEntries.reduce((s: number, e: any) => s + (e.intensity || 0), 0) / painEntries.length
          : 0;

        setStats({
          avgPain: Math.round(avg * 10) / 10,
          entries: painEntries.length,
          pending: questions.filter((q: any) => !q.answeredAt).length,
        });

        setHealthStatus({
          connected: hStatus?.connected || false,
          provider: hStatus?.provider || null,
        });

        // Health data: aggregate last 7 days or use today's single record
        if (hData) {
          if (Array.isArray(hData)) {
            // Multiple days — aggregate
            const totalSteps = hData.reduce((sum: number, d: any) => sum + (d.steps || 0), 0);
            const sleepDays = hData.filter((d: any) => d.sleepMinutes != null);
            const avgSleep = sleepDays.length ? sleepDays.reduce((s: number, d: any) => s + d.sleepMinutes, 0) / sleepDays.length : null;
            const hrDays = hData.filter((d: any) => d.heartRateAvg != null);
            const avgHR = hrDays.length ? Math.round(hrDays.reduce((s: number, d: any) => s + d.heartRateAvg, 0) / hrDays.length) : null;
            setHealthData({
              steps: totalSteps > 0 ? Math.round(totalSteps / hData.length) : null,
              sleepMinutes: avgSleep ? Math.round(avgSleep) : null,
              heartRateAvg: avgHR,
            });
          } else {
            // Single record
            setHealthData({
              steps: hData.steps,
              sleepMinutes: hData.sleepMinutes,
              heartRateAvg: hData.heartRateAvg,
            });
          }
        }

        // QoL — the QoL endpoint returns array of daily scores
        if (qolData && Array.isArray(qolData) && qolData.length > 0) {
          const lastScore = qolData[qolData.length - 1];
          setQol(lastScore?.score != null ? Math.round(lastScore.score) : null);
        } else if (qolData && typeof qolData === 'object' && 'score' in qolData) {
          setQol(Math.round(qolData.score as number));
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const name = user?.name?.split(' ')[0] || 'Usuario';

  // ── Helpers ──
  const formatSteps = (n: number) => n.toLocaleString('es-AR');
  const formatSleep = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col overflow-x-hidden antialiased">

      {/* ── Header Section ── */}
      <header className="flex flex-col gap-2 p-6 pb-2 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Bienvenido de nuevo</p>
            <h1 className="text-3xl font-bold leading-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Hola, {name} 👋
            </h1>
          </div>
          <Link to="/app/settings" className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-dark border border-white/10 text-white hover:bg-surface-light transition-colors no-underline">
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </Link>
        </div>
        <p className="text-slate-400 text-sm font-normal mt-1">Resumen de los últimos 7 días</p>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col gap-6 p-4 pb-24">

        {/* ── Google Fit / Health Banner ── */}
        {healthStatus.connected ? (
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white text-[20px]">monitor_heart</span>
                <h3 className="font-bold text-white text-lg">
                  {healthStatus.provider === 'google_fit' ? 'Google Fit' : 'Health Connect'}
                </h3>
              </div>
              <span className="bg-accent-green/20 text-accent-green text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-accent-green/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"></span> Conectado
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 divide-x divide-white/10 relative z-10">
              <div className="flex flex-col gap-1 pr-2">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pasos</p>
                <p className="text-xl font-bold text-white">
                  {healthData?.steps != null ? formatSteps(healthData.steps) : '—'}
                </p>
                <p className="text-[10px] text-slate-500">promedio diario</p>
              </div>
              <div className="flex flex-col gap-1 px-2">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Sueño</p>
                <p className="text-xl font-bold text-white">
                  {healthData?.sleepMinutes != null ? formatSleep(healthData.sleepMinutes) : '—'}
                </p>
                <p className="text-[10px] text-slate-500">promedio</p>
              </div>
              <div className="flex flex-col gap-1 pl-2">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pulso</p>
                <p className="text-xl font-bold text-white">
                  {healthData?.heartRateAvg != null ? (
                    <>{healthData.heartRateAvg}<span className="text-sm font-normal text-slate-400 ml-0.5">bpm</span></>
                  ) : '—'}
                </p>
                {healthData?.heartRateAvg != null && (
                  <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(100, (healthData.heartRateAvg / 120) * 100)}%` }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── Not Connected: show connect prompt ── */
          <Link to="/app/settings" className="glass-card rounded-2xl p-5 flex items-center gap-4 group no-underline">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[24px]">monitor_heart</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-base mb-0.5">Conectar Google Fit</h3>
              <p className="text-slate-400 text-xs m-0">Sincronizá pasos, sueño y pulso automáticamente</p>
            </div>
            <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-colors">chevron_right</span>
          </Link>
        )}

        {/* ── Stats Grid ── real data only */}
        <div className="grid grid-cols-2 gap-3">
          {/* Pain Card */}
          <div className="glass-card p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="material-symbols-outlined text-[20px] text-accent-purple">coronavirus</span>
              <span className="text-xs font-semibold">Dolor Promedio</span>
            </div>
            <div className="mt-auto">
              {stats.entries > 0 ? (
                <>
                  <p className="text-2xl font-bold text-white mb-1">{stats.avgPain}<span className="text-sm text-slate-400 font-normal">/10</span></p>
                  <div className="w-full h-1.5 bg-surface-dark rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent-purple to-primary rounded-full" style={{ width: `${stats.avgPain * 10}%` }}></div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500">Sin registros aún</p>
              )}
            </div>
          </div>
          {/* Quality of Life Card */}
          <div className="glass-card p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="material-symbols-outlined text-[20px] text-accent-green">vital_signs</span>
              <span className="text-xs font-semibold">Calidad de Vida</span>
            </div>
            <div className="mt-auto">
              {qol != null ? (
                <>
                  <p className="text-2xl font-bold text-white mb-1">{qol} <span className="text-sm text-slate-400 font-normal">pts</span></p>
                  <div className="w-full h-1.5 bg-surface-dark rounded-full overflow-hidden">
                    <div className="h-full bg-accent-green rounded-full" style={{ width: `${qol}%` }}></div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500">Sin datos aún</p>
              )}
            </div>
          </div>
          {/* Records Card */}
          <div className="glass-card p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="material-symbols-outlined text-[20px] text-accent-blue">edit_note</span>
              <span className="text-xs font-semibold">Registros</span>
            </div>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-white">{stats.entries}</p>
              <p className="text-xs text-slate-400">esta semana</p>
            </div>
          </div>
          {/* Tasks Card */}
          <div className={`glass-card p-4 rounded-xl flex flex-col gap-3 relative ${stats.pending > 0 ? 'border-primary/40 shadow-[0_0_15px_-5px_rgba(140,37,244,0.3)]' : ''}`}>
            {stats.pending > 0 && <div className="absolute inset-0 bg-primary/5 rounded-xl pointer-events-none"></div>}
            <div className={`flex items-center gap-2 relative z-10 ${stats.pending > 0 ? 'text-primary' : 'text-slate-300'}`}>
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span className="text-xs font-semibold">Pendientes</span>
            </div>
            <div className="mt-auto relative z-10">
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
              <p className={`text-xs ${stats.pending > 0 ? 'text-primary/80' : 'text-slate-400'}`}>
                {stats.pending > 0 ? 'tareas hoy' : 'todo al día ✓'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3 px-1">Acciones Rápidas</h3>
          <div className="flex flex-col gap-2">
            {/* Registrar Dolor */}
            <Link to="/app/pain/new" className="glass-card w-full p-4 rounded-xl flex items-center justify-between group active:scale-[0.98] transition-transform no-underline">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                  <span className="material-symbols-outlined">medication</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium">Registrar dolor</span>
                  <span className="text-xs text-slate-400">¿Cómo te sientes ahora?</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-colors">chevron_right</span>
            </Link>
            {/* Registrar Síntomas */}
            <Link to="/app/symptoms" className="glass-card w-full p-4 rounded-xl flex items-center justify-between group active:scale-[0.98] transition-transform no-underline">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent-orange/10 flex items-center justify-center text-accent-orange">
                  <span className="material-symbols-outlined">thermometer</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium">Registrar síntomas</span>
                  <span className="text-xs text-slate-400">Nuevos o recurrentes</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-colors">chevron_right</span>
            </Link>
            {/* Responder Preguntas */}
            <Link to="/app/questions" className={`w-full p-4 rounded-xl flex items-center justify-between group active:scale-[0.98] transition-transform no-underline ${
              stats.pending > 0
                ? 'bg-primary/10 border border-primary/30 shadow-[0_0_10px_-5px_rgba(140,37,244,0.3)]'
                : 'glass-card'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
                  stats.pending > 0 ? 'bg-primary/20 text-primary' : 'bg-slate-700/30 text-slate-400'
                }`}>
                  <span className="material-symbols-outlined">quiz</span>
                  {stats.pending > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#191022]"></span>
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span className={`font-medium ${stats.pending > 0 ? 'text-white font-bold' : 'text-white'}`}>Responder preguntas</span>
                  <span className={`text-xs font-medium ${stats.pending > 0 ? 'text-primary/80' : 'text-slate-400'}`}>
                    {stats.pending > 0 ? `${stats.pending} pendientes de hoy` : 'Ninguna pendiente'}
                  </span>
                </div>
              </div>
              <span className={`material-symbols-outlined transition-colors ${
                stats.pending > 0 ? 'text-primary group-hover:text-white' : 'text-slate-500 group-hover:text-white'
              }`}>chevron_right</span>
            </Link>
            {/* Ver Historial */}
            <Link to="/app/pain/history" className="glass-card w-full p-4 rounded-xl flex items-center justify-between group active:scale-[0.98] transition-transform no-underline">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-700/30 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">history</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium">Ver historial</span>
                  <span className="text-xs text-slate-400">Revisa tus entradas anteriores</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-colors">chevron_right</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
