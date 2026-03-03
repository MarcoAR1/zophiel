import { useState, useEffect } from 'react';
import { api } from '../services/api';

const PERIODS = [
  { label: '7 días', days: 7 },
  { label: '30 días', days: 30 },
  { label: '90 días', days: 90 },
];

const BREAKDOWN = [
  { key: 'pain', icon: 'coronavirus', label: 'Dolor', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { key: 'sleep', icon: 'bedtime', label: 'Sueño', color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
  { key: 'mood', icon: 'mood', label: 'Ánimo', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  { key: 'activity', icon: 'directions_walk', label: 'Actividad', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
];

export default function QualityOfLife() {
  const [period, setPeriod] = useState(7);
  const [data, setData] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.analytics.qualityOfLife(period).then((result: any) => {
      // API may return a single object or an array
      if (Array.isArray(result)) {
        setTrend(result);
        setData(result.length > 0 ? result[result.length - 1] : null);
      } else if (result && typeof result === 'object') {
        setData(result);
        setTrend([result]);
      } else {
        setData(null);
        setTrend([]);
      }
      setLoading(false);
    }).catch(() => {
      setData(null);
      setTrend([]);
      setLoading(false);
    });
  }, [period]);

  const score = data?.score ?? 0;
  const hasData = data != null && score > 0;

  // Ring gauge
  const circumference = 2 * Math.PI * 52;
  const arcOffset = hasData ? circumference - (score / 100) * circumference : circumference;
  const scoreColor = score >= 70 ? '#8c25f4' : score >= 40 ? '#eab308' : '#ef4444';

  // Real breakdown from API
  const breakdown = data?.breakdown || {};

  // Trend chart — build SVG path
  const trendScores = trend.map((d: any) => d.score || 0);
  const maxScore = Math.max(...trendScores, 1);
  const chartW = 300;
  const chartH = 100;
  const trendPath = trendScores.length >= 2
    ? trendScores.map((s: number, i: number) => {
        const x = (i / (trendScores.length - 1)) * chartW;
        const y = chartH - (s / maxScore) * (chartH - 10) - 5;
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      }).join(' ')
    : '';
  const areaPath = trendPath
    ? `${trendPath} L${chartW},${chartH} L0,${chartH} Z`
    : '';

  // Delta
  const delta = trendScores.length >= 2
    ? trendScores[trendScores.length - 1] - trendScores[0]
    : 0;

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
      <div className="px-5 pt-6 mb-4">
        <h1 className="text-[26px] font-bold text-white tracking-tight text-center">Calidad de Vida</h1>
        <p className="text-slate-500 text-sm text-center mt-1">Puntuación general</p>
      </div>

      {/* Circular Score Gauge */}
      <div className="flex flex-col items-center mb-5">
        <div className="relative size-44">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            {hasData && (
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={arcOffset}
                className="transition-all duration-1000"
                style={{ filter: `drop-shadow(0 0 12px ${scoreColor}60)` }}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {hasData ? (
              <>
                <span className="text-5xl font-bold text-white">{Math.round(score)}</span>
                <span className="text-xs text-slate-500 mt-1">de 100</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-slate-600 text-3xl mb-1">analytics</span>
                <span className="text-sm text-slate-500">Sin datos</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex gap-2 justify-center mb-6">
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

      {/* Trend Chart */}
      <div className="mx-5 rounded-2xl p-5 mb-5 glass-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Tendencia</h3>
          {delta !== 0 && (
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              delta > 0
                ? 'text-green-400 bg-green-500/10 border border-green-500/20'
                : 'text-red-400 bg-red-500/10 border border-red-500/20'
            }`}>
              {delta > 0 ? '+' : ''}{Math.round(delta)} pts
            </span>
          )}
        </div>

        {trendScores.length >= 2 ? (
          <div className="relative h-28">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-full" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((pct) => {
                const y = chartH - (pct / maxScore) * (chartH - 10) - 5;
                return <line key={pct} x1="0" y1={y} x2={chartW} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
              })}
              {/* Area fill */}
              <path d={areaPath} fill="url(#trendGradient)" />
              {/* Line */}
              <path d={trendPath} fill="none" stroke={scoreColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Dots */}
              {trendScores.map((s: number, i: number) => {
                const x = (i / (trendScores.length - 1)) * chartW;
                const y = chartH - (s / maxScore) * (chartH - 10) - 5;
                return (
                  <circle key={i} cx={x} cy={y} r="3" fill={scoreColor} stroke="#0f0b15" strokeWidth="1.5" />
                );
              })}
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={scoreColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={scoreColor} stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            {/* Date labels */}
            {trend.length > 0 && (
              <div className="flex justify-between mt-1 text-[9px] text-slate-600">
                <span>{trend[0]?.date?.slice(5) || ''}</span>
                {trend.length > 2 && <span>{trend[Math.floor(trend.length / 2)]?.date?.slice(5) || ''}</span>}
                <span>{trend[trend.length - 1]?.date?.slice(5) || ''}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-28 flex items-center justify-center text-slate-600 text-sm">
            <div className="text-center">
              <span className="material-symbols-outlined text-2xl mb-1 block opacity-30">show_chart</span>
              Registrá al menos 2 días para ver la tendencia
            </div>
          </div>
        )}
      </div>

      {/* Breakdown */}
      <div className="mx-5 mb-5">
        <h3 className="text-sm font-bold text-white mb-3">Desglose</h3>
        <div className="grid grid-cols-2 gap-3">
          {BREAKDOWN.map((item) => {
            const val = breakdown[item.key];
            const hasVal = val != null && val > 0;
            const displayVal = hasVal ? Math.round(val) : null;

            return (
              <div key={item.key} className="rounded-2xl p-4 glass-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.bg }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ color: item.color }}>{item.icon}</span>
                  </div>
                  <span className="text-xl font-bold text-white">
                    {displayVal != null ? `${displayVal}%` : '—'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mb-2">{item.label}</span>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  {displayVal != null ? (
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${displayVal}%`, backgroundColor: item.color }}
                    />
                  ) : (
                    <div className="h-full rounded-full bg-white/5" style={{ width: '0%' }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
