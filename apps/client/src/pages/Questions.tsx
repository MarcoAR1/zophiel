import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Questions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    api.questions
      .pending()
      .then(setQuestions)
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAnswer = async (questionId: string) => {
    const value = answers[questionId] ?? 5;
    setSubmitting(questionId);
    try {
      await api.questions.respond(questionId, value);
      setCompleted((prev) => new Set([...prev, questionId]));
    } catch {
      // ignore
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  const pending = questions.filter((q) => !completed.has(q.id));

  return (
    <div className="page">
      <h1 className="page-title animate-in">Preguntas del Día</h1>

      {completed.size > 0 && (
        <div className="toast toast-success" style={{ position: 'relative', top: 0, marginBottom: 'var(--space-md)' }}>
          ✅ {completed.size} pregunta(s) respondida(s)
        </div>
      )}

      {pending.length === 0 ? (
        <div className="card empty-state animate-in">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎉</div>
          <div>¡Ya respondiste todas las preguntas de hoy!</div>
        </div>
      ) : (
        pending.map((q) => (
          <div key={q.id} className="card question-card animate-in" style={{ marginBottom: 'var(--space-md)' }}>
            <div className="question-text">{q.text}</div>
            <div className="slider-container">
              <div className="slider-value">{answers[q.id] ?? 5}</div>
              <input
                type="range"
                min={q.scaleMin}
                max={q.scaleMax}
                value={answers[q.id] ?? 5}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [q.id]: Number(e.target.value) }))
                }
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                <span>{q.scaleMin}</span>
                <span>{q.scaleMax}</span>
              </div>
            </div>
            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: 'var(--space-md)' }}
              onClick={() => handleAnswer(q.id)}
              disabled={submitting === q.id}
            >
              {submitting === q.id ? 'Enviando...' : 'Responder'}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
