/* ══════════════════════════════════════════════════════════════
   Ronak — Ooh the guide, the sounds, and the feel
   ──────────────────────────────────────────────────────────────
   OOH
   Ooh is the guide Ronak shares with Arun, its sister app: a round
   sunrise-gold creature with the bloom-sun's petals growing from its
   head. It is drawn by ooh.mjs, which is Arun's lib/ooh.mjs copied
   byte for byte, so the two apps can never drift into two slightly
   different characters. Update it there and copy it here.

   Ooh behaves as it does in Arun, for the same reasons Arun learned:
   · it speaks IN the page, under the heading, never floating over it.
     A floating bubble in Arun landed on the one button a struggling
     person most needed; in the page it pushes things down instead;
   · a few lines the first time on a page, one line on every visit
     after, and it stays until tapped away, so nothing jumps under a
     thumb; then Ooh tucks into the corner, and a tap there brings a
     line back as a small float (fine to cover things: they asked);
   · it never says or implies that anyone is watching or coming, and on
     a heavy result it only ever looks gentle and starts tucked away,
     so the helplines stay first on the screen.
   Ronak adds its own: Ooh is gone at the self-harm safety step, stays
   out of the corner while questions are being answered, and waits
   while the opening, the tour or the settings panel are up.

   Motion is compositor-only. Ooh's own stylesheet in ooh.mjs animates
   groups inside the SVG, which in Chrome re-rasterises the drawing on
   the main thread every frame (measured on the first version of this
   guide at ~300ms per 4s on a throttled phone). So it is not used:
   the bob is a transform on the HTML wrapper, the blink applies to the
   eyes for 130ms every few seconds, and the sprout sways only while
   Ooh is talking.

   SOUNDS: the CC0 "soft" pack of uisfx (sounds/LICENSE.txt), fetched
   on the first tap. HAPTICS: a short vibration on Android, the iOS
   switch-control tick on iPhone (Safari 18+), and on every screen a
   visual answer: a ring where the finger lands, a line of light that
   tracks how far down the page you are, a soft glow as each card
   arrives, and a sweep of light when you move to another page.
   ══════════════════════════════════════════════════════════════ */
