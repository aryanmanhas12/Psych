---
version: 1
name: Ronak
description: >
  Ronak ("radiance") is a free, private, six-language mental-wellbeing check-in
  app for India. Its whole look is light arriving: every page opens at night and
  warms toward dawn as you scroll. Plum ink on dawn cream by day, the same plum
  as the night by night; pink, violet and gold are used as glowing light, never
  as flat paint. The mark is the bloom-sun (pink and violet petals round a gold
  core). The guide is Ooh, the round sunrise-gold creature shared with the
  sister app Arun. Calm, warm, humane; never clinical-cold, never loud.

colors:
  ink: "#1B1030"            # plum ink; 17:1 on paper
  paper: "#FFF7F1"          # dawn cream
  card: "#FFFFFF"
  line: "#EBDDE8"
  muted: "#5F5476"          # 6.6:1 on paper
  heal: "#6D28D9"           # violet for actions and links; 6.7:1
  stamp: "#C8105A"          # magenta; 5.4:1
  marigold: "#F2A300"
  sun: "#FFC83D"
  pink: "#FF3D8B"
  violet: "#7C3AED"
  coral: "#FF7A59"
  deep: "#140A26"           # the always-night surface: nav, crisis strip, stat bands
  on-deep: "#FFF6EE"
  night-0: "#0B0616"
  night-1: "#140A26"
  night-2: "#241046"
  dark:                     # night theme (also the default under prefers-color-scheme: dark)
    ink: "#F7F0FF"
    paper: "#0C0717"
    card: "#170E29"
    line: "#2F2247"
    muted: "#B9ACD0"
    heal: "#C3A6FF"
    stamp: "#FF6FA8"
    marigold: "#FFC83D"
  ooh:                      # the shared guide, from ooh.mjs (do not change here; change in Arun)
    ink: "#2A1636"
    sun: "#FFC857"
    sun-light: "#FFE08A"
    peach: "#FF9F80"
    pink: "#FF7AB0"
    lilac: "#B794FF"
    cream: "#FFF8EE"
    mouth: "#7A2748"
  gradients:
    bloom: "linear-gradient(115deg,#7C3AED 0%,#FF3D8B 55%,#FFC83D 100%)"
    cta: "linear-gradient(115deg,#6D28D9 0%,#A21CAF 55%,#C8105A 100%)"
    text: "linear-gradient(100deg,#7C3AED 0%,#E11D74 60%,#F08A00 100%)"

typography:
  wordmark:
    fontFamily: "Ronak Wordmark (Karla 700 subset), same as Arun's"
    case: lowercase
    letterSpacing: -0.03em
    fontSize: 1.5rem (1.36rem on phones)
  display:
    fontFamily: "Ronak Display = Baloo 2 (Ek Type, OFL), one file per script: Latin, Devanagari, Bengali, Tamil, Telugu"
    fontWeight: 600-800
    fontDisplay: optional     # never delays or shifts a headline
    hero: "clamp(2.2rem, 7.2vw, 4.3rem), max 15ch (Indic scripts: clamp(1.8rem, 6.4vw, 3.4rem), 18ch)"
    h1: "clamp(1.6rem, 4.5vw, 2.8rem)"
  ui:
    fontFamily: "system UI stack (-apple-system, Segoe UI, Noto Sans, Roboto)"
    body: "1rem / 1.6"
  rule: Every string exists in six languages; layouts must survive Tamil and Telugu at 135% text size.

spacing:
  gutter: 1.3rem each side (no horizontal page scroll at 320px)
  wrap-max: min(60rem, 100%)
  tap-target-min: 44px

radius:
  sm: 0.6rem
  md: 0.9rem
  lg: 1.35rem
  xl: 1.9rem
  pill: 999px

elevation:
  subtle: "0 1px 2px rgba(40,10,70,.06)"
  card: "0 1px 3px rgba(40,10,70,.05), 0 10px 26px -10px rgba(60,14,110,.18)"
  soft: "0 2px 6px rgba(40,10,70,.05), 0 14px 34px -8px rgba(60,14,110,.16)"
  glow: "0 10px 30px -8px rgba(162,28,175,.45)"
  comic: "4px 4px 0 #2A1636"   # Ooh's speech bubble only

motion:
  easing:
    out: "cubic-bezier(.215,.61,.355,1)"
    spring: "cubic-bezier(.16,1,.3,1)"
  breath: 11s                 # the sky's glow cycle: about 5.5 breaths a minute
  dials: { DESIGN_VARIANCE: 4, MOTION_INTENSITY: 5, VISUAL_DENSITY: 3 }   # design-taste-frontend
  rules:
    - Animate transform and opacity of HTML layers only; never groups inside an SVG.
    - Idle loops run only while on screen; everything stops under prefers-reduced-motion and html.lite.
    - Nothing moves under a thumb; reserve space; layout shift stays at 0.
    - Pointer effects (spotlight, tilt) only for hover-capable fine pointers.
---

# Ronak design language

## The idea
Light arriving. The opening is a room at night; a door opens; someone sits
beside the person on the floor; the head lifts; the bloom-sun opens. The home
page repeats it in scroll: a night sky whose sun rises as you move down, and
check-ins that are each a small scene of the moment *after* (a spark lighting,
a bud opening), never an illustration of the problem.

## Surfaces
- **Night (always):** the crisis strip, the nav, the opening, stat bands, the
  hero sky. `deep` / `night-*` with violet and pink glows.
- **Dawn (light theme):** `paper` with warm glows; cards are white with `card`
  elevation. **Night theme** swaps to the dark palette; the sky layer glows more.
- The `.sky` layer sits behind every page: a slow breathing glow and a dawn
  that warms with scroll progress.

## Components
- **Crisis strip:** pinned at the top of every page and above the opening;
  night surface, a slow pink heartbeat dot, numbers as `tel:` links in gold
  with underline. Nothing may cover it.
- **Check-in cards:** full-width sticky deck; each has its own colour and a
  wordless scene; only the front card animates.
- **Buttons:** primary uses the `cta` gradient on white text; secondary is
  outlined; pills (`radius.pill`) for navigation chips and the Begin button;
  44px minimum.
- **Ooh:** speaks in the page under the heading in a cream comic bubble
  (3px plum border, 4px offset shadow, a sun-gold name plate); tucks into the
  corner above the tab bar; see companion.js for every rule.
- **Tab bar (phones):** a floating pill at the bottom that slides away while
  scrolling down.
- **Settings:** a popover, never under the tab bar; "Sound and feel" is a
  2x2 grid of switches (Music, Sounds, Haptics, Ooh).

## Voice
Plain, warm, short. Never implies someone is watching or coming. "Screening is
not diagnosis" stays wherever it appears. No em dashes in Ooh's lines.

## Do
- Keep one clear action per screen.
- Make the helplines the easiest thing to reach on any screen.
- Test at 320px, 390px and 1280px, light and dark, and in one Indic script.

## Don't
- Don't put anything playful on the self-harm safety step or a risk result.
- Don't add motion that never stops, or sound before a tap.
- Don't paste another brand's DESIGN.md tokens in here (see the design-md skill).
