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
import { BODY_REGION_LABELS } from '@zophiel/shared';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function PainHistory() {
  const [period, setPeriod] = useState(30);
  const [trend, setTrend] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.analytics.painTrend(period).catch(() => []),
      api.pain.stats(period).catch(() => null),
    ]).then(([t, s]) => {
      setTrend(t || []);
      setStats(s);
      setLoading(false);
    });
  }, [period]);

  const chartData = {
    labels: trend.map((t) => t.date.slice(5)),
    datasets: [
      {
        label: 'Dolor promedio',
        data: trend.map((t) => t.average),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1',
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
        borderColor: 'rgba(99, 102, 241, 0.3)',
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
        max: 10,
        ticks: { color: '#6b6b8a', font: { size: 10 }, stepSize: 2 },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
    },
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
      <h1 className="page-title animate-in">Historial de Dolor</h1>

      {/* Period selector */}
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

      {/* Stats */}
      {stats && (
        <div className="stats-grid animate-in">
          <div className="card stat-card">
            <div className="stat-value">{stats.average}</div>
            <div className="stat-label">Promedio</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">{stats.count}</div>
            <div className="stat-label">Registros</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">{stats.min}</div>
            <div className="stat-label">Mínimo</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">{stats.max}</div>
            <div className="stat-label">Máximo</div>
          </div>
        </div>
      )}

      {/* Trend chart */}
      {trend.length > 0 ? (
        <div className="card chart-container animate-in" style={{ height: 260 }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="card empty-state animate-in">
          No hay datos suficientes para mostrar el gráfico. ¡Registrá tu primer dolor!
        </div>
      )}

      {/* By region */}
      {stats?.byRegion && Object.keys(stats.byRegion).length > 0 && (
        <div className="card animate-in">
          <div className="section-header">
            <h2 className="section-title">Por zona corporal</h2>
          </div>
          {Object.entries(stats.byRegion as Record<string, { average: number; count: number }>).map(
            ([region, data]) => (
              <div className="list-item" key={region}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>
                    {(BODY_REGION_LABELS as any)[region] || region}
                  </div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                    {data.count} registros
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {data.average}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
