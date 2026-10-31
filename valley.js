/* ══════════════════════════════════════════════════════════════
   Ronak — the valley (index.html's home sky)
   ──────────────────────────────────────────────────────────────
   The painted Kashmir valley in index.html is complete without this file:
   with no script, or under reduced motion and "Less motion", it is a still
   picture whose dawn is played by the scroll (CSS). This file only adds:

   1. Depth: the layers lean with the cursor on a laptop and with the
      phone's tilt on a strong Android phone, a few pixels each, the far
      peaks least and the chinar most. Transforms on HTML boxes only.
   2. Surprises, for whoever taps the picture rather than the words:
      the lake ripples, the chinar lets go of a few leaves, the shikara's
      lantern flares, a peak catches the sun, a star falls across the sky.
   3. The flock (Vanta birds, three.js), on laptops and strong phones
      only, fetched after the page is usable, and only ever running while
      the sky is on screen, the tab is visible and someone is there: it
      settles 15 seconds after the last cursor move, touch or scroll.
   4. Your stars: one for every check-in and every day's mood, from this
      device's own history; nothing is read from anywhere else and
      nothing leaves the phone.

   All of it is decoration: aria-hidden, never focusable, never in the way
   of the words, the buttons or the helpline strip above.
   ══════════════════════════════════════════════════════════════ */
