/* Generates the Kashmir valley panorama layers for Ronak's hero.
   viewBox 0 0 1600 640, lake level y=508. Seeded, so the art is stable. */
let seed = 7;
const rnd = ()=>{ seed = (seed*16807) % 2147483647; return (seed-1)/2147483646; };
const R = n=> Math.round(n*10)/10;

/* midpoint displacement between control points */
function ridge(ctrl, iters, rough, decay){
  let pts = ctrl.map(p=>p.slice());
  for(let it=0; it<iters; it++){
    const out = [pts[0]];
    for(let i=1;i<pts.length;i++){
      const a = pts[i-1], b = pts[i];
      const mx = (a[0]+b[0])/2, my = (a[1]+b[1])/2;
      const len = Math.abs(b[0]-a[0]);
      out.push([mx + (rnd()-.5)*len*.12, my + (rnd()-.5)*len*rough]);
      out.push(b);
    }
    pts = out; rough *= decay;
  }
  return pts;
}
const path = (pts, close=640)=> 'M'+pts.map(p=>R(p[0])+' '+R(p[1])).join('L')+(close!=null?`L1600 ${close}L0 ${close}Z`:'');
const line = pts=> 'M'+pts.map(p=>R(p[0])+' '+R(p[1])).join('L');

/* ── far range: the Pir Panjal wall, low on the left (behind the words on a
   laptop), rising to Harmukh's twin summits right of centre and a
   pyramid (Kolahoi) on the right ── */
const farCtrl = [[0,400],[70,382],[140,392],[210,360],[290,372],[360,336],[430,352],[500,318],[570,334],
  [640,296],[700,312],[760,262],[820,286],[880,226],[930,250],[985,176],[1030,214],[1075,170],[1130,236],
  [1190,268],[1250,232],[1320,150],[1360,196],[1420,258],[1480,240],[1540,292],[1600,280]];
const far = ridge(farCtrl, 4, .30, .55);

/* snow: everything above a per-peak snow line, with a ragged lower edge */
function snow(pts, line){
  const caps = []; let cur = null;
  for(let i=0;i<pts.length;i++){
    const [x,y] = pts[i]; const sl = line(x);
    if(y < sl){ if(!cur){ cur=[]; caps.push(cur); } cur.push([x,y]); }
    else if(cur){ cur=null; }
  }
  /* the lower edge: snow running down gullies (long tongues) between
     bare rock (short notches), at uneven spacing, as real snowlines do */
  return caps.filter(c=>c.length>2).map(c=>{
    const x0 = c[0][0], x1 = c[c.length-1][0];
    const bottom = []; let x = x1;
    while(x > x0){ const sl = line(x); const tongue = rnd() < .45;
      bottom.push([x, sl + (tongue ? 14 + rnd()*26 : -4 + rnd()*8)]);
      x -= 6 + rnd()*16; }
    bottom.push([x0, line(x0)]);
    return c.concat(bottom);
  });
}
const toPath = polys=> polys.map(c=>'M'+c.map(p=>R(p[0])+' '+R(p[1])).join('L')+'Z').join('');
const snowLine = x=> 262 + Math.sin(x/170)*14 - (x>950 && x<1400 ? 34 : 0);
const farSnowPolys = snow(far, snowLine);
const farSnow = toPath(farSnowPolys);

/* ── mid ridges: forested, rounded ── */
const mid1 = ridge([[0,430],[160,410],[330,436],[520,404],[700,428],[880,398],[1060,430],[1240,404],[1420,428],[1600,410]], 5, .10, .55);
const mid2 = ridge([[0,462],[200,446],[420,468],[640,448],[860,470],[1080,452],[1300,472],[1500,454],[1600,462]], 5, .07, .55);

/* forest texture on the near ridge: small pointed conifer tips along mid2 */
function conifers(pts, every){
  let s=''; for(let i=0;i<pts.length;i+=every){ const [x,y]=pts[i]; const h=6+rnd()*12, w=3+rnd()*3;
    s+=`M${R(x-w)} ${R(y+3)}L${R(x)} ${R(y-h)}L${R(x+w)} ${R(y+3)}Z`; } return s; }
const mid2Trees = conifers(mid2, 2);

/* ── far shore: Kashmiri poplars (tall spindles), a tree line, houseboats ── */
const SHORE = 508;
let poplars='', treeline='M0 '+(SHORE+2);
for(let x=0;x<=1600;x+=18){ treeline += `L${x} ${R(SHORE-4-rnd()*9)}`; }
treeline += `L1600 ${SHORE+2}Z`;
for(let x=30;x<1590;x+= 14+rnd()*30){ const h = 26+rnd()*40, w = 3+rnd()*2.5;
  poplars += `M${R(x-w)} ${SHORE}Q${R(x-w*1.1)} ${R(SHORE-h*.55)} ${R(x)} ${R(SHORE-h)}Q${R(x+w*1.1)} ${R(SHORE-h*.55)} ${R(x+w)} ${SHORE}Z`; }
/* Dal Lake houseboats, moored along the far shore. The hull sits on the
   water, so it reads against the lake; the cabin is a shade lighter than
   the tree line behind it, so its shape separates instead of merging (in
   v36 both were the shore colour and only the windows showed, as a dotted
   line). A flat roof overhangs the cabin, with a sun-deck canopy at the
   stern. Lit windows, halos and reflections are drawn in build.js. */
const HB = [[252,72],[340,56],[1172,80],[1270,62],[1352,68]];
let boats='', roofs='';
for(const [x,w] of HB){
  boats += `M${x} ${SHORE}h${w}l-5 6h${-(w-10)}Z M${x+5} ${SHORE}v-13h${w-10}v13Z`;
  const cw = Math.round(w*.28);
  roofs += `M${x+2} ${SHORE-13}h${w-4}v-2.5h${-(w-4)}Z M${x+w-cw-6} ${SHORE-15.5}l2 -5h${cw-4}l2 5Z`;
}

/* reflection of the far range in the lake: mirrored about the shore line */
const farMirror = far.map(([x,y])=>[x, 2*SHORE - y]);

const farSnowMirror = toPath(farSnowPolys.map(c=> c.map(([x,y])=>[x, 2*SHORE - y])));
const out = { far: path(far), farSkyline: line(far), farSnow, farSnowMirror, mid1: path(mid1), mid2: path(mid2), mid2Trees,
  treeline, poplars, boats, roofs, HB, farMirror: path(farMirror, SHORE).replace(/L1600 \d+L0 \d+Z$/, `L1600 ${SHORE}L0 ${SHORE}Z`) };
require('fs').writeFileSync(process.argv[2], JSON.stringify(out));
for(const [k,v] of Object.entries(out)) console.log(k.padEnd(11), v.length);
