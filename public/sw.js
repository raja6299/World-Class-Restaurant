const CACHE_NAME = 'aurum-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/menu',
  '/manifest.json',
  '/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Stale-while-revalidate strategy for GET requests
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        }).catch(() => {
          // Offline fallback
          return cachedResponse;
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncBackgroundOrders());
  }
});

async function syncBackgroundOrders() {
  console.log('[SW] Syncing background orders...');
  // Read from IndexedDB and push to API
}
