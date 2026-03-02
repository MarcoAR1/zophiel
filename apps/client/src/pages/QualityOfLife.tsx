import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { api } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function QualityOfLife() {
  const [period, setPeriod] = useState(30);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.analytics
      .qualityOfLife(period)
      .then((result) => {
        setData(result || []);
      })
      .catch((err) => {
        console.error('[QoL] API error:', err);
        setError(err.message || 'Error al cargar datos');
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [period]);

  const latest = data.length > 0 ? data[data.length - 1] : null;

  const chartData = {
    labels: data.map((d) => d.date.slice(5)),
    datasets: [
      {
        label: 'Calidad de Vida',
        data: data.map((d) => d.score),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: 'transparent',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 35, 0.9)',
        titleColor: '#e8e8f0',
        bodyColor: '#9b9bb8',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { color: '#6b6b8a', font: { size: 10 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
      y: {
        min: 0,
        max: 100,
        ticks: { color: '#6b6b8a', font: { size: 10 }, stepSize: 25 },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
    },
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'var(--success)';
    if (score >= 40) return 'var(--warning)';
    return 'var(--danger)';
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title animate-in">Calidad de Vida</h1>
      <p className="page-subtitle animate-in">Índice combinado de dolor, ánimo, actividad y sueño</p>

      {error && (
        <div className="toast toast-error toast-inline animate-in">
          ⚠️ {error}
        </div>
      )}

      <div className="period-selector animate-in">
        {[7, 30, 90].map((p) => (
          <button
            key={p}
            className={`period-btn ${period === p ? 'active' : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p}d
          </button>
        ))}
      </div>

      {/* QoL Score Circle */}
      {latest && (
        <div className="animate-in">
          <div className="qol-score" style={{ borderColor: getScoreColor(latest.score) }}>
            <div
              className="qol-score-value"
              style={{
                color: getScoreColor(latest.score),
                WebkitTextFillColor: getScoreColor(latest.score),
              }}
            >
              {latest.score}
            </div>
          </div>
          <p className="qol-score-label">Último índice registrado</p>
        </div>
      )}

      {/* Breakdown */}
      {latest && (
        <div className="stats-grid animate-in">
          {[
            { key: 'pain', label: 'Dolor', icon: '💊' },
            { key: 'mood', label: 'Ánimo', icon: '😊' },
            { key: 'activity', label: 'Actividad', icon: '🏃' },
            { key: 'sleep', label: 'Sueño', icon: '😴' },
          ].map(({ key, label, icon }) => (
            <div className="card stat-card" key={key}>
              <div className="stat-value" style={{ color: getScoreColor(latest.breakdown[key]), WebkitTextFillColor: getScoreColor(latest.breakdown[key]) }}>
                {latest.breakdown[key]}
              </div>
              <div className="stat-label">{icon} {label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Trend chart */}
      {data.length > 1 ? (
        <div className="card chart-container animate-in" style={{ height: 260 }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : data.length === 0 ? (
        <div className="card empty-state animate-in">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-text">Registrá dolor y respondé preguntas para generar tu índice de calidad de vida.</div>
        </div>
      ) : null}
    </div>
  );
}
