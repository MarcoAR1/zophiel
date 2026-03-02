import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useI18n, LOCALE_FLAGS, LOCALE_LABELS, type Locale } from '../i18n/index';
import '../styles/landing.css';

const LOCALES: Locale[] = ['es', 'pt', 'fr'];

export default function Landing() {
  const navigate = useNavigate();
  const { t, locale, setLocale } = useI18n();
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll('.fade-up');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // In native app, skip landing and go to auth/app
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      navigate('/app', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="landing">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        <nav className="landing-nav">
          <div className="landing-logo">🩺 Zophiel</div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div className="lang-switcher">
              {LOCALES.map((loc) => (
                <button
                  key={loc}
                  className={`lang-btn ${locale === loc ? 'active' : ''}`}
                  onClick={() => setLocale(loc)}
                  title={LOCALE_LABELS[loc]}
                >
                  {LOCALE_FLAGS[loc]}
                </button>
              ))}
            </div>
            <button className="btn btn-ghost" onClick={() => navigate('/app')}>
              {t('landing_signin')}
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-badge">{t('landing_badge')}</div>
          <h1 className="hero-title">
            {t('landing_title_1')}<span className="text-gradient">{t('landing_title_highlight')}</span>{t('landing_title_2')}
          </h1>
          <p className="hero-subtitle">{t('landing_subtitle')}</p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg btn-glow" onClick={() => navigate('/app')}>
              {t('landing_cta_start')}
            </button>
            <a
              href="/downloads/zophiel.apk"
              download
              className="btn btn-lg btn-android"
            >
              📱 Android APK
            </a>
            <button className="btn btn-outline btn-lg" onClick={scrollToFeatures}>
              {t('landing_cta_learn')}
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">360°</span>
              <span className="stat-label">{t('landing_stat_map')}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">{t('landing_stat_tracking')}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">{t('landing_stat_private')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features" ref={featuresRef}>
        <div className="section-container">
          <div className="section-header fade-up">
            <span className="section-tag">{t('landing_features_tag')}</span>
            <h2 className="section-title">{t('landing_features_title')}</h2>
            <p className="section-desc">{t('landing_features_desc')}</p>
          </div>
          <div className="features-grid">
            <div className="feature-card fade-up">
              <div className="feature-icon">🫀</div>
              <h3>{t('landing_feat_body')}</h3>
              <p>{t('landing_feat_body_desc')}</p>
            </div>
            <div className="feature-card fade-up">
              <div className="feature-icon">📊</div>
              <h3>{t('landing_feat_analytics')}</h3>
              <p>{t('landing_feat_analytics_desc')}</p>
            </div>
            <div className="feature-card fade-up">
              <div className="feature-icon">🧠</div>
              <h3>{t('landing_feat_qol')}</h3>
              <p>{t('landing_feat_qol_desc')}</p>
            </div>
            <div className="feature-card fade-up">
              <div className="feature-icon">🔔</div>
              <h3>{t('landing_feat_notifications')}</h3>
              <p>{t('landing_feat_notifications_desc')}</p>
            </div>
            <div className="feature-card fade-up">
              <div className="feature-icon">📴</div>
              <h3>{t('landing_feat_offline')}</h3>
              <p>{t('landing_feat_offline_desc')}</p>
            </div>
            <div className="feature-card fade-up">
              <div className="feature-icon">🔒</div>
              <h3>{t('landing_feat_privacy')}</h3>
              <p>{t('landing_feat_privacy_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-it-works">
        <div className="section-container">
          <div className="section-header fade-up">
            <span className="section-tag">{t('landing_how_tag')}</span>
            <h2 className="section-title">{t('landing_how_title')}</h2>
          </div>
          <div className="steps">
            <div className="step fade-up">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>{t('landing_step1_title')}</h3>
                <p>{t('landing_step1_desc')}</p>
              </div>
            </div>
            <div className="step-connector" />
            <div className="step fade-up">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>{t('landing_step2_title')}</h3>
                <p>{t('landing_step2_desc')}</p>
              </div>
            </div>
            <div className="step-connector" />
            <div className="step fade-up">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>{t('landing_step3_title')}</h3>
                <p>{t('landing_step3_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chronic Conditions ── */}
      <section className="conditions">
        <div className="section-container">
          <div className="section-header fade-up">
            <span className="section-tag">🏥 Condiciones</span>
            <h2 className="section-title">Diseñado para quienes viven con dolor crónico</h2>
            <p className="section-desc">Zophiel entiende las particularidades de cada condición y se adapta a tus necesidades.</p>
          </div>
          <div className="conditions-grid">
            <div className="condition-card fade-up">
              <div className="condition-icon">🦋</div>
              <h3>Fibromialgia</h3>
              <p>Registrá los puntos de dolor difusos, fatiga y niebla mental. Correlacioná síntomas con clima, sueño y estrés.</p>
            </div>
            <div className="condition-card fade-up">
              <div className="condition-icon">🦴</div>
              <h3>Artritis Reumatoide</h3>
              <p>Seguí la rigidez matutina, inflamación articular y brotes. Llevá un registro preciso para tu reumatólogo.</p>
            </div>
            <div className="condition-card fade-up">
              <div className="condition-icon">🧠</div>
              <h3>Migraña Crónica</h3>
              <p>Identificá triggers, registrá auras y medicación. Descubrí patrones que desencadenan tus episodios.</p>
            </div>
            <div className="condition-card fade-up">
              <div className="condition-icon">⚡</div>
              <h3>Dolor Neuropático</h3>
              <p>Mapeá sensaciones eléctricas, hormigueo y ardor. Distinguí entre dolor constante e intermitente.</p>
            </div>
            <div className="condition-card fade-up">
              <div className="condition-icon">🔄</div>
              <h3>Dolor Lumbar Crónico</h3>
              <p>Registrá intensidad según actividad y postura. Evaluá la efectividad de fisioterapia y ejercicios.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-card fade-up">
            <h2>{t('landing_cta_ready')}</h2>
            <p>{t('landing_cta_join')}</p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-lg btn-glow" onClick={() => navigate('/app')}>
                {t('landing_cta_create')}
              </button>
              <a
                href="/downloads/zophiel.apk"
                download
                className="btn btn-lg btn-android"
              >
                📱 Android APK
              </a>
            </div>
            <p className="cta-note">
              También disponible como PWA instalable desde el navegador
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="landing-logo">🩺 Zophiel</span>
              <p>{t('auth_tagline')}</p>
            </div>
            <div className="footer-links">
              <button onClick={() => navigate('/app')}>{t('landing_signin')}</button>
              <button onClick={scrollToFeatures}>{t('landing_features_link')}</button>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{t('landing_footer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
