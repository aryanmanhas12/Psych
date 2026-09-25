/* ══════════════════════════════════════════════════════════════
   Ronak — the app (index.html only)
   ──────────────────────────────────────────────────────────────
   Loaded as a classic script at the foot of index.html, exactly where it
   used to sit inline, so every global the page and the test suite rely
   on (startTest, showView, setLang, TOUR_STEPS…) is unchanged. It moved
   out of the page for two reasons, both about slow phones on slow
   connections: the service worker can now keep it between visits
   instead of it riding along with every fresh copy of the page (~51KB
   gzipped, every time), and browsers keep compiled code for external
   scripts but not for inline ones, so a repeat visit starts sooner.
   ══════════════════════════════════════════════════════════════ */
window.HELP = {
  LAST_REVIEWED: "2026-07",
  directories: [
    { name: "Find A Helpline",
      url:  "https://findahelpline.com",
      note: "Free, verified helplines in 130+ countries. Pick your country, get numbers, live chat and text options that are checked and kept current." },
    { name: "IASP — Crisis Centres",
      url:  "https://www.iasp.info/crisis-centres-helplines/",
      note: "The International Association for Suicide Prevention's global directory of crisis centres, listed country by country." },
    { name: "Befrienders Worldwide",
      url:  "https://befrienders.org",
      note: "Emotional-support centres across 30+ countries offering confidential listening, in local languages." }
  ],
  emergency: [
    { where: "India, EU, and much of the world", num: "112" },
    { where: "United States & Canada",           num: "911" },
    { where: "United Kingdom",                   num: "999" },
    { where: "Australia",                        num: "000" },
    { where: "New Zealand",                      num: "111" }
  ],
  regions: [
    { id: "sa", label: "South Asia", lines: [
      { country:"India",       org:"Tele-MANAS (Govt. of India)", num:"14416",          tel:"14416",        note:"24×7, free, 20+ languages" },
      { country:"India",       org:"KIRAN",                       num:"1800-599-0019",  tel:"18005990019",  note:"24×7, free, 13 languages" },
      { country:"India",       org:"AASRA",                       num:"+91 98204 66726",tel:"+919820466726",note:"24×7 volunteer-run" },
      { country:"Bangladesh",  org:"Kaan Pete Roi",               num:"09612-119911",   tel:"09612119911",  note:"Emotional support" },
      { country:"Pakistan",    org:"Umang",                       num:"0311-7786264",   tel:"03117786264",  note:"Trained volunteers" },
      { country:"Sri Lanka",   org:"CCCline",                     num:"1333",           tel:"1333",         note:"24×7 free" },
      { country:"Nepal",       org:"TUTH Suicide Hotline",        num:"1166",           tel:"1166",         note:"24×7" }
    ]},
    { id: "ap", label: "Asia-Pacific", lines: [
      { country:"Australia",   org:"Lifeline",                    num:"13 11 14",       tel:"131114",       note:"24×7 crisis support" },
      { country:"Australia",   org:"Beyond Blue",                 num:"1300 22 4636",   tel:"1300224636",   note:"24×7" },
      { country:"New Zealand", org:"Need to Talk?",               num:"1737",           tel:"1737",         note:"Call or text, 24×7" },
      { country:"Japan",       org:"TELL Lifeline",               num:"03-5774-0992",   tel:"0357740992",   note:"English-language support" },
      { country:"Singapore",   org:"Samaritans of Singapore",     num:"1767",           tel:"1767",         note:"24×7" },
      { country:"Philippines", org:"NCMH Crisis Hotline",         num:"1553",           tel:"1553",         note:"24×7 toll-free" },
      { country:"Malaysia",    org:"Befrienders KL",              num:"03-7627 2929",   tel:"0376272929",   note:"24×7" }
    ]},
    { id: "eu", label: "Europe", lines: [
      { country:"UK & Ireland",org:"Samaritans",                  num:"116 123",        tel:"116123",       note:"24×7, free" },
      { country:"Many EU states", org:"Emotional support line",   num:"116 123",        tel:"116123",       note:"EU-harmonised number; availability varies by country" },
      { country:"France",      org:"3114 — Souffrance & prévention", num:"3114",       tel:"3114",         note:"24×7 national line" },
      { country:"Germany",     org:"Telefonseelsorge",            num:"0800 111 0 111", tel:"08001110111",  note:"24×7, free" },
      { country:"Netherlands", org:"113 Zelfmoordpreventie",      num:"113",            tel:"113",          note:"24×7" }
    ]},
    { id: "am", label: "Americas", lines: [
      { country:"USA & Canada",org:"Suicide & Crisis Lifeline",   num:"988",            tel:"988",          note:"Call or text, 24×7" },
      { country:"Brazil",      org:"CVV",                         num:"188",            tel:"188",          note:"24×7, free" },
      { country:"Mexico",      org:"Línea de la Vida",            num:"800 911 2000",   tel:"8009112000",   note:"24×7" },
      { country:"Argentina",   org:"Salud Mental Responde",       num:"0800-345-1435",  tel:"08003451435",  note:"Free" }
    ]},
    { id: "af", label: "Africa & Middle East", lines: [
      { country:"South Africa",org:"SADAG",                       num:"0800 567 567",   tel:"0800567567",   note:"24×7 free" },
      { country:"Kenya",       org:"Befrienders Kenya",           num:"+254 722 178 177",tel:"+254722178177",note:"Emotional support" },
      { country:"Nigeria",     org:"SURPIN",                      num:"+234 806 210 6493",tel:"+2348062106493",note:"Suicide research & prevention" },
      { country:"Israel",      org:"ERAN",                        num:"1201",           tel:"1201",         note:"24×7" }
    ]}
  ]
};

/* ════════ language-independent instrument structure ════════ */
const META = {
  phq4:   { max:12, cutoff:6,  bands:[[0,2,0],[3,5,1],[6,8,2],[9,12,3]] },
  phq9:   { max:27, cutoff:10, bands:[[0,4,0],[5,9,1],[10,14,2],[15,19,3],[20,27,3]], safetyIdx:8 },
  gad7:   { max:21, cutoff:10, bands:[[0,4,0],[5,9,1],[10,14,2],[15,21,3]] },
  auditc: { max:12, cutoff:4,  bands:[[0,2,0],[3,3,1],[4,7,2],[8,12,3]], perQuestionOpts:true },
  /* WHO-5 runs the other way: it measures well-being, so a high score is a
     good one and the screen is positive at or BELOW the cut point. Every
     place that assumed "higher is worse" now reads this flag rather than
     special-casing the instrument by name — which is what lets the next
     well-being or functioning scale be added without touching that logic
     again. Severity still descends with score in the bands, so the shared
     guidance and re-screen intervals keep working unchanged. */
  who5:   { max:25, cutoff:12, inverse:true, bands:[[0,6,3],[7,12,2],[13,17,1],[18,25,0]] }
};
const ORDER = ["phq4","phq9","gad7","who5","auditc"];
const RESCREEN_DAYS = [28,14,14,7];

/* ════════ Well-beings companion app ════════
   The two apps are meant to hand off to each other: this screener does the
   occasional deep check, Well-beings does the weekly one-tap pulse, and
   each points at the other when it is the more useful tool for the moment.

   Left blank, the whole feature stays dormant — no button renders, no
   param is read differently. Set this to the live URL to turn it on:

     const WELLBEINGS_URL = "https://aryanmanhas12.github.io/Well-beings/";

   The contract in both directions is a URL parameter only. No scores, no
   answers, no identifiers cross between the two apps — that would mean
   each app carrying data the other's privacy page never promised to hold.

   Outbound (this app -> Well-beings), from the results view:
     ?ref=psych-screener&band=<0-3>
     band is the severity band just shown, nothing finer-grained.

   Inbound (Well-beings -> this app), read once on load:
     ?ref=wellbeings
     shows a welcome-back banner suggesting a full screening; carries no
     data about what triggered the redirect on their end. */
const WELLBEINGS_URL = "https://aryanmanhas12.github.io/Well-beings/";

/* ════════ state ════════ */
const STORE_KEY = "psych-screener-history";
const MOOD_KEY  = "psych-mood";
const PREF_KEY  = "psych-prefs";
let LANG = "en", T = null;
let current = null, lastResult = null, advancing = false;

function prefs(){ try{ return JSON.parse(localStorage.getItem(PREF_KEY)) || {}; }catch(e){ return {}; } }
function savePrefs(p){ try{ localStorage.setItem(PREF_KEY, JSON.stringify(p)); }catch(e){} }
function loadHistory(){ try{ return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }catch(e){ return []; } }
function saveEntry(e){ const h = loadHistory(); h.push(e); try{ localStorage.setItem(STORE_KEY, JSON.stringify(h)); }catch(err){} }
function esc(s){ return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function fmt(str, vals){ return String(str).replace(/\{(\w+)\}/g, (m,k)=> k in vals ? vals[k] : m); }
function localeOf(){ return LANG === "en" ? "en-IN" : LANG + "-IN"; }
function dateStr(d, opts){ try{ return new Date(d).toLocaleDateString(localeOf(), opts); }catch(e){ return new Date(d).toLocaleDateString("en-IN", opts); } }

/* ════════ language ════════
   The list of languages is declared here rather than read off
   window.I18N, because window.I18N now holds only the languages that
   have actually been fetched — and the whole point of the split is that
   on first paint that is one of them. Building the picker from what is
   loaded would offer a Hindi speaker a menu containing only English,
   which is precisely backwards: the language control exists for the
   person who cannot read the page it is on. Six codes and six labels
   cost nothing to carry, and they are always all offered. */
const LANGS = [
  ["en", "English", "en"],
  ["hi", "हिन्दी",   "hi"],
  ["mr", "मराठी",   "mr"],
  ["bn", "বাংলা",    "bn"],
  ["ta", "தமிழ்",    "ta"],
  ["te", "తెలుగు",   "te"]
];

/* `after` runs once the language is on screen — otBuildLangs needs it,
   because replaying the opening before its caption exists shows the
   scene in the language the reader just rejected. */
function setLang(code, after){
  if(!window.I18N || !window.I18N[code]){
    /* Not fetched yet. In practice this is rare — the idle preload has
       usually finished long before anyone opens the picker — so no
       spinner: the page simply changes a moment later. */
    loadLang(code, got=>{
      if(got) setLang(got, after);
      else if(code !== "en" && window.I18N && window.I18N.en) setLang("en", after);
    });
    return;
  }
  LANG = code; T = window.I18N[code];
  document.documentElement.lang = T.htmlLang;
  const p = prefs(); p.lang = code; savePrefs(p);

  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const v = T.ui[el.dataset.i18n];
    if(typeof v === "string") el.textContent = v;
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el=>{
    const v = T.ui[el.dataset.i18nHtml];
    if(typeof v === "string") el.innerHTML = v;
  });
  /* placeholders and tooltips are text a person reads too — the safety plan
     is four inputs whose only instruction is the placeholder inside them. */
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
    const v = T.ui[el.dataset.i18nPlaceholder];
    if(typeof v === "string") el.placeholder = v;
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el=>{
    const v = T.ui[el.dataset.i18nTitle];
    if(typeof v === "string") el.title = v;
  });
  document.querySelectorAll("[data-i18n-label]").forEach(el=>{
    const v = T.ui[el.dataset.i18nLabel];
    if(typeof v === "string") el.setAttribute("aria-label", v);
  });
  document.getElementById("langsel").value = code;
  document.getElementById("moodBtns").setAttribute("aria-label", T.ui.moodTitle);
  dialable();

  /* The language control was a dropdown inside a panel behind a gear —
     which asks someone who cannot read this page to navigate this page in
     order to change it. The button now wears the current language code, so
     the way out of the wrong language is visible from the first screen
     without being able to read a word of it. Two letters cost no room,
     and the panel behind it opens on Language. */
  const codeTag = document.getElementById("setLangCode");
  if(codeTag) codeTag.textContent = code.toUpperCase();
  const setBtn = document.getElementById("setBtn");
  if(setBtn) setBtn.setAttribute("aria-label",
    (T.ui.settings || "Settings") + " — " + (T.ui.langLabel || "Language") + ": " + T.label);

  renderCards(); renderMood(); renderResources();
  if(document.getElementById("transcript").childElementCount) guideStart();
  if(typeof syncLede === "function") setTimeout(syncLede, 30);
  if(document.getElementById("view-history").classList.contains("active")) renderHistory();
  if(current) renderQ();
  if(lastResult && document.getElementById("view-results").classList.contains("active")) renderResults(false);
  hideMissing();
  if(after) after();
}

/* Some strings exist in English and Hindi and not yet in the other four —
   homeSubtitle is the current one. The loop above fills a node only when
   the value is a string, which is right, but it leaves the element in the
   layout: an empty <p> still carries its margin, so three of the six
   languages got a 1.4rem hole where a sentence should be. Mark those
   nodes data-i18n-optional and they are hidden outright when their key is
   missing, and shown again the moment a translation for it lands. */
function hideMissing(){
  document.querySelectorAll("[data-i18n-optional]").forEach(el=>{
    el.hidden = typeof T.ui[el.dataset.i18n] !== "string";
  });
}

function buildLangSelect(){
  const sel = document.getElementById("langsel");
  LANGS.forEach(([code, label, htmlLang])=>{
    const o = document.createElement("option");
    o.value = code; o.textContent = label; o.lang = htmlLang;
    sel.appendChild(o);
  });
  sel.addEventListener("change", ()=> setLang(sel.value));
}

/* The other five, once the page is up and idle. Switching language then
   costs nothing, and an installed copy still works offline in all six —
   which is the whole reason this site caches anything. Sequential on
   purpose: five parallel requests on a phone that has just finished
   painting would compete with whatever the reader does next. */
function preloadLangs(){
  const rest = LANGS.map(l=> l[0]).filter(c=> !(window.I18N && window.I18N[c]));
  (function next(){
    const c = rest.shift();
    if(c) loadLang(c, ()=> setTimeout(next, 120));
  })();
}

