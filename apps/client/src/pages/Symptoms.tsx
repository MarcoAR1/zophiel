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

  return (
    <div className="page">
      <h1 className="page-title animate-in">Registrar Síntomas</h1>
      <p className="page-subtitle animate-in">¿Qué síntomas experimentás hoy?</p>

      {success && (
        <div className="toast toast-success" style={{ position: 'relative', top: 0, marginBottom: 'var(--space-md)' }}>
          ✅ Síntoma registrado
        </div>
      )}

      {error && (
        <div className="toast toast-error" style={{ position: 'relative', top: 0, marginBottom: 'var(--space-md)' }}>
          {error}
        </div>
      )}

      {/* Symptom chips */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <label style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: 'var(--space-md)' }}>
          Síntoma
        </label>
        <div className="chip-group">
          {SYMPTOMS.map((sym) => (
            <button
              key={sym}
              className={`chip ${selectedSymptom === sym ? 'active' : ''}`}
              onClick={() => setSelectedSymptom(selectedSymptom === sym ? '' : sym)}
            >
              {SYMPTOM_LABELS[sym]}
            </button>
          ))}
        </div>
      </div>

      {/* Severity slider */}
      {selectedSymptom && (
        <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="slider-container">
            <label style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Severidad: {SYMPTOM_LABELS[selectedSymptom]}
            </label>
            <div className="slider-value">{severity}</div>
            <input
              type="range"
              min={1}
              max={5}
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
              <span>Leve</span>
              <span>Severo</span>
            </div>
          </div>
        </div>
      )}

      <button
        className="btn btn-primary btn-lg btn-block animate-in"
        onClick={handleSubmit}
        disabled={saving || !selectedSymptom}
      >
        {saving ? 'Guardando...' : 'Registrar síntoma'}
      </button>
    </div>
  );
}
