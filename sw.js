// Keeps the app (and its fonts once seen) on the device so it opens with no signal.
const CACHE = "accent-kit-v1";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET") return;
  const font = u.host === "fonts.googleapis.com" || u.host === "fonts.gstatic.com";
  if (u.origin !== location.origin && !font) return;
  // App files: network first so updates arrive, cache when offline. Fonts: cache first.
  e.respondWith(font
    ? caches.match(r).then(hit => hit || fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; }))
    : fetch(r).then(res => { if (res.ok){ const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })
             .catch(() => caches.match(r, { ignoreSearch: true }).then(hit => hit || caches.match("index.html"))));
});
