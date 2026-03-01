import { useState, useEffect, useRef } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { api } from '../services/api';
import { exportPainReportPDF } from '../services/pdfExport';
import { useAuth } from '../hooks/useAuth';
import { BODY_REGION_LABELS } from '@zophiel/shared';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

const SENSATION_LABELS: Record<string, string> = {
  punzante: '🔪 Punzante',
  quemante: '🔥 Quemante',
  presion: '🫸 Presión',
  pulsatil: '💓 Pulsátil',
  agudo: '⚡ Agudo',
  sordo: '🫠 Sordo',
  hormigueo: '✨ Hormigueo',
  'no especificado': '❓ Sin especificar',
};

const TEMPORALITY_LABELS: Record<string, string> = {
  constante: 'Constante',
  intermitente: 'Intermitente',
  crisis: 'En crisis',
  'no especificado': 'Sin especificar',
};

const TEMPORALITY_COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#6b7280'];

export default function PainHistory() {
  const { user } = useAuth();
  const [period, setPeriod] = useState(30);
  const [trend, setTrend] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.analytics.painTrend(period).catch(() => []),
      api.pain.stats(period).catch(() => null),
      api.analytics.painReport(period).catch(() => null),
    ]).then(([t, s, r]) => {
      setTrend(t || []);
      setStats(s);
      setReport(r);
      setLoading(false);
    });
  }, [period]);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      await exportPainReportPDF(reportRef.current, user?.name || 'Paciente', period);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  // ── Chart configs ──
  const trendChartData = {
    labels: trend.map((t) => t.date.slice(5)),
    datasets: [{
      label: 'Dolor promedio',
      data: trend.map((t) => t.average),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: 'transparent',
    }],
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
      x: { ticks: { color: '#6b6b8a', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { min: 0, max: 10, ticks: { color: '#6b6b8a', font: { size: 10 }, stepSize: 2 }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
  };

  const getHeatColor = (avg: number) => {
    if (avg === 0) return 'rgba(99,102,241,0.1)';
    if (avg <= 3) return 'rgba(34,197,94,0.4)';
    if (avg <= 5) return 'rgba(234,179,8,0.5)';
    if (avg <= 7) return 'rgba(249,115,22,0.6)';
    return 'rgba(239,68,68,0.7)';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title animate-in">Historial de Dolor</h1>
        {report && (
          <button
            className="btn btn-outline animate-in"
            onClick={handleExportPDF}
            disabled={exporting}
            style={{ fontSize: 'var(--font-sm)', padding: '0.5rem 1rem' }}
          >
            {exporting ? '⏳ Generando...' : '📄 Exportar PDF'}
          </button>
        )}
      </div>

      {/* Period selector */}
      <div className="period-selector animate-in">
        {[7, 30, 90].map((p) => (
          <button key={p} className={`period-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
            {p}d
          </button>
        ))}
      </div>

      {/* ── All report content (captured for PDF) ── */}
      <div ref={reportRef}>
        {/* Stats summary */}
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
            <Line data={trendChartData} options={chartOptions} />
          </div>
        ) : (
          <div className="card empty-state animate-in">
            No hay datos suficientes. ¡Registrá tu primer dolor!
          </div>
        )}

        {/* ── Advanced Report Sections ── */}
        {report && (
          <>
            {/* Time of day insight */}
            {report.timeOfDay?.peak && (
              <div className="card animate-in" style={{ marginTop: 'var(--space-md)' }}>
                <div className="section-header">
                  <h2 className="section-title">⏰ Momentos del día</h2>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                  <div style={{ flex: 1, textAlign: 'center', padding: 'var(--space-sm)', background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 'var(--font-xl)', fontWeight: 700, color: 'var(--danger)' }}>{report.timeOfDay.peak.hour}:00</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Peor momento ({report.timeOfDay.peak.average}/10)</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', padding: 'var(--space-sm)', background: 'rgba(34,197,94,0.08)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 'var(--font-xl)', fontWeight: 700, color: 'var(--success)' }}>{report.timeOfDay.best.hour}:00</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Mejor momento ({report.timeOfDay.best.average}/10)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly heatmap */}
            {report.weeklyHeatmap && (
              <div className="card animate-in" style={{ marginTop: 'var(--space-md)' }}>
                <div className="section-header">
                  <h2 className="section-title">📅 Patrón semanal</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
                  {report.weeklyHeatmap.map((d: any) => (
                    <div key={d.day} style={{
                      textAlign: 'center',
                      padding: 'var(--space-sm)',
                      borderRadius: 'var(--radius-md)',
                      background: getHeatColor(d.average),
                    }}>
                      <div style={{ fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: '0.2rem' }}>{d.day}</div>
                      <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>{d.average || '—'}</div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{d.count}x</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sensation stats */}
            {report.sensationStats?.length > 0 && (
              <div className="card animate-in" style={{ marginTop: 'var(--space-md)' }}>
                <div className="section-header">
                  <h2 className="section-title">🎯 Tipo de sensación</h2>
                </div>
                <div style={{ height: Math.max(200, report.sensationStats.length * 45) }}>
                  <Bar
                    data={{
                      labels: report.sensationStats.map((s: any) => SENSATION_LABELS[s.sensation] || s.sensation),
                      datasets: [{
                        label: 'Dolor promedio',
                        data: report.sensationStats.map((s: any) => s.average),
                        backgroundColor: report.sensationStats.map((_: any, i: number) =>
                          `hsla(${240 + i * 30}, 70%, 60%, 0.7)`
                        ),
                        borderRadius: 6,
                        barThickness: 28,
                      }],
                    }}
                    options={{
                      indexAxis: 'y',
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { min: 0, max: 10, ticks: { color: '#6b6b8a' }, grid: { color: 'rgba(255,255,255,0.04)' } },
                        y: { ticks: { color: '#e8e8f0', font: { size: 12 } }, grid: { display: false } },
                      },
                    }}
                  />
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-sm)', textAlign: 'center' }}>
                  {report.sensationStats.map((s: any) => `${SENSATION_LABELS[s.sensation] || s.sensation}: ${s.count}x`).join(' · ')}
                </div>
              </div>
            )}

            {/* Temporality distribution */}
            {report.temporalityStats?.length > 0 && (
              <div className="card animate-in" style={{ marginTop: 'var(--space-md)' }}>
                <div className="section-header">
                  <h2 className="section-title">⏱️ Distribución temporal</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                  <div style={{ width: 160, height: 160 }}>
                    <Doughnut
                      data={{
                        labels: report.temporalityStats.map((t: any) => TEMPORALITY_LABELS[t.temporality] || t.temporality),
                        datasets: [{
                          data: report.temporalityStats.map((t: any) => t.count),
                          backgroundColor: TEMPORALITY_COLORS.slice(0, report.temporalityStats.length),
                          borderWidth: 0,
                        }],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        cutout: '60%',
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    {report.temporalityStats.map((t: any, i: number) => (
                      <div key={t.temporality} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: TEMPORALITY_COLORS[i] }} />
                        <span style={{ flex: 1, fontSize: 'var(--font-sm)' }}>{TEMPORALITY_LABELS[t.temporality] || t.temporality}</span>
                        <span style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>{t.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Body region */}
            {report.regionStats?.length > 0 && (
              <div className="card animate-in" style={{ marginTop: 'var(--space-md)' }}>
                <div className="section-header">
                  <h2 className="section-title">🫀 Dolor por zona corporal</h2>
                </div>
                {report.regionStats.map((r: any) => {
                  const pct = (r.average / 10) * 100;
                  return (
                    <div key={r.region} style={{ marginBottom: 'var(--space-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', marginBottom: '0.2rem' }}>
                        <span>{(BODY_REGION_LABELS as any)[r.region] || r.region}</span>
                        <span style={{ fontWeight: 600 }}>{r.average}/10 ({r.count}x)</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
                        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: `hsl(${(1 - pct / 100) * 120}, 70%, 50%)` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Mood correlation */}
            {report.moodCorrelation?.length > 0 && (
              <div className="card animate-in" style={{ marginTop: 'var(--space-md)' }}>
                <div className="section-header">
                  <h2 className="section-title">💜 Correlación ánimo-dolor</h2>
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                  Dolor promedio cuando reportaste cada estado de ánimo
                </div>
                {report.moodCorrelation.map((m: any) => (
                  <div key={m.mood} className="list-item">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{m.mood}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{m.count} registros</div>
                    </div>
                    <div style={{ fontWeight: 700, color: m.averagePain >= 7 ? 'var(--danger)' : m.averagePain >= 4 ? 'var(--warning)' : 'var(--success)' }}>
                      {m.averagePain}/10
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary card */}
            {report.summary && (
              <div className="card animate-in" style={{ marginTop: 'var(--space-md)', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <div className="section-header">
                  <h2 className="section-title">📋 Resumen del período</h2>
                </div>
                <div style={{ fontSize: 'var(--font-sm)', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                  En los últimos <strong>{report.summary.periodDays} días</strong> registraste dolor <strong>{report.summary.total} veces</strong> en <strong>{report.summary.daysWithPain} días distintos</strong>.
                  Tu dolor promedio fue <strong>{report.summary.average}/10</strong>, con un mínimo de <strong>{report.summary.min}</strong> y un máximo de <strong>{report.summary.max}</strong>.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
