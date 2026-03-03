import { useState } from 'react';
import { api } from '../services/api';
import {
  DIAGNOSIS_OPTIONS,
  DIAGNOSIS_LABELS,
  NOTIFICATION_LEVELS,
  NOTIFICATION_SCHEDULES,
  type DiagnosisOption,
  type NotificationLevel,
} from '@zophiel/shared';
import ZophielLogo from '../components/ZophielLogo';
import {
  StitchButton,
  StitchProgressDots,
  StitchTopBar,
  StitchCard,
  StitchToggle,
  StitchChip,
  StitchPill,
  StitchInput,
} from '../components/Stitch';

interface OnboardingProps {
  onComplete: (userData: any) => void;
  userName: string;
}

const LEVEL_LABELS: Record<NotificationLevel, string> = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
};

const LEVEL_DESC: Record<NotificationLevel, string> = {
  low: '2 recordatorios/día',
  medium: '4 recordatorios/día',
  high: '6 recordatorios/día',
};

const LEVEL_ICONS: Record<NotificationLevel, string> = {
  low: 'notifications_paused',
  medium: 'edit_notifications',
  high: 'notifications_active',
};

const PAIN_DURATIONS = [
  { value: '<1', label: 'Menos de 1 año', icon: 'schedule' },
  { value: '1-3', label: '1-3 años', icon: 'date_range' },
  { value: '3+', label: 'Más de 3 años', icon: 'history' },
];

const TREATMENTS = [
  { key: 'physio', label: 'Fisioterapia' },
  { key: 'meditation', label: 'Meditación' },
  { key: 'medication', label: 'Medicación' },
  { key: 'cannabis', label: 'CBD' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'acupuncture', label: 'Acupuntura' },
];

/* Material icon mapping for diagnosis options */
const DIAGNOSIS_MATERIAL_ICONS: Record<string, string> = {
  fibromyalgia: 'healing',
  rheumatoid_arthritis: 'pulmonology',
  chronic_migraine: 'psychology',
  lower_back: 'accessibility_new',
  neuropathy: 'monitor_heart',
  other: 'add_circle',
};

const TOTAL_STEPS = 4;

