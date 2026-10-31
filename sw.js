/* Cache do app para abrir offline. Troque a versão ao publicar mudanças grandes. */
const V = 'expense-v3';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  /* Google (login e Drive) nunca passa pelo cache: o backup precisa ser sempre o mais novo */
  if (!same && !FONT_HOSTS.includes(url.hostname)) return;
  /* a página abre sempre na versão mais nova quando há internet */
  if (req.mode === 'navigate' || (same && /(^|\/)(index\.html)?$/.test(url.pathname))) {
    e.respondWith(fetch(req).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(hit => hit || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(V).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit || caches.match('index.html'));
    return hit || net;
  }));
});
