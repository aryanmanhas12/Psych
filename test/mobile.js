/* ══════════════════════════════════════════════════════════════
   Psych Screener — mobile regression suite
   ──────────────────────────────────────────────────────────────
   Every check here exists because something broke in the real
   world first, on a real phone, and was reported. It lives in the
   repo rather than in a scratch directory because the whole point
   is that it can be re-run after any change.

     node test/mobile.js            (serve the repo on :8099 first)

   Requires playwright. Chromium path is overridable with
   PW_CHROME=/path/to/chrome.
   ══════════════════════════════════════════════════════════════ */
const { chromium } = require('playwright');
const URL = process.env.PSYCH_URL || 'http://127.0.0.1:8099/index.html';
const BASE = URL.replace(/index\.html$/, '');
/* The pinned path is the browser that ships in the dev container. On CI —
   and on anyone else's machine — it does not exist, and Playwright's own
   resolution is right. Explicit PW_CHROME still wins over both. */
const LOCAL_CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const EXE = process.env.PW_CHROME
  || (require('fs').existsSync(LOCAL_CHROME) ? LOCAL_CHROME : null);

let FAILS = [];
const fail = m => { FAILS.push(m); console.log('   \x1b[31m✗\x1b[0m ' + m); };
const ok   = m => console.log('   \x1b[32m✓\x1b[0m ' + m);
const head = m => console.log('\n\x1b[1m' + m + '\x1b[0m');
const seen = ()=> ['psych-seen-overture','psych-seen-tour','psych-seen-intro']
                   .forEach(k=>localStorage.setItem(k,'2'));

/* The primer sits between tapping a screener and question one, once per
   instrument. Tests that walk questions have to get past it — and must
   assert it appeared, because a silently-missing primer would otherwise
   let a question loop "pass" by finding no questions at all. */
async function pastPrimer(p, label){
  const shown = await p.evaluate(()=> {
    const el = document.getElementById('primer');
    return !!el && !el.hidden;
  });
  if (shown) { await p.evaluate(()=>document.getElementById('primerStart').click());
               await p.waitForTimeout(250); }
  else if (label) fail(`${label}: primer did not appear before question one`);
  return shown;
}

/* WCAG contrast of an element against whatever is actually painted behind it */
const CR = `(sel)=>{
  const lin=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);};
  const lum=s=>{const m=s.match(/\\d+(\\.\\d+)?/g).map(Number);return 0.2126*lin(m[0])+0.7152*lin(m[1])+0.0722*lin(m[2]);};
  const bg=el=>{let n=el;while(n){const b=getComputedStyle(n).backgroundColor;
    if(b&&!/rgba\\(0, 0, 0, 0\\)|transparent/.test(b))return b;n=n.parentElement;}return 'rgb(255,255,255)';};
  const el=document.querySelector(sel); if(!el)return null;
  const a=lum(getComputedStyle(el).color),b=lum(bg(el));
  const hi=Math.max(a,b),lo=Math.min(a,b);
  return Math.round(((hi+0.05)/(lo+0.05))*100)/100;}`;

/* Anything that pushes the document wider than the screen. Elements inside a
   deliberate horizontal scroller, and the off-screen skip link, are exempt. */
const OVERFLOW = `(()=>{
  const vw=document.documentElement.clientWidth,out=[];
  for(const el of document.querySelectorAll('body *')){
    const cs=getComputedStyle(el);
    if(cs.display==='none'||cs.visibility==='hidden')continue;
    const r=el.getBoundingClientRect();
    if(!r.width&&!r.height)continue;
    if(el.classList.contains('skip')||r.right<0)continue;
    if(r.right<=vw+1&&r.left>=-1)continue;
    let sc=el.parentElement,inScroll=false;
    while(sc&&sc!==document.body){const o=getComputedStyle(sc).overflowX;
      if(o==='auto'||o==='scroll'){inScroll=true;break;}sc=sc.parentElement;}
    if(inScroll)continue;
    out.push((el.id?'#'+el.id:el.tagName)+' '+Math.round(r.width)+'w');
  }
  return {scrollW:document.documentElement.scrollWidth,vw,over:out.slice(0,4)};})()`;

