import { useState } from 'react';
import { api } from '../services/api';
import {
  DIAGNOSIS_OPTIONS,
  DIAGNOSIS_LABELS,
  DIAGNOSIS_ICONS,
  NOTIFICATION_LEVELS,
  NOTIFICATION_SCHEDULES,
  type DiagnosisOption,
  type NotificationLevel,
} from '@zophiel/shared';

interface OnboardingProps {
  onComplete: (userData: any) => void;
  userName: string;
}

const LEVEL_LABELS: Record<NotificationLevel, string> = {
  low: '🔕 Bajo — 2 recordatorios/día',
  medium: '🔔 Medio — 4 recordatorios/día',
  high: '🔔🔔 Alto — 6 recordatorios/día',
};

const PAIN_DURATIONS = [
  { value: '<1', label: '< 1 año' },
  { value: '1-3', label: '1-3 años' },
  { value: '3-5', label: '3-5 años' },
  { value: '5+', label: '5+ años' },
];

const TREATMENTS = [
  { key: 'medication', icon: '💊', label: 'Medicación' },
  { key: 'physio', icon: '🏋️', label: 'Fisioterapia' },
  { key: 'cbt', icon: '🧠', label: 'Terapia cognitiva' },
  { key: 'acupuncture', icon: '📍', label: 'Acupuntura' },
  { key: 'cannabis', icon: '🌿', label: 'Cannabis medicinal' },
  { key: 'none', icon: '❌', label: 'Ninguno' },
];

const TOTAL_STEPS = 4;