/* ════════ accessibility prefs ════════ */
function applySize(scale){
  document.documentElement.style.setProperty("--scale", scale);
  document.querySelectorAll("#sizeGroup button").forEach(b=>
    b.setAttribute("aria-pressed", String(Number(b.dataset.size) === Number(scale))));
  const p = prefs(); p.scale = scale; savePrefs(p);
}
function applyContrast(on){
  document.documentElement.setAttribute("data-contrast", on ? "high" : "normal");
  document.getElementById("contrastBtn").setAttribute("aria-pressed", String(on));
  const p = prefs(); p.contrast = on; savePrefs(p);
}
function applyTheme(mode){
  const root = document.documentElement;
  if(mode === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
  document.querySelectorAll("#themeGroup button").forEach(b=>
    b.setAttribute("aria-pressed", String(b.dataset.theme === mode)));
  const dark = mode === "dark" ||
    (mode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.content = dark ? "#110A21" : "#140A26";
  const p = prefs(); p.theme = mode; savePrefs(p);
}

/* ════════ views ════════ */
function showView(name){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  const v = document.getElementById("view-"+name);
  v.classList.add("active");
  document.querySelectorAll("nav a[data-view]").forEach(a=>
    a.setAttribute("aria-current", a.dataset.view === name ? "page" : "false"));
  if(name === "history") renderHistory();
  if(name === "home") requestAnimationFrame(deckPaint);
  if(name === "summary") renderSummary();
  if(name === "guide" && !document.getElementById("transcript").childElementCount) guideStart();
  if(name !== "test"){ stopClock(); }
  window.scrollTo(0,0);
  v.focus();
  observeReveals();
}

/* ════════ home cards ════════ */
/* ════════ the check-in scenes ════════
   Each check-in gets a small wordless picture of the turn it hopes for,
   drawn in its own light. None of them illustrates the problem — there is
   no rain cloud over Depression, no knot over Anxiety that stays tied.
   Each shows the moment after: the spark lighting, the sun clearing the
   hills, the tangle loosening into a wave, the bud opening, the water
   going still. The turn plays once, when the card first comes into view
   (.in, set by the reveal observer); a slow idle loop follows, and only
   runs while the card is on screen (.live). Every one is aria-hidden —
   the card's label already says everything a screen reader needs. */
/* Each scene is one static drawing (.sc-base, 400x240 units) plus a few
   small layers on top for everything that moves. A layer is placed in the
   drawing's own units by L(): centred on (x, y), w by h. Keeping the moving
   parts as separate HTML layers, rather than groups inside the drawing, is
   what lets the browser animate them on the compositor — see .sc-art. */
const BASE = '<svg class="sc-base" viewBox="0 0 400 240" preserveAspectRatio="none" focusable="false">';
const TOP  = '<svg class="sc-top" viewBox="0 0 400 240" preserveAspectRatio="none" focusable="false">';
function L(cls, x, y, w, h, inner, style){
  return '<span class="sl '+cls+'" style="--x:'+x+';--y:'+y+';--w:'+w+';--h:'+h+(style ? ';'+style : '')+'">'+(inner || '')+'</span>';
}
function box(w, h){ return 'viewBox="'+(-w/2)+' '+(-h/2)+' '+w+' '+h+'" focusable="false"'; }
const SPARKLE = 'M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z';
const SCENES = {
  /* 01 — four questions, a first spark */
  phq4:
    BASE +
      '<defs><radialGradient id="s4g"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".95"/>' +
      '<stop offset=".3" stop-color="#FFC83D" stop-opacity=".42"/><stop offset="1" stop-color="#FF3D8B" stop-opacity="0"/></radialGradient></defs>' +
      '<circle class="s4-glow" cx="200" cy="104" r="124" fill="url(#s4g)"/>' +
    '</svg>' +
    L('s4-orbit', 200, 104, 160, 160,
      '<svg '+box(160,160)+'>' +
        '<circle r="72" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.6" stroke-dasharray="2 8" stroke-linecap="round"/>' +
        '<circle r="44" fill="none" stroke="rgba(255,209,102,.25)" stroke-width="1"/>' +
        '<circle class="s4-dot" cy="-72" r="7" fill="#FF8CC6"/>' +
        '<circle class="s4-dot d2" cx="72" r="7" fill="#C3A6FF"/>' +
        '<circle class="s4-dot d3" cy="72" r="7" fill="#FFD166"/>' +
        '<circle class="s4-dot d4" cx="-72" r="7" fill="#7EE7DC"/>' +
      '</svg>') +
    L('s4-star', 200, 104, 110, 110,
      '<svg class="s4-starpulse" '+box(110,110)+'>' +
        '<path d="M0 -52 C5 -15 15 -5 52 0 C15 5 5 15 0 52 C-5 15 -15 5 -52 0 C-15 -5 -5 -15 0 -52Z" fill="#FFE27A"/>' +
        '<circle r="9" fill="#FFF8DC"/></svg>') +
    L('', 64, 46, 18, 18, '<svg class="s4-twinkle" '+box(18,18)+'><path d="'+SPARKLE+'" fill="#fff"/></svg>') +
    L('', 338, 70, 16, 16, '<svg class="s4-twinkle t2" '+box(18,18)+'><path d="'+SPARKLE+'" fill="#FFD166"/></svg>') +
    L('', 300, 196, 14, 14, '<svg class="s4-twinkle t3" '+box(18,18)+'><path d="'+SPARKLE+'" fill="#FF8CC6"/></svg>'),

  /* 02 — the sun clears the hills */
  phq9:
    BASE +
      '<defs><linearGradient id="s9d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A0F55"/>' +
      '<stop offset=".5" stop-color="#8E2A6B"/><stop offset=".82" stop-color="#F0835A"/><stop offset="1" stop-color="#FFC56B"/></linearGradient></defs>' +
      '<rect class="s9-dawn" width="400" height="240" fill="url(#s9d)"/>' +
      '<g class="s9-stars" fill="#fff"><circle cx="46" cy="30" r="1.6"/><circle cx="112" cy="64" r="1.2"/><circle cx="170" cy="22" r="1.4"/>' +
      '<circle cx="262" cy="48" r="1.2"/><circle cx="330" cy="26" r="1.6"/><circle cx="372" cy="76" r="1.1"/><circle cx="80" cy="100" r="1"/></g>' +
    '</svg>' +
    L('s9-sun', 200, 168, 232, 232,
      '<span class="s9-halo"></span>' +
      '<svg class="s9-rays" '+box(232,232)+'><g stroke="#FFD166" stroke-width="4" stroke-linecap="round">' +
        [0,1,2,3,4,5,6,7,8].map(k=>{ const a = k*40*Math.PI/180, c = Math.cos(a), sn = Math.sin(a);
          return '<line class="s9-ray" pathLength="40" x1="'+(c*52).toFixed(1)+'" y1="'+(sn*52).toFixed(1)+'" x2="'+(c*80).toFixed(1)+'" y2="'+(sn*80).toFixed(1)+'"/>'; }).join("") +
      '</g></svg>' +
      '<svg '+box(232,232)+'><defs><radialGradient id="s9s"><stop offset="0" stop-color="#FFF8D6"/><stop offset=".5" stop-color="#FFD23F"/>' +
      '<stop offset="1" stop-color="#FF8A00"/></radialGradient></defs><circle r="40" fill="url(#s9s)"/></svg>') +
    TOP +
      '<path d="M0 176 C70 150 130 166 200 178 C270 190 330 158 400 168 V240 H0Z" fill="#4A1756"/>' +
      '<path d="M0 198 C80 180 150 206 240 198 C310 192 360 182 400 190 V240 H0Z" fill="#240B3D"/>' +
    '</svg>' +
    L('s9-bird', 25, 60, 50, 24,
      '<svg '+box(50,24)+'><g fill="none" stroke="#2A0F3A" stroke-width="2.2" stroke-linecap="round">' +
      '<path d="M-25 6 q6 -6 12 0 q6 -6 12 0"/><path d="M1 -6 q4 -4 8 0 q4 -4 8 0"/></g></svg>'),

  /* 03 — the tangle loosens into a wave */
  gad7:
    BASE +
      '<defs><radialGradient id="s7g"><stop offset="0" stop-color="#FF8CC6" stop-opacity=".45"/><stop offset="1" stop-color="#FF8CC6" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="200" cy="108" r="140" fill="url(#s7g)"/>' +
      '<path class="s7-tangle" pathLength="1400" fill="none" stroke="#FFB0D6" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" ' +
        'd="M60 120 C90 40 140 190 170 100 C190 40 120 60 150 140 C175 200 230 50 250 110 C265 160 200 170 215 120 C235 60 300 70 290 130 C282 180 330 170 340 110 C348 70 300 80 310 120"/>' +
    '</svg>' +
    '<span class="s7-wave"><svg viewBox="-200 0 800 240" preserveAspectRatio="none" focusable="false">' +
      '<defs><linearGradient id="s7w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF8CC6"/>' +
      '<stop offset=".5" stop-color="#FFD166"/><stop offset="1" stop-color="#C3A6FF"/></linearGradient></defs>' +
      '<path fill="none" stroke="url(#s7w)" stroke-width="5" stroke-linecap="round" ' +
        'd="M-200 108 C-167 78 -133 78 -100 108 S-33 138 0 108 S67 78 100 108 S167 138 200 108 S267 78 300 108 S367 138 400 108 S467 78 500 108 S567 138 600 108"/>' +
    '</svg></span>' +
    '<span class="s7-wave f2"><svg viewBox="-200 0 800 240" preserveAspectRatio="none" focusable="false">' +
      '<path fill="none" stroke="#C3A6FF" stroke-opacity=".5" stroke-width="3" stroke-linecap="round" ' +
        'd="M-200 138 C-167 122 -133 122 -100 138 S-33 154 0 138 S67 122 100 138 S167 154 200 138 S267 122 300 138 S367 154 400 138 S467 122 500 138 S567 154 600 138"/>' +
    '</svg></span>' +
    [[70,200,5,0],[130,214,3.5,-1.2],[182,206,4.5,-3.4],[236,220,3,-2.1],[288,204,5.5,-4.6],[334,216,3.5,-.6],[372,208,4,-5.4]]
      .map(b=> L('s7-bub', b[0], b[1], b[2]*2, b[2]*2, '', 'animation-delay:'+b[3]+'s')).join(""),

  /* 04 — five petals, and the bud opens (WHO-5 is five questions about
     what is going right) */
  who5:
    BASE +
      '<defs><radialGradient id="s5h"><stop offset="0" stop-color="#FFE27A" stop-opacity=".6"/><stop offset="1" stop-color="#FF3D8B" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="200" cy="100" r="124" fill="url(#s5h)"/>' +
      '<path d="M200 244 C194 204 208 170 200 124" fill="none" stroke="#86E3B4" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M202 192 C220 176 240 178 248 186 C234 200 214 200 202 192Z" fill="#6FD3A0"/>' +
      '<path d="M199 214 C182 200 162 202 154 210 C168 224 188 222 199 214Z" fill="#5CC393"/>' +
    '</svg>' +
    L('s5-head', 200, 102, 170, 170,
      '<svg '+box(170,170)+'>' +
        '<defs><linearGradient id="s5a" x1="0" y1="0" x2="0" y2="-72" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FF3D8B"/><stop offset="1" stop-color="#FFC2DD"/></linearGradient>' +
        '<linearGradient id="s5b" x1="0" y1="0" x2="0" y2="-72" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FF9F1C"/><stop offset="1" stop-color="#FFE9A0"/></linearGradient>' +
        '<radialGradient id="s5c"><stop offset="0" stop-color="#FFFBE3"/><stop offset=".5" stop-color="#FFD83F"/><stop offset="1" stop-color="#FF9F1C"/></radialGradient></defs>' +
        [0,1,2,3,4].map(k=>'<g transform="rotate('+(k*72)+')"><path class="s5-petal p'+(k+1)+'" d="M0 -6 C27 -24 29 -58 0 -76 C-29 -58 -27 -24 0 -6Z" fill="url(#'+(k%2 ? 's5b' : 's5a')+')"/></g>').join("") +
        '<circle r="16" fill="url(#s5c)"/>' +
      '</svg>') +
    [[-40,0],[30,-1.5],[-12,-3],[52,-4.2],[8,-2.4]]
      .map(q=> L('s5-pollen', 200+q[0], 92, 4.4, 4.4, '', 'animation-delay:'+q[1]+'s')).join(""),

  /* 05 — the drop lands, and the water goes still */
  auditc:
    BASE +
      '<defs><linearGradient id="s3w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1F5A94"/><stop offset="1" stop-color="#0A1A3A"/></linearGradient>' +
      '<radialGradient id="s3m"><stop offset="0" stop-color="#CFFAF4" stop-opacity=".6"/><stop offset="1" stop-color="#7EE7DC" stop-opacity="0"/></radialGradient></defs>' +
      '<circle class="s3-moon" cx="306" cy="58" r="48" fill="url(#s3m)"/>' +
      '<circle class="s3-moon" cx="306" cy="58" r="15" fill="#E8FFFB"/>' +
      '<g fill="#fff" opacity=".7"><circle cx="60" cy="34" r="1.3"/><circle cx="128" cy="70" r="1"/><circle cx="210" cy="30" r="1.2"/><circle cx="360" cy="112" r="1"/></g>' +
      '<rect y="150" width="400" height="90" fill="url(#s3w)"/>' +
      '<path d="M0 150 H400" stroke="#7EE7DC" stroke-opacity=".5" stroke-width="1.5"/>' +
    '</svg>' +
    L('s3-shimmer', 306, 163.5, 36, 3, '', 'opacity:.75') +
    L('s3-shimmer m2', 306, 177.5, 24, 3, '', 'opacity:.55') +
    L('s3-shimmer', 307, 191.25, 14, 2.5, '', 'opacity:.4') +
    L('s3-ring', 200, 150, 60, 14) +
    L('s3-ring r2', 200, 150, 60, 14) +
    L('s3-ring r3', 200, 150, 60, 14) +
    L('s3-drop', 200, 50, 24, 36,
      '<svg viewBox="-12 -15 24 36" focusable="false"><path d="M0 -14 C7 -3 11 4 11 9 A11 11 0 0 1 -11 9 C-11 4 -7 -3 0 -14Z" fill="#CFFAF4"/></svg>')
};

function renderCards(){
  const grid = document.getElementById("cardGrid");
  grid.innerHTML = "";
  ORDER.forEach((id,i)=>{
    const t = T.inst[id];
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card reveal sc-" + id;
    card.dataset.delay = "1";
    card.style.setProperty("--i", i);
    /* The plain words were always here — "Depression", "Anxiety", "Alcohol
       use" — sitting in small type ABOVE a code set in the largest text on
       the card. A person cannot tell PHQ-9 from AUDIT-C, and should not
       have to. So the hierarchy is swapped rather than rewritten: the
       subject leads, the symptoms it asks about follow so a reader can
       recognise themselves, and the instrument drops to a credit line at
       the foot — where it still reassures the patient that this is a real
       questionnaire and tells a clinician exactly which one was used. */
    const about = (t.about || "");
    const tagParts = String(t.tag).split(/\s+·\s+/);
    card.setAttribute("aria-label", t.tag + (about ? " — " + about : "") + ". " + t.meta + ". " + T.ui.start);
    /* spans throughout, not h3/p: a <button> may only hold phrasing
       content, and the aria-label above already names the whole card */
    card.innerHTML =
      '<span class="sc-art" aria-hidden="true" data-scene="'+id+'"></span>'+
      '<span class="sc-body">'+
        '<span class="sc-num">'+String(i+1).padStart(2,"0")+'</span>'+
        /* "Quick Check · Start Here": the part after the dot is advice,
           not the name, so it becomes a small gold badge above the title
           rather than a second line of it */
        (tagParts.length > 1 ? '<span class="sc-badge">'+esc(tagParts.slice(1).join(" · "))+'</span>' : '')+
        '<span class="sc-title">'+esc(tagParts[0])+'</span>'+
        (about ? '<span class="about">'+esc(about)+'</span>' : '')+
        '<span class="sc-foot">'+
          '<span class="credit">'+esc(t.name)+' · '+esc(t.meta)+'</span>'+
          '<span class="go">'+esc(T.ui.start)+' →</span>'+
        '</span>'+
      '</span>'+
      '<span class="sc-dim" aria-hidden="true"></span>';
    card.addEventListener("click", ()=> startTest(id));
    grid.appendChild(card);
  });
  observeReveals();
  observeScenes();
  /* next frame, not now: reading positions here forced a full layout in
     the middle of boot, only for the rest of boot to invalidate it */
  requestAnimationFrame(deckPaint);
}

/* ════════ the scenes are drawn just before they are needed ════════
   The five pictures are about 190 elements between them, all below the
   fold, and building them in the same breath as the page cost the first
   load a full extra restyle on a slow phone. So each card is built at once
   with its words and its Start button, and its picture is drawn in when
   the card comes within a screen and a half of view — or when the browser
   is next idle, whichever is sooner — so it is always there, finished,
   before anyone scrolls to it, and its one-time turn still plays on
   arrival. */
let sceneIO = null;
function fillScene(art){
  if(!art || art.childElementCount) return;
  art.innerHTML = SCENES[art.dataset.scene] || "";
  if(sceneIO) sceneIO.unobserve(art);
}
function observeScenes(){
  const arts = document.querySelectorAll("#cardGrid .sc-art[data-scene]");
  if(!("IntersectionObserver" in window)){ arts.forEach(fillScene); return; }
  if(!sceneIO){
    sceneIO = new IntersectionObserver(es=> es.forEach(e=>{ if(e.isIntersecting) fillScene(e.target); }),
                                       { rootMargin:"0px 0px 150% 0px" });
  }
  arts.forEach(a=> sceneIO.observe(a));
  const later = ()=> document.querySelectorAll("#cardGrid .sc-art[data-scene]").forEach(fillScene);
  if(window.requestIdleCallback) requestIdleCallback(later, { timeout:4000 });
  else setTimeout(later, 1500);
}

/* ════════ the deck ════════
   The cards are position:sticky, so the stacking itself is plain CSS. This
   does the two things CSS cannot:

   · the card being covered steps back — it shrinks a little and dims as
     the next one slides over it, instead of simply being overdrawn;
   · only the card in front is .live. Its scene loops; every card stacked
     underneath holds still, because nobody can see it moving. (An
     IntersectionObserver used to decide this, but a stuck card is still
     "on screen" underneath the one covering it, so with the last card in
     front all five were animating at once.)

   Every position is read before anything is written, so the loop never
   forces a second layout inside a frame, and the two values it writes —
   the card's own `scale` and its dimming layer's `opacity` — are set on
   exactly the element they change. The first version wrote an inherited
   custom property instead, which restyled every node of a card's scene on
   every scroll frame. Called on scroll (rAF-gated), on resize, whenever
   the cards are rendered, and when the home view is shown. */
let deckTicking = false;
function deckPaint(){
  deckTicking = false;
  const home = document.getElementById("view-home");
  if(!home || !home.classList.contains("active")) return;
  const cards = document.querySelectorAll("#cardGrid .card");
  const n = cards.length;
  if(!n) return;
  const tops = [], hs = [];
  for(let i = 0; i < n; i++){ tops.push(cards[i].getBoundingClientRect().top); hs.push(cards[i].offsetHeight || 1); }
  const vh = window.innerHeight;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  for(let i = 0; i < n; i++){
    const c = cards[i];
    const cover = i < n-1 ? Math.min(1, Math.max(0, (tops[i] + hs[i] - tops[i+1]) / hs[i])) : 0;
    const onScreen = tops[i] < vh && tops[i] + hs[i] > 0;
    c.classList.toggle("live", onScreen && cover < .8);
    if(still) continue;
    const v = cover.toFixed(3);
    if(c.dataset.cover === v) continue;
    c.dataset.cover = v;
    c.style.scale = cover ? (1 - cover * .06).toFixed(4) : "";
    const dim = c.querySelector(".sc-dim");
    if(dim) dim.style.opacity = (cover * .55).toFixed(3);
  }
}
addEventListener("scroll", ()=>{ if(!deckTicking){ deckTicking = true; requestAnimationFrame(deckPaint); } }, { passive:true });
addEventListener("resize", deckPaint, { passive:true });

/* The sky's own loops — the sun turning, its halo breathing, the shooting
   star — stop once the sky has scrolled out of sight. They run on the
   compositor either way, but a layer nobody can see is still work for the
   GPU and the battery. */
(function skyRest(){
  const sky = document.getElementById("heroSky");
  if(!sky || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(es=> es.forEach(e=> sky.classList.toggle("rest", !e.isIntersecting)))
    .observe(sky);
})();

/* ════════ the sunrise, where CSS cannot drive it ════════
   Browsers with scroll timelines lift the sun in CSS alone. For the rest,
   the same effect from one number: how far the sky has left the screen,
   written as --rise on the sky element only, so nothing else restyles. */
(function heroRise(){
  const sky = document.getElementById("heroSky");
  if(!sky) return;
  if(window.CSS && CSS.supports && CSS.supports("animation-timeline: view()")) return;
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let ticking = false;
  function paint(){
    ticking = false;
    /* 0 while the top of the sky is still on screen, 1 once all of it has
       scrolled past — the same span as the CSS "exit" range */
    const r = sky.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height || 1)));
    sky.style.setProperty("--rise", p.toFixed(3));
  }
  addEventListener("scroll", ()=>{ if(!ticking){ ticking = true; requestAnimationFrame(paint); } }, { passive:true });
  paint();
})();

/* The little scroll cue at the foot of the sky goes to the check-ins
   without writing #checkins into the address bar — a reload on that URL
   would otherwise be read as a deep link and skip the opening. */
document.getElementById("hsCue").addEventListener("click", e=>{
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("checkins").scrollIntoView({ behavior: reduce ? "instant" : "smooth", block:"start" });
});

/* ════════ reveal-on-scroll — 14px / 350ms / power1.out, ≤8 stagger ════════ */
let revealIO = null;
const REVEAL_OK = "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(REVEAL_OK) document.documentElement.classList.add("reveal-ready");

function observeReveals(){
  if(!REVEAL_OK) return;
  if(!revealIO){
    revealIO = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){ en.target.classList.add("in"); revealIO.unobserve(en.target); }
      });
    }, { rootMargin:"0px 0px -10% 0px", threshold:0.01 });
  }
  document.querySelectorAll(".reveal:not(.in)").forEach(el=> revealIO.observe(el));
}
/* The 24-dot row is gone. It was aria-hidden and carried no caption, so the
   ratio it was supposed to encode reached nobody who did not already know
   it: decoration wearing the costume of a statistic. Labelling it would
   have meant asserting a figure this page does not cite, so it goes
   instead. The treatment-gap number it gestured at is stated, with its
   source, further down the page and in the manifesto. */

/* ════════ test flow ════════ */
function optsFor(id, qi){
  const t = T.inst[id];
  return META[id].perQuestionOpts
    ? t.optsets[qi].map((label,i)=>[label,i])
    : t.opts.map((label,i)=>[label,i]);
}

function startTest(id){
  const t = T.inst[id];
  current = { id, answers:new Array(t.q.length).fill(null), idx:0, t0:Date.now(), goingBack:false };
  document.getElementById("testTag").textContent = t.tag + " · " + t.name;
  document.getElementById("testIntro").textContent = t.intro;
  document.getElementById("testPeriod").textContent = t.period;
  startClock();
  /* The primer sits between setup and the first question. It reuses this
     same view, so there is no new route and the token bar and Cancel are
     the ones already here. Counts and duration are read from the
     instrument itself, so the panel cannot drift out of sync with it.
     Shown the first time each instrument is opened, not on every run —
     a person taking PHQ-9 weekly does not need telling four times. */
  if(primerSeen(id)){
    document.getElementById("primer").hidden = true;
    document.querySelector(".tokenbar").hidden = false;
    document.querySelector(".actionrow").hidden = false;
    renderQ();
  } else {
    showPrimer(id);
  }
  showView("test");
}

