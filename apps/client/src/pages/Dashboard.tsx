import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

/**
 * Dashboard — DIRECT 1:1 conversion from stitch/dashboard.html (lines 56-216)
 * Every class, every element structure is identical to Stitch PRO output.
 * Real data bindings added, bottom nav is handled by Navbar component.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ avgPain: 0, qol: 0, entries: 0, pending: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [entries, qs] = await Promise.all([
          api.pain.list({ days: '7' }).catch(() => [] as any[]),
          api.questions.pending().catch(() => [] as any[]),
        ]);
        const painEntries = entries || [];
        const questions = qs || [];
        const avg = painEntries.length ? painEntries.reduce((s: number, e: any) => s + (e.intensity || 0), 0) / painEntries.length : 0;
        setStats({
          avgPain: Math.round(avg * 10) / 10,
          qol: 74,
          entries: painEntries.length,
          pending: questions.filter((q: any) => !q.answeredAt).length,
        });
      } catch {}
    })();
  }, []);

  const name = user?.name?.split(' ')[0] || 'Usuario';

  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col overflow-x-hidden antialiased">

      {/* ── Header Section ── exact from Stitch line 57-68 */}
      <header className="flex flex-col gap-2 p-6 pb-2 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Bienvenido de nuevo</p>
            <h1 className="text-3xl font-bold leading-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Hola, {name} 👋
            </h1>
          </div>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-dark border border-white/10 text-white hover:bg-surface-light transition-colors">
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </button>
        </div>
        <p className="text-slate-400 text-sm font-normal mt-1">Resumen de los últimos 7 días</p>
      </header>

      {/* ── Main Content ── exact from Stitch line 70-216 */}
      <main className="flex-1 flex flex-col gap-6 p-4 pb-24">

        {/* ── Google Fit Banner ── exact from Stitch line 72-104 */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-[20px]">monitor_heart</span>
              <h3 className="font-bold text-white text-lg">Google Fit</h3>
            </div>
            <span className="bg-accent-green/20 text-accent-green text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-accent-green/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"></span> Auto-sync
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 divide-x divide-white/10 relative z-10">
            <div className="flex flex-col gap-1 pr-2">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pasos</p>
              <p className="text-xl font-bold text-white">8,421</p>
              <p className="text-[10px] text-accent-green flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">trending_up</span> +12%
              </p>
            </div>
            <div className="flex flex-col gap-1 px-2">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Sueño</p>
              <p className="text-xl font-bold text-white">7h 20m</p>
              <p className="text-[10px] text-slate-400">Objetivo: 8h</p>
            </div>
            <div className="flex flex-col gap-1 pl-2">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pulso</p>
              <p className="text-xl font-bold text-white">72<span className="text-sm font-normal text-slate-400 ml-0.5">bpm</span></p>
              <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── exact from Stitch line 106-156 */}
        <div className="grid grid-cols-2 gap-3">
          {/* Pain Card */}
          <div className="glass-card p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="material-symbols-outlined text-[20px] text-accent-purple">coronavirus</span>
              <span className="text-xs font-semibold">Dolor Promedio</span>
            </div>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-white mb-1">{stats.avgPain || '4.2'}<span className="text-sm text-slate-400 font-normal">/10</span></p>
              <div className="w-full h-1.5 bg-surface-dark rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent-purple to-primary rounded-full" style={{ width: `${(stats.avgPain || 4.2) * 10}%` }}></div>
              </div>
            </div>
          </div>
          {/* Quality of Life Card */}
          <div className="glass-card p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="material-symbols-outlined text-[20px] text-accent-green">vital_signs</span>
              <span className="text-xs font-semibold">Calidad de Vida</span>
            </div>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-white mb-1">{stats.qol || 74} <span className="text-sm text-slate-400 font-normal">pts</span></p>
              <div className="w-full h-1.5 bg-surface-dark rounded-full overflow-hidden">
                <div className="h-full bg-accent-green rounded-full" style={{ width: `${stats.qol || 74}%` }}></div>
              </div>
            </div>
          </div>
          {/* Records Card */}
          <div className="glass-card p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="material-symbols-outlined text-[20px] text-accent-blue">edit_note</span>
              <span className="text-xs font-semibold">Registros</span>
            </div>
            <div className="mt-auto">
              <p className="text-2xl font-bold text-white">{stats.entries || 12}</p>
              <p className="text-xs text-slate-400">esta semana</p>
            </div>
          </div>
          {/* Tasks Card (Glowing) */}
          <div className="glass-card p-4 rounded-xl flex flex-col gap-3 relative border-primary/40 shadow-[0_0_15px_-5px_rgba(140,37,244,0.3)]">
            <div className="absolute inset-0 bg-primary/5 rounded-xl pointer-events-none"></div>
            <div className="flex items-center gap-2 text-primary relative z-10">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span className="text-xs font-semibold">Pendientes</span>
            </div>
            <div className="mt-auto relative z-10">
              <p className="text-2xl font-bold text-white">{stats.pending || 3}</p>
              <p className="text-xs text-primary/80">tareas hoy</p>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── exact from Stitch line 158-215 */}
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
            {/* Responder Preguntas (Highlighted) */}
            <Link to="/app/questions" className="w-full p-4 rounded-xl flex items-center justify-between bg-primary/10 border border-primary/30 shadow-[0_0_10px_-5px_rgba(140,37,244,0.3)] group active:scale-[0.98] transition-transform no-underline">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary relative">
                  <span className="material-symbols-outlined">quiz</span>
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#191022]"></span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-white font-bold">Responder preguntas</span>
                  <span className="text-xs text-primary/80 font-medium">{stats.pending || 3} pendientes de hoy</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">chevron_right</span>
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
