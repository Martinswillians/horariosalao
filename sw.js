/* Service worker do Horário Salão: rede primeiro, com cópia offline das páginas e ícones do próprio site */
const V = 'hs-v2';
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(c => Promise.all(['./', 'cliente.html', 'profissional.html', 'empresa.html', 'app.css', 'app.js'].map(u => c.add(u).catch(() => {})))));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return; // Firebase e CDNs passam direto
  e.respondWith(
    fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)).catch(() => {}); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match('./')))
  );
});
