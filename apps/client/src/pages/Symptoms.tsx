import { useState } from 'react';
import { api } from '../services/api';
import {
  SYMPTOMS,
  SYMPTOM_LABELS,
  type Symptom,
} from '@zophiel/shared';

export default function Symptoms() {
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | ''>('');
  const [severity, setSeverity] = useState(3);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selectedSymptom) {
      setError('Seleccioná un síntoma');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await api.symptoms.create({ symptom: selectedSymptom, severity });
      setSuccess(true);
      setSelectedSymptom('');
      setSeverity(3);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const severityColor =
    severity <= 1 ? '#22c55e' : severity <= 2 ? '#84cc16' : severity <= 3 ? '#eab308' : severity <= 4 ? '#f97316' : '#ef4444';

  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 px-5 py-6 pb-24">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      <h1 className="text-2xl font-bold text-white mb-1">Registrar Síntomas</h1>
      <p className="text-slate-400 text-sm mb-6">Anotá los síntomas que sentís hoy relacionados a tu condición</p>

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
          ✅ Síntoma registrado correctamente
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Symptom chips */}
      <div className="glass-card rounded-2xl p-5 mb-6">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 block">
          Seleccioná el síntoma
        </label>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map((sym) => (
            <button
              key={sym}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                selectedSymptom === sym
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
              }`}
              onClick={() => setSelectedSymptom(selectedSymptom === sym ? '' : sym)}
            >
              {SYMPTOM_LABELS[sym]}
            </button>
          ))}
        </div>
      </div>

      {/* Severity slider */}
      {selectedSymptom && (
        <div className="glass-card rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Severidad: {SYMPTOM_LABELS[selectedSymptom]}
            </label>
            <span className="text-2xl font-bold" style={{ color: severityColor }}>{severity}</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: severityColor }}
          />
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-500 mt-2">
            <span>Leve</span>
            <span>Severo</span>
          </div>
        </div>
      )}

      <button
        className="w-full h-14 bg-gradient-to-r from-primary to-[#6d1cc5] text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        onClick={handleSubmit}
        disabled={saving || !selectedSymptom}
      >
        <span className="material-symbols-outlined text-[18px]">medical_services</span>
        {saving ? 'Guardando...' : 'Registrar síntoma'}
      </button>
    </div>
  );
}