(function(){
"use strict";
var sky = document.getElementById("heroSky"), kv = document.getElementById("kv");
if(!sky || !kv) return;
var root = document.documentElement;
var M = window.Motion, G = window.gsap;
var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
var fineMQ = window.matchMedia("(hover: hover) and (pointer: fine)");
function still(){ return reduceMQ.matches || root.classList.contains("lite"); }
function homeUp(){ var h = document.getElementById("view-home"); return !h || h.classList.contains("active"); }

var onScreen = true;
if("IntersectionObserver" in window){
  new IntersectionObserver(function(es){
    es.forEach(function(e){ onScreen = e.isIntersecting; flock(onScreen && !document.hidden); });
  }).observe(sky);
}
document.addEventListener("visibilitychange", function(){ flock(onScreen && !document.hidden); });
/* "Less motion" switched on mid-visit (html.lite + html.still): the flock
   stops where it is and fades out; switched off, it flies again */
if(window.MutationObserver){
  var wasStill = still();
  new MutationObserver(function(){
    var now = still();
    if(now === wasStill) return;
    wasStill = now;
    flock(!now && onScreen && !document.hidden);
  }).observe(root, { attributes: true, attributeFilter: ["class"] });
}

function sfx(n, rate){ try{ if(window.Ooh && Ooh.sound) Ooh.sound(n, rate); }catch(e){} }
function tick(){ try{ if(window.Ooh && Ooh.buzz) Ooh.buzz("soft"); }catch(e){} }

/* ════════ 1. depth ════════ */
var LAYERS = [[".kv-far > .kv-p", .22], [".kv-mist > .kv-p", .38], [".kv-mid > .kv-p", .6],
              [".kv-lake > .kv-p", .82], [".kv-chinar-art", 1.35]];
var movers = [];
function setupDepth(){
  if(!G || still()) return;
  movers = LAYERS.map(function(l){
    var el = kv.querySelector(l[0]);
    return el ? { x: G.quickTo(el, "x", { duration: 1.4, ease: "rk-out" }),
                  y: G.quickTo(el, "y", { duration: 1.4, ease: "rk-out" }), d: l[1] } : null;
  }).filter(Boolean);
}
function lean(nx, ny){
  if(!movers.length || still()) return;
  for(var i=0;i<movers.length;i++){ movers[i].x(-nx * 30 * movers[i].d); movers[i].y(-ny * 10 * movers[i].d); }
}
var leanQueued = false, lnx = 0, lny = 0;
function queueLean(nx, ny){
  lnx = nx; lny = ny;
  if(leanQueued) return; leanQueued = true;
  requestAnimationFrame(function(){ leanQueued = false; if(onScreen && homeUp()) lean(lnx, lny); });
}
if(fineMQ.matches){
  window.addEventListener("pointermove", function(e){
    if(!onScreen) return;
    queueLean(e.clientX / window.innerWidth - .5, e.clientY / window.innerHeight - .5);
  }, { passive: true });
}
/* A strong phone has no cursor: its tilt leans the layers instead. Android
   gives the angles freely; iOS asks permission first, and a picture is not
   worth a permission prompt, so an iPhone keeps the scroll's depth only.
   The neutral angle follows the hand slowly, so however the phone is held
   the valley settles back to centre; a hand's tremor (under half a degree)
   moves nothing. */
function startTilt(){
  if(fineMQ.matches || !movers.length || !window.DeviceOrientationEvent) return;
  if(typeof DeviceOrientationEvent.requestPermission === "function") return;
  var b0 = null, g0 = 0, lb = 0, lg = 0;
  window.addEventListener("deviceorientation", function(e){
    if(!onScreen || e.beta == null || still()) return;
    var b = e.beta, g = e.gamma || 0;
    if(b0 === null){ b0 = b; g0 = g; }
    b0 += (b - b0) * .02; g0 += (g - g0) * .02;
    if(Math.abs(b - lb) < .5 && Math.abs(g - lg) < .5) return;
    lb = b; lg = g;
    queueLean(Math.max(-1, Math.min(1, (g - g0) / 18)) * .5, Math.max(-1, Math.min(1, (b - b0) / 18)) * .5);
  }, { passive: true });
}

/* ════════ 2. surprises ════════ */
var ripples = document.getElementById("kvRipples"), leaves = document.getElementById("kvLeaves");
function at(host, x, y){
  var r = host.getBoundingClientRect();
  return { x: x - r.left, y: y - r.top, w: r.width, h: r.height };
}
function ripple(x, y){
  var p = at(ripples, x, y);
  for(var i=0;i<3;i++){
    var o = document.createElement("i");
    o.className = "kv-ripple";
    o.style.left = p.x + "px"; o.style.top = p.y + "px";
    ripples.appendChild(o);
    G.fromTo(o, { scale: .08, opacity: .85 }, {
      scale: 1 + i * .32, opacity: 0, duration: 2.2 + i * .35, delay: i * .24, ease: "rk-out",
      onComplete: (function(n){ return function(){ n.remove(); }; })(o) });
  }
  sfx("wake", .72); tick();
}
var LEAF_FILL = ["#C2364F", "#E9A23B", "#B4532A", "#D9573A", "#8E2440"];
var leafCount = 0, leafTpl = null;
function dropLeaf(x, y, far){
  if(leafCount > 22) return;
  leafCount++;
  var p = at(leaves, x, y);
  /* one leaf built once and cloned after: no markup parsed per leaf */
  if(!leafTpl){
    leafTpl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    leafTpl.setAttribute("viewBox", "-20 -20 40 40"); leafTpl.setAttribute("class", "kv-leaf");
    leafTpl.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "use")).setAttribute("href", "#kvLeaf");
  }
  var s = leafTpl.cloneNode(true);
  s.firstChild.setAttribute("fill", LEAF_FILL[(Math.random()*LEAF_FILL.length)|0]);
  s.style.left = p.x + "px"; s.style.top = p.y + "px";
  leaves.appendChild(s);
  /* The fall runs on the compositor (Web Animations, transform and
     opacity): a leaf lets go on its own every few seconds while the valley
     is on screen, and a script-driven fall kept a frame loop running the
     whole way down. The drop gathers speed, the drift sways, the leaf
     turns over and flips edge-on as it goes. */
  var fall = Math.max(60, p.h - p.y - 8) * (far ? .9 : 1);
  var dx = (Math.random() - .5) * 120, dur = 3400 + Math.random() * 2400;
  var rot = (Math.random() < .5 ? -1 : 1) * (240 + Math.random() * 300);
  var kf = function(f, sway, sx, o){
    return { transform: "translate(" + (dx * sway).toFixed(1) + "px," + (fall * f).toFixed(1) + "px) rotate("
      + (rot * f).toFixed(1) + "deg) scaleX(" + sx + ")", opacity: o };
  };
  var done = function(){ s.remove(); leafCount--; };
  if(!s.animate){ done(); return; }
  var a = s.animate([kf(0, 0, 1, 1), kf(.06, .45, .25, 1), kf(.22, .95, 1, 1), kf(.45, .6, .3, 1), kf(.72, .85, 1, .9), kf(1, 1, .6, 0)],
                    { duration: dur, easing: "linear" });
  a.onfinish = done; a.oncancel = done;
}
function shakeChinar(x, y){
  var r = document.getElementById("kvChinar").getBoundingClientRect();
  var n = 5 + (Math.random() * 4 | 0);
  for(var i=0;i<n;i++){
    (function(i){
      setTimeout(function(){
        dropLeaf(r.left + r.width * (.2 + Math.random() * .62), r.top + r.height * (.18 + Math.random() * .3));
      }, i * 110);
    })(i);
  }
  sfx("expand", .8); tick();
}
function lantern(){
  var b = document.getElementById("kvShikara");
  b.classList.remove("flare"); void b.offsetWidth; b.classList.add("flare");
  sfx("toggle-on", .85); tick();
}
function sunlight(x, y){
  var p = at(kv, x, y);
  var o = document.createElement("i");
  o.className = "kv-flash";
  o.style.left = p.x + "px"; o.style.top = p.y + "px";
  kv.querySelector(".kv-far").appendChild(o);
  G.fromTo(o, { scale: .2, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: "rk-out" });
  G.to(o, { opacity: 0, scale: 1.25, duration: 1.6, delay: .45, ease: "rk-breath", onComplete: function(){ o.remove(); } });
  sfx("check", .9); tick();
}
function fallingStar(x, y){
  var p = at(sky, x, y);
  var o = document.createElement("i");
  o.className = "kv-fall";
  o.style.left = p.x + "px"; o.style.top = p.y + "px";
  sky.appendChild(o);
  var dx = (p.x > p.w / 2 ? -1 : 1) * (180 + Math.random() * 160);
  G.fromTo(o, { x: 0, y: 0, opacity: 0, rotation: Math.atan2(70, dx) * 180 / Math.PI },
    { x: dx, y: 70 + Math.random() * 60, opacity: 1, duration: .9, ease: "power2.in",
      onComplete: function(){ G.to(o, { opacity: 0, duration: .25, onComplete: function(){ o.remove(); } }); } });
  sfx("select", 1.25);
}
function inBox(el, x, y, padX, padY){
  var r = el.getBoundingClientRect();
  return x >= r.left - (padX || 0) && x <= r.right + (padX || 0) && y >= r.top - (padY || 0) && y <= r.bottom + (padY || 0);
}
sky.addEventListener("click", function(e){
  if(!G || still()) return;
  /* the words, the buttons and Ooh keep their own taps */
  if(e.target.closest && e.target.closest("a,button,input,label,.ooh-strip,.ooh-bubble,.hs-cue,.panel")) return;
  var x = e.clientX, y = e.clientY;
  var chinar = document.getElementById("kvChinar"), boat = document.getElementById("kvShikara");
  var cr = chinar.getBoundingClientRect();
  if(inBox(boat, x, y, 18, 14)) return lantern();
  if(x >= cr.left + cr.width * .05 && x <= cr.right - cr.width * .05 && y >= cr.top + cr.height * .05 && y <= cr.top + cr.height * .62) return shakeChinar(x, y);
  var k = kv.getBoundingClientRect();
  var lakeTop = k.top + k.height * (508 / 640);
  if(y >= lakeTop && y <= k.bottom) return ripple(x, y);
  if(y >= k.top + k.height * .18 && y < lakeTop) return sunlight(x, y);
  if(y < k.top + k.height * .18) return fallingStar(x, y);
});

