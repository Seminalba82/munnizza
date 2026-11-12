// Service worker di Munnizza: permette l'installazione come app.
// La pagina si prende sempre da internet (così gli aggiornamenti arrivano subito); se manca la rete usa la copia salvata.
const VERSION = "v1.3";
const CACHE = "munnizza-" + VERSION;
const PRECACHE = ["/", "/icons/icon-192.png", "/icons/icon-512.png", "/audio/immondizia.mp3", "/audio/errore1.mp3", "/audio/errore2.mp3", "/audio/errore3.mp3", "/audio/livello-alluminio.mp3", "/audio/livello-secco.mp3", "/audio/commento1.mp3", "/audio/commento2.mp3", "/audio/commento3.mp3", "/audio/commento4.mp3", "/audio/commento5.mp3", "/audio/commento6.mp3", "/audio/commento7.mp3"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("munnizza-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request; const u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return; // Firebase e altri servizi esterni: mai in cache
  e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)).catch(() => {}); return res; }).catch(() => caches.match(r).then((m) => m || caches.match("/"))));
});
