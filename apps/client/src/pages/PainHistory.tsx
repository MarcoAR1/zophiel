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

const TEMPORALITY_COLORS = ['#8c25f4', '#eab308', '#ef4444', '#6b7280'];

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

  const trendChartData = {
    labels: trend.map((t) => t.date.slice(5)),
    datasets: [{
      label: 'Dolor promedio',
      data: trend.map((t) => t.average),
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
      y: { min: 0, max: 10, ticks: { color: '#6b6b8a', font: { size: 10 }, stepSize: 2 }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
  };

  const getHeatColor = (avg: number) => {
    if (avg === 0) return 'rgba(140,37,244,0.1)';
    if (avg <= 3) return 'rgba(34,197,94,0.4)';
    if (avg <= 5) return 'rgba(234,179,8,0.5)';
    if (avg <= 7) return 'rgba(249,115,22,0.6)';
    return 'rgba(239,68,68,0.7)';
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

      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-white">Historial de Dolor</h1>
        {report && (
          <button
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-50"
            onClick={handleExportPDF}
            disabled={exporting}
          >
            {exporting ? '⏳ Generando...' : '📄 PDF'}
          </button>
        )}
      </div>

      {/* Period selector */}
      <div className="flex gap-2 mb-6 mt-4">
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

      {/* ── Report content (captured for PDF) ── */}
      <div ref={reportRef}>
        {/* Stats summary */}
        {stats && (
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { val: stats.average, label: 'Promedio' },
              { val: stats.count, label: 'Registros' },
              { val: stats.min, label: 'Mínimo' },
              { val: stats.max, label: 'Máximo' },
            ].map(({ val, label }) => (
              <div className="glass-card p-3 rounded-2xl text-center" key={label}>
                <div className="text-xl font-bold text-white">{val}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Trend chart */}
        {trend.length > 0 ? (
          <div className="glass-card rounded-2xl p-4 mb-6" style={{ height: 260 }}>
            <Line data={trendChartData} options={chartOptions} />
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 mb-6 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-500 mb-3 block">timeline</span>
            <div className="text-slate-400 text-sm">No hay datos suficientes. ¡Registrá tu primer dolor!</div>
          </div>
        )}

        {/* ── Advanced Report Sections ── */}
        {report && (
          <>
            {/* Time of day insight */}
            {report.timeOfDay?.peak && (
              <div className="glass-card rounded-2xl p-5 mb-4">
                <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                  Momentos del día
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-red-500/10 text-center">
                    <div className="text-xl font-bold text-red-400">{report.timeOfDay.peak.hour}:00</div>
                    <div className="text-[10px] text-slate-500">Peor ({report.timeOfDay.peak.average}/10)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/10 text-center">
                    <div className="text-xl font-bold text-green-400">{report.timeOfDay.best.hour}:00</div>
                    <div className="text-[10px] text-slate-500">Mejor ({report.timeOfDay.best.average}/10)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly heatmap */}
            {report.weeklyHeatmap && (
              <div className="glass-card rounded-2xl p-5 mb-4">
                <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                  Patrón semanal
                </h2>
                <div className="grid grid-cols-7 gap-1.5">
                  {report.weeklyHeatmap.map((d: any) => (
                    <div key={d.day} className="text-center p-2 rounded-xl" style={{ background: getHeatColor(d.average) }}>
                      <div className="text-[10px] font-semibold mb-0.5">{d.day}</div>
                      <div className="text-lg font-bold">{d.average || '—'}</div>
                      <div className="text-[8px] text-slate-400">{d.count}x</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sensation stats */}
            {report.sensationStats?.length > 0 && (
              <div className="glass-card rounded-2xl p-5 mb-4">
                <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">target</span>
                  Tipo de sensación
                </h2>
                <div style={{ height: Math.max(200, report.sensationStats.length * 45) }}>
                  <Bar
                    data={{
                      labels: report.sensationStats.map((s: any) => SENSATION_LABELS[s.sensation] || s.sensation),
                      datasets: [{
                        label: 'Dolor promedio',
                        data: report.sensationStats.map((s: any) => s.average),
                        backgroundColor: report.sensationStats.map((_: any, i: number) =>
                          `hsla(${275 + i * 20}, 70%, 55%, 0.7)`
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
                <div className="text-[10px] text-slate-500 text-center mt-3">
                  {report.sensationStats.map((s: any) => `${SENSATION_LABELS[s.sensation] || s.sensation}: ${s.count}x`).join(' · ')}
                </div>
              </div>
            )}

            {/* Temporality distribution */}
            {report.temporalityStats?.length > 0 && (
              <div className="glass-card rounded-2xl p-5 mb-4">
                <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
                  Distribución temporal
                </h2>
                <div className="flex items-center gap-6">
                  <div className="w-40 h-40">
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
                  <div className="flex-1">
                    {report.temporalityStats.map((t: any, i: number) => (
                      <div key={t.temporality} className="flex items-center gap-2 mb-1.5">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: TEMPORALITY_COLORS[i] }} />
                        <span className="flex-1 text-sm text-slate-300">{TEMPORALITY_LABELS[t.temporality] || t.temporality}</span>
                        <span className="text-sm font-bold text-white">{t.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Body region */}
            {report.regionStats?.length > 0 && (
              <div className="glass-card rounded-2xl p-5 mb-4">
                <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">accessibility_new</span>
                  Dolor por zona corporal
                </h2>
                {report.regionStats.map((r: any) => {
                  const pct = (r.average / 10) * 100;
                  return (
                    <div key={r.region} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{(BODY_REGION_LABELS as any)[r.region] || r.region}</span>
                        <span className="font-semibold text-white">{r.average}/10 ({r.count}x)</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5">
                        <div className="h-full rounded-full transition-all" style={{
                          width: `${pct}%`,
                          background: `hsl(${(1 - pct / 100) * 120}, 70%, 50%)`
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Mood correlation */}
            {report.moodCorrelation?.length > 0 && (
              <div className="glass-card rounded-2xl p-5 mb-4">
                <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                  Correlación ánimo-dolor
                </h2>
                <p className="text-[10px] text-slate-500 mb-4">Dolor promedio cuando reportaste cada estado de ánimo</p>
                {report.moodCorrelation.map((m: any) => (
                  <div key={m.mood} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-white">{m.mood}</div>
                      <div className="text-[10px] text-slate-500">{m.count} registros</div>
                    </div>
                    <span className={`text-sm font-bold ${
                      m.averagePain >= 7 ? 'text-red-400' : m.averagePain >= 4 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {m.averagePain}/10
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Summary card */}
            {report.summary && (
              <div className="glass-card-accent rounded-2xl p-5 mb-4">
                <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">summarize</span>
                  Resumen del período
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  En los últimos <strong className="text-white">{report.summary.periodDays} días</strong> registraste dolor <strong className="text-white">{report.summary.total} veces</strong> en <strong className="text-white">{report.summary.daysWithPain} días distintos</strong>.
                  Tu dolor promedio fue <strong className="text-white">{report.summary.average}/10</strong>, con un mínimo de <strong className="text-white">{report.summary.min}</strong> y un máximo de <strong className="text-white">{report.summary.max}</strong>.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
