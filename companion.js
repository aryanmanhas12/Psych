/* ══════════════════════════════════════════════════════════════
   Ronak — Deepu, the guide, and the interface sounds
   ──────────────────────────────────────────────────────────────
   Deepu (short for Deepak, "lamp") is a small clay diya who lives in
   the corner of every page. The first time you reach a page he pops
   up with a comic-book speech bubble and walks you through it, a line
   at a time, the way a guide in a story game does; after that he waits
   quietly and explains the page again whenever you tap him.

   Where he steps back, on purpose:
   · during the questions themselves — a cartoon reacting while
     someone answers PHQ-9 would be leaning on the answers, so he says
     one line the first time and then ducks out of sight;
   · at the self-harm safety step, which gets the whole screen, no
     character and no sound;
   · during the opening, the tour and the three first-visit questions,
     which already own the screen.
   And his face never reacts to a score: on a results page he is
   gentle whatever the number says, and never celebrates.

   The sounds are the "soft" pack of uisfx (CC0, see sounds/LICENSE.txt),
   played through Web Audio so a tap sounds the instant it lands. None
   of them is fetched until the first tap, so a first visit costs no
   extra data; the core set is ~30KB, the rest ~55KB, fetched once and
   then served from the offline cache. On iPhone they follow the silent
   switch, and they never interrupt music already playing.

   Performance: every idle movement (the bob, the flicker, the glow) is
   a transform or opacity on an HTML layer, so the compositor runs it
   and the main thread does nothing while Deepu idles. Blinking is a
   swap to a closed-eye drawing every few seconds, by a timer, never a
   transform: a CSS transform on any SVG child inside the bobbing layer
   made Chrome redo that layer on the main thread every frame, measured
   at ~150ms of work per 4s idle on a throttled phone.
   Lite phones and reduced-motion readers get a still Deepu, and text
   that appears at once instead of typing out.
   ══════════════════════════════════════════════════════════════ */