/**
 * Onboarding — Stitch Pro multi-step wizard with reusable components
 */
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
    <div className="bg-background-dark min-h-screen font-display text-slate-100 flex flex-col">

      {/* ─── Top bar ─── */}
      <StitchTopBar
        title={
          step === 0 ? '🩺 Zophiel' :
          step === 1 ? 'Condiciones' :
          step === 2 ? 'Tu Dolor' :
          'Preferencias'
        }
        onBack={step > 0 ? () => setStep(step - 1) : undefined}
        showBack={step > 0}
      />

      {/* ─── Progress dots ─── */}
      <StitchProgressDots total={TOTAL_STEPS} current={step} />

      {/* ════════════════════════════════════════════════════ */}
      {/* Step 0: Welcome — Stitch Pro: illustration card     */}
      {/* ════════════════════════════════════════════════════ */}
      {step === 0 && (
        <div className="flex-1 flex flex-col px-6 pb-12">
          <h1 className="text-[28px] font-bold text-white text-center tracking-tight pb-3 pt-4">
            Bienvenido a Zophiel
          </h1>

          {/* Hero illustration — Stitch Pro radial glow card */}
          <div className="flex w-full grow py-4">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center border border-primary/10 relative overflow-hidden min-h-[200px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
              <div className="relative z-10 flex flex-col items-center">
                <ZophielLogo size={80} />
                <div className="mt-4 w-32 h-1 bg-primary/40 rounded-full" />
              </div>
              <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-background-dark/80 to-transparent" />
            </div>
          </div>

          <p className="text-slate-400 text-base font-normal leading-relaxed pb-6 px-2 text-center">
            Tu aliado inteligente en la gestión personalizada del dolor crónico.
          </p>

          <StitchButton onClick={() => setStep(1)} icon="arrow_forward">
            Comenzar mi perfil
          </StitchButton>
        </div>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/* Step 1: Conditions — Stitch Pro: glass tile grid    */}
      {/* ════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="flex-1 flex flex-col px-6 pb-12">
          <div className="py-4">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">¿Cuál es tu diagnóstico?</h3>
            <p className="text-slate-500 text-center text-sm mb-6">
              Selecciona todas las que apliquen para personalizar tu experiencia.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {DIAGNOSIS_OPTIONS.map((opt) => (
                <StitchCard
                  key={opt}
                  selected={diagnosis === opt}
                  onClick={() => setDiagnosis(diagnosis === opt ? '' : opt)}
                  className="p-4 flex flex-col items-center text-center gap-2"
                >
                  <span className={`material-symbols-outlined text-2xl ${diagnosis === opt ? 'text-primary' : 'text-slate-400'}`}>
                    {DIAGNOSIS_MATERIAL_ICONS[opt] || 'add_circle'}
                  </span>
                  <span className="text-sm font-medium">{DIAGNOSIS_LABELS[opt]}</span>
                </StitchCard>
              ))}
            </div>

            {diagnosis === 'other' && (
              <div className="mt-4">
                <StitchInput
                  value={customDiagnosis}
                  onChange={setCustomDiagnosis}
                  placeholder="Describí tu condición..."
                  autoFocus
                />
              </div>
            )}
          </div>

          <div className="mt-auto">
            <StitchButton onClick={() => setStep(2)} icon="arrow_forward">
              Continuar
            </StitchButton>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/* Step 2: Pain Profile — Stitch Pro: pills + chips    */}
      {/* ════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="flex-1 flex flex-col px-6 pb-12">
          <div className="py-4 flex-grow overflow-y-auto">
            {/* Duration — vertical pills with icons */}
            <h3 className="text-xl font-bold text-white mb-4">¿Cuánto tiempo llevás así?</h3>
            <div className="flex flex-col gap-2 mb-8">
              {PAIN_DURATIONS.map((d) => (
                <StitchPill
                  key={d.value}
                  label={d.label}
                  icon={d.icon}
                  selected={painDuration === d.value}
                  onClick={() => setPainDuration(painDuration === d.value ? '' : d.value)}
                />
              ))}
            </div>

            {/* Treatments — chips with label */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white m-0">Tratamientos actuales</h3>
              <span className="text-primary text-xs font-semibold uppercase">Opcional</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {TREATMENTS.map((t) => (
                <StitchChip
                  key={t.key}
                  label={t.label}
                  selected={treatments.includes(t.key)}
                  onClick={() => toggleTreatment(t.key)}
                />
              ))}
            </div>

            {/* Info note — Stitch Pro style */}
            <div className="flex items-start gap-3 p-4 rounded-xl border-l-2 border-primary/40 bg-transparent">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">info</span>
              <p className="text-slate-500 text-xs leading-relaxed m-0">
                Conocer tus tratamientos nos ayuda a entender mejor los factores que influyen en tu alivio.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <StitchButton onClick={() => setStep(3)} icon="arrow_forward">
              Continuar
            </StitchButton>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/* Step 3: Notifications — Stitch Pro: custom times    */}
      {/* ════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="flex-1 flex flex-col px-6 pb-12">
          <div className="py-4 flex-grow">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">No olvides registrarte</h3>
            <p className="text-slate-500 text-center text-sm mb-6">
              La constancia es clave para entender tus patrones de dolor.
            </p>

            {/* Quiet hours — Stitch Pro: custom time pickers */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-[18px]">bedtime</span>
                <span className="text-sm font-semibold text-white">Horarios de silencio</span>
              </div>
              <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50 flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wide mb-1 block">Desde</label>
                  <input
                    className="w-full h-10 bg-white/5 border border-white/10 rounded-xl text-white text-center focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-medium"
                    type="time"
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                  />
                </div>
                <span className="text-slate-500 text-sm mt-4">→</span>
                <div className="flex-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wide mb-1 block">Hasta</label>
                  <input
                    className="w-full h-10 bg-white/5 border border-white/10 rounded-xl text-white text-center focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-medium"
                    type="time"
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Notification frequency — Stitch Pro: toggle rows */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-[18px]">notifications</span>
                <span className="text-sm font-semibold text-white">Frecuencia de recordatorios</span>
              </div>
              <div className="space-y-3">
                {NOTIFICATION_LEVELS.map((level) => (
                  <div
                    key={level}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      notifLevel === level
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-slate-800/40 border-slate-700/50'
                    }`}
                    onClick={() => setNotifLevel(level)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <span className="material-symbols-outlined text-primary text-xl">{LEVEL_ICONS[level]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold m-0">{LEVEL_DESC[level]}</p>
                        <p className="text-[10px] text-slate-500 m-0">{NOTIFICATION_SCHEDULES[level].join(' · ')}</p>
                      </div>
                    </div>
                    <StitchToggle
                      active={notifLevel === level}
                      onClick={() => setNotifLevel(level)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <StitchButton
              onClick={handleComplete}
              disabled={saving}
              icon="check"
            >
              {saving ? 'Guardando...' : 'Finalizar configuración'}
            </StitchButton>
            <StitchButton variant="ghost" onClick={handleComplete}>
              Configurar más tarde
            </StitchButton>
          </div>
        </div>
      )}
    </div>
  );
}
