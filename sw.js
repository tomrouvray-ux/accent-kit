// Keeps the app (and its fonts once seen) on the device so it opens with no signal.
// Bump CACHE when a change must clear what devices already hold; normal updates arrive without it.
const CACHE = "accent-kit-v2";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
const fromCache = r => caches.match(r, { ignoreSearch: true }).then(hit => hit || caches.match("index.html")).then(hit => hit || Response.error());
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET") return;
  const font = u.host === "fonts.googleapis.com" || u.host === "fonts.gstatic.com";
  if (u.origin !== location.origin && !font) return;
  if (font){
    e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; })));
    return;
  }
  // App files: network first, skipping the browser's own cache so a pushed update shows on the next open.
  // On a weak signal, give up after 4 seconds and open the saved copy.
  e.respondWith(new Promise(done => {
    let settled = false;
    const finish = p => { if (!settled){ settled = true; done(p); } };
    const t = setTimeout(() => finish(fromCache(r)), 4000);
    fetch(r, { cache: "no-cache" }).then(res => {
      clearTimeout(t);
      if (res.ok){ const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); }
      finish(res);
    }).catch(() => { clearTimeout(t); finish(fromCache(r)); });
  }));
});
