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
  // ignora requisições não-GET e do Supabase (sempre online)
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase.co')) return;

  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        // atualiza cache com resposta nova
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, clone);
        });
        return response;
      })
      .catch(function() {
        // offline: serve do cache
        return caches.match(e.request).then(function(cached) {
          return cached || caches.match('/login.html');
        });
      })
  );
});
