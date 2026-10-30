/* ══════════════════════════════════════════════════════════════
   Ronak — the motion layer
   ──────────────────────────────────────────────────────────────
   Loaded deferred on every page, after vendor/gsap.min.js and its two
   small plugins (CustomEase, SplitText). Everything heavier (Lenis,
   ScrollTrigger, Flip, DrawSVG, three.js, Vanta) is fetched only by the
   page and the device that needs it, through Motion.load().

   The rules this file keeps, because Ronak is for people who may be
   struggling, on phones that may be cheap:
   - Cinematic outside, calm inside. Headlines rise line by line and the
     page glides under a laptop's wheel on the home screen and the reading
     pages. Inside a check-in, a result, Get Help or the crisis step,
     nothing here moves anything.
   - Still means still. Reduced motion, "Less motion" (html.still) and
     lite phones (html.lite: 2 GB or Data Saver) get the static page:
     Motion.still() is checked before every effect.
   - Words split by line or word, never by letter: a letter split breaks
     the conjuncts of Devanagari, Bengali, Tamil and Telugu.
   - Only transform and opacity move; every split is reverted the moment
     its animation ends, so the DOM a screen reader or a translation pass
     sees is the one the page shipped.
   ══════════════════════════════════════════════════════════════ */
(function(){
"use strict";
var root = document.documentElement;
var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
var fineMQ = window.matchMedia("(hover: hover) and (pointer: fine)");
var me = document.currentScript;
var V = (me && /[?&]v=([\w.]+)/.exec(me.src) || [])[1] || "0";
var BASE = me ? me.src.replace(/motion\.js.*$/, "") : "";
var G = window.gsap;

function still(){ return reduceMQ.matches || root.classList.contains("lite"); }

/* one fetch per file, in order of asking; a failed fetch can be retried */
var loads = {};
function load(file){
  if(!loads[file]) loads[file] = new Promise(function(ok, no){
    var s = document.createElement("script");
    s.src = BASE + "vendor/" + file + "?v=" + V;
    s.async = false;
    s.onload = ok;
    s.onerror = function(){ delete loads[file]; no(new Error("could not load " + file)); };
    document.head.appendChild(s);
  });
  return loads[file];
}

/* ── the house eases: the same curves the CSS uses, by name ── */
if(G){
  try{ G.registerPlugin(window.CustomEase, window.SplitText); }catch(e){}
  if(window.CustomEase){
    CustomEase.create("rk-dawn", "0.16,1,0.3,1");      /* --e-spring: arrives, then settles */
    CustomEase.create("rk-out", "0.215,0.61,0.355,1"); /* --e-out */
    CustomEase.create("rk-breath", "0.45,0,0.55,1");   /* in and out, like a breath */
  }
}

/* ── a headline rises out of its own lines ──
   Line-masked: each line slides up from behind its own edge, so the
   words never overlap the text above them. Reverted on completion. */
function revealLines(el, opts){
  opts = opts || {};
  if(!el || still() || !G || !window.SplitText || el.__rkSplit) return null;
  var text = (el.textContent || "").trim();
  if(!text || text.length > 180) return null;
  el.__rkSplit = true;
  var split;
  try{ split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "rk-line", aria: "auto" }); }
  catch(e){ el.__rkSplit = false; return null; }
  return G.from(split.lines, {
    yPercent: 108, duration: opts.duration || 0.95, ease: "rk-dawn",
    stagger: 0.09, delay: opts.delay || 0,
    onComplete: function(){ split.revert(); el.__rkSplit = false; },
    onInterrupt: function(){ split.revert(); el.__rkSplit = false; }
  });
}

/* reveal each marked heading once, as it comes into view */
function watchHeadings(sel){
  if(still() || !G || !("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      io.unobserve(e.target);
      revealLines(e.target);
    });
  }, { rootMargin: "0px 0px -12% 0px" });
  document.querySelectorAll(sel).forEach(function(h){
    /* calm inside: no heading in a check-in, a result, Get Help, the
       guide or History ever rises; only the home screen's do */
    if(h.closest(".view:not(#view-home),#safeNow,.safety")) return;
    /* already on screen at load: leave it as painted (no flash of hiding) */
    var r = h.getBoundingClientRect();
    if(r.top < window.innerHeight && r.bottom > 0) return;
    io.observe(h);
  });
}

/* ── Lenis: a laptop's wheel glides, outside the check-ins ──
   Phones keep native touch scrolling (Lenis leaves touch alone by
   default, and that is how it stays). On index.html it is active only on
   the home screen with no dialog open; everywhere inside the app the
   wheel scrolls natively. virtualScroll returning false hands the event
   back to the browser untouched, so nothing is ever blocked. */
var lenis = null;
function lenisWanted(){
  if(still()) return false;
  var home = document.getElementById("view-home");
  if(home && !home.classList.contains("active")) return false;
  if(document.querySelector("#overture:not([hidden]),#tour:not([hidden]),#intro:not([hidden])")) return false;
  if(document.querySelector(".setpanel.open")) return false;
  return true;
}
function startLenis(){
  if(lenis || still() || !fineMQ.matches || !G) return;
  load("lenis.min.js").then(function(){
    if(lenis || still() || !window.Lenis) return;
    lenis = new window.Lenis({
      autoRaf: false, anchors: false, smoothWheel: true,
      lerp: 0.09, wheelMultiplier: 0.95,
      virtualScroll: function(){ return lenisWanted(); }
    });
    G.ticker.add(function(t){ if(lenis) lenis.raf(t * 1000); });
    if(window.ScrollTrigger) lenis.on("scroll", window.ScrollTrigger.update);
  }).catch(function(){});
}
function stopLenis(){ if(lenis){ lenis.destroy(); lenis = null; } }
/* a screen change jumps to the top of the new screen: the glide must not
   carry on toward where the old one was heading */
document.addEventListener("rk:view", function(){
  if(lenis) lenis.scrollTo(window.scrollY, { immediate: true, force: true });
});
reduceMQ.addEventListener && reduceMQ.addEventListener("change", function(){ if(still()) stopLenis(); else startLenis(); });

window.Motion = {
  still: still,
  load: load,
  revealLines: revealLines,
  watchHeadings: watchHeadings,
  lenis: function(){ return lenis; },
  fine: function(){ return fineMQ.matches; }
};

/* every page: section headings rise into view; laptops glide */
watchHeadings("main h2.display, .homesec > h2, section > .wrap > h2");
startLenis();
})();