/* now and then a single leaf lets go on its own, only while the sky is
   in view and the page is not asked to be still */
function idleLeaf(){
  setTimeout(idleLeaf, 14000 + Math.random() * 12000);
  if(!G || still() || !onScreen || document.hidden || !homeUp()) return;
  var r = document.getElementById("kvChinar").getBoundingClientRect();
  if(r.bottom < 0 || r.top > window.innerHeight) return;
  dropLeaf(r.left + r.width * (.25 + Math.random() * .55), r.top + r.height * (.2 + Math.random() * .25));
}

/* ════════ 3. the flock ════════ */
var fx = null, running = false, flockWanted = false;
function strong(){
  if(still()) return false;
  var nv = navigator, cn = nv.connection || {};
  if(cn.saveData) return false;
  if(cn.effectiveType && cn.effectiveType !== "4g") return false;
  var cores = nv.hardwareConcurrency || 0, mem = nv.deviceMemory;
  if(fineMQ.matches && window.innerWidth >= 900) return cores === 0 || cores >= 4;
  if(cores < 4) return false;
  if(mem !== undefined) return mem >= 4;
  /* no memory figure (Safari, Firefox): iPhones and iPads are strong;
     anything else needs 8 cores to be trusted */
  return /iPhone|iPad|Macintosh/.test(nv.userAgent) || cores >= 8;
}
function webgl(){
  try{ var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); }
  catch(e){ return false; }
}
function flock(on){
  if(still()) on = false;
  flockWanted = on;
  if(!fx) return;
  if(resting) on = false;
  if(on && !running){ running = true; fx.prevNow = 0; fx.animationLoop(); }
  else if(!on && running){ running = false; window.cancelAnimationFrame(fx.req); }
}
/* A flock passes over; it does not circle for ever. It flies while someone
   is here (a cursor, a touch, a scroll or a tilt in the last 15 seconds),
   then fades out and its loop stops, so a page left open on a laptop or a
   phone costs nothing. The next sign of someone brings it back. */
