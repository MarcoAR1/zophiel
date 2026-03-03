import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useI18n } from '../i18n/index';

const PERIODS = [
  { label: '7 días', days: 7 },
  { label: '30 días', days: 30 },
  { label: '90 días', days: 90 },
];

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function PainHistory() {
  const { t } = useI18n();
  const [period, setPeriod] = useState(7);
  const [stats, setStats] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.pain.stats(period).catch(() => null),
      api.pain.list({ days: String(period) }).catch(() => []),
    ]).then(([s, e]) => {
      setStats(s);
      setEntries(e || []);
      setLoading(false);
    });
  }, [period]);

  // Simulated zone frequencies
  const zones = [
    { name: 'Lumbar', pct: 45 },
    { name: 'Cervical', pct: 30 },
    { name: 'Dorsal', pct: 25 },
  ];

  // Generate heatmap data (4 time blocks x 7 days)
  const heatmapRows = ['Mañ', 'Tar', 'Noc', 'Mad'];

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

      {/* Summary Cards (Stitch PRO — separate cards) */}
      <div className="flex flex-col gap-3 px-5 mb-5">
        {/* Pain Average */}
        <div className="rounded-2xl p-4 bg-white/[0.03] border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 blur-[25px] rounded-full -mr-4 -mt-4" />
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-[16px]">sentiment_dissatisfied</span>
            <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Dolor promedio</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{stats?.average ?? '—'}</span>
            <span className="text-xs text-primary font-semibold">/10</span>
          </div>
        </div>

        {/* Total entries */}
        <div className="rounded-2xl p-4 glass-card">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-slate-400 text-[16px]">edit_note</span>
            <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Total registros</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{stats?.count ?? 0}</span>
            <span className="text-xs text-slate-500">últimos {period} días</span>
          </div>
        </div>

        {/* Most common zone */}
        <div className="rounded-2xl p-4 glass-card">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-orange-400 text-[16px]">pin_drop</span>
            <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Zona común</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[14px]">radio_button_checked</span>
            <span className="text-lg font-bold text-white">Lumbalgia</span>
          </div>
        </div>
      </div>

      {/* Pain Trend Chart */}
      <div className="mx-5 rounded-2xl p-5 mb-5 glass-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Tendencia de dolor</h3>
          <span className="material-symbols-outlined text-slate-600 text-[16px]">more_horiz</span>
        </div>
        <div className="h-28 flex items-end gap-1">
          {DAYS.map((day, i) => {
            // Simulate pain values for visual chart
            const painValues = [3, 5, 4, 6, 5, 3, 4];
            const val = painValues[i] || 3;
            const h = Math.max(15, val * 10);
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary/40 to-primary/80 transition-all duration-500 mx-auto"
                    style={{ height: `${h}px` }}
                  />
                  {i === DAYS.length - 2 && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-primary font-bold bg-primary/15 rounded px-1.5 py-0.5">
                      ● {val}
                    </div>
                  )}
                </div>
                <span className="text-[8px] text-slate-600">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Intensity Heatmap */}
      <div className="mx-5 rounded-2xl p-5 mb-5 glass-card">
        <h3 className="text-sm font-bold text-white mb-4">Intensidad Horaria</h3>
        <div className="space-y-2">
          {heatmapRows.map((row, ri) => (
            <div key={row} className="flex items-center gap-2">
              <span className="text-[9px] text-slate-600 w-6">{row}</span>
              <div className="flex-1 grid grid-cols-7 gap-1">
                {DAYS.map((_, di) => {
                  // Simulated intensity values
                  const intensities = [
                    [2, 3, 1, 4, 2, 0, 1],
                    [4, 5, 3, 6, 5, 2, 3],
                    [3, 4, 2, 5, 3, 1, 2],
                    [1, 2, 1, 3, 1, 0, 1],
                  ];
                  const val = intensities[ri]?.[di] || 0;
                  const opacity = val === 0 ? '0.05' : (val / 6).toFixed(2);
                  return (
                    <div
                      key={di}
                      className="aspect-square rounded-full"
                      style={{ backgroundColor: `rgba(140, 37, 244, ${opacity})` }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="flex items-center gap-1">
            <div className="size-2 rounded-full bg-primary/10" />
            <span className="text-[8px] text-slate-600">Leve</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-2 rounded-full bg-primary/50" />
            <span className="text-[8px] text-slate-600">Mod.</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-[8px] text-slate-600">Intenso</span>
          </div>
        </div>
      </div>

      {/* Frequent Zones */}
      <div className="mx-5 rounded-2xl p-5 mb-5 glass-card">
        <h3 className="text-sm font-bold text-white mb-4">Zonas Frecuentes</h3>
        <div className="space-y-3">
          {zones.map((zone) => (
            <div key={zone.name} className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-16 shrink-0">{zone.name}</span>
              <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-700"
                  style={{ width: `${zone.pct}%` }}
                />
              </div>
              <span className="text-xs text-white font-bold w-10 text-right">{zone.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
