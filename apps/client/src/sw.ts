/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

// ── Workbox precaching ──
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// ── Push Notifications ──
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Recordá registrar cómo te sentís',
      icon: data.icon || '/icon-192.png',
      badge: data.badge || '/icon-72.png',
      tag: 'zophiel-reminder',
      renotify: true,
      data: data.data || { url: '/pain/new' },
    };

    event.waitUntil(
      self.registration.showNotification(data.title || '🩺 Zophiel', options),
    );
  } catch {
    // Fallback for non-JSON push
    event.waitUntil(
      self.registration.showNotification('🩺 Zophiel', {
        body: event.data.text(),
        icon: '/icon-192.png',
      }),
    );
  }
});

// ── Notification Click ──
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/pain/new';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus existing window if open
      for (const client of clients) {
        if (client.url.includes(self.location.origin)) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Open new window
      return self.clients.openWindow(targetUrl);
    }),
  );
});