const PRIMER_KEY = "psych-seen-primer";
function primerSeen(id){
  try{ return (JSON.parse(localStorage.getItem(PRIMER_KEY)) || []).includes(id); }
  catch(e){ return true; }
}
function primerMark(id){
  try{
    const a = JSON.parse(localStorage.getItem(PRIMER_KEY)) || [];
    if(!a.includes(id)){ a.push(id); localStorage.setItem(PRIMER_KEY, JSON.stringify(a)); }
  }catch(e){}
}
/* `T.ui.x || ""` is never right for a list item. The four primer strings
   exist in en and hi only, so in the other four languages this panel — the
   one built specifically to stop people being confused — rendered three
   empty <li>, and their ::before dots still painted: a heading, three
   orphan dots, and two buttons. Fall back to English, which is what the
   rest of the untranslated page already does, and hide the row only if
   even that is missing. */
function primerText(key){
  if(typeof T.ui[key] === "string") return T.ui[key];
  const en = window.I18N && window.I18N.en;
  return en && typeof en.ui[key] === "string" ? en.ui[key] : "";
}
function fillLi(id, key){
  const el = document.getElementById(id), v = primerText(key);
  el.textContent = v;
  el.hidden = !v;
}
function showPrimer(id){
  const t = T.inst[id];
  /* English is not guaranteed loaded for a Hindi reader — one language is
     the whole point of the split — so fetch it if the fallback needs it,
     the same way the clinical sheet does. */
  if(typeof T.ui.primerPrivate !== "string" && !(window.I18N && window.I18N.en)){
    loadLang("en", ()=> showPrimer(id));
  }
  document.getElementById("primerHead").textContent = t.meta;
  fillLi("primerPrivate", "primerPrivate");
  fillLi("primerGet",     "primerGet");
  fillLi("primerNot",     "primerNot");
  document.getElementById("primerStart").textContent   = T.ui.start;
  document.getElementById("primerBack").textContent    = primerText("primerBack") || T.ui.cancel;
  document.getElementById("primer").hidden = false;
  document.getElementById("qcard").innerHTML = "";
  document.getElementById("progress").textContent = "";
  document.getElementById("testHead").style.display = "none";
  /* The token chip, the progress rail and the Back/Cancel row all describe
     a question that is not on screen yet — an empty numbered box and a
     zero-length bar read as something failing to load. They come back with
     the first question. Back/Cancel would also be a third and fourth way
     to leave a panel that already offers one. */
  document.querySelector(".tokenbar").hidden = true;
  document.querySelector(".actionrow").hidden = true;
  setTimeout(()=> document.getElementById("primerStart").focus(), 80);
}
document.getElementById("primerStart").addEventListener("click", ()=>{
  if(!current) return;
  primerMark(current.id);
  document.getElementById("primer").hidden = true;
  document.querySelector(".tokenbar").hidden = false;
  document.querySelector(".actionrow").hidden = false;
  renderQ();
  setTimeout(()=>{ const b=document.querySelector("#qcard .bigopts button"); if(b) b.focus(); }, 60);
});
document.getElementById("primerBack").addEventListener("click", ()=>{
  /* Same exit the Cancel button takes — going back to the list before you
     have answered anything is not a cancellation worth ceremony. */
  document.getElementById("primer").hidden = true;
  stopClock(); current = null; showView("home");
});

/* elapsed clock — quiet, monospace, no pressure; feeds the results reveal */
let clockTimer = null;
function mmss(ms){
  const s = Math.max(0, Math.round(ms/1000));
  return Math.floor(s/60) + ":" + String(s%60).padStart(2,"0");
}
function startClock(){
  stopClock();
  const el = document.getElementById("tkClock");
  const tick = ()=>{ if(current) el.textContent = mmss(Date.now() - current.t0); };
  tick();
  clockTimer = setInterval(tick, 1000);
}
function stopClock(){ if(clockTimer){ clearInterval(clockTimer); clockTimer = null; } }

function readQuestionAloud(text){
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const langMap = { en:'en-IN', hi:'hi-IN', mr:'mr-IN', bn:'bn-IN', ta:'ta-IN', te:'te-IN' };
  /* LANG is the app's language variable, set by setLang. The name this line
     used before — currentLang — was never declared anywhere in the repo, so
     every tap of the speaker threw a ReferenceError inside its own click
     handler and the button silently did nothing, in all six languages. */
  utter.lang = langMap[LANG] || 'en-IN';
  utter.rate = 0.92;
  /* Some of these voices are not installed on every phone, and a silent
     button is indistinguishable from a broken one — which is exactly how
     this feature spent its whole life. Mark it while it runs. */
  const btn = document.getElementById("qSpeakBtn");
  if(btn){
    utter.onstart = ()=> btn.classList.add("speaking");
    utter.onend   = ()=> btn.classList.remove("speaking");
    utter.onerror = ()=> btn.classList.remove("speaking");
  }
  window.speechSynthesis.speak(utter);
}

function renderQ(){
  const t = T.inst[current.id], i = current.idx, n = t.q.length;
  const opts = optsFor(current.id, i);
  document.getElementById("testTag").textContent = t.tag + " · " + t.name;
  document.getElementById("testTitle").textContent = t.name;
  document.getElementById("testIntro").textContent = t.intro;
  document.getElementById("testPeriod").textContent = t.period;
  /* the OPD-token motif: your place in the queue, counting up as you go */
  document.getElementById("tokenNo").textContent =
    T.ui.tokenLabel + " " + String(i+1).padStart(2,"0") + "/" + String(n).padStart(2,"0");
  document.getElementById("pfill").style.width = (i/n*100) + "%";
  document.getElementById("progress").textContent =
    fmt(T.ui.qOf,{i:i+1,n}) +
    /* "(or press 1-4)" is help on a keyboard and noise on a phone, where it
       sits under an answer list that has no numbers on it any more. */
    (matchMedia("(pointer: coarse)").matches ? "" : " — " + fmt(T.ui.tapOrPress,{k:opts.length}));
  document.getElementById("backBtn").style.visibility = i === 0 ? "hidden" : "visible";
  /* the intro only earns screen space on the first question */
  document.getElementById("testHead").style.display = i === 0 ? "" : "none";

  const card = document.createElement("div");
  card.className = "qbox" + (current.goingBack ? " back" : "");
  current.goingBack = false;
  /* The speaker sits after the question, not inside it. #qLabel is the
     radiogroup's aria-labelledby target, so anything in there is read out as
     part of the answer group's name — a screen reader was announcing
     "Over the last two weeks... Listen to question". */
  const speechAvail = ('speechSynthesis' in window);
  const listen = T.ui.listen || "Listen to this question";
  /* An inline SVG rather than the 🔊 emoji: the rest of the page draws its
     icons this way, and an emoji renders as a different picture on every
     platform. The word beside it is what makes it read as a control at all
     — a bare glyph under a question looks like a typo. */
  const speechBtn = speechAvail
    ? '<button type="button" class="qspeak-btn" id="qSpeakBtn" aria-label="'+esc(listen)+'">'
      + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h3l5-4v14l-5-4H4z"/>'
      + '<path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>'
      + '<span>'+esc(listen)+'</span></button>'
    : '';
  card.innerHTML = '<p class="qtext" id="qLabel"><span class="qnum">Q'+(i+1)+'</span>'+esc(t.q[i])+'</p>'+speechBtn;
  if(speechAvail){
    const sb = card.querySelector("#qSpeakBtn");
    if(sb) sb.addEventListener("click", (e)=>{ e.stopPropagation(); readQuestionAloud(t.q[i]); });
  }
  const group = document.createElement("div");
  group.className = "bigopts";
  group.setAttribute("role","radiogroup");
  group.setAttribute("aria-labelledby","qLabel");
  opts.forEach(([label,val],oi)=>{
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role","radio");
    b.setAttribute("aria-checked", String(current.answers[i] === val));
    b.tabIndex = (current.answers[i] === val || (current.answers[i] === null && oi === 0)) ? 0 : -1;
    b.innerHTML = '<span class="kbd" aria-hidden="true">'+(oi+1)+'</span>'+esc(label);
    b.addEventListener("click", ()=> selectOpt(val,b));
    b.addEventListener("keydown", ev=>{
      const btns = [...group.querySelectorAll("button")];
      const k = btns.indexOf(b);
      let next = null;
      if(ev.key === "ArrowDown" || ev.key === "ArrowRight") next = btns[(k+1)%btns.length];
      if(ev.key === "ArrowUp"   || ev.key === "ArrowLeft")  next = btns[(k-1+btns.length)%btns.length];
      if(next){ ev.preventDefault(); btns.forEach(x=>x.tabIndex=-1); next.tabIndex = 0; next.focus(); }
    });
    group.appendChild(b);
  });
  card.appendChild(group);
  const holder = document.getElementById("qcard");
  holder.innerHTML = "";
  holder.appendChild(card);
}

function selectOpt(val, btn){
  if(advancing) return;
  advancing = true;
  current.answers[current.idx] = val;
  btn.parentElement.querySelectorAll("button").forEach(b=>{
    b.setAttribute("aria-checked","false"); b.classList.remove("picked");
  });
  btn.setAttribute("aria-checked","true");
  btn.classList.add("picked");
  /* The pause is here so the answer is seen to register before the next
     question replaces it — .picked runs a 320ms flash and this cuts in at
     240ms, part-way through, which is the beat that makes the tap feel
     acknowledged rather than swallowed.

     None of that applies when the reader has asked for no animation:
     .picked is set to animation:none for them, so the wait is 240ms of a
     motionless screen, nine times over in a PHQ-9. They get the aria
     state change immediately and the next question straight after. */
  setTimeout(()=>{
    advancing = false;
    const n = T.inst[current.id].q.length;
    /* The self-harm item, endorsed at any level, interrupts here — before
       the next question and before any score. The answer is already in
       current.answers, so nothing is lost whichever way they go. */
    const meta = META[current.id];
    if(meta && meta.safetyIdx === current.idx && val > 0){ showSafeNow(); return; }
    if(current.idx < n-1){ current.idx++; renderQ(); document.querySelector("#qcard button").focus(); }
    else scoreTest();
  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 60 : 240);
}

document.addEventListener("keydown", e=>{
  if(!current || !document.getElementById("view-test").classList.contains("active")) return;
  if(e.target.matches("input,select,textarea")) return;
  const k = parseInt(e.key,10);
  const btns = document.querySelectorAll("#qcard .bigopts button");
  if(k >= 1 && k <= btns.length) btns[k-1].click();
});

/* The same three numbers the crisis strip carries, as full-width targets.
   crisisLinesHTML separates with <br>; here each one is its own block so it
   is a 48px thing to hit rather than a line of text to aim at. */
function dialLines(){
  return [["tel:14416", T.ui.lineTelemanas],
          ["tel:18005990019", T.ui.lineKiran],
          ["tel:112", T.ui.lineEmergency]]
    .map(([href,label])=> '<a href="'+href+'">'+esc(label||href.replace("tel:",""))+'</a>')
    .join("");
}

/* Shown at the moment of disclosure. Deliberately not a modal trap: a
   person mid-crisis should never have to defeat a dialog to reach a phone
   number, and the crisis strip at the top of every page stays reachable
   throughout. */
function showSafeNow(){
  const box = document.getElementById("safeNow");
  document.getElementById("safeNowLines").innerHTML = dialLines();
  document.getElementById("qcard").innerHTML = "";
  document.getElementById("progress").textContent = "";
  document.querySelector(".tokenbar").hidden = true;
  document.querySelector("#view-test .actionrow").hidden = true;
  box.hidden = false;
  setTimeout(()=> document.getElementById("safeNowHelp").focus(), 80);
}
function hideSafeNow(){
  document.getElementById("safeNow").hidden = true;
  document.querySelector(".tokenbar").hidden = false;
  document.querySelector("#view-test .actionrow").hidden = false;
}
document.getElementById("safeNowGo").addEventListener("click", ()=>{
  if(!current) return;
  hideSafeNow();
  const n = T.inst[current.id].q.length;
  if(current.idx < n-1){ current.idx++; renderQ();
    const b = document.querySelector("#qcard button"); if(b) b.focus(); }
  else scoreTest();
});
document.getElementById("safeNowHelp").addEventListener("click", ()=>{
  hideSafeNow();
  /* Leaving mid-screener is allowed and costs them nothing: the answers so
     far are not scored, because a partial screener has no valid score. */
  stopClock(); current = null;
  showView("resources");
});

function scoreTest(){
  const id = current.id, meta = META[id], t = T.inst[id];
  let score = 0, safetyFlag = false;
  current.answers.forEach((v,i)=>{
    score += v;
    if(meta.safetyIdx === i && v > 0) safetyFlag = true;
  });
  const bi = meta.bands.findIndex(([lo,hi])=> score >= lo && score <= hi);
  const sev = meta.bands[bi][2];
  stopClock();
  lastResult = {
    inst:id, score, sev, bandIdx:bi, safetyFlag, elapsedMs:Date.now() - current.t0,
    date:new Date().toISOString(), rescreenDays:RESCREEN_DAYS[sev]
  };
  /* Item-level answers are stored, not just the total. A clinician can do
     very little with "PHQ-9 = 14"; the same 14 built from sleep and appetite
     is a different consultation from one built from hopelessness and
     anhedonia. This is the whole point of the clinical summary. */
  lastResult.answers = current.answers.slice();
  saveEntry({ inst:id, score, sev, bandIdx:bi, safetyFlag, date:lastResult.date,
              ans:current.answers.slice() });
  renderResults(true);
  showView("results");
}

function renderResults(animate){
  const r = lastResult, meta = META[r.inst], t = T.inst[r.inst];
  const label = t.bands[r.bandIdx];
  document.getElementById("resTitle").textContent = fmt(T.ui.resultTitle,{name:t.name});
  document.getElementById("printHead").textContent = fmt(T.ui.printHead,{
    name:t.name, date:dateStr(r.date,{day:"numeric",month:"long",year:"numeric"})
  });
  document.getElementById("resOf").textContent = fmt(T.ui.resultOf,{max:meta.max});
  const bandEl = document.getElementById("resBand");
  bandEl.textContent = label;
  bandEl.className = "band b"+r.sev;
  /* "Mild depression" sitting alone beside a score reads as a diagnosis.
     The label itself is the instrument's own severity band — PHQ-9's are
     Kroenke and Spitzer's exact wording — so it is preserved word for
     word and framed instead: a statement about which range the answers
     fell in, which is the only thing a screener can actually say. */
  const lead = document.getElementById("resBandLead");
  if(lead) lead.textContent = fmt(T.ui.bandLead || "Your answers fall in the range {name} calls:", {name:t.name});

  let extra = "";
  if(r.inst === "auditc") extra = T.ui.noteAuditc;
  if(r.inst === "phq4")   extra = T.ui.notePhq4;
  if(r.inst === "who5")   extra = T.ui.noteWho5;
  document.getElementById("resMeaning").textContent = T.ui.meanings[r.sev] + extra;
  document.getElementById("safetyBox").style.display = r.safetyFlag ? "block" : "none";

  document.getElementById("accStepsSum").textContent  = T.ui.whatToDo;
  document.getElementById("accDoctorSum").textContent = T.ui.doctorTitle;
  document.getElementById("resSteps").innerHTML  = T.guidance[r.sev].map(s=>"<li>"+esc(s)+"</li>").join("");
  document.getElementById("resDoctor").innerHTML = T.ui.doctorPoints.map(s=>"<li>"+s+"</li>").join("");

  /* the moment the manifesto's argument lands: how long you gave yourself,
     against the <5 minutes an overloaded OPD can actually spare */
  const tc = document.getElementById("timeCard");
  /* only when the time is genuinely considered — praising a 6-second
     click-through as "unhurried attention" would be false */
  if(r.elapsedMs && r.elapsedMs > 25000){
    document.getElementById("timeTaken").textContent   = fmt(T.ui.timeTaken,{t:mmss(r.elapsedMs)});
    document.getElementById("timeContext").textContent = T.ui.timeContext;
    tc.style.display = "";
  } else tc.style.display = "none";

  const d = new Date(); d.setDate(d.getDate() + r.rescreenDays);
  document.getElementById("resRescreen").innerHTML =
    "<b>"+esc(fmt(T.ui.rescreenOn,{date:dateStr(d,{weekday:"long",day:"numeric",month:"long"})}))+"</b> " +
    esc(fmt(T.ui.rescreenTail,{n:r.rescreenDays}));

  renderSevScale(r.inst, r.score);
  applyIntroTailoring();
  if(animate) animateScore(r.score); else document.getElementById("resScore").textContent = r.score;

  const wp = document.getElementById("wellbeingsPanel");
  if(WELLBEINGS_URL){
    const url = new URL(WELLBEINGS_URL);
    url.searchParams.set("ref", "psych-screener");
    url.searchParams.set("band", String(r.sev));
    document.getElementById("wellbeingsLink").href = url.toString();
    wp.hidden = false;
  } else wp.hidden = true;
}

function renderSevScale(id, score){
  const meta = META[id], total = meta.max + 1;
  const segs = meta.bands.map(([lo,hi,sev])=>({ w:(hi-lo+1)/total*100, sev, lo, hi }));
  const pos = Math.min(98.5, Math.max(1.5, (score+0.5)/total*100));
  document.getElementById("sevScale").innerHTML =
    '<div class="sevmarker" style="left:'+pos.toFixed(2)+'%;"><span>'+score+'</span><div class="sevtri"></div></div>' +
    '<div class="sevtrack">'+segs.map(s=>'<div class="sevseg s'+s.sev+'" style="width:'+s.w.toFixed(2)+'%"></div>').join("")+'</div>' +
    '<div class="sevlabels">'+segs.map(s=>'<div style="width:'+s.w.toFixed(2)+'%">'+s.lo+'–'+s.hi+'</div>').join("")+'</div>';
}

function animateScore(target){
  const el = document.getElementById("resScore");
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches || target === 0){ el.textContent = target; return; }
  const t0 = performance.now(), dur = 650;
  (function tick(t){
    const p = Math.min(1,(t-t0)/dur);
    el.textContent = Math.round(target * (1 - Math.pow(1-p,3)));
    if(p < 1) requestAnimationFrame(tick);
  })(t0);
}

/* ════════ .ics reminder ════════ */
function downloadReminder(){
  if(!lastResult) return;
  const t = T.inst[lastResult.inst], meta = META[lastResult.inst];
  const d = new Date(); d.setDate(d.getDate() + lastResult.rescreenDays);
  const stamp = d.toISOString().slice(0,10).replace(/-/g,"");
  const now = new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z";
  const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Ronak//EN","BEGIN:VEVENT",
    "UID:"+Date.now()+"@psych-screener","DTSTAMP:"+now,"DTSTART;VALUE=DATE:"+stamp,
    "SUMMARY:"+t.name+" — "+T.ui.histEyebrow,
    "DESCRIPTION:"+T.ui.whyRescreen.replace(/[,;\\]/g,"\\$&").slice(0,400)+" ("+lastResult.score+"/"+meta.max+")",
    "BEGIN:VALARM","TRIGGER:-PT1H","ACTION:DISPLAY","DESCRIPTION:"+t.name,"END:VALARM",
    "END:VEVENT","END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics],{type:"text/calendar"}));
  a.download = "rescreen-reminder.ics"; a.click();
  URL.revokeObjectURL(a.href);
}

/* ════════ clinical summary ════════
   Provenance is deliberately in English and deliberately unflattering.
   A clinician who cannot see an instrument's limits cannot weigh its
   output, so the sheet states the operating characteristics and the one
   place where this app knowingly departs from the published scoring. */
