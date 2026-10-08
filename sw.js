// ⚠️ Troque a versão (v2 → v3 → v4...) sempre que subir mudanças grandes.
//    Isso apaga o cache antigo de todo mundo na próxima abertura do app.
const CACHE_NAME = 'hara-spa-v6';

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
// (um por um: se algum falhar, os outros continuam — antes, uma falha travava a instalação inteira)
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.all(ASSETS.map(function(url) {
        return cache.add(new Request(url, { cache: 'reload' })).catch(function(err) {
          console.warn('SW: não cacheou', url, err);
        });
      }));
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
  var req = e.request;
  if (req.method !== 'GET') return;
  if (req.url.includes('supabase.co')) return;
  if (req.url.includes('api.iconify.design')) return;

  var mesmoSite = new URL(req.url).origin === self.location.origin;

  // Bibliotecas de fora (Supabase, ícones, fontes): usa a cópia guardada na hora
  // e atualiza por trás. Antes baixava tudo de novo a cada tela — era o que deixava lento no celular.
  if (!mesmoSite && /unpkg\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(req.url)) {
    e.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(req).then(function(guardado) {
          var rede = fetch(req).then(function(resp) {
            if (resp && (resp.ok || resp.type === 'opaque')) cache.put(req, resp.clone());
            return resp;
          }).catch(function() { return guardado || Response.error(); });
          return guardado || rede;
        });
      })
    );
    return;
  }

  // Arquivos do próprio site: pede ao servidor ignorando o cache do navegador.
  // Era isso que fazia a versão antiga continuar aparecendo depois do deploy.
  // Em páginas (navegação), redirecionamentos têm que voltar "crus" para o navegador seguir
  // (ex.: portal-mvp.vercel.app → sistemahara.com). Se o service worker seguir sozinho,
  // o Chrome recusa a resposta e a tela fica em branco.
  var buscar = mesmoSite
    ? fetch(req.url, {
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: req.mode === 'navigate' ? 'manual' : 'follow'
      })
    : fetch(req);

  e.respondWith(
    buscar
      .then(function(response) {
        // só guarda respostas boas (não salva página de erro no cache)
        if (response && (response.ok || response.type === 'opaque')) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(req, clone); });
        }
        return response;
      })
      .catch(function() {
        return caches.match(req).then(function(cached) {
          if (cached) return cached;
          // sem internet e sem cópia: só páginas voltam para o login
          if (req.mode === 'navigate') return caches.match('/login.html');
          return Response.error();
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

// ── CLICK: abre o app no lugar certo ao clicar na notificação ─────────────
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/atendimentos.html';
  var destino = new URL(url, self.location.origin).href;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      var aberto = list.find(function(c) { return new URL(c.url).origin === self.location.origin; });
      if (aberto) {
        // app já aberto: traz para frente e manda ir até o atendimento
        aberto.postMessage({ tipo: 'abrir-notificacao', url: destino });
        return aberto.focus();
      }
      if (clients.openWindow) return clients.openWindow(destino);
    })
  );
});