(function(){
"use strict";
if(window.Deepu) return;

const PREF = "ronak-deepu";
function loadPref(){ try{ return JSON.parse(localStorage.getItem(PREF)) || {}; }catch(e){ return {}; } }
const st = Object.assign({ on:true, sound:true, shown:{}, done:{} }, loadPref());
function savePref(){ try{ localStorage.setItem(PREF, JSON.stringify(st)); }catch(e){} }

const STILL = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const ME = document.currentScript && document.currentScript.src;
const BASE = ME ? new URL(".", ME).href : "";

/* ══════════════ sounds ══════════════ */
const SFX_V = "1";
const CORE = ["press","select","typing","forward","back","open","close","progress-step","wake"];
const REST = ["toggle-on","toggle-off","expand","collapse","check","success","delete","complete"];
const VOL  = { typing:0.2, press:0.3, select:0.38, wake:0.34, complete:0.3 };
let ctx = null;
const bufs = {}, loading = {};

function unlock(){
  if(!st.sound) return;
  if(ctx){ if(ctx.state === "suspended") ctx.resume().catch(()=>{}); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if(!AC) return;
  /* "ambient": obey the iPhone silent switch, and mix with (never pause)
     whatever the person is already listening to */
  try{ if(navigator.audioSession) navigator.audioSession.type = "ambient"; }catch(e){}
  try{ ctx = new AC(); }catch(e){ ctx = null; return; }
  CORE.forEach(fetchBuf);
  const later = ()=> REST.forEach(fetchBuf);
  if(window.requestIdleCallback) requestIdleCallback(later, { timeout:4000 });
  else setTimeout(later, 1500);
}
function fetchBuf(n){
  if(!ctx || bufs[n] || loading[n]) return;
  loading[n] = true;
  fetch(BASE + "sounds/" + n + ".mp3?v=" + SFX_V)
    .then(r=> r.ok ? r.arrayBuffer() : Promise.reject(r.status))
    .then(a=> new Promise((ok, no)=> ctx.decodeAudioData(a, ok, no)))
    .then(b=>{ bufs[n] = b; })
    .catch(()=>{ loading[n] = false; });
}
function quiet(){
  const s = document.getElementById("safeNow");
  return !!(s && !s.hidden);
}
function play(n, rate){
  if(!st.sound || !ctx || quiet()) return;
  const b = bufs[n];
  if(!b){ fetchBuf(n); return; }         /* a late sound is worse than none */
  if(ctx.state === "suspended") ctx.resume().catch(()=>{});
  try{
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = b;
    if(rate) src.playbackRate.value = rate;
    g.gain.value = VOL[n] || 0.34;
    src.connect(g); g.connect(ctx.destination);
    src.start();
  }catch(e){}
}
function buzz(ms){
  if(!st.sound || quiet()) return;
  try{ if(navigator.vibrate) navigator.vibrate(ms); }catch(e){}
}
/* Browsers only allow audio after a gesture: the first tap or key press
   creates the context (and starts the fetch), later ones keep it awake. */
["pointerdown","keydown","touchend","click"].forEach(t=>
  document.addEventListener(t, unlock, { capture:true, passive:true }));
document.addEventListener("visibilitychange", ()=>{
  if(document.hidden && ctx && ctx.state === "running") ctx.suspend().catch(()=>{});
});

/* One delegated listener gives every control its sound, in the capture
   phase so it reads each control's state from just before the tap —
   a toggle that was off plays "on". */
const SUCCESS = "#spSaveBtn,#sbarBtn,#icsBtn,#exportBtn";
const BACK    = "#backBtn,#cancelBtn,#primerBack,#sheetBackBtn,#tourPrev";
document.addEventListener("click", e=>{
  if(!st.sound || !ctx) return;
  const t = e.target.closest && e.target.closest("button,a,summary,[role=button],input[type=checkbox]");
  if(!t || t.closest(".dp-dock")) return;
  /* a phone number is serious; calling it makes no noise */
  if(t.closest(".topstrip") || /^tel:/.test(t.getAttribute("href") || "")) return;
  if(t.closest(".bigopts")){ play("select"); buzz(8); return; }
  if(t.closest("#moodBtns")){ play("check"); buzz(8); return; }
  if(t.id === "setBtn" || t.classList.contains("navtoggle")){
    play(t.getAttribute("aria-expanded") === "true" ? "close" : "open"); return; }
  if(t.id === "clearBtn"){ play("delete"); return; }
  if(t.matches(SUCCESS)){ play("success"); return; }
  if(t.matches(BACK)){ play("back"); return; }
  if(t.matches("summary")){ play(t.parentElement && t.parentElement.open ? "collapse" : "expand"); return; }
  if(t.hasAttribute("aria-pressed")){
    play(t.getAttribute("aria-pressed") === "true" ? "toggle-off" : "toggle-on"); return; }
  if(t.matches("[data-view]")){ play(t.dataset.view === "home" ? "back" : "forward"); return; }
  if(t.matches("a[href]") && !/^#/.test(t.getAttribute("href"))){ play("forward"); return; }
  play("press");
}, true);

/* ══════════════ Deepu ══════════════ */
const INK = "#22113D";
/* each expression = which eyes, mouth, arms, brows, flame size, extra */
const MOODS = {
  happy:     { e:"open",   m:"smile", a:"down",  b:"",      f:"n" },
  wave:      { e:"open",   m:"smile", a:"wave",  b:"",      f:"n" },
  wink:      { e:"wink",   m:"smile", a:"wave",  b:"",      f:"n" },
  curious:   { e:"open",   m:"o",     a:"down",  b:"raise", f:"n" },
  think:     { e:"side",   m:"wavy",  a:"chin",  b:"raise", f:"n" },
  cheer:     { e:"arc",    m:"big",   a:"up",    b:"",      f:"big",   x:"spark" },
  caring:    { e:"closed", m:"soft",  a:"heart", b:"",      f:"small", x:"blush" },
  calm:      { e:"closed", m:"soft",  a:"down",  b:"",      f:"n" },
  concerned: { e:"open",   m:"flat",  a:"heart", b:"worry", f:"small", x:"blush" },
  surprised: { e:"big",    m:"o",     a:"up",    b:"raise", f:"big" },
  sleepy:    { e:"closed", m:"flat",  a:"down",  b:"",      f:"small", x:"zzz" }
};
const PITCH = { cheer:1.18, surprised:1.2, happy:1.1, wave:1.1, wink:1.1, curious:1.05,
                think:0.96, calm:0.92, caring:0.88, concerned:0.86, sleepy:0.8 };

function limb(d, hx, hy){
  return '<path class="dp-limb" d="'+d+'"/><path class="dp-limb-in" d="'+d+'"/>'
       + '<circle class="dp-hand" cx="'+hx+'" cy="'+hy+'" r="4.6"/>';
}
const FIG =
  '<svg class="dp-fig" viewBox="0 0 120 130" aria-hidden="true" focusable="false">'
+ '<defs><linearGradient id="dpClay" x1="0" y1="0" x2="0" y2="1">'
+   '<stop offset="0" stop-color="#FFB54A"/><stop offset=".55" stop-color="#FF7A6B"/>'
+   '<stop offset="1" stop-color="#E84A8A"/></linearGradient></defs>'
/* arms that sit behind the body */
+ '<g class="v a-down a-wave a-chin">' + limb("M20 86 Q7 94 10 106", 10, 106) + '</g>'
+ '<g class="v a-down">'               + limb("M100 86 Q113 94 110 106", 110, 106) + '</g>'
+ '<g class="v a-wave dp-waving">'     + limb("M100 82 Q117 72 113 54", 113, 53) + '</g>'
+ '<g class="v a-up">' + limb("M20 82 Q4 72 7 54", 7, 53) + limb("M100 82 Q116 72 113 54", 113, 53) + '</g>'
/* feet */
+ '<ellipse class="dp-foot" cx="42" cy="121" rx="10" ry="5.5"/>'
+ '<ellipse class="dp-foot" cx="78" cy="121" rx="10" ry="5.5"/>'
/* the lamp: bowl, shine, the dotted band, the oil */
+ '<path class="dp-body" d="M10 68 C10 60 110 60 110 68 C110 98 90 119 60 119 C30 119 10 98 10 68Z"/>'
+ '<path class="dp-shine" d="M19 78 C21 93 29 103 39 109"/>'
+ '<path class="dp-band" d="M27 111 Q60 122 93 111"/>'
+ '<ellipse class="dp-oil" cx="60" cy="67" rx="47" ry="7.5"/>'
+ '<ellipse class="dp-oil-in" cx="60" cy="66" rx="39" ry="4.2"/>'
/* cheeks */
+ '<ellipse class="dp-blush" cx="32" cy="101" rx="6.5" ry="3.6"/>'
+ '<ellipse class="dp-blush" cx="88" cy="101" rx="6.5" ry="3.6"/>'
/* eyes */
+ '<g class="v e-open dp-eyes"><ellipse class="ink" cx="45" cy="91" rx="5" ry="6.5"/><ellipse class="ink" cx="75" cy="91" rx="5" ry="6.5"/>'
+   '<circle class="dp-glint" cx="43.3" cy="88.4" r="1.8"/><circle class="dp-glint" cx="73.3" cy="88.4" r="1.8"/></g>'
+ '<g class="v e-side dp-eyes"><ellipse class="ink" cx="47.5" cy="89" rx="5" ry="6.5"/><ellipse class="ink" cx="77.5" cy="89" rx="5" ry="6.5"/>'
+   '<circle class="dp-glint" cx="46" cy="86.4" r="1.8"/><circle class="dp-glint" cx="76" cy="86.4" r="1.8"/></g>'
+ '<g class="v e-shut"><path class="dp-line" d="M40 91.5 Q45 93 50 91.5"/><path class="dp-line" d="M70 91.5 Q75 93 80 91.5"/></g>'
+ '<g class="v e-arc"><path class="dp-line" d="M39 93 Q45 85 51 93"/><path class="dp-line" d="M69 93 Q75 85 81 93"/></g>'
+ '<g class="v e-closed"><path class="dp-line" d="M39 90 Q45 96 51 90"/><path class="dp-line" d="M69 90 Q75 96 81 90"/></g>'
+ '<g class="v e-wink"><ellipse class="ink" cx="45" cy="91" rx="5" ry="6.5"/><circle class="dp-glint" cx="43.3" cy="88.4" r="1.8"/>'
+   '<path class="dp-line" d="M69 92 Q75 86 81 92"/></g>'
+ '<g class="v e-big"><circle class="dp-white" cx="45" cy="91" r="7.6"/><circle class="dp-white" cx="75" cy="91" r="7.6"/>'
+   '<circle class="ink" cx="45" cy="92" r="3.2"/><circle class="ink" cx="75" cy="92" r="3.2"/></g>'
/* brows */
+ '<g class="v b-raise"><path class="dp-line" d="M38 81.5 Q45 80 51 81.5"/><path class="dp-line" d="M69 79 Q75 75 82 78"/></g>'
+ '<g class="v b-worry"><path class="dp-line" d="M38 82 L50 77.5"/><path class="dp-line" d="M70 77.5 L82 82"/></g>'
/* mouths */
+ '<path class="v m-smile dp-line" d="M51 101 Q60 110 69 101"/>'
+ '<path class="v m-soft dp-line" d="M54 102 Q60 106.5 66 102"/>'
+ '<g class="v m-open"><path class="dp-mouth" d="M51 100 Q60 113 69 100 Z"/><path class="dp-tongue" d="M55 106.6 Q60 104.2 65 106.6 Q60 111 55 106.6Z"/></g>'
+ '<g class="v m-big"><path class="dp-mouth" d="M48 99 Q60 118 72 99 Z"/><path class="dp-tongue" d="M53 108.5 Q60 104 67 108.5 Q60 115 53 108.5Z"/></g>'
+ '<ellipse class="v m-o dp-mouth" cx="60" cy="104" rx="4.2" ry="5"/>'
+ '<path class="v m-flat dp-line" d="M53 103.5 L67 103.5"/>'
+ '<path class="v m-wavy dp-line" d="M50 104 q5 -3.5 10 0 t10 0"/>'
/* arms that come in front: hand on chin, hands holding a heart */
+ '<g class="v a-chin">' + limb("M100 88 Q101 108 80 108", 79, 108) + '</g>'
+ '<g class="v a-heart">' + limb("M20 88 Q22 110 50 112", 51, 112) + limb("M100 88 Q98 110 70 112", 69, 112)
+   '<path class="dp-heart" d="M60 122 C49 114 51 105 56.5 106 C58.5 106.5 60 108.5 60 110 C60 108.5 61.5 106.5 63.5 106 C69 105 71 114 60 122Z"/></g>'
/* extras */
+ '<g class="v x-spark"><path class="dp-spark" d="M14 40 l2.2 6 6 2.2 -6 2.2 -2.2 6 -2.2 -6 -6 -2.2 6 -2.2Z"/>'
+   '<path class="dp-spark" d="M106 30 l1.8 4.6 4.6 1.8 -4.6 1.8 -1.8 4.6 -1.8 -4.6 -4.6 -1.8 4.6 -1.8Z"/></g>'
+ '<g class="v x-zzz"><path class="dp-line" d="M90 46 h9 l-9 9.5 h9"/><path class="dp-line" d="M103 32 h6 l-6 6.5 h6"/></g>'
+ '</svg>';

const FLAME =
  '<svg viewBox="0 0 40 60" aria-hidden="true" focusable="false">'
+ '<defs><linearGradient id="dpFl" x1="0" y1="1" x2="0" y2="0">'
+   '<stop offset="0" stop-color="#FF4F9A"/><stop offset=".55" stop-color="#FF7A45"/>'
+   '<stop offset="1" stop-color="#FFC83D"/></linearGradient></defs>'
+ '<path d="M20 3 C29 15 36 25 35 37 C34 49 28 57 20 57 C12 57 6 49 5 37 C4 25 11 15 20 3Z" fill="url(#dpFl)" stroke="'+INK+'" stroke-width="3" stroke-linejoin="round"/>'
+ '<path d="M20 21 C25 29 28 35 27 42 C26.4 48 23.5 52 20 52 C16.5 52 13.6 48 13 42 C12 35 15 29 20 21Z" fill="#FFD34D"/>'
+ '<ellipse cx="20" cy="46" rx="4" ry="5.5" fill="#FFF4D6"/>'
+ '</svg>';

const ICON_SOUND_ON  = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9h4l5-4v14l-5-4H4z"/><path class="w" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
const ICON_SOUND_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9h4l5-4v14l-5-4H4z"/><path class="w" d="M16.5 9.5l5 5M21.5 9.5l-5 5"/></svg>';
const ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path class="w" d="M6 6l12 12M18 6L6 18"/></svg>';

/* English lines for the pages outside the app, which are English-only;
   the app's own pages take theirs from the language files (T.deepu). */
const UI_EN = { name:"Deepu", btn:"Deepu, your guide — tap for help with this page",
  next:"Next", done:"Got it", close:"Close", soundOn:"Sound on", soundOff:"Sound off",
  step:"{i} of {n}", tour:"Show me around", on:"On", off:"Off" };
const PAGES_EN = {
  evidence: [["think","This page is the evidence behind every check-in: where each questionnaire comes from, and how accurate it is."],
             ["happy","Every claim links to its source. The references are at the bottom of the page."]],
  global:   [["curious","This page zooms out to the whole world: how many people live with depression and anxiety, and how few of them ever reach care."],
             ["caring","That gap is why Ronak is free, works offline, and speaks six languages."]],
  ethics:   [["calm","These are the rules Ronak follows: your privacy, your safety, and the limits of a screening tool."],
             ["caring","The most important one: screening is not diagnosis. Only a qualified clinician can diagnose."]],
  manifesto:[["cheer","This is the manifesto: why Ronak exists, in plain words."],
             ["happy","Read it, share it, argue with it. That's what it's for."]],
  poster:   [["wave","This is a poster you can print. Put it up in a clinic, a college or a pharmacy, so more people find help."],
             ["wink","Press print whenever you're ready. I'll stay off the paper."]],
  notfound: [["surprised","Oops! This page doesn't exist. The link may have been mistyped."],
             ["caring","The help numbers are right here all the same, and the Ronak link at the top takes you home."]]
};

function pack(){
  let t = null;
  try{ t = (typeof T !== "undefined" && T && T.deepu) ? T.deepu : null; }catch(e){}
  if(!t && window.I18N && I18N.en && I18N.en.deepu) t = I18N.en.deepu;
  return t;
}
function ui(k){ const p = pack(); return (p && p[k]) || UI_EN[k] || ""; }
function fmt(s, v){ return String(s).replace(/\{(\w+)\}/g, (m,k)=> k in v ? v[k] : m); }

function pageKey(){
  const v = document.querySelector(".view.active");
  if(v) return v.id.replace("view-", "");
  return document.body.getAttribute("data-deepu") || null;
}
function linesFor(key){
  if(!key) return [];
  if(PAGES_EN[key] && !document.querySelector(".view")) return PAGES_EN[key];
  const p = pack();
  if(!p) return [];
  if(key === "results"){
    const box = document.getElementById("safetyBox");
    if(box && box.style.display !== "none" && p.resultsRisk) return p.resultsRisk;
  }
  return p[key] || [];
}

/* ── build ── */
let dock, me, fig, flame, bubble, txt, ghost, sr, stepEl, acts, nextBtn, muteBtn, nameEl, quest;
function build(){
  dock = document.createElement("div");
  dock.className = "dp-dock noprint";
  dock.innerHTML =
    '<div class="dp-bubble" id="dpBubble" role="dialog" aria-modal="false" aria-labelledby="dpName" hidden>'
  +   '<div class="dp-head"><span class="dp-cap"><b id="dpName"></b></span><span class="dp-step" id="dpStep"></span>'
  +     '<button type="button" class="dp-ico" id="dpMute"></button>'
  +     '<button type="button" class="dp-ico" id="dpX">' + ICON_X + '</button></div>'
  +   '<p class="dp-text" id="dpText"><span class="dp-sr" id="dpSR" aria-live="polite"></span>'
  +     '<span class="dp-ghost" id="dpGhost" aria-hidden="true"></span><span class="dp-typed" id="dpTxt" aria-hidden="true"></span></p>'
  +   '<div class="dp-acts" id="dpActs"></div>'
  + '</div>'
  + '<button type="button" class="dp-me" id="dpMe" aria-controls="dpBubble" aria-expanded="false">'
  +   '<span class="dp-bob"><span class="dp-glow"></span>'
  +   '<span class="dp-flame"><span class="dp-flick">' + FLAME + '</span></span>'
  +   FIG + '<span class="dp-quest" aria-hidden="true">!</span></span>'
  + '</button>';
  document.body.appendChild(dock);
  me = dock.querySelector("#dpMe");
  fig = dock.querySelector(".dp-fig");
  flame = dock.querySelector(".dp-flame");
  bubble = dock.querySelector("#dpBubble");
  txt = dock.querySelector("#dpTxt");
  ghost = dock.querySelector("#dpGhost");
  sr = dock.querySelector("#dpSR");
  stepEl = dock.querySelector("#dpStep");
  acts = dock.querySelector("#dpActs");
  muteBtn = dock.querySelector("#dpMute");
  nameEl = dock.querySelector("#dpName");
  quest = dock.querySelector(".dp-quest");

  me.addEventListener("click", ()=>{
    if(!bubble.hidden){ close(true); return; }
    speak(pageKey(), false);
  });
  dock.querySelector("#dpX").addEventListener("click", ()=>{ close(true); me.focus(); });
  muteBtn.addEventListener("click", ()=> setSound(!st.sound));
  /* tapping the words while they type finishes them, as in any game */
  dock.querySelector("#dpText").addEventListener("click", ()=>{ if(typer) finishTyping(); });
  /* answering a question is always more important than his line: the
     first answer on a check-in closes the bubble instead of waiting on it */
  document.addEventListener("click", e=>{
    if(!bubble.hidden && e.target.closest && e.target.closest(".bigopts")){ idx = lines.length - 1; close(false); }
  }, true);
  document.addEventListener("keydown", e=>{
    if(e.key === "Escape" && !bubble.hidden){
      const inside = bubble.contains(document.activeElement);
      close(true); if(inside) me.focus();
    }
  });
  setMood("happy");
  labels();
  syncVisible();
  if(!STILL) blinkLoop();
}

function labels(){
  if(!dock) return;
  nameEl.textContent = ui("name");
  me.setAttribute("aria-label", ui("btn"));
  dock.querySelector("#dpX").setAttribute("aria-label", ui("close"));
  muteBtn.innerHTML = st.sound ? ICON_SOUND_ON : ICON_SOUND_OFF;
  muteBtn.setAttribute("aria-pressed", String(!st.sound));
  muteBtn.setAttribute("aria-label", st.sound ? ui("soundOff") : ui("soundOn"));
  const sb = document.getElementById("sfxBtn"), gb = document.getElementById("deepuBtn");
  if(sb){ sb.setAttribute("aria-pressed", String(st.sound));
          const t = sb.querySelector(".st"); if(t) t.textContent = st.sound ? ui("on") : ui("off"); }
  if(gb){ gb.setAttribute("aria-pressed", String(st.on));
          const t = gb.querySelector(".st"); if(t) t.textContent = st.on ? ui("on") : ui("off"); }
}

/* ── face ── */
let baseMood = "happy";
function setMood(name){
  const m = MOODS[name] || MOODS.happy;
  baseMood = MOODS[name] ? name : "happy";
  fig.setAttribute("data-e", m.e); fig.setAttribute("data-m", m.m);
  fig.setAttribute("data-a", m.a); fig.setAttribute("data-b", m.b);
  fig.setAttribute("data-x", m.x || "");
  dock.setAttribute("data-f", m.f);
}
let blinkT = null;
function blinkLoop(){
  clearTimeout(blinkT);
  blinkT = setTimeout(()=>{
    if(!document.hidden && dock && !dock.hidden){
      const e = fig.getAttribute("data-e");
      /* a swap to a closed-eye drawing, not a squash: a CSS transform on
         an SVG child pulls the whole bobbing figure off the compositor */
      if(e === "open" || e === "side" || e === "wink"){
        fig.setAttribute("data-e", "shut");
        setTimeout(()=>{ if(fig.getAttribute("data-e") === "shut") fig.setAttribute("data-e", e); }, 120);
      }
    }
    blinkLoop();
  }, 2600 + Math.random() * 3400);
}
let reactT = null;
function react(name){
  if(!dock || !bubble.hidden) return;
  setMood(name);
  if(!STILL){ me.classList.remove("hop"); void me.offsetWidth; me.classList.add("hop"); }
  clearTimeout(reactT);
  reactT = setTimeout(()=>{ if(bubble.hidden) setMood("happy"); me.classList.remove("hop"); }, 2600);
}

/* ── speech ── */
let lines = [], idx = 0, key = null, typer = null;
const SEG = (window.Intl && Intl.Segmenter) ? new Intl.Segmenter(undefined, { granularity:"grapheme" }) : null;
function graphemes(s){ return SEG ? Array.from(SEG.segment(s), x=> x.segment) : Array.from(s); }

function speak(k, auto){
  const ls = linesFor(k);
  if(!ls.length || !st.on) return;
  lines = ls; idx = 0; key = k;
  bubble.hidden = false;
  dock.classList.add("talking");
  me.setAttribute("aria-expanded", "true");
  play(auto ? "wake" : "open");
  if(auto){ st.shown[k] = 1; savePref(); }
  syncVisible();
  show();
  if(!auto) setTimeout(()=>{ const b = acts.querySelector("button:last-child"); if(b) b.focus(); }, 60);
}
function lineText(i){
  let s = lines[i][1];
  try{ if(typeof T !== "undefined" && T && T.ui) s = fmt(s, { now:T.ui.guideNow || "" }); }catch(e){}
  return s;
}
function show(){
  const mood = lines[idx][0], text = lineText(idx);
  setMood(mood);
  stepEl.textContent = lines.length > 1 ? fmt(ui("step"), { i:idx+1, n:lines.length }) : "";
  sr.textContent = text;
  /* the whole line, invisible, holds the bubble at its final size from the
     first letter — typing into an empty box grew it a line at a time, and
     every new line pushed its top edge up the screen */
  ghost.textContent = text;
  renderActs();
  type(text, mood);
}
function renderActs(){
  const last = idx === lines.length - 1;
  acts.innerHTML = "";
  if(last && key === "home" && typeof tourStart === "function"){
    const b = document.createElement("button");
    b.type = "button"; b.className = "dp-btn dp-alt"; b.textContent = ui("tour");
    b.addEventListener("click", ()=>{ close(true); tourStart(); });
    acts.appendChild(b);
  }
  nextBtn = document.createElement("button");
  nextBtn.type = "button"; nextBtn.className = "dp-btn";
  nextBtn.textContent = last ? ui("done") : ui("next") + " ▸";
  nextBtn.addEventListener("click", advance);
  acts.appendChild(nextBtn);
}
function type(text, mood){
  stopTyping();
  if(STILL || document.documentElement.classList.contains("lite")){ txt.textContent = text; return; }
  const parts = graphemes(text), rate = PITCH[mood] || 1;
  const talk = MOODS[mood] || MOODS.happy;
  let i = 0; txt.textContent = "";
  bubble.classList.add("dp-typing");
  const tick = ()=>{
    if(i >= parts.length){ finishTyping(); return; }
    const g = parts[i++];
    txt.textContent += g;
    let wait = 24;
    if(/[.!?।॥]/.test(g)) wait = 200; else if(/[,;:—]/.test(g)) wait = 110;
    if(i % 3 === 1 && /\S/.test(g)){
      play("typing", rate * (0.95 + Math.random() * 0.1));
      fig.setAttribute("data-m", fig.getAttribute("data-m") === "open" ? talk.m : "open");
    }
    typer = setTimeout(tick, wait);
  };
  tick();
}
function stopTyping(){ if(typer){ clearTimeout(typer); typer = null; } bubble.classList.remove("dp-typing"); }
function finishTyping(){
  stopTyping();
  txt.textContent = lineText(idx);
  setMood(lines[idx][0]);
}
function advance(){
  if(typer){ finishTyping(); return; }
  if(idx < lines.length - 1){ idx++; play("progress-step"); show(); nextBtn.focus(); }
  else close(true);
}
function close(sound){
  if(!dock || bubble.hidden) return;
  stopTyping();
  if(key && idx >= lines.length - 1){ st.done[key] = 1; savePref(); }
  bubble.hidden = true;
  dock.classList.remove("talking");
  me.setAttribute("aria-expanded", "false");
  if(sound) play("close");
  setMood("happy");
  syncVisible();
}

/* ── when to appear ── */
const BUSY = ["overture","tour","intro","safeNow"];
function busy(){
  const sp = document.getElementById("setPanel");
  return (sp && sp.classList.contains("open")) ||
    BUSY.some(id=>{ const n = document.getElementById(id); return n && !n.hidden; });
}
let pending = null, autoT = null;
function syncVisible(){
  if(!dock) return;
  const k = pageKey(), b = busy();
  dock.hidden = !st.on || !k;
  dock.classList.toggle("dp-hide", b);
  /* on the question screen Deepu steps out once he has said his line */
  dock.classList.toggle("dp-away", k === "test" && bubble.hidden);
  quest.hidden = !!(st.done[k] || !bubble.hidden);
  if(b && !bubble.hidden){
    /* something bigger took the screen mid-sentence: give the lines back */
    if(key){ st.shown[key] = 0; savePref(); }
    close(false);
  }
}
function onView(name){
  if(!dock) return;
  clearTimeout(autoT);
  if(!bubble.hidden && key !== name) close(false);
  syncVisible();
  if(name === "results" && !busy()){
    const box = document.getElementById("safetyBox");
    const risk = box && box.style.display !== "none";
    if(!risk) setTimeout(()=> play("complete"), 250);
    react("caring");
  }
  if(!st.on || !name) return;
  if(busy()){ pending = name; return; }
  pending = null;
  if(st.shown[name]) return;
  autoT = setTimeout(()=>{
    if(pageKey() === name && !busy() && bubble.hidden && st.on) speak(name, true);
  }, 900);
}
function watchBusy(){
  if(!window.MutationObserver) return;
  const mo = new MutationObserver(()=>{
    syncVisible();
    if(!busy() && pending){ const p = pending; pending = null; onView(p); }
  });
  BUSY.forEach(id=>{ const n = document.getElementById(id); if(n) mo.observe(n, { attributes:true, attributeFilter:["hidden"] }); });
  /* the settings panel is a popover over the page; he steps aside for it */
  const sp = document.getElementById("setPanel");
  if(sp) mo.observe(sp, { attributes:true, attributeFilter:["class"] });
}

function setSound(on){
  st.sound = !!on; savePref();
  if(on){ unlock(); setTimeout(()=> play("toggle-on"), 120); }
  labels();
}
function setOn(on){
  st.on = !!on; savePref();
  if(!on) close(false);
  syncVisible(); labels();
  if(on){ const k = pageKey(); if(k && !st.shown[k]) onView(k); else react("wave"); }
}

function init(){
  build();
  watchBusy();
  const sb = document.getElementById("sfxBtn"), gb = document.getElementById("deepuBtn");
  if(sb) sb.addEventListener("click", ()=> setSound(!st.sound));
  if(gb) gb.addEventListener("click", ()=> setOn(!st.on));
  /* the opening may still be deciding whether to play; give it a beat */
  setTimeout(()=> onView(pageKey()), 700);
}

window.Deepu = {
  view: onView,
  react: react,
  lang(){ labels(); if(dock && !bubble.hidden){ lines = linesFor(key); if(idx >= lines.length) idx = 0; if(lines.length) show(); } },
  close(){ close(false); },
  sound: play
};
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
})();
