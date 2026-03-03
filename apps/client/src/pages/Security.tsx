import { Link } from 'react-router-dom';
import ZophielLogo from '../components/ZophielLogo';

/**
 * Seguridad — security practices
 */
export default function Security() {
  return (
    <div className="min-h-screen bg-background-dark text-slate-100 antialiased">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0f0b15]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 lg:h-20 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <ZophielLogo variant="icon" size={28} />
            <span className="text-white text-lg font-bold">Zophiel</span>
          </Link>
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors no-underline">← Volver al inicio</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 lg:px-8 py-16 lg:py-24">
        <h1 className="text-3xl lg:text-4xl font-black text-white mb-2">Seguridad</h1>
        <p className="text-slate-500 text-sm mb-12">Cómo protegemos tus datos de salud</p>

        <div className="space-y-6 mb-16">
          {/* Security cards */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 flex gap-5 items-start">
            <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
              <span className="material-symbols-outlined text-green-400 text-2xl">https</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Encriptación en tránsito</h3>
              <p className="text-slate-400 text-sm leading-relaxed m-0">
                Toda la comunicación entre tu dispositivo y nuestros servidores está protegida 
                con TLS 1.3. Tus datos nunca viajan sin encriptar.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/5 flex gap-5 items-start">
            <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
              <span className="material-symbols-outlined text-green-400 text-2xl">password</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Contraseñas seguras</h3>
              <p className="text-slate-400 text-sm leading-relaxed m-0">
                Las contraseñas se almacenan usando bcrypt con salt aleatorio. 
                Ni siquiera nosotros podemos ver tu contraseña.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/5 flex gap-5 items-start">
            <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
              <span className="material-symbols-outlined text-green-400 text-2xl">cloud_off</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Modo offline seguro</h3>
              <p className="text-slate-400 text-sm leading-relaxed m-0">
                Cuando usás Zophiel sin conexión, los datos se almacenan localmente en tu dispositivo 
                y se sincronizan de forma segura cuando recuperás la conexión.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/5 flex gap-5 items-start">
            <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
              <span className="material-symbols-outlined text-green-400 text-2xl">shield</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Sin venta de datos</h3>
              <p className="text-slate-400 text-sm leading-relaxed m-0">
                Nunca vendemos, compartimos ni comercializamos tus datos de salud con terceros. 
                Tus datos son exclusivamente tuyos.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/5 flex gap-5 items-start">
            <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
              <span className="material-symbols-outlined text-green-400 text-2xl">delete_forever</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Derecho al olvido</h3>
              <p className="text-slate-400 text-sm leading-relaxed m-0">
                Podés solicitar la eliminación completa de tu cuenta y todos los datos asociados 
                en cualquier momento. La eliminación es permanente e irreversible.
              </p>
            </div>
          </div>
        </div>

        {/* Report */}
        <div className="glass-card rounded-2xl p-8 border border-primary/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white mb-3">¿Encontraste una vulnerabilidad?</h2>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto m-0">
              Tomamos la seguridad muy en serio. Si descubriste un problema de seguridad, reportalo 
              de forma responsable.
            </p>
            <a href="mailto:seguridad@zophiel.app" className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-primary text-white text-sm font-bold hover:bg-[#701ec2] transition-colors no-underline">
              <span className="material-symbols-outlined text-lg">bug_report</span>
              Reportar vulnerabilidad
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