var resting = false, lastStir = Date.now(), restTimer = 0;
function birdsEl(){ return document.getElementById("kvBirds"); }
function rest(){
  if(!fx || resting) return;
  resting = true;
  birdsEl().classList.remove("on");
  setTimeout(function(){ if(resting) flock(false); }, 2500);
}
function stir(){
  lastStir = Date.now();
  if(!fx || still()) return;
  if(resting){ resting = false; birdsEl().classList.add("on"); }
  flock(onScreen && !document.hidden);
  if(!restTimer) restTimer = setTimeout(restCheck, 15000);
}
function restCheck(){
  var quiet = Date.now() - lastStir;
  restTimer = quiet >= 14900 ? (rest(), 0) : setTimeout(restCheck, 15000 - quiet);
}
["pointermove", "pointerdown", "scroll", "keydown"].forEach(function(t){
  window.addEventListener(t, function(){ if(fx && (resting || !restTimer || Date.now() - lastStir > 1000)) stir(); }, { passive: true });
});
function startFlock(){
  if(fx || !M || !strong() || !webgl()) return;
  var phone = !fineMQ.matches;
  M.load("three.r134.min.js").then(function(){ return M.load("vanta.birds.min.js"); }).then(function(){
    if(fx || still() || !window.VANTA || !window.VANTA.BIRDS) return;
    var el = document.getElementById("kvBirds");
    try{
      fx = window.VANTA.BIRDS({
        el: el, THREE: window.THREE,
        mouseControls: !phone, touchControls: phone, gyroControls: false,
        backgroundColor: 0x000000, backgroundAlpha: 0,
        /* a small flock high over the valley, wings catching a light the
           water has not seen yet: dusk rose to pale gold, not confetti.
           Sixteen birds on a laptop, twelve on a phone. */
        color1: 0xe9a3bd, color2: 0xffe0a8, colorMode: "lerpGradient",
        birdSize: phone ? .95 : 1.05, wingSpan: 20, speedLimit: 3,
        separation: 52, alignment: 44, cohesion: 34,
        quantity: phone ? 1 : 2,
        scale: 1, scaleMobile: 1.5
      });
    }catch(e){ fx = null; return; }
    /* Vanta asks the layout where the element is on every frame and keeps
       its loop running off screen. Both go: visibility comes from the
       observer above, and the loop is stopped outright while hidden. A
       phone draws every other frame (the flock is slow; 30 fps is
       indistinguishable and half the work). */
    fx.isOnScreen = function(){ return true; };
    var orig = fx.animationLoop, skip = false;
    fx.animationLoop = function(){
      if(!running) return;
      if(phone){ skip = !skip; if(skip){ fx.req = window.requestAnimationFrame(fx.animationLoop); return fx.req; } }
      return orig();
    };
    running = false;
    window.cancelAnimationFrame(fx.req);
    el.classList.add("on");
    stir();
  }).catch(function(){});
}

/* ════════ 4. your stars ════════ */
var host = document.getElementById("hsMyStars");
/* FNV-1a with a murmur finish: consecutive dates differ only in their last
   character, and plain FNV leaves those in a row across the sky */
