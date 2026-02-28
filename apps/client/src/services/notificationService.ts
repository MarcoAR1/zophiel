import { api } from './api';

// Check if we're in a Capacitor (native) context
const isCapacitor = () => typeof (window as any)?.Capacitor !== 'undefined';

/**
 * Notification Service — handles both:
 * 1. Local Notifications (Capacitor) for offline reminders
 * 2. Web Push (Service Worker) for server-sent alerts
 */
class NotificationService {
  private permissionGranted = false;
  private swRegistration: ServiceWorkerRegistration | null = null;

  /** Initialize: request permission + register push subscription */
  async init(userId?: string) {
    if (!('Notification' in window) && !isCapacitor()) {
      console.warn('[Notifications] Not supported');
      return;
    }

    // Request permission
    this.permissionGranted = await this.requestPermission();
    if (!this.permissionGranted) return;

    // Register service worker push if available
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.ready;
        await this.subscribeToPush();
      } catch (err) {
        console.warn('[Notifications] SW registration failed:', err);
      }
    }

    // Schedule local notifications if Capacitor is available
    if (isCapacitor()) {
      await this.scheduleLocalReminders();
    }
  }

  /** Request browser/app notification permission */
  async requestPermission(): Promise<boolean> {
    if (isCapacitor()) {
      try {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        const result = await LocalNotifications.requestPermissions();
        return result.display === 'granted';
      } catch {
        return false;
      }
    }

    // Web browser
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }

  /** Subscribe to Web Push and send subscription to server */
  async subscribeToPush() {
    if (!this.swRegistration) return;

    try {
      // Get VAPID public key from server
      const { publicKey } = await api.push.vapidKey();
      if (!publicKey) return;

      // Check existing subscription
      let subscription = await this.swRegistration.pushManager.getSubscription();

      if (!subscription) {
        // Create new subscription
        const applicationServerKey = this.urlBase64ToUint8Array(publicKey);
        subscription = await this.swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey as BufferSource,
        });
      }

      // Send to server
      const subJson = subscription.toJSON();
      await api.push.subscribe({
        endpoint: subJson.endpoint,
        keys: {
          p256dh: subJson.keys?.p256dh,
          auth: subJson.keys?.auth,
        },
      });
    } catch (err) {
      console.warn('[Push] Subscription failed:', err);
    }
  }

  /** Unsubscribe from push */
  async unsubscribeFromPush() {
    if (!this.swRegistration) return;

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        await api.push.unsubscribe({ endpoint: subscription.endpoint });
        await subscription.unsubscribe();
      }
    } catch (err) {
      console.warn('[Push] Unsubscribe failed:', err);
    }
  }

  /** Schedule local notifications (Capacitor) based on user settings */
  async scheduleLocalReminders(
    schedules: string[] = ['08:00', '12:00', '17:00', '21:00'],
    quietStart = '22:00',
    quietEnd = '08:00',
  ) {
    if (!isCapacitor()) return;

    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');

      // Cancel existing
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel(pending);
      }

      // Create schedule for each notification time
      const notifications = schedules
        .filter((time) => !this.isInQuietHours(time, quietStart, quietEnd))
        .map((time, index) => {
          const [hour, minute] = time.split(':').map(Number);
          return {
            id: index + 1,
            title: '🩺 Zophiel — Recordatorio',
            body: 'Es hora de registrar cómo te sentís',
            schedule: {
              on: { hour, minute },
              repeats: true,
              allowWhileIdle: true,
            },
            smallIcon: 'ic_notification',
            iconColor: '#6366f1',
          };
        });

      await LocalNotifications.schedule({ notifications: notifications as any });
    } catch (err) {
      console.warn('[LocalNotifications] Schedule failed:', err);
    }
  }

  /** Cancel all local notifications */
  async cancelAll() {
    if (!isCapacitor()) return;

    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel(pending);
      }
    } catch {
      // ignore
    }
  }

  /** Check if a time is in quiet hours */
  private isInQuietHours(time: string, start: string, end: string): boolean {
    const [th, tm] = time.split(':').map(Number);
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const t = th * 60 + tm;
    const s = sh * 60 + sm;
    const e = eh * 60 + em;

    if (s > e) {
      // Overnight: e.g., 22:00 - 08:00
      return t >= s || t < e;
    }
    return t >= s && t < e;
  }

  /** Convert VAPID key to Uint8Array */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  get isSupported(): boolean {
    return 'Notification' in window || isCapacitor();
  }

  get hasPermission(): boolean {
    return this.permissionGranted;
  }
}

export const notificationService = new NotificationService();
