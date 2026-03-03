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
  StitchConditionCard,
  StitchToggle,
  StitchChip,
  StitchPill,
  StitchInput,
} from '../components/Stitch';

interface OnboardingProps {
  onComplete: (userData: any) => void;
  userName: string;
}

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

/* Material icon mapping — from Stitch conditions.html */
const DIAGNOSIS_ICONS: Record<string, string> = {
  fibromyalgia: 'healing',
  rheumatoid_arthritis: 'pulmonology',
  chronic_migraine: 'psychology',
  lower_back: 'accessibility_new',
  neuropathy: 'monitor_heart',
  other: 'add_circle',
};

const TOTAL_STEPS = 4;

/**
 * Onboarding — pixel-matched to Stitch Pro HTML
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
      console.log('[Onboarding] API success:', result);
      onComplete(result);
    } catch (err) {
      console.error('[Onboarding] API error:', err);
      // Still complete onboarding on error — user can configure later
      onComplete(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative bg-background-dark min-h-screen font-display text-slate-100 flex flex-col antialiased overflow-hidden">

      {/* ═══ Background glow — from welcome.html ═══ */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0 opacity-40" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none z-0 opacity-30" />

      {/* ════════════════════════════════════════════════════ */}
      {/* Step 0: Welcome — exact Stitch Pro welcome.html    */}
      {/* ════════════════════════════════════════════════════ */}
      {step === 0 && (
        <div className="relative z-10 flex h-full min-h-screen w-full flex-col max-w-md mx-auto px-6 pt-8 pb-6 justify-between">
          {/* Header */}
          <div className="flex flex-col items-center w-full">
            <h2 className="text-primary font-bold tracking-tight text-xl mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[24px]">stethoscope</span> Zophiel
            </h2>
            <StitchProgressDots total={TOTAL_STEPS} current={0} />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center justify-center grow py-6">
            <h1 className="text-3xl font-bold text-center text-white mb-8 tracking-tight leading-tight">
              Bienvenido a Zophiel
            </h1>
            {/* Hero illustration — glass panel with medical icon */}
            <div className="w-full aspect-square max-w-[320px] bg-white/[0.03] backdrop-blur-[12px] border border-white/[0.05] rounded-2xl flex items-center justify-center relative overflow-hidden mb-8 shadow-2xl shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50" />
              <div className="relative w-48 h-48 rounded-full bg-gradient-to-b from-primary/20 to-primary/5 flex items-center justify-center border border-white/5 shadow-inner">
                <span className="material-symbols-outlined text-primary text-[64px] drop-shadow-[0_0_15px_rgba(140,37,244,0.5)]">
                  ecg_heart
                </span>
                <div className="absolute w-full h-full border border-primary/20 rounded-full animate-pulse" />
                <div className="absolute w-[120%] h-[120%] border border-dashed border-white/10 rounded-full" />
              </div>
            </div>
            <p className="text-slate-400 text-base font-medium text-center max-w-[280px] leading-relaxed">
              Tu aliado inteligente en la gestión personalizada del dolor crónico.
            </p>
          </div>

          {/* Action */}
          <div className="w-full pt-4">
            <StitchButton onClick={() => setStep(1)} icon="arrow_forward">
              Comenzar mi perfil
            </StitchButton>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/* Step 1: Conditions — exact conditions.html tiles    */}
      {/* ════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="relative z-10 w-full max-w-md min-h-screen flex flex-col mx-auto bg-background-dark overflow-y-auto">
          <StitchTopBar title="Condiciones" onBack={() => setStep(0)} />
          <StitchProgressDots total={TOTAL_STEPS} current={1} />

          <main className="flex-1 px-6 pt-2 pb-24">
            <h1 className="text-[28px] font-bold leading-tight mb-3">
              ¿Cuál es tu diagnóstico?
            </h1>
            <p className="text-slate-400 text-base font-normal leading-relaxed mb-8">
              Selecciona todas las que apliquen para personalizar tu experiencia.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {DIAGNOSIS_OPTIONS.map((opt) => (
                <StitchConditionCard
                  key={opt}
                  icon={DIAGNOSIS_ICONS[opt] || 'add_circle'}
                  label={DIAGNOSIS_LABELS[opt]}
                  selected={diagnosis === opt}
                  onClick={() => setDiagnosis(diagnosis === opt ? '' : opt)}
                />
              ))}
            </div>

            {diagnosis === 'other' && (
              <div className="mt-4">
                <StitchInput
                  value={customDiagnosis}
                  onChange={setCustomDiagnosis}
                  placeholder="Describí tu condición..."
                  icon="edit"
                  autoFocus
                />
              </div>
            )}
          </main>

          {/* Fixed bottom bar — from conditions.html */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent pt-12">
            <div className="max-w-md mx-auto w-full">
              <StitchButton onClick={() => setStep(2)} icon="arrow_forward">
                Continuar
              </StitchButton>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/* Step 2: Pain Profile — pills + chips               */}
      {/* ════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="relative z-10 w-full max-w-md min-h-screen flex flex-col mx-auto bg-background-dark overflow-y-auto">
          <StitchTopBar title="Tu Dolor" onBack={() => setStep(1)} />
          <StitchProgressDots total={TOTAL_STEPS} current={2} />

          <main className="flex-1 px-6 pt-2 pb-24">
            <h1 className="text-[28px] font-bold leading-tight mb-6">
              ¿Cuánto tiempo llevás así?
            </h1>
            <div className="flex flex-col gap-3 mb-8">
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

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold m-0">Tratamientos actuales</h2>
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

            <div className="flex items-start gap-3 p-4 rounded-xl border-l-2 border-primary/40">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">info</span>
              <p className="text-slate-500 text-xs leading-relaxed m-0">
                Conocer tus tratamientos nos ayuda a entender mejor los factores que influyen en tu alivio.
              </p>
            </div>
          </main>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent pt-12">
            <div className="max-w-md mx-auto w-full">
              <StitchButton onClick={() => setStep(3)} icon="arrow_forward">
                Continuar
              </StitchButton>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/* Step 3: Notifications — custom quiet hours + levels */}
      {/* ════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="relative z-10 w-full max-w-md min-h-screen flex flex-col mx-auto bg-background-dark overflow-y-auto">
          <StitchTopBar title="Preferencias" onBack={() => setStep(2)} />
          <StitchProgressDots total={TOTAL_STEPS} current={3} />

          <main className="flex-1 px-6 pt-2 pb-32">
            <div className="text-center mb-6">
              <h1 className="text-[28px] font-bold leading-tight mb-2">No olvides registrarte</h1>
              <p className="text-slate-400 text-base leading-relaxed">
                La constancia es clave para entender tus patrones de dolor.
              </p>
            </div>

            {/* Quiet hours */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-[18px]">bedtime</span>
                <span className="text-sm font-semibold text-white">Horarios de silencio</span>
              </div>
              <div className="bg-[#231830]/60 rounded-2xl p-4 border border-slate-700/50 flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wide mb-1 block">Desde</label>
                  <input
                    className="w-full h-10 bg-[#1f1627] border border-[#473b54] rounded-xl text-white text-center focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                    type="time"
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                  />
                </div>
                <span className="text-slate-500 text-sm mt-4">→</span>
                <div className="flex-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wide mb-1 block">Hasta</label>
                  <input
                    className="w-full h-10 bg-[#1f1627] border border-[#473b54] rounded-xl text-white text-center focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                    type="time"
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Frequency */}
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
                        : 'bg-[#231830]/40 border-slate-700/50 hover:border-primary/20'
                    }`}
                    onClick={() => setNotifLevel(level)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${notifLevel === level ? 'bg-primary/20' : 'bg-slate-800'}`}>
                        <span className={`material-symbols-outlined text-xl ${notifLevel === level ? 'text-primary' : 'text-slate-400'}`}>
                          {LEVEL_ICONS[level]}
                        </span>
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
          </main>

          {/* Fixed bottom */}
          <div className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent pt-12">
            <div className="max-w-md mx-auto w-full space-y-2">
              <StitchButton onClick={handleComplete} disabled={saving} icon="check">
                {saving ? 'Guardando...' : 'Finalizar configuración'}
              </StitchButton>
              <StitchButton variant="ghost" onClick={handleComplete}>
                Configurar más tarde
              </StitchButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
