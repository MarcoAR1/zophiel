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
import ZophielLogo from '../components/ZophielLogo';

interface OnboardingProps {
  onComplete: (userData: any) => void;
  userName: string;
}

const LEVEL_LABELS: Record<NotificationLevel, string> = {
  low: 'Bajo — 2 recordatorios/día',
  medium: 'Medio — 4 recordatorios/día',
  high: 'Alto — 6 recordatorios/día',
};

const PAIN_DURATIONS = [
  { value: '<1', label: '< 1 año' },
  { value: '1-3', label: '1-3 años' },
  { value: '3-5', label: '3-5 años' },
  { value: '5+', label: '5+ años' },
];

const TREATMENTS = [
  { key: 'medication', icon: 'medication', label: 'Medicación' },
  { key: 'physio', icon: 'fitness_center', label: 'Fisioterapia' },
  { key: 'cbt', icon: 'psychology', label: 'Terapia cognitiva' },
  { key: 'acupuncture', icon: 'pin_drop', label: 'Acupuntura' },
  { key: 'cannabis', icon: 'spa', label: 'Cannabis medicinal' },
  { key: 'none', icon: 'block', label: 'Ninguno' },
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
    <div className="bg-background-dark min-h-screen font-display text-slate-100 flex flex-col px-6 py-8">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === i ? 'w-8 bg-primary' : step > i ? 'w-4 bg-primary/40' : 'w-4 bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Step 0: Welcome + Condition */}
      {step === 0 && (
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col items-center mb-8">
            <div className="relative flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner shadow-primary/20 ring-1 ring-white/10 mb-4">
              <ZophielLogo size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Bienvenido, {userName} 👋</h1>
            <p className="text-slate-400 text-sm text-center leading-relaxed max-w-xs">
              Tu compañero inteligente en el manejo del dolor crónico. Contanos sobre tu condición para personalizar tu experiencia.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 mb-6">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 block">
              ¿Qué condición de dolor tenés?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DIAGNOSIS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                    diagnosis === opt
                      ? 'bg-primary/20 border border-primary/40 text-white'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                  onClick={() => setDiagnosis(diagnosis === opt ? '' : opt)}
                >
                  <span className="text-lg">{DIAGNOSIS_ICONS[opt]}</span>
                  <span>{DIAGNOSIS_LABELS[opt]}</span>
                </button>
              ))}
            </div>

            {diagnosis === 'other' && (
              <input
                className="w-full h-12 mt-4 pl-4 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-sm"
                placeholder="Describí tu condición..."
                value={customDiagnosis}
                onChange={(e) => setCustomDiagnosis(e.target.value)}
                autoFocus
              />
            )}
          </div>

          <div className="mt-auto space-y-3">
            <button
              className="w-full h-14 bg-gradient-to-r from-primary to-[#6d1cc5] text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
              onClick={() => setStep(1)}
            >
              <span>Continuar</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button
              className="w-full py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors"
              onClick={() => setStep(1)}
            >
              Omitir por ahora
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Pain Profile */}
      {step === 1 && (
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col items-center mb-8">
            <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Tu perfil de dolor</h1>
            <p className="text-slate-400 text-sm text-center leading-relaxed max-w-xs">
              Esta información nos ayuda a personalizar tus reportes y detectar patrones relevantes.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 mb-4">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 block">
              ¿Hace cuánto convivís con dolor crónico?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PAIN_DURATIONS.map((d) => (
                <button
                  key={d.value}
                  className={`py-3 px-4 rounded-xl text-sm font-medium text-center transition-all duration-200 active:scale-[0.97] ${
                    painDuration === d.value
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setPainDuration(painDuration === d.value ? '' : d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 mb-6">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 block">
              ¿Qué tratamientos probaste?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TREATMENTS.map((t) => (
                <button
                  key={t.key}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-left transition-all duration-200 active:scale-[0.97] ${
                    treatments.includes(t.key)
                      ? 'bg-primary/20 border border-primary/40 text-white'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                  onClick={() => toggleTreatment(t.key)}
                >
                  <span className="material-symbols-outlined text-primary text-[20px]">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto flex gap-3">
            <button
              className="flex-1 h-12 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
              onClick={() => setStep(0)}
            >
              ← Atrás
            </button>
            <button
              className="flex-[2] h-14 bg-gradient-to-r from-primary to-[#6d1cc5] text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
              onClick={() => setStep(2)}
            >
              <span>Continuar</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Notifications */}
      {step === 2 && (
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col items-center mb-8">
            <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">notifications</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Recordatorios</h1>
            <p className="text-slate-400 text-sm text-center leading-relaxed max-w-xs">
              Te ayudamos a mantener un registro consistente para que tu médico tenga datos reales.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 mb-4">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 block">
              Frecuencia de recordatorios
            </label>
            <div className="flex flex-col gap-2">
              {NOTIFICATION_LEVELS.map((level) => (
                <button
                  key={level}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    notifLevel === level
                      ? 'bg-primary/20 border border-primary/40'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setNotifLevel(level)}
                >
                  <div className={`text-sm font-medium ${notifLevel === level ? 'text-white' : 'text-slate-300'}`}>
                    {LEVEL_LABELS[level]}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {NOTIFICATION_SCHEDULES[level].join(' · ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 mb-6">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 block">
              Horas silenciosas
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 mb-1 block">Desde</label>
                <input
                  className="w-full h-12 pl-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-sm"
                  type="time"
                  value={quietStart}
                  onChange={(e) => setQuietStart(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 mb-1 block">Hasta</label>
                <input
                  className="w-full h-12 pl-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-sm"
                  type="time"
                  value={quietEnd}
                  onChange={(e) => setQuietEnd(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-auto flex gap-3">
            <button
              className="flex-1 h-12 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
              onClick={() => setStep(1)}
            >
              ← Atrás
            </button>
            <button
              className="flex-[2] h-14 bg-gradient-to-r from-primary to-[#6d1cc5] text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
              onClick={() => setStep(3)}
            >
              <span>Continuar</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Ready */}
      {step === 3 && (
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col items-center mb-8">
            <div className="relative flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner shadow-primary/20 ring-1 ring-white/10 mb-4">
              <ZophielLogo size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">¡Todo listo!</h1>
            <p className="text-slate-400 text-sm text-center leading-relaxed max-w-xs">
              Tu configuración está lista. Podés cambiarla en cualquier momento desde Configuración.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 mb-6">
            <div className="space-y-3">
              {finalDiagnosis && (
                <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                  <span className="text-xs text-slate-500 uppercase tracking-wide">Condición</span>
                  <span className="text-sm font-medium text-white">{finalDiagnosis}</span>
                </div>
              )}
              {painDuration && (
                <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                  <span className="text-xs text-slate-500 uppercase tracking-wide">Duración</span>
                  <span className="text-sm font-medium text-white">{PAIN_DURATIONS.find(d => d.value === painDuration)?.label}</span>
                </div>
              )}
              {treatments.length > 0 && (
                <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                  <span className="text-xs text-slate-500 uppercase tracking-wide">Tratamientos</span>
                  <span className="text-sm font-medium text-white text-right max-w-[60%]">
                    {treatments.map(t => TREATMENTS.find(tr => tr.key === t)?.label).join(', ')}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-xs text-slate-500 uppercase tracking-wide">Recordatorios</span>
                <span className="text-sm font-medium text-white">{LEVEL_LABELS[notifLevel].split(' — ')[1]}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-xs text-slate-500 uppercase tracking-wide">Silencio</span>
                <span className="text-sm font-medium text-white">{quietStart} - {quietEnd}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto flex gap-3">
            <button
              className="flex-1 h-12 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
              onClick={() => setStep(2)}
            >
              ← Atrás
            </button>
            <button
              className="flex-[2] h-14 bg-gradient-to-r from-primary to-[#6d1cc5] text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleComplete}
              disabled={saving}
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              {saving ? 'Guardando...' : 'Empezar a registrar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
