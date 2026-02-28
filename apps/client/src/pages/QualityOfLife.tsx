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

  useEffect(() => {
    setLoading(true);
    api.analytics
      .qualityOfLife(period)
      .then(setData)
      .catch(() => setData([]))
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
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--font-sm)', marginBottom: 'var(--space-xl)' }}>
            Último índice registrado
          </p>
        </div>
      )}

      {/* Breakdown */}
      {latest && (
        <div className="stats-grid animate-in" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="card stat-card">
            <div className="stat-value" style={{ color: getScoreColor(latest.breakdown.pain), WebkitTextFillColor: getScoreColor(latest.breakdown.pain) }}>
              {latest.breakdown.pain}
            </div>
            <div className="stat-label">Dolor</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value" style={{ color: getScoreColor(latest.breakdown.mood), WebkitTextFillColor: getScoreColor(latest.breakdown.mood) }}>
              {latest.breakdown.mood}
            </div>
            <div className="stat-label">Ánimo</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value" style={{ color: getScoreColor(latest.breakdown.activity), WebkitTextFillColor: getScoreColor(latest.breakdown.activity) }}>
              {latest.breakdown.activity}
            </div>
            <div className="stat-label">Actividad</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value" style={{ color: getScoreColor(latest.breakdown.sleep), WebkitTextFillColor: getScoreColor(latest.breakdown.sleep) }}>
              {latest.breakdown.sleep}
            </div>
            <div className="stat-label">Sueño</div>
          </div>
        </div>
      )}

      {/* Trend chart */}
      {data.length > 1 ? (
        <div className="card chart-container animate-in" style={{ height: 260 }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : data.length === 0 ? (
        <div className="card empty-state animate-in">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📊</div>
          <div>Registrá dolor y respondé preguntas para generar tu índice de calidad de vida.</div>
        </div>
      ) : null}
    </div>
  );
}
