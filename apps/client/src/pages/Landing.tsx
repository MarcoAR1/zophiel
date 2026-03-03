import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/index';
import ZophielLogo from '../components/ZophielLogo';

/**
 * Responsive Landing Page
 * Mobile layout: derived from Stitch "Zophiel Mobile Landing Page"
 * Desktop layout: derived from Stitch "Zophiel Desktop Landing Page"
 * Both merged into one responsive component using Tailwind breakpoints.
 */
export default function Landing() {
  const { t } = useI18n();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-slate-100 overflow-x-hidden antialiased selection:bg-primary selection:text-white">
      {/* ── Decorative Background Gradients ── */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── NAVBAR ── */}
      {/* Mobile: compact logo + Login text */}
      {/* Desktop: full nav with links + auth buttons */}
      {/* ══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0f0b15]/80 backdrop-blur-md">
        {/* ── Mobile Nav ── */}
        <div className="flex lg:hidden items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-primary to-purple-900 text-white shadow-lg shadow-primary/20">
              <ZophielLogo variant="icon" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Zophiel</span>
          </div>
          <Link to="/auth/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors no-underline">
            Login
          </Link>
        </div>
        {/* ── Desktop Nav ── */}
        <div className="hidden lg:flex mx-auto h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="size-8 text-primary flex items-center justify-center">
              <ZophielLogo variant="icon" size={32} />
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight m-0">Zophiel</h2>
          </div>
          <nav className="flex items-center gap-8">
            <a className="text-slate-300 hover:text-white transition-colors text-sm font-medium no-underline" href="#features">
              {t('landing_features_link')}
            </a>
            <a className="text-slate-300 hover:text-white transition-colors text-sm font-medium no-underline" href="#how-it-works">
              Cómo funciona
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/auth/login" className="flex h-10 px-5 items-center justify-center rounded-xl border border-white/10 bg-transparent text-white text-sm font-semibold hover:bg-white/5 transition-colors no-underline">
              Iniciar Sesión
            </Link>
            <Link to="/auth/register" className="flex h-10 px-5 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-[#701ec2] text-white text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5 no-underline">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── HERO SECTION ── */}
      {/* Mobile: centered text + CTA + trust indicators */}
      {/* Desktop: 2-column with phone mockup */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-8 pb-12 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Mobile ambient glow */}
        <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* ── Left Column: Content ── */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 lg:gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit mb-6 backdrop-blur-md">
                <span className="flex w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-primary text-xs font-bold uppercase tracking-wider">{t('landing_badge')}</span>
              </div>

              {/* Title - mobile: 4xl, desktop: 7xl */}
              <h1 className="text-4xl lg:text-7xl font-extrabold lg:font-black tracking-tight text-white leading-[1.15] lg:leading-[1.1] mb-4 lg:mb-6">
                {t('landing_title_1')}<br className="lg:hidden" />
                <span className="bg-gradient-to-r from-[#c084fc] to-[#8c25f4] lg:from-[#a755f7] lg:via-[#8c25f4] lg:to-[#6d28d9] bg-clip-text text-transparent block">{t('landing_title_highlight')}</span>
                {t('landing_title_2')}
              </h1>

              {/* Subtitle */}
              <p className="text-slate-400 text-lg leading-relaxed max-w-md lg:max-w-lg mb-8 lg:mb-10 font-light lg:font-normal">
                {t('landing_subtitle')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
                {/* Mobile CTA: full-width gradient button with arrow */}
                <Link to="/auth/register" className="lg:hidden group relative flex w-full max-w-[320px] mx-auto items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 p-[1px] shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95 no-underline">
                  <div className="relative flex h-12 w-full items-center justify-center rounded-xl bg-transparent px-6 transition-all group-hover:bg-white/5">
                    <span className="text-base font-bold text-white">{t('landing_cta_start')}</span>
                    <span className="material-symbols-outlined ml-2 text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </Link>
                {/* Desktop CTA: solid + APK download */}
                <Link to="/auth/register" className="hidden lg:flex items-center justify-center h-12 px-8 rounded-xl bg-primary text-white text-base font-bold shadow-lg shadow-primary/25 hover:bg-[#701ec2] transition-all transform hover:scale-105 no-underline">
                  {t('landing_cta_start')}
                </Link>
                <a href="/downloads/zophiel.apk" download="zophiel.apk" className="hidden lg:flex h-12 px-8 rounded-xl bg-white/5 border border-white/10 text-white text-base font-bold hover:bg-white/10 transition-colors backdrop-blur-sm items-center justify-center gap-2 no-underline">
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  Descargar APK
                </a>
              </div>

              {/* Mobile Trust Indicators */}
              <div className="lg:hidden mt-12 grid grid-cols-3 gap-3 w-full max-w-lg">
                <div className="glass-card flex flex-col items-center justify-center p-3 rounded-xl gap-2 text-center">
                  <span className="material-symbols-outlined text-primary text-2xl">body_system</span>
                  <span className="text-[11px] font-medium leading-tight text-slate-300">Mapa<br />Corporal</span>
                </div>
                <div className="glass-card flex flex-col items-center justify-center p-3 rounded-xl gap-2 text-center">
                  <span className="material-symbols-outlined text-primary text-2xl">monitoring</span>
                  <span className="text-[11px] font-medium leading-tight text-slate-300">Seguimiento<br />Continuo</span>
                </div>
                <div className="glass-card flex flex-col items-center justify-center p-3 rounded-xl gap-2 text-center">
                  <span className="material-symbols-outlined text-primary text-2xl">encrypted</span>
                  <span className="text-[11px] font-medium leading-tight text-slate-300">100%<br />Privado</span>
                </div>
              </div>

              {/* Desktop APK Download Link */}
              <div className="hidden lg:flex mt-10 items-center gap-3 text-sm text-slate-500">
                <span className="material-symbols-outlined text-green-400 text-lg">phone_android</span>
                <p className="m-0">Disponible para <a href="/downloads/zophiel.apk" download="zophiel.apk" className="text-primary hover:text-white transition-colors no-underline font-semibold">Android</a> y como <span className="text-white font-semibold">PWA</span></p>
              </div>
            </div>

            {/* ── Right Column: 3D Phone Mockup (Desktop only) ── */}
            <div className="hidden lg:flex relative w-full h-full min-h-[500px] items-center justify-end">
              <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-slate-800 shadow-2xl shadow-primary/10 rotate-[-6deg] overflow-hidden z-10 transition-transform hover:rotate-[-2deg] duration-500">
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
                      <h3 className="text-slate-400 text-xs font-medium m-0">Buenos días,</h3>
                      <h2 className="text-white text-xl font-bold m-0">Sofía</h2>
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
              <div className="absolute bottom-20 -left-12 glass-panel p-4 rounded-2xl flex items-center gap-3 animate-bounce shadow-xl max-w-[240px]" style={{ animationDuration: '3s' }}>
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <p className="text-white text-xs font-bold m-0">Reporte Diario</p>
                  <p className="text-slate-300 text-[10px] m-0">Completado exitosamente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── FEATURES SECTION ── */}
      {/* Mobile: vertical stack with icon+text cards */}
      {/* Desktop: section header + 2x2 grid with glass panels */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="px-4 py-8 lg:py-24 relative overflow-hidden bg-gradient-to-b from-transparent to-[#1d1625]/30 lg:from-transparent lg:to-transparent lg:bg-background-dark" id="features">
        <div className="hidden lg:block absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="mx-auto max-w-7xl lg:px-8 relative z-10">
          {/* Desktop header */}
          <div className="hidden lg:block text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-primary text-sm font-bold uppercase tracking-widest mb-3">Funcionalidades Clave</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 m-0">Tu salud bajo control</h3>
            <p className="text-slate-400 text-lg m-0">Herramientas diseñadas específicamente para pacientes con condiciones crónicas, simplificando lo complejo.</p>
          </div>
          {/* Mobile header */}
          <h2 className="lg:hidden text-2xl font-bold text-white mb-6 px-2">{t('landing_features_title')}</h2>

          {/* Feature Cards */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Feature 1 */}
            <div className="group relative glass-card lg:glass-panel rounded-2xl lg:rounded-3xl p-5 lg:p-8 flex items-start lg:block gap-4 cursor-pointer glass-card-hover lg:hover:bg-white/5 transition-all duration-300 border border-white/5 lg:hover:border-primary/50">
              <div className="hidden lg:block absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
              <div className="size-12 lg:size-auto lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-surface-dark lg:bg-[#2a2235] flex items-center justify-center shrink-0 border border-white/5 lg:border-white/10 group-hover:border-primary/50 lg:group-hover:scale-110 transition-all lg:mb-6 lg:relative">
                <span className="material-symbols-outlined text-primary text-2xl lg:text-3xl">accessibility_new</span>
              </div>
              <div className="flex-1 lg:relative">
                <h3 className="text-white font-semibold text-lg lg:text-xl mb-1 lg:mb-3 group-hover:text-purple-300 transition-colors m-0">{t('landing_feat_body')}</h3>
                <p className="text-slate-400 text-sm lg:text-base leading-relaxed m-0">{t('landing_feat_body_desc')}</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="group relative glass-card lg:glass-panel rounded-2xl lg:rounded-3xl p-5 lg:p-8 flex items-start lg:block gap-4 cursor-pointer glass-card-hover lg:hover:bg-white/5 transition-all duration-300 border border-white/5 lg:hover:border-primary/50">
              <div className="hidden lg:block absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="size-12 lg:size-auto lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-surface-dark lg:bg-[#2a2235] flex items-center justify-center shrink-0 border border-white/5 lg:border-white/10 group-hover:border-primary/50 lg:group-hover:scale-110 transition-all lg:mb-6 lg:relative">
                <span className="material-symbols-outlined text-primary text-2xl lg:text-3xl">trending_up</span>
              </div>
              <div className="flex-1 lg:relative">
                <h3 className="text-white font-semibold text-lg lg:text-xl mb-1 lg:mb-3 group-hover:text-purple-300 transition-colors m-0">{t('landing_feat_analytics')}</h3>
                <p className="text-slate-400 text-sm lg:text-base leading-relaxed m-0">{t('landing_feat_analytics_desc')}</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="group relative glass-card lg:glass-panel rounded-2xl lg:rounded-3xl p-5 lg:p-8 flex items-start lg:block gap-4 cursor-pointer glass-card-hover lg:hover:bg-white/5 transition-all duration-300 border border-white/5 lg:hover:border-primary/50">
              <div className="size-12 lg:size-auto lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-surface-dark lg:bg-[#2a2235] flex items-center justify-center shrink-0 border border-white/5 lg:border-white/10 group-hover:border-primary/50 lg:group-hover:scale-110 transition-all lg:mb-6 lg:relative">
                <span className="material-symbols-outlined text-primary text-2xl lg:text-3xl">vital_signs</span>
              </div>
              <div className="flex-1 lg:relative">
                <h3 className="text-white font-semibold text-lg lg:text-xl mb-1 lg:mb-3 group-hover:text-purple-300 transition-colors m-0">{t('landing_feat_qol')}</h3>
                <p className="text-slate-400 text-sm lg:text-base leading-relaxed m-0">{t('landing_feat_qol_desc')}</p>
              </div>
            </div>
            {/* Feature 4 */}
            <div className="group relative glass-card lg:glass-panel rounded-2xl lg:rounded-3xl p-5 lg:p-8 flex items-start lg:block gap-4 cursor-pointer glass-card-hover lg:hover:bg-white/5 transition-all duration-300 border border-white/5 lg:hover:border-primary/50">
              <div className="size-12 lg:size-auto lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-surface-dark lg:bg-[#2a2235] flex items-center justify-center shrink-0 border border-white/5 lg:border-white/10 group-hover:border-primary/50 lg:group-hover:scale-110 transition-all lg:mb-6 lg:relative">
                <span className="material-symbols-outlined text-primary text-2xl lg:text-3xl">cloud_off</span>
              </div>
              <div className="flex-1 lg:relative">
                <h3 className="text-white font-semibold text-lg lg:text-xl mb-1 lg:mb-3 group-hover:text-purple-300 transition-colors m-0">{t('landing_feat_offline')}</h3>
                <p className="text-slate-400 text-sm lg:text-base leading-relaxed m-0">{t('landing_feat_offline_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── HOW IT WORKS ── */}
      {/* Mobile: vertical steps with left line */}
      {/* Desktop: 3-column horizontal steps with connecting line */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="px-4 py-12 lg:py-24 relative overflow-hidden bg-transparent lg:bg-[#0a0710]" id="how-it-works">
        {/* Mobile decor */}
        <div className="lg:hidden absolute right-0 top-1/3 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="mx-auto max-w-7xl lg:px-8">
          {/* Header */}
          <div className="text-center mb-10 lg:mb-20">
            <h2 className="text-2xl lg:text-5xl font-bold lg:font-black text-white lg:tracking-tight mb-0 lg:mb-4">
              <span className="lg:hidden">Cómo funciona Zophiel</span>
              <span className="hidden lg:inline">Cómo funciona</span>
            </h2>
            <p className="hidden lg:block text-slate-400 text-lg m-0">Tres pasos simples para retomar el control.</p>
          </div>

          {/* ── Mobile Steps (vertical) ── */}
          <div className="lg:hidden relative max-w-md mx-auto">
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/80 via-primary/30 to-transparent"></div>
            <div className="flex flex-col gap-10">
              <div className="relative flex gap-6">
                <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-dark border-2 border-primary text-white shadow-[0_0_15px_rgba(140,37,244,0.3)]">
                  <span className="font-bold text-xl">1</span>
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="text-lg font-bold text-white mb-2 m-0">{t('landing_step1_title')}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed m-0">{t('landing_step1_desc')}</p>
                </div>
              </div>
              <div className="relative flex gap-6">
                <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-dark border-2 border-primary/60 text-white">
                  <span className="font-bold text-xl">2</span>
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="text-lg font-bold text-white mb-2 m-0">{t('landing_step2_title')}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed m-0">{t('landing_step2_desc')}</p>
                </div>
              </div>
              <div className="relative flex gap-6">
                <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-dark border-2 border-primary/30 text-white">
                  <span className="font-bold text-xl">3</span>
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="text-lg font-bold text-white mb-2 m-0">{t('landing_step3_title')}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed m-0">{t('landing_step3_desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Desktop Steps (horizontal) ── */}
          <div className="hidden lg:grid relative grid-cols-3 gap-12">
            <div className="absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent border-t border-dashed border-primary/50 z-0"></div>
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-[#191320] border-2 border-primary/30 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(140,37,244,0.15)] group-hover:border-primary transition-colors duration-300">
                <span className="text-4xl font-black text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 m-0">{t('landing_step1_title')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs m-0">{t('landing_step1_desc')}</p>
            </div>
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-[#191320] border-2 border-primary/30 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(140,37,244,0.15)] group-hover:border-primary transition-colors duration-300">
                <span className="text-4xl font-black text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 m-0">{t('landing_step2_title')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs m-0">{t('landing_step2_desc')}</p>
            </div>
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-[#191320] border-2 border-primary/30 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(140,37,244,0.15)] group-hover:border-primary transition-colors duration-300">
                <span className="text-4xl font-black text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 m-0">{t('landing_step3_title')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs m-0">{t('landing_step3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── DOWNLOAD APP CTA ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="px-4 lg:px-6 py-12 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl lg:rounded-[2.5rem] glass-card lg:bg-gradient-to-br lg:from-[#1a1225] lg:to-[#0f0b15] border border-primary/20 lg:border-white/10 p-8 lg:p-0 shadow-2xl">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
              {/* Text Content */}
              <div className="flex-1 text-center lg:text-left lg:p-16">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                  <span className="material-symbols-outlined text-green-400 text-lg">phone_android</span>
                  <span className="text-green-400 text-xs font-bold uppercase tracking-wider">App disponible</span>
                </div>
                <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tight mb-4 m-0">
                  Llevá Zophiel en tu bolsillo
                </h2>
                <p className="text-slate-400 text-sm lg:text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0 m-0">
                  Descargá la app para Android y registrá tu dolor en cualquier momento, incluso sin conexión a internet.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start">
                  <a
                    href="/downloads/zophiel.apk"
                    download="zophiel.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 h-14 px-6 rounded-xl bg-white text-[#0f0b15] font-bold text-base shadow-lg hover:bg-slate-100 transition-all active:scale-95 no-underline"
                  >
                    <span className="material-symbols-outlined text-2xl">download</span>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-[10px] font-medium text-slate-500 uppercase">Descargar para</span>
                      <span className="text-sm font-bold">Android</span>
                    </div>
                  </a>
                  <span className="text-slate-500 text-xs lg:text-sm">También disponible como PWA</span>
                </div>
              </div>

              {/* App Mockup (Desktop only) */}
              <div className="hidden lg:flex items-center justify-center w-[280px] py-12 pr-12">
                <div className="relative w-[180px] h-[360px] bg-black rounded-[2rem] border-4 border-slate-800 shadow-xl overflow-hidden">
                  <div className="w-full h-full bg-[#191320] flex flex-col items-center justify-center gap-4 p-6">
                    <div className="size-20 rounded-2xl bg-gradient-to-br from-primary to-purple-900 flex items-center justify-center shadow-lg shadow-primary/30">
                      <ZophielLogo variant="icon" size={40} />
                    </div>
                    <span className="text-white text-lg font-bold">Zophiel</span>
                    <span className="text-slate-400 text-xs text-center">Tu compañero para el dolor crónico</span>
                    <div className="mt-4 w-full h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-xs font-bold">Instalando...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── CTA BANNER ── */}
      {/* Mobile: glass card with heart icon */}
      {/* Desktop: large rounded card with glow */}
      {/* ══════════════════════════════════════════════════════════ */}
      {/* Mobile CTA */}
      <section className="lg:hidden px-4 py-8 mb-4">
        <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden border border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="size-16 bg-gradient-to-tr from-primary to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-white text-3xl">favorite</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight m-0">{t('landing_cta_ready')}</h2>
            <p className="text-slate-300 mb-8 max-w-xs mx-auto m-0">{t('landing_cta_join')}</p>
            <Link to="/auth/register" className="w-full max-w-[280px] py-4 bg-white text-[#0f0b15] font-bold text-lg rounded-xl shadow-lg hover:bg-slate-50 transition-colors active:scale-95 no-underline text-center block">
              {t('landing_cta_create')}
            </Link>
            <p className="mt-4 text-xs text-slate-500 m-0">Sin tarjeta de crédito requerida.</p>
          </div>
        </div>
      </section>

      {/* Desktop CTA */}
      <section className="hidden lg:block py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#2a2235] to-[#141118] border border-white/10 px-8 py-20 text-center shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-50%] left-[20%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[100px]"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 m-0">
                Tomá el control de tu dolor
              </h2>
              <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto m-0">
                Registrá tus síntomas, identificá patrones y compartí informes claros con tu médico.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Link to="/auth/register" className="flex items-center justify-center h-14 px-10 rounded-full bg-white text-[#0f0b15] text-lg font-bold hover:bg-slate-100 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)] no-underline">
                  Crear Cuenta Gratis
                </Link>
                <a href="/downloads/zophiel.apk" download="zophiel.apk" className="flex items-center justify-center gap-2 h-14 px-8 rounded-full border border-white/10 bg-white/5 text-white text-base font-bold hover:bg-white/10 transition-colors no-underline">
                  <span className="material-symbols-outlined text-xl">download</span>
                  Descargar APK
                </a>
              </div>
              <p className="mt-6 text-sm text-slate-500 m-0">Gratis • Sin tarjeta de crédito</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── FOOTER ── */}
      {/* Mobile: minimal centered */}
      {/* Desktop: 4-column grid */}
      {/* ══════════════════════════════════════════════════════════ */}
      {/* Mobile Footer */}
      <footer className="lg:hidden mt-auto py-8 text-center px-6">
        <p className="text-xs text-slate-500 font-medium m-0">
          {t('landing_footer')}
        </p>
      </footer>

      {/* Desktop Footer */}
      <footer className="hidden lg:block border-t border-white/5 bg-[#0a0710] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">stethoscope</span>
                <span className="text-white text-lg font-bold">Zophiel</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed m-0">
                Tecnología avanzada para el manejo del dolor crónico, diseñada con empatía y precisión científica.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 m-0">Producto</h4>
              <ul className="space-y-4 m-0 p-0 list-none">
                <li><a className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" href="#features">Funcionalidades</a></li>
                <li><Link className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" to="/clinics">Para Clínicas</Link></li>
                <li><Link className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" to="/case-studies">Estudios de Caso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 m-0">Compañía</h4>
              <ul className="space-y-4 m-0 p-0 list-none">
                <li><Link className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" to="/about">Sobre Nosotros</Link></li>
                <li><Link className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" to="/blog">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 m-0">Legal</h4>
              <ul className="space-y-4 m-0 p-0 list-none">
                <li><Link className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" to="/privacy">Privacidad</Link></li>
                <li><Link className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" to="/terms">Términos</Link></li>
                <li><Link className="text-slate-400 hover:text-primary text-sm transition-colors no-underline" to="/security">Seguridad</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex justify-between items-center">
            <p className="text-slate-600 text-sm m-0">© 2026 Zophiel. Hecho con <span className="text-primary">💜</span> para quienes viven con dolor.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
