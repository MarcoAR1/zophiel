import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
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

export default function Settings() {
  const { user, logout } = useAuth();
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

      // Reprogramar notificaciones locales con los nuevos horarios
      await notificationService.scheduleLocalReminders(
        NOTIFICATION_SCHEDULES[notifLevel],
        quietStart,
        quietEnd,
      );

      setSuccess('Notificaciones actualizadas');
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
      setSuccess('Perfil actualizado');
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
      <h1 className="page-title animate-in">Configuración</h1>

      {success && (
        <div className="toast toast-success" style={{ position: 'relative', top: 0, marginBottom: 'var(--space-md)' }}>
          ✅ {success}
        </div>
      )}

      {/* Profile */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="section-header">
          <h2 className="section-title">Perfil</h2>
        </div>
        <div className="auth-form">
          <div className="input-group">
            <label>Nombre</label>
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
            Guardar perfil
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="section-header">
          <h2 className="section-title">Notificaciones</h2>
        </div>

        {/* Permission status */}
        {notifPermission !== 'granted' && (
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <button
              className="btn btn-primary btn-block"
              onClick={activateNotifications}
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              🔔 Activar notificaciones
            </button>
            {notifPermission === 'denied' && (
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--danger)', marginTop: 'var(--space-xs)', textAlign: 'center' }}>
                Notificaciones bloqueadas. Habilitá desde la configuración del navegador.
              </p>
            )}
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
          Guardar notificaciones
        </button>
      </div>

      {/* Logout */}
      <button className="btn btn-danger btn-block animate-in" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  );
}
