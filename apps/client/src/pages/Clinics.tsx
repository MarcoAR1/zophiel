import { Link } from 'react-router-dom';
import ZophielLogo from '../components/ZophielLogo';

/**
 * Para Clínicas — informational page for healthcare professionals
 */
export default function Clinics() {
  return (
    <div className="min-h-screen bg-background-dark text-slate-100 antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0f0b15]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 lg:h-20 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <ZophielLogo variant="icon" size={28} />
            <span className="text-white text-lg font-bold">Zophiel</span>
          </Link>
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors no-underline">← Volver al inicio</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 lg:px-8 py-16 lg:py-24">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="material-symbols-outlined text-primary text-lg">local_hospital</span>
            <span className="text-primary text-xs font-bold uppercase tracking-wider">Para profesionales</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
            Zophiel para Clínicas
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Accedé a <strong className="text-white">reportes diarios</strong> de tus pacientes con dolor crónico.
            Información objetiva y medible para tomar mejores decisiones clínicas.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <span className="material-symbols-outlined text-primary text-3xl mb-4 block">summarize</span>
            <h3 className="text-xl font-bold text-white mb-2">Reportes diarios automáticos</h3>
            <p className="text-slate-400 text-sm leading-relaxed m-0">
              Cada mañana recibí un resumen del estado de tus pacientes: niveles de dolor, zonas afectadas, tendencias y alertas.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <span className="material-symbols-outlined text-primary text-3xl mb-4 block">timeline</span>
            <h3 className="text-xl font-bold text-white mb-2">Historial completo</h3>
            <p className="text-slate-400 text-sm leading-relaxed m-0">
              Accedé al historial detallado de dolor de cada paciente. Visualizá patrones que el paciente no puede comunicar en una consulta de 15 minutos.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <span className="material-symbols-outlined text-primary text-3xl mb-4 block">description</span>
            <h3 className="text-xl font-bold text-white mb-2">Datos objetivos y medibles</h3>
            <p className="text-slate-400 text-sm leading-relaxed m-0">
              En lugar de depender de la memoria del paciente, contá con datos concretos registrados en el momento del dolor.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <span className="material-symbols-outlined text-primary text-3xl mb-4 block">lock</span>
            <h3 className="text-xl font-bold text-white mb-2">Privacidad garantizada</h3>
            <p className="text-slate-400 text-sm leading-relaxed m-0">
              Los datos del paciente están encriptados y solo se comparten con el profesional con consentimiento explícito.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="glass-card rounded-3xl p-8 lg:p-12 text-center border border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">¿Querés integrar Zophiel en tu clínica?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Estamos trabajando en la versión para profesionales de la salud. Dejanos tu email y te avisamos cuando esté lista.
            </p>
            <a href="mailto:contacto@zophiel.app" className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-primary text-white font-bold hover:bg-[#701ec2] transition-colors no-underline">
              <span className="material-symbols-outlined">mail</span>
              Escribinos
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-xs text-slate-500">© 2026 Zophiel — Hecho con 💜 para quienes viven con dolor</p>
      </footer>
    </div>
  );
}