const PROV = {
  phq9: {
    full:"PHQ-9 — Patient Health Questionnaire-9",
    domain:"Depression",
    cut:"≥10",
    bands:"5 / 10 / 15 / 20 = mild / moderate / moderately severe / severe",
    ops:"88% sensitivity and 88% specificity at ≥10 in the original validation (Kroenke, Spitzer & Williams, J Gen Intern Med 2001; n=6,000). An individual-participant-data meta-analysis of 100 studies and 44,503 participants confirms 0.85 / 0.85 at the same cut point (Levis et al., BMJ 2019). Administered by non-specialist health workers in Kerala primary care: AUC 0.92, sensitivity 82.5%, specificity 90.1%.",
    lic:"Public domain. No permission required."
  },
  gad7: {
    full:"GAD-7 — Generalised Anxiety Disorder-7",
    domain:"Anxiety",
    cut:"≥10",
    bands:"5 / 10 / 15 = mild / moderate / severe",
    ops:"89% sensitivity and 82% specificity at the optimal cut point in the original validation (Spitzer et al., Arch Intern Med 2006; n=2,740). A 2025 Cochrane review across 48 studies reports acceptable-to-good accuracy; pooled analyses support cut points of 7–10.",
    lic:"Public domain. No permission required."
  },
  phq4: {
    full:"PHQ-4 — ultra-brief combined screen",
    domain:"Depression and anxiety, triage only",
    cut:"≥6",
    bands:"3 / 6 / 9 = mild / moderate / severe",
    ops:"Validated in 2,149 patients (Kroenke et al., Psychosomatics 2009). A JAMA individual-participant meta-analysis found two-stage screening — brief screen, then full PHQ-9 — retains sensitivity while cutting respondent burden by more than half (Levis et al., JAMA 2020).",
    lic:"Public domain. No permission required.",
    caveat:"This is a triage instrument. It indicates whether a fuller screen is warranted; it does not itself estimate severity."
  },
  who5: {
    full:"WHO-5 — World Health Organization Well-Being Index",
    domain:"Well-being (positively framed)",
    cut:"≤50 on the 0–100 scale, i.e. a raw score of 12 or below",
    bands:"Raw 0–25, multiplied by 4 for the 0–100 percentage. 18+ / 13–17 / 7–12 / 0–6 = good / moderate / low / very low",
    ops:"Reported as free to use and among the most widely applied well-being measures in mental health settings (Lara-Cabrera et al., J Adv Nurs 2020). A cut-off below 50 identified psychological symptoms with 84% sensitivity and 59% specificity, AUC 0.82, in a validation of the Farsi version (Mortazavi et al., 2015).",
    lic:"Free to use. Derived from WHO material; this project is not affiliated with, endorsed by, or connected to the World Health Organization.",
    /* The direction reversal is the single most likely thing to be misread
       on a sheet full of instruments that run the other way. */
    caveat:"This scale runs opposite to the others here: it measures well-being, so a HIGH score is good and the screen is positive at or below the cut point. It is not a diagnostic depression screen — a low score indicates poor well-being and warrants a fuller assessment, not a diagnosis."
  },
  auditc: {
    full:"AUDIT-C — WHO-derived alcohol consumption screen",
    domain:"Hazardous alcohol use",
    cut:"≥4",
    bands:"3 / 4 / 8 = low risk / increasing risk / higher risk",
    ops:"AUC 0.891 for detecting heavy drinking, marginally better than the full 10-item AUDIT (Bush et al., Arch Intern Med 1998).",
    lic:"Derived from the WHO AUDIT. This project is not affiliated with, endorsed by, or connected to the World Health Organization.",
    /* An honest disclosure rather than a silent divergence: the published
       thresholds are sex-specific, and this app does not ask the patient's
       sex because it collects nothing it does not need. The consequence
       falls on women, so it is stated plainly where a clinician will see it. */
    caveat:"The published thresholds are sex-specific — ≥4 in men, ≥3 in women. This screener applies ≥4 to everyone because it does not ask the patient's sex. It therefore under-flags women: a score of 3 in a female patient should be read as a positive screen."
  }
};

function buildSheet(r){
  const meta = META[r.inst], t = T.inst[r.inst], p = PROV[r.inst];
  const en = window.I18N.en, ten = en.inst[r.inst];
  const bi = r.bandIdx, band = t.bands[bi], bandEn = ten.bands[bi];
  /* fresh results carry `answers`; entries read back from storage carry `ans` */
  const ans = r.answers || r.ans || [];
  const crossed = meta.inverse ? r.score <= meta.cutoff : r.score >= meta.cutoff;
  const dt = new Date(r.date);
  const dstr = dt.toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
  const bilingual = LANG !== "en";
  let h = "";

  h += '<div class="sh-top">'
     +   '<div class="sh-kicker">Clinical summary · self-administered screen · not a diagnosis</div>'
     +   "<h2>"+esc(p.full)+"</h2>"
     +   '<div class="sh-meta">'+esc(p.domain)+" · completed "+esc(dstr)
     +     " · answered in "+esc(en.label ? (window.I18N[LANG].label || LANG) : LANG)+"</div>"
     + "</div>";

  h += "<h3>Result</h3>"
     + '<div class="sh-score"><span class="n">'+r.score+"</span>"
     +   '<span class="sh-meta">out of '+meta.max+" · clinical cut point "+esc(p.cut)+"</span></div>"
     + '<p class="sh-verdict">'+esc(bandEn)+(bilingual ? ' <span class="alt">'+esc(band)+"</span>" : "")+"</p>"
     + '<p class="sh-prov">'+(crossed
         ? "At or above the published cut point. A screen is not a diagnosis; it indicates that a clinical assessment is warranted."
         : "Below the published cut point. A negative screen does not rule out a condition, particularly where the patient reports distress.")
     + "</p>";

  if(p.caveat) h += '<div class="sh-note"><strong>Read with care.</strong> '+esc(p.caveat)+"</div>";

  /* item-level detail: the reason this sheet exists */
  if(ans.length){
    h += "<h3>Item-level responses</h3>"
       + '<table class="items"><thead><tr><th>#</th><th>Item</th><th>Response</th><th>Score</th></tr></thead><tbody>';
    ans.forEach((v,i)=>{
      const optsEn = meta.perQuestionOpts ? ten.optsets[i] : ten.opts;
      const optsLo = meta.perQuestionOpts ? t.optsets[i]   : t.opts;
      const isFlag = meta.safetyIdx === i && v > 0;
      const isHit  = !isFlag && v >= 2;
      const lblEn = optsEn && optsEn[v], lblLo = optsLo && optsLo[v];
      h += '<tr class="'+(isFlag ? "flag" : isHit ? "hit" : "")+'">'
         +   '<td class="n">'+(i+1)+"</td>"
         +   '<td class="q">'+esc(ten.q[i])+(bilingual ? '<span class="alt">'+esc(t.q[i])+"</span>" : "")+"</td>"
         +   '<td class="r">'+esc(typeof lblEn === "string" ? lblEn : "—")
         +     (bilingual && typeof lblLo === "string" ? '<span class="alt">'+esc(lblLo)+"</span>" : "")+"</td>"
         +   '<td class="v">'+esc(Number(v))+"</td>"
         + "</tr>";
    });
    h += "</tbody></table>";
    h += '<p class="sh-prov">Shaded rows scored 2 or more. '
       + (meta.safetyIdx != null
          ? "Item "+(meta.safetyIdx+1)+" is the self-harm item and is highlighted whenever it is endorsed at all."
          : "") + "</p>";
  } else {
    h += "<h3>Item-level responses</h3>"
       + '<p class="sh-prov">Not recorded. This screening predates the version of the app that stores '
       + "individual answers; only the total score was kept.</p>";
  }

  if(r.safetyFlag){
    h += '<div class="sh-note"><strong>Self-harm item endorsed.</strong> The patient reported '
       + "thoughts of being better off dead or of hurting themselves. This warrants direct enquiry "
       + "in the consultation regardless of the total score.</div>";
  }

  /* the follow-up gap this project exists to close */
  const prior = loadHistory().filter(e=> e.inst === r.inst && e.date !== r.date)
                  .sort((a,b)=> new Date(a.date) - new Date(b.date));
  h += "<h3>Screening history — "+esc(t.name)+"</h3>";
  if(prior.length){
    const all = prior.concat([{date:r.date, score:r.score, bandIdx:bi}]);
    h += '<div class="scroll"><table class="trend"><thead><tr><th>Date</th><th>Score</th><th>Band</th><th>Interval</th><th>Change</th></tr></thead><tbody>';
    all.forEach((e,i)=>{
      const prev = i ? all[i-1] : null;
      const days = prev ? Math.round((new Date(e.date) - new Date(prev.date)) / 86400000) : null;
      const d = prev ? e.score - prev.score : null;
      /* storage is not a trusted source — a band index out of range must
         degrade to a dash, never to whatever else lives on that array */
      const bl = ten.bands[e.bandIdx] || "—";
      h += "<tr>"
         + "<td>"+esc(new Date(e.date).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}))+"</td>"
         + '<td class="v">'+esc(Number(e.score))+"</td>"
         + "<td>"+esc(typeof bl === "string" ? bl : "—")+"</td>"
         + "<td>"+(days == null ? "—" : days+" d")+"</td>"
         + "<td>"+(d == null ? "—" : (d > 0 ? "+"+d : d))+"</td>"
         + "</tr>";
    });
    h += "</tbody></table></div>"
       + '<p class="sh-prov">Repeated measurement is the point. Measurement-based care — '
       + "letting serial scores drive treatment decisions — outperforms treatment as usual, and "
       + "this history is that practice kept in the patient's own hands.</p>";
  } else {
    h += '<p class="sh-prov">This is the first recorded '+esc(t.name)+" screening. "
       + "A single score describes a moment, not a trajectory; a repeat screen after treatment "
       + "changes is what makes the number useful.</p>";
  }

  h += "<h3>Instrument provenance</h3>"
     + '<p class="sh-prov"><strong>Accuracy.</strong> '+esc(p.ops)+"</p>"
     + '<p class="sh-prov"><strong>Severity bands.</strong> '+esc(p.bands)+"</p>"
     + '<p class="sh-prov"><strong>Licence.</strong> '+esc(p.lic)+"</p>";

  h += '<div class="sh-foot">'
     + "<strong>How this was produced.</strong> The patient completed this screen themselves, "
     + "unsupervised, on their own device. Scoring is the instrument's published scoring, applied "
     + "unchanged except where noted above. Nothing was transmitted: the answers were stored in "
     + "this browser and this sheet was rendered locally. There is no server, no account and no "
     + "record of this anywhere else — so this sheet cannot be verified against a source, and "
     + "should be treated as patient-reported history rather than as a clinical record.<br><br>"
     + "Screening instruments detect probability, not disease. They do not diagnose, and they "
     + "perform differently across languages and cultures than in the populations where they were "
     + "validated.<br><br>"
     /* On paper a reference with no address is no reference at all, so the
        URL is printed rather than hidden behind link text. */
     + '<strong>Source.</strong> Every figure above is cited in full at '
     + '<a href="evidence.html">aryanmanhas12.github.io/Psych/evidence.html</a>. '
     + "The screener itself is free, open source and carries no advertising."
     + "</div>";
  return h;
}

/* The sheet is built for whichever screening is being shown, which is the
   one just taken by default and the most recent stored one when reached
   from history. */
let sheetFor = null, sheetBack = "results";

function openSheetFor(inst){
  const rows = loadHistory().filter(e=> e.inst === inst)
                 .sort((a,b)=> new Date(a.date) - new Date(b.date));
  if(!rows.length) return;
  sheetFor = rows[rows.length-1];
  sheetBack = "history";
  showView("summary");
}

/* The clinical summary is written in English on purpose — it is the sheet
   a patient hands to a doctor — so buildSheet needs window.I18N.en even
   when the reader has never been in English. With the languages split that
   is no longer guaranteed to be in memory, so fetch it if it is missing.
   Nearly always it is not: the idle preload takes English first, and this
   screen is several taps and a completed screener away from first paint. */
function renderSummary(){
  const r = sheetFor || lastResult;
  if(!r){ showView("home"); return; }
  const draw = ()=>{
    document.getElementById("sheetBody").innerHTML = buildSheet(r);
    sheetFor = null;   /* one-shot: the results view owns the default again */
  };
  if(window.I18N && window.I18N.en) draw();
  else loadLang("en", got=>{ if(got) draw(); });
}

/* ════════ history ════════ */
function renderHistory(){
  const h = loadHistory(), el = document.getElementById("histContent");
  if(!h.length){ el.innerHTML = '<p class="histempty">'+esc(T.ui.histEmpty)+'</p>'; return; }
  const by = {};
  h.forEach(e=>{ (by[e.inst] = by[e.inst] || []).push(e); });
  el.innerHTML = "";
  ORDER.filter(id=>by[id]).forEach(id=>{
    const t = T.inst[id], meta = META[id];
    const entries = by[id].sort((a,b)=> new Date(a.date) - new Date(b.date));
    const latest = entries[entries.length-1];
    const lastLabel = t.bands[latest.bandIdx != null ? latest.bandIdx : 0];
    let trend = "";
    if(entries.length > 1){
      const a = entries[entries.length-2].score, b = latest.score;
      /* Two different things to say, and on a well-being scale they point
         opposite ways: the arrow describes the number, the words describe
         what the change means. Keeping them separate is what stops WHO-5
         reporting a fall from 14 to 5 as "higher than last screen". */
      const better = meta.inverse ? b > a : b < a;
      const arrow = b === a ? "→" : b > a ? "↑" : "↓";
      trend = arrow + " " + (b === a ? T.ui.trendFlat : better ? T.ui.trendDown : T.ui.trendUp);
    }
    const block = document.createElement("div");
    block.className = "histblock";
    block.innerHTML =
      "<h3>"+esc(fmt(T.ui.histLatest,{name:t.name,score:latest.score,max:meta.max,label:lastLabel}))+"</h3>" +
      '<p class="sub">'+esc(fmt(T.ui.histCount,{n:entries.length}))+(trend ? " · "+esc(trend) : "")+"</p>" +
      (entries.length > 1 ? '<div class="chartwrap">'+chartSVG(entries,id)+'<div class="ctip"></div></div>' : "") +
      historyTable(entries,id) +
      /* A sheet is only useful if you can produce one on the morning of the
         appointment, which is rarely the day you took the screen. */
      '<button class="secondary histsheet" data-inst="'+esc(id)+'">'+esc(T.ui.sheetBtn)+"</button>";
    el.appendChild(block);
  });
  el.querySelectorAll(".histsheet").forEach(b=>
    b.addEventListener("click", ()=> openSheetFor(b.dataset.inst)));
  el.querySelectorAll(".chartwrap").forEach(w=>{
    const tip = w.querySelector(".ctip");
    w.addEventListener("pointerover", ev=>{
      const c = ev.target.closest("circle[data-d]");
      if(!c){ tip.style.display = "none"; return; }
      tip.textContent = c.dataset.d+" · "+c.dataset.s+" — "+c.dataset.l;
      const wr = w.getBoundingClientRect(), cr = c.getBoundingClientRect();
      tip.style.left = (cr.left - wr.left + cr.width/2 + w.scrollLeft)+"px";
      tip.style.top  = (cr.top - wr.top)+"px";
      tip.style.display = "block";
    });
    w.addEventListener("pointerleave", ()=>{ tip.style.display = "none"; });
  });
}

function historyTable(entries, id){
  const t = T.inst[id], meta = META[id];
  const rows = entries.slice().reverse().map(e=>
    "<tr><td>"+esc(dateStr(e.date,{day:"numeric",month:"short",year:"numeric"}))+"</td>"+
    "<td>"+e.score+" / "+meta.max+"</td><td>"+esc(t.bands[e.bandIdx != null ? e.bandIdx : 0])+
    (e.safetyFlag ? '<svg class="flagicon" viewBox="0 0 24 24" role="img" aria-label="self-harm item endorsed"><path d="M12 4.5 21 19.5H3z"/><path d="M12 10v4.2"/><circle cx="12" cy="17" r="1"/></svg>' : "")+"</td></tr>"
  ).join("");
  return '<table class="histtable"><caption>'+esc(t.name)+"</caption><thead><tr>"+
    "<th scope='col'>"+esc(T.ui.colDate)+"</th><th scope='col'>"+esc(T.ui.colScore)+
    "</th><th scope='col'>"+esc(T.ui.colResult)+"</th></tr></thead><tbody>"+rows+"</tbody></table>";
}