(function(){
"use strict";
if(window.Ooh) return;

const ME = document.currentScript && document.currentScript.src;
const BASE = ME ? new URL(".", ME).href : "";
const VM = ME && /[?&]v=(\w+)/.exec(ME);
const V = VM ? VM[1] : "1";
const STILL = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
const LITE = document.documentElement.classList.contains("lite");

function readJSON(k, d){ try{ return JSON.parse(localStorage.getItem(k)) || d; }catch(e){ return d; } }
function writeJSON(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
const OOH_KEY = "ronak-ooh", FEEL_KEY = "ronak-feel";
const oohPref = Object.assign({ on:true, seen:{} }, readJSON(OOH_KEY, {}));
const feel = Object.assign({ sfx:true, haptics:true }, readJSON(FEEL_KEY, {}));
function saveOoh(){ writeJSON(OOH_KEY, oohPref); }
function saveFeel(){ writeJSON(FEEL_KEY, feel); }
/* dismissed this visit, per page: coming back to a page in the same visit
   finds Ooh already tucked, not saying its line again */
function tuckedThisVisit(k){ try{ return sessionStorage.getItem("ronak-ooh-tuck-" + k) === "1"; }catch(e){ return false; } }
function markTucked(k){ try{ sessionStorage.setItem("ronak-ooh-tuck-" + k, "1"); }catch(e){} }

function crisisUp(){ const s = document.getElementById("safeNow"); return !!(s && !s.hidden); }

/* ══════════════ sounds ══════════════ */
const CORE = ["press","select","typing","forward","back","open","close","progress-step","wake"];
const REST = ["toggle-on","toggle-off","expand","collapse","check","success","delete","complete"];
const VOL  = { typing:0.18, press:0.3, select:0.38, wake:0.3, complete:0.3 };
let actx = null;
const bufs = {}, loading = {};
function unlockSfx(){
  if(!feel.sfx) return;
  if(actx){ if(actx.state === "suspended") actx.resume().catch(()=>{}); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if(!AC) return;
  try{ if(navigator.audioSession) navigator.audioSession.type = "ambient"; }catch(e){}
  try{ actx = new AC(); }catch(e){ actx = null; return; }
  CORE.forEach(fetchBuf);
  const later = ()=> REST.forEach(fetchBuf);
  if(window.requestIdleCallback) requestIdleCallback(later, { timeout:4000 }); else setTimeout(later, 1500);
}
function fetchBuf(n){
  if(!actx || bufs[n] || loading[n]) return;
  loading[n] = true;
  fetch(BASE + "sounds/" + n + ".mp3?v=1")
    .then(r=> r.ok ? r.arrayBuffer() : Promise.reject(r.status))
    .then(a=> new Promise((ok, no)=> actx.decodeAudioData(a, ok, no)))
    .then(b=>{ bufs[n] = b; })
    .catch(()=>{ loading[n] = false; });
}
function play(n, rate){
  if(!feel.sfx || !actx || crisisUp()) return;
  const b = bufs[n];
  if(!b){ fetchBuf(n); return; }            /* a late sound is worse than none */
  if(actx.state === "suspended") actx.resume().catch(()=>{});
  try{
    const src = actx.createBufferSource(), gn = actx.createGain();
    src.buffer = b; if(rate) src.playbackRate.value = rate;
    gn.gain.value = VOL[n] || 0.32;
    src.connect(gn); gn.connect(actx.destination); src.start();
  }catch(e){}
}

/* ══════════════ haptics ══════════════ */
/* iPhone Safari has no vibration API, but since iOS 18 toggling an
   <input type=checkbox switch> gives the system's own light tick, and a
   label click toggles it. The label sits off-screen, hidden from
   assistive tech, and every listener here ignores it. */
let iosTick = null;
const IOS = /iP(hone|ad|od)/.test(navigator.platform || "") ||
            (/Mac/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
function buzz(kind){
  if(!feel.haptics || crisisUp()) return;
  const ms = { tap:6, pick:12, nav:[6, 36, 6], soft:4 }[kind] || 6;
  try{
    if(navigator.vibrate){ navigator.vibrate(ms); return; }
    if(IOS){
      if(!iosTick){
        iosTick = document.createElement("label");
        iosTick.className = "fx-ios"; iosTick.setAttribute("aria-hidden", "true");
        iosTick.innerHTML = '<input type="checkbox" switch tabindex="-1">';
        iosTick.addEventListener("click", e=> e.stopPropagation());
        document.body.appendChild(iosTick);
      }
      iosTick.click();
    }
  }catch(e){}
}

/* ══════════════ the visual feel ══════════════ */
let fxLayer = null, ringCount = 0;
function fxOn(){ return feel.haptics; }
function layer(){
  if(!fxLayer){
    fxLayer = document.createElement("div");
    fxLayer.className = "fx-layer"; fxLayer.setAttribute("aria-hidden", "true");
    document.body.appendChild(fxLayer);
  }
  return fxLayer;
}
/* a ring where the finger lands */
function ring(x, y, strong){
  if(!fxOn() || ringCount > 4) return;
  const r = document.createElement("span");
  r.className = "fx-ring" + (strong ? " strong" : "");
  r.style.left = x + "px"; r.style.top = y + "px";
  layer().appendChild(r); ringCount++;
  let gone = false;
  const end = ()=>{ if(gone) return; gone = true; r.remove(); ringCount--; };
  r.addEventListener("animationend", end, { once:true });
  setTimeout(end, 900);
}
/* a sweep of light down the screen when the page changes */
function sweep(){
  if(!fxOn() || STILL) return;
  const s = document.createElement("span");
  s.className = "fx-sweep";
  layer().appendChild(s);
  s.addEventListener("animationend", ()=> s.remove(), { once:true });
  setTimeout(()=> s.remove(), 1200);
}
/* cards arriving as you scroll: a soft glow traced round each, once */
const ARRIVE = ".card,.panel,.bcard,.rescreen,.reflist li,.sheet,.homesec h2";
let arriveIO = null, lastScroll = 0;
function arrivals(){
  if(!fxOn() || STILL || LITE || !("IntersectionObserver" in window)) return;
  if(!arriveIO){
    arriveIO = new IntersectionObserver(es=>{
      es.forEach(e=>{
        if(!e.isIntersecting) return;
        arriveIO.unobserve(e.target);
        /* only while scrolling: what is on screen at load stays still */
        if(performance.now() - lastScroll > 400) return;
        glow(e.target);
      });
    }, { threshold:0.35 });
  }
  document.querySelectorAll(ARRIVE).forEach(el=>{
    if(el.dataset.fxSeen) return;
    el.dataset.fxSeen = "1";
    arriveIO.observe(el);
  });
}
function glow(el){
  if(!fxOn()) return;
  const r = el.getBoundingClientRect();
  if(r.width < 40 || r.height < 24) return;
  const g = document.createElement("span");
  g.className = "fx-glow";
  g.style.cssText = "left:" + (r.left + scrollX) + "px;top:" + (r.top + scrollY) + "px;width:" +
    r.width + "px;height:" + r.height + "px;border-radius:" + (getComputedStyle(el).borderRadius || "14px");
  document.body.appendChild(g);
  g.addEventListener("animationend", ()=> g.remove(), { once:true });
  setTimeout(()=> g.remove(), 1400);
}
/* the line of light: how far down the page you are */
let bar = null, barTick = false;
function progressBar(){
  if(bar) return;
  bar = document.createElement("div");
  bar.className = "fx-progress"; bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = "<i></i>";
  document.body.appendChild(bar);
  const native = !!(window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()"));
  if(native) bar.classList.add("native");
  addEventListener("scroll", ()=>{
    lastScroll = performance.now();
    if(native || barTick) return;
    barTick = true;
    requestAnimationFrame(()=>{
      barTick = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.firstChild.style.transform = "scaleX(" + (max > 0 ? Math.min(1, scrollY / max) : 0).toFixed(4) + ")";
    });
  }, { passive:true });
}
function syncFeelClass(){ document.documentElement.classList.toggle("fx-off", !feel.haptics); }

/* ══════════════ taps: sound, haptic, ring ══════════════ */
const SUCCESS = "#spSaveBtn,#sbarBtn,#icsBtn,#exportBtn";
const BACK    = "#backBtn,#cancelBtn,#primerBack,#sheetBackBtn,#tourPrev";
["pointerdown","keydown","touchend","click"].forEach(t=>
  document.addEventListener(t, ev=>{
    if(ev.target && ev.target.closest && ev.target.closest(".fx-ios")) return;
    unlockSfx();
    /* the opening's own Begin button starts the music with the sunrise */
    if(window.RonakMusic && !(ev.target && ev.target.closest && ev.target.closest("#overture"))) RonakMusic.unlock();
  }, { capture:true, passive:true }));
document.addEventListener("visibilitychange", ()=>{
  if(document.hidden && actx && actx.state === "running") actx.suspend().catch(()=>{});
});
const TAPPABLE = "button,a,summary,[role=button],input[type=checkbox],.card,label";
document.addEventListener("pointerdown", e=>{
  if(e.button > 0 || !e.target.closest) return;
  const t = e.target.closest(TAPPABLE);
  if(!t || t.closest(".fx-ios")) return;
  ring(e.clientX, e.clientY, !!t.closest(".bigopts,.card,.ooh-say,#otBegin"));
}, { capture:true, passive:true });
document.addEventListener("click", e=>{
  const t = e.target.closest && e.target.closest("button,a,summary,[role=button],input[type=checkbox]");
  if(!t || t.closest(".fx-ios")) return;
  /* a phone number is serious; calling it makes no sound and no buzz */
  if(t.closest(".topstrip,.ot-top") || /^tel:/.test(t.getAttribute("href") || "")) return;
  if(t.closest(".ooh-guide,.ooh-strip")){ buzz("soft"); return; }
  if(t.closest(".bigopts")){ play("select"); buzz("pick"); return; }
  if(t.closest("#moodBtns")){ play("check"); buzz("pick"); return; }
  buzz("tap");
  if(t.id === "otBegin" || t.id === "otQuiet"){ play("wake"); return; }
  if(t.id === "setBtn" || t.classList.contains("navtoggle")){
    play(t.getAttribute("aria-expanded") === "true" ? "close" : "open"); return; }
  if(t.id === "clearBtn"){ play("delete"); return; }
  if(t.matches(SUCCESS)){ play("success"); return; }
  if(t.matches(BACK)){ play("back"); return; }
  if(t.matches("summary")){ play(t.parentElement && t.parentElement.open ? "collapse" : "expand"); return; }
  if(t.hasAttribute("aria-pressed")){ play(t.getAttribute("aria-pressed") === "true" ? "toggle-off" : "toggle-on"); return; }
  if(t.matches("[data-view]")){ play(t.dataset.view === "home" ? "back" : "forward"); return; }
  if(t.matches("a[href]") && !/^#/.test(t.getAttribute("href"))){ play("forward"); return; }
  play("press");
}, true);

/* ══════════════ Ooh ══════════════ */
let oohSvg = null;
const UI_EN = { name:"Ooh", hear:"Ooh, your guide. Hear what Ooh says", hide:"Ooh, your guide. Hide what Ooh says",
  next:"Next", done:"Got it", close:"Close what Ooh is saying", says:"Ooh says:",
  musicOn:"Music on", musicOff:"Music off", on:"On", off:"Off" };
/* the working papers and the 404 page are English-only, so their lines
   live here; the app's own pages take theirs from the language files */
const PAGES_EN = {
  evidence: { lines:[["think","This page is the evidence behind every check-in: where each one comes from, and how accurate it is."],
                     ["happy","Every claim links to its source. The references are at the bottom."]],
              short:["think","The evidence behind every check-in, with a source for each claim."] },
  global:   { lines:[["listen","This page zooms out to the world: how many people live with depression and anxiety, and how few reach care."],
                     ["care","That gap is why Ronak is free, works offline and speaks six languages."]],
              short:["listen","The world picture: how many need care, and how few reach it."] },
  ethics:   { lines:[["calm","These are the rules Ronak follows: your privacy, your safety, and what a screening tool can't do."],
                     ["care","The most important one: screening is not diagnosis. Only a qualified clinician can diagnose."]],
              short:["calm","Ronak's rules. The big one: screening is not diagnosis."] },
  manifesto:{ lines:[["ooh","This is the manifesto: why Ronak exists, in plain words."],
                     ["happy","Read it, share it, argue with it. That's what it's for."]],
              short:["ooh","Why Ronak exists, in plain words."] },
  poster:   { lines:[["hello","This is a poster to print. Put it up in a clinic, a college or a pharmacy, so more people find help."],
                     ["happy","Print whenever you're ready. I stay off the paper."]],
              short:["hello","A poster for a clinic wall. I stay off the paper."] },
  notfound: { lines:[["ooh","Ooh! This page doesn't exist. The link may have a typo."],
                     ["care","The help numbers are right at the top, and the Ronak link takes you home."]],
              short:["ooh","This page doesn't exist. The help numbers are at the top."] }
};
function pack(){
  let t = null;
  try{ t = (typeof T !== "undefined" && T && T.ooh) ? T.ooh : null; }catch(e){}
  if(!t && window.I18N && I18N.en && I18N.en.ooh) t = I18N.en.ooh;
  return t;
}
function ui(k){ const p = pack(); return (p && p[k]) || UI_EN[k] || ""; }
function fmt(s, v){ return String(s).replace(/\{(\w+)\}/g, (m, k)=> k in v ? v[k] : m); }
function nowLabel(){ try{ return (typeof T !== "undefined" && T && T.ui && T.ui.guideNow) || ""; }catch(e){ return ""; } }

function pageKey(){
  const v = document.querySelector(".view.active");
  if(v) return v.id.replace("view-", "");
  return document.body.getAttribute("data-ooh") || null;
}
function riskResult(){
  const box = document.getElementById("safetyBox");
  return !!(box && box.style.display !== "none");
}
/* the script for a page: {id, lines, short, quiet} */
function scriptFor(k){
  if(!k) return null;
  if(!document.querySelector(".view")) return PAGES_EN[k] ? Object.assign({ id:k }, PAGES_EN[k]) : null;
  const p = pack(); if(!p) return null;
  const id = (k === "results" && riskResult()) ? "resultsRisk" : k;
  const s = p[id]; if(!s || !s.lines) return null;
  return { id, lines:s.lines, short:s.short || null, quiet:!!s.quiet };
}
function lineText(l){ return fmt(l[1], { now:nowLabel() }); }

/* ── drawing ── */
/* Until ooh.mjs has arrived the figure is an empty box of exactly its
   size, so drawing Ooh in later changes nothing around it. */
function figure(mood, size){
  if(!oohSvg) return '<span class="ooh-bobw" data-mood="' + mood + '" style="width:' + size + 'px;height:' + size + 'px"></span>';
  return '<span class="ooh-bobw"><span class="ooh-talkw">' + oohSvg({ mood, size }) + '</span></span>';
}
/* ooh.mjs has arrived: draw him into every placeholder */
function drawIn(){
  document.querySelectorAll(".ooh-bobw[data-mood]").forEach(w=>{
    const size = parseInt(w.style.width, 10) || 66;
    w.outerHTML = figure(w.dataset.mood, size);
  });
}
let blinkT = null;
function blinkLoop(){
  clearTimeout(blinkT);
  if(STILL) return;
  blinkT = setTimeout(()=>{
    if(!document.hidden){
      document.querySelectorAll(".ooh-svg").forEach(s=>{
        if(!s.querySelector(".ooh-blink")) return;
        s.classList.add("blink"); setTimeout(()=> s.classList.remove("blink"), 130);
      });
    }
    blinkLoop();
  }, 2800 + Math.random() * 3600);
}

/* ── one bubble: the typewriter, shared by the in-page strip and the float ── */
const SEG = (window.Intl && Intl.Segmenter) ? new Intl.Segmenter(undefined, { granularity:"grapheme" }) : null;
const graphemes = s=> SEG ? Array.from(SEG.segment(s), x=> x.segment) : Array.from(s);
const PITCH = { hello:1.1, ooh:1.18, happy:1.14, calm:0.92, listen:0.98, care:0.88, think:0.96, sleepy:0.82 };

function makeBubble(){
  const b = document.createElement("div");
  b.className = "ooh-bubble";
  b.innerHTML =
    '<button type="button" class="ooh-say"><span class="ooh-name" aria-hidden="true"></span>'
  + '<span class="ooh-text"><span class="ooh-typed"></span><span class="ooh-rest" aria-hidden="true"></span></span>'
  + '<span class="ooh-next"></span></button>'
  + '<button type="button" class="ooh-x"><span aria-hidden="true">×</span></button>'
  + '<p class="ooh-sr" aria-live="polite"></p>';
  return b;
}
function dress(run){
  const l = run.lines[run.i], last = run.i >= run.lines.length - 1;
  run.fig.innerHTML = figure(l[0], run.size);
  run.bubble.querySelector(".ooh-name").textContent = ui("name");
  run.bubble.querySelector(".ooh-x").setAttribute("aria-label", ui("close"));
  run.bubble.querySelector(".ooh-next").innerHTML = (last ? ui("done") : ui("next")) + '<span aria-hidden="true"> ▸</span>';
}
/* talk(run): type run.lines[run.i] into run.bubble, with Ooh nodding */
function talk(run){
  stopTalk(run);
  run.waiting = false;
  dress(run);
  const l = run.lines[run.i], text = lineText(l), mood = l[0];
  run.bubble.querySelector(".ooh-sr").textContent = ui("says") + " " + text;
  const next = run.bubble.querySelector(".ooh-next");
  const typed = run.bubble.querySelector(".ooh-typed"), rest = run.bubble.querySelector(".ooh-rest");
  if(STILL || LITE){ typed.textContent = text; rest.textContent = ""; next.dataset.ready = "true"; finish(run); return; }
  const parts = graphemes(text);
  let n = 0;
  typed.textContent = ""; rest.textContent = text; next.dataset.ready = "false";
  run.fig.classList.add("ooh-talking");
  const talkW = run.fig.querySelector(".ooh-talkw");
  const tick = ()=>{
    if(n >= parts.length){ finish(run); return; }
    const g = parts[n++];
    typed.textContent += g;
    rest.textContent = parts.slice(n).join("");
    let wait = 26;
    if(/[.!?।॥]/.test(g)) wait = 200; else if(/[,;:]/.test(g)) wait = 110;
    if(n % 3 === 1 && /\S/.test(g)){
      play("typing", (PITCH[mood] || 1) * (0.95 + Math.random() * 0.1));
      if(talkW){ talkW.classList.remove("nod"); void talkW.offsetWidth; talkW.classList.add("nod"); }
    }
    run.timer = setTimeout(tick, wait);
  };
  run.timer = setTimeout(tick, 0);
}
function stopTalk(run){ if(run && run.timer){ clearTimeout(run.timer); run.timer = null; } }
function finish(run){
  stopTalk(run);
  const text = lineText(run.lines[run.i]);
  run.bubble.querySelector(".ooh-typed").textContent = text;
  run.bubble.querySelector(".ooh-rest").textContent = "";
  run.bubble.querySelector(".ooh-next").dataset.ready = "true";
  run.fig.classList.remove("ooh-talking");
  if(run.i >= run.lines.length - 1 && run.full){ oohPref.seen[run.id] = 1; saveOoh(); }
}
const isDone = run=> !run.timer;

/* ── the in-page strip ── */
let strip = null;          /* {el, run, key} */
function slotFor(k){
  let slot = document.querySelector('.ooh-slot[data-ooh="' + k + '"]');
  if(slot) return slot;
  /* a page without a prepared slot: straight after its heading */
  const v = document.getElementById("view-" + k);
  const h = v ? v.querySelector("h1") : document.querySelector("main h1, h1");
  if(!h) return null;
  slot = document.createElement("div");
  slot.className = "ooh-slot"; slot.setAttribute("data-ooh", k);
  const nx = h.nextElementSibling;
  (nx && nx.matches(".lede,.guidenote") ? nx : h).after(slot);
  return slot;
}
function clearStrip(){
  if(!strip) return;
  stopTalk(strip.run);
  strip.el.remove(); strip = null;
}
function showStrip(k, sc){
  clearStrip();
  const slot = slotFor(k); if(!slot) return false;
  const full = !oohPref.seen[sc.id];
  const lines = full ? sc.lines : (sc.short ? [sc.short] : null);
  if(!lines) return false;
  const el = document.createElement("section");
  el.className = "ooh-strip";
  el.setAttribute("aria-label", ui("hear").split(".")[0]);
  const fig = document.createElement("span");
  fig.className = "ooh-figure"; fig.setAttribute("aria-hidden", "true");
  const size = full ? 84 : 66;
  fig.style.minWidth = size + "px"; fig.style.minHeight = size + "px";
  const bubble = makeBubble();
  el.appendChild(fig); el.appendChild(bubble);
  slot.textContent = ""; slot.classList.remove("spent"); slot.appendChild(el);
  const run = { id:sc.id, lines, i:0, fig, bubble, size, full, timer:null };
  strip = { el, run, key:k };
  bubble.querySelector(".ooh-say").addEventListener("click", ()=>{
    if(run.waiting){ talk(run); return; }
    if(!isDone(run)){ finish(run); return; }
    if(run.i >= run.lines.length - 1){ tuck(k); return; }
    run.i++; play("progress-step"); talk(run);
  });
  bubble.querySelector(".ooh-x").addEventListener("click", ()=> tuck(k));
  if(busy()) holdFirstLetter(run); else { play("wake"); talk(run); }
  return true;
}
/* behind the opening or the tour, Ooh waits with a bubble already the
   right size, and starts from the first letter when they lift */
function holdFirstLetter(run){
  dress(run);
  run.bubble.querySelector(".ooh-typed").textContent = "";
  run.bubble.querySelector(".ooh-rest").textContent = lineText(run.lines[0]);
  run.waiting = true;
}
function tuck(k){
  if(strip && strip.key === k){
    if(strip.run.full){ oohPref.seen[strip.run.id] = 1; saveOoh(); }
    clearStrip();
    const slot = document.querySelector('.ooh-slot[data-ooh="' + k + '"]');
    if(slot) slot.classList.add("spent");
  }
  markTucked(k);
  play("close");
  dockState();
  if(me && !me.hidden) me.focus({ preventScroll:true });
}

/* ── the corner: tucked Ooh, the float, and the music switch ── */
let dock = null, me = null, floatRun = null, floatBubble = null, musicBtn = null, floatT = null, floatY = 0;
function buildDock(){
  dock = document.createElement("div");
  dock.className = "ooh-guide noprint";
  dock.innerHTML = '<button type="button" class="ooh-music" hidden></button><button type="button" class="ooh-me" aria-expanded="false" hidden></button>';
  document.body.appendChild(dock);
  me = dock.querySelector(".ooh-me");
  musicBtn = dock.querySelector(".ooh-music");
  me.addEventListener("click", ()=>{ if(floatRun) closeFloat(); else openFloat(); });
  musicBtn.addEventListener("click", ()=>{
    if(!window.RonakMusic) return;
    RonakMusic.setWanted(!RonakMusic.wanted()); labels(); settingsSync();
  });
  document.addEventListener("keydown", e=>{ if(e.key === "Escape" && floatRun){ closeFloat(); me.focus(); } });
  addEventListener("scroll", ()=>{ if(floatRun && Math.abs(scrollY - floatY) > 200) closeFloat(); }, { passive:true });
}
function openFloat(){
  const k = pageKey(), sc = scriptFor(k); if(!sc) return;
  const line = sc.short || sc.lines[sc.lines.length - 1];
  floatBubble = makeBubble();
  dock.insertBefore(floatBubble, musicBtn);
  floatRun = { id:sc.id, lines:[line], i:0, fig:me, bubble:floatBubble, size:72, full:false, timer:null };
  floatBubble.querySelector(".ooh-say").addEventListener("click", ()=>{ if(!isDone(floatRun)) finish(floatRun); else closeFloat(); });
  floatBubble.querySelector(".ooh-x").addEventListener("click", ()=>{ closeFloat(); me.focus(); });
  dock.dataset.open = "true"; me.setAttribute("aria-expanded", "true");
  floatY = scrollY; play("open"); talk(floatRun);
  clearTimeout(floatT);
  floatT = setTimeout(function linger(){ if(!floatRun) return; if(isDone(floatRun)) closeFloat(); else floatT = setTimeout(linger, 2000); }, 10000);
  labels();
}
function closeFloat(){
  if(!floatRun) return;
  stopTalk(floatRun); floatBubble.remove(); floatRun = null; floatBubble = null;
  dock.dataset.open = "false"; me.setAttribute("aria-expanded", "false");
  clearTimeout(floatT); dockState();
}
/* what the corner shows right now */
function dockState(){
  if(!dock) return;
  const k = pageKey(), sc = scriptFor(k);
  const blocked = busy() || crisisUp();
  /* no corner Ooh beside the questions: his line there is said in the page */
  const showMe = oohPref.on && !blocked && !!k && k !== "test" && !strip && !!sc;
  me.hidden = !showMe;
  if(showMe && !floatRun){
    const mood = sc.quiet ? "care" : (sc.short || sc.lines[0])[0];
    me.innerHTML = figure(mood, 54);
  }
  musicBtn.hidden = !window.RonakMusic || blocked || k === "test";
  dock.hidden = me.hidden && musicBtn.hidden;
  labels();
}
function labels(){
  if(!me) return;
  me.setAttribute("aria-label", floatRun ? ui("hide") : ui("hear"));
  if(window.RonakMusic){
    const on = RonakMusic.wanted();
    musicBtn.setAttribute("aria-pressed", String(on));
    musicBtn.setAttribute("aria-label", on ? ui("musicOn") : ui("musicOff"));
    musicBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 17.5V6l10-2v11.5"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/>'
      + (on ? "" : '<path class="x" d="M3.5 3.5l17 17"/>') + "</svg>";
  }
}

/* ── when to speak ── */
const BUSY = ["overture","tour","intro","safeNow"];
function busy(){
  const sp = document.getElementById("setPanel");
  return !!(sp && sp.classList.contains("open")) ||
    BUSY.some(id=>{ const n = document.getElementById(id); return n && !n.hidden; });
}
function onView(name){
  closeFloat();
  const k = name || pageKey();
  if(k){
    const sc = scriptFor(k);
    const quiet = !sc || sc.quiet || !oohPref.on || tuckedThisVisit(k) ||
                  (k === "test" && oohPref.seen.test);
    if(!quiet) showStrip(k, sc); else clearStrip();
  }
  dockState();
  arrivals();
}
function watchBusy(){
  if(!window.MutationObserver) return;
  let wasBusy = busy();
  const mo = new MutationObserver(()=>{
    const b = busy();
    if(b !== wasBusy){
      wasBusy = b;
      if(!b && strip && strip.run.waiting){ play("wake"); talk(strip.run); }
      if(b) closeFloat();
      dockState();
    }
  });
  BUSY.forEach(id=>{ const n = document.getElementById(id); if(n) mo.observe(n, { attributes:true, attributeFilter:["hidden"] }); });
  const sp = document.getElementById("setPanel");
  if(sp) mo.observe(sp, { attributes:true, attributeFilter:["class"] });
}

/* ── settings ── */
function settingsSync(){
  const set = (id, on)=>{ const b = document.getElementById(id); if(b) b.setAttribute("aria-pressed", String(on)); };
  set("musicBtn", !!(window.RonakMusic && RonakMusic.wanted()));
  set("sfxBtn", feel.sfx); set("hapticsBtn", feel.haptics); set("oohBtn", oohPref.on);
}
function wireSettings(){
  const on = (id, fn)=>{ const b = document.getElementById(id); if(b) b.addEventListener("click", fn); };
  on("musicBtn", ()=>{ if(window.RonakMusic) RonakMusic.setWanted(!RonakMusic.wanted()); settingsSync(); labels(); });
  on("sfxBtn", ()=>{ feel.sfx = !feel.sfx; saveFeel(); if(feel.sfx){ unlockSfx(); setTimeout(()=> play("toggle-on"), 120); } settingsSync(); });
  on("hapticsBtn", ()=>{ feel.haptics = !feel.haptics; saveFeel(); syncFeelClass(); if(feel.haptics) buzz("pick"); settingsSync(); });
  on("oohBtn", ()=>{
    oohPref.on = !oohPref.on; saveOoh();
    if(!oohPref.on){ clearStrip(); closeFloat(); } else onView(pageKey());
    settingsSync(); dockState();
  });
  settingsSync();
}

let started = false;
function init(){
  if(started) return; started = true;
  syncFeelClass();
  progressBar();
  buildDock();
  watchBusy();
  wireSettings();
  blinkLoop();
  onView(pageKey());
}

window.Ooh = {
  view(name){ onView(name); sweep(); buzz("nav"); if(window.RonakMusic) RonakMusic.view(name); },
  /* results decide calm or risk only once they have rendered */
  results(){ if(pageKey() === "results") onView("results"); },
  lang(){
    labels(); settingsSync();
    /* the words may arrive after this script: the first language is what
       lets Ooh say anything at all */
    if(!strip){ onView(pageKey()); return; }
    if(strip && !busy()){ const k = strip.key, sc = scriptFor(k); if(sc){ const i = strip.run.i; showStrip(k, sc); if(strip){ strip.run.i = Math.min(i, strip.run.lines.length - 1); finish(strip.run); dress(strip.run); } } }
  },
  sound: play,
  buzz
};

/* In the app this script runs at the end of the body, before the first
   paint, so Ooh's line is in the page from the first frame and nothing
   moves when it appears; only the drawing arrives a moment later, into a
   box already its size. On the working papers it is deferred. */
const ready = fn=>{ if(document.readyState === "loading" && !document.getElementById("main")) document.addEventListener("DOMContentLoaded", fn); else fn(); };
ready(init);
import(BASE + "ooh.mjs?v=" + V).then(m=>{ oohSvg = m.oohSvg; drawIn(); dockState(); })
  .catch(()=>{ /* no drawing (a very old browser): the words, sounds and feel still work */ });
})();
