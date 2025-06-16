const CACHE_NAME = 'offline-v4';
const OFFLINE_URL = '/offline/';

self.addEventListener('install', (event) => {
  console.log('[SW] 安装中...');
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        OFFLINE_URL,
        '/static/img/maintenance.png'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] 激活');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
                 .map(name => caches.delete(name))
      );
    })
  );
  
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // 处理离线页面请求
  if (event.request.url.includes(OFFLINE_URL)) {
    event.respondWith(caches.match(OFFLINE_URL));
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(async () => {
      console.log('[SW] 网络请求失败，返回离线页面');
      return caches.match(OFFLINE_URL);
    })
  );
});