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
      } catch {
        // ignore
      } finally {
        setSaving((prev) => ({ ...prev, [questionId]: false }));
      }
    }, 600);
  }, []);

  const handleSliderChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    autoSave(questionId, value);
  };

  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  const getColor = (val: number, max: number) => {
    const ratio = val / max;
    if (ratio <= 0.3) return 'var(--pain-0)';
    if (ratio <= 0.5) return 'var(--pain-3)';
    if (ratio <= 0.7) return 'var(--pain-5)';
    if (ratio <= 0.85) return 'var(--pain-7)';
    return 'var(--pain-10)';
  };

  return (
    <div className="page">
      <h1 className="page-title animate-in">{t('questions_title')}</h1>
      <p className="page-subtitle animate-in">Respondé las preguntas para calcular tu calidad de vida</p>

      {completed.size > 0 && (
        <div className="toast toast-success toast-inline animate-in">
          {t('questions_saved', { count: completed.size })}
        </div>
      )}

      {questions.length === 0 ? (
        <div className="card empty-state animate-in">
          <div className="empty-state-icon">🎉</div>
          <div className="empty-state-text">{t('questions_none')}</div>
        </div>
      ) : (
        <div className="questions-list">
          {questions.map((q) => {
            const val = answers[q.id] ?? 5;
            const color = getColor(val, q.scaleMax);
            const isSaving = saving[q.id];
            const isCompleted = completed.has(q.id);

            return (
              <div
                key={q.id}
                className={`card question-card animate-in ${isCompleted ? 'question-card-completed' : ''}`}
              >
                <div className="question-header">
                  <div className="question-text">{q.text}</div>
                  {isCompleted && (
                    <span className="question-badge">✓ {t('questions_saved_badge')}</span>
                  )}
                </div>
                <div className="slider-container">
                  <div className="slider-value" style={{ color, WebkitTextFillColor: color }}>
                    {val}
                  </div>
                  <input
                    type="range"
                    min={q.scaleMin}
                    max={q.scaleMax}
                    value={val}
                    onChange={(e) => handleSliderChange(q.id, Number(e.target.value))}
                    style={{ accentColor: color }}
                  />
                  <div className="slider-labels">
                    <span>{q.scaleMin}</span>
                    <span>{q.scaleMax}</span>
                  </div>
                </div>
                {isSaving && (
                  <div className="question-autosave">{t('questions_autosave')}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
