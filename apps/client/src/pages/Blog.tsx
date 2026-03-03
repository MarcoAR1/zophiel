import { Link } from 'react-router-dom';
import ZophielLogo from '../components/ZophielLogo';

/**
 * Blog — placeholder/coming soon page
 */
export default function Blog() {
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
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">Blog</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Artículos, guías y novedades sobre el manejo del dolor crónico.
          </p>
        </div>

        {/* Coming soon */}
        <div className="glass-card rounded-3xl p-12 lg:p-16 border border-white/5 text-center">
          <span className="material-symbols-outlined text-primary text-5xl mb-6 block">edit_note</span>
          <h2 className="text-2xl font-bold text-white mb-4">Próximamente</h2>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed m-0">
            Estamos preparando contenido sobre dolor crónico, consejos para el registro diario,
            y novedades de Zophiel. ¡Volvé pronto!
          </p>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-xs text-slate-500">© 2026 Zophiel — Hecho con 💜 para quienes viven con dolor</p>
      </footer>
    </div>
  );
}
