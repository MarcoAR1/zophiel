import { Link } from 'react-router-dom';
import ZophielLogo from '../components/ZophielLogo';

/**
 * Estudios de Caso — real user stories
 */
export default function CaseStudies() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="material-symbols-outlined text-primary text-lg">auto_stories</span>
            <span className="text-primary text-xs font-bold uppercase tracking-wider">Historias reales</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
            Estudios de Caso
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Personas reales que usan Zophiel para entender mejor su dolor crónico.
          </p>
        </div>

        {/* Case Study 1: Fibromyalgia */}
        <article className="glass-card rounded-3xl p-8 lg:p-12 border border-white/5 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white m-0">Vivir con Fibromialgia</h2>
              <p className="text-slate-500 text-sm m-0">Usuaria real • Argentina</p>
            </div>
          </div>

          <div className="space-y-6 text-slate-300 leading-relaxed">
            <div>
              <h3 className="text-primary text-sm font-bold uppercase tracking-wider mb-2">El desafío</h3>
              <p className="m-0">
                La fibromialgia es una condición que causa dolor generalizado, fatiga y dificultad para dormir. 
                Uno de los mayores problemas es que el dolor varía día a día, lo que hace difícil comunicar 
                al médico cómo te sentís realmente a lo largo del tiempo. Las consultas frecuentemente se basan
                en la memoria del paciente sobre semanas o meses de síntomas.
              </p>
            </div>

            <div>
              <h3 className="text-primary text-sm font-bold uppercase tracking-wider mb-2">Cómo ayuda Zophiel</h3>
              <p className="m-0">
                Con Zophiel, la usuaria registra su dolor diariamente en menos de un minuto usando el mapa corporal 
                interactivo. Marca exactamente dónde duele, la intensidad, el tipo de sensación y su estado de ánimo. 
                Esto permite generar un historial detallado que muestra patrones que antes eran invisibles.
              </p>
            </div>

            <div>
              <h3 className="text-primary text-sm font-bold uppercase tracking-wider mb-2">Resultado</h3>
              <p className="m-0">
                Después de 3 meses de registro constante, la paciente pudo identificar que ciertos factores como
                los cambios de clima y la falta de sueño estaban directamente correlacionados con los picos de dolor.
                Su médico pudo ajustar el tratamiento basándose en datos concretos en vez de recuerdos vagos.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Fibromialgia</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Mapa corporal</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Historial de dolor</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Reportes médicos</span>
          </div>
        </article>

        {/* More coming soon */}
        <div className="glass-card rounded-2xl p-8 border border-white/5 text-center">
          <span className="material-symbols-outlined text-slate-500 text-4xl mb-4 block">upcoming</span>
          <h3 className="text-lg font-bold text-white mb-2">Más historias próximamente</h3>
          <p className="text-slate-400 text-sm m-0">
            Estamos recopilando más experiencias de usuarios con diferentes condiciones crónicas.
          </p>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-xs text-slate-500">© 2026 Zophiel — Hecho con 💜 para quienes viven con dolor</p>
      </footer>
    </div>
  );
}
