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
      .then((result) => setData(result || []))
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
    datasets: [{
      label: 'Calidad de Vida',
      data: data.map((d) => d.score),
      borderColor: '#8c25f4',
      backgroundColor: 'rgba(140, 37, 244, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#8c25f4',
      pointBorderColor: 'transparent',
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 11, 21, 0.95)',
        titleColor: '#e8e8f0',
        bodyColor: '#9b9bb8',
        borderColor: 'rgba(140, 37, 244, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: { ticks: { color: '#6b6b8a', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { min: 0, max: 100, ticks: { color: '#6b6b8a', font: { size: 10 }, stepSize: 25 }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#22c55e';
    if (score >= 40) return '#eab308';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 px-5 py-6 pb-24">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      <h1 className="text-2xl font-bold text-white mb-1">Calidad de Vida</h1>
      <p className="text-slate-400 text-sm mb-6">Índice combinado de dolor, ánimo, actividad y sueño</p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Period selector */}
      <div className="flex gap-2 mb-6">
        {[7, 30, 90].map((p) => (
          <button
            key={p}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              period === p
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
            }`}
            onClick={() => setPeriod(p)}
          >
            {p}d
          </button>
        ))}
      </div>

      {/* QoL Score Circle */}
      {latest && (
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center border-4 mb-2"
            style={{ borderColor: getScoreColor(latest.score) }}
          >
            <span className="text-4xl font-bold" style={{ color: getScoreColor(latest.score) }}>
              {latest.score}
            </span>
          </div>
          <p className="text-slate-400 text-xs">Último índice registrado</p>
        </div>
      )}

      {/* Breakdown */}
      {latest && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { key: 'pain', label: 'Dolor', icon: 'medication' },
            { key: 'mood', label: 'Ánimo', icon: 'mood' },
            { key: 'activity', label: 'Actividad', icon: 'directions_run' },
            { key: 'sleep', label: 'Sueño', icon: 'bedtime' },
          ].map(({ key, label, icon }) => (
            <div className="glass-card p-4 rounded-2xl text-center" key={key}>
              <span className="material-symbols-outlined text-primary mb-1 block">{icon}</span>
              <div className="text-2xl font-bold" style={{ color: getScoreColor(latest.breakdown[key]) }}>
                {latest.breakdown[key]}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Trend chart */}
      {data.length > 1 ? (
        <div className="glass-card rounded-2xl p-4" style={{ height: 260 }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : data.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-500 mb-3 block">monitoring</span>
          <div className="text-slate-400 text-sm">Registrá dolor y respondé preguntas para generar tu índice de calidad de vida.</div>
        </div>
      ) : null}
    </div>
  );
}
