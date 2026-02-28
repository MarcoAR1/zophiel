import cron from 'node-cron';
import webpush from 'web-push';
import { prisma } from '../index.js';
import { NOTIFICATION_SCHEDULES, type NotificationLevel } from '@zophiel/shared';

// Tips personalizados según diagnóstico
const DIAGNOSIS_TIPS: Record<string, string[]> = {
  Fibromialgia: [
    '💆 Estiramientos suaves pueden ayudar a reducir la rigidez',
    '🧘 Técnicas de respiración profunda ayudan con el dolor',
    '🛁 Un baño caliente puede aliviar los puntos sensibles',
  ],
  Artritis: [
    '🏊 El ejercicio acuático reduce la presión articular',
    '🧊 Alterná calor y frío en las articulaciones',
    '✋ Mové las articulaciones con suavidad para mantener movilidad',
  ],
  default: [
    '🩺 Registrar tu dolor ayuda a tu médico a entenderte mejor',
    '📊 Tus datos muestran patrones que pueden mejorar tu tratamiento',
    '💪 Cada registro es un paso hacia sentirte mejor',
  ],
};

function getTip(diagnosis: string | null): string {
  const tips = diagnosis && DIAGNOSIS_TIPS[diagnosis]
    ? DIAGNOSIS_TIPS[diagnosis]
    : DIAGNOSIS_TIPS.default;
  return tips[Math.floor(Math.random() * tips.length)];
}

function isInQuietHours(now: Date, start: string | null, end: string | null): boolean {
  if (!start || !end) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;

  // Handle overnight quiet hours (e.g., 22:00 - 08:00)
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

function isScheduledTime(now: Date, level: NotificationLevel): boolean {
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return NOTIFICATION_SCHEDULES[level].includes(currentTime);
}

async function sendNotifications() {
  try {
    const now = new Date();

    // Get all users with push subscriptions
    const users = await prisma.user.findMany({
      where: {
        pushSubscriptions: { some: {} },
      },
      include: {
        pushSubscriptions: true,
      },
    });

    for (const user of users) {
      const level = (user.notificationLevel || 'medium') as NotificationLevel;

      // Check if it's a scheduled time for this user's level
      if (!isScheduledTime(now, level)) continue;

      // Check quiet hours
      if (isInQuietHours(now, user.quietHoursStart, user.quietHoursEnd)) continue;

      // Build notification payload
      const tip = getTip(user.diagnosis);
      const payload = JSON.stringify({
        title: '🩺 Zophiel — Recordatorio',
        body: `${user.name}, es hora de registrar cómo te sentís. ${tip}`,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        data: { url: '/pain/new' },
      });

      // Send to all user's subscriptions
      for (const sub of user.pushSubscriptions) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            payload,
          );
        } catch (err: any) {
          // If subscription is expired/invalid, remove it
          if (err.statusCode === 410 || err.statusCode === 404) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          }
        }
      }
    }
  } catch (err) {
    console.error('[NotificationCron] Error:', err);
  }
}

export function startNotificationCron() {
  // Configure web-push with VAPID keys
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    console.warn('[NotificationCron] ⚠️ VAPID keys not set — push notifications disabled');
    console.warn('[NotificationCron] Run: npx web-push generate-vapid-keys');
    return;
  }

  webpush.setVapidDetails(
    'mailto:zophiel@example.com',
    publicKey,
    privateKey,
  );

  // Run every minute at :00 seconds
  cron.schedule('* * * * *', () => {
    sendNotifications();
  });

  console.log('🔔 Notification cron started');
}
