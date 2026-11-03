/* Builds the valley's HTML fragment (index.html) from paths.json. */
const fs = require('fs');
const P = JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
let seed = 11; const rnd=()=>{ seed=(seed*16807)%2147483647; return (seed-1)/2147483646; };
const R = n=> Math.round(n*10)/10;

/* the chinar leaf: five deep lobes, the stem at the bottom (box -20..20) */
let leaf = '';
for(let i=0;i<=72;i++){
  const t = i/72*Math.PI*2;                 // 0 = up
  const lob = Math.pow(Math.abs(Math.cos(2.5*t)), 1.7);
  let r = 7 + 11*lob;
  if(Math.abs(t-Math.PI) < .32) r = 4;      // the notch where the stem joins
  const x = Math.sin(t)*r, y = -Math.cos(t)*r;
  leaf += (i?'L':'M')+R(x)+' '+R(y);
}
leaf += 'ZM-.8 3V17H.8V3Z';

/* the tree: a leaning trunk, three limbs, a wide domed crown of leaves */
const leaves = [];
for(let i=0;i<150;i++){
  const a = rnd()*Math.PI*2, rr = Math.sqrt(rnd());
  const cx = 230 + Math.cos(a)*rr*205, cy = 205 + Math.sin(a)*rr*128*(Math.sin(a)<0 ? 1 : .8);
  const warm = rnd() < .16;
  leaves.push(`<use href="#kvLeaf" transform="translate(${R(cx)} ${R(cy)}) rotate(${Math.round(rnd()*360)}) scale(${R(.75+rnd()*.6)})"${warm?' class="w"':''}/>`);
}
const chinar = `<svg class="kv-chinar-art" viewBox="0 0 460 560" preserveAspectRatio="xMidYMax meet" focusable="false">
<path class="kv-trunk" d="M206 560C214 470 200 420 222 350C232 318 236 300 228 268L240 266C252 300 250 330 246 356C262 324 290 300 330 284L334 296C296 316 268 344 252 384C246 420 252 476 262 560Z"/>
<path class="kv-trunk" d="M226 300C204 276 170 262 132 258L130 270C168 276 196 290 216 312Z"/>
<g class="kv-crown">${leaves.join('')}</g></svg>`;

/* the shikara: a long low hull rising at both ends, a curtained canopy,
   the boatman standing at the stern with his heart-shaped paddle */
const shikara = `<svg class="kv-shikara-art" viewBox="0 0 200 64" focusable="false">
<path class="kv-boat" d="M2 34Q26 47 52 48H150Q176 46 198 22Q190 40 150 43H52Q24 42 2 34Z"/>
<path class="kv-boat" d="M60 42V22H124V42ZM56 23L92 13L128 23Z"/>
<path class="kv-boat" d="M166 6a3.4 3.4 0 1 0 .1 0ZM164.6 12h3v17h-3Z M158 4L178 52l2.2-1L160.2 3Z M175 47q4 10 9 4q-1-7-9-4Z"/>
<circle class="kv-lamp" cx="68" cy="31" r="2.6"/></svg>`;

/* lit windows on the houseboats: tall panes with dark rooms between the
   lit ones, a soft halo round each, and each lit pane broken into streaks
   on the water below the hull */
let windows = '', winGlow = '', winRefl = '';
P.HB.forEach(([x,w], bi)=>{
  for(let k=9, n=0; k < w-11; k+=7, n++){
    if((n + bi) % 3 === 2) continue;
    const wx = x + k, wy = 508 - 10;
    windows += `M${wx} ${wy}h3.2v5h-3.2Z`;
    winGlow += `M${wx-1.8} ${wy-1.8}h6.8v8.6h-6.8Z`;
    winRefl += `M${wx+.3} 515h3v2.2h-3Z M${wx-.4} 519h3v1.6h-3Z M${wx+.6} 523h2.6v1.2h-2.6Z`;
  }
});

/* shimmer: thin streaks on the water */
let shimmer=''; for(let i=0;i<46;i++){ const y = 516 + Math.pow(rnd(),1.3)*118, x = rnd()*1600, w = 14 + rnd()*90;
  shimmer += `M${R(x)} ${R(y)}h${R(w)}`; }
/* the sun's path on the water, under where it rises */
let sunpath=''; for(let i=0;i<16;i++){ const y = 2 + i*4.9, w = 8 + i*4.6 + rnd()*10; const x = -w/2 + (rnd()-.5)*8;
  sunpath += `M${R(x)} ${R(y)}h${R(w)}`; }

