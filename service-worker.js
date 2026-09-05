// service-worker.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// ─── Firebase init ───────────────────────────────────────────────────────────
firebase.initializeApp({
  apiKey: "AIzaSyD-dmeP5P9vXDE3ulNVBFZa65twbN-qWtM",
  authDomain: "hara-spa.firebaseapp.com",
  projectId: "hara-spa",
  storageBucket: "hara-spa.firebasestorage.app",
  messagingSenderId: "414347326484",
  appId: "1:414347326484:web:b7d1c3245ba7b6053aa301"
});

const messaging = firebase.messaging();

// ─── Cache (PWA offline) ─────────────────────────────────────────────────────
const CACHE_NAME = 'hara-pwa-v2';
const STATIC_ASSETS = [
  '/mobile/',
  '/mobile/index.html',
  '/mobile/agenda.html',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

// ─── Push: mensagens em background (app fechado/minimizado) ─────────────────
messaging.onBackgroundMessage(payload => {
  const { title, body, icon, data } = payload.notification || {};

  const notificationTitle = title || 'Hara Spa';
  const notificationOptions = {
    body: body || '',
    icon: icon || '/assets/icons/icon-192.png',
    badge: '/assets/icons/icon-72.png',
    data: data || {},
    vibrate: [200, 100, 200],
    actions: data?.url ? [{ action: 'open', title: 'Abrir' }] : []
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// ─── Clique na notificação ───────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const url = event.notification.data?.url || '/mobile/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Se já tem uma janela aberta, foca nela
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Senão abre nova aba
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
