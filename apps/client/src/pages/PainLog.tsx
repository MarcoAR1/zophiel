import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import BodyMap from '../components/BodyMap';
import {
  PAIN_SENSATIONS,
  PAIN_SENSATION_LABELS,
  PAIN_INTENSITY_LEVELS,
  PAIN_INTENSITY_LABELS,
  PAIN_INTENSITY_COLORS,
  PAIN_TEMPORALITIES,
  PAIN_TEMPORALITY_LABELS,
  MOOD_STATES,
  MOOD_STATE_LABELS,
  MOOD_STATE_ICONS,
  type BodyRegion,
  type PainSensation,
  type PainIntensityLevel,
  type PainTemporality,
  type MoodState,
} from '@zophiel/shared';

export default function PainLog() {
  const navigate = useNavigate();
  const [intensity, setIntensity] = useState(5);
  const [bodyRegion, setBodyRegion] = useState<BodyRegion | ''>('');
  const [painSensation, setPainSensation] = useState<PainSensation | ''>('');
  const [painIntensityLevel, setPainIntensityLevel] = useState<PainIntensityLevel | ''>('');
  const [painTemporality, setPainTemporality] = useState<PainTemporality | ''>('');
  const [moodStates, setMoodStates] = useState<MoodState[]>([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const painColor =
    intensity <= 2
      ? 'var(--pain-0)'
      : intensity <= 4
        ? 'var(--pain-3)'
        : intensity <= 6
          ? 'var(--pain-5)'
          : intensity <= 8
            ? 'var(--pain-7)'
            : 'var(--pain-10)';

  const toggleMoodState = (state: MoodState) => {
    setMoodStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state],
    );
  };

  const handleSubmit = async () => {
    if (!bodyRegion) {
      setError('Seleccioná una zona del cuerpo');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await api.pain.create({
        intensity,
        bodyRegion,
        painSensation: painSensation || undefined,
        painIntensityLevel: painIntensityLevel || undefined,
        painTemporality: painTemporality || undefined,
        moodStates: moodStates.length > 0 ? moodStates : undefined,
        notes: notes || undefined,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title animate-in">Registrar Dolor</h1>

      {error && (
        <div
          className="toast toast-error"
          style={{ position: 'relative', top: 0, marginBottom: 'var(--space-md)' }}
        >
          {error}
        </div>
      )}

      {/* ── Intensity Slider ── */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="slider-container">
          <label
            style={{
              fontSize: 'var(--font-sm)',
              color: 'var(--text-secondary)',
              fontWeight: 500,
            }}
          >
            Intensidad del dolor (NRS 0-10)
          </label>
          <div
            className="slider-value"
            style={{ color: painColor, WebkitTextFillColor: painColor }}
          >
            {intensity}
          </div>
          <input
            type="range"
            min={0}
            max={10}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            style={{ accentColor: painColor }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--font-xs)',
              color: 'var(--text-muted)',
            }}
          >
            <span>Sin dolor</span>
            <span>Insoportable</span>
          </div>
        </div>
      </div>

      {/* ── Body Map 360° ── */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <label
          style={{
            fontSize: 'var(--font-sm)',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            display: 'block',
            marginBottom: 'var(--space-md)',
          }}
        >
          ¿Dónde te duele?
        </label>
        <BodyMap
          selectedRegion={bodyRegion}
          onSelectRegion={setBodyRegion}
          painIntensityLevel={painIntensityLevel || undefined}
        />
      </div>

      {/* ── Pain Sensation ── */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="pain-segment">
          <div className="pain-segment-title">Sensación</div>
          <div className="chip-group">
            {PAIN_SENSATIONS.map((type) => (
              <button
                key={type}
                className={`chip ${painSensation === type ? 'active' : ''}`}
                onClick={() => setPainSensation(painSensation === type ? '' : type)}
              >
                {PAIN_SENSATION_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pain Intensity Level ── */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="pain-segment">
          <div className="pain-segment-title">Nivel de intensidad</div>
          <div className="intensity-pills">
            {PAIN_INTENSITY_LEVELS.map((level) => (
              <button
                key={level}
                className={`intensity-pill ${painIntensityLevel === level ? 'active' : ''}`}
                onClick={() =>
                  setPainIntensityLevel(painIntensityLevel === level ? '' : level)
                }
                style={
                  painIntensityLevel === level
                    ? {
                        borderColor: PAIN_INTENSITY_COLORS[level],
                        color: PAIN_INTENSITY_COLORS[level],
                      }
                    : undefined
                }
              >
                <span
                  className="dot"
                  style={{ background: PAIN_INTENSITY_COLORS[level] }}
                />
                {PAIN_INTENSITY_LABELS[level]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pain Temporality ── */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="pain-segment">
          <div className="pain-segment-title">Temporalidad</div>
          <div className="chip-group">
            {PAIN_TEMPORALITIES.map((temp) => (
              <button
                key={temp}
                className={`chip ${painTemporality === temp ? 'active' : ''}`}
                onClick={() =>
                  setPainTemporality(painTemporality === temp ? '' : temp)
                }
              >
                {PAIN_TEMPORALITY_LABELS[temp]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mood / Physical-Emotional States ── */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="pain-segment">
          <div className="pain-segment-title">
            Estado físico / emocional
            {moodStates.length > 0 && (
              <span
                style={{
                  marginLeft: 'var(--space-sm)',
                  fontSize: 'var(--font-xs)',
                  color: 'var(--accent-primary)',
                  fontWeight: 400,
                  textTransform: 'none',
                  letterSpacing: 0,
                }}
              >
                ({moodStates.length} seleccionados)
              </span>
            )}
          </div>
          <div className="mood-grid">
            {MOOD_STATES.map((state) => (
              <button
                key={state}
                className={`mood-chip ${moodStates.includes(state) ? 'active' : ''}`}
                onClick={() => toggleMoodState(state)}
              >
                <span className="mood-chip-icon">{MOOD_STATE_ICONS[state]}</span>
                <span className="mood-chip-label">{MOOD_STATE_LABELS[state]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Notes ── */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="input-group">
          <label>Notas (opcional)</label>
          <textarea
            className="input"
            placeholder="¿Qué estabas haciendo? ¿Algo lo provocó?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
          />
        </div>
      </div>

      <button
        className="btn btn-primary btn-lg btn-block animate-in"
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving ? 'Guardando...' : 'Guardar entrada'}
      </button>
    </div>
  );
}
