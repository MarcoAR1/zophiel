import { Link } from 'react-router-dom';
import ZophielLogo from '../components/ZophielLogo';

/**
 * Sobre Nosotros — Team: Marco + Mariana, mission statement
 */
export default function About() {
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
        {/* Misión */}
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
            Sobre Nosotros
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Zophiel nació de una necesidad real: tener un lugar cómodo para registrar el dolor crónico 
            y generar una <strong className="text-white">fuente real de información médica medible</strong> a lo largo del tiempo.
          </p>
        </div>

        {/* Mission Card */}
        <div className="glass-card rounded-3xl p-8 lg:p-12 border border-primary/20 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 text-center">
            <span className="material-symbols-outlined text-primary text-4xl mb-4 block">favorite</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">Nuestra misión</h2>
            <p className="text-slate-300 text-lg max-w-xl mx-auto leading-relaxed m-0">
              Crear un espacio donde cada persona con dolor crónico pueda registrar sus síntomas de forma 
              simple y rápida, construyendo un historial médico confiable que ayude tanto al paciente 
              como al profesional de salud a tomar decisiones informadas.
            </p>
          </div>
        </div>

        {/* Team */}
        <h2 className="text-2xl font-bold text-white text-center mb-10">El equipo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Marco */}
          <div className="glass-card rounded-2xl p-8 border border-white/5 text-center">
            <div className="size-20 rounded-full bg-gradient-to-br from-primary to-purple-900 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
              <span className="text-3xl font-black text-white">M</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Marco Antonio Rivero</h3>
            <p className="text-primary text-sm font-medium mb-4">Co-Founder & Developer</p>
            <p className="text-slate-400 text-sm leading-relaxed m-0">
              Desarrollador full-stack a cargo de la arquitectura técnica, 
              el diseño de la experiencia de usuario y toda la implementación de Zophiel.
            </p>
          </div>

          {/* Mariana */}
          <div className="glass-card rounded-2xl p-8 border border-white/5 text-center">
            <div className="size-20 rounded-full bg-gradient-to-br from-primary to-purple-900 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
              <span className="text-3xl font-black text-white">M</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Mariana Alejandra Carabajal</h3>
            <p className="text-primary text-sm font-medium mb-4">Co-Founder & Product Owner</p>
            <p className="text-slate-400 text-sm leading-relaxed m-0">
              Responsable de la visión del producto y de asegurar que Zophiel responda a las 
              necesidades reales de las personas que viven con dolor crónico.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-xs text-slate-500">© 2026 Zophiel — Hecho con 💜 para quienes viven con dolor</p>
      </footer>
    </div>
  );
}