function hash(str){
  var h = 2166136261;
  for(var i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function readJSON(k, d){ try{ return JSON.parse(localStorage.getItem(k)) || d; }catch(e){ return d; } }
/* where the words are, so a star is never drawn behind them. Read from
   the layout (offsets), not from the screen: when this runs the words may
   be mid-entrance or lifted by the scroll, and both are transforms. The
   stars' box sits at the sky's top left, so the two share an origin. */
function wordBoxes(){
  var out = [];
  sky.querySelectorAll(".hs-copy > *").forEach(function(el){
    if(!el.offsetWidth) return;
    var l = 0, t = 0, n = el;
    while(n && n !== sky){ l += n.offsetLeft; t += n.offsetTop; n = n.offsetParent; }
    if(n === sky) out.push({ l: l - 12, t: t - 10, r: l + el.offsetWidth + 12, b: t + el.offsetHeight + 10 });
  });
  return out;
}
function drawStars(freshKind){
  if(!host) return;
  var hist = readJSON("psych-screener-history", []), mood = readJSON("psych-mood", {});
  var since = Date.now() - 1000 * 60 * 60 * 24 * 120;
  var items = [];
  Object.keys(mood).sort().slice(-60).forEach(function(d){ items.push({ k: "m" + d, ck: false, d: d }); });
  hist.filter(function(e){ return e && e.date && new Date(e.date).getTime() > since; }).slice(-24)
      .forEach(function(e, i){ items.push({ k: "c" + e.date + (e.inst || "") + i, ck: true, d: e.date }); });
  host.textContent = "";
  if(!items.length) return;
  var W = host.offsetWidth || 1, H = host.offsetHeight || 1, words = wordBoxes(), lowest = 0;
  words.forEach(function(w){ if(w.b > lowest) lowest = w.b; });
  function free(x, y){
    for(var i=0;i<words.length;i++){ var w = words[i]; if(x > w.l && x < w.r && y > w.t && y < w.b) return false; }
    return true;
  }
  var newest = null;
  items.forEach(function(it){
    /* the same place every visit: the first of two dozen candidate spots,
       all drawn from the entry's own date, that is clear of the words; on a
       phone, where the words fill the sky, failing that, the band of sky
       between the last line and the mountains */
    var x, y, ok = false;
    for(var n=0;n<24 && !ok;n++){
      x = W * (.03 + hash(it.k + "x" + n) * .94);
      y = H * (.05 + hash(it.k + "y" + n) * .9);
      ok = free(x, y);
    }
    if(!ok && lowest < H - 8) y = lowest + (H - lowest) * (.15 + hash(it.k + "f") * .75);
    var s = document.createElement("i");
    if(it.ck) s.className = "ck";
    s.style.left = (x / W * 100).toFixed(2) + "%";
    s.style.top = (y / H * 100).toFixed(2) + "%";
    if(!it.ck) s.style.opacity = (.55 + hash(it.k + "o") * .45).toFixed(2);
    host.appendChild(s);
    if(freshKind && ((freshKind === "checkin" && it.ck) || (freshKind === "mood" && !it.ck))) newest = s;
  });
  if(newest && !still()) newest.classList.add("new");
}
/* the day's first mood tap: a small star rises from the face that was
   tapped and fades on its way up toward the sky it has just joined */
function spark(x, y){
  if(!G || still() || x == null || y == null) return;
  var o = document.createElement("i");
  o.className = "my-spark";
  o.setAttribute("aria-hidden", "true");
  o.style.left = x + "px"; o.style.top = y + "px";
  document.body.appendChild(o);
  var up = Math.min(280, Math.max(140, y * .6));
  G.timeline({ onComplete: function(){ o.remove(); } })
    .fromTo(o, { y: 0, scale: .4, opacity: 0 }, { y: -up * .3, scale: 1.3, opacity: 1, duration: .45, ease: "rk-out" })
    .to(o, { y: -up, x: (Math.random() - .5) * 36, scale: .55, opacity: 0, duration: 1.15, ease: "rk-breath" });
}
document.addEventListener("rk:sky", function(e){
  var d = e.detail || {};
  drawStars(d.kind);
  spark(d.x, d.y);
});
/* the words reflow with the width, the language and the fonts arriving:
   whenever their block changes size, place the stars again */
var restar = 0;
function restarSoon(){ clearTimeout(restar); restar = setTimeout(function(){ drawStars(); }, 200); }
var copy = sky.querySelector(".hs-copy");
if(window.ResizeObserver && copy) new ResizeObserver(restarSoon).observe(copy);
else window.addEventListener("resize", restarSoon);

/* ════════ start ════════ */
drawStars();
if(G && !still()){
  setupDepth();
  if(strong()) startTilt();
  setTimeout(idleLeaf, 7000);
  var later = function(){ startFlock(); };
  if(document.readyState === "complete") setTimeout(later, 1200);
  else window.addEventListener("load", function(){
    if(window.requestIdleCallback) window.requestIdleCallback(later, { timeout: 3000 }); else setTimeout(later, 1500);
  });
}
})();