const V = 'viewBox="0 0 1600 640" preserveAspectRatio="xMidYMax slice" focusable="false"';
const html = `<div class="kv" id="kv" aria-hidden="true">
  <svg class="kv-defs" width="0" height="0" focusable="false"><defs>
    <linearGradient id="kvFarG" x1="0" y1="150" x2="0" y2="520" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#55409A"/><stop offset=".55" stop-color="#2E1C5C"/><stop offset="1" stop-color="#21134A"/></linearGradient>
    <linearGradient id="kvSnowG" x1="0" y1="150" x2="0" y2="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#EDE4FF"/><stop offset="1" stop-color="#A994DB"/></linearGradient>
    <linearGradient id="kvGlowG" x1="0" y1="150" x2="0" y2="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFE3A3"/><stop offset=".45" stop-color="#FF9EC4"/><stop offset="1" stop-color="#FF7A6E"/></linearGradient>
    <linearGradient id="kvMistG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B79BFF" stop-opacity="0"/><stop offset=".6" stop-color="#C9B2FF" stop-opacity=".26"/><stop offset="1" stop-color="#C9B2FF" stop-opacity="0"/></linearGradient>
    <linearGradient id="kvLakeG" x1="0" y1="508" x2="0" y2="640" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3D2468"/><stop offset=".45" stop-color="#23123F"/><stop offset="1" stop-color="#150A2A"/></linearGradient>
    <linearGradient id="kvReflG" x1="0" y1="508" x2="0" y2="640" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3A2470" stop-opacity=".9"/><stop offset="1" stop-color="#3A2470" stop-opacity="0"/></linearGradient>
    <clipPath id="kvLakeClip"><rect x="0" y="508" width="1600" height="132"/></clipPath>
    <path id="kvLeaf" d="${leaf}"/>
  </defs></svg>
  <div class="kv-l kv-far"><div class="kv-p"><svg ${V}>
    <path fill="url(#kvFarG)" d="${P.far}"/>
    <path class="kv-snow" fill="url(#kvSnowG)" d="${P.farSnow}"/>
  </svg><div class="kv-glow"><svg ${V}>
    <path fill="url(#kvGlowG)" d="${P.farSnow}"/>
    <path class="kv-rim" fill="none" d="${P.farSkyline}"/>
  </svg></div></div></div>
  <div class="kv-birds" id="kvBirds"></div>
  <div class="kv-l kv-mist"><div class="kv-p"><svg ${V}><rect x="-200" y="372" width="2000" height="110" fill="url(#kvMistG)"/></svg></div></div>
  <div class="kv-l kv-mid"><div class="kv-p"><svg ${V}>
    <path class="kv-mid1" d="${P.mid1}"/>
    <path class="kv-mid2" d="${P.mid2}"/><path class="kv-mid2" d="${P.mid2Trees}"/>
  </svg></div></div>
  <div class="kv-l kv-lake"><div class="kv-p"><svg ${V}>
    <rect x="0" y="507" width="1600" height="133" fill="url(#kvLakeG)"/>
    <g clip-path="url(#kvLakeClip)"><path fill="url(#kvReflG)" d="${P.farMirror}"/><path class="kv-snowrefl" d="${P.farSnowMirror}"/></g>
    <path class="kv-shimmer" d="${shimmer}"/>
    <path class="kv-shore" d="${P.treeline}"/><path class="kv-shore" d="${P.poplars}"/><path class="kv-winrefl" d="${winRefl}"/>
    <path class="kv-hb" d="${P.boats}"/><path class="kv-hbroof" d="${P.roofs}"/>
    <path class="kv-winglow" d="${winGlow}"/><path class="kv-win" d="${windows}"/>
  </svg></div><div class="kv-ripples" id="kvRipples"></div></div>
  <div class="kv-sunpath"><svg viewBox="-60 0 120 80" preserveAspectRatio="none" focusable="false"><path d="${sunpath}"/></svg></div>
  <div class="kv-shikara" id="kvShikara">${shikara}<i class="kv-lampglow"></i></div>
  <div class="kv-chinar" id="kvChinar">${chinar}</div>
  <div class="kv-leaves" id="kvLeaves"></div>
</div>`;
fs.writeFileSync(process.argv[3], html);
console.log('fragment bytes', html.length, 'gz≈', require('zlib').gzipSync(html).length);
