import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';
import { useI18n } from '../i18n/index';

export default function Questions() {
  const { t } = useI18n();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    api.questions
      .pending()
      .then(setQuestions)
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, []);

  const autoSave = useCallback((questionId: string, value: number) => {
    if (debounceTimers.current[questionId]) {
      clearTimeout(debounceTimers.current[questionId]);
    }
    debounceTimers.current[questionId] = setTimeout(async () => {
      setSaving((prev) => ({ ...prev, [questionId]: true }));
      try {
        await api.questions.respond(questionId, value);
        setCompleted((prev) => new Set([...prev, questionId]));
      } catch { /* ignore */ }
      finally { setSaving((prev) => ({ ...prev, [questionId]: false })); }
    }, 600);
  }, []);

  const handleSliderChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    autoSave(questionId, value);
  };

  useEffect(() => {
    return () => { Object.values(debounceTimers.current).forEach(clearTimeout); };
  }, []);

  const getColor = (val: number, max: number) => {
    const ratio = val / max;
    if (ratio <= 0.3) return '#22c55e';
    if (ratio <= 0.5) return '#84cc16';
    if (ratio <= 0.7) return '#eab308';
    if (ratio <= 0.85) return '#f97316';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 px-5 py-6 pb-24">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      <h1 className="text-2xl font-bold text-white mb-1">{t('questions_title')}</h1>
      <p className="text-slate-400 text-sm mb-6">Respondé las preguntas para calcular tu calidad de vida</p>

      {completed.size > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
          {t('questions_saved', { count: completed.size })}
        </div>
      )}

      {questions.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <div className="text-slate-400 text-sm">{t('questions_none')}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((q) => {
            const val = answers[q.id] ?? 5;
            const color = getColor(val, q.scaleMax);
            const isSaving = saving[q.id];
            const isCompleted = completed.has(q.id);

            return (
              <div
                key={q.id}
                className={`glass-card rounded-2xl p-5 transition-all duration-300 ${
                  isCompleted ? 'border-green-500/30 bg-green-500/5' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-white font-medium text-sm leading-relaxed pr-4">{q.text}</div>
                  {isCompleted && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                      ✓ {t('questions_saved_badge')}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Intensidad</span>
                  <span className="text-xl font-bold" style={{ color }}>{val}</span>
                </div>
                <input
                  type="range"
                  min={q.scaleMin}
                  max={q.scaleMax}
                  value={val}
                  onChange={(e) => handleSliderChange(q.id, Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: color }}
                />
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-500 mt-2">
                  <span>{q.scaleMin}</span>
                  <span>{q.scaleMax}</span>
                </div>

                {isSaving && (
                  <div className="mt-3 text-[10px] text-primary font-medium animate-pulse">
                    {t('questions_autosave')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