function chartSVG(entries, id){
  const t = T.inst[id], meta = META[id];
  const W=640,H=180,padL=34,padR=64,padT=16,padB=28;
  const iw=W-padL-padR, ih=H-padT-padB, n=entries.length;
  const x = i => padL + (n===1 ? iw/2 : i*(iw/(n-1)));
  const y = v => padT + ih - (v/meta.max)*ih;
  const pts = entries.map((e,i)=>[x(i), y(e.score)]);
  const path = pts.map((p,i)=>(i===0?"M":"L")+p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ");
  const cutY = y(meta.cutoff);
  const df = d => dateStr(d,{day:"numeric",month:"short"});
  let s = '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="min-width:26rem;max-width:40rem;display:block;" role="img" aria-label="'+
    esc(fmt(T.ui.chartAria,{name:t.name,cut:meta.cutoff}))+'">';
  s += '<line x1="'+padL+'" y1="'+y(0)+'" x2="'+(W-padR)+'" y2="'+y(0)+'" stroke="var(--line)" stroke-width="1"/>';
  s += '<line x1="'+padL+'" y1="'+y(meta.max)+'" x2="'+(W-padR)+'" y2="'+y(meta.max)+'" stroke="var(--line)" stroke-width="1"/>';
  s += '<text x="'+(padL-6)+'" y="'+(y(0)+4)+'" text-anchor="end" font-size="11" fill="var(--muted)" font-family="monospace">0</text>';
  s += '<text x="'+(padL-6)+'" y="'+(y(meta.max)+4)+'" text-anchor="end" font-size="11" fill="var(--muted)" font-family="monospace">'+meta.max+'</text>';
  s += '<line x1="'+padL+'" y1="'+cutY+'" x2="'+(W-padR)+'" y2="'+cutY+'" stroke="var(--stamp)" stroke-width="1.5" stroke-dasharray="5 4"/>';
  s += '<text x="'+(W-padR+4)+'" y="'+(cutY+4)+'" font-size="10" fill="var(--stamp)" font-family="monospace">'+
       esc(meta.inverse ? "≤"+meta.cutoff : meta.cutoff+"+")+'</text>';
  /* the line is drawn in the brand's light, with a soft wash under it —
     one gradient per chart, named after its instrument so two charts on
     the page never borrow each other's */
  const gid = "cg-" + id;
  s += '<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8B5CF6"/>'+
       '<stop offset=".55" stop-color="#FF3D8B"/><stop offset="1" stop-color="#F2A300"/></linearGradient>'+
       '<linearGradient id="'+gid+'a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF3D8B" stop-opacity=".18"/>'+
       '<stop offset="1" stop-color="#FF3D8B" stop-opacity="0"/></linearGradient></defs>';
  if(n > 1) s += '<path d="'+path+' L'+pts[n-1][0].toFixed(1)+','+y(0)+' L'+pts[0][0].toFixed(1)+','+y(0)+' Z" fill="url(#'+gid+'a)"/>';
  s += '<path d="'+path+'" fill="none" stroke="url(#'+gid+')" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
  entries.forEach((e,i)=>{
    s += '<circle cx="'+pts[i][0].toFixed(1)+'" cy="'+pts[i][1].toFixed(1)+'" r="5" fill="var(--heal)" stroke="var(--card)" stroke-width="2.5" style="pointer-events:none;"/>';
    s += '<circle cx="'+pts[i][0].toFixed(1)+'" cy="'+pts[i][1].toFixed(1)+'" r="12" fill="transparent" data-d="'+esc(df(e.date))+'" data-s="'+e.score+'/'+meta.max+'" data-l="'+esc(t.bands[e.bandIdx != null ? e.bandIdx : 0])+'"/>';
  });
  s += '<text x="'+(pts[n-1][0]+8)+'" y="'+(pts[n-1][1]-8)+'" font-size="12" font-weight="700" fill="var(--ink)" font-family="monospace">'+entries[n-1].score+'</text>';
  s += '<text x="'+padL+'" y="'+(H-8)+'" font-size="11" fill="var(--muted)" font-family="monospace">'+esc(df(entries[0].date))+'</text>';
  s += '<text x="'+(W-padR)+'" y="'+(H-8)+'" text-anchor="end" font-size="11" fill="var(--muted)" font-family="monospace">'+esc(df(entries[n-1].date))+'</text>';
  return s + "</svg>";
}

/* ════════ import / export / clear ════════ */
function exportData(){
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(loadHistory(),null,2)],{type:"application/json"}));
  a.download = "psych-screener-history.json"; a.click();
  URL.revokeObjectURL(a.href);
}
function importData(file){
  const msg = document.getElementById("ioMsg");
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const data = JSON.parse(reader.result);
      if(!Array.isArray(data)) throw new Error("not an array");
      /* An imported file is untrusted input: it can be hand-edited, or come
         from someone else entirely. Rebuild each entry field by field rather
         than passing the parsed object through, so nothing unexpected reaches
         storage and, from there, the clinical summary. */
      /* hasOwnProperty, not a truthiness test: META["__proto__"] and
         META["constructor"] are both truthy and neither is an instrument. */
      const known = k=> typeof k === "string" && Object.prototype.hasOwnProperty.call(META, k);
      const clean = data.filter(e=>
          e && known(e.inst) && Number.isFinite(e.score) && e.date &&
          !isNaN(new Date(e.date).getTime()))
        .map(e=>{
          const meta = META[e.inst];
          const score = Math.max(0, Math.min(meta.max, Math.round(e.score)));
          const bi = meta.bands.findIndex(([lo,hi])=> score >= lo && score <= hi);
          const out = {
            inst: e.inst, score, bandIdx: bi, sev: meta.bands[bi][2],
            safetyFlag: !!e.safetyFlag,
            date: new Date(e.date).toISOString()
          };
          /* item-level answers, only if they are the right shape */
          if(Array.isArray(e.ans) && e.ans.length === T.inst[e.inst].q.length
             && e.ans.every(v=> Number.isInteger(v) && v >= 0 && v <= 12)){
            out.ans = e.ans.slice();
          }
          return out;
        });
      if(!clean.length) throw new Error("no valid entries");
      const merged = loadHistory().concat(clean);
      const seen = new Set();
      const dedup = merged.filter(e=>{
        const k = e.inst+"|"+e.date+"|"+e.score;
        if(seen.has(k)) return false;
        seen.add(k); return true;
      });
      localStorage.setItem(STORE_KEY, JSON.stringify(dedup));
      msg.style.color = "var(--heal)";
      msg.textContent = fmt(T.ui.importOk,{n:clean.length});
      renderHistory();
    }catch(err){
      msg.style.color = "var(--stamp)";
      msg.textContent = T.ui.importFail;
    }
  };
  reader.readAsText(file);
}
function clearData(){
  if(confirm(T.ui.confirmDelete)){
    localStorage.removeItem(STORE_KEY);
    document.getElementById("ioMsg").textContent = "";
    renderHistory();
  }
}

/* ════════ mood ════════ */
/* Faces, not emoji. A five-point face scale is the right control for this
   question — it reads without literacy, which for this audience is the
   whole point — but emoji render as a different picture on every platform
   and are somebody else's artwork. These are drawn in the same line weight
   as the rest of the site's icons, so they are the same on every device
   and they inherit currentColor with the theme. Mouth path only: the eyes
   and the circle are shared. */
const MOOD_FACES = [
  "M8.5 16.5 Q12 13 15.5 16.5",   /* very low  */
  "M8.5 15.8 Q12 14 15.5 15.8",   /* low       */
  "M8.5 15.2 H15.5",              /* okay      */
  "M8.5 14.2 Q12 16 15.5 14.2",   /* good      */
  "M8 13.6 Q12 17.6 16 13.6"      /* great     */
];
function moodFace(i){
  return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'
       + '<circle cx="12" cy="12" r="9.2"/>'
       + '<circle class="eye" cx="9" cy="10" r="1.05"/>'
       + '<circle class="eye" cx="15" cy="10" r="1.05"/>'
       + '<path d="' + MOOD_FACES[i] + '"/></svg>';
}
function loadMood(){ try{ return JSON.parse(localStorage.getItem(MOOD_KEY)) || {}; }catch(e){ return {}; } }
function dkey(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function setMood(v){
  const m = loadMood(); m[dkey(new Date())] = v;
  try{ localStorage.setItem(MOOD_KEY, JSON.stringify(m)); }catch(e){}
  renderMood();
}
function renderMood(){
  const m = loadMood(), today = dkey(new Date());
  const btns = document.getElementById("moodBtns");
  btns.innerHTML = "";
  MOOD_FACES.forEach((_,i)=>{
    const b = document.createElement("button");
    b.type = "button"; b.innerHTML = moodFace(i);
    b.title = T.ui.moods[i];
    b.setAttribute("aria-label", T.ui.moods[i]);
    b.setAttribute("aria-pressed", String(m[today] === i+1));
    b.addEventListener("click", ()=> setMood(i+1));
    btns.appendChild(b);
  });
  const strip = document.getElementById("moodStrip");
  strip.innerHTML = "";
  for(let i=13;i>=0;i--){
    const d = new Date(); d.setDate(d.getDate()-i);
    const v = m[dkey(d)];
    const c = document.createElement("div");
    c.className = "moodcell" + (v ? " v"+v : "");
    c.style.height = (v ? 8+v*5 : 4)+"px";
    c.title = dkey(d) + (v ? " — "+T.ui.moods[v-1] : "");
    strip.appendChild(c);
  }
  let streak = 0;
  for(let i=0;;i++){
    const d = new Date(); d.setDate(d.getDate()-i);
    if(m[dkey(d)]) streak++; else break;
  }
  document.getElementById("moodMsg").textContent =
    m[today] ? fmt(T.ui.moodLogged,{n:streak}) : T.ui.moodPrompt;
}

/* ════════ resources: directories first, then region, then India detail ════════ */
let activeRegion = null;
function crisisLinesHTML(){
  return '<a href="tel:14416">'+esc(T.ui.lineTelemanas)+'</a><br>' +
         '<a href="tel:18005990019">'+esc(T.ui.lineKiran)+'</a><br>' +
         '<a href="tel:112">'+esc(T.ui.lineEmergency)+'</a>';
}
function renderResources(){
  const el = document.getElementById("resList");
  if(!window.HELP){ el.innerHTML = T.ui.resources.map(([h,b])=>
    '<div class="res"><h3>'+esc(h)+"</h3><p>"+esc(b)+"</p></div>").join(""); return; }

  let h = '<div class="dirlist">' + HELP.directories.map(d=>
      '<div class="dir"><a href="'+esc(d.url)+'" target="_blank" rel="noopener">'+esc(d.name)+' ↗</a>'+
      '<p>'+esc(d.note)+'</p></div>').join("") + '</div>';

  h += '<div class="res"><h3>'+esc(T.ui.lineEmergency.split("—")[0].trim())+'</h3><p>' +
       HELP.emergency.map(e=>'<strong>'+esc(e.num)+'</strong> — '+esc(e.where)).join(' · ') +
       '</p></div>';

  if(!activeRegion) activeRegion = HELP.regions[0].id;
  h += '<div class="regiontabs" role="group">' + HELP.regions.map(r=>
      '<button type="button" data-region="'+r.id+'" aria-pressed="'+(r.id===activeRegion)+'">'+esc(r.label)+'</button>').join("") + '</div>';

  const reg = HELP.regions.find(r=>r.id===activeRegion) || HELP.regions[0];
  h += '<div style="overflow-x:auto;"><table class="lines"><caption class="visually-hidden">'+esc(reg.label)+'</caption><thead><tr>'+
       '<th scope="col">Country</th><th scope="col">Service</th><th scope="col">Number</th></tr></thead><tbody>' +
       reg.lines.map(l=>'<tr><td>'+esc(l.country)+'</td><td>'+esc(l.org)+
         (l.note?'<br><span style="color:var(--muted);font-size:.8em;">'+esc(l.note)+'</span>':'')+
         '</td><td><a href="tel:'+esc(l.tel)+'">'+esc(l.num)+'</a></td></tr>').join("") +
       '</tbody></table></div>' +
       '<p class="reviewed">Numbers reviewed '+esc(HELP.LAST_REVIEWED)+
       '. Services change — the directories above are maintained continuously and are the reliable path if a number below does not connect.</p>';

  h += '<h2 class="display" style="margin:1.6rem 0 .8rem;">India</h2>' +
       T.ui.resources.map(([t,b])=>'<div class="res"><h3>'+esc(t)+"</h3><p>"+esc(b)+"</p></div>").join("");

  el.innerHTML = h;
  el.querySelectorAll("[data-region]").forEach(b=>
    b.addEventListener("click", ()=>{ activeRegion = b.dataset.region; renderResources(); }));
}

/* ════════ global stat band — figures carry their source ════════ */
const STATS = [
  { n:"1 in 2",  k:"half",  l:"of people will develop a mental disorder at some point by age 75", s:"McGrath et al., Lancet Psychiatry 2023 · 156,331 people, 29 countries" },
  { n:"14.5",    k:"num", to:14.5, dp:1, l:"years — the peak age at which mental disorders first begin", s:"Solmi et al., Molecular Psychiatry 2021 · meta-analysis, 192 studies" },
  { n:"48%",     k:"num", to:48,   dp:0, suffix:"%", l:"of all mental disorders have already begun before age 18", s:"Solmi et al., Molecular Psychiatry 2021" },
  /* Two bare numbers separated by a slash made the reader do the matching
     themselves, and most did not. One headline number, and the comparison
     carried by the sentence instead. */
  { n:"3%", k:"num", to:3, dp:0, suffix:"%",
    l:"of people with depression in low-income countries get minimally adequate treatment. In high-income countries it is 23%.",
    s:"Moitra et al., PLoS Medicine 2022 · 84 countries" }
];
function renderStats(){
  const el = document.getElementById("statBand");
  if(!el || el.childElementCount) return;
  el.innerHTML = STATS.map((s,i)=>
    '<div class="stat"><span class="n" data-stat="'+i+'">'+esc(s.n)+'</span>'+
    '<span class="l">'+esc(s.l)+'</span><span class="s">'+esc(s.s)+'</span></div>').join("");
  countUpWhenSeen(el);
}
/* count-up only for the numeric tiles, only once, only if motion is welcome */
function countUpWhenSeen(band){
  if(!REVEAL_OK) return;
  const io = new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(!e.isIntersecting) return;
      io.unobserve(e.target);
      band.querySelectorAll("[data-stat]").forEach(el=>{
        const s = STATS[+el.dataset.stat];
        if(s.k !== "num") return;
        const t0 = performance.now(), dur = 900;
        (function tick(t){
          const p = Math.min(1,(t-t0)/dur);
          const v = s.to * (1 - Math.pow(1-p,3));
          el.textContent = v.toFixed(s.dp) + (s.suffix||"");
          if(p < 1) requestAnimationFrame(tick); else el.textContent = s.n;
        })(t0);
      });
    });
  }, { threshold:0.35 });
  io.observe(band);
}

/* ════════ guided conversation — a fixed script, never generative ════════
   Every branch ends somewhere useful: a screener, the helplines, or
   concrete guidance. The crisis route is reachable from every step via
   the always-present button, so escalation never depends on parsing text. */
function guideScript(){
  return {
    start: { q:()=>T.ui.qStart, opts:[
      { label:()=>T.ui.oLost,  next:"feel" },
      { label:()=>T.ui.oCheck, next:"feel" },
      { label:()=>T.ui.oOther, next:"other" },
      { label:()=>T.ui.oNow,   next:"crisis", cls:"now" }
    ]},
    feel: { q:()=>T.ui.qFeel, opts:[
      { label:()=>T.ui.oLow,    next:"r_low" },
      { label:()=>T.ui.oAnx,    next:"r_anx" },
      { label:()=>T.ui.oDrink,  next:"r_drink" },
      { label:()=>T.ui.oUnsure, next:"r_unsure" }
    ]},
    r_low:    { say:()=>T.ui.rLow,    take:"phq9"  },
    r_anx:    { say:()=>T.ui.rAnx,    take:"gad7"  },
    r_drink:  { say:()=>T.ui.rDrink,  take:"auditc"},
    r_unsure: { say:()=>T.ui.rUnsure, take:"phq4"  },
    other:    { say:()=>T.ui.rOther,  end:true },
    crisis:   { crisis:true }
  };
}
let guideNode = "start";

function bubble(cls, html){
  const d = document.createElement("div");
  d.className = "bub " + cls;
  d.innerHTML = html;
  document.getElementById("transcript").appendChild(d);
  d.scrollIntoView({ block:"nearest", behavior: REVEAL_OK ? "smooth" : "instant" });
  return d;
}
function guideSay(html, cls, then){
  const choices = document.getElementById("choices");
  choices.innerHTML = "";
  if(!REVEAL_OK){ bubble(cls||"g", html); then && then(); return; }
  const t = bubble("g", '<span class="typing" aria-hidden="true"><i></i><i></i><i></i></span>');
  setTimeout(()=>{ t.remove(); bubble(cls||"g", html); then && then(); }, 420);
}
function guideRender(node){
  guideNode = node;
  const S = guideScript(), n = S[node];
  const choices = document.getElementById("choices");

  if(n.crisis){
    guideSay(esc(T.ui.rCrisis) + '<div class="lines">' + crisisLinesHTML() + '</div>', "crisis", ()=>{
      choices.innerHTML = "";
      addChoice(T.ui.guideHelplines, ()=> showView("resources"), "go");
      /* offered second, never instead of the call */
      addChoice(T.ui.breatheOpen, ()=>{
        const b = document.getElementById("breathe");
        b.hidden = false;
        b.scrollIntoView({ block:"nearest", behavior: REVEAL_OK ? "smooth" : "instant" });
        document.getElementById("breatheBtn").focus();
      });
      addChoice(T.ui.guideRestart, ()=> guideStart());
    });
    return;
  }
  if(n.say){
    guideSay(esc(n.say()), "g", ()=>{
      choices.innerHTML = "";
      if(n.take){
        addChoice(fmt(T.ui.guideTake,{name:T.inst[n.take].name}), ()=> startTest(n.take), "go");
      }
      addChoice(T.ui.guideHelplines, ()=> showView("resources"));
      addChoice(T.ui.guideRestart,   ()=> guideStart());
    });
    return;
  }
  guideSay(esc(n.q()), "g", ()=>{
    choices.innerHTML = "";
    n.opts.forEach(o=> addChoice(o.label(), ()=>{
      bubble("u", esc(o.label()));
      guideRender(o.next);
    }, o.cls));
  });
}
function addChoice(label, fn, cls){
  const b = document.createElement("button");
  b.type = "button";
  if(cls) b.className = cls;
  b.textContent = label;
  b.addEventListener("click", fn);
  document.getElementById("choices").appendChild(b);
  return b;
}
function guideStart(){
  document.getElementById("transcript").innerHTML = "";
  document.getElementById("choices").innerHTML = "";
  breatheStop();
  document.getElementById("breathe").hidden = true;
  guideRender("start");
}

/* ════════ Audio-Haptic Vagal Bio-Pacer & Grounding Engine ════════ */
const BREATH_PROTOCOLS = {
  vagal: [["in",4000,"breatheIn"],["hold",7000,"breatheHold"],["out",8000,"breatheOut"]],
  box:   [["in",4000,"breatheIn"],["hold",4000,"breatheHold"],["out",4000,"breatheOut"],["hold",4000,"breatheHold"]],
  coh:   [["in",5500,"breatheIn"],["out",5500,"breatheOut"]]
};
let curProto = "vagal", breatheTimer = null, breathePhase = 0, breatheRounds = 0;
let audioCtx = null;

function playBreathTone(freq, durMs){
  try {
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + Math.min(1.8, durMs/1000 * 0.7));
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + Math.min(2.0, durMs/1000));
  } catch(e){}
}

function triggerBreathHaptic(pattern){
  try {
    if('vibrate' in navigator) navigator.vibrate(pattern || [18]);
  } catch(e){}
}

function breatheStep(){
  const proto = BREATH_PROTOCOLS[curProto] || BREATH_PROTOCOLS.vagal;
  const [cls, ms, key] = proto[breathePhase];
  const orb = document.getElementById("orb");
  orb.className = "orb " + cls;
  orb.style.transitionDuration = (ms/1000) + "s";
  document.getElementById("orbLabel").textContent = T.ui[key] || key;
  document.getElementById("breatheMeta").textContent =
    (T.ui[key] || key) + " · " + fmt(T.ui.breatheRounds,{n:breatheRounds + 1});

  if(cls === "in") { playBreathTone(432, ms); triggerBreathHaptic([18, 30, 18]); }
  else if(cls === "hold") { playBreathTone(324, ms); triggerBreathHaptic([18]); }
  else if(cls === "out") { playBreathTone(216, ms); triggerBreathHaptic([28]); }

  breatheTimer = setTimeout(()=>{
    breathePhase = (breathePhase + 1) % proto.length;
    if(breathePhase === 0){
      breatheRounds++;
      if(breatheRounds >= 6){ breatheStop(true); return; }
    }
    breatheStep();
  }, ms);
}

function breatheStart(){
  breathePhase = 0; breatheRounds = 0;
  document.getElementById("breatheBtn").textContent = T.ui.breatheStop;
  breatheStep();
}

function breatheStop(finished){
  if(breatheTimer){ clearTimeout(breatheTimer); breatheTimer = null; }
  const orb = document.getElementById("orb"), btn = document.getElementById("breatheBtn");
  if(!orb || !btn) return;
  orb.className = "orb";
  document.getElementById("orbLabel").textContent = "";
  btn.textContent = T.ui.breatheStart;
  document.getElementById("breatheMeta").textContent = finished ? T.ui.breatheDone : "";
}

