import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { useI18n } from '../i18n/index';

const LANGUAGES = [
  { code: 'es' as const, label: 'ES' },
  { code: 'en' as const, label: 'EN' },
  { code: 'pt' as const, label: 'PT' },
  { code: 'fr' as const, label: 'FR' },
];

const NOTIF_LEVELS = [
  { value: 'all', icon: 'notifications_active', title: 'Todas', desc: 'Recordatorios, mensajes y alertas' },
  { value: 'important', icon: 'notifications', title: 'Solo importantes', desc: 'Alertas médicas y citas' },
  { value: 'none', icon: 'notifications_off', title: 'Ninguna', desc: 'Sin interrupciones' },
];

const DEFAULT_REMINDERS = ['09:00', '14:00', '21:00'];

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();

  // ── Profile ──
  const [name, setName] = useState(user?.name || '');

  // ── Notifications ──
  const [notifLevel, setNotifLevel] = useState(user?.notificationLevel || 'all');
  const [quietStart, setQuietStart] = useState(user?.quietHoursStart || '22:00');
  const [quietEnd, setQuietEnd] = useState(user?.quietHoursEnd || '08:00');
  const [quietEnabled, setQuietEnabled] = useState(!!(user?.quietHoursStart && user?.quietHoursEnd));
  const [reminderTimes, setReminderTimes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('zophiel_reminders');
      return stored ? JSON.parse(stored) : DEFAULT_REMINDERS;
    } catch { return DEFAULT_REMINDERS; }
  });

  const [saving, setSaving] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  useEffect(() => {
    api.health.status().catch(() => null).then(setHealthStatus);
  }, []);

  // ── Save helpers ──
  const saveProfile = async (field: string, value: any) => {
    setSaving(true);
    try { await api.settings.updateProfile({ [field]: value }); } catch {}
    setSaving(false);
  };

  const saveNotifications = async (updates: {
    notificationLevel?: string;
    quietHoursStart?: string;
    quietHoursEnd?: string;
  }) => {
    setSaving(true);
    try {
      const payload = {
        notificationLevel: updates.notificationLevel || notifLevel,
        quietHoursStart: quietEnabled ? (updates.quietHoursStart || quietStart) : undefined,
        quietHoursEnd: quietEnabled ? (updates.quietHoursEnd || quietEnd) : undefined,
      };
      const result = await api.settings.updateNotifications(payload);
      if (result) updateUser(result);
    } catch {}
    setSaving(false);
  };

  const addReminder = () => {
    const newTimes = [...reminderTimes, '12:00'].sort();
    setReminderTimes(newTimes);
    localStorage.setItem('zophiel_reminders', JSON.stringify(newTimes));
  };

  const removeReminder = (idx: number) => {
    const newTimes = reminderTimes.filter((_, i) => i !== idx);
    setReminderTimes(newTimes);
    localStorage.setItem('zophiel_reminders', JSON.stringify(newTimes));
  };

  const updateReminder = (idx: number, val: string) => {
    const newTimes = [...reminderTimes];
    newTimes[idx] = val;
    newTimes.sort();
    setReminderTimes(newTimes);
    localStorage.setItem('zophiel_reminders', JSON.stringify(newTimes));
  };

  const connectGoogleFit = async () => {
    try {
      const { url } = await api.health.getAuthUrl();
      window.location.href = url;
    } catch {}
  };

  const disconnectGoogleFit = async () => {
    try {
      await api.health.disconnect();
      setHealthStatus(null);
    } catch {}
  };

  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col antialiased pb-24">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 mb-6">
        <button onClick={() => window.history.back()} className="size-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 bg-transparent cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold text-white tracking-tight">Configuración</h1>
      </div>

      {/* Profile Card */}
      <div className="mx-5 rounded-2xl p-5 mb-5 glass-card">
        <div className="flex flex-col items-center mb-5">
          <div className="size-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/30 flex items-center justify-center mb-2 relative">
            <span className="material-symbols-outlined text-primary text-3xl">person</span>
            <div className="absolute -bottom-0.5 -right-0.5 size-6 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[12px]">edit</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block mb-1.5">Nombre completo</label>
            <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-3">
              <span className="material-symbols-outlined text-slate-500 text-[18px]">person</span>
              <input
                className="flex-1 bg-transparent text-white text-sm outline-none border-none placeholder-slate-600 font-[inherit]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => name !== user?.name && saveProfile('name', name)}
                placeholder="Tu nombre"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block mb-1.5">Email</label>
            <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-3">
              <span className="material-symbols-outlined text-slate-500 text-[18px]">mail</span>
              <span className="flex-1 text-slate-400 text-sm">{user?.email || '—'}</span>
              <div className="size-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-400 text-[12px]">check</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="mx-5 mb-5">
        <h3 className="text-sm font-bold text-white mb-3">Idioma</h3>
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                saveProfile('language', lang.code);
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer border ${
                locale === lang.code
                  ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(140,37,244,0.3)]'
                  : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-white/[0.06]'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── NOTIFICATIONS SECTION ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="mx-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
          <h3 className="text-sm font-bold text-white">Notificaciones</h3>
        </div>

        {/* ── Notification Level ── */}
        <div className="flex flex-col gap-2.5 mb-6">
          {NOTIF_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => {
                setNotifLevel(level.value);
                saveNotifications({ notificationLevel: level.value });
              }}
              className={`rounded-xl p-4 flex items-center gap-3.5 text-left transition-all duration-200 cursor-pointer border ${
                notifLevel === level.value
                  ? 'bg-primary/[0.08] border-primary/30 shadow-[0_0_20px_rgba(140,37,244,0.08)]'
                  : 'bg-white/[0.03] border-white/[0.06]'
              }`}
            >
              <div className={`size-10 rounded-xl flex items-center justify-center ${
                notifLevel === level.value ? 'bg-primary/15 text-primary' : 'bg-white/5 text-slate-500'
              }`}>
                <span className="material-symbols-outlined text-[20px]">{level.icon}</span>
              </div>
              <div className="flex-1">
                <span className="text-white font-semibold text-sm block">{level.title}</span>
                <span className="text-[11px] text-slate-500">{level.desc}</span>
              </div>
              <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                notifLevel === level.value ? 'border-primary bg-primary' : 'border-slate-600'
              }`}>
                {notifLevel === level.value && (
                  <span className="material-symbols-outlined text-white text-[12px]">check</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* ── Quiet Hours ── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">bedtime</span>
              <span className="text-sm font-semibold text-white">Horario de silencio</span>
            </div>
            <button
              onClick={() => {
                const next = !quietEnabled;
                setQuietEnabled(next);
                if (!next) {
                  saveNotifications({ quietHoursStart: undefined, quietHoursEnd: undefined });
                } else {
                  saveNotifications({ quietHoursStart: quietStart, quietHoursEnd: quietEnd });
                }
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer border-none ${
                quietEnabled ? 'bg-primary' : 'bg-white/10'
              }`}
            >
              <span className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                quietEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {quietEnabled && (
            <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 uppercase tracking-wide mb-1 block">Desde</label>
                <input
                  className="w-full h-10 bg-[#1f1627] border border-[#473b54] rounded-xl text-white text-center focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                  type="time"
                  value={quietStart}
                  onChange={(e) => {
                    setQuietStart(e.target.value);
                    saveNotifications({ quietHoursStart: e.target.value });
                  }}
                />
              </div>
              <span className="text-slate-500 text-sm mt-4">→</span>
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 uppercase tracking-wide mb-1 block">Hasta</label>
                <input
                  className="w-full h-10 bg-[#1f1627] border border-[#473b54] rounded-xl text-white text-center focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                  type="time"
                  value={quietEnd}
                  onChange={(e) => {
                    setQuietEnd(e.target.value);
                    saveNotifications({ quietHoursEnd: e.target.value });
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Custom Reminder Times ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">schedule</span>
              <span className="text-sm font-semibold text-white">Horarios de recordatorio</span>
            </div>
            <button
              onClick={addReminder}
              className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">Te avisamos para que registres tu dolor en estos horarios</p>

          <div className="flex flex-col gap-2">
            {reminderTimes.map((time, idx) => (
              <div key={idx} className="glass-card rounded-xl p-3 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[18px]">alarm</span>
                </div>
                <input
                  className="flex-1 h-9 bg-[#1f1627] border border-[#473b54] rounded-lg text-white text-center focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                  type="time"
                  value={time}
                  onChange={(e) => updateReminder(idx, e.target.value)}
                />
                <button
                  onClick={() => removeReminder(idx)}
                  className="size-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 cursor-pointer hover:bg-red-500/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            ))}
            {reminderTimes.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-sm">
                <span className="material-symbols-outlined text-[32px] mb-2 block opacity-30">notifications_off</span>
                Sin recordatorios configurados
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Google Fit */}
      <div className="mx-5 rounded-2xl p-5 mb-5 glass-card">
        <div className="flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
            <span className="material-symbols-outlined text-[20px]">fitness_center</span>
          </div>
          <div className="flex-1">
            <span className="text-white font-semibold text-sm block">Google Fit</span>
            <span className="text-[11px] text-slate-500">Sincronizá tu actividad física</span>
          </div>
          {healthStatus?.connected ? (
            <button onClick={disconnectGoogleFit} className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 cursor-pointer transition-colors hover:bg-red-500/20">
              Desconectar
            </button>
          ) : (
            <button onClick={connectGoogleFit} className="px-4 py-2 rounded-xl text-xs font-bold text-green-400 bg-green-500/15 border border-green-500/25 cursor-pointer transition-colors hover:bg-green-500/25">
              Conectar
            </button>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="mx-5 mt-2">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 text-red-400 text-sm font-semibold bg-transparent border-none cursor-pointer hover:text-red-300 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Cerrar Sesión
        </button>
      </div>

      {saving && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-medium z-50">
          Guardando...
        </div>
      )}
    </div>
  );
}
