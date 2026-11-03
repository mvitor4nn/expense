/* Cache do app para abrir offline. Troque a versão ao publicar mudanças grandes. */
const V = 'expense-v5';
const SHARED = 'shared-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== SHARED).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  /* "Compartilhar" do Android (imagem ou texto): guarda a imagem e abre o app limpo */
  if (req.method === 'POST' && same && /(^|\/)(index\.html)?$/.test(url.pathname)) {
    e.respondWith((async () => {
      const home = new URL('./index.html', self.registration.scope).href;
      try {
        const fd = await req.formData();
        const file = fd.get('media');
        const text = ['title', 'text', 'url'].map(k => fd.get(k)).filter(x => typeof x === 'string' && x).join(' ');
        const extra = text ? '&text=' + encodeURIComponent(text) : '';
        if (file && file.size) {
          const c = await caches.open(SHARED);
          await c.put('shared-image', new Response(file, { headers: { 'Content-Type': file.type || 'image/jpeg' } }));
          return Response.redirect(home + '?img=1' + extra, 303);
        }
        return Response.redirect(home + (text ? '?text=' + encodeURIComponent(text) : ''), 303);
      } catch (err) { return Response.redirect(home, 303); }
    })());
    return;
  }
  if (req.method !== 'GET') return;
  /* Google (login e Drive) nunca passa pelo cache: o backup precisa ser sempre o mais novo */
  if (!same && !FONT_HOSTS.includes(url.hostname)) return;
  /* a página abre sempre na versão mais nova quando há internet */
  if (req.mode === 'navigate' || (same && /(^|\/)(index\.html)?$/.test(url.pathname))) {
    /* endereços com ?n= ou ?text= (captura de gastos) não vão para o cache: só a página limpa */
    const clean = !url.search;
    e.respondWith(fetch(req).then(res => {
      if (clean && res && res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html'))));
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
