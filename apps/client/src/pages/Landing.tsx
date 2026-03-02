import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useI18n, LOCALE_FLAGS, LOCALE_LABELS, type Locale } from '../i18n/index';
import '../styles/landing.css';

const LOCALES: Locale[] = ['es', 'pt', 'fr'];

const FEATURES = [
  { icon: 'accessibility', title: 'Mapa Corporal Interactivo', desc: 'Visualizá tu dolor con precisión anatómica 3D. Marcá zonas exactas y tipos de sensación.' },
  { icon: 'trending_up', title: 'Tendencias IA', desc: 'Nuestros algoritmos detectan patrones entre tu clima, actividad y niveles de dolor.' },
  { icon: 'vital_signs', title: 'Puntaje QoL', desc: 'Medí tu Calidad de Vida diariamente con métricas estandarizadas clínicamente.' },
  { icon: 'notifications_active', title: 'Recordatorios Inteligentes', desc: 'Nunca olvides tus medicamentos o ejercicios. Alertas personalizables y discretas.' },
  { icon: 'wifi_off', title: 'Modo Offline', desc: 'Accedé a tus datos y registrá síntomas sin conexión. Sincronización automática.' },
  { icon: 'lock', title: 'Privacidad Total', desc: 'Tus datos médicos encriptados de extremo a extremo. Nadie más puede verlos.' },
];

const CONDITIONS = [
  { icon: 'accessibility_new', name: 'Fibromialgia', subtag: 'Rastreo de puntos sensibles', desc: 'Registrá puntos de dolor difusos, fatiga y niebla mental. Correlacioná con clima y sueño.' },
  { icon: 'orthopedics', name: 'Artritis', subtag: 'Rigidez matutina', desc: 'Seguí rigidez matutina, inflamación articular y brotes. Registro preciso para tu reumatólogo.' },
  { icon: 'neurology', name: 'Migraña Crónica', subtag: 'Disparadores ambientales', desc: 'Identificá triggers, registrá auras y medicación. Descubrí patrones que desencadenan episodios.' },
  { icon: 'electric_bolt', name: 'Dolor Neuropático', subtag: 'Sensaciones eléctricas', desc: 'Mapeá sensaciones eléctricas, hormigueo y ardor. Distinguí dolor constante de intermitente.' },
  { icon: 'back_hand', name: 'Lumbalgia', subtag: 'Impacto en movilidad', desc: 'Registrá intensidad según actividad y postura. Evaluá efectividad de fisioterapia y ejercicios.' },
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
            Zophiel te ayuda a entender, predecir y controlar tus síntomas mediante herramientas de seguimiento clínico validadas por especialistas.
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
              <span className="material-symbols-rounded stat-icon">accessibility_new</span>
              <div>
                <span className="stat-number">360°</span>
                <span className="stat-label">Mapa corporal interactivo</span>
              </div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="material-symbols-rounded stat-icon">monitoring</span>
              <div>
                <span className="stat-number">24/7</span>
                <span className="stat-label">Seguimiento continuo</span>
              </div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="material-symbols-rounded stat-icon">encrypted</span>
              <div>
                <span className="stat-number">100%</span>
                <span className="stat-label">Privacidad garantizada</span>
              </div>
            </div>
          </div>

          <div className="hero-preview">
            <img src="/dashboard-preview.png" alt="Zophiel Dashboard" className="hero-preview-img" />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features" id="features" ref={featuresRef}>
        <div className="section-container">
          <div className="section-header fade-up">
            <span className="section-tag">Características Premium</span>
            <h2 className="section-title">Herramientas diseñadas para el manejo <span className="text-gradient">clínico del dolor</span></h2>
            <p className="section-desc">Potenciadas por inteligencia artificial y validadas por especialistas.</p>
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
            <span className="section-tag">Especializado en condiciones complejas</span>
            <h2 className="section-title">Adaptado para el seguimiento de <span className="text-gradient">patologías crónicas</span></h2>
            <p className="section-desc">Zophiel entiende las particularidades de cada diagnóstico y se adapta a tus necesidades.</p>
          </div>
          <div className="conditions-grid">
            {CONDITIONS.map((c) => (
              <div className="condition-card fade-up" key={c.name}>
                <div className="condition-icon-wrap">
                  <span className="material-symbols-rounded">{c.icon}</span>
                </div>
                <div className="condition-info">
                  <h3>{c.name}</h3>
                  <span className="condition-subtag">{c.subtag}</span>
                </div>
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
            <p>Únete a miles de usuarios que han recuperado el control de su vida con Zophiel.</p>
            <div className="cta-buttons">
              <button className="btn btn-primary btn-lg btn-glow" onClick={() => navigate('/app')}>
                Crear Cuenta Gratis
              </button>
            </div>
            <p className="cta-note">
              No se requiere tarjeta de crédito para empezar.
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