export default function Onboarding({ onComplete, userName }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [diagnosis, setDiagnosis] = useState<DiagnosisOption | ''>('');
  const [customDiagnosis, setCustomDiagnosis] = useState('');
  const [painDuration, setPainDuration] = useState('');
  const [treatments, setTreatments] = useState<string[]>([]);
  const [notifLevel, setNotifLevel] = useState<NotificationLevel>('medium');
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('08:00');
  const [saving, setSaving] = useState(false);

  const finalDiagnosis = diagnosis === 'other' ? customDiagnosis : diagnosis ? DIAGNOSIS_LABELS[diagnosis] : '';

  const toggleTreatment = (key: string) => {
    setTreatments((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const result = await api.onboarding.complete({
        diagnosis: finalDiagnosis || undefined,
        notificationLevel: notifLevel,
        quietHoursStart: quietStart,
        quietHoursEnd: quietEnd,
      });
      onComplete(result);
    } catch {
      onComplete(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="onboarding-page">
      {/* Progress dots */}
      <div className="onboarding-progress">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className={`progress-dot ${step === i ? 'active' : step > i ? 'done' : ''}`} />
        ))}
      </div>

      {/* Step 0: Welcome + Condition */}
      {step === 0 && (
        <div className="onboarding-step animate-in">
          <div className="onboarding-icon">🩺</div>
          <h1 className="onboarding-title">Bienvenido, {userName} 👋</h1>
          <p className="onboarding-subtitle">
            Tu compañero inteligente en el manejo del dolor crónico. Contanos sobre tu condición para personalizar tu experiencia.
          </p>

          <div className="onboarding-card">
            <label className="onboarding-label">¿Qué condición de dolor tenés?</label>
            <div className="diagnosis-grid">
              {DIAGNOSIS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`diagnosis-chip ${diagnosis === opt ? 'active' : ''}`}
                  onClick={() => setDiagnosis(diagnosis === opt ? '' : opt)}
                >
                  <span className="diagnosis-icon">{DIAGNOSIS_ICONS[opt]}</span>
                  <span className="diagnosis-label">{DIAGNOSIS_LABELS[opt]}</span>
                </button>
              ))}
            </div>

            {diagnosis === 'other' && (
              <input
                className="input"
                placeholder="Describí tu condición..."
                value={customDiagnosis}
                onChange={(e) => setCustomDiagnosis(e.target.value)}
                style={{ marginTop: 'var(--space-md)' }}
                autoFocus
              />
            )}
          </div>

          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={() => setStep(1)}
          >
            Continuar →
          </button>
          <button className="onboarding-skip" onClick={() => setStep(1)}>
            Omitir por ahora
          </button>
        </div>
      )}

      {/* Step 1: Pain Profile */}
      {step === 1 && (
        <div className="onboarding-step animate-in">
          <div className="onboarding-icon">💪</div>
          <h1 className="onboarding-title">Tu perfil de dolor</h1>
          <p className="onboarding-subtitle">
            Esta información nos ayuda a personalizar tus reportes y detectar patrones relevantes.
          </p>

          <div className="onboarding-card">
            <label className="onboarding-label">¿Hace cuánto convivís con dolor crónico?</label>
            <div className="duration-options">
              {PAIN_DURATIONS.map((d) => (
                <button
                  key={d.value}
                  className={`duration-chip ${painDuration === d.value ? 'active' : ''}`}
                  onClick={() => setPainDuration(painDuration === d.value ? '' : d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <label className="onboarding-label" style={{ marginTop: 'var(--space-lg)' }}>
              ¿Qué tratamientos probaste?
            </label>
            <div className="treatment-grid">
              {TREATMENTS.map((t) => (
                <button
                  key={t.key}
                  className={`treatment-chip ${treatments.includes(t.key) ? 'active' : ''}`}
                  onClick={() => toggleTreatment(t.key)}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="onboarding-nav">
            <button className="btn btn-secondary" onClick={() => setStep(0)}>
              ← Atrás
            </button>
            <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}>
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Notifications */}
      {step === 2 && (
        <div className="onboarding-step animate-in">
          <div className="onboarding-icon">🔔</div>
          <h1 className="onboarding-title">Recordatorios</h1>
          <p className="onboarding-subtitle">
            Te ayudamos a mantener un registro consistente para que tu médico tenga datos reales.
          </p>

          <div className="onboarding-card">
            <label className="onboarding-label">Frecuencia de recordatorios</label>
            <div className="notif-options">
              {NOTIFICATION_LEVELS.map((level) => (
                <button
                  key={level}
                  className={`notif-option ${notifLevel === level ? 'active' : ''}`}
                  onClick={() => setNotifLevel(level)}
                >
                  <span className="notif-option-text">{LEVEL_LABELS[level]}</span>
                  <span className="notif-option-schedule">
                    {NOTIFICATION_SCHEDULES[level].join(' · ')}
                  </span>
                </button>
              ))}
            </div>

            <label className="onboarding-label" style={{ marginTop: 'var(--space-lg)' }}>
              Horas silenciosas
            </label>
            <div className="quiet-hours">
              <div className="input-group">
                <label>Desde</label>
                <input className="input" type="time" value={quietStart} onChange={(e) => setQuietStart(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Hasta</label>
                <input className="input" type="time" value={quietEnd} onChange={(e) => setQuietEnd(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="onboarding-nav">
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              ← Atrás
            </button>
            <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Ready */}
      {step === 3 && (
        <div className="onboarding-step animate-in">
          <div className="onboarding-icon" style={{ fontSize: '4rem' }}>🩺</div>
          <h1 className="onboarding-title">¡Todo listo!</h1>
          <p className="onboarding-subtitle">
            Tu configuración está lista. Podés cambiarla en cualquier momento desde Configuración.
          </p>

          <div className="onboarding-card">
            <div className="onboarding-summary">
              {finalDiagnosis && (
                <div className="summary-row">
                  <span className="summary-label">Condición</span>
                  <span className="summary-value">{finalDiagnosis}</span>
                </div>
              )}
              {painDuration && (
                <div className="summary-row">
                  <span className="summary-label">Duración</span>
                  <span className="summary-value">{PAIN_DURATIONS.find(d => d.value === painDuration)?.label}</span>
                </div>
              )}
              {treatments.length > 0 && (
                <div className="summary-row">
                  <span className="summary-label">Tratamientos</span>
                  <span className="summary-value">
                    {treatments.map(t => TREATMENTS.find(tr => tr.key === t)?.label).join(', ')}
                  </span>
                </div>
              )}
              <div className="summary-row">
                <span className="summary-label">Recordatorios</span>
                <span className="summary-value">{LEVEL_LABELS[notifLevel].split(' — ')[1]}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Silencio</span>
                <span className="summary-value">{quietStart} - {quietEnd}</span>
              </div>
            </div>
          </div>

          <div className="onboarding-nav">
            <button className="btn btn-secondary" onClick={() => setStep(2)}>
              ← Atrás
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleComplete}
              disabled={saving}
            >
              {saving ? 'Guardando...' : '🚀 Empezar a registrar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
