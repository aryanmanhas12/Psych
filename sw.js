/* Offline-first service worker.
   The whole point: someone on a patchy connection in a district town
   should still be able to screen themselves and read the helpline
   numbers. Everything here is static, so we can cache all of it. */
/* Bump this on every release that changes a cached file. Pages (HTML) are
   fetched network-first below, so a stale CACHE name no longer hides a
   shipped edit from anyone with a signal — but it still controls how much
   gets re-downloaded on the first visit after a release, and it's what
   activate() uses to evict old caches. v3 shipped a fixed statistic that
   no returning visitor could see, because HTML was cache-first with no
   name bump: an installed copy kept serving the version it first saw,
   indefinitely. v4 fixes both the name and the strategy that let it happen
   again. */
const CACHE = "psych-screener-v4";
const ASSETS = [
  "./", "./index.html", "./i18n.js", "./helplines.js", "./nav.js",
  "./ethics.html", "./evidence.html", "./manifesto.html",
  "./global.html", "./poster.html", "./qr-site.svg",
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

/* Two strategies, split by what correctness requires.

   Pages (navigations, plus the .html files this site links between) go
   network-first: the whole point of a fast follow-up fix is that people
   see it, and cache-first on HTML is exactly the bug that shipped the
   3%/23% fix to nobody. Offline still works — the catch falls back to
   whatever was last cached, or index.html as a last resort.

   Everything else (css/js/fonts/images) stays cache-first: those are
   fetched by a versioned page that already changed, so a stale copy is
   never served silently, and cache-first keeps the app fast and usable
   with no network at all.

   Cross-origin requests are never touched: the helpline directories must
   always come from the live web so they are never served stale. */
self.addEventListener("fetch", e=>{
  const req = e.request;
  const url = new URL(req.url);
  if(req.method !== "GET" || url.origin !== location.origin) return;

  const isPage = req.mode === "navigate" || /\.html$/.test(url.pathname);

  if(isPage){
    e.respondWith(
      fetch(req).then(res=>{
        if(res.ok){
          const copy = res.clone();
          caches.open(CACHE).then(c=> c.put(req, copy));
        }
        return res;
      }).catch(()=> caches.match(req).then(hit=> hit || caches.match("./index.html")))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit=>
      hit || fetch(req).then(res=>{
        if(res.ok){
          const copy = res.clone();
          caches.open(CACHE).then(c=> c.put(req, copy));
        }
        return res;
      }).catch(()=> caches.match("./index.html"))
    )
  );
});
