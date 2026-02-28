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

export default function Onboarding({ onComplete, userName }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [diagnosis, setDiagnosis] = useState<DiagnosisOption | ''>('');
  const [customDiagnosis, setCustomDiagnosis] = useState('');
  const [notifLevel, setNotifLevel] = useState<NotificationLevel>('medium');
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('08:00');
  const [saving, setSaving] = useState(false);

  const finalDiagnosis = diagnosis === 'other' ? customDiagnosis : diagnosis ? DIAGNOSIS_LABELS[diagnosis] : '';

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
      // If offline, mark locally and proceed
      onComplete(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="onboarding-page">
      {/* Progress dots */}
      <div className="onboarding-progress">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`progress-dot ${step === i ? 'active' : step > i ? 'done' : ''}`} />
        ))}
      </div>

      {/* Step 0: About you */}
      {step === 0 && (
        <div className="onboarding-step animate-in">
          <div className="onboarding-icon">👤</div>
          <h1 className="onboarding-title">Hola, {userName} 👋</h1>
          <p className="onboarding-subtitle">
            Contanos sobre tu condición para personalizar tu experiencia
          </p>

          <div className="onboarding-card">
            <label className="onboarding-label">¿Cuál es tu padecimiento principal?</label>
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

          <button
            className="onboarding-skip"
            onClick={() => setStep(1)}
          >
            Omitir por ahora
          </button>
        </div>
      )}

      {/* Step 1: Notifications */}
      {step === 1 && (
        <div className="onboarding-step animate-in">
          <div className="onboarding-icon">🔔</div>
          <h1 className="onboarding-title">Notificaciones</h1>
          <p className="onboarding-subtitle">
            Te vamos a recordar registrar tu dolor durante el día
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
            <button className="btn btn-secondary" onClick={() => setStep(0)}>
              ← Atrás
            </button>
            <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}>
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Ready */}
      {step === 2 && (
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
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
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
