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

  const autoLevel: PainIntensityLevel =
    intensity <= 3 ? 'mild' : intensity <= 5 ? 'moderate' : intensity <= 7 ? 'severe' : 'very_severe';
  const [painIntensityLevel, setPainIntensityLevel] = useState<PainIntensityLevel>(autoLevel);

  const handleIntensityChange = (val: number) => {
    setIntensity(val);
    const newLevel: PainIntensityLevel =
      val <= 3 ? 'mild' : val <= 5 ? 'moderate' : val <= 7 ? 'severe' : 'very_severe';
    setPainIntensityLevel(newLevel);
  };

  const painColor =
    intensity <= 2 ? '#22c55e' : intensity <= 4 ? '#84cc16' : intensity <= 6 ? '#eab308' : intensity <= 8 ? '#f97316' : '#ef4444';

  const toggleMoodState = (state: MoodState) => {
    setMoodStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  };

  const handleSetMusclePain = (region: BodyRegion, level: PainIntensityLevel | null) => {
    setMusclePainLevels((prev) => {
      const next = { ...prev };
      if (level === null) { delete next[region]; } else { next[region] = level; }
      return next;
    });
  };

  const handleSubmit = async () => {
    setError('');
    setSaving(true);
    try {
      await savePainEntry({
        intensity,
        painTemporality: painTemporality || undefined,
        painIntensityLevel: painIntensityLevel,
        moodStates: moodStates.length > 0 ? moodStates : undefined,
        musclePainLevels: Object.keys(musclePainLevels).length > 0 ? musclePainLevels : undefined,
        notes: notes || undefined,
      });
      setSaved(true);
      if (navigator.onLine) { syncService.scheduleSync(500); }
      setTimeout(() => navigate('/app'), 800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 px-5 py-6 pb-24">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      <h1 className="text-2xl font-bold text-white mb-1">Registrar Dolor</h1>

      {/* Offline indicator */}
      {!isOnline && (
        <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm text-center">
          📴 Sin conexión — se guardará localmente
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {saved && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
          ✅ {isOnline ? 'Guardado y sincronizado' : 'Guardado localmente'}
        </div>
      )}

      {/* ── 1. Intensity Slider ── */}
      <div className="glass-card rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Intensidad general (NRS 0-10)
          </label>
          <span className="text-3xl font-bold" style={{ color: painColor }}>{intensity}</span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          value={intensity}
          onChange={(e) => handleIntensityChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: painColor }}
        />
        <div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-500 mt-2">
          <span>Sin dolor</span>
          <span>Insoportable</span>
        </div>
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{
          background: 'linear-gradient(to right, #22c55e, #84cc16, #eab308, #f97316, #ef4444)',
          opacity: 0.5,
        }} />
      </div>

      {/* ── 2. Temporality ── */}
      <div className="glass-card rounded-2xl p-5 mb-5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 block">
          Temporalidad
        </label>
        <div className="flex flex-wrap gap-2">
          {PAIN_TEMPORALITIES.map((temp) => (
            <button
              key={temp}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                painTemporality === temp
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
              }`}
              onClick={() => setPainTemporality(painTemporality === temp ? '' : temp)}
            >
              {PAIN_TEMPORALITY_LABELS[temp]}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Mood States ── */}
      <div className="glass-card rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Malestar general
          </label>
          {moodStates.length > 0 && (
            <span className="text-xs text-primary font-medium">({moodStates.length})</span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MOOD_STATES.map((state) => (
            <button
              key={state}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl text-center transition-all duration-200 active:scale-[0.97] ${
                moodStates.includes(state)
                  ? 'bg-primary/20 border border-primary/40 text-white'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
              }`}
              onClick={() => toggleMoodState(state)}
            >
              <span className="text-xl">{MOOD_STATE_ICONS[state]}</span>
              <span className="text-[10px] font-medium leading-tight">{MOOD_STATE_LABELS[state]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. Body Map ── */}
      <div className="glass-card rounded-2xl p-5 mb-5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 block">
          Dolor por zona
        </label>
        <span className="text-[10px] text-slate-500 block mb-4">
          Tocá un músculo para asignar nivel de dolor
        </span>
        <BodyMap
          musclePainLevels={musclePainLevels}
          onSetMusclePain={handleSetMusclePain}
        />
      </div>

      {/* ── 5. Notes ── */}
      <div className="glass-card rounded-2xl p-5 mb-6">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 block">
          Notas (opcional)
        </label>
        <textarea
          className="w-full h-24 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 resize-none text-sm"
          placeholder="¿Qué estabas haciendo? ¿Algo lo provocó?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
        />
      </div>

      <button
        className="w-full h-14 bg-gradient-to-r from-primary to-[#6d1cc5] text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        onClick={handleSubmit}
        disabled={saving || saved}
      >
        <span className="material-symbols-outlined text-[18px]">save</span>
        {saving ? 'Guardando...' : saved ? '✅ Guardado' : 'Guardar entrada'}
      </button>
    </div>
  );
}
