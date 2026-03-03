import { useState, useEffect } from 'react';
import { api } from '../services/api';

const PERIODS = [
  { label: '7 días', days: 7 },
  { label: '30 días', days: 30 },
  { label: '90 días', days: 90 },
];

const REGION_LABELS: Record<string, string> = {
  head: 'Cabeza', neck: 'Cervical', chest: 'Pecho', upper_back: 'Dorsal',
  lower_back: 'Lumbar', abdomen: 'Abdomen', left_shoulder: 'Hombro Izq.',
  right_shoulder: 'Hombro Der.', left_arm: 'Brazo Izq.', right_arm: 'Brazo Der.',
  left_hand: 'Mano Izq.', right_hand: 'Mano Der.', left_leg: 'Pierna Izq.',
  right_leg: 'Pierna Der.', left_knee: 'Rodilla Izq.', right_knee: 'Rodilla Der.',
  left_foot: 'Pie Izq.', right_foot: 'Pie Der.', pelvis: 'Pelvis',
  unknown: 'Otro',
};

export default function PainHistory() {
  const [period, setPeriod] = useState(30);
  const [stats, setStats] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.pain.stats(period).catch(() => null),
      api.analytics.painTrend(period).catch(() => []),
      api.analytics.painReport(period).catch(() => null),
    ]).then(([s, t, r]) => {
      setStats(s);
      setTrend(Array.isArray(t) ? t : []);
      setReport(r);
      setLoading(false);
    });
  }, [period]);

  const summary = report?.summary;
  const regionStats: any[] = report?.regionStats || [];
  const weeklyHeatmap: any[] = report?.weeklyHeatmap || [];
  const timeOfDay = report?.timeOfDay;
  const totalRegionEntries = regionStats.reduce((sum: number, r: any) => sum + r.count, 0);

  // ── Trend SVG ──
  const trendValues = trend.map((d: any) => d.average || 0);
  const chartW = 300;
  const chartH = 100;
  const maxVal = Math.max(...trendValues, 10);
  const trendPath = trendValues.length >= 2
    ? trendValues.map((v: number, i: number) => {
        const x = (i / (trendValues.length - 1)) * chartW;
        const y = chartH - (v / maxVal) * (chartH - 10) - 5;
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      }).join(' ')
    : '';
  const areaPath = trendPath ? `${trendPath} L${chartW},${chartH} L0,${chartH} Z` : '';

  // ── Hourly intensity ──
  const hourLabels = ['00', '03', '06', '09', '12', '15', '18', '21'];
  const allHours = Array.from({ length: 24 }, (_, h) => {
    if (!report) return { hour: h, average: 0 };
    // timeOfDay only has peak/best, so derive from weeklyHeatmap or trend
    return { hour: h, average: 0 };
  });
  // Build from raw entries if available — use timeOfDay peak/best
  const peakHour = timeOfDay?.peak;
  const bestHour = timeOfDay?.best;

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col antialiased pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 mb-4">
        <h1 className="text-[22px] font-bold text-white tracking-tight">Historial de Dolor</h1>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold cursor-pointer hover:bg-primary/15 transition-colors">
          <span className="material-symbols-outlined text-[14px]">download</span>
          Exportar PDF
        </button>
      </div>

      {/* Period selector */}
      <div className="flex gap-2 px-5 mb-5">
        {PERIODS.map((p) => (
          <button
            key={p.days}
            onClick={() => setPeriod(p.days)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border ${
              period === p.days
                ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(140,37,244,0.3)]'
                : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-white/[0.06]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-2.5 px-5 mb-5">
        <div className="rounded-2xl p-3.5 glass-card text-center">
          <span className="material-symbols-outlined text-primary text-[18px] mb-1 block">avg_pace</span>
          <span className="text-2xl font-bold text-white block">{summary?.average ?? '—'}</span>
          <span className="text-[9px] text-slate-500 uppercase tracking-wider">Promedio</span>
        </div>
        <div className="rounded-2xl p-3.5 glass-card text-center">
          <span className="material-symbols-outlined text-orange-400 text-[18px] mb-1 block">edit_note</span>
          <span className="text-2xl font-bold text-white block">{summary?.total ?? 0}</span>
          <span className="text-[9px] text-slate-500 uppercase tracking-wider">Registros</span>
        </div>
        <div className="rounded-2xl p-3.5 glass-card text-center">
          <span className="material-symbols-outlined text-red-400 text-[18px] mb-1 block">arrow_upward</span>
          <span className="text-2xl font-bold text-white block">{summary?.max ?? '—'}</span>
          <span className="text-[9px] text-slate-500 uppercase tracking-wider">Máximo</span>
        </div>
      </div>

      {/* ── Pain Trend Chart ── */}
      <div className="mx-5 rounded-2xl p-5 mb-5 glass-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Tendencia de dolor</h3>
          {trendValues.length >= 2 && (
            <span className="text-[10px] font-bold text-slate-400 bg-white/5 rounded-full px-2 py-1">
              {trend.length} días
            </span>
          )}
        </div>

        {trendValues.length >= 2 ? (
          <div className="relative h-28">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-full" preserveAspectRatio="none">
              {[2, 4, 6, 8].map((v) => {
                const y = chartH - (v / maxVal) * (chartH - 10) - 5;
                return (
                  <g key={v}>
                    <line x1="0" y1={y} x2={chartW} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <text x="-2" y={y + 3} fill="rgba(255,255,255,0.15)" fontSize="7" textAnchor="end">{v}</text>
                  </g>
                );
              })}
              <path d={areaPath} fill="url(#painGrad)" />
              <path d={trendPath} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {trendValues.map((v: number, i: number) => {
                const x = (i / (trendValues.length - 1)) * chartW;
                const y = chartH - (v / maxVal) * (chartH - 10) - 5;
                return <circle key={i} cx={x} cy={y} r="2.5" fill="#ef4444" stroke="#0f0b15" strokeWidth="1" />;
              })}
              <defs>
                <linearGradient id="painGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-between mt-1 text-[9px] text-slate-600">
              <span>{trend[0]?.date?.slice(5) || ''}</span>
              {trend.length > 4 && <span>{trend[Math.floor(trend.length / 2)]?.date?.slice(5) || ''}</span>}
              <span>{trend[trend.length - 1]?.date?.slice(5) || ''}</span>
            </div>
          </div>
        ) : (
          <div className="h-28 flex items-center justify-center text-slate-600 text-sm">
            <div className="text-center">
              <span className="material-symbols-outlined text-2xl mb-1 block opacity-30">show_chart</span>
              Sin datos suficientes para mostrar
            </div>
          </div>
        )}
      </div>

      {/* ── Intensidad Horaria (peak/best from API) ── */}
      <div className="mx-5 rounded-2xl p-5 mb-5 glass-card">
        <h3 className="text-sm font-bold text-white mb-4">Intensidad Horaria</h3>
        {peakHour || bestHour ? (
          <div className="space-y-3">
            {peakHour && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-400 text-[20px]">trending_up</span>
                </div>
                <div className="flex-1">
                  <span className="text-white text-sm font-semibold block">Pico de dolor</span>
                  <span className="text-[11px] text-slate-500">{peakHour.hour}:00 hs — promedio {peakHour.average}/10</span>
                </div>
                <span className="text-xl font-bold text-red-400">{peakHour.average}</span>
              </div>
            )}
            {bestHour && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-400 text-[20px]">trending_down</span>
                </div>
                <div className="flex-1">
                  <span className="text-white text-sm font-semibold block">Menor dolor</span>
                  <span className="text-[11px] text-slate-500">{bestHour.hour}:00 hs — promedio {bestHour.average}/10</span>
                </div>
                <span className="text-xl font-bold text-green-400">{bestHour.average}</span>
              </div>
            )}
            {/* Weekly heatmap */}
            {weeklyHeatmap.length > 0 && (
              <div className="mt-4">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">Dolor por día de semana</span>
                <div className="flex gap-1.5">
                  {weeklyHeatmap.map((d: any) => {
                    const intensity = d.average || 0;
                    const opacity = intensity > 0 ? Math.min(intensity / 10, 1) : 0.05;
                    return (
                      <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full aspect-square rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `rgba(239,68,68,${opacity})` }}
                        >
                          {d.count > 0 && <span className="text-[9px] text-white font-bold">{d.average}</span>}
                        </div>
                        <span className="text-[8px] text-slate-600">{d.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center text-slate-600 text-sm">
            <div className="text-center">
              <span className="material-symbols-outlined text-2xl mb-1 block opacity-30">schedule</span>
              Sin datos horarios aún
            </div>
          </div>
        )}
      </div>

      {/* ── Zonas Frecuentes (real from API) ── */}
      <div className="mx-5 rounded-2xl p-5 mb-5 glass-card">
        <h3 className="text-sm font-bold text-white mb-4">Zonas Frecuentes</h3>
        {regionStats.length > 0 ? (
          <div className="space-y-3">
            {regionStats.map((zone: any, i: number) => {
              const pct = totalRegionEntries > 0 ? Math.round((zone.count / totalRegionEntries) * 100) : 0;
              const label = REGION_LABELS[zone.region] || zone.region;
              const isTop = i === 0;
              return (
                <div key={zone.region}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {isTop && (
                        <span className="material-symbols-outlined text-primary text-[14px]">star</span>
                      )}
                      <span className={`text-xs ${isTop ? 'text-white font-semibold' : 'text-slate-400'}`}>{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">{zone.count} registros</span>
                      <span className="text-xs text-white font-bold">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isTop ? '#8c25f4' : 'rgba(140,37,244,0.5)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center text-slate-600 text-sm">
            <div className="text-center">
              <span className="material-symbols-outlined text-2xl mb-1 block opacity-30">pin_drop</span>
              Sin datos de zonas aún
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
