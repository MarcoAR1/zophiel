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

        {/* ══ App Visualization (Stitch) ══ */}
        <div className="w-full px-4 mb-12">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10" />
            <img src="/dashboard-preview.png" alt="Zophiel Dashboard" className="w-full h-full object-cover" />
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
              Únete a más de 50,000 personas gestionando su dolor de forma inteligente.
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
