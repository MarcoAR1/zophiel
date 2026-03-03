import { Link } from 'react-router-dom';
import ZophielLogo from '../components/ZophielLogo';

/**
 * Política de Privacidad
 */
export default function Privacy() {
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
        <h1 className="text-3xl lg:text-4xl font-black text-white mb-2">Política de Privacidad</h1>
        <p className="text-slate-500 text-sm mb-12">Última actualización: Marzo 2026</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Información que recopilamos</h2>
            <p>Zophiel recopila la siguiente información con tu consentimiento explícito:</p>
            <ul className="list-disc list-inside space-y-2 text-sm ml-2">
              <li><strong className="text-white">Datos de cuenta:</strong> nombre, dirección de email y contraseña encriptada.</li>
              <li><strong className="text-white">Datos de salud:</strong> registros de dolor (intensidad, ubicación corporal, tipo de sensación), estado de ánimo, notas personales y respuestas a cuestionarios.</li>
              <li><strong className="text-white">Datos del dispositivo:</strong> tipo de navegador y sistema operativo, exclusivamente para mejorar la experiencia de uso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Cómo usamos tu información</h2>
            <p>Tu información se utiliza exclusivamente para:</p>
            <ul className="list-disc list-inside space-y-2 text-sm ml-2">
              <li>Proporcionarte el servicio de registro y seguimiento del dolor.</li>
              <li>Generar reportes e historial para tu uso personal.</li>
              <li>Mejorar la funcionalidad y experiencia de la aplicación.</li>
            </ul>
            <p className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm">
              <strong className="text-green-400">🔒 Compromiso:</strong> Nunca vendemos, compartimos ni comercializamos tus datos de salud con terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Almacenamiento y seguridad</h2>
            <p>
              Tus datos se almacenan en servidores seguros con encriptación en tránsito (TLS/SSL). 
              Las contraseñas se almacenan con hash bcrypt y nunca en texto plano.
              La aplicación también funciona offline, almacenando datos localmente en tu dispositivo 
              hasta que se sincronicen con el servidor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Tus derechos</h2>
            <p>Tenés derecho a:</p>
            <ul className="list-disc list-inside space-y-2 text-sm ml-2">
              <li>Acceder a todos tus datos personales en cualquier momento.</li>
              <li>Solicitar la corrección de datos inexactos.</li>
              <li>Solicitar la eliminación completa de tu cuenta y todos los datos asociados.</li>
              <li>Exportar tus datos en un formato legible.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Datos de menores</h2>
            <p>
              Zophiel está diseñado para personas mayores de 18 años. No recopilamos intencionalmente 
              información de menores de edad. Si descubrimos que hemos recopilado datos de un menor, 
              los eliminaremos inmediatamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Cambios en esta política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política. Te notificaremos sobre cambios 
              significativos mediante la aplicación o por email. El uso continuado del servicio después 
              de los cambios constituye tu aceptación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Contacto</h2>
            <p>
              Para consultas sobre privacidad, escribinos a{' '}
              <a href="mailto:privacidad@zophiel.app" className="text-primary hover:text-white transition-colors">
                privacidad@zophiel.app
              </a>
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
