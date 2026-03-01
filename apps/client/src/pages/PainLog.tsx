import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { savePainEntry } from '../services/offlineDb';
import { syncService } from '../services/syncService';
import { useOnlineStatus, useSyncStatus } from '../hooks/useOnlineStatus';
import BodyMap from '../components/BodyMap';
import {
  PAIN_TEMPORALITIES,
  PAIN_TEMPORALITY_LABELS,
  MOOD_STATES,
  MOOD_STATE_LABELS,
  MOOD_STATE_ICONS,
  type BodyRegion,
  type PainIntensityLevel,
  type PainTemporality,
  type MoodState,
} from '@zophiel/shared';

export default function PainLog() {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const syncStatus = useSyncStatus();
  const [intensity, setIntensity] = useState(5);
  const [painTemporality, setPainTemporality] = useState<PainTemporality | ''>('');
  const [moodStates, setMoodStates] = useState<MoodState[]>([]);
  const [musclePainLevels, setMusclePainLevels] = useState<
    Partial<Record<BodyRegion, PainIntensityLevel>>
  >({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // Auto-compute intensity level from slider
  const autoLevel: PainIntensityLevel =
    intensity <= 3 ? 'mild' : intensity <= 5 ? 'moderate' : intensity <= 7 ? 'severe' : 'very_severe';
  const [painIntensityLevel, setPainIntensityLevel] = useState<PainIntensityLevel>(autoLevel);

  // Update level when slider changes
  const handleIntensityChange = (val: number) => {
    setIntensity(val);
    const newLevel: PainIntensityLevel =
      val <= 3 ? 'mild' : val <= 5 ? 'moderate' : val <= 7 ? 'severe' : 'very_severe';
    setPainIntensityLevel(newLevel);
  };

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

  const handleSetMusclePain = (region: BodyRegion, level: PainIntensityLevel | null) => {
    setMusclePainLevels((prev) => {
      const next = { ...prev };
      if (level === null) {
        delete next[region];
      } else {
        next[region] = level;
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    setError('');
    setSaving(true);
    try {
      // Save to IndexedDB first (offline-first)
      await savePainEntry({
        intensity,
        painTemporality: painTemporality || undefined,
        painIntensityLevel: painIntensityLevel,
        moodStates: moodStates.length > 0 ? moodStates : undefined,
        musclePainLevels:
          Object.keys(musclePainLevels).length > 0 ? musclePainLevels : undefined,
        notes: notes || undefined,
      });

      // Show success briefly
      setSaved(true);

      // Try to sync immediately if online
      if (navigator.onLine) {
        syncService.scheduleSync(500);
      }

      // Navigate back after a short delay
      setTimeout(() => navigate('/app'), 800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title animate-in">Registrar Dolor</h1>

      {/* Offline indicator */}
      {!isOnline && (
        <div className="offline-badge animate-in">
          📴 Sin conexión — se guardará localmente
        </div>
      )}

      {error && (
        <div
          className="toast toast-error"
          style={{ position: 'relative', top: 0, marginBottom: 'var(--space-md)' }}
        >
          {error}
        </div>
      )}

      {saved && (
        <div
          className="toast toast-success animate-in"
          style={{ position: 'relative', top: 0, marginBottom: 'var(--space-md)' }}
        >
          ✅ {isOnline ? 'Guardado y sincronizado' : 'Guardado localmente'}
        </div>
      )}

      {/* ── 1. Intensity Slider (General) ── */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="slider-container">
          <label
            style={{
              fontSize: 'var(--font-sm)',
              color: 'var(--text-secondary)',
              fontWeight: 500,
            }}
          >
            Intensidad general (NRS 0-10)
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
            onChange={(e) => handleIntensityChange(Number(e.target.value))}
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

          {/* Color gradient bar reference */}
          <div style={{
            marginTop: 'var(--space-sm)',
            height: '6px',
            borderRadius: '3px',
            background: 'linear-gradient(to right, var(--pain-0), var(--pain-3), var(--pain-5), var(--pain-7), var(--pain-10))',
            opacity: 0.6,
          }} />
        </div>
      </div>

      {/* ── 2. Temporality ── */}
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

      {/* ── 3. Mood / Physical-Emotional States ── */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="pain-segment">
          <div className="pain-segment-title">
            Malestar general
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
                ({moodStates.length})
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

      {/* ── 4. Body Map with Per-Muscle Pain ── */}
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
          Dolor por zona
          <span
            style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--text-muted)',
              fontWeight: 400,
              display: 'block',
              marginTop: '4px',
            }}
          >
            Tocá un músculo para asignar nivel de dolor
          </span>
        </label>
        <BodyMap
          musclePainLevels={musclePainLevels}
          onSetMusclePain={handleSetMusclePain}
        />
      </div>

      {/* ── 5. Notes ── */}
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
        disabled={saving || saved}
      >
        {saving ? 'Guardando...' : saved ? '✅ Guardado' : 'Guardar entrada'}
      </button>
    </div>
  );
}
