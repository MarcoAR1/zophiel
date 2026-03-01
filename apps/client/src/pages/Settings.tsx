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

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
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
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
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
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
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
    <div className="page">
      <h1 className="page-title animate-in">{t('settings_title')}</h1>

      {success && (
        <div className="toast toast-success" style={{ position: 'relative', top: 0, marginBottom: 'var(--space-md)' }}>
          ✅ {success}
        </div>
      )}

      {/* Language Selector */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="section-header">
          <h2 className="section-title">{t('settings_language')}</h2>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          {LOCALES.map((loc) => (
            <button
              key={loc}
              className={`chip ${locale === loc ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-sm)' }}
              onClick={() => setLocale(loc)}
            >
              {LOCALE_FLAGS[loc]} {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>
      </div>

      {/* Profile */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="section-header">
          <h2 className="section-title">{t('settings_profile')}</h2>
        </div>
        <div className="auth-form">
          <div className="input-group">
            <label>{t('auth_name')}</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Diagnóstico</label>
            <input
              className="input"
              placeholder="Ej: Fibromialgia, Artritis reumatoide..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-block" onClick={saveProfile} disabled={saving}>
            {t('settings_save')}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="section-header">
          <h2 className="section-title">{t('settings_notifications')}</h2>
        </div>

        {notifPermission === 'default' && (
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <button
              className="btn btn-primary btn-block"
              onClick={activateNotifications}
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              🔔 Activar notificaciones
            </button>
          </div>
        )}

        {notifPermission === 'denied' && (
          <div style={{
            marginBottom: 'var(--space-lg)',
            padding: 'var(--space-md)',
            background: 'rgba(239,68,68,0.08)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}>
            <div style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--danger)' }}>
              🚫 Notificaciones bloqueadas
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)', lineHeight: 1.5 }}>
              El navegador bloqueó las notificaciones. Para activarlas:
            </p>
            <ol style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', paddingLeft: '1.2rem', lineHeight: 1.8 }}>
              <li>Hacé clic en el 🔒 candado en la barra de direcciones</li>
              <li>Buscá <strong>Notificaciones</strong></li>
              <li>Cambialo a <strong>Permitir</strong></li>
              <li>Recargá la página</li>
            </ol>
          </div>
        )}

        {notifPermission === 'granted' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
            marginBottom: 'var(--space-lg)', padding: 'var(--space-sm)',
            background: 'rgba(34,197,94,0.1)', borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-sm)', color: 'var(--success)',
          }}>
            ✅ Notificaciones activas
          </div>
        )}

        <label style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: 'var(--space-md)' }}>
          Frecuencia de recordatorios
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
          {NOTIFICATION_LEVELS.map((level) => (
            <button
              key={level}
              className={`chip ${notifLevel === level ? 'active' : ''}`}
              style={{ justifyContent: 'flex-start', padding: 'var(--space-sm) var(--space-md)' }}
              onClick={() => setNotifLevel(level)}
            >
              {LEVEL_LABELS[level]}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
          Horarios: {NOTIFICATION_SCHEDULES[notifLevel].join(', ')}
        </div>

        <label style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', fontWeight: 500, display: 'block', marginBottom: 'var(--space-md)' }}>
          Horas silenciosas
        </label>

        <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label>Desde</label>
            <input className="input" type="time" value={quietStart} onChange={(e) => setQuietStart(e.target.value)} />
          </div>
          <div className="input-group" style={{ flex: 1 }}>
            <label>Hasta</label>
            <input className="input" type="time" value={quietEnd} onChange={(e) => setQuietEnd(e.target.value)} />
          </div>
        </div>

        <button className="btn btn-primary btn-block" onClick={saveNotifications} disabled={saving}>
          {t('settings_save')}
        </button>
      </div>

      {/* Logout */}
      <button className="btn btn-danger btn-block animate-in" onClick={logout}>
        {t('settings_logout')}
      </button>
    </div>
  );
}
