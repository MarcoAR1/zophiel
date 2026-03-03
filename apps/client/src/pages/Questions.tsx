import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useI18n } from '../i18n/index';

// ── Category-aware config ──
interface CategoryConfig {
  icon: string;
  accentClass: string;      // tailwind text color
  bgClass: string;          // tailwind bg color
  gradient: string;         // slider gradient CSS
  minLabel: string;
  maxLabel: string;
  labels: string[];          // per-value labels (indexed 0-10)
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  pain: {
    icon: 'local_fire_department',
    accentClass: 'text-red-400',
    bgClass: 'bg-red-500/10',
    gradient: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #84cc16, #22c55e)',
    minLabel: 'Insoportable',
    maxLabel: 'Sin dolor',
    labels: ['', 'Insoportable', 'Muy severo', 'Severo', 'Alto', 'Significativo', 'Moderado', 'Leve', 'Mínimo', 'Casi nada', 'Sin dolor'],
  },
  sleep: {
    icon: 'bedtime',
    accentClass: 'text-indigo-400',
    bgClass: 'bg-indigo-500/10',
    gradient: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #84cc16, #22c55e)',
    minLabel: 'Muy mal',
    maxLabel: 'Excelente',
    labels: ['', 'Pésimo', 'Muy malo', 'Malo', 'Regular', 'Aceptable', 'Normal', 'Bueno', 'Muy bueno', 'Excelente', 'Perfecto'],
  },
  mood: {
    icon: 'emoji_emotions',
    accentClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10',
    gradient: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #84cc16, #22c55e)',
    minLabel: 'Muy mal',
    maxLabel: 'Excelente',
    labels: ['', 'Terrible', 'Muy mal', 'Mal', 'Regular', 'Normal', 'Bien', 'Muy bien', 'Genial', 'Feliz', 'Radiante'],
  },
  energy: {
    icon: 'bolt',
    accentClass: 'text-yellow-400',
    bgClass: 'bg-yellow-500/10',
    gradient: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #84cc16, #22c55e)',
    minLabel: 'Sin energía',
    maxLabel: 'Máxima',
    labels: ['', 'Agotado', 'Exhausto', 'Cansado', 'Bajo', 'Normal', 'Activo', 'Energético', 'Muy activo', 'Pura energía', 'Imparable'],
  },
  stress: {
    icon: 'psychology',
    accentClass: 'text-purple-400',
    bgClass: 'bg-purple-500/10',
    gradient: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #84cc16, #22c55e)',
    minLabel: 'Límite',
    maxLabel: 'Zen',
    labels: ['', 'Límite', 'Abrumado', 'Muy estresado', 'Estresado', 'Tenso', 'Algo tenso', 'Normal', 'Relajado', 'Tranquilo', 'Zen'],
  },
  functionality: {
    icon: 'accessibility_new',
    accentClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/10',
    gradient: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #84cc16, #22c55e)',
    minLabel: 'Imposible',
    maxLabel: 'Perfecto',
    labels: ['', 'Imposible', 'Muy limitado', 'Limitado', 'Difícil', 'Con esfuerzo', 'Regular', 'Bien', 'Muy bien', 'Normal', 'Perfecto'],
  },
};

const DEFAULT_CONFIG: CategoryConfig = {
  icon: 'help_outline',
  accentClass: 'text-slate-400',
  bgClass: 'bg-slate-500/10',
  gradient: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #84cc16, #22c55e)',
  minLabel: 'Malo',
  maxLabel: 'Bueno',
  labels: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
};

function getConfig(category: string): CategoryConfig {
  return CATEGORY_CONFIG[category?.toLowerCase()] || DEFAULT_CONFIG;
}

// Value badge color — consistent: higher = better = green
function getValueColor(val: number, max: number): string {
  const ratio = (val - 1) / (max - 1); // 0 to 1
  if (ratio >= 0.7) return 'bg-green-500';
  if (ratio >= 0.4) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function Questions() {
  const { t } = useI18n();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.questions.pending().then((q: any[]) => {
      setQuestions(q || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleAnswer = async (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    try {
      await api.questions.respond(questionId, value);
      setSaved((prev) => ({ ...prev, [questionId]: true }));
    } catch {}
  };

  const answeredCount = Object.keys(saved).length;
  const totalCount = questions.length;
  const progressPct = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col antialiased pb-24">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="px-5 pt-6 mb-2">
        <h1 className="text-[26px] font-bold text-white tracking-tight">Preguntas del día</h1>
        <p className="text-slate-500 text-sm mt-1">Respondé para mejorar tu seguimiento</p>
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-primary">{answeredCount} de {totalCount} respondidas</span>
          <span className="text-xs text-slate-500">{Math.round(progressPct)}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question Cards */}
      {questions.length === 0 ? (
        <div className="mx-5 rounded-2xl p-8 glass-card text-center">
          <span className="material-symbols-outlined text-primary text-4xl mb-3 block">task_alt</span>
          <p className="text-white font-semibold mb-1">¡Todo al día!</p>
          <p className="text-slate-500 text-sm">No tenés preguntas pendientes.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-5">
          {questions.map((q) => {
            const config = getConfig(q.category);
            const min = q.scaleMin ?? 1;
            const max = q.scaleMax ?? 10;
            const val = answers[q.id] ?? q.defaultValue ?? Math.round((min + max) / 2);
            const isSaved = saved[q.id];
            const valueColor = getValueColor(val, max);
            const label = config.labels[val] || `${val}`;

            return (
              <div
                key={q.id}
                className={`rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ${
                  isSaved
                    ? 'bg-white/[0.03] border border-green-500/20'
                    : 'glass-card'
                }`}
              >
                {/* Category icon + Saved badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`size-8 rounded-lg ${config.bgClass} flex items-center justify-center`}>
                      <span className={`material-symbols-outlined text-[18px] ${config.accentClass}`}>{config.icon}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{q.category || 'General'}</span>
                  </div>
                  {isSaved && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <div className="size-3 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[8px]">check</span>
                      </div>
                      <span className="text-[9px] text-green-400 font-bold uppercase tracking-wider">Guardado</span>
                    </div>
                  )}
                </div>

                <h3 className="text-white font-semibold text-sm mb-4">{q.text}</h3>

                {/* Value display + label */}
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className={`size-10 rounded-xl flex items-center justify-center text-white font-bold text-base ${valueColor} transition-colors`}>
                    {val}
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{label}</span>
                </div>

                {/* Slider */}
                <div className="relative">
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={val}
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value);
                      setAnswers((prev) => ({ ...prev, [q.id]: newVal }));
                    }}
                    onMouseUp={() => handleAnswer(q.id, val)}
                    onTouchEnd={() => handleAnswer(q.id, val)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: config.gradient }}
                  />
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[9px] text-slate-600 uppercase tracking-wider">{config.minLabel}</span>
                    <span className="text-[9px] text-slate-600 uppercase tracking-wider">{config.maxLabel}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Auto-save indicator */}
      {questions.length > 0 && (
        <div className="flex items-center justify-center gap-1.5 mt-5">
          <span className="material-symbols-outlined text-slate-600 text-[14px]">sync</span>
          <span className="text-[10px] text-slate-600">Autoguardado activado</span>
        </div>
      )}
    </div>
  );
}
