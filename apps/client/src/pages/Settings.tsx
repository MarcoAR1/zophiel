import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useI18n, LOCALE_LABELS, LOCALE_FLAGS, type Locale } from '../i18n/index';
import { notificationService } from '../services/notificationService';
import {
  NOTIFICATION_LEVELS,
  NOTIFICATION_SCHEDULES,
  type NotificationLevel,
} from '@zophiel/shared';

const LEVEL_LABELS: Record<NotificationLevel, string> = {
  low: 'Bajo — 2 veces/día',
  medium: 'Medio — 4 veces/día',
  high: 'Alto — 6 veces/día',
};

const LOCALES: Locale[] = ['es', 'pt', 'fr'];

export default function Settings() {
  const { user, logout } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const [notifLevel, setNotifLevel] = useState<NotificationLevel>(user?.notificationLevel || 'medium');
  const [quietStart, setQuietStart] = useState(user?.quietHoursStart || '22:00');
  const [quietEnd, setQuietEnd] = useState(user?.quietHoursEnd || '08:00');
  const [name, setName] = useState(user?.name || '');
  const [diagnosis, setDiagnosis] = useState(user?.diagnosis || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [notifPermission, setNotifPermission] = useState<string>('default');
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
    api.health.status().then(setHealthStatus).catch(() => {});
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setHealthLoading(true);
      api.health.connect(code)
        .then(() => {
          setHealthStatus({ connected: true, provider: 'google_fit' });
          setSuccess('✅ Google Fit conectado');
          setTimeout(() => setSuccess(''), 3000);
          window.history.replaceState({}, '', window.location.pathname);
        })
        .catch(() => setSuccess('❌ Error al conectar Google Fit'))
        .finally(() => setHealthLoading(false));
    }
  }, []);

  const saveNotifications = async () => {
    setSaving(true);
    try {
      await api.settings.updateNotifications({
        notificationLevel: notifLevel,
        quietHoursStart: quietStart,
        quietHoursEnd: quietEnd,
      });
      await notificationService.scheduleLocalReminders(
        NOTIFICATION_SCHEDULES[notifLevel],
        quietStart,
        quietEnd,
      );
      setSuccess(t('settings_saved'));
      setTimeout(() => setSuccess(''), 2000);
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.settings.updateProfile({
        name: name || undefined,
        diagnosis: diagnosis || undefined,
      });
      setSuccess(t('settings_saved'));
      setTimeout(() => setSuccess(''), 2000);
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const activateNotifications = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      setNotifPermission('granted');
      await notificationService.init();
      setSuccess('🔔 Notificaciones activadas');
      setTimeout(() => setSuccess(''), 2000);
    } else {
      setNotifPermission('denied');
    }
  };

  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 px-5 py-6 pb-24">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />

      <h1 className="text-2xl font-bold text-white mb-6">{t('settings_title')}</h1>

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
          {success}
        </div>
      )}

      {/* Language Selector */}
      <div className="glass-card rounded-2xl p-5 mb-4">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">translate</span>
          {t('settings_language')}
        </h2>
        <div className="flex gap-2">
          {LOCALES.map((loc) => (
            <button
              key={loc}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200 ${
                locale === loc
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
              onClick={() => setLocale(loc)}
            >
              {LOCALE_FLAGS[loc]} {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>
      </div>

      {/* Health Data Connection */}
      <div className="glass-card rounded-2xl p-5 mb-4">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">cardiology</span>
          Datos de salud
        </h2>

        {healthStatus?.connected ? (
          <div>
            <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
              <span className="text-sm text-green-400">✅ Google Fit conectado</span>
            </div>
            {healthStatus.lastSync && (
              <p className="text-[10px] text-slate-500 mb-4">
                Última sincronización: {new Date(healthStatus.lastSync).toLocaleString()}
              </p>
            )}
            <div className="flex gap-2">
              <button
                className="flex-1 h-12 bg-gradient-to-r from-primary to-[#6d1cc5] text-white font-semibold rounded-xl text-sm disabled:opacity-50 transition-all"
                onClick={async () => {
                  setHealthLoading(true);
                  try {
                    await api.health.sync();
                    setSuccess('📱 Datos sincronizados');
                    setTimeout(() => setSuccess(''), 2000);
                  } catch { /* ignore */ }
                  setHealthLoading(false);
                }}
                disabled={healthLoading}
              >
                {healthLoading ? '⏳ Sincronizando...' : '🔄 Sincronizar'}
              </button>
              <button
                className="px-4 h-12 rounded-xl text-sm font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                onClick={async () => {
                  await api.health.disconnect();
                  setHealthStatus({ connected: false });
                  setSuccess('Desconectado');
                  setTimeout(() => setSuccess(''), 2000);
                }}
              >
                Desconectar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Conectá tu app de salud para obtener datos automáticos de sueño, pasos, frecuencia cardíaca y más.
            </p>
            <button
              className="w-full h-12 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #4285f4, #34a853)' }}
              onClick={async () => {
                setHealthLoading(true);
                try {
                  const { url } = await api.health.getAuthUrl();
                  window.location.href = url;
                } catch {
                  setSuccess('❌ Error al conectar');
                  setHealthLoading(false);
                }
              }}
              disabled={healthLoading}
            >
              {healthLoading ? '⏳ Conectando...' : '🏃 Conectar Google Fit'}
            </button>
            <div className="text-[10px] text-slate-500 mt-3 leading-relaxed">
              📊 Datos obtenidos: sueño, pasos, frecuencia cardíaca, calorías, minutos activos
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="glass-card rounded-2xl p-5 mb-4">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">person</span>
          {t('settings_profile')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 ml-1 mb-1.5 block">{t('auth_name')}</label>
            <input
              className="w-full h-12 pl-4 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 ml-1 mb-1.5 block">Diagnóstico</label>
            <input
              className="w-full h-12 pl-4 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-sm"
              placeholder="Ej: Fibromialgia, Artritis reumatoide..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>
          <button
            className="w-full h-12 bg-gradient-to-r from-primary to-[#6d1cc5] text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 text-sm"
            onClick={saveProfile}
            disabled={saving}
          >
            {t('settings_save')}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card rounded-2xl p-5 mb-4">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
          {t('settings_notifications')}
        </h2>

        {notifPermission === 'default' && (
          <div className="mb-4">
            <button
              className="w-full h-12 bg-gradient-to-r from-primary to-[#6d1cc5] text-white font-bold rounded-xl shadow-lg shadow-primary/25 text-sm"
              onClick={activateNotifications}
            >
              🔔 Activar notificaciones
            </button>
          </div>
        )}

        {notifPermission === 'denied' && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="font-semibold mb-2 text-red-400 text-sm">🚫 Notificaciones bloqueadas</div>
            <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">
              El navegador bloqueó las notificaciones. Para activarlas:
            </p>
            <ol className="text-[10px] text-slate-500 pl-4 leading-relaxed list-decimal">
              <li>Hacé clic en el 🔒 candado en la barra de direcciones</li>
              <li>Buscá <strong className="text-slate-300">Notificaciones</strong></li>
              <li>Cambialo a <strong className="text-slate-300">Permitir</strong></li>
              <li>Recargá la página</li>
            </ol>
          </div>
        )}

        {notifPermission === 'granted' && (
          <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
            <span className="text-sm text-green-400">✅ Notificaciones activas</span>
          </div>
        )}

        <label className="text-xs font-semibold text-slate-400 mb-3 block">
          Frecuencia de recordatorios
        </label>

        <div className="flex flex-col gap-2 mb-4">
          {NOTIFICATION_LEVELS.map((level) => (
            <button
              key={level}
              className={`w-full py-3 px-4 rounded-xl text-sm font-medium text-left transition-all duration-200 ${
                notifLevel === level
                  ? 'bg-primary/20 border border-primary/40 text-white'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
              }`}
              onClick={() => setNotifLevel(level)}
            >
              {LEVEL_LABELS[level]}
            </button>
          ))}
        </div>

        <div className="text-[10px] text-slate-500 mb-4">
          Horarios: {NOTIFICATION_SCHEDULES[notifLevel].join(', ')}
        </div>

        <label className="text-xs font-semibold text-slate-400 mb-3 block">
          Horas silenciosas
        </label>

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="text-[10px] text-slate-500 mb-1 block">Desde</label>
            <input
              className="w-full h-12 pl-4 pr-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-sm"
              type="time"
              value={quietStart}
              onChange={(e) => setQuietStart(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-slate-500 mb-1 block">Hasta</label>
            <input
              className="w-full h-12 pl-4 pr-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-sm"
              type="time"
              value={quietEnd}
              onChange={(e) => setQuietEnd(e.target.value)}
            />
          </div>
        </div>

        <button
          className="w-full h-12 bg-gradient-to-r from-primary to-[#6d1cc5] text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 text-sm"
          onClick={saveNotifications}
          disabled={saving}
        >
          {t('settings_save')}
        </button>
      </div>

      {/* Logout */}
      <button
        className="w-full h-12 rounded-xl text-sm font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 active:scale-[0.99] transition-all duration-200"
        onClick={logout}
      >
        {t('settings_logout')}
      </button>
    </div>
  );
}
