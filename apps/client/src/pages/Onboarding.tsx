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
  { value: '<1', label: 'Menos de 6 meses' },
  { value: '1-3', label: '1-3 años' },
  { value: '3-5', label: '3-5 años' },
  { value: '5+', label: 'Más de 5 años' },
];

const TREATMENTS = [
  { key: 'medication', icon: 'medication', label: 'Medicación' },
  { key: 'physio', icon: 'physical_therapy', label: 'Fisioterapia' },
  { key: 'meditation', icon: 'self_improvement', label: 'Meditación' },
  { key: 'exercise', icon: 'fitness_center', label: 'Ejercicio' },
  { key: 'acupuncture', icon: 'pin_drop', label: 'Acupuntura' },
  { key: 'cannabis', icon: 'spa', label: 'Cannabis medicinal' },
  { key: 'none', icon: 'block', label: 'Ninguno' },
];

const TOTAL_STEPS = 4;

/**
 * Onboarding — Stitch-styled multi-step wizard
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
      <div className="flex items-center p-4 pb-2 justify-between">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="p-1">
            <span className="material-symbols-outlined text-slate-400">arrow_back_ios</span>
          </button>
        ) : <div className="w-8" />}
        <h2 className="text-lg font-bold text-white flex-1 text-center">
          {step === 0 && '🩺 Zophiel'}
          {step === 1 && 'Condiciones'}
          {step === 2 && 'Tu Dolor'}
          {step === 3 && 'Preferencias'}
        </h2>
        {step > 0 ? <div className="w-8" /> : <div className="w-8" />}
      </div>

      {/* ─── Progress dots (Stitch style: round dots) ─── */}
      <div className="flex w-full flex-row items-center justify-center gap-3 py-5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              step === i ? 'bg-primary scale-125' : step > i ? 'bg-primary/60' : 'bg-primary/20'
            }`}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════ */}
      {/* Step 0: Welcome Screen — Stitch: large illustration */}
      {/* ════════════════════════════════════════════════════ */}
      {step === 0 && (
        <div className="flex-1 flex flex-col px-6 pb-12">
          <h1 className="text-[32px] font-bold text-white text-center tracking-tight pb-3 pt-6">
            Bienvenido, {userName}
          </h1>

          {/* Illustration area — matches Stitch gradient card */}
          <div className="flex w-full grow py-6">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center border border-primary/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50"></div>
              <div className="relative z-10 flex flex-col items-center">
                <ZophielLogo size={80} />
                <div className="mt-4 w-32 h-1 bg-primary/40 rounded-full"></div>
              </div>
              <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
            </div>
          </div>

          <p className="text-slate-400 text-lg font-normal leading-relaxed pb-8 px-2 text-center">
            Tu aliado inteligente en la gestión personalizada del dolor crónico.
          </p>

          <button
            className="w-full bg-primary py-4 rounded-xl font-semibold text-white shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform"
            onClick={() => setStep(1)}
          >
            Comenzar mi perfil
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/* Step 1: Conditions — Stitch: centered icon cards    */}
      {/* ════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="flex-1 flex flex-col px-6 pb-12">
          <div className="py-4">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">¿Cuál es tu diagnóstico?</h3>
            <p className="text-slate-500 text-center text-sm mb-6">
              Seleccioná tu condición para personalizar tu experiencia.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {DIAGNOSIS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`p-4 rounded-xl backdrop-blur-md flex flex-col items-center text-center gap-2 transition-all duration-200 active:scale-[0.97] ${
                    diagnosis === opt
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60'
                  }`}
                  onClick={() => setDiagnosis(diagnosis === opt ? '' : opt)}
                >
                  <span className={`material-symbols-outlined ${diagnosis === opt ? 'text-primary' : 'text-slate-400'}`}>
                    {DIAGNOSIS_ICONS[opt] === '🔥' ? 'healing' :
                     DIAGNOSIS_ICONS[opt] === '💪' ? 'pulmonology' :
                     DIAGNOSIS_ICONS[opt] === '🧠' ? 'psychology' :
                     DIAGNOSIS_ICONS[opt] === '🦴' ? 'accessibility_new' :
                     DIAGNOSIS_ICONS[opt] === '⚡' ? 'monitor_heart' :
                     'add_circle'}
                  </span>
                  <span className="text-sm font-medium">{DIAGNOSIS_LABELS[opt]}</span>
                </button>
              ))}
            </div>

            {diagnosis === 'other' && (
              <input
                className="w-full h-12 mt-4 pl-4 pr-4 bg-slate-800/40 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-sm"
                placeholder="Describí tu condición..."
                value={customDiagnosis}
                onChange={(e) => setCustomDiagnosis(e.target.value)}
                autoFocus
              />
            )}
          </div>

          <div className="mt-auto">
            <button
              className="w-full bg-primary py-4 rounded-xl font-semibold text-white shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform"
              onClick={() => setStep(2)}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/* Step 2: Pain Profile — Stitch: pills + chips        */}
      {/* ════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="flex-1 flex flex-col px-6 pb-12">
          <div className="py-4 flex-grow overflow-y-auto">
            {/* Duration */}
            <h3 className="text-xl font-bold text-white mb-4">¿Cuánto tiempo llevás así?</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {PAIN_DURATIONS.map((d) => (
                <button
                  key={d.value}
                  className={`px-4 py-2 rounded-full text-sm transition-all active:scale-[0.97] ${
                    painDuration === d.value
                      ? 'border border-primary bg-primary/20 font-medium'
                      : 'border border-slate-700 bg-slate-800/30 hover:bg-slate-800/60'
                  }`}
                  onClick={() => setPainDuration(painDuration === d.value ? '' : d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Treatments — Stitch: chip style with check/add icons */}
            <h3 className="text-xl font-bold text-white mb-4">Tratamientos actuales</h3>
            <div className="flex flex-wrap gap-2">
              {TREATMENTS.map((t) => (
                <button
                  key={t.key}
                  className={`px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all active:scale-[0.97] ${
                    treatments.includes(t.key)
                      ? 'bg-primary/20 border border-primary/30'
                      : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800/70'
                  }`}
                  onClick={() => toggleTreatment(t.key)}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {treatments.includes(t.key) ? 'check_circle' : 'add'}
                  </span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              className="w-full bg-primary py-4 rounded-xl font-semibold text-white shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform"
              onClick={() => setStep(3)}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════ */}
      {/* Step 3: Notifications — Stitch: toggles + time card */}
      {/* ════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="flex-1 flex flex-col px-6 pb-12">
          <div className="py-4 flex-grow">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">No olvides registrarte</h3>
            <p className="text-slate-500 text-center text-sm mb-8">
              La constancia es clave para entender tus patrones de dolor.
            </p>

            {/* Quiet hours card — Stitch: centered time display */}
            <div className="bg-slate-800/30 rounded-3xl p-6 mb-8 border border-slate-700/50 flex flex-col items-center">
              <span className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-widest">Horas silenciosas</span>
              <div className="flex items-center gap-3 mb-2">
                <input
                  className="w-24 h-12 text-center bg-transparent text-3xl font-bold text-white focus:outline-none focus:ring-0 border-none"
                  type="time"
                  value={quietStart}
                  onChange={(e) => setQuietStart(e.target.value)}
                />
                <span className="text-slate-500 text-lg">—</span>
                <input
                  className="w-24 h-12 text-center bg-transparent text-3xl font-bold text-white focus:outline-none focus:ring-0 border-none"
                  type="time"
                  value={quietEnd}
                  onChange={(e) => setQuietEnd(e.target.value)}
                />
              </div>
              <div className="w-full h-[1px] bg-slate-700 my-4"></div>
              <div className="flex gap-4">
                {['L','M','X','J','V','S','D'].map((d, i) => (
                  <span key={d} className={`text-xs ${i === 3 ? 'text-primary font-bold' : 'text-slate-500'}`}>{d}</span>
                ))}
              </div>
            </div>

            {/* Toggle notifications — Stitch style */}
            <div className="space-y-4">
              {NOTIFICATION_LEVELS.map((level) => (
                <div
                  key={level}
                  className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 cursor-pointer"
                  onClick={() => setNotifLevel(level)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <span className="material-symbols-outlined text-primary text-xl">
                        {level === 'low' ? 'notifications_paused' : level === 'medium' ? 'edit_notifications' : 'notifications_active'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold m-0">{LEVEL_LABELS[level].split(' — ')[0]}</p>
                      <p className="text-[10px] text-slate-500 m-0">{NOTIFICATION_SCHEDULES[level].join(' · ')}</p>
                    </div>
                  </div>
                  {/* Toggle */}
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${notifLevel === level ? 'bg-primary' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifLevel === level ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              className="w-full bg-gradient-to-r from-primary to-[#a855f7] py-4 rounded-xl font-bold text-white shadow-xl shadow-primary/20 active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
              onClick={handleComplete}
              disabled={saving}
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              {saving ? 'Guardando...' : 'Finalizar configuración'}
            </button>
            <button
              className="w-full py-4 text-slate-500 text-sm font-medium hover:text-slate-300 transition-colors"
              onClick={handleComplete}
            >
              Configurar más tarde
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
