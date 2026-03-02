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
      <p className="page-subtitle animate-in">Anotá los síntomas que sentís hoy relacionados a tu condición</p>

      {success && (
        <div className="toast toast-success toast-inline animate-in">
          ✅ Síntoma registrado correctamente
        </div>
      )}

      {error && (
        <div className="toast toast-error toast-inline animate-in">
          {error}
        </div>
      )}

      {/* Symptom chips */}
      <div className="card animate-in">
        <label className="card-label">Seleccioná el síntoma</label>
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
        <div className="card animate-in" style={{ marginTop: 'var(--space-md)' }}>
          <div className="slider-container">
            <label className="card-label">
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
            <div className="slider-labels">
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
        style={{ marginTop: 'var(--space-lg)' }}
      >
        {saving ? 'Guardando...' : '🩹 Registrar síntoma'}
      </button>
    </div>
  );
}