(async () => {
  const b = await chromium.launch(EXE ? { executablePath: EXE } : {});
  const phone = extra => ({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, ...extra });

  /* ── the guard that was missing ──
     The speaker button on every question threw a ReferenceError on every
     tap, in every language, for as long as it existed — `currentLang` was
     never declared. Nothing here caught it, because nothing here was
     listening for an uncaught exception outside the two places that
     deliberately break the page. So every page this suite opens now
     reports its own exceptions, and any of them fails the run. This one
     listener is worth more than all the feature checks below it. */
  const PAGE_ERRORS = [];
  const _newContext = b.newContext.bind(b);
  b.newContext = async (...a) => {
    const ctx = await _newContext(...a);
    const _newPage = ctx.newPage.bind(ctx);
    ctx.newPage = async (...q) => {
      const pg = await _newPage(...q);
      pg.on('pageerror', e => PAGE_ERRORS.push(e.message));
      return pg;
    };
    return ctx;
  };

  /* 1 ── reflow: no sideways scrolling at any width or text size.
         Reported with a recording: menu links cut off, "Start →" sliced,
         "History" clipped to "Histo". WCAG 1.4.10. */
  head('1. REFLOW — 7 widths × 3 text sizes × menu open/closed');
  {
    let bad = 0, n = 0;
    for (const open of [false,true])
    for (const scale of [1,1.15,1.35])
    for (const w of [320,360,375,390,412,414,430]) {
      const ctx = await b.newContext({ viewport:{width:w,height:844}, isMobile:true, hasTouch:true });
      const p = await ctx.newPage();
      await p.goto(URL);
      await p.evaluate(s=>{['psych-seen-overture','psych-seen-tour','psych-seen-intro'].forEach(k=>localStorage.setItem(k,'2'));
                           localStorage.setItem('psych-prefs',JSON.stringify({scale:s}));},scale);
      await p.goto(URL,{waitUntil:'networkidle'});
      await p.waitForTimeout(400);
      if (open) { await p.evaluate(()=>{const t=document.querySelector('nav.site .navtoggle');if(t)t.click();}); await p.waitForTimeout(300); }
      const m = await p.evaluate(OVERFLOW);
      n++;
      if (m.scrollW > m.vw+1 || m.over.length) { bad++;
        fail(`${w}px @${scale} menu-${open?'open':'shut'}: ${m.scrollW}>${m.vw} ${m.over.join(', ')}`); }
      await ctx.close();
    }
    if (!bad) ok(`all ${n} combinations reflow cleanly`);
  }

  /* 2 ── the opening sequence, including the states that broke it */
  head('2. OPENING SEQUENCE');
  {
    const ctx = await b.newContext(phone()); const p = await ctx.newPage();
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));

    // a device carrying flags from an older build must still be shown the new opening
    await p.goto(URL);
    await p.evaluate(()=>['psych-seen-overture','psych-seen-tour','psych-seen-intro'].forEach(k=>localStorage.setItem(k,'1')));
    await p.goto(URL,{waitUntil:'networkidle'});
    await p.waitForTimeout(700);
    let s = await p.evaluate(()=>!document.getElementById('overture').hidden);
    s?ok('a phone with old flags is shown the rebuilt opening'):fail('old flags still suppress the opening');

    // changing language mid-scene must replay it, not freeze it
    await p.waitForTimeout(2500);
    await p.evaluate(()=>{const bs=[...document.querySelectorAll('.ot-langs button')];
                          (bs.find(x=>x.textContent.trim()==='हिन्दी')||bs[1]).click();});
    await p.waitForTimeout(500);
    let r = await p.evaluate(()=>({lang:document.documentElement.lang,
                                   running:document.getElementById('otBar').classList.contains('run'),
                                   up:!document.getElementById('overture').hidden}));
    r.lang==='hi'?ok('language switches mid-scene'):fail('language did not switch');
    (r.running&&r.up)?ok('scene replays instead of freezing'):fail('scene froze on language change');
    await p.waitForTimeout(8000);
    r = await p.evaluate(()=>document.getElementById('otFigA').getAttribute('class'));
    /warmed/.test(r)?ok('plays through to the final beat'):fail('never reached the last beat: '+r);

    // hands off to the walkthrough, then the questions
    await p.waitForTimeout(2500);
    r = await p.evaluate(()=>!document.getElementById('tour').hidden);
    r?ok('walkthrough follows the scene'):fail('walkthrough did not open');
    for(let i=0;i<5;i++){ const n=await p.$('#tourNext'); if(n){await n.click(); await p.waitForTimeout(500);} }
    await p.waitForTimeout(600);
    r = await p.evaluate(()=>!document.getElementById('intro').hidden);
    r?ok('the three questions follow the walkthrough'):fail('questions never appeared');
    for(let i=0;i<3;i++){ const y=await p.$('#introYes'); if(y&&await y.isVisible()){await y.click(); await p.waitForTimeout(400);} }

    // and the reader is put back at the top, not left where the tour scrolled to
    await p.waitForTimeout(700);
    const land = await p.evaluate(()=>({y:Math.round(scrollY),
      card:Math.round(document.querySelector('#cardGrid .card').getBoundingClientRect().top)}));
    land.y<50?ok(`lands at the top (scrollY ${land.y}, first screener at y=${land.card})`)
             :fail(`lands mid-page at scrollY ${land.y} — headline and PHQ-4 off screen`);
    errs.length?fail('JS: '+[...new Set(errs)].join('; ')):ok('no JS errors through the whole sequence');
    await ctx.close();
  }

  /* 3 ── the opening must never block someone who came for a number */
  head('3. CRISIS PATH IS NEVER INTERRUPTED');
  {
    const ctx = await b.newContext(phone()); const p = await ctx.newPage();
    await p.goto(BASE+'index.html#resources',{waitUntil:'networkidle'});
    await p.waitForTimeout(1500);
    const s = await p.evaluate(()=>['overture','tour','intro'].some(i=>!document.getElementById(i).hidden));
    !s?ok('a #resources deep link opens straight to the numbers'):fail('onboarding interrupted a deep link');
    await ctx.close();
  }

  /* 4 ── contrast, both themes and high contrast. The crisis strip was
         2.90:1 in dark mode; the No button was 1:1 in high contrast. */
  head('4. CONTRAST');
  for (const [scheme,hc] of [['light',false],['dark',false],['light',true]]) {
    const ctx = await b.newContext(phone({colorScheme:scheme})); const p = await ctx.newPage();
    await p.goto(URL); await p.evaluate(seen);
    await p.goto(URL,{waitUntil:'networkidle'});
    if (hc) await p.evaluate(()=>document.documentElement.setAttribute('data-contrast','high'));
    await p.evaluate(()=>{ if(typeof introStart==='function') introStart(); });
    await p.waitForTimeout(500);
    const label = scheme + (hc?'+highcontrast':'');
    /* The nav's own controls were never in this list, which is how a
       settings button at 1.07:1 in dark mode survived. It holds the
       language switch — the control a reader who cannot read the page
       needs first — so it was invisible to exactly the person it is for. */
    for (const [sel,name] of [['.topstrip','crisis strip'],['.topstrip a','helpline number'],
                              ['nav.site .brand','brand'],['nav.site .navtoggle','menu button'],
                              ['#setBtn','settings button'],
                              ['.intro-no','No button'],['.intro-yes','Yes button'],['.intro-card p','statement']]) {
      const v = await p.evaluate(`(${CR})(${JSON.stringify(sel)})`);
      if (v===null) continue;
      v>=4.5 ? ok(`${label}: ${name} ${v}:1`) : fail(`${label}: ${name} ${v}:1 (needs 4.5)`);
    }
    /* Pressed states are their own pairing: --marigold is a light gold in
       the normal themes and a dark gold under high contrast, so no single
       flipping token works on it. Measured open as well as shut. */
    await p.evaluate(()=>document.getElementById('setBtn').click());
    await p.waitForTimeout(300);
    const openC = await p.evaluate(`(${CR})('#setBtn')`);
    if (openC !== null) openC>=4.5 ? ok(`${label}: settings button while open ${openC}:1`)
                                   : fail(`${label}: settings button while open ${openC}:1 (needs 4.5)`);
    /* The language code sits INSIDE that button and carries its own colour,
       so the button passing says nothing about it. It was marigold on a
       marigold fill — 1:1, invisible — in both themes, on the control a
       reader who cannot read this page has to find first. */
    const openL = await p.evaluate(`(${CR})('#setLangCode')`);
    if (openL !== null) openL>=4.5 ? ok(`${label}: language code while open ${openL}:1`)
                                   : fail(`${label}: language code while open ${openL}:1 (needs 4.5)`);
    await ctx.close();
  }

  /* 5 ── a screener, end to end, plus the self-harm safety box */
  head('5. SCREENERS');
  {
    const ctx = await b.newContext(phone()); const p = await ctx.newPage();
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.goto(URL); await p.evaluate(seen);
    await p.goto(URL,{waitUntil:'networkidle'}); await p.waitForTimeout(600);
    for (const id of ['phq4','phq9','gad7','who5','auditc']) {
      await p.evaluate(i=>startTest(i), id); await p.waitForTimeout(400);
      await pastPrimer(p, id);
      let n=0;
      for(let k=0;k<30;k++){
        if(await p.evaluate(()=>document.getElementById('view-results').classList.contains('active'))) break;
        const before=await p.evaluate(()=>current?current.idx:-1);
        const hit=await p.evaluate(()=>{const bs=[...document.querySelectorAll('#qcard .bigopts button')];
          if(!bs.length)return false; bs[bs.length-1].click(); return true;});
        if(!hit) break; n++;
        await p.waitForFunction(x=>document.getElementById('view-results').classList.contains('active')||
          (current&&current.idx!==x), before,{timeout:3000}).catch(()=>{});
      }
      const r = await p.evaluate(()=>({done:document.getElementById('view-results').classList.contains('active'),
        safety:getComputedStyle(document.getElementById('safetyBox')).display!=='none'}));
      r.done?ok(`${id}: completes in ${n} taps${r.safety?'  [safety box shown]':''}`):fail(`${id}: never reached results`);
      if(id==='phq9'&&!r.safety) fail('PHQ-9 at worst answers did not raise the safety box');
      await p.evaluate(()=>{const a=[...document.querySelectorAll('.tabbar a')].find(x=>x.getAttribute('href')==='#home');if(a)a.click();});
      await p.waitForTimeout(300);
    }
    const hist=await p.evaluate(()=>JSON.parse(localStorage.getItem('psych-screener-history')||'[]').length);
    hist>=5?ok(`all ${hist} runs saved to history`):fail(`only ${hist} runs saved`);
    errs.length?fail('JS: '+[...new Set(errs)].join('; ')):ok('no JS errors');
    await ctx.close();
  }

  /* 6 ── the app must degrade, not die, when a file does not arrive.
         A blocked translation file used to throw and leave a blank page.
         It is i18n.en.js now rather than one 283KB i18n.js, and the retry
         moved into loadLang in the head — so this blocks every i18n.*.js
         to prove the split did not quietly drop the recovery with it. */
  head('6. DEGRADATION');
  {
    const ctx = await b.newContext(phone()); const p = await ctx.newPage();
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    let n=0;
    await p.route('**/i18n.*.js', r=>(++n===1)?r.abort():r.continue());
    await p.goto(URL,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(2500);
    let s=await p.evaluate(()=>({cards:document.querySelectorAll('#cardGrid .card').length,
                                 panel:!!document.querySelector('.loadfail')}));
    (s.cards>0&&!s.panel)?ok('a dropped translation file recovers on retry'):fail('did not recover on retry');
    errs.length?fail('threw: '+errs.join('; ')):ok('no uncaught exception');
    await ctx.close();

    const ctx2 = await b.newContext(phone()); const p2 = await ctx2.newPage();
    const errs2=[]; p2.on('pageerror',e=>errs2.push(e.message));
    await p2.route('**/i18n.*.js', r=>r.abort());
    await p2.goto(URL,{waitUntil:'domcontentloaded'}); await p2.waitForTimeout(2500);
    s=await p2.evaluate(()=>({panel:!!document.querySelector('.loadfail'),
                              tels:document.querySelectorAll('.topstrip a[href^="tel:"]').length}));
    s.panel?ok('a permanent failure explains itself instead of showing a blank page'):fail('blank page, no explanation');
    s.tels>=3?ok('helpline still callable when the strings never arrive'):fail('helpline lost');
    errs2.length?fail('threw: '+errs2.join('; ')):ok('no uncaught exception');
    await ctx2.close();
  }

  /* 7 ── offline is the project's stated promise */
  head('7. OFFLINE');
  {
    const ctx = await b.newContext(phone({serviceWorkers:'allow'})); const p = await ctx.newPage();
    await p.goto(URL,{waitUntil:'networkidle'});
    await p.evaluate(()=>navigator.serviceWorker.ready.catch(()=>null));
    await p.waitForTimeout(2500);
    await ctx.setOffline(true);
    let reached=true;
    try { await p.goto(URL,{waitUntil:'domcontentloaded',timeout:15000}); } catch(e){ reached=false; }
    if(!reached) fail('OFFLINE: page did not load');
    else {
      await p.waitForTimeout(1200);
      const s=await p.evaluate(()=>({tel:!!document.querySelector('.topstrip a[href^="tel:"]'),
                                     cards:document.querySelectorAll('#cardGrid .card').length}));
      (s.tel&&s.cards>0)?ok(`offline: helpline dialable, ${s.cards} screeners available`)
                        :fail('offline: strip or screeners missing');

      /* The languages are six files now, fetched one at a time. That saves
         52KB on the critical path and introduces exactly one new way to
         break: if the service worker stops precaching all six, an installed
         copy silently loses the ability to change language with no signal —
         for the reader least able to work around it. So switch language
         with the network off and check the page actually came out in it. */
      await p.evaluate(()=>setLang('ta'));
      await p.waitForTimeout(1200);
      const sw = await p.evaluate(()=>({lang:document.documentElement.lang,
                                        h1:(document.querySelector('h1')||{}).textContent||''}));
      (sw.lang==='ta' && /[\u0B80-\u0BFF]/.test(sw.h1))
        ? ok('offline: language switches, page renders in Tamil')
        : fail(`offline: language switch failed (lang=${sw.lang}) — are all six in the SW ASSETS?`);
    }
    await ctx.close();
  }

  /* 8 ── layout shift. The nav used to render 229px then collapse to 64. */
  head('8. LAYOUT STABILITY');
  {
    const ctx = await b.newContext(phone()); const p = await ctx.newPage();
    await p.goto(URL); await p.evaluate(seen);
    await p.goto(URL,{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
    const cls = await p.evaluate(()=>new Promise(res=>{
      let t=0; new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) t+=e.value;})
        .observe({type:'layout-shift',buffered:true});
      setTimeout(()=>res(Math.round(t*1000)/1000),300);}));
    cls<0.1?ok(`cumulative layout shift on load ${cls}`):fail(`layout shift ${cls} (good is under 0.1)`);
    await ctx.close();
  }

  /* 9 ── every page carries the same reachable crisis strip */
  head('9. EVERY PAGE');
  {
    const ctx = await b.newContext(phone()); const p = await ctx.newPage();
    for (const f of ['index.html','evidence.html','ethics.html','manifesto.html','global.html','poster.html']) {
      await p.goto(BASE+f,{waitUntil:'networkidle'}); await p.waitForTimeout(400);
      const m = await p.evaluate(OVERFLOW);
      const s = await p.evaluate(()=>{
        const tel=[...document.querySelectorAll('.topstrip a')];
        return {strip:!!document.querySelector('.topstrip'),
                minH:tel.length?Math.min(...tel.map(a=>Math.round(a.getBoundingClientRect().height))):null};});
      const issues=[];
      if(m.scrollW>m.vw+1) issues.push(`sideways scroll ${m.scrollW}>${m.vw}`);
      /* poster.html is an A4 print sheet; its numbers are printed on the sheet */
      if(!s.strip&&f!=='poster.html') issues.push('no crisis strip');
      if(s.minH!==null&&s.minH<24) issues.push(`helpline target ${s.minH}px < 24`);
      issues.length?fail(`${f}: ${issues.join('; ')}`):ok(`${f}: clean${s.strip?`, helpline targets ${s.minH}px`:' (poster: numbers printed on the sheet)'}`);
    }
    await ctx.close();

    /* The wordmark is allowed to shorten — it is the only thing in that row
       that can, and the language switch beside it must never be the thing
       that goes. It is not allowed to be sliced. It was: text-overflow sat
       on the anchor, which is inline-flex under a coarse pointer, and a
       flex container does not apply text-overflow to its items. Ten of
       twelve width-and-size combinations cut mid-letter. So: check the
       ellipsis is live on the box that actually overflows, and that at
       default text size the name fits outright on every phone width. */
    const c2 = await b.newContext(phone()); const p2 = await c2.newPage();
    for (const w of [360,390,412,430]) {
      await p2.setViewportSize({width:w,height:844});
      await p2.goto(URL,{waitUntil:'networkidle'}); await p2.waitForTimeout(250);
      const n = await p2.evaluate(()=>{const e=document.querySelector('nav.site .brand > .name');
        return e?{cw:e.clientWidth,sw:e.scrollWidth,to:getComputedStyle(e).textOverflow}:null;});
      if(!n){ fail(`brand: no .name box at ${w}px — ellipsis cannot apply`); continue; }
      if(n.to!=='ellipsis') fail(`brand @${w}px: text-overflow is ${n.to}, so it slices instead of trailing off`);
      else if(n.sw>n.cw+1) fail(`brand @${w}px: truncated at default text size (${n.cw} of ${n.sw}px)`);
      else ok(`brand @${w}px: fits at default text size (${n.sw}px), ellipsis live`);
    }
    await c2.close();
  }

  /* 9b ── the site offers six languages; a whole section of the home page
          was English in the markup, so a Hindi reader got through the
          screeners and hit a block of text they could not read. The five
          documents it links to are still English — that is a deliberate,
          stated limit — but the section introducing them is not, and it
          has to say so. Also checks the four languages without these
          strings fall back to the English in the markup rather than
          rendering empty, which is the failure mode data-i18n has when a
          key is missing. */
  head('9b. THE HOME PAGE IN HINDI');
  {
    const ctx = await b.newContext(phone()); const p = await ctx.newPage();
    const DEV = /[\u0900-\u097F]/;
    await p.goto(URL);
    await p.evaluate(l=>{['psych-seen-overture','psych-seen-tour','psych-seen-intro']
      .forEach(k=>localStorage.setItem(k,'2'));
      localStorage.setItem('psych-prefs',JSON.stringify({lang:l}));}, 'hi');
    await p.goto(URL,{waitUntil:'networkidle'}); await p.waitForTimeout(700);
    const r = await p.evaluate(()=>{
      const pick = s=> [...document.querySelectorAll(s)].map(e=>e.textContent.trim());
      return { title:(document.querySelector('[data-i18n="behindTitle"]')||{}).textContent||'',
               sub:(document.querySelector('[data-i18n="behindSub"]')||{}).textContent||'',
               note:(document.querySelector('[data-i18n="behindEnglish"]')||{}).textContent||'',
               titles:pick('.behind .bcard h3'), descs:pick('.behind .bcard p'),
               gos:pick('.behind .bcard .go') };
    });
    const latin = [];
    if(!DEV.test(r.title)) latin.push('section heading');
    if(!DEV.test(r.sub)) latin.push('section sub');
    r.titles.forEach((s,i)=>{ if(!DEV.test(s)) latin.push('card '+(i+1)+' title'); });
    r.descs.forEach((s,i)=>{ if(!DEV.test(s)) latin.push('card '+(i+1)+' description'); });
    r.gos.forEach((s,i)=>{ if(!DEV.test(s)) latin.push('card '+(i+1)+' link'); });
    latin.length ? fail(`hi: still English — ${latin.join(', ')}`)
                 : ok(`hi: "what's behind this" translated (${r.titles.length} cards, heading, sub and links)`);
    DEV.test(r.note) ? ok('hi: says the linked documents are in English')
                     : fail('hi: no note that the linked documents are English');
    await ctx.close();

    /* mr/bn/ta/te have no behind* strings yet: they must show the English
       left in the markup, not an empty card. */
    const c2 = await b.newContext(phone()); const p2 = await c2.newPage();
    await p2.goto(URL);
    await p2.evaluate(l=>{['psych-seen-overture','psych-seen-tour','psych-seen-intro']
      .forEach(k=>localStorage.setItem(k,'2'));
      localStorage.setItem('psych-prefs',JSON.stringify({lang:l}));}, 'mr');
    await p2.goto(URL,{waitUntil:'networkidle'}); await p2.waitForTimeout(700);
    const e2 = await p2.evaluate(()=>[...document.querySelectorAll('.behind .bcard h3, .behind .bcard p, .behind .bcard .go')]
                                       .filter(el=>!el.textContent.trim()).length);
    e2 ? fail(`mr: ${e2} empty nodes in the behind section — missing keys blanked the fallback`)
       : ok('mr: falls back to the English in the markup, nothing blank');
    await c2.close();
  }

  /* 10 ── the screen a patient actually spends their time on, in every
          language. Telugu at 320px/135% caught a horizontal scrollbar
          flickering on each question: the card slides in from 14px right,
          which extended the document for the length of the animation. */
  head('10. QUESTION SCREEN — all six languages');
  {
    for (const lang of ['en','hi','mr','bn','ta','te']) {
      const ctx = await b.newContext({ viewport:{width:320,height:800}, isMobile:true, hasTouch:true });
      const p = await ctx.newPage();
      await p.goto(URL);
      await p.evaluate(l=>{['psych-seen-overture','psych-seen-tour','psych-seen-intro'].forEach(k=>localStorage.setItem(k,'2'));
        localStorage.setItem('psych-prefs',JSON.stringify({lang:l,scale:1.35}));},lang);
      await p.goto(URL,{waitUntil:'networkidle'}); await p.waitForTimeout(400);
      await p.evaluate(()=>startTest('phq9')); await p.waitForTimeout(400);
      await pastPrimer(p, lang);
      let worst=0, small=0;
      for(let q=0;q<9;q++){
        const m=await p.evaluate(OVERFLOW);
        if(m.scrollW>worst) worst=m.scrollW;
        small += await p.evaluate(()=>[...document.querySelectorAll('#qcard .bigopts button')]
          .filter(x=>x.getBoundingClientRect().height<44).length);
        const before=await p.evaluate(()=>current?current.idx:-1);
        await p.evaluate(()=>{const bs=[...document.querySelectorAll('#qcard .bigopts button')];if(bs.length)bs[0].click();});
        await p.waitForFunction(x=>document.getElementById('view-results').classList.contains('active')||
          (current&&current.idx!==x),before,{timeout:3000}).catch(()=>{});
      }
      const bad=[];
      if(worst>321) bad.push(`sideways scroll ${worst}>320`);
      if(small) bad.push(`${small} answer button(s) under 44px`);
      bad.length?fail(`${lang} @320px/135%: ${bad.join('; ')}`):ok(`${lang} @320px/135%: 9 questions, no overflow`);
      await ctx.close();
    }
  }

  /* 11 ── the five features that were merged without ever being run.
           Every check below is one tap that nobody took. */
  head('11. THE FEATURES NOBODY TAPPED');
  {
    const ctx = await b.newContext(phone());
    try { await ctx.grantPermissions(['clipboard-read','clipboard-write'],{origin:BASE.replace(/\/$/,'')}); }
    catch(e){ /* older builds: the writeText stub below still exercises the note */ }
    const p = await ctx.newPage();
    await p.addInitScript(()=>{
      /* headless Chromium has no share sheet, and the button is behind a
         `if(navigator.share)` guard, so nothing would be tested at all */
      window.__shared = [];
      Object.defineProperty(navigator,'share',{configurable:true,
        value: payload => { window.__shared.push(payload); return Promise.resolve(); }});
      window.__copied = [];
      window.__origWrite = null;
    });
    await p.goto(URL); await p.evaluate(seen);
    await p.goto(URL,{waitUntil:'networkidle'});
    await p.waitForSelector('#cardGrid .card',{timeout:15000});
    await p.waitForTimeout(400);

    /* ── the speaker. This is the check that was missing. ── */
    const before = PAGE_ERRORS.length;
    await p.evaluate(()=>document.querySelectorAll('#cardGrid .card')[1].click());
    await p.waitForTimeout(350);
    await pastPrimer(p,'features');
    const spk = await p.$('#qSpeakBtn');
    if(!spk) fail('no speaker button on the question');
    else {
      await spk.click(); await p.waitForTimeout(400);
      (PAGE_ERRORS.length === before)
        ? ok('speaker: tapping it throws nothing')
        : fail('speaker threw: ' + PAGE_ERRORS.slice(before).join('; '));
      const box = await spk.boundingBox();
      (box && box.width >= 44 && box.height >= 44)
        ? ok(`speaker: ${Math.round(box.width)}×${Math.round(box.height)} tap target`)
        : fail(`speaker tap target too small: ${box && Math.round(box.width)}×${box && Math.round(box.height)}`);
      const inLabel = await p.evaluate(()=>!!document.querySelector('#qLabel #qSpeakBtn'));
      inLabel ? fail('speaker is inside #qLabel — it is read out as part of the radiogroup name')
              : ok('speaker sits outside the radiogroup label');
    }

    /* ── walk PHQ-9 to the end, endorsing item 9, so the crisis panel and
           the safety flag are both exercised ── */
    for(let i=0;i<9;i++){
      await p.evaluate(k=>{
        const bs=[...document.querySelectorAll('#qcard .bigopts button')];
        (bs[k===8?1:1]||bs[0]).click();
      }, i);
      await p.waitForTimeout(320);
    }
    await p.waitForTimeout(600);
    const onResults = await p.evaluate(()=>document.getElementById('view-results').classList.contains('active'));
    onResults ? ok('PHQ-9 completes and lands on results') : fail('PHQ-9 did not reach results');

    /* ── the note handed to a doctor ── */
    await p.evaluate(()=>{
      window.__copied = [];
      const w = navigator.clipboard && navigator.clipboard.writeText;
      if(w) navigator.clipboard.writeText = t => { window.__copied.push(t); return w.call(navigator.clipboard,t); };
    });
    await p.evaluate(()=>document.getElementById('sbarBtn').click());
    await p.waitForTimeout(500);
    let note = await p.evaluate(()=> window.__copied[0] || '');
    if(!note){ try{ note = await p.evaluate(()=>navigator.clipboard.readText()); }catch(e){} }
    if(!note) fail('doctor note: nothing was produced');
    else {
      /undefined/.test(note)
        ? fail('doctor note contains "undefined": ' + note.split('\n').find(l=>/undefined/.test(l)))
        : ok('doctor note: no undefined fields');
      /\[S\][\s\S]*\n\n[\s\S]*\[B\][\s\S]*\n\n[\s\S]*\[A\][\s\S]*\n\n[\s\S]*\[R\]/.test(note)
        ? ok('doctor note: the four sections are separated')
        : fail('doctor note: sections run together — did filter(Boolean) eat the blank lines?');
      /ICD|DSM|6A70|296\.2/.test(note)
        ? fail('doctor note still prints a diagnosis code off a screening score')
        : ok('doctor note: no diagnosis code');
      /CRITICAL SAFETY ALERT/.test(note)
        ? ok('doctor note: the safety flag is carried')
        : fail('doctor note: item-9 endorsement not carried into the note');
    }

    /* ── sharing: the tool, and the score, are two different acts ── */
    const score = await p.evaluate(()=>lastResult.score);
    await p.evaluate(()=>{ window.__shared = []; document.getElementById('shareToolBtn').click(); });
    await p.waitForTimeout(250);
    const tool = await p.evaluate(()=> window.__shared[0] || null);
    if(!tool) fail('share-this-tool produced no payload');
    else {
      const blob = (tool.title||'') + ' ' + (tool.text||'') + ' ' + (tool.url||'');
      new RegExp('\\b' + score + '\\s*/').test(blob) || /\/27\b/.test(blob)
        ? fail('share-this-tool leaks the score: ' + blob)
        : ok('share-this-tool carries no score');
    }
    await p.evaluate(()=>{ window.__shared = []; document.getElementById('shareResultBtn').click(); });
    await p.waitForTimeout(250);
    const res = await p.evaluate(()=> window.__shared[0] || null);
    (res && new RegExp(score + '/27').test(res.text || ''))
      ? ok('share-my-result carries the score, on its own button')
      : fail('share-my-result did not include the score');

    /* ── the safety plan sits inside the crisis panel ── */
    const sp = await p.evaluate(()=>{
      const box = document.getElementById('safetyBox');
      return { shown: box && box.style.display !== 'none',
               title: (document.querySelector('.safetyplan-acc summary')||{}).textContent||'',
               ph: [...document.querySelectorAll('.safetyplan-acc input')].map(i=>i.placeholder) };
    });
    sp.shown ? ok('crisis panel is shown after an item-9 endorsement')
             : fail('crisis panel did not appear');
    await ctx.close();
  }

  /* 11b ── the same screens in a language that has none of the new strings,
            and in the one that has all of them */
  head('11b. THE NEW STRINGS IN HINDI, AND THE FALLBACK IN MARATHI');
  {
    const DEV = /[\u0900-\u097F]/;
    for (const lang of ['mr','hi']) {
      const ctx = await b.newContext(phone()); const p = await ctx.newPage();
      await p.goto(URL);
      await p.evaluate(l=>{['psych-seen-overture','psych-seen-tour','psych-seen-intro']
          .forEach(k=>localStorage.setItem(k,'2'));
        localStorage.removeItem('psych-seen-primer');
        localStorage.setItem('psych-prefs',JSON.stringify({lang:l}));}, lang);
      await p.goto(URL,{waitUntil:'networkidle'});
      await p.waitForSelector('#cardGrid .card',{timeout:15000});
      await p.waitForTimeout(400);

      await p.evaluate(()=>document.querySelectorAll('#cardGrid .card')[1].click());
      await p.waitForTimeout(500);
      const pr = await p.evaluate(()=>['primerPrivate','primerGet','primerNot'].map(id=>{
        const el=document.getElementById(id);
        return { t:(el.textContent||'').trim(), h:el.hidden, box:el.getBoundingClientRect().height };
      }));
      const blank = pr.filter(r=> !r.t && !r.h && r.box > 0);
      blank.length
        ? fail(`${lang}: ${blank.length} empty primer bullet(s) still taking space — the orphan dots are back`)
        : ok(`${lang}: primer has ${pr.filter(r=>r.t).length} readable bullets, no empty rows`);
      if(lang==='hi'){
        pr.every(r=>DEV.test(r.t)) ? ok('hi: the primer is in Hindi')
                                   : fail('hi: primer bullets are not Devanagari');
      }

      /* the crisis panel's safety plan, and the breathing protocols */
      const txt = await p.evaluate(()=>({
        sp: (document.querySelector('.safetyplan-acc summary')||{}).textContent||'',
        ph: ([...document.querySelectorAll('.safetyplan-acc input')][0]||{}).placeholder||'',
        proto: [...document.querySelectorAll('.breathe-proto')].map(b=>b.textContent.trim())
      }));
      if(lang==='hi'){
        DEV.test(txt.sp) ? ok('hi: the safety plan is in Hindi')
                         : fail('hi: safety plan still English — "'+txt.sp.slice(0,40)+'"');
        DEV.test(txt.ph) ? ok('hi: its input placeholders are in Hindi too')
                         : fail('hi: placeholders still English — "'+txt.ph.slice(0,40)+'"');
        txt.proto.some(t=>DEV.test(t)) ? ok('hi: breathing protocols are in Hindi')
                                       : fail('hi: protocols still English — '+txt.proto.join(' / '));
      } else {
        /HRV/.test(txt.proto.join(' '))
          ? fail('mr: a protocol button still says "HRV"')
          : ok('mr: falls back to plain English, no clinician jargon');
      }
      await ctx.close();
    }
  }

  /* 13 ── tablets and desktops. Every check in this suite was written at
           phone widths, so nothing here ever looked above 720px — where the
           nav had been TWO ROWS at every width, on desktop as well as
           tablet, with Settings marooned at the left of the second row and
           its popover opening 44px off the left edge of an iPad. */
  head('13. TABLET AND DESKTOP — the nav row and the settings popover');
  {
    const SIZES = [
      [768,1024,'iPad portrait'], [820,1180,'iPad 10.9 portrait'],
      [1024,768,'iPad 9.7 landscape'], [1080,810,'iPad 10.9 landscape'],
      [1112,834,'iPad Pro 10.5 landscape'], [1194,834,'iPad Pro 11 landscape'],
      [1366,1024,'iPad Pro 12.9 landscape'], [1440,900,'laptop']
    ];
    let rows = 0, off = 0, wide = 0;
    for (const [w,h,label] of SIZES) {
      const ctx = await b.newContext({viewport:{width:w,height:h}, hasTouch:true, deviceScaleFactor:2});
      const p = await ctx.newPage();
      await p.goto(URL); await p.evaluate(seen);
      await p.goto(URL,{waitUntil:'networkidle'});
      await p.waitForSelector('#cardGrid .card',{timeout:15000});
      await p.waitForTimeout(350);

      /* the nav is one row: the settings control shares the brand's line */
      const oneRow = await p.evaluate(()=>{
        const brand = document.querySelector('nav.site .brand');
        const set   = document.querySelector('.setwrap');
        return Math.round(brand.getBoundingClientRect().top)
             === Math.round(set.getBoundingClientRect().top);
      });
      if(!oneRow){ rows++; fail(`${label} ${w}px: the nav wrapped to two rows`); }

      /* the popover holding the language switch opens fully on screen */
      await p.evaluate(()=>document.getElementById('setBtn').click());
      await p.waitForTimeout(400);
      const pan = await p.evaluate(()=>{
        const r = document.getElementById('setPanel').getBoundingClientRect();
        return {l:Math.round(r.left), r:Math.round(r.right),
                vw:document.documentElement.clientWidth};
      });
      if(pan.l < 0 || pan.r > pan.vw){
        off++; fail(`${label} ${w}px: settings panel at ${pan.l}..${pan.r} of ${pan.vw} — off screen`);
      }
      const m = await p.evaluate(OVERFLOW);
      if(m.scrollW > m.vw+1 || m.over.length){ wide++; fail(`${label} ${w}px: ${m.over.join(', ')}`); }
      await ctx.close();
    }
    if(!rows) ok(`the nav is one row at all ${SIZES.length} tablet and desktop sizes`);
    if(!off)  ok('the settings popover opens fully on screen at every one of them');
    if(!wide) ok('no sideways scrolling at any of them');
  }

  /* 14 ── the tour's install step. It points at a button inside the
           settings popover, and it only exists when the browser has
           actually offered an install — two conditions nothing else in
           this suite covers. */
  head('14. THE TOUR REACHES THE INSTALL STEP');
  {
    for (const lang of ['en','hi','mr']) {
      const ctx = await b.newContext(phone()); const p = await ctx.newPage();
      await p.goto(URL);
      await p.evaluate(l=>{
        ['psych-seen-overture','psych-seen-intro'].forEach(k=>localStorage.setItem(k,'2'));
        localStorage.removeItem('psych-seen-tour');
        localStorage.setItem('psych-prefs',JSON.stringify({lang:l}));
      }, lang);
      await p.goto(URL,{waitUntil:'networkidle'});
      await p.waitForSelector('#cardGrid .card',{timeout:15000});
      await p.waitForTimeout(500);

      /* headless Chromium never fires beforeinstallprompt, so stand in for
         it exactly as the real handler does */
      await p.evaluate(()=>{
        document.getElementById('installBtn').style.display = 'block';
        if(typeof tourAddInstallStep === 'function') tourAddInstallStep();
      });
      await p.evaluate(()=>{ if(typeof tourStart === 'function') tourStart(); });
      await p.waitForTimeout(500);

      const total = await p.evaluate(()=> TOUR_STEPS.length);
      const has   = await p.evaluate(()=> TOUR_STEPS.some(s=> s.key==='tourInstall'));
      if(!has){ fail(`${lang}: the tour has no install step`); await ctx.close(); continue; }

      /* walk to it and check the popover opened and the ring is on the button */
      let reached = false, ringOK = false, panelOpen = false, title = '';
      for(let i=0;i<10;i++){
        const at = await p.evaluate(()=> TOUR_STEPS[tourIdx].key);
        if(at === 'tourInstall'){
          reached = true;
          /* tourPlace repaints at 560ms once the ring and bubble have
             finished animating. Measuring before that settle passed while
             the ring was still drifting — it ended up on a screener card,
             and the screenshot showed it even though the check was green. */
          await p.waitForTimeout(900);
          const m = await p.evaluate(()=>{
            const btn = document.getElementById('installBtn');
            const ring = document.getElementById('tourRing');
            const card = document.getElementById('tourCard');
            const br = btn.getBoundingClientRect(), rr = ring.getBoundingClientRect();
            const cr = card.getBoundingClientRect();
            const onScreen = br.top >= 0 && br.bottom <= innerHeight + 1
                          && br.left >= 0 && br.right <= innerWidth + 1;
            /* Paint order, not mere presence in the stack. The first check
               here used .includes(), which passes for an element buried
               under a screener card — which is exactly what was happening:
               a marigold ring around a blank box, because nav.site is
               position:static above the phone breakpoint and z-index does
               nothing to a static element. */
            const stack = document.elementsFromPoint(
              br.left + br.width/2, br.top + br.height/2)
              .filter(e => e.id !== 'tourBlock' && e.id !== 'tour'
                        && e.id !== 'tourRing' && e.id !== 'tourArrow');
            const painted = stack[0] === btn;
            /* the ring cannot be drawn over the lifted popover, so the
               target has to carry the highlight itself — without this the
               step points at nothing anyone can see */
            const marked = btn.classList.contains('tour-target')
                        && getComputedStyle(btn).outlineStyle !== 'none';
            /* the bubble is a bottom sheet on a phone, and it was sitting
               directly on top of the button it was describing */
            const covered = !(br.bottom <= cr.top || br.top >= cr.bottom
                           || br.right <= cr.left || br.left >= cr.right);
            return {open: document.getElementById('setPanel').classList.contains('open'),
                    vis: br.width>0 && br.height>0 && onScreen,
                    painted, marked, topmost: stack[0] ? (stack[0].id||stack[0].className) : null,
                    covered,
                    near: Math.abs(rr.left-br.left)<24 && Math.abs(rr.top-br.top)<24,
                    title: document.getElementById('tourTitle').textContent.trim()};
          });
          if(m.covered) fail(`${lang}: the tour bubble covers the install button it points at`);
          else ok(`${lang}: the bubble does not cover the button`);
          m.painted ? ok(`${lang}: the button is the topmost thing under the spotlight`)
                    : fail(`${lang}: "${m.topmost}" paints over the install button`);
          m.marked ? ok(`${lang}: the button is visibly highlighted`)
                   : fail(`${lang}: the step points at the button with no visible marker`);
          panelOpen = m.open && m.vis; ringOK = m.near; title = m.title;
          break;
        }
        await p.evaluate(()=> document.getElementById('tourNext').click());
        await p.waitForTimeout(420);
      }
      if(!reached){ fail(`${lang}: never reached the install step in ${total} steps`); await ctx.close(); continue; }
      panelOpen ? ok(`${lang}: install step opens the settings panel, button visible`)
                : fail(`${lang}: install step did not open the settings panel`);
      ringOK ? ok(`${lang}: the spotlight is on the install button`)
             : fail(`${lang}: the spotlight is not on the install button`);
      if(lang==='hi'){
        /[ऀ-ॿ]/.test(title) ? ok('hi: the install step is in Hindi')
                                      : fail(`hi: install step not translated — "${title}"`);
      }
      if(lang==='mr'){
        title ? ok(`mr: falls back to English rather than throwing ("${title.slice(0,32)}")`)
              : fail('mr: install step has no title at all');
      }
      /* and it must close the panel again on the way out */
      await p.evaluate(()=> document.getElementById('tourSkip').click());
      await p.waitForTimeout(300);
      const left = await p.evaluate(()=> document.getElementById('setPanel').classList.contains('open'));
      left ? fail(`${lang}: the settings panel was left open after the tour`)
           : ok(`${lang}: the panel closes when the tour ends`);
      await ctx.close();
    }

    /* and when the browser cannot install, the step is simply not there */
    const ctx = await b.newContext(phone()); const p = await ctx.newPage();
    await p.goto(URL);
    await p.evaluate(()=>{['psych-seen-overture','psych-seen-intro'].forEach(k=>localStorage.setItem(k,'2'));
                          localStorage.removeItem('psych-seen-tour');});
    await p.goto(URL,{waitUntil:'networkidle'});
    await p.waitForSelector('#cardGrid .card',{timeout:15000}); await p.waitForTimeout(500);
    await p.evaluate(()=>{ if(typeof tourStart === 'function') tourStart(); });
    await p.waitForTimeout(400);
    const m = await p.evaluate(()=>({
      has: TOUR_STEPS.some(s=>s.key==='tourInstall'),
      total: TOUR_STEPS.length,
      shown: document.getElementById('tourCount').textContent
    }));
    m.has ? fail('the install step is offered on a browser that cannot install')
          : ok(`no install offer, no install step (${m.total} steps, "${m.shown}")`);
    await ctx.close();
  }

  /* 12 ── every uncaught exception, from every page this suite opened.
           Anything the sections above did not deliberately provoke lands
           here, and fails the run. */
  head('12. UNCAUGHT EXCEPTIONS, EVERY PAGE');
  {
    const noise = /Failed to fetch|net::ERR|ServiceWorker/i;
    const real = PAGE_ERRORS.filter(m=>!noise.test(m));
    real.length ? real.slice(0,6).forEach(m=>fail('uncaught: '+m))
                : ok(`no uncaught exceptions across ${PAGE_ERRORS.length ? PAGE_ERRORS.length + ' filtered' : 'any'} page`);
  }

  console.log('\n' + '─'.repeat(58));
  console.log(FAILS.length ? `\x1b[31m${FAILS.length} PROBLEM(S)\x1b[0m` : '\x1b[32mALL CHECKS PASS\x1b[0m');
  FAILS.forEach(f=>console.log('  • '+f));

  await b.close();
  process.exit(FAILS.length?1:0);
})();
