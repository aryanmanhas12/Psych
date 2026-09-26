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
   again.

   v5: the opening was rebuilt and its caption lives in i18n.js, which is
   cache-first. Network-first HTML alone would have shipped a new
   index.html to an installed device while it kept reading the old
   i18n.js from cache — same URL, still valid, never re-fetched — and the
   caption would have come out blank in all six languages. The note above
   is right that a stale asset is never served to a page that did not
   change; it is the case where the page DID change that needs the name
   bumped, because that is what makes activate() evict and refetch.

   v6, and the reason the strategy below changed with it: five consecutive
   releases edited site.css, nav.js or prefs.js and none of them bumped
   this name. Cache-first means exactly what it says, so an installed
   device went on serving the stylesheet it first saw — for weeks. A
   navigation menu fix, a layout-shift fix, a contrast fix and two
   tap-target fixes were all pushed, all deployed, and none of them ever
   reached a phone that already had the site installed. The user reported
   the same broken menu after it had been fixed, which is the only way
   this class of bug ever surfaces.

   Bumping the name fixes today. It does not fix the next time, because it
   depends on remembering, and the note above proves that remembering is
   not reliable — it is the third instance of the same fault in this file.
   So assets are stale-while-revalidate now: the cached copy is served
   immediately, exactly as fast as before, and a fresh copy is fetched in
   the background and written over it. A stale asset can now be at most
   one page load behind instead of permanent, whether or not anyone
   remembers this constant. Offline is unaffected — the background fetch
   just fails and the cached copy stands.

   v7: the settings button — the control holding the language switch — was
   #EDEAE2 text on a #12161F nav in dark mode. 1.07:1, which is text the
   same colour as what is behind it, on the one control a reader who cannot
   read the page needs to find first. Fixed with an --on-marigold token, and
   the nav's own controls added to the contrast suite so the gap that hid it
   closes with it. site.css and index.html both changed.

   v9: i18n.js is gone, replaced by i18n.<lang>.js — all six are listed
   below, and all six must stay listed. The app fetches only the reader's
   own language on the critical path and the rest at idle, which is the
   whole saving; but an installed copy has to keep switching language with
   no network at all, and that only works if every one of them was
   precached here. Dropping five names from this array would look like a
   tidy-up and would silently break offline language switching for the
   people most likely to need it. There is a test that switches language
   with the network off, so it would not stay silent for long.

   v10: site.css and all six pages changed — the wordmark gained an inner
   span so it can ellipsise instead of being sliced.

   v11: index.html and both English and Hindi string files changed — the
   "what's behind this" section is translated now. */
/* v27: the redesign — night-to-dawn palette, the bloom-sun logo and icons,
   the check-in scenes, the rebuilt opening, and Baloo as the display face.
   site.css, nav.js, index.html, every page and all six string files
   changed. The Latin face is precached with the rest so the brand type
   survives going offline; the four Indic faces are cached the first time
   a reader in that script loads them, by the fetch handler below, rather
   than making every install download all five. anton.woff2 is gone. */
/* ── the release number, in one place ──
   The page's own CSS and JS moved out of index.html into app.css and
   app.js, and every page now asks for its shared files by versioned URL
   (site.css?v=28, nav.js?v=28, app.js?v=28). The version in the URL is
   what makes that safe: a page is fetched fresh, and if it asked for a
   plain "app.js" a returning phone could pair the new page with the old
   script still in this cache for one load. A new version is a new URL,
   which this cache has never seen, so it is always fetched. When a release
   changes any of those files: bump REL here AND the ?v= in every page. */
const REL = "28";
const CACHE = "ronak-v" + REL;
const ASSETS = [
  "./", "./index.html", "./helplines.js", "./nav.js?v=" + REL,
  "./app.js?v=" + REL, "./app.css?v=" + REL, "./site.css?v=" + REL,
  "./i18n.en.js?v=" + REL, "./i18n.hi.js?v=" + REL, "./i18n.mr.js?v=" + REL,
  "./i18n.bn.js?v=" + REL, "./i18n.ta.js?v=" + REL, "./i18n.te.js?v=" + REL,
  "./ethics.html", "./evidence.html", "./manifesto.html", "./404.html",
  "./global.html", "./poster.html", "./qr-site.svg",
  "./manifest.webmanifest",
  /* icon.svg is the favicon every page draws; the large PNGs are only ever
     asked for by the browser itself when someone installs the app, so they
     are not precached — that was ~110KB of a first visit on a data pack,
     spent on a picture most visitors never see */
  "./icon.svg", "./icon-192.png",
  "./fonts/baloo2-latin.woff2"
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

  /* A versioned file (?v=) never changes — a new release is a new URL —
     and neither does a font. So those are cache-first with no background
     refresh at all. The refresh below used to run for them too, on every
     visit: every script, stylesheet, font and all six language files
     re-downloaded behind the page each time it opened, ~200KB of somebody's
     prepaid data per visit to replace files with identical copies. */
  if(url.searchParams.has("v") || url.pathname.indexOf("/fonts/") !== -1){
    e.respondWith(
      caches.match(req).then(hit=> hit || fetch(req).then(res=>{
        if(res.ok){
          const copy = res.clone();
          caches.open(CACHE).then(c=> c.put(req, copy));
        }
        return res;
      }))
    );
    return;
  }

  /* stale-while-revalidate: answer from cache at once, and refresh the
     cache from the network in the background for next time. Same speed as
     cache-first on the hot path, but a shipped fix can no longer be
     invisible for ever just because the CACHE name above did not change. */
  e.respondWith(
    caches.match(req).then(hit=>{
      const fresh = fetch(req).then(res=>{
        if(res.ok){
          const copy = res.clone();
          caches.open(CACHE).then(c=> c.put(req, copy));
        }
        return res;
      }).catch(()=> hit || caches.match("./index.html"));
      return hit || fresh;
    })
  );
});
