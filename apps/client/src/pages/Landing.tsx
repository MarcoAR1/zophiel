import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/index';
import ZophielLogo from '../components/ZophielLogo';

/**
 * Responsive Landing Page - Derived directly from Stitch 'Zophiel Desktop Landing Page'
 * Completely responsive layout covering both mobile and desktop displays.
 */
export default function Landing() {
  const { t } = useI18n();

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root bg-background-dark text-slate-100 overflow-x-hidden antialiased">
      {/* Decorative Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0f0b15]/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="size-8 text-primary flex items-center justify-center">
              <ZophielLogo variant="icon" />
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight">Zophiel</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-slate-300 hover:text-white transition-colors text-sm font-medium no-underline" href="#features">
              {t('landing_features_title')}
            </a>
            <a className="text-slate-300 hover:text-white transition-colors text-sm font-medium no-underline" href="#how-it-works">
              Cómo funciona
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/auth/login" className="hidden md:flex h-10 px-5 items-center justify-center rounded-xl border border-white/10 bg-transparent text-white text-sm font-semibold hover:bg-white/5 transition-colors no-underline">
              Iniciar Sesión
            </Link>
            <Link to="/auth/register" className="flex h-10 px-5 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-[#701ec2] text-white text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5 no-underline">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Column: Content */}
            <div className="flex flex-col max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-primary text-xs font-bold uppercase tracking-wider">{t('landing_badge')}</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
                {t('landing_title_1')} <span className="bg-gradient-to-r from-[#a755f7] via-[#8c25f4] to-[#6d28d9] bg-clip-text text-transparent block">{t('landing_title_highlight')}</span> {t('landing_title_2')}
              </h1>
              <p className="text-lg text-slate-400 mb-10 max-w-lg leading-relaxed">
                {t('landing_subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth/register" className="flex items-center justify-center h-12 px-8 rounded-xl bg-primary text-white text-base font-bold shadow-lg shadow-primary/25 hover:bg-[#701ec2] transition-all transform hover:scale-105 no-underline">
                  {t('landing_cta_start')}
                </Link>
                <button className="h-12 px-8 rounded-xl bg-white/5 border border-white/10 text-white text-base font-bold hover:bg-white/10 transition-colors backdrop-blur-sm flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">play_circle</span>
                  Ver demo
                </button>
              </div>
              <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-3">
                  <img alt="User Avatar 1" className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA346ZDHDWl_h_k_RFbqBM51alSTzKrnydF2939M4PpfoX3Ox-hPg9CXH57C7PeF31-CcQ0ULZnVXdQyveXnMhm_VDHZy6x4bX6kCEVQI2-83dE_IRvi63vav4Ogs4QtrhQFfJnypUIZc4rWbKDSYrnL3eigykmLCEHVFrhy5iIHeAVioD0DRBY2kpUQGHhJ1Uc1ngZgel5O2Hw_eE2Cg7Vev7HpBX-wcqFEJ5R-FNX557fZ1FhSe08YBF5B3vCvEj06ZRujXPTjg"/>
                  <img alt="User Avatar 2" className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOS5j6i1POaU9HIZkR8JPUGlS4VyeOiMC_e1Qiufl3U7rieIUPlTulBFUTp1M2nTYcwOmAOMxLxE9gEOKIxK-gelQFaFu2kBOwEoSYBruyaQwc0_WDDflWaHqLgJ7-73fsrjuYeW6FRM4N42XhA2Ue59yQwhtSyTcS8l10dWnif1xuM1tS57HMFUOwGhPxFjUwCU6M7quOlWb_5-QuIqoBJIRxuymLlEmU41dwRGHdfCUlKo252Y39sUgVzjrzORVqnBo_z_bO1w"/>
                  <img alt="User Avatar 3" className="w-10 h-10 rounded-full border-2 border-background-dark object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnR0wuva2UUImNqKtcDbZxcLRV2bBcfb_KGkfZWdV5U1A5gyUpGfd8DBPxvN2NILiOauInsQOKLnATkjWdhX_BrXx3ZwqSA7SlY3LO_8Q90JqHVB3RpO-Fu6z_7VoHMHeRsF58qdDiuVHmjXol8cU3IeQsubfmLrd2Tggpb8UbGoUHQvFJYo1W6RYv8cFSVUGZ8XXQNMwwpNZr-n18Lh6M7WIj2_GA6n38r4VfDJlN1vJVMm3mWGc2egzJrLQCBCxQ0IcwJIcZ2w"/>
                </div>
                <p>Usado por más de <span className="text-white font-semibold">10,000+</span> pacientes</p>
              </div>
            </div>
            
            {/* Right Column: 3D Mockup */}
            <div className="relative w-full h-full min-h-[500px] flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
              <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-slate-800 shadow-[0_0_40px_-10px_rgba(140,37,244,0.3)] rotate-[-6deg] overflow-hidden z-10 transition-transform hover:rotate-[-2deg] duration-500">
                {/* Screen Content Mockup */}
                <div className="w-full h-full bg-[#191320] flex flex-col relative">
                  {/* Status Bar */}
                  <div className="h-8 w-full flex justify-between items-center px-6 pt-4">
                    <div className="text-[10px] font-bold text-white">9:41</div>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  {/* App Header */}
                  <div className="px-6 mt-6 mb-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-slate-400 text-xs font-medium">Buenos días,</h3>
                      <h2 className="text-white text-xl font-bold">Sofía</h2>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">notifications</span>
                    </div>
                  </div>
                  {/* Chart Card */}
                  <div className="mx-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md mb-4 border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white text-sm font-semibold">Nivel de dolor hoy</span>
                      <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded">Bajo</span>
                    </div>
                    <div className="h-24 w-full bg-gradient-to-t from-primary/20 to-transparent rounded-lg flex items-end justify-between px-2 pb-2 gap-2">
                      <div className="w-1/6 bg-primary/40 h-[30%] rounded-t-sm"></div>
                      <div className="w-1/6 bg-primary/60 h-[50%] rounded-t-sm"></div>
                      <div className="w-1/6 bg-primary/80 h-[80%] rounded-t-sm"></div>
                      <div className="w-1/6 bg-primary h-[40%] rounded-t-sm shadow-[0_0_10px_rgba(140,37,244,0.5)]"></div>
                      <div className="w-1/6 bg-primary/30 h-[20%] rounded-t-sm"></div>
                    </div>
                  </div>
                  {/* Body Map Mini */}
                  <div className="mx-4 p-4 rounded-2xl bg-[#0f0b15] border border-white/5 flex-1 relative overflow-hidden">
                    <span className="text-white text-sm font-semibold block mb-2">Mapa Corporal</span>
                    <div className="absolute inset-0 top-10 flex items-center justify-center opacity-80">
                      {/* Abstract body shape */}
                      <svg className="h-[80%] text-slate-700 fill-current" viewBox="0 0 200 400">
                        <path d="M100,20 C120,20 130,40 130,60 C130,80 150,90 160,120 L160,180 C160,200 140,200 140,250 L140,350 C140,370 120,380 100,380 C80,380 60,370 60,350 L60,250 C60,200 40,200 40,180 L40,120 C50,90 70,80 70,60 C70,40 80,20 100,20 Z"></path>
                        <circle className="fill-red-500 animate-pulse" cx="100" cy="140" r="15"></circle>
                      </svg>
                    </div>
                  </div>
                  {/* Bottom Nav */}
                  <div className="mt-auto h-20 bg-[#0f0b15]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-2">
                    <div className="p-2 text-primary"><span className="material-symbols-outlined">home</span></div>
                    <div className="p-2 text-slate-500"><span className="material-symbols-outlined">calendar_month</span></div>
                    <div className="p-2 text-slate-500"><span className="material-symbols-outlined">bar_chart</span></div>
                    <div className="p-2 text-slate-500"><span className="material-symbols-outlined">person</span></div>
                  </div>
                </div>
              </div>
              {/* Decor behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[650px] bg-primary/30 rounded-[3.5rem] blur-2xl -z-10"></div>
              {/* Floating Info Card */}
              <div className="absolute bottom-20 left-0 lg:-left-12 glass-panel p-4 rounded-2xl flex items-center gap-3 animate-bounce shadow-xl max-w-[240px]" style={{ animationDuration: '3s' }}>
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <p className="text-white text-xs font-bold">Reporte Diario</p>
                  <p className="text-slate-300 text-[10px]">Completado exitosamente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden bg-background-dark" id="features">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-primary text-sm font-bold uppercase tracking-widest mb-3">Funcionalidades Clave</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Tu salud bajo control</h3>
            <p className="text-slate-400 text-lg">Herramientas diseñadas específicamente para pacientes con condiciones crónicas, simplificando lo complejo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="group relative rounded-3xl glass-panel p-8 hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-primary/50">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-[#2a2235] border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">accessibility_new</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t('landing_feat_body')}</h3>
                <p className="text-slate-400 leading-relaxed">{t('landing_feat_body_desc')}</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="group relative rounded-3xl glass-panel p-8 hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-primary/50">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-[#2a2235] border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">trending_up</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t('landing_feat_analytics')}</h3>
                <p className="text-slate-400 leading-relaxed">{t('landing_feat_analytics_desc')}</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="group relative rounded-3xl glass-panel p-8 hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-primary/50">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-[#2a2235] border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">vital_signs</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t('landing_feat_qol')}</h3>
                <p className="text-slate-400 leading-relaxed">{t('landing_feat_qol_desc')}</p>
              </div>
            </div>
            {/* Feature 4 */}
            <div className="group relative rounded-3xl glass-panel p-8 hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-primary/50">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-[#2a2235] border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">cloud_off</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t('landing_feat_offline')}</h3>
                <p className="text-slate-400 leading-relaxed">{t('landing_feat_offline_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#0a0710] relative" id="how-it-works">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Cómo funciona</h2>
            <p className="text-slate-400 text-lg">Tres pasos simples para retomar el control.</p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent border-t border-dashed border-primary/50 z-0"></div>
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-[#191320] border-2 border-primary/30 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(140,37,244,0.15)] group-hover:border-primary transition-colors duration-300">
                <span className="text-4xl font-black text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('landing_step1_title')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{t('landing_step1_desc')}</p>
            </div>
            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-[#191320] border-2 border-primary/30 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(140,37,244,0.15)] group-hover:border-primary transition-colors duration-300">
                <span className="text-4xl font-black text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('landing_step2_title')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{t('landing_step2_desc')}</p>
            </div>
            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-[#191320] border-2 border-primary/30 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(140,37,244,0.15)] group-hover:border-primary transition-colors duration-300">
                <span className="text-4xl font-black text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('landing_step3_title')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{t('landing_step3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#2a2235] to-[#141118] border border-white/10 px-8 py-20 text-center shadow-2xl">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-50%] left-[20%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[100px]"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                Empieza a vivir mejor hoy
              </h2>
              <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                Únete a miles de personas que ya están gestionando su dolor de forma inteligente con Zophiel.
              </p>
              <Link to="/auth/register" className="flex items-center justify-center h-14 px-10 rounded-full bg-white text-[#0f0b15] text-lg font-bold hover:bg-slate-100 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)] no-underline">
                Crear Cuenta Gratis
              </Link>
              <p className="mt-6 text-sm text-slate-500">No se requiere tarjeta de crédito • Cancelación en cualquier momento</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0a0710] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Column 1: Brand */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6 text-white">
                <span className="material-symbols-outlined text-primary text-2xl">stethoscope</span>
                <span className="text-lg font-bold">Zophiel</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Tecnología avanzada para el manejo del dolor crónico, diseñada con empatía y precisión científica.
              </p>
            </div>
            {/* Column 2: Product */}
            <div>
              <h4 className="text-white font-semibold mb-6">Producto</h4>
              <ul className="space-y-4 m-0 p-0 list-none">
                <li><a className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" href="#">Funcionalidades</a></li>
                <li><a className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" href="#">Precios</a></li>
                <li><a className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" href="#">Para Clínicas</a></li>
                <li><a className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" href="#">Estudios de Caso</a></li>
              </ul>
            </div>
            {/* Column 3: Company */}
            <div>
              <h4 className="text-white font-semibold mb-6">Compañía</h4>
              <ul className="space-y-4 m-0 p-0 list-none">
                <li><a className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" href="#">Sobre Nosotros</a></li>
                <li><a className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" href="#">Blog</a></li>
                <li><a className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" href="#">Carreras</a></li>
                <li><a className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" href="#">Contacto</a></li>
              </ul>
            </div>
            {/* Column 4: Legal */}
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-4 m-0 p-0 list-none">
                <li><a className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" href="#">Privacidad</a></li>
                <li><a className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" href="#">Términos</a></li>
                <li><a className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" href="#">Seguridad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm m-0">© 2026 Zophiel. Hecho con <span className="text-primary inline-block font-sans">💜</span> para quienes viven con dolor.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
