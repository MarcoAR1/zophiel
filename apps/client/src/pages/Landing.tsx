import { Link } from 'react-router-dom';
import ZophielLogo from '../components/ZophielLogo';

/**
 * Landing page — DIRECT 1:1 conversion from stitch/landing-mobile.html
 * Every class, every element, exact same structure as Stitch PRO output.
 * Only changes: class→className, <Link> for routes, ZophielLogo for icon
 */
export default function Landing() {
  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col antialiased selection:bg-primary selection:text-white">

      {/* ── Navbar ── exact from Stitch line 87-99 */}
      <nav className="sticky top-0 z-50 w-full glass-card border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <ZophielLogo size={40} variant="icon" className="rounded-xl shadow-lg shadow-primary/20" />
            <span className="text-xl font-bold tracking-tight text-white">Zophiel</span>
          </Link>
          <Link to="/auth" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors no-underline">
            Login
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── exact from Stitch line 101-139 */}
      <header className="relative overflow-hidden px-4 pt-8 pb-12">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-6 backdrop-blur-md">
            <span className="flex size-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-medium text-purple-200">Nueva Versión 2.0 Disponible</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] mb-4 text-white">
            Entendé tu <br/>
            <span className="text-gradient-primary">dolor crónico</span> <br/>
            con inteligencia
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto mb-8 font-light">
            Rastreá tus síntomas, descubrí patrones ocultos y mejorá tu calidad de vida con nuestra tecnología avanzada de análisis.
          </p>
          <Link to="/auth" className="group relative flex w-full max-w-[320px] items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 p-[1px] shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95 no-underline">
            <div className="relative flex h-12 w-full items-center justify-center rounded-xl bg-transparent px-6 transition-all group-hover:bg-white/5">
              <span className="text-base font-bold text-white">Empezar Gratis</span>
              <span className="material-symbols-outlined ml-2 text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </Link>
          {/* Stats / Trust Indicators */}
          <div className="mt-12 grid grid-cols-3 gap-3 w-full max-w-lg">
            <div className="glass-card flex flex-col items-center justify-center p-3 rounded-xl gap-2 text-center">
              <span className="material-symbols-outlined text-primary text-2xl">body_system</span>
              <span className="text-[11px] font-medium leading-tight text-slate-300">Mapa<br/>Corporal</span>
            </div>
            <div className="glass-card flex flex-col items-center justify-center p-3 rounded-xl gap-2 text-center">
              <span className="material-symbols-outlined text-primary text-2xl">monitoring</span>
              <span className="text-[11px] font-medium leading-tight text-slate-300">Seguimiento<br/>Continuo</span>
            </div>
            <div className="glass-card flex flex-col items-center justify-center p-3 rounded-xl gap-2 text-center">
              <span className="material-symbols-outlined text-primary text-2xl">encrypted</span>
              <span className="text-[11px] font-medium leading-tight text-slate-300">100%<br/>Privado</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Features Section ── exact from Stitch line 140-185 */}
      <section className="px-4 py-8 bg-gradient-to-b from-transparent to-surface-dark/30">
        <h2 className="text-2xl font-bold text-white mb-6 px-2">Todo lo que necesitas</h2>
        <div className="flex flex-col gap-4">
          {/* Feature 1 */}
          <div className="glass-card glass-card-hover rounded-2xl p-5 flex items-start gap-4 cursor-pointer group">
            <div className="size-12 rounded-xl bg-surface-dark flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">accessibility_new</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-purple-300 transition-colors">Mapa Corporal Interactivo</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Señala exactamente dónde duele con nuestro modelo 3D intuitivo y registra la intensidad.</p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="glass-card glass-card-hover rounded-2xl p-5 flex items-start gap-4 cursor-pointer group">
            <div className="size-12 rounded-xl bg-surface-dark flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">trending_up</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-purple-300 transition-colors">Tendencias y Analíticas</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Visualiza correlaciones entre clima, actividad y sueño con tus niveles de dolor.</p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="glass-card glass-card-hover rounded-2xl p-5 flex items-start gap-4 cursor-pointer group">
            <div className="size-12 rounded-xl bg-surface-dark flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">vital_signs</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-purple-300 transition-colors">Calidad de Vida</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Métricas holísticas que van más allá del dolor: ánimo, energía y capacidad funcional.</p>
            </div>
          </div>
          {/* Feature 4 */}
          <div className="glass-card glass-card-hover rounded-2xl p-5 flex items-start gap-4 cursor-pointer group">
            <div className="size-12 rounded-xl bg-surface-dark flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">cloud_off</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-purple-300 transition-colors">Funciona Offline</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Tu salud no espera a tener señal. Registra datos en cualquier momento y lugar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── exact from Stitch line 186-227 */}
      <section className="px-4 py-12 relative overflow-hidden">
        {/* Abstract decoration */}
        <div className="absolute right-0 top-1/3 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>
        <h2 className="text-2xl font-bold text-center text-white mb-10">Cómo funciona Zophiel</h2>
        <div className="relative max-w-md mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/80 via-primary/30 to-transparent"></div>
          <div className="flex flex-col gap-10">
            {/* Step 1 */}
            <div className="relative flex gap-6">
              <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-dark border-2 border-primary text-white shadow-[0_0_15px_rgba(140,37,244,0.3)]">
                <span className="font-bold text-xl">1</span>
              </div>
              <div className="flex flex-col pt-1">
                <h3 className="text-lg font-bold text-white mb-2">Registrá</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Ingresá tus síntomas diarios en segundos con nuestra interfaz rápida y amigable.</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="relative flex gap-6">
              <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-dark border-2 border-primary/60 text-white">
                <span className="font-bold text-xl">2</span>
              </div>
              <div className="flex flex-col pt-1">
                <h3 className="text-lg font-bold text-white mb-2">Entendé</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Recibí reportes semanales que identifican qué actividades desencadenan tu dolor.</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="relative flex gap-6">
              <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-dark border-2 border-primary/30 text-white">
                <span className="font-bold text-xl">3</span>
              </div>
              <div className="flex flex-col pt-1">
                <h3 className="text-lg font-bold text-white mb-2">Mejorá</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Aplicá recomendaciones personalizadas y compartí informes detallados con tu médico.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── exact from Stitch line 228-245 */}
      <section className="px-4 py-8 mb-4">
        <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden border border-primary/20">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="size-16 bg-gradient-to-tr from-primary to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-white text-3xl">favorite</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">¿Listo para entender tu dolor?</h2>
            <p className="text-slate-300 mb-8 max-w-xs mx-auto">Únite a miles de personas que están recuperando el control de su vida hoy mismo.</p>
            <Link to="/auth" className="w-full max-w-[280px] py-4 bg-white text-[#701ec2] font-bold text-lg rounded-xl shadow-lg hover:bg-slate-50 transition-colors active:scale-95 no-underline text-center inline-block">
              Crear Cuenta Gratis
            </Link>
            <p className="mt-4 text-xs text-slate-500">Sin tarjeta de crédito requerida.</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── exact from Stitch line 246-251 */}
      <footer className="mt-auto py-8 text-center px-6">
        <p className="text-xs text-slate-500 font-medium">
          © 2026 Zophiel — Hecho con <span className="text-primary inline-block align-middle text-sm">💜</span> para quienes viven con dolor
        </p>
      </footer>
    </div>
  );
}
