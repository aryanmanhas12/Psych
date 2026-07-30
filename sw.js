/* Offline-first service worker.
   The whole point: someone on a patchy connection in a district town
   should still be able to screen themselves and read the helpline
   numbers. Everything here is static, so we can cache all of it. */
const CACHE = "psych-screener-v1";
const ASSETS = [
  "./", "./index.html", "./i18n.js", "./helplines.js",
  "./ethics.html", "./evidence.html", "./manifesto.html",
  "./poster.html", "./qr-site.svg",
  "./anton.woff2", "./site.css", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png", "./icon-maskable.png"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=> c.addAll(ASSETS)).then(()=> self.skipWaiting()));
});

self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys()
    .then(ks=> Promise.all(ks.filter(k=> k !== CACHE).map(k=> caches.delete(k))))
    .then(()=> self.clients.claim()));
});

/* Cache-first for our own assets — fast and works with no network.
   Never touch cross-origin requests: the helpline directories must
   always come from the live web so they are never served stale. */
self.addEventListener("fetch", e=>{
  const url = new URL(e.request.url);
  if(e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(hit=>
      hit || fetch(e.request).then(res=>{
        if(res.ok){
          const copy = res.clone();
          caches.open(CACHE).then(c=> c.put(e.request, copy));
        }
        return res;
      }).catch(()=> caches.match("./index.html"))
    )
  );
});
