import { Link } from 'react-router-dom';
import ZophielLogo from '../components/ZophielLogo';

/**
 * Términos y Condiciones
 */
export default function Terms() {
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
        <h1 className="text-3xl lg:text-4xl font-black text-white mb-2">Términos y Condiciones</h1>
        <p className="text-slate-500 text-sm mb-12">Última actualización: Marzo 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Aceptación de los términos</h2>
            <p>
              Al usar Zophiel, aceptás estos términos y condiciones. Si no estás de acuerdo, 
              no uses la aplicación. Nos reservamos el derecho de modificar estos términos en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Descripción del servicio</h2>
            <p>
              Zophiel es una herramienta de registro y seguimiento de dolor crónico. Permite a los usuarios 
              registrar síntomas diarios, visualizar tendencias y generar historial para compartir con 
              profesionales de la salud.
            </p>
            <p className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm">
              <strong className="text-yellow-400">⚠️ Importante:</strong> Zophiel NO es un servicio médico. No proporciona diagnósticos, 
              tratamientos ni recomendaciones médicas. Siempre consultá con un profesional de la salud 
              para decisiones médicas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Cuenta de usuario</h2>
            <ul className="list-disc list-inside space-y-2 text-sm ml-2">
              <li>Sos responsable de mantener la confidencialidad de tu cuenta y contraseña.</li>
              <li>Debés proporcionar información precisa y actualizada.</li>
              <li>Solo podés tener una cuenta por persona.</li>
              <li>Debés ser mayor de 18 años para usar el servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Uso aceptable</h2>
            <p>Te comprometés a no:</p>
            <ul className="list-disc list-inside space-y-2 text-sm ml-2">
              <li>Usar el servicio para fines ilegales o no autorizados.</li>
              <li>Intentar acceder a cuentas o datos de otros usuarios.</li>
              <li>Interferir con el funcionamiento del servicio.</li>
              <li>Realizar ingeniería inversa del software.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Propiedad intelectual</h2>
            <p>
              Todo el contenido de Zophiel (diseño, código, marca, logos) es propiedad de Zophiel 
              y está protegido por leyes de propiedad intelectual. Los datos que ingresás son tuyos y 
              podés exportarlos o eliminarlos cuando quieras.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Limitación de responsabilidad</h2>
            <p>
              Zophiel se proporciona "tal como está". No garantizamos que el servicio esté libre de 
              errores o interrupciones. No somos responsables de decisiones médicas basadas en los 
              datos registrados en la aplicación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Terminación</h2>
            <p>
              Podés cancelar tu cuenta en cualquier momento desde la configuración de la app. 
              Nos reservamos el derecho de suspender cuentas que violen estos términos.
              Al cancelar, tus datos serán eliminados según nuestra{' '}
              <Link to="/privacy" className="text-primary hover:text-white transition-colors">
                Política de Privacidad
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Ley aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa 
              será resuelta por los tribunales competentes de la Ciudad de Buenos Aires.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-xs text-slate-500">© 2026 Zophiel — Hecho con 💜 para quienes viven con dolor</p>
      </footer>
    </div>
  );
}
