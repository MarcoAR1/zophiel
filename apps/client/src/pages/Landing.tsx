import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
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
          <button className="btn btn-ghost" onClick={() => navigate('/app')}>
            Iniciar Sesión
          </button>
        </nav>

        <div className="hero-content">
          <div className="hero-badge">✨ Tu salud, tu control</div>
          <h1 className="hero-title">
            Gestioná tu <span className="text-gradient">dolor crónico</span> con inteligencia
          </h1>
          <p className="hero-subtitle">
            Registrá síntomas, seguí tendencias y mejorá tu calidad de vida con datos reales. 
            Todo desde una app diseñada para vos.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg btn-glow" onClick={() => navigate('/app')}>
              Empezar Gratis
            </button>
            <button className="btn btn-outline btn-lg" onClick={scrollToFeatures}>
              Conocer más
            </button>
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
              <span className="stat-label">Privado</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features" ref={featuresRef}>
        <div className="section-container">
          <div className="section-header fade-up">
            <span className="section-tag">Funcionalidades</span>
            <h2 className="section-title">Todo lo que necesitás para entender tu dolor</h2>
            <p className="section-desc">
              Herramientas diseñadas por y para personas con dolor crónico.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card fade-up">
              <div className="feature-icon">🫀</div>
              <h3>Mapa Corporal Interactivo</h3>
              <p>Tocá exactamente dónde sentís dolor en un modelo 360° del cuerpo humano — frente y espalda.</p>
            </div>
            <div className="feature-card fade-up">
              <div className="feature-icon">📊</div>
              <h3>Tendencias y Analíticas</h3>
              <p>Visualizá patrones de dolor a lo largo del tiempo con gráficos claros e intuitivos.</p>
            </div>
            <div className="feature-card fade-up">
              <div className="feature-icon">🧠</div>
              <h3>Calidad de Vida</h3>
              <p>Seguí tu índice QoL combinando dolor, ánimo, actividad y sueño en un solo score.</p>
            </div>
            <div className="feature-card fade-up">
              <div className="feature-icon">🔔</div>
              <h3>Recordatorios Inteligentes</h3>
              <p>Notificaciones configurables que te ayudan a mantener un registro consistente.</p>
            </div>
            <div className="feature-card fade-up">
              <div className="feature-icon">📴</div>
              <h3>Funciona Offline</h3>
              <p>Registrá datos sin conexión. Se sincronizan automáticamente cuando volvés a estar online.</p>
            </div>
            <div className="feature-card fade-up">
              <div className="feature-icon">🔒</div>
              <h3>Privacidad Total</h3>
              <p>Tus datos son solo tuyos. Encriptación de extremo a extremo y sin venta de información.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-it-works">
        <div className="section-container">
          <div className="section-header fade-up">
            <span className="section-tag">¿Cómo funciona?</span>
            <h2 className="section-title">3 pasos para tomar el control</h2>
          </div>

          <div className="steps">
            <div className="step fade-up">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Registrá</h3>
                <p>Creá tu cuenta gratis y empezá a registrar dolor, síntomas y estado de ánimo en segundos.</p>
              </div>
            </div>
            <div className="step-connector" />
            <div className="step fade-up">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Descubrí</h3>
                <p>Zophiel analiza tus datos y te muestra patrones, correlaciones y tendencias de tu dolor.</p>
              </div>
            </div>
            <div className="step-connector" />
            <div className="step fade-up">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Mejorá</h3>
                <p>Usá los insights para hablar con tu médico con datos concretos y tomar mejores decisiones.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-card fade-up">
            <h2>¿Listo para entender tu dolor?</h2>
            <p>Uníte a las personas que ya gestionan su dolor crónico de forma inteligente.</p>
            <button className="btn btn-primary btn-lg btn-glow" onClick={() => navigate('/app')}>
              Crear Cuenta Gratis
            </button>
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
              <button onClick={scrollToFeatures}>Funcionalidades</button>
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
