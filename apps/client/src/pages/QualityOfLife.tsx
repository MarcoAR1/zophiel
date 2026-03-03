import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useI18n } from '../i18n/index';

const PERIODS = [
  { label: '7 días', days: 7 },
  { label: '30 días', days: 30 },
  { label: '90 días', days: 90 },
];

const BREAKDOWN = [
  { key: 'mobility', icon: 'accessibility_new', label: 'Movilidad', color: 'bg-blue-500' },
  { key: 'sleep', icon: 'bedtime', label: 'Sueño', color: 'bg-indigo-500' },
  { key: 'mood', icon: 'mood', label: 'Ánimo', color: 'bg-pink-500' },
  { key: 'activity', icon: 'directions_walk', label: 'Actividad', color: 'bg-green-500' },
];

export default function QualityOfLife() {
  const { t } = useI18n();
  const [period, setPeriod] = useState(7);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.analytics.qualityOfLife(period).then((d: any[]) => {
      setData(d || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [period]);

  const latest = data.length > 0 ? data[data.length - 1] : null;
  const score = latest?.score ?? 0;

  // Calculate ring arc
  const circumference = 2 * Math.PI * 52; // radius 52
  const arcOffset = circumference - (score / 100) * circumference;

  // Score color
  const scoreColor = score >= 70 ? '#8c25f4' : score >= 40 ? '#eab308' : '#ef4444';

  // Simulate breakdown percentages from score
  const breakdown: Record<string, number> = {
    mobility: Math.min(100, Math.max(0, score - 9 + Math.floor(Math.random() * 5))),
    sleep: Math.min(100, Math.max(0, score + 8 + Math.floor(Math.random() * 5))),
    mood: Math.min(100, Math.max(0, score - 4 + Math.floor(Math.random() * 5))),
    activity: Math.min(100, Math.max(0, score - 14 + Math.floor(Math.random() * 5))),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col antialiased pb-24">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="px-5 pt-6 mb-4">
        <h1 className="text-[26px] font-bold text-white tracking-tight text-center">Calidad de Vida</h1>
      </div>

      {/* Circular Score Gauge */}
      <div className="flex flex-col items-center mb-5">
        <div className="relative size-40">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            {/* Background ring */}
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            {/* Score arc */}
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={arcOffset}
              className="transition-all duration-1000"
              style={{ filter: `drop-shadow(0 0 8px ${scoreColor}40)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-white">{score || '—'}</span>
          </div>
        </div>
        <span className="text-slate-500 text-sm mt-2">Puntuación general</span>
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
          {data.length >= 2 && (
            <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-1 rounded-full">
              +{Math.max(0, (data[data.length - 1]?.score || 0) - (data[0]?.score || 0))}% esta semana
            </span>
          )}
        </div>
        <div className="h-32 flex items-end gap-1 relative">
          {/* Simple bar chart visualization */}
          {(data.length > 0 ? data : [{ score: 0 }]).map((d: any, i: number) => {
            const h = Math.max(5, (d.score || 0) * 1.2);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary/60 to-primary transition-all duration-500 relative min-w-[4px]"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-primary font-bold bg-primary/10 rounded px-1">
                    {d.score}
                  </div>
                </div>
              </div>
            );
          })}
          {/* X axis labels */}
          <div className="absolute -bottom-5 left-0 right-0 flex justify-between text-[8px] text-slate-600">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown 2x2 Grid */}
      <div className="mx-5 mb-5">
        <h3 className="text-sm font-bold text-white mb-3">Desglose</h3>
        <div className="grid grid-cols-2 gap-3">
          {BREAKDOWN.map((item) => {
            const val = breakdown[item.key] || 0;
            return (
              <div key={item.key} className="rounded-2xl p-4 glass-card">
                <div className="flex items-center justify-between mb-3">
                  <div className={`size-8 rounded-lg ${item.color}/10 flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${item.color.replace('bg-', 'text-')} text-[16px]`}>{item.icon}</span>
                  </div>
                  <span className="text-xl font-bold text-white">{val}%</span>
                </div>
                <span className="text-[11px] text-slate-500 block mb-2">{item.label}</span>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-700`} style={{ width: `${val}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
