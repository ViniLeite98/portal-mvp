const CACHE_NAME = 'hara-spa-v1';

// arquivos para cache offline
const ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/equipe.html',
  '/atendimentos.html',
  '/solicitacoes.html',
  '/kanban.html',
  '/manifest.json',
  '/assets/sidebar/sidebar.css',
  '/assets/sidebar/sidebar.js',
  '/assets/js/supabase.js',
  '/assets/js/auth.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500;600&display=swap',
];

// instala e faz cache dos assets
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// limpa caches antigos
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// estratégia: network first, fallback para cache
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase.co')) return;
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, clone);
        });
        return response;
      })
      .catch(function() {
        return caches.match(e.request).then(function(cached) {
          return cached || caches.match('/login.html');
        });
      })
  );
});

// ── PUSH: recebe e exibe a notificação ───────────────────────────────────
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(err) {
    data = { title: 'Hara Spa', body: e.data ? e.data.text() : 'Nova notificação' };
  }
  e.waitUntil(
    self.registration.showNotification(data.title || 'Hara Spa', {
      body:    data.body  || '',
      icon:    '/assets/icon-192.png',
      badge:   '/assets/icon-192.png',
      tag:     data.tag   || 'hara-notif',
      data:    { url: data.url || '/atendimentos.html' },
      vibrate: [200, 100, 200],
      actions: [{ action: 'ver', title: 'Ver agendamento' }]
    })
  );
});

// ── CLICK: abre o app ao clicar na notificação ───────────────────────────
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/atendimentos.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.includes(url) && 'focus' in list[i]) {
          return list[i].focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
