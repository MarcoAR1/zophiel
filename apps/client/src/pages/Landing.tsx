import { Link } from 'react-router-dom';
import ZophielLogo from '../components/ZophielLogo';
import { useI18n } from '../i18n/index';

/**
 * Landing page — faithfully reproduced from Stitch PRO mobile landing HTML
 * Using exact same Tailwind classes from stitch/landing-mobile.html
 */
export default function Landing() {
  const { t } = useI18n();

  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col antialiased selection:bg-primary selection:text-white">
      {/* ── Navbar (exact Stitch) ── */}
      <nav className="sticky top-0 z-50 w-full glass-card border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 no-underline text-inherit">
            <ZophielLogo size={40} variant="icon" className="rounded-xl shadow-lg shadow-primary/20" />
            <span className="text-xl font-bold tracking-tight text-white">Zophiel</span>
          </Link>
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors no-underline">{t('landing_features_link')}</a>
            <a href="#how" className="text-sm font-medium text-slate-400 hover:text-white transition-colors no-underline">Cómo funciona</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors no-underline">
              Login
            </Link>
            <Link to="/auth" className="hidden md:inline-flex px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold no-underline hover:bg-primary/90 transition-colors">
              Crear Cuenta
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section (exact Stitch) ── */}
      <header className="relative overflow-hidden px-4 pt-8 pb-12 md:pt-20 md:pb-24">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Version Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-6 backdrop-blur-md">
            <span className="flex size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-purple-200">Nueva Versión 2.0 Disponible</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] mb-4 text-white">
            {t('landing_title_1')} <br />
            <span className="text-gradient-primary">{t('landing_title_highlight')}</span> <br />
            {t('landing_title_2')}
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto mb-8 font-light">
            {t('landing_subtitle')}
          </p>

          {/* CTA Button (exact Stitch) */}
          <Link
            to="/auth"
            className="group relative flex w-full max-w-[320px] items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 p-[1px] shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95 no-underline"
          >
            <div className="relative flex h-12 w-full items-center justify-center rounded-xl bg-transparent px-6 transition-all group-hover:bg-white/5">
              <span className="text-base font-bold text-white">{t('landing_cta_start')}</span>
              <span className="material-symbols-outlined ml-2 text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </Link>

          {/* Trust Indicators (exact Stitch) */}
          <div className="mt-12 grid grid-cols-3 gap-3 w-full max-w-lg">
            <div className="glass-card flex flex-col items-center justify-center p-3 rounded-xl gap-2 text-center">
              <span className="material-symbols-outlined text-primary text-2xl">body_system</span>
              <span className="text-[11px] font-medium leading-tight text-slate-300">{t('landing_stat_map')}</span>
            </div>
            <div className="glass-card flex flex-col items-center justify-center p-3 rounded-xl gap-2 text-center">
              <span className="material-symbols-outlined text-primary text-2xl">monitoring</span>
              <span className="text-[11px] font-medium leading-tight text-slate-300">{t('landing_stat_tracking')}</span>
            </div>
            <div className="glass-card flex flex-col items-center justify-center p-3 rounded-xl gap-2 text-center">
              <span className="material-symbols-outlined text-primary text-2xl">encrypted</span>
              <span className="text-[11px] font-medium leading-tight text-slate-300">{t('landing_stat_private')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Features Section (exact Stitch) ── */}
      <section id="features" className="px-4 py-8 bg-gradient-to-b from-transparent to-surface-dark/30 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 px-2 text-center md:text-left max-w-4xl mx-auto">{t('landing_features_title')}</h2>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Feature cards (exact Stitch classes) */}
          {[
            { icon: 'accessibility_new', title: t('landing_feat_body'), desc: t('landing_feat_body_desc') },
            { icon: 'trending_up', title: t('landing_feat_analytics'), desc: t('landing_feat_analytics_desc') },
            { icon: 'vital_signs', title: t('landing_feat_qol'), desc: t('landing_feat_qol_desc') },
            { icon: 'cloud_off', title: t('landing_feat_offline'), desc: t('landing_feat_offline_desc') },
          ].map((f) => (
            <div key={f.icon} className="glass-card rounded-2xl p-5 flex items-start gap-4 cursor-pointer group hover:bg-[rgba(48,40,57,0.6)] hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300">
              <div className="size-12 rounded-xl bg-surface-dark flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl">{f.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-purple-300 transition-colors">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works (exact Stitch) ── */}
      <section id="how" className="px-4 py-12 relative overflow-hidden md:py-20">
        {/* Abstract decoration */}
        <div className="absolute right-0 top-1/3 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-10">Cómo funciona Zophiel</h2>

        <div className="relative max-w-md mx-auto md:max-w-4xl">
          {/* Mobile: vertical connecting line | Desktop: hidden */}
          <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/80 via-primary/30 to-transparent md:hidden" />

          <div className="flex flex-col gap-10 md:flex-row md:gap-8">
            {[
              { num: '1', title: t('landing_step1_title'), desc: t('landing_step1_desc'), border: 'border-primary', glow: 'shadow-[0_0_15px_rgba(140,37,244,0.3)]' },
              { num: '2', title: t('landing_step2_title'), desc: t('landing_step2_desc'), border: 'border-primary/60', glow: '' },
              { num: '3', title: t('landing_step3_title'), desc: t('landing_step3_desc'), border: 'border-primary/30', glow: '' },
            ].map((step) => (
              <div key={step.num} className="relative flex gap-6 md:flex-col md:items-center md:text-center md:flex-1">
                <div className={`relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-dark border-2 ${step.border} text-white ${step.glow}`}>
                  <span className="font-bold text-xl">{step.num}</span>
                </div>
                <div className="flex flex-col pt-1 md:pt-3">
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA (exact Stitch) ── */}
      <section className="px-4 py-8 mb-4 md:py-16 max-w-4xl mx-auto w-full">
        <div className="glass-card rounded-3xl p-8 md:p-12 text-center relative overflow-hidden border border-primary/20">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="size-16 bg-gradient-to-tr from-primary to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-white text-3xl">favorite</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{t('landing_cta_ready')}</h2>
            <p className="text-slate-300 mb-8 max-w-xs mx-auto">{t('landing_cta_join')}</p>
            <Link
              to="/auth"
              className="w-full max-w-[280px] py-4 bg-white text-[#701ec2] font-bold text-lg rounded-xl shadow-lg hover:bg-slate-50 transition-colors active:scale-95 no-underline text-center inline-block"
            >
              {t('landing_cta_create')}
            </Link>
            <p className="mt-4 text-xs text-slate-500">Sin tarjeta de crédito requerida.</p>
          </div>
        </div>
      </section>

      {/* ── Footer (exact Stitch) ── */}
      <footer className="mt-auto py-8 text-center px-6">
        <p className="text-xs text-slate-500 font-medium">
          {t('landing_footer')}
        </p>
      </footer>
    </div>
  );
}