function setBreathProto(name){
  curProto = name;
  document.querySelectorAll(".breathe-proto").forEach(btn=>{
    const sel = btn.dataset.proto === name;
    btn.style.borderColor = sel ? "var(--heal)" : "var(--line)";
    btn.style.background = sel ? "color-mix(in srgb, var(--heal) 15%, var(--card))" : "var(--card)";
    btn.style.color = sel ? "var(--ink)" : "var(--muted)";
    btn.style.fontWeight = sel ? "600" : "400";
  });
  if(breatheTimer){ breatheStop(); breatheStart(); }
}

/* ════════ SBAR Doctor Handshake Formatter ════════ */
function copySBARSummary(){
  if(!lastResult) return;
  const r = lastResult, meta = META[r.inst], t = T.inst[r.inst];
  const dateFormatted = new Date(r.date).toLocaleDateString("en-GB", {day:"numeric",month:"short",year:"numeric"});

  /* The instrument's own name and cutoff label live on T.inst, not on META —
     META carries only the arithmetic (max, cutoff, bands). Reading them off
     META printed the word "undefined" into the sheet a patient hands to a
     doctor. No diagnosis code is printed either: this is a screening score,
     and a code beside it is a code somebody transcribes into a chart. */
  const lines = [
    "=== PSYCHIATRIC SCREENING REPORT (SBAR TRIAGE FORMAT) ===",
    "DATE: " + dateFormatted + " | SOURCE: Ronak (On-Device Private PWA)",
    "",
    "[S] SITUATION:",
    "Patient self-administered a standard screening instrument: " + t.name + ".",
    "",
    "[B] BACKGROUND:",
    "Completed independently, unsupervised. Instrument measures: " + (t.desc || t.tag) + ".",
    "",
    "[A] ASSESSMENT:",
    "\u2022 Instrument: " + t.name + " (" + t.tag + ")",
    "\u2022 Total Score: " + r.score + " / " + meta.max + " (" + t.bands[r.bandIdx] + ")",
    "\u2022 " + (t.cutoffLabel || "Clinical cutoff") + ": score " +
      (meta.inverse ? (r.score <= meta.cutoff ? "AT/BELOW" : "ABOVE")
                    : (r.score >= meta.cutoff ? "MET/EXCEEDED" : "NOT MET")) +
      " (cutoff " + meta.cutoff + ")"
  ];
  lines.push(r.safetyFlag
    ? "\u2022 CRITICAL SAFETY ALERT: self-harm / suicidal ideation item endorsed"
    : "\u2022 Critical safety flags: none endorsed");
  lines.push("",
    "[R] RECOMMENDATION / NEXT STEPS:",
    "\u2022 A screening score is not a diagnosis. Clinical interview required to",
    "  evaluate functional impairment, chronicity and differential.",
    "\u2022 Consider evidence-based psychotherapy and pharmacotherapy if indicated.");
  if(r.safetyFlag){
    lines.push("\u2022 IMMEDIATE: comprehensive safety assessment (Stanley-Brown protocol);",
               "  Tele-MANAS 14416 available 24/7.");
  }
  lines.push("",
    "Item-level responses are available in the Clinical Summary sheet in-app.",
    "CONFIDENTIALITY: no health data transmitted. All scoring is client-side.");

  /* join, not filter(Boolean) — that dropped the "" entries that separate
     [S] from [B] from [A] from [R], and ran the whole note into one block. */
  const sbar = lines.join("\n");

  const btn = document.getElementById("sbarBtn");
  const flash = ()=>{
    if(!btn) return;
    const orig = btn.textContent;
    btn.textContent = T.ui.sbarCopied || "Copied";
    setTimeout(()=> btn.textContent = orig, 3000);
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(sbar).then(flash).catch(()=> alert(sbar));
  } else {
    alert(sbar);
  }
}

