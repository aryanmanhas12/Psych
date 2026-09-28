/* ══════════════════════════════════════════════════════════════
   Ronak — the music
   ──────────────────────────────────────────────────────────────
   Generated on the phone with Web Audio: no files to download, no
   licence, nothing streamed, and it never loops audibly.

   WHAT IT IS ABOUT: CHANGE
   Arun, the sister app, plays a steady drone in D major: a place to
   rest. Ronak's music is about a turn. It uses the relative pair D minor
   and F major, which share every note: nothing new is added, the light
   just falls differently. The opening moves from one to the other in
   step with the scene on screen:

     0.0s  a room at night          D minor (add9), low and closed
     3.3s  the door opens           a high shimmer; the filter starts to open
     5.3s  someone sits beside them B-flat major 9 comes in under the night
     5.9s  the head lifts           the first rising figure: F, A, C
     6.5s  the room warms           C sus2, the dominant, leaning forward
     6.9s  the bloom-sun opens      F major 9, the whole filter open, a
                                    quick rising shimmer: the sunrise
     8.1s  the name                 one soft F, the home note
   Then it settles into a slow cycle of four chords, thirteen seconds
   each (Fmaj9, Dm9, B-flat Lydian, C6/9), with a small figure now and
   then that only ever climbs. Nothing in Ronak's music descends.

   Arun's voice is a struck singing bowl. Ronak's is a felt-piano pluck
   (a sine with two quick-fading upper partials) over a soft pad, with a
   little dawn air: filtered noise that swells and falls with the breath
   rate of the sky layer.

   Moving between pages moves the harmony: each page has its own chord,
   and arriving on it starts that chord, so a journey through the app is
   heard as a slow progression.

   WHEN IT PLAYS
   Browsers refuse sound before a tap, so every visit opens on the night
   scene with "Begin"; that tap starts the music and the sunrise
   together, in sync. It fades out, never cuts, whenever:
     · the questions are on screen (music is a known mood-induction
       method in research; it must not colour anyone's PHQ-9 answers),
     · the self-harm safety step is up,
     · the breathing exercise or "listen to this question" is speaking,
     · the tab is hidden.
   Off in Settings (remembered), or "Begin in silence" for one visit.
   On iPhone it follows the silent switch.
   ══════════════════════════════════════════════════════════════ */
