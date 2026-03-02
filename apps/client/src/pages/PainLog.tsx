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
    <div className="bg-[#0a0a0f] min-h-screen font-display text-slate-100 px-5 py-6 pb-24 antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      {/* Header with back arrow */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate('/app')} className="size-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 bg-transparent cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        <h1 className="text-xl font-bold text-white tracking-tight">Registrar Dolor</h1>
      </div>

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
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[10px] font-bold text-primary/80 uppercase tracking-[0.15em]">
            Intensidad (NRS 0-10)
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
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 mb-5">
        <label className="text-[10px] font-bold text-primary/80 uppercase tracking-[0.15em] mb-3 block">
          Temporalidad
        </label>
        <div className="flex flex-wrap gap-2">
          {PAIN_TEMPORALITIES.map((temp) => (
            <button
              key={temp}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.97] cursor-pointer border ${
                painTemporality === temp
                  ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(140,37,244,0.3)]'
                  : 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
              }`}
              onClick={() => setPainTemporality(painTemporality === temp ? '' : temp)}
            >
              {PAIN_TEMPORALITY_LABELS[temp]}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Mood States ── */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[10px] font-bold text-primary/80 uppercase tracking-[0.15em]">
            Malestar y Síntomas
          </label>
          {moodStates.length > 0 && (
            <span className="text-xs text-primary font-medium">({moodStates.length})</span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MOOD_STATES.map((state) => (
            <button
              key={state}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all duration-200 active:scale-[0.97] cursor-pointer border ${
                moodStates.includes(state)
                  ? 'bg-primary/15 border-primary/30 text-white shadow-[0_0_12px_rgba(140,37,244,0.1)]'
                  : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:bg-white/[0.05]'
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
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 mb-5">
        <label className="text-[10px] font-bold text-primary/80 uppercase tracking-[0.15em] mb-1 block">
          Mapa de Dolor
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
        <label className="text-[10px] font-bold text-primary/80 uppercase tracking-[0.15em] mb-3 block">
          Notas Adicionales
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
        className="w-full h-14 bg-gradient-to-r from-primary to-[#a855f7] text-white font-bold rounded-2xl shadow-[0_4px_20px_rgba(140,37,244,0.3)] hover:shadow-[0_4px_30px_rgba(140,37,244,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-sm uppercase tracking-wider cursor-pointer border-none"
        onClick={handleSubmit}
        disabled={saving || saved}
      >
        <span className="material-symbols-outlined text-[16px]">save</span>
        {saving ? 'Guardando...' : saved ? '✅ Guardado' : 'Guardar Registro'}
      </button>
    </div>
  );
}