/* ════════ Stanley-Brown Safety Plan Persistence ════════ */
function loadSafetyPlan(){
  try {
    const sp = JSON.parse(localStorage.getItem("psych-safety-plan") || "{}");
    if(sp.warning) document.getElementById("spWarning").value = sp.warning;
    if(sp.coping)  document.getElementById("spCoping").value  = sp.coping;
    if(sp.social)  document.getElementById("spSocial").value  = sp.social;
    if(sp.trusted) document.getElementById("spTrusted").value = sp.trusted;
  } catch(e){}
}
function saveSafetyPlan(){
  try {
    const sp = {
      warning: document.getElementById("spWarning").value.trim(),
      coping:  document.getElementById("spCoping").value.trim(),
      social:  document.getElementById("spSocial").value.trim(),
      trusted: document.getElementById("spTrusted").value.trim(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem("psych-safety-plan", JSON.stringify(sp));
    const msg = document.getElementById("spMsg");
    msg.textContent = T.ui.spSaved || "Saved on this phone only.";
    setTimeout(()=> msg.textContent = "", 3500);
  } catch(e){}
}

/* ════════ wiring ════════
   Everything below this line needs window.I18N. Every visible string on
   the page is a data-i18n key filled in by setLang, and the screener
   cards, the guide and the results are all built from T at runtime — so
   if i18n.js does not arrive, 62 of 98 text nodes stay empty, the card
   grid renders nothing, and the <h1> is a blank line.

   That was not a graceful degradation, it was a crash. buildLangSelect
   opens with Object.keys(window.I18N), which throws "Cannot convert
   undefined or null to object" on undefined, and the exception took the
   rest of this script with it. What a person actually saw, reported from
   a phone, was a white screen with one working phone number on it — the
   only text on the page that is hard-coded rather than translated.

   i18n.js is 275KB, the largest thing this page fetches, which makes it
   the most likely single request to be dropped on a bad connection. So:
   try once more before giving up, since a retry usually just works, and
   if it still fails say so in plain English instead of showing a blank
   page. The crisis strip above is unaffected either way — its numbers
   are in the markup and callable with no JavaScript at all. */
function boot(){
  buildLangSelect();
  const P = prefs();
  setLang(P.lang || (navigator.language || "en").slice(0,2));
  applySize(P.scale || 1);
  applyTheme(P.theme || "auto");
  applyContrast(!!P.contrast);
  /* last, and only once the strings exist — see startOpening */
  startOpening();
  /* and the other five languages, once there is nothing else to do */
  if(window.requestIdleCallback) requestIdleCallback(preloadLangs, {timeout:4000});
  else setTimeout(preloadLangs, 1500);
}

function bootFailed(){
  const el = document.createElement("div");
  el.className = "loadfail";
  el.setAttribute("role", "alert");
  const p = document.createElement("p");
  p.innerHTML = "<strong>This page didn’t finish loading.</strong> " +
    "The helpline numbers at the top of the screen still work — you can tap them to call.";
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = "Try again";
  b.addEventListener("click", ()=> location.reload());
  el.appendChild(p); el.appendChild(b);
  const main = document.getElementById("main") || document.body;
  main.insertBefore(el, main.firstChild);
}

/* boot() is invoked at the very foot of this script, not here. It ends by
   calling startOpening(), which reads consts — OT_KEY, the tour tables —
   that are declared further down; running it from this point put those in
   the temporal dead zone and threw "Cannot access 'OT_KEY' before
   initialization". Everything above is declarations; the one statement
   that starts the app belongs after the last of them. */

/* Well-beings inbound: a bare ref param, read once, then removed from the
   address bar so a refresh or a shared link doesn't keep re-showing it. */
if(new URLSearchParams(location.search).get("ref") === "wellbeings"){
  document.getElementById("wellbeingsBanner").hidden = false;
  const url = new URL(location.href);
  url.searchParams.delete("ref");
  history.replaceState(null, "", url.pathname + url.search + url.hash);
}

/* Moving between the app's four places — check-ins, talk, help, history —
   is a cross-fade where the browser can draw one: the old screen settles
   back as the new one rises into place, while the helpline strip and the
   tab bar stay exactly where they are (they carry view-transition-names of
   their own, so they are not part of the fade). Only for these taps: every
   other showView call runs code straight after it that expects the new
   view to be on screen already, and a view transition applies its change
   a frame later. Skipped for reduced motion and in lite mode, where it is
   the same instant switch it always was. */
function goView(name){
  const root = document.documentElement;
  if(!document.startViewTransition || document.hidden || root.classList.contains("lite") ||
     window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    showView(name); return;
  }
  root.classList.add("vt");
  const t = document.startViewTransition(()=> showView(name));
  t.finished.finally(()=> root.classList.remove("vt"));
}
document.querySelectorAll("[data-view]").forEach(el=>
  el.addEventListener("click", e=>{ e.preventDefault(); goView(el.dataset.view); }));

/* How tall the tab bar actually is, rather than how tall it was guessed to
   be. The guess was a rem value, and a rem here is whatever the text-size
   control last set — so the page cleared 70px for an 86px bar and the
   footer sat under it, and at 135% text it would have been further out
   again. Measuring keeps the page's bottom padding and the tour card's
   offset correct across every text size and every language. */
/* ...and the crisis strip, measured in the same frame. On a phone the
   strip is pinned to the top of the screen, so anything else that sticks —
   the deck of check-ins, the question header — has to stop below it
   rather than slide underneath the helpline numbers, and its height
   depends on the language and the text size too.

   Both are read first and written together, once per frame at most.
   Each write is a custom property on <html>, which restyles the whole
   document; measured separately (and the strip synchronously, in the
   middle of the script's first run) they cost two full restyles and a
   forced layout on every load — a fifth of the page's blocking time on a
   throttled phone. */
(function trackChrome(){
  const bar = document.querySelector(".tabbar"), strip = document.querySelector(".topstrip");
  const root = document.documentElement;
  /* The strip's height is only ever read by three elements, so it is
     written on those three rather than on <html>: a custom property on the
     root restyles every element in the document, and this one changes the
     first time the page is measured on every single load. */
  const stripUsers = ["#cardGrid", "#checkins", ".tokenbar"]
    .map(q=> document.querySelector(q)).filter(Boolean);
  let rafId = null, lastT = -1, lastS = 0;
  const sync = ()=>{
    if(rafId) return;
    rafId = requestAnimationFrame(()=>{
      rafId = null;
      const t = bar ? (bar.offsetHeight || 0) : 0;
      const s = strip && getComputedStyle(strip).position === "sticky" ? strip.offsetHeight : 0;
      /* Only write what actually moved: setting a custom property to the
         value it already holds still invalidates style. On the first pass
         "moved" means "differs from the stylesheet's own starting value",
         which the tab bar's usually does not. */
      if(lastT === -1){
        const guess = parseFloat(getComputedStyle(root).getPropertyValue("--tabbar-h")) *
                      (/rem\s*$/.test(getComputedStyle(root).getPropertyValue("--tabbar-h")) ? parseFloat(getComputedStyle(root).fontSize) : 1);
        lastT = Math.abs(guess - t) < 1 ? t : -2;
      }
      if(t !== lastT){ lastT = t; root.style.setProperty("--tabbar-h", t + "px"); }
      if(s !== lastS){ lastS = s; stripUsers.forEach(el=> el.style.setProperty("--strip-h", s + "px")); }
    });
  };
  sync();
  if(typeof ResizeObserver !== "undefined"){
    const ro = new ResizeObserver(sync);
    if(bar) ro.observe(bar);
    if(strip) ro.observe(strip);
  }
  addEventListener("resize", sync, {passive:true});
})();

/* The tab bar yields while you read. Down hides it, up brings it back,
   and so does arriving at the foot of the page — nobody should reach the
   end and find the way onward gone. Deliberately only the bar: the crisis
   strip stays put, because the moment someone needs that number is not a
   moment to make them scroll in the right direction first.

   rAF-gated and passive, so this never lands work in the scroll handler
   itself; the 6px deadband stops a hovering thumb flickering it. */
(function chromeYields(){
  const root = document.documentElement;
  let last = scrollY, ticking = false;
  function update(){
    ticking = false;
    const y = Math.max(0, scrollY);
    const atEnd = innerHeight + y >= document.body.scrollHeight - 4;
    if(Math.abs(y - last) < 6 && !atEnd) return;
    root.classList.toggle("navdown", !atEnd && y > last && y > 140);
    last = y;
  }
  addEventListener("scroll", ()=>{
    if(!ticking){ ticking = true; requestAnimationFrame(update); }
  }, { passive:true });
})();

/* aria-current was only ever set by showView, which runs on navigation —
   so on the first paint no tab was marked and the bar couldn't answer the
   one question it exists to answer: which of these am I on. */
(function markCurrentView(){
  const active = document.querySelector(".view.active");
  const name = active ? active.id.replace(/^view-/, "") : "home";
  document.querySelectorAll("nav a[data-view]").forEach(a=>
    a.setAttribute("aria-current", a.dataset.view === name ? "page" : "false"));
})();
document.getElementById("backBtn").addEventListener("click", ()=>{
  if(current && current.idx > 0){
    current.idx--; current.goingBack = true;
    renderQ(); document.querySelector("#qcard button").focus();
  }
});
document.getElementById("cancelBtn").addEventListener("click", ()=>{ stopClock(); current = null; showView("home"); });

/* settings popover: click-outside + Escape to close, focus returned to trigger */
const setBtn = document.getElementById("setBtn"), setPanel = document.getElementById("setPanel");
const setScrim = document.createElement("div");
setScrim.className = "setscrim";
setScrim.addEventListener("click", ()=> toggleSettings(false));
document.body.appendChild(setScrim);
function toggleSettings(open){
  setPanel.classList.toggle("open", open);
  setBtn.setAttribute("aria-expanded", String(open));
  setScrim.classList.toggle("on", open);
  if(open) keepPanelOnScreen(); else setPanel.style.removeProperty("right");
}
/* The panel is anchored right:0 to its button, which is correct as long as
   the button is near the right edge. It has not always been: when the nav
   row wrapped, the button landed at the left of a second line and 288px of
   popover opened past the left edge of the screen — reported on an iPad,
   reproducible at 1080x810 with the panel's left edge at -44px. The layout
   fix is in site.css; this is the guarantee that no future layout can put
   the language switch somewhere it cannot be reached. Read then write, in
   one frame, so it costs no extra reflow. */
function keepPanelOnScreen(){
  setPanel.style.removeProperty("right");
  /* `right`, not `transform`: the open animation ends on transform:none, and
     an animation beats an inline style, so a transform nudge would sit
     off-screen for its whole 180ms and then snap into place. */
  setPanel.style.removeProperty("max-height");
  requestAnimationFrame(()=>{
    const r = setPanel.getBoundingClientRect();
    const pad = 8, vw = document.documentElement.clientWidth;
    let dx = 0;
    if(r.left < pad) dx = pad - r.left;
    else if(r.right > vw - pad) dx = (vw - pad) - r.right;
    if(dx) setPanel.style.right = Math.round(-dx) + "px";
    /* and the exact height left below wherever it opened, so the last row
       is always reachable rather than merely usually reachable.
       On a phone the tour's bubble is pinned as a bottom sheet, so during
       the tour the floor is the top of that sheet, not the bottom of the
       screen — otherwise the panel runs on underneath it and the install
       button it is pointing at sits behind the words describing it. */
    /* The tab bar is fixed to the bottom at z-index 80 and so paints over
       this panel. Stopping above it is the difference between a last row
       you can reach and one you can see but not tap. */
    const tabH = parseFloat(getComputedStyle(document.documentElement)
                   .getPropertyValue("--tabbar-h")) || 0;
    let floor = window.innerHeight - tabH;
    const tourEl = document.getElementById("tour");
    const cardEl = document.getElementById("tourCard");
    if(tourEl && !tourEl.hidden && cardEl){
      const cr = cardEl.getBoundingClientRect();
      if(cr.height && cr.top > r.top + 80) floor = Math.min(floor, cr.top - 8);
    }
    setPanel.style.maxHeight = Math.max(120, floor - r.top - 12) + "px";
  });
}
setBtn.addEventListener("click", e=>{
  e.stopPropagation();
  toggleSettings(setBtn.getAttribute("aria-expanded") !== "true");
});
setPanel.addEventListener("click", e=> e.stopPropagation());
document.addEventListener("click", ()=> toggleSettings(false));
document.addEventListener("keydown", e=>{
  if(e.key === "Escape" && setPanel.classList.contains("open")){ toggleSettings(false); setBtn.focus(); }
});
document.getElementById("printBtn").addEventListener("click", ()=> window.print());
document.getElementById("sheetBtn").addEventListener("click", ()=>{
  sheetBack = "results"; showView("summary");
});
document.getElementById("sheetBackBtn").addEventListener("click", ()=> showView(sheetBack));
document.getElementById("sheetPrintBtn").addEventListener("click", ()=> window.print());
document.getElementById("icsBtn").addEventListener("click", downloadReminder);
document.getElementById("exportBtn").addEventListener("click", exportData);
document.getElementById("clearBtn").addEventListener("click", clearData);
document.getElementById("importBtn").addEventListener("click", ()=> document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change", e=>{
  if(e.target.files[0]) importData(e.target.files[0]);
  e.target.value = "";
});
document.querySelectorAll("#sizeGroup button").forEach(b=>
  b.addEventListener("click", ()=> applySize(Number(b.dataset.size))));
document.querySelectorAll("#themeGroup button").forEach(b=>
  b.addEventListener("click", ()=> applyTheme(b.dataset.theme)));
document.getElementById("contrastBtn").addEventListener("click", ()=>
  applyContrast(document.getElementById("contrastBtn").getAttribute("aria-pressed") !== "true"));
document.getElementById("breatheBtn").addEventListener("click", ()=>{
  if(breatheTimer) breatheStop(); else breatheStart();
});
document.querySelectorAll(".breathe-proto").forEach(btn=>{
  btn.addEventListener("click", ()=> setBreathProto(btn.dataset.proto));
});
const sbarBtn = document.getElementById("sbarBtn");
if(sbarBtn) sbarBtn.addEventListener("click", copySBARSummary);
const spSaveBtn = document.getElementById("spSaveBtn");
if(spSaveBtn) spSaveBtn.addEventListener("click", saveSafetyPlan);
loadSafetyPlan();

/* Two buttons, because they do very different things. The old single
   "Share Results" put the person's actual score into the share sheet by
   default — one tap and a PHQ-9 of 18 is sitting in a WhatsApp draft, from
   the tool whose whole promise is that nothing leaves the phone. Sharing the
   site is the safe, common case; sharing a score is a deliberate act and now
   says so on the button. */
const SITE_URL = "https://aryanmanhas12.github.io/Psych/";
const shareToolBtn   = document.getElementById("shareToolBtn");
const shareResultBtn = document.getElementById("shareResultBtn");
if(navigator.share){
  const grp = document.getElementById("resShareGroup");
  if(grp) grp.hidden = false;
  if(shareToolBtn){
    shareToolBtn.style.display = "";
    shareToolBtn.addEventListener("click", ()=>{
      navigator.share({
        title: T.ui.shareToolTitle || "Ronak",
        text:  T.ui.shareToolText  || "A private mental health check you can do on your own phone. Nothing is sent anywhere.",
        url:   SITE_URL
      }).catch(()=>{});
    });
  }
  if(shareResultBtn){
    shareResultBtn.style.display = "";
    shareResultBtn.addEventListener("click", ()=>{
      if(!lastResult) return;
      const t = T.inst[lastResult.inst], meta = META[lastResult.inst];
      navigator.share({
        title: fmt(T.ui.shareResultTitle || "{name} result", {name:t.name}),
        text:  fmt(T.ui.shareResultText  ||
                 "My {name} screening came out {score}/{max} ({band}). Taken privately on my own phone at {url}",
                 {name:t.name, score:lastResult.score, max:meta.max,
                  band:t.bands[lastResult.bandIdx], url:SITE_URL}),
        url:   SITE_URL
      }).catch(()=>{});
    });
  }
}

/* ── offline: register the service worker, offer install when the browser does ── */
if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  addEventListener("load", ()=> navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
let deferredInstall = null;
addEventListener("beforeinstallprompt", e=>{
  e.preventDefault(); deferredInstall = e;
  document.getElementById("installBtn").style.display = "block";
  /* The tour auto-starts on a first visit and this event usually arrives a
     second or so after load — often after the step list has been filtered.
     Rather than leave the install step out of the very visit it was written
     for, fold it in, as long as the tour has not already walked past where
     it belongs. */
  if(typeof tourAddInstallStep === "function") tourAddInstallStep();
});
document.getElementById("installBtn").addEventListener("click", async ()=>{
  if(!deferredInstall) return;
  deferredInstall.prompt();
  await deferredInstall.userChoice;
  deferredInstall = null;
  document.getElementById("installBtn").style.display = "none";
});

/* mobile-only lede expander — only shown when the text is actually clipped */
const ledeEl = document.getElementById("homeLede"), ledeBtn = document.getElementById("ledeMore");
function syncLede(){
  const clipped = ledeEl.classList.contains("clamped") && ledeEl.scrollHeight > ledeEl.clientHeight + 2;
  ledeBtn.style.display = clipped ? "inline-block" : "none";
}
ledeBtn.addEventListener("click", ()=>{
  ledeEl.classList.remove("clamped");
  ledeBtn.setAttribute("aria-expanded","true");
  ledeBtn.style.display = "none";
});
addEventListener("resize", syncLede);
setTimeout(syncLede, 50);

document.getElementById("guideNowBtn").addEventListener("click", ()=>{
  showView("guide");
  bubble("u", esc(T.ui.guideNow));
  guideRender("crisis");
});
document.getElementById("guideResetBtn").addEventListener("click", guideStart);

/* ════════════════ THE OVERTURE ════════════════
   No words: a person alone in a room; the world passing the window;
   someone coming through the door to sit beside them; the head lifting;
   the room warming — and the warmth opening into the bloom-sun, the
   logo, over the two of them. Then it gets out of the way. The beats
   and their timings are in otPlay.                                */
/* ════════ how "seen it already" is remembered ════════
   Each of the three opening layers — the room scene, the walkthrough, the
   three questions — runs once per device and then stays quiet, which is
   right: nobody wants the same introduction every morning.

   What was wrong is that "once" was recorded as the bare string "1", so
   it meant "this person has seen SOMETHING, ever". Rebuild the opening
   and every phone that ever loaded the old one is locked out of the new
   one permanently — there is no version in the flag for a new release to
   differ from. That is not a hypothetical: the opening has been through
   three shapes now, and a returning phone showed none of them. It landed
   on the bare page with no scene, no walkthrough and no questions, which
   is exactly the report that sent me looking.

   This is the same bug sw.js already documents at the network layer (a
   cache name that never changed, so a shipped fix reached nobody), and it
   takes the same fix: put a version in the value and compare against it
   rather than testing for truthiness. Bump ONBOARD_V whenever the opening
   changes enough to be worth showing again, and every device — including
   the ones that saw every previous version — gets it exactly once more.

   Reads fail closed: if storage throws (private mode, storage disabled)
   we treat it as seen, because repeating the introduction on every load
   is worse than skipping it. */
const ONBOARD_V = "2";
function onboardSeen(key){
  try{ return localStorage.getItem(key) === ONBOARD_V; }catch(e){ return true; }
}
function onboardMark(key){
  try{ localStorage.setItem(key, ONBOARD_V); }catch(e){}
}

const OT_KEY = "psych-seen-overture";
const ot = document.getElementById("overture");
let otTimers = [];

function otClear(){ otTimers.forEach(clearTimeout); otTimers = []; }
function otAt(ms, fn){ otTimers.push(setTimeout(fn, ms)); }

/* set when the opening was asked for on purpose, rather than happening
   to a first-time visitor — a deliberate replay should always run the
   whole thing through, not consult the once-per-device gates that exist
   to stop it repeating uninvited */
let otThenTour = false;

function otEnd(skipped){
  otClear();
  ot.classList.add("closing");
  setTimeout(()=>{
    ot.hidden = true; ot.classList.remove("closing");
    document.getElementById("view-home").focus({preventScroll:true});
    /* only a room scene someone actually watched earns a follow-up —
       reaching for Skip and immediately getting a second guided thing
       is the opposite of what Skip was for */
    if(skipped) return;
    const replay = otThenTour; otThenTour = false;
    openingNext(replay);
  }, 500);
  onboardMark(OT_KEY);
}

function otPlay(){
  ot.hidden = false;
  ot.classList.remove("closing");
  otBuildLangs();
  const $ = id => document.getElementById(id);
  const set = (id, cls) => $(id).setAttribute("class", cls);

  /* reset — every beat is a class, so a replay (a language picked
     mid-scene) starts from a clean frame rather than wherever it was */
  set("otRoom","ot-room"); set("otFigA","fig"); set("otWalk","fig heal");
  set("otSit","fig heal"); set("otCurl",""); set("otWarm","");
  set("otPa","passer"); set("otPb","passer");
  set("otDoorGlow",""); set("otDoorLight",""); set("otCam","");
  set("otBloom",""); set("otSparks",""); set("otMark","");
  $("otBar").classList.remove("run");
  $("otBar").style.width = "";
  requestAnimationFrame(()=> $("otBar").classList.add("run"));

  /* ── under ten seconds, eight beats ──
     1  a room, at night
     2  someone on the floor of it, curled away from everything
     3  the world passes the window and does not stop
     4  the door opens, and there is light behind it
     5  one person comes through, and sits down beside them — beside, not over
     6  the head lifts, and the room warms
     7  the warmth opens into the bloom-sun, over the two of them
     8  the room lets go, and the name is left                      */
  otAt(60,   ()=> set("otCam","push"));
  otAt(200,  ()=> set("otRoom","ot-room on"));
  otAt(700,  ()=> set("otFigA","fig on"));

  otAt(1500, ()=> set("otPa","passer go"));
  otAt(2200, ()=> set("otPb","passer go"));

  otAt(3300, ()=>{ set("otDoorGlow","on"); set("otDoorLight","on"); });
  otAt(3600, ()=> set("otWalk","fig heal on"));
  otAt(3900, ()=> set("otWalk","fig heal on cross"));

  otAt(5300, ()=>{ set("otWalk","fig heal"); set("otSit","fig heal on"); set("otDoorLight",""); });

  otAt(5900, ()=> set("otCurl","lift"));
  otAt(6500, ()=>{ set("otWarm","on"); $("otFigA").classList.add("warmed"); set("otRoom","ot-room on warm"); });

  otAt(6900, ()=>{ set("otBloom","on"); set("otSparks","on"); });
  otAt(8100, ()=>{ set("otRoom","ot-room on warm dim"); set("otMark","on"); });

  otAt(9600, ()=> otEnd(false));
}

/* The scene is authored on a 600×320 canvas with wide margins that suit a
   desktop. On a phone those margins are the difference between a scene and
   a stamp: the room itself was rendering about 300px across inside a stage
   more than twice as tall as the whole drawing.

   The phone window is the artwork's real width — wall to wall plus a
   little air, 496 units — at exactly 16:9, which makes it 279 tall and
   centres it on the room. Nothing in the drawing moves; the frame is just
   put where a frame belongs, and the room ends up filling about 97% of
   the width it's given instead of floating inside its own empty margins.
   Same rectangle the tour card uses, deliberately. */
/* The six language chips on the opening screen. Pressing one re-renders
   the whole page through setLang — including this row and the caption
   above it — so the only feedback needed is which one is now pressed.

   Choosing a language also stops the clock. The opening dismisses itself
   on a timer, and someone who has just found their own script is about to
   read the caption in it; having the screen vanish mid-sentence as a
   reward for that is precisely the wrong lesson. The timers are dropped
   and the progress bar is frozen where it stands, so from here the person
   leaves when they press Skip, and not before. */
function otBuildLangs(){
  const host = document.getElementById("otLangs");
  if(!host) return;
  host.setAttribute("aria-label", (T.ui.langLabel || "Language"));
  host.textContent = "";
  LANGS.forEach(([code, label, htmlLang])=>{
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.lang = htmlLang;
    b.setAttribute("aria-pressed", String(code === LANG));
    b.addEventListener("click", ()=>{
      /* Already in this language: do nothing, so a stray second tap on the
         chip that is already pressed does not restart anything. */
      if(code === LANG) return;
      /* Replay only once the new strings are in the DOM — see setLang. */
      setLang(code, otReplay);
    });
    host.appendChild(b);
  });
}

/* Picking a language plays the scene again from the top, in that language.

   It used to freeze instead — the timers were dropped and the progress
   bar was pinned where it stood, on the reasoning that the opening
   dismisses itself on a clock and someone who has just found their own
   script should not have the screen vanish mid-sentence. The reasoning
   was fine and the implementation was not: nothing ever restarted it. The
   scene stopped on whatever frame it happened to be on and stayed there,
   the bar stopped moving, and the only way out was Skip. Reported from a
   phone with a recording — "the animation stops if i change the language
   mid animation", and it did, permanently.

   Replaying is the better answer to the original worry anyway. The
   drawing carries no words, so nothing about it needs re-translating;
   what the reader gets is the whole scene from the beginning plus a fresh
   nine seconds to read the caption in the language they just chose. */
function otReplay(){
  otClear();          /* otPlay does not clear, so without this the beats double up */
  otPlay();
}

const OT_SVG = ot.querySelector(".ot-stage svg");
function otFit(){
  if(!OT_SVG) return;
  OT_SVG.setAttribute("viewBox", innerWidth <= 640 ? "52 22.5 496 279" : "0 0 600 320");
}
otFit();
addEventListener("resize", otFit);

document.getElementById("skipIntro").addEventListener("click", ()=> otEnd(true));
function playOpening(){
  toggleSettings(false);
  otThenTour = true;
  otPlay();
  setTimeout(()=> document.getElementById("skipIntro").focus(), 60);
}
document.getElementById("replayIntro").addEventListener("click", playOpening);
ot.addEventListener("keydown", e=>{ if(e.key === "Escape") otEnd(true); });

/* Plays once per device, never for reduced-motion users, and never
   when someone arrives via a deep link — a person heading straight
   for #resources is looking for a phone number, not a film. */
/* Called from boot(), not at the top level, because every part of the
   opening reads strings: the scene's caption and its language chips, the
   walkthrough's copy, the three questions. This used to run inline here,
   which was fine only because setLang had always already happened by the
   time the parser reached it. Now that boot() can be deferred by a retry
   — or never run at all, when i18n.js does not arrive — starting the
   opening from here threw "Cannot read properties of null (reading
   'ui')" and took the rest of the script down with it. The opening is
   the one thing that must not run before the words it is made of. */
function startOpening(){
const otSkip = window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
               location.hash || onboardSeen(OT_KEY);
if(!otSkip){
  otPlay();
  setTimeout(()=> document.getElementById("skipIntro").focus(), 60);
} else if(!location.hash){
  /* The walkthrough used to hang off the end of the room scene and nowhere
     else, so anyone who never saw the scene — reduced-motion readers, and
     everyone on their second load, which on a phone is most people — could
     only find it by opening the settings panel and pressing Take the tour.
     The one explanation of what this site does was behind the least-pressed
     button on the page. It now stands on its own: still once per device,
     still gated on reduced-motion inside tourMaybeAutostart, and still
     never on a deep link, where someone is after a phone number. */
  setTimeout(tourMaybeAutostart, 400);
}
}

/* ════════ the numbers in the crisis strip are numbers you can call ════════
   They had been plain text. On the device this site is mostly read on,
   that is the difference between "call this" and "memorise this, leave
   the page, find the dialler, and type it again without getting a digit
   wrong" — asked of someone we have just told is in distress. The strip
   said IN DISTRESS? and then handed over homework.

   The numbers are the one part of these strings that is identical in
   every language (helplines.js says so itself: proper nouns and dialable
   strings, never translated), so one pass over the text works for all
   six without touching a single translation.

   Built as DOM nodes rather than an innerHTML replacement: the input is
   our own i18n string today, and this way it stays safe if that ever
   stops being true. */
function dialable(){
  document.querySelectorAll('.topstrip [data-i18n="crisis"]').forEach(host=>{
    const raw = host.textContent;
    if(!raw) return;
    const frag = document.createDocumentFragment();
    let last = 0;
    /* 3+ characters, digits and separators, starting and ending on a
       digit — matches 112, 14416 and 1800-599-0019, and leaves years and
       ordinary words alone. */
    const re = /\d[\d‑-]{1,}\d/g;
    let m;
    while((m = re.exec(raw)) !== null){
      if(m.index > last) frag.appendChild(document.createTextNode(raw.slice(last, m.index)));
      const a = document.createElement("a");
      a.href = "tel:" + m[0].replace(/\D/g, "");
      a.className = "dial";
      a.textContent = m[0];
      /* The visible text is a bare number; on its own that reads as
         "1800-599-0019, link" and nothing more. */
      a.setAttribute("aria-label", (T.ui.callLabel || "Call") + " " + m[0]);
      frag.appendChild(a);
      last = m.index + m[0].length;
    }
    if(!last) return;                       /* no numbers — leave it be */
    if(last < raw.length) frag.appendChild(document.createTextNode(raw.slice(last)));
    host.textContent = "";
    host.appendChild(frag);
  });
}

/* ════════ opening questions ════════
   Three statements about getting help, not about symptoms — the treatment
   gap this project exists for is only partly clinical, and what someone
   believes before they start shapes whether they act on a score at all.

   Each answer changes something later, which is the only reason it is
   fair to ask. They are kept in the same local store as everything else
   and never leave the device. */
const INTRO_KEY = "psych-intro-answers";
const INTRO_SEEN = "psych-seen-intro";
const INTRO_N = 3;
let introIdx = 0, introAns = [];

function introAnswers(){
  try{ return JSON.parse(localStorage.getItem(INTRO_KEY)) || null; }catch(e){ return null; }
}

/* What follows the room scene: the walkthrough, always. The room says why
   this exists; the tour says what it does. Those two belong together, and
   nothing should come between them.

   The questions used to sit in this gap. They now run off the end of the
   tour instead — see tourEnd. */
function openingNext(replay){
  if(replay) tourStart(); else tourMaybeAutostart();
}

/* First visit only: someone replaying the opening wants to see the
   walkthrough again, not to be asked the same three things a second
   time. */
function introMaybeStart(){
  if(onboardSeen(INTRO_SEEN)) return false;
  introStart();
  return true;
}

/* The walkthrough scrolls the page to whatever it is pointing at, and its
   last step points at the notice near the foot of the home view. So the
   moment onboarding finished, the reader was left 651px down — headline
   above the top of the screen, PHQ-4 above that, and the first thing in
   view a statistic. After being told what the site is for, the one thing
   that should be in front of them is the thing to start.

   Instant rather than smooth: this is a return to a known place at the end
   of a sequence, not a movement worth following, and a half-second glide
   here reads as the page still doing something to you. */
function onboardingDone(){
  try{ window.scrollTo({ top:0, behavior:"instant" }); }
  catch(e){ window.scrollTo(0,0); }
}

function introRender(){
  document.getElementById("introStatement").textContent = T.ui.introStatements[introIdx];
  document.getElementById("introDots").textContent =
    "●".repeat(introIdx + 1) + "○".repeat(INTRO_N - introIdx - 1);
}

function introStart(){
  introIdx = 0; introAns = [];
  document.getElementById("intro").hidden = false;
  introRender();
  setTimeout(()=> document.getElementById("introYes").focus(), 260);
}

function introFinish(saved){
  document.getElementById("intro").hidden = true;
  onboardMark(INTRO_SEEN);
  /* the answers themselves are the person's, not a version flag — they
     survive an ONBOARD_V bump untouched */
  if(saved){ try{ localStorage.setItem(INTRO_KEY, JSON.stringify(introAns)); }catch(e){} }
  applyIntroTailoring();
  onboardingDone();
}

function introAnswer(yes){
  introAns.push(yes);
  if(introIdx < INTRO_N - 1){ introIdx++; introRender(); }
  else introFinish(true);
}

/* The payoff. Someone who says they would struggle to describe how they
   feel to a doctor is exactly who the clinician sheet was built for, so
   that is surfaced for them rather than left to be discovered. */
function applyIntroTailoring(){
  const a = introAnswers();
  const el = document.getElementById("sheetNudge");
  if(el) el.hidden = !(a && a[1] === true);
}

document.getElementById("introYes").addEventListener("click", ()=> introAnswer(true));
document.getElementById("introNo").addEventListener("click", ()=> introAnswer(false));
document.getElementById("introSkip").addEventListener("click", ()=> introFinish(false));
document.getElementById("intro").addEventListener("keydown", e=>{
  if(e.key === "Escape") introFinish(false);
});

/* ════════ guided tour ════════
   Five real controls, in the order someone would meet them: change how
   the page looks, pick a screener, know the numbers are always there,
   understand why the project exists, know exactly what it claims to be.
   Targets are CSS selectors resolved fresh on every step rather than
   cached elements, so a step degrades to "skip it" instead of "point at
   nothing" if a selector ever stops matching — the tour is a courtesy,
   not something worth a blank spotlight over. */
const TOUR_KEY = "psych-seen-tour";
const TOUR_ALL = [
  { sel:"#cardGrid .card",               key:"tourScreeners" },
  { sel:".topstrip",                     key:"tourCrisis" },
  { sel:"#setBtn",                       key:"tourSettings" },
  /* Installing is the step that makes the offline promise real, and it was
     the one thing the tour never mentioned — the button sits inside the
     settings popover, three taps deep, where nobody finds it by accident.
     `panel` says this step needs that popover open to point at anything.
     `when` decides whether the step exists at all: the browser only lets
     us offer an install when it has fired beforeinstallprompt, which is
     also what sets the button's display, so that is the honest test. On a
     browser that cannot install, or one where the app already is, the step
     is not in the tour rather than pointing at something invisible. */
  { sel:"#installBtn", key:"tourInstall", panel:true,
    when:()=>{ const b = document.getElementById("installBtn");
               return !!b && b.style.display && b.style.display !== "none"; } },
  { sel:'a.bcard[href="manifesto.html"]',key:"tourManifesto" },
  { sel:"details.notice",                key:"tourHowThis" }
];
/* The steps this particular run will show. Filtered at tourStart, because
   "Step 3 of 6" has to count the steps a person is actually going to see —
   a step skipped at render time left the total overstating the tour. */
let TOUR_STEPS = TOUR_ALL;
/* beforeinstallprompt lands after the tour has usually already started, so
   the step is spliced back into its proper place — but only ahead of where
   the reader currently is, because moving a step they have already passed
   would renumber the ones behind them. */
function tourAddInstallStep(){
  const tour = document.getElementById("tour");
  if(!tour || tour.hidden) return;
  if(TOUR_STEPS.some(s=> s.key === "tourInstall")) return;
  const step = TOUR_ALL.find(s=> s.key === "tourInstall");
  if(!step || !tourAvailable(step)) return;
  const at = TOUR_ALL.indexOf(step);
  let pos = TOUR_STEPS.findIndex(s=> TOUR_ALL.indexOf(s) > at);
  if(pos === -1) pos = TOUR_STEPS.length;
  if(pos <= tourIdx) return;
  TOUR_STEPS = TOUR_STEPS.slice(0, pos).concat([step], TOUR_STEPS.slice(pos));
  document.getElementById("tourProgress").innerHTML =
    TOUR_STEPS.map(()=> "<i></i>").join("");
  tourPlace();
}
/* The reader's language first, English second — the same fallback the rest
   of the untranslated page uses, so a new step reads in English in mr, bn,
   ta and te instead of not existing. */
function tourText(key){
  const mine = T.ui.tour && T.ui.tour[key];
  if(mine && mine.t) return mine;
  const en = window.I18N && window.I18N.en;
  const alt = en && en.ui.tour && en.ui.tour[key];
  return alt && alt.t ? alt : null;
}
function tourAvailable(s){
  if(s.when && !s.when()) return false;
  const el = document.querySelector(s.sel);
  if(!el) return false;
  /* An element inside a closed popover has no layout box at all, so a step
     that opens the popover is judged on its `when` alone. */
  return s.panel ? true : el.getClientRects().length > 0;
}
/* 4.8s a box. The earlier 2.8s was long enough to see a box but not to
   finish reading one — two sentences is more than a two-second glance,
   especially for anyone reading a second language. Four transitions at
   this rate reach the final box in about 19s, where it waits. */
const TOUR_STEP_MS = 6500;
let tourIdx = 0, tourTimer = null, tourPaused = false, tourPlacedAt = 0, tourRepaint = null;

function tourMaybeAutostart(){
  const seen = onboardSeen(TOUR_KEY);
  /* Reduced-motion readers get the walkthrough too. It used to be withheld
     from them entirely, which meant the people most likely to be on an
     older phone got no explanation of the site at all. The thing that was
     actually unsafe for them is the auto-advance, and tourArmTimer already
     refuses to run it — so for them the tour simply waits on Next, which
     is what it should have done from the start. */
  if(!seen){ tourStart(); return; }
  /* Tour already behind them but the questions never ran — someone who
     skipped out of the tour on a first visit. Don't strand them. */
  introMaybeStart();
}

function tourTarget(){
  for(let i=tourIdx; i<TOUR_STEPS.length; i++){
    const el = document.querySelector(TOUR_STEPS[i].sel);
    if(el){ tourIdx = i; return el; }
  }
  return null;
}

const TOUR_MOTION_OK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function tourArmTimer(){
  clearTimeout(tourTimer); tourTimer = null;
  /* A tour that advances itself while someone is trying to read it, or
     for a reader who has asked for no automatic motion at all, is worse
     than one that waits — Next/Prev/Skip stay the real controls either
     way, this is only ever a courtesy on top of them. */
  if(!TOUR_MOTION_OK || tourPaused) return;
  if(tourIdx >= TOUR_STEPS.length - 1) return;   /* last step: wait for a real choice */
  tourTimer = setTimeout(()=> tourStep(1), TOUR_STEP_MS);
}
function tourSetPaused(p){
  tourPaused = p;
  document.getElementById("tour").style.setProperty("--tour-play", p ? "paused" : "running");
  if(p) clearTimeout(tourTimer); else tourArmTimer();
}

function tourPlace(){
  const el = tourTarget();
  if(!el){ tourEnd(); return; }
  const step = TOUR_STEPS[tourIdx], tt = tourText(step.key);
  /* No copy in this language and none in English either: skip the step
     rather than throw. Reading .t off undefined would have taken the whole
     tour down in the four languages that do not carry the newest strings —
     which is exactly how a step gets added and quietly breaks four
     translations at once. */
  if(!tt){
    TOUR_STEPS = TOUR_STEPS.filter((s,i)=> i !== tourIdx);
    if(!TOUR_STEPS.length || tourIdx >= TOUR_STEPS.length){ tourEnd(); return; }
    tourPlace(); return;
  }
  document.getElementById("tourTitle").textContent = tt.t;
  document.getElementById("tourBody").textContent = tt.b;
  document.getElementById("tourCount").textContent =
    fmt(T.ui.tourCount, {n:tourIdx+1, total:TOUR_STEPS.length});
  document.getElementById("tourPrev").disabled = tourIdx === 0;
  document.getElementById("tourNext").textContent =
    tourIdx === TOUR_STEPS.length-1 ? T.ui.tourDone : T.ui.tourNext;

  const prog = document.getElementById("tourProgress");
  prog.querySelectorAll("i").forEach((seg,i)=>{
    seg.className = i < tourIdx ? "done" : i === tourIdx ? "run" : "";
  });
  tourPlacedAt = Date.now();
  tourArmTimer();

  /* The install button lives inside the settings popover, so a step that
     points at it has to open the popover first — synchronously, before the
     measurement below, or the ring is drawn around an element with no
     layout box. Every other step closes it again, so the tour never leaves
     it hanging open behind a spotlight somewhere else. */
  toggleSettings(!!step.panel);
  document.body.classList.toggle("tour-in-panel", !!step.panel);
  document.querySelectorAll(".tour-target").forEach(n=> n.classList.remove("tour-target"));
  if(step.panel) el.classList.add("tour-target");
  /* the ring and its arrow are both inside .tour, so on a panel step they
     would be drawn underneath the popover — hidden rather than misleading */
  document.getElementById("tourRing").style.visibility  = step.panel ? "hidden" : "";
  document.getElementById("tourArrow").style.visibility = step.panel ? "hidden" : "";

  /* The scroll jump is always instant — the ring's own CSS transition is
     what supplies the sense of motion between steps. A smooth scroll
     racing a smooth ring animation, measured after a fixed delay, is
     exactly the setup that goes stale under fast repeated presses: the
     ring ends up measured mid-flight against a scroll that had not
     finished settling. Instant scroll + one rAF measurement has nothing
     to race — but "instant" has to be spelled that way explicitly.
     behavior:"auto" does not mean instant; it means "defer to the page's
     own scroll-behavior", which site.css sets to smooth on <html> for
     anchor links. Passing "auto" here silently re-smooths every jump and
     reproduces exactly the staleness this rAF rewrite was meant to fix. */
  /* A target inside the settings popover cannot be scrolled "into view" —
     the popover hangs off a sticky nav, so it travels with the scroll and
     scrollIntoView chases it, landing the ring on whatever ends up under
     the old coordinates. (It landed on a screener card's "4 questions ·
     ~1 min" line.) The nav is at the top of the document, so going to the
     top is what actually puts that button on screen. */
  if(step.panel) window.scrollTo({ top:0, behavior:"instant" });
  else el.scrollIntoView({ block:"center", behavior:"instant" });
  const paint = ()=>{
    /* The popover is a scroller of its own once it is taller than the room
       it has. Bring the row this step is about into that scroller before
       measuring, or the ring is drawn around a button parked outside it. */
    if(step.panel){
      const sp = document.getElementById("setPanel");
      if(sp && sp.scrollHeight > sp.clientHeight + 1){
        sp.scrollTop = Math.max(0, el.offsetTop - 8);
      }
    }
    const r = el.getBoundingClientRect(), pad = 6;
    const ring = document.getElementById("tourRing");
    ring.style.top    = (r.top - pad) + "px";
    ring.style.left   = (r.left - pad) + "px";
    ring.style.width  = (r.width + pad*2) + "px";
    ring.style.height = (r.height + pad*2) + "px";

    const card = document.getElementById("tourCard");
    const cw = card.offsetWidth, chh0 = card.offsetHeight;
    /* Where the bubble is *going*, not where it is. It animates into place
       over .45s, so reading its rect now returns the previous step's spot
       and every arrow decision made from it would be a step behind. */
    let c;
    if(window.innerWidth > 640){
      card.style.right = card.style.bottom = "";
      const below = r.bottom + 16 + chh0 < innerHeight;
      const cTop  = below ? r.bottom + 16 : Math.max(16, r.top - 16 - chh0);
      let cLeft = Math.min(Math.max(16, r.left), innerWidth - cw - 16);
      /* The bubble was landing on top of the popover it was describing —
         they both want the right-hand side. The popover is anchored there,
         so the bubble takes the room beside it. */
      if(step.panel){
        const pr = document.getElementById("setPanel").getBoundingClientRect();
        if(pr.width) cLeft = Math.max(16, pr.left - cw - 24);
      }
      card.style.top  = cTop + "px";
      card.style.left = cLeft + "px";
      c = { left:cLeft, top:cTop, right:cLeft + cw, bottom:cTop + chh0 };
    } else {
      /* pinned as a bottom sheet by CSS, so it does not travel between
         steps and its current rect is already the settled one */
      const b = card.getBoundingClientRect();
      c = { left:b.left, top:b.top, right:b.right, bottom:b.bottom };
    }

    /* Aim the arrow along the line from the bubble to the target and park
       it just outside the ring, so it always reads as "from me, to that"
       whichever side the bubble ended up on. */
    {
      const tx = r.left + r.width/2,  ty = r.top + r.height/2;
      const cx = (c.left + c.right)/2, cy = (c.top + c.bottom)/2;
      const ang = Math.atan2(ty - cy, tx - cx);
      const hw = r.width/2 + pad, hh = r.height/2 + pad;

      /* Try standing points around the highlight and take the first with
         clear air: preferred is the side facing the bubble, then the two
         flanks, then straight past it. Wherever it ends up it is aimed
         back at the highlight, so the reading is the same.

         Placing it by formula alone kept failing on one case or another —
         the half-diagonal parked it 580px from a wide, short target; the
         bubble's own edge overshot small targets it already enclosed and
         aimed the arrow backwards; a single flip to the far side still
         landed inside a bubble that spanned both. Trying candidates and
         checking each is what actually holds for every step. */
      const offsets = [Math.PI, Math.PI/2, -Math.PI/2, 0,
                       3*Math.PI/4, -3*Math.PI/4, Math.PI/4, -Math.PI/4];
      let ax = null, ay = null, dir = ang;
      for(const off of offsets){
        const phi = ang + off;
        const ex = Math.cos(phi), ey = Math.sin(phi);
        /* where this heading leaves the ring, plus a margin */
        const ee = Math.min(
          Math.abs(ex) > 1e-6 ? hw/Math.abs(ex) : Infinity,
          Math.abs(ey) > 1e-6 ? hh/Math.abs(ey) : Infinity
        );
        const mm = (isFinite(ee) ? ee : 0) + 26;
        const qx = tx + ex*mm, qy = ty + ey*mm;
        const overBubble = qx > c.left - 8 && qx < c.right  + 8 &&
                           qy > c.top  - 8 && qy < c.bottom + 8;
        const onScreen = qx > 34 && qx < innerWidth - 34 &&
                         qy > 34 && qy < innerHeight - 34;
        if(!overBubble && onScreen){ ax = qx; ay = qy; dir = phi + Math.PI; break; }
      }
      const arrow = document.getElementById("tourArrow");
      /* nowhere clear — a tiny viewport with a bubble covering most of it.
         Hiding beats drawing an arrow across the words. */
      arrow.style.opacity = ax === null ? "0" : "1";
      if(ax !== null){
        arrow.style.transform =
          "translate(" + ax + "px," + ay + "px) rotate(" + dir + "rad)";
      }
    }
  };

  requestAnimationFrame(paint);
  /* Paint again once everything has stopped moving. The ring and bubble
     animate into place over .45s, and a target carrying .reveal slides up
     14px as it enters view — enough, at the distances involved here, to
     leave the arrow aimed several degrees wide of what it is pointing at.
     Cheap to redo, and it is the difference between "points at it" and
     "points near it". */
  clearTimeout(tourRepaint);
  tourRepaint = setTimeout(paint, 560);
}

function tourStart(){
  tourIdx = 0; tourPaused = false;
  toggleSettings(false);
  TOUR_STEPS = TOUR_ALL.filter(tourAvailable);
  if(!TOUR_STEPS.length){ TOUR_STEPS = TOUR_ALL; }
  document.getElementById("tourProgress").innerHTML =
    TOUR_STEPS.map(()=> "<i></i>").join("");
  document.getElementById("tour").style.setProperty("--tour-dur", TOUR_STEP_MS + "ms");
  document.getElementById("tour").hidden = false;
  /* Marked here rather than only in tourEnd. It used to be written when
     the tour finished, which meant closing the tab halfway through — or
     on a phone, taking a call — left the flag unwritten, and the tour
     opened over the page again on the next load, and the one after that,
     for ever. An unfinished walkthrough is still a walkthrough that
     happened to you; the way back is the Watch the intro button on the
     page, which is deliberate and always there. */
  onboardMark(TOUR_KEY);
  tourPlace();
  addEventListener("resize", tourPlace);
  setTimeout(()=> document.getElementById("tourNext").focus(), 300);
}
function tourEnd(){
  clearTimeout(tourTimer); tourTimer = null;
  document.getElementById("tour").hidden = true;
  removeEventListener("resize", tourPlace);
  /* leaving from the install step must not strand the popover open, nor
     leave the nav lifted above everything else */
  toggleSettings(false);
  document.body.classList.remove("tour-in-panel");
  document.querySelectorAll(".tour-target").forEach(n=> n.classList.remove("tour-target"));
  document.getElementById("tourRing").style.visibility = "";
  document.getElementById("tourArrow").style.visibility = "";
  onboardMark(TOUR_KEY);
  /* The three opening questions come last, not first. Asking someone what
     they believe about getting help before they have any idea what this
     site is, is asking a stranger for an opinion at the door — on a phone,
     where the questions fill the whole screen, it read as the site itself.
     After the walkthrough there is something to have an opinion about. */
  /* If the questions run they own the screen and will land the reader
     themselves when they finish; only send them home when nothing else
     is coming. */
  if(!introMaybeStart()) onboardingDone();
}
function tourStep(delta){
  const n = tourIdx + delta;
  if(n < 0) return;
  if(n >= TOUR_STEPS.length){ tourEnd(); return; }
  tourIdx = n; tourPlace();
}

/* pause the auto-advance while a mouse is actually resting on the card,
   and resume once it leaves — real hovering, not the focus tourStart()
   sets programmatically so a keyboard/screen-reader user knows where they
   landed. Wiring focusin the same way as pointerenter looked right and
   was wrong: that opening focus() call fires focusin on this same card,
   so the tour would pause itself the instant it opened and never resume,
   since nothing ever moves focus back out on its own. Keyboard users
   already have a full manual override — the arrow keys — so they are not
   left without a way to control the pace, they just do not get this
   particular courtesy. Touch has no hover to key off, so a tap anywhere
   on the card is treated the same as a mouse arriving: it pauses, and
   whoever tapped now drives with Next/Prev like they would on any other
   step-through UI. */
document.getElementById("tourCard").addEventListener("pointerenter", ()=>{
  /* Chromium (and to a lesser extent other engines) re-checks :hover after
     a layout shift, so when the spotlight jumps to a new spot it can fire
     a pointerenter purely because a stationary cursor now happens to sit
     over the card's new position — nobody moved anything. That reads as
     "arrived to read" and would pause a step the reader has not actually
     looked at yet. Real arrival takes at least a beat after the card
     appears there; a same-instant firing is the reflow, not a person.
     Measured: the spurious one fires ~100ms after tourPlace(); reacting
     to a just-appeared element with a deliberate mouse move takes longer
     than that for an actual person. 150ms clears the artifact with room
     to spare, without making a real quick hover wait. */
  if(Date.now() - tourPlacedAt > 150) tourSetPaused(true);
});
document.getElementById("tourCard").addEventListener("pointerleave", ()=> tourSetPaused(false));
document.getElementById("tourCard").addEventListener("touchstart", ()=> tourSetPaused(true), {passive:true});

document.getElementById("startTour").addEventListener("click", ()=>{ toggleSettings(false); tourStart(); });
/* the one obvious way back to the whole opening, on the page itself
   rather than behind the settings panel where nobody found it */
document.getElementById("tourCta").addEventListener("click", playOpening);
/* stopPropagation because a click anywhere on the document closes the
   settings popover, and the install step needs it open — without this,
   pressing Next to arrive at that step opens the panel and then the same
   click closes it again on its way up. Same guard setPanel already uses. */
document.getElementById("tourNext").addEventListener("click", e=>{ e.stopPropagation(); tourStep(1); });
document.getElementById("tourPrev").addEventListener("click", e=>{ e.stopPropagation(); tourStep(-1); });
document.getElementById("tourSkip").addEventListener("click", e=>{ e.stopPropagation(); tourEnd(); });
/* The backdrop swallows the tap and does nothing else. It used to end the
   tour, which is the one dismissal nobody chooses on purpose: on a phone
   the dimmed area is most of the screen, so a thumb landing anywhere off
   the card — reaching for the thing being pointed at, steadying the
   handset — closed the only explanation of what this site is, with no way
   back that a first-time reader would find.

   Skip is still right there on the card, and Escape still works, because
   a walkthrough somebody cannot leave is the wrong thing to put in front
   of a person who may be in distress. This makes leaving deliberate, not
   difficult. */
document.getElementById("tourBlock").addEventListener("click", e=> e.stopPropagation());
document.getElementById("tour").addEventListener("keydown", e=>{
  if(e.key === "Escape") tourEnd();
  else if(e.key === "ArrowRight") tourStep(1);
  else if(e.key === "ArrowLeft")  tourStep(-1);
  else if(e.key === "Tab"){
    /* .tour-block only stops pointer events — without this, Tab still
       walks into the dimmed, inert page behind the card, which is the
       usual way a "modal" dialog turns out not to be one. */
    const f = [...document.getElementById("tourCard").querySelectorAll("button:not(:disabled)")];
    const i = f.indexOf(document.activeElement);
    e.preventDefault();
    const n = e.shiftKey ? (i <= 0 ? f.length-1 : i-1) : (i === f.length-1 ? 0 : i+1);
    f[n < 0 ? 0 : n].focus();
  }
});

renderStats();
observeReveals();

/* ════════ start ════════
   Last statement in the file, so every declaration above it exists. */
/* The reader's own language was requested from the head script, roughly
   1,700 lines ago, and may or may not have landed by now — it is no longer
   parser-blocking, which is most of where the saved time comes from. So
   boot when it arrives rather than assuming it already has; loadLang
   returns immediately if it did, and carries the retry that used to live
   here. */
loadLang(window.LANG0 || "en", got=>{
  if(got) boot();
  else if((window.LANG0 || "en") !== "en") loadLang("en", g=> g ? boot() : bootFailed());
  else bootFailed();
});

if(location.hash){
  const v = location.hash.slice(1);
  if(["home","guide","history","resources"].includes(v)) showView(v);
}
