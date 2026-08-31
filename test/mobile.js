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
const EXE = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

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
  const b = await chromium.launch({ executablePath: EXE });
  const phone = extra => ({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, ...extra });

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
    for (const [sel,name] of [['.topstrip','crisis strip'],['.topstrip a','helpline number'],
                              ['.intro-no','No button'],['.intro-yes','Yes button'],['.intro-card p','statement']]) {
      const v = await p.evaluate(`(${CR})(${JSON.stringify(sel)})`);
      if (v===null) continue;
      v>=4.5 ? ok(`${label}: ${name} ${v}:1`) : fail(`${label}: ${name} ${v}:1 (needs 4.5)`);
    }
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
         A blocked i18n.js used to throw and leave a blank page. */
  head('6. DEGRADATION');
  {
    const ctx = await b.newContext(phone()); const p = await ctx.newPage();
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    let n=0;
    await p.route('**/i18n.js', r=>(++n===1)?r.abort():r.continue());
    await p.goto(URL,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(2500);
    let s=await p.evaluate(()=>({cards:document.querySelectorAll('#cardGrid .card').length,
                                 panel:!!document.querySelector('.loadfail')}));
    (s.cards>0&&!s.panel)?ok('a dropped i18n.js recovers on retry'):fail('did not recover on retry');
    errs.length?fail('threw: '+errs.join('; ')):ok('no uncaught exception');
    await ctx.close();

    const ctx2 = await b.newContext(phone()); const p2 = await ctx2.newPage();
    const errs2=[]; p2.on('pageerror',e=>errs2.push(e.message));
    await p2.route('**/i18n.js', r=>r.abort());
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

  console.log('\n' + '─'.repeat(58));
  console.log(FAILS.length ? `\x1b[31m${FAILS.length} PROBLEM(S)\x1b[0m` : '\x1b[32mALL CHECKS PASS\x1b[0m');
  FAILS.forEach(f=>console.log('  • '+f));
  await b.close();
  process.exit(FAILS.length?1:0);
})();
