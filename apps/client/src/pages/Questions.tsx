import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useI18n } from '../i18n/index';

const SLIDER_COLORS = [
  'bg-green-500', 'bg-green-400', 'bg-lime-400', 'bg-yellow-400', 'bg-yellow-500',
  'bg-amber-500', 'bg-orange-500', 'bg-orange-600', 'bg-red-500', 'bg-red-600',
];

const SEVERITY_LABELS = ['', 'Sin dolor', 'Leve', 'Leve', 'Moderado', 'Moderado', 'Moderado', 'Severo', 'Severo', 'Intenso', 'Insoportable'];

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
          {questions.map((q, idx) => {
            const val = answers[q.id] ?? q.defaultValue ?? 5;
            const isSaved = saved[q.id];
            const colorIdx = Math.min(Math.max(val - 1, 0), 9);

            return (
              <div
                key={q.id}
                className={`rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ${
                  isSaved
                    ? 'bg-white/[0.03] border border-green-500/20'
                    : 'glass-card'
                }`}
              >
                {/* Saved badge */}
                {isSaved && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="size-3 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[8px]">check</span>
                    </div>
                    <span className="text-[9px] text-green-400 font-bold uppercase tracking-wider">Guardado</span>
                  </div>
                )}

                <h3 className="text-white font-semibold text-sm pr-24 mb-4">{q.text}</h3>

                {/* Value display */}
                <div className="flex items-center justify-end mb-2">
                  <div className={`size-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${SLIDER_COLORS[colorIdx]}`}>
                    {val}
                  </div>
                </div>

                {/* Severity Label */}
                <div className="flex justify-center mb-2">
                  <span className="text-[10px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">{SEVERITY_LABELS[val] || ''}</span>
                </div>

                {/* Slider */}
                <div className="relative">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={val}
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value);
                      setAnswers((prev) => ({ ...prev, [q.id]: newVal }));
                    }}
                    onMouseUp={() => handleAnswer(q.id, val)}
                    onTouchEnd={() => handleAnswer(q.id, val)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #22c55e, #84cc16, #eab308, #f97316, #ef4444)`,
                    }}
                  />
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[9px] text-slate-600 uppercase tracking-wider">Sin dolor</span>
                    <span className="text-[9px] text-slate-600 uppercase tracking-wider">Intenso</span>
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
