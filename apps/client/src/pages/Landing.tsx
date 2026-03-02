import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useI18n, LOCALE_FLAGS, LOCALE_LABELS, type Locale } from '../i18n/index';
import '../styles/landing.css';

const LOCALES: Locale[] = ['es', 'pt', 'fr'];

const FEATURES = [
  { icon: 'accessibility_new', title: 'Mapa Corporal Interactivo', desc: 'Visualizá y localizá tu dolor con precisión anatómica en un modelo detallado del cuerpo humano.' },
  { icon: 'query_stats', title: 'Tendencias y Análisis', desc: 'Identificá patrones estacionales y disparadores con gráficos impulsados por inteligencia artificial.' },
  { icon: 'favorite', title: 'Calidad de Vida (QoL)', desc: 'Medí el impacto real del dolor en tu rutina diaria mediante métricas médicas estandarizadas.' },
  { icon: 'notifications_active', title: 'Recordatorios Inteligentes', desc: 'Nunca olvides registrar tus síntomas con alertas contextuales personalizadas a tu rutina.' },
  { icon: 'cloud_off', title: 'Modo Offline', desc: 'Registrá tus datos incluso sin conexión. Sincronización automática cuando vuelvas a estar online.' },
  { icon: 'encrypted', title: 'Privacidad Total', desc: 'Tus datos médicos están encriptados de extremo a extremo y bajo tu control absoluto.' },
];

const CONDITIONS = [
  { icon: '🦋', name: 'Fibromialgia', desc: 'Registrá puntos de dolor difusos, fatiga y niebla mental. Correlacioná con clima y sueño.' },
  { icon: '🦴', name: 'Artritis Reumatoide', desc: 'Seguí rigidez matutina, inflamación articular y brotes. Registro preciso para tu reumatólogo.' },
  { icon: '🧠', name: 'Migraña Crónica', desc: 'Identificá triggers, registrá auras y medicación. Descubrí patrones que desencadenan episodios.' },
  { icon: '⚡', name: 'Dolor Neuropático', desc: 'Mapeá sensaciones eléctricas, hormigueo y ardor. Distinguí dolor constante de intermitente.' },
  { icon: '🔄', name: 'Lumbalgia Crónica', desc: 'Registrá intensidad según actividad y postura. Evaluá efectividad de fisioterapia y ejercicios.' },
];

const STEPS = [
  { num: '1', title: 'Registrá', desc: 'Anotá tus síntomas y niveles de dolor en segundos usando nuestro mapa interactivo.' },
  { num: '2', title: 'Descubrí', desc: 'Nuestra IA analiza tus datos para encontrar qué actividades o climas disparan tu dolor.' },
  { num: '3', title: 'Mejorá', desc: 'Ajustá tu tratamiento basándote en evidencia real y compartí reportes con tu médico.' },
];

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

  // In native app, skip landing and go to auth/app
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      navigate('/app', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="landing">
      {/* Material Symbols font */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0" rel="stylesheet" />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        <nav className="landing-nav">
          <div className="landing-logo">🩺 Zophiel</div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Características</a>
            <a href="#how-it-works" className="nav-link">Cómo funciona</a>
            <a href="#conditions" className="nav-link">Condiciones</a>
          </div>
          <div className="nav-right">
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
          <div className="hero-badge">
            <span className="material-symbols-rounded">neurology</span>
            Inteligencia Médica Avanzada
          </div>
          <h1 className="hero-title">
            Gestioná tu <span className="text-gradient">dolor crónico</span> con inteligencia
          </h1>
          <p className="hero-subtitle">
            Seguí tus síntomas, descubrí patrones y mejorá tu calidad de vida con tecnología avanzada de mapeo y análisis biométrico.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg btn-glow" onClick={() => navigate('/app')}>
              Empezar Gratis
            </button>
            <a href="/downloads/zophiel.apk" download className="btn btn-lg btn-android">
              <span className="material-symbols-rounded">smartphone</span>
              Android APK
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">360°</span>
              <span className="stat-label">Mapa corporal</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Seguimiento</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Privacidad</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features" id="features" ref={featuresRef}>
        <div className="section-container">
          <div className="section-header fade-up">
            <span className="section-tag">✨ Funcionalidades</span>
            <h2 className="section-title">Todo lo que necesitás para tu bienestar</h2>
            <p className="section-desc">Herramientas diseñadas por expertos médicos para el manejo integral del dolor crónico.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card fade-up" key={f.icon}>
                <div className="feature-icon">
                  <span className="material-symbols-rounded">{f.icon}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-container">
          <div className="section-header fade-up">
            <span className="section-tag">🔬 ¿Cómo funciona?</span>
            <h2 className="section-title">Tres pasos para retomar el control</h2>
            <p className="section-desc">Un proceso simple respaldado por ciencia e inteligencia artificial.</p>
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div key={s.num}>
                <div className="step fade-up">
                  <div className="step-number">{s.num}</div>
                  <div className="step-content">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chronic Conditions ── */}
      <section className="conditions" id="conditions">
        <div className="section-container">
          <div className="section-header fade-up">
            <span className="section-tag">🏥 Especializado</span>
            <h2 className="section-title">Optimizado para condiciones complejas</h2>
            <p className="section-desc">Zophiel entiende las particularidades de cada diagnóstico crónico y se adapta a tus necesidades.</p>
          </div>
          <div className="conditions-grid">
            {CONDITIONS.map((c) => (
              <div className="condition-card fade-up" key={c.name}>
                <div className="condition-icon">{c.icon}</div>
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-card fade-up">
            <h2>¿Listo para transformar tu gestión del dolor?</h2>
            <p>Unite a las personas que ya usan Zophiel para entender mejor su cuerpo y mejorar su calidad de vida.</p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-lg btn-glow" onClick={() => navigate('/app')}>
                Crear cuenta gratis
              </button>
              <a href="/downloads/zophiel.apk" download className="btn btn-lg btn-android">
                <span className="material-symbols-rounded">smartphone</span>
                Android APK
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
              <p>Tu compañero en el manejo del dolor crónico</p>
            </div>
            <div className="footer-links">
              <button onClick={() => navigate('/app')}>Iniciar Sesión</button>
              <a href="#features">Funcionalidades</a>
              <a href="#conditions">Condiciones</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Zophiel — Hecho con 💜 para quienes viven con dolor</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
