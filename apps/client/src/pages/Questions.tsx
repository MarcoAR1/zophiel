import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';

export default function Questions() {
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

  // Auto-save with debounce
  const autoSave = useCallback((questionId: string, value: number) => {
    // Clear previous timer
    if (debounceTimers.current[questionId]) {
      clearTimeout(debounceTimers.current[questionId]);
    }

    // Set new timer — saves 600ms after last change
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

  // Cleanup timers
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

  const pending = questions.filter((q) => !completed.has(q.id));

  // Color for question slider value
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
      <h1 className="page-title animate-in">Preguntas del Día</h1>

      {completed.size > 0 && (
        <div className="toast toast-success" style={{ position: 'relative', top: 0, marginBottom: 'var(--space-md)' }}>
          ✅ {completed.size} pregunta{completed.size > 1 ? 's' : ''} guardada{completed.size > 1 ? 's' : ''}
        </div>
      )}

      {pending.length === 0 ? (
        <div className="card empty-state animate-in">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎉</div>
          <div>¡Ya respondiste todas las preguntas de hoy!</div>
        </div>
      ) : (
        pending.map((q) => {
          const val = answers[q.id] ?? 5;
          const color = getColor(val, q.scaleMax);
          const isSaving = saving[q.id];

          return (
            <div key={q.id} className="card question-card animate-in" style={{ marginBottom: 'var(--space-md)' }}>
              <div className="question-text">{q.text}</div>
              <div className="slider-container">
                <div
                  className="slider-value"
                  style={{ color, WebkitTextFillColor: color }}
                >
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                  <span>{q.scaleMin}</span>
                  <span>{q.scaleMax}</span>
                </div>
              </div>
              {/* Auto-save indicator */}
              {isSaving && (
                <div style={{ textAlign: 'center', fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>
                  💾 Guardando...
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
