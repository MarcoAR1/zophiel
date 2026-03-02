import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useI18n, type Locale } from '../i18n/index';
import ZophielLogo from '../components/ZophielLogo';

/* ── Stitch data arrays ── */
const FEATURES = [
  { icon: 'body_system', title: 'Mapa Corporal', desc: 'Mapeo de dolor preciso' },
  { icon: 'auto_graph', title: 'Tendencias IA', desc: 'Reportes automáticos' },
  { icon: 'cardiology', title: 'Signos Vitales', desc: 'Integración wearables' },
  { icon: 'notifications_active', title: 'Alertas', desc: 'Recordatorios de med' },
  { icon: 'wifi_off', title: 'Offline', desc: 'Funciona sin red' },
  { icon: 'lock', title: 'Seguridad', desc: 'Seguridad grado médico' },
];

const CONDITIONS = [
  { name: 'Fibromialgia', desc: 'Seguimiento detallado de puntos sensibles y fatiga.' },
  { name: 'Artritis', desc: 'Monitoreo de rigidez matutina y movilidad articular.' },
  { name: 'Migraña', desc: 'Registro de desencadenantes, aura y duración.' },
  { name: 'Dolor Lumbar', desc: 'Ejercicios sugeridos y seguimiento de postura.' },
];

const STEPS = [
  { title: 'Registra tus síntomas', desc: 'Usa el mapa corporal interactivo para marcar las zonas de dolor e intensidad en segundos.' },
  { title: 'Recibe análisis IA', desc: 'Nuestra inteligencia artificial correlaciona tus datos con el clima, actividad y sueño.' },
  { title: 'Mejora tu calidad de vida', desc: 'Obtén recomendaciones personalizadas y reportes para compartir con tu médico.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      navigate('/app', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="dark">
      {/* Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col overflow-x-hidden">

        {/* ══ Top AppBar (Stitch) ══ */}
        <header className="sticky top-0 z-50 glass-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <ZophielLogo size={28} />
            <span className="text-xl font-bold tracking-tight text-white">Zophiel</span>
          </div>
          <button
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-600 hover:border-white rounded-xl transition-colors"
            onClick={() => navigate('/app')}
          >
            {t('landing_signin')}
          </button>
        </header>

        {/* ══ Hero Section (Stitch) ══ */}
        <section className="relative px-4 pt-10 pb-12 flex flex-col items-center text-center">
          {/* Abstract Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[100px] rounded-full -z-10 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
            <span className="material-symbols-outlined text-sm">biotech</span>
            Inteligencia Médica Avanzada
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">
            Gestioná tu <br />
            <span className="text-gradient">dolor crónico</span> <br />
            con inteligencia
          </h1>

          <p className="text-slate-400 max-w-md mx-auto mb-8 text-base font-normal leading-relaxed">
            Una solución integral potenciada por IA para monitorear, entender y aliviar tus síntomas diarios.
          </p>

          <div className="flex flex-col w-full max-w-xs gap-3 sm:flex-row sm:justify-center">
            <button
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
              onClick={() => navigate('/app')}
            >
              <span>Empezar Gratis</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <a
              href="/downloads/zophiel.apk"
              download
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#1e2a23] border border-green-500/30 text-green-400 font-bold hover:bg-[#1e2a23]/80 transition-all"
            >
              <span className="material-symbols-outlined text-sm">android</span>
              <span>Android APK</span>
            </a>
          </div>
        </section>

        {/* ══ Stats Bar (Stitch 3-col glass grid) ══ */}
        <section className="px-4 pb-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="glass-card p-3 rounded-xl flex flex-col items-center text-center gap-1">
              <span className="material-symbols-outlined text-primary mb-1">accessibility_new</span>
              <span className="text-lg font-bold text-white leading-none">360°</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Mapa Corporal</span>
            </div>
            <div className="glass-card p-3 rounded-xl flex flex-col items-center text-center gap-1">
              <span className="material-symbols-outlined text-primary mb-1">monitoring</span>
              <span className="text-lg font-bold text-white leading-none">24/7</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Seguimiento</span>
            </div>
            <div className="glass-card p-3 rounded-xl flex flex-col items-center text-center gap-1">
              <span className="material-symbols-outlined text-primary mb-1">encrypted</span>
              <span className="text-lg font-bold text-white leading-none">100%</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Privacidad</span>
            </div>
          </div>
        </section>

        {/* ══ App Preview — FAITHFUL miniature of real Dashboard ══ */}
        <div className="w-full px-4 mb-12">
          <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-background-dark" style={{ fontSize: '85%' }}>
            {/* Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-[50px] rounded-full -mr-10 -mt-10" />

            <div className="p-4 pb-0">
              {/* Greeting (matches Dashboard) */}
              <div className="mb-4">
                <div className="text-lg font-bold text-white tracking-tight">Hola, Sarah 👋</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Resumen de los últimos 7 días</div>
              </div>

              {/* Google Fit Banner (matches Dashboard glass-card, 3-col) */}
              <div className="glass-card rounded-xl p-3 mb-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 blur-[30px] rounded-full -mr-8 -mt-8" />
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-white text-[14px]">phone_iphone</span>
                    <span className="text-white font-semibold text-[10px]">Google Fit — Hoy</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[8px] font-bold uppercase tracking-wider">Auto-sync</span>
                </div>
                <div className="grid grid-cols-3 gap-2 divide-x divide-white/10">
                  <div className="flex flex-col items-center gap-0.5 pr-2">
                    <div className="flex items-center gap-1 text-slate-400 text-[8px]">
                      <span className="material-symbols-outlined text-[12px]">directions_walk</span>
                      <span>Pasos</span>
                    </div>
                    <span className="text-sm font-bold text-white">8,421</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 px-2">
                    <div className="flex items-center gap-1 text-slate-400 text-[8px]">
                      <span className="material-symbols-outlined text-[12px]">bedtime</span>
                      <span>Sueño</span>
                    </div>
                    <span className="text-sm font-bold text-white">7h20m</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 pl-2">
                    <div className="flex items-center gap-1 text-slate-400 text-[8px]">
                      <span className="material-symbols-outlined text-[12px]">favorite</span>
                      <span>Ritmo</span>
                    </div>
                    <span className="text-sm font-bold text-white">72 <span className="text-[7px] text-slate-500 font-normal">bpm</span></span>
                  </div>
                </div>
              </div>

              {/* 2x2 Stats Grid (matches Dashboard exactly) */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {/* Pain Average */}
                <div className="glass-card p-3 rounded-xl relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 p-2 opacity-5"><span className="material-symbols-outlined text-3xl">sentiment_dissatisfied</span></div>
                  <span className="text-slate-400 text-[8px] font-medium uppercase tracking-wide">Dolor promedio</span>
                  <div className="mt-1">
                    <span className="text-xl font-bold text-white">4.2</span>
                    <span className="text-[8px] text-slate-500 ml-0.5">/10</span>
                  </div>
                  <div className="w-full bg-slate-700/30 h-1 mt-1.5 rounded-full overflow-hidden"><div className="bg-primary w-[42%] h-full rounded-full" /></div>
                </div>
                {/* QoL Score */}
                <div className="glass-card p-3 rounded-xl relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 p-2 opacity-5"><span className="material-symbols-outlined text-3xl">spa</span></div>
                  <span className="text-slate-400 text-[8px] font-medium uppercase tracking-wide">Calidad de vida</span>
                  <div className="mt-1">
                    <span className="text-xl font-bold text-white">74</span>
                    <span className="text-[8px] text-slate-500 ml-0.5">pts</span>
                  </div>
                  <div className="w-full bg-slate-700/30 h-1 mt-1.5 rounded-full overflow-hidden"><div className="bg-green-500 w-[74%] h-full rounded-full" /></div>
                </div>
                {/* Records */}
                <div className="glass-card p-3 rounded-xl relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 p-2 opacity-5"><span className="material-symbols-outlined text-3xl">history</span></div>
                  <span className="text-slate-400 text-[8px] font-medium uppercase tracking-wide">Registros</span>
                  <div className="mt-1">
                    <span className="text-xl font-bold text-white">12</span>
                    <span className="text-[8px] text-slate-500 ml-0.5">esta sem.</span>
                  </div>
                </div>
                {/* Pending (accent card) */}
                <div className="glass-card-accent p-3 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-10 h-10 bg-primary/30 blur-[20px] rounded-full -mr-4 -mt-4" />
                  <span className="text-purple-300 text-[8px] font-medium uppercase tracking-wide">Pendientes</span>
                  <div className="mt-1">
                    <span className="text-xl font-bold text-white">3</span>
                    <span className="text-[8px] text-purple-200/60 ml-0.5">tareas</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions (matches Dashboard) */}
              <div className="mb-1">
                <h3 className="text-white text-xs font-bold mb-2">Acciones rápidas</h3>
                <div className="flex flex-col gap-1.5">
                  <div className="glass-card p-2.5 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-blue-500/10 flex items-center justify-center"><span className="material-symbols-outlined text-blue-400 text-[14px]">edit_square</span></div>
                      <div><span className="text-[10px] text-white font-medium">Registrar dolor</span><br/><span className="text-[8px] text-slate-400">Agregá una nueva entrada</span></div>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 text-[14px]">chevron_right</span>
                  </div>
                  <div className="glass-card p-2.5 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-orange-500/10 flex items-center justify-center"><span className="material-symbols-outlined text-orange-400 text-[14px]">medical_services</span></div>
                      <div><span className="text-[10px] text-white font-medium">Registrar síntomas</span><br/><span className="text-[8px] text-slate-400">Anotá los síntomas de hoy</span></div>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 text-[14px]">chevron_right</span>
                  </div>
                  <div className="glass-card p-2.5 rounded-lg flex items-center justify-between border border-primary/30 shadow-[0_0_10px_rgba(140,37,244,0.1)]">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-primary/20 flex items-center justify-center ring-1 ring-primary/20"><span className="material-symbols-outlined text-primary text-[14px]">quiz</span></div>
                      <div><span className="text-[10px] text-white font-medium">Responder preguntas (3)</span><br/><span className="text-[8px] text-primary">3 pendientes</span></div>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[14px]">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom nav bar (matches app layout) */}
            <div className="grid grid-cols-5 border-t border-white/5 mt-2">
              <div className="flex flex-col items-center gap-0.5 py-2 text-primary">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span className="text-[7px] font-medium">Inicio</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 py-2 text-slate-500">
                <span className="material-symbols-outlined text-[16px]">favorite</span>
                <span className="text-[7px]">Dolor</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 py-2 text-slate-500">
                <span className="material-symbols-outlined text-[16px]">help</span>
                <span className="text-[7px]">Preguntas</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 py-2 text-slate-500">
                <span className="material-symbols-outlined text-[16px]">monitoring</span>
                <span className="text-[7px]">Calidad</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 py-2 text-slate-500">
                <span className="material-symbols-outlined text-[16px]">settings</span>
                <span className="text-[7px]">Config</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ Features Grid (Stitch 2-col glass cards) ══ */}
        <section className="px-4 py-8" id="features">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Características</h3>
            <span className="text-xs font-semibold text-primary">Ver todas</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div key={f.icon} className="glass-card p-4 rounded-xl flex flex-col gap-3 hover:bg-white/5 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-surface-dark flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{f.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ How It Works Timeline (Stitch border-line) ══ */}
        <section className="px-4 py-10 bg-surface-dark/30" id="how-it-works">
          <h3 className="text-xl font-bold text-white mb-8">Cómo funciona</h3>
          <div className="relative pl-4 space-y-8 border-l-2 border-slate-700 ml-2">
            {STEPS.map((s) => (
              <div key={s.title} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-background-dark border-2 border-primary" />
                <h4 className="text-lg font-bold text-white mb-1">{s.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ Conditions Horizontal Scroll (Stitch border-left cards) ══ */}
        <section className="py-10 overflow-hidden" id="conditions">
          <div className="px-4 mb-4">
            <h3 className="text-xl font-bold text-white">Especializado en</h3>
          </div>
          <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory scrollbar-hide">
            {CONDITIONS.map((c) => (
              <div key={c.name} className="snap-center shrink-0 w-64 glass-card p-5 rounded-xl border-l-4 border-l-primary">
                <h4 className="text-white font-bold text-lg mb-2">{c.name}</h4>
                <p className="text-sm text-slate-400">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA Section (Stitch gradient card) ══ */}
        <section className="px-4 py-12 mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-[#2a1e38] to-background-dark border border-white/10 p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full" />
            <h2 className="text-2xl font-bold text-white mb-3 relative z-10">Empieza tu recuperación hoy</h2>
            <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto relative z-10">
              Tomá el control de tu dolor crónico con herramientas clínicas potenciadas por inteligencia artificial.
            </p>
            <button
              className="relative z-10 w-full sm:w-auto px-8 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-colors shadow-lg shadow-primary/20"
              onClick={() => navigate('/app')}
            >
              Crear Cuenta Gratis
            </button>
          </div>
        </section>

        {/* ══ Footer (Stitch centered minimal) ══ */}
        <footer className="mt-auto border-t border-slate-800 bg-background-dark py-8 px-4">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2 text-white/50">
              <ZophielLogo size={22} />
              <span className="font-bold text-lg">Zophiel</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <button className="hover:text-white transition-colors bg-transparent border-none cursor-pointer font-[inherit]" onClick={() => navigate('/app')}>Iniciar Sesión</button>
              <a className="hover:text-white transition-colors" href="#features">Funcionalidades</a>
              <a className="hover:text-white transition-colors" href="#conditions">Condiciones</a>
            </div>
            <p className="text-xs text-slate-600 mt-2">© 2026 Zophiel Health Technologies.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
