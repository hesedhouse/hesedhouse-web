/* 골프 내기 계산기 — 오프라인 캐시 (네트워크 우선, 실패 시 캐시) */
const CACHE = 'golfbet-v2';
const CORE = ['/golf/', '/golf/index.html', '/golf/manifest.webmanifest', '/golf/icon-192.png', '/golf/icon-512.png', '/golf/icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const inScope = url.origin === location.origin && url.pathname.startsWith('/golf/');
  const isCdn = url.hostname === 'cdnjs.cloudflare.com';
  if(e.request.method !== 'GET' || !(inScope || isCdn)) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if(res && res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || (inScope ? caches.match('/golf/index.html') : undefined)))
  );
});