(function(){
"use strict";
if(window.RonakMusic) return;

const KEY = "ronak-music";                 /* "off" when switched off */
const LEVEL = 0.52;                        /* the settled level after the sunrise */
const CHORD_S = 13;
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

const NIGHT  = [38, 50, 53, 57, 64];       /* Dm(add9): D2 D3 F3 A3 E4 */
const BESIDE = [46, 53, 57, 60, 62];       /* Bbmaj9:   Bb2 F3 A3 C4 D4 */
const LEAN   = [48, 55, 60, 62, 67];       /* Csus2:    C3 G3 C4 D4 G4 */
const DAWN   = [41, 53, 57, 60, 64, 67];   /* Fmaj9:    F2 F3 A3 C4 E4 G4 */
const LOOP = [
  DAWN,
  [38, 50, 57, 60, 64, 65],                /* Dm9:      D2 D3 A3 C4 E4 F4 */
  [46, 53, 58, 62, 64, 69],                /* Bb Lydian: Bb2 F3 Bb3 D4 E4 A4 */
  [48, 55, 60, 62, 64, 67]                 /* C6/9:     C3 G3 C4 D4 E4 G4 */
];
/* each page its own chord: moving through the app is a progression */
const VIEW = { home:0, results:0, guide:1, resources:2, history:3, summary:3 };
/* F major pentatonic, F4 to C6: the notes the rising figures climb */
const RISE = [65, 67, 69, 72, 74, 77, 79, 81, 84];

let ctx = null, g = null, unlocked = false, sessionOff = false;
let nextChord = 0, chordIx = 1, lastChordAt = -99, timer = null, suspendT = null;
let sounding = [];                         /* the current chord's voices */
const holds = new Set();

function wanted(){
  if(sessionOff) return false;
  try{ return localStorage.getItem(KEY) !== "off"; }catch(e){ return true; }
}
function lite(){ return document.documentElement.classList.contains("lite"); }

function room(seconds, decay){
  const rate = ctx.sampleRate, len = Math.floor(rate * seconds);
  const buf = ctx.createBuffer(2, len, rate);
  for(let c = 0; c < 2; c++){
    const d = buf.getChannelData(c);
    let seed = c ? 48271 : 16807;
    for(let i = 0; i < len; i++){
      seed = (seed * 16807) % 2147483647;
      d[i] = ((seed / 2147483647) * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}

/* ── the graph ── */
function build(){
  const out = ctx.createGain(); out.gain.value = 0;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -24; comp.knee.value = 14; comp.ratio.value = 3;
  comp.attack.value = 0.06; comp.release.value = 1;
  const dry = ctx.createGain(); dry.gain.value = 0.62;
  const verb = ctx.createConvolver(); verb.buffer = room(lite() ? 2.4 : 4.6, 2.2);
  const wet = ctx.createGain(); wet.gain.value = 0.7;
  /* the pad's light: a lowpass the sunrise opens */
  const tone = ctx.createBiquadFilter();
  tone.type = "lowpass"; tone.frequency.value = 1500; tone.Q.value = 0.6;
  const pads = ctx.createGain(); pads.gain.value = 1;
  const plucks = ctx.createGain(); plucks.gain.value = 1;
  const pluckSend = ctx.createGain(); pluckSend.gain.value = 1.2;
  pads.connect(tone); tone.connect(dry); tone.connect(verb);
  plucks.connect(dry); plucks.connect(pluckSend); pluckSend.connect(verb);
  verb.connect(wet); dry.connect(comp); wet.connect(comp);
  comp.connect(out); out.connect(ctx.destination);
  /* dawn air: noise, band-passed high and soft, breathing with the sky
     layer's eleven-second glow */
  if(!lite()){
    const n = ctx.createBufferSource(); n.buffer = room(3, 0); n.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2400; bp.Q.value = 0.7;
    const air = ctx.createGain(); air.gain.value = 0.004;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 1 / 11;
    const depth = ctx.createGain(); depth.gain.value = 0.0035;
    lfo.connect(depth); depth.connect(air.gain);
    n.connect(bp); bp.connect(air); air.connect(verb);
    n.start(); lfo.start();
  }
  return { out, tone, pads, plucks };
}

function pan(v){
  if(!ctx.createStereoPanner) return null;
  const p = ctx.createStereoPanner(); p.pan.value = v; return p;
}
function voice(t, midi, dur, level, spread){
  const G = g, f = mtof(midi), v = ctx.createGain();
  v.gain.setValueAtTime(0, t);
  v.gain.setTargetAtTime(level, t, 1.4);
  v.gain.setTargetAtTime(0, t + dur, 2.2);
  sounding.push(v);
  const p = pan(spread);
  if(p){ v.connect(p); p.connect(G.pads); } else v.connect(G.pads);
  const end = t + dur + 11;
  [["sine", -5, 1], ["triangle", 6, 0.28]].forEach(([type, det, amt])=>{
    const o = ctx.createOscillator(); o.type = type;
    o.frequency.value = f; o.detune.value = det;
    const a = ctx.createGain(); a.gain.value = amt;
    o.connect(a); a.connect(v); o.start(t); o.stop(end);
  });
}
function chord(t, notes, dur, lvl){
  sounding = [];
  notes.forEach((m, i)=> voice(t + i * 0.28, m, dur, (i === 0 ? 0.05 : 0.033) * (lvl || 1),
                                (i % 2 ? 1 : -1) * (0.12 + i * 0.07)));
  voice(t, notes[0] - 12, dur, 0.04 * (lvl || 1), 0);
}
/* the felt-piano pluck: a sine and two partials that fade faster */
function pluck(t, midi, level){
  const G = g, f = mtof(midi), bus = ctx.createGain();
  const p = pan(((midi % 7) / 7) - 0.45);
  if(p){ bus.connect(p); p.connect(G.plucks); } else bus.connect(G.plucks);
  [[1, 1, 2.4], [2, 0.18, 0.9], [3, 0.06, 0.45]].forEach(([r, amp, dec])=>{
    const o = ctx.createOscillator(); o.frequency.value = f * r;
    const e = ctx.createGain();
    e.gain.setValueAtTime(0, t);
    e.gain.linearRampToValueAtTime((level || 0.05) * amp, t + 0.012);
    e.gain.exponentialRampToValueAtTime(0.00001, t + dec);
    o.connect(e); e.connect(bus); o.start(t); o.stop(t + dec + 0.05);
  });
}
/* the figure that only climbs */
function rise(t, count, gap, from){
  let i = from == null ? Math.floor(Math.random() * 3) : from;
  for(let k = 0; k < count && i < RISE.length; k++, i += 1 + (Math.random() < 0.3 ? 1 : 0))
    pluck(t + k * gap, RISE[i], 0.042 - k * 0.004);
}

/* ── the sunrise, in step with the opening scene ── */
function sunrise(){
  const t = ctx.currentTime + 0.05, G = g;
  G.out.gain.cancelScheduledValues(t);
  G.out.gain.setValueAtTime(0.0001, t);
  G.out.gain.linearRampToValueAtTime(0.85, t + 2.6);
  G.out.gain.setTargetAtTime(LEVEL, t + 10, 3);
  G.tone.frequency.cancelScheduledValues(t);
  G.tone.frequency.setValueAtTime(360, t);
  chord(t, NIGHT, 5.6, 1);
  pluck(t + 2.2, 74, 0.02);                                   /* the world passes */
  pluck(t + 3.3, 81, 0.026); pluck(t + 3.42, 88, 0.014);     /* the door: light */
  G.tone.frequency.setValueAtTime(360, t + 3.3);
  G.tone.frequency.exponentialRampToValueAtTime(900, t + 5.3);
  chord(t + 5.3, BESIDE, 2.2, 0.9);                           /* beside them */
  rise(t + 5.9, 3, 0.2, 0);                                   /* the head lifts: F A C */
  chord(t + 6.5, LEAN, 1.2, 0.85);                            /* warmth, leaning in */
  G.tone.frequency.setValueAtTime(900, t + 6.5);
  G.tone.frequency.exponentialRampToValueAtTime(2300, t + 7.1);
  chord(t + 6.9, DAWN, 11, 1.1);                              /* the bloom: sunrise */
  rise(t + 6.9, 5, 0.09, 3);                                  /* the shimmer: C D F G A */
  pluck(t + 8.1, 77, 0.034);                                  /* the name: home note */
  G.tone.frequency.setTargetAtTime(1500, t + 9, 4);
  nextChord = t + 6.9 + 11; chordIx = 1; lastChordAt = t + 6.9;
}

function schedule(){
  clearTimeout(timer);
  if(!ctx || !g) return;
  if(ctx.state === "running"){
    const now = ctx.currentTime;
    if(nextChord < now) nextChord = now + 0.1;
    /* a short lookahead, so a page change can take the next chord */
    while(nextChord < now + 1.5){
      chord(nextChord, LOOP[chordIx % LOOP.length], CHORD_S, 1);
      lastChordAt = nextChord;
      if(Math.random() < 0.7) rise(nextChord + 3 + Math.random() * 6, 3 + Math.floor(Math.random() * 2), 0.24);
      chordIx++; nextChord += CHORD_S;
    }
  }
  timer = setTimeout(schedule, 1000);
}

function ensure(){
  if(ctx) return true;
  const AC = window.AudioContext || window.webkitAudioContext;
  if(!AC) return false;
  try{ ctx = new AC({ latencyHint:"playback" }); }catch(e){ try{ ctx = new AC(); }catch(e2){ return false; } }
  try{ if(navigator.audioSession) navigator.audioSession.type = "ambient"; }catch(e){}
  g = build();
  return true;
}
function playing(){ return unlocked && wanted() && holds.size === 0 && !document.hidden; }

function update(fadeIn){
  if(!ctx) return;
  if(playing()){
    clearTimeout(suspendT); suspendT = null;
    ctx.resume().then(()=>{
      const t = ctx.currentTime;
      g.out.gain.cancelScheduledValues(t);
      g.out.gain.setValueAtTime(Math.max(0.0001, g.out.gain.value), t);
      g.out.gain.setTargetAtTime(LEVEL, t, fadeIn ? 2 : 0.9);
      schedule();
    }).catch(()=>{});
  } else {
    const t = ctx.currentTime;
    g.out.gain.cancelScheduledValues(t);
    g.out.gain.setValueAtTime(g.out.gain.value, t);
    g.out.gain.setTargetAtTime(0, t, 0.5);
    clearTimeout(suspendT);
    suspendT = setTimeout(()=>{ if(!playing() && ctx.state === "running"){ clearTimeout(timer); ctx.suspend().catch(()=>{}); } }, 2600);
  }
}

document.addEventListener("visibilitychange", ()=> update(true));

window.RonakMusic = {
  /* The "Begin" tap: music and sunrise start in the same instant. */
  begin(){
    unlocked = true;
    if(!wanted() || !ensure()) return false;
    ctx.resume().catch(()=>{});
    if(g && g.out.gain.value > 0.001){
      /* already playing (a replay): let the old graph fade and start fresh */
      const old = g.out, t = ctx.currentTime;
      old.gain.cancelScheduledValues(t); old.gain.setValueAtTime(old.gain.value, t);
      old.gain.setTargetAtTime(0, t, 0.4);
      setTimeout(()=>{ try{ old.disconnect(); }catch(e){} }, 4000);
      g = build();
    }
    sunrise(); schedule();
    return true;
  },
  /* Any other first tap (a deep link, reduced motion, a later visit
     after the opening): start softly, no sunrise. */
  unlock(){
    if(unlocked && ctx) return;
    unlocked = true;
    if(!wanted() || !ensure()) return;
    chordIx = 0; nextChord = 0;
    update(true);
  },
  quietForVisit(){ sessionOff = true; update(); },
  wanted,
  setWanted(on){
    sessionOff = false;
    try{ if(on) localStorage.removeItem(KEY); else localStorage.setItem(KEY, "off"); }catch(e){}
    if(on){ unlocked = true; if(ensure()) update(true); } else update();
  },
  hold(r){ holds.add(r); update(); },
  release(r){ if(holds.delete(r)) update(true); },
  /* a new page: its own chord, now, if the last one has had a moment */
  view(name){
    if(!ctx || !playing() || !(name in VIEW)) return;
    const now = ctx.currentTime;
    if(now - lastChordAt < 5) return;
    /* let the chord that is sounding go early, then start this page's */
    sounding.forEach(v=>{ v.gain.cancelScheduledValues(now); v.gain.setValueAtTime(v.gain.value, now); v.gain.setTargetAtTime(0, now, 1.6); });
    chordIx = VIEW[name];
    nextChord = now + 0.3;
    schedule();
  },
  get running(){ return !!ctx && ctx.state === "running" && playing(); },
  /* For the loudness check: render the opening and what follows offline,
     through the same graph, and return the samples. Never used in the app. */
  _render(seconds){
    const saved = [ctx, g, nextChord, chordIx, lastChordAt];
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    ctx = new OAC(2, Math.ceil(44100 * seconds), 44100);
    g = build(); sunrise();
    while(nextChord < seconds){ chord(nextChord, LOOP[chordIx++ % LOOP.length], CHORD_S, 1);
      rise(nextChord + 4, 3, 0.24); nextChord += CHORD_S; }
    const off = ctx;
    [ctx, g, nextChord, chordIx, lastChordAt] = saved;
    return off.startRendering();
  }
};
})();
