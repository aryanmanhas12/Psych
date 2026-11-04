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
  stamp-bg: "#C2185B"       # filled magenta chips and badges
  on-stamp: "#FFFFFF"
  on-marigold: "#1B1030"    # text on gold fills
  bar: "#FFC83D"            # progress fills
  aqua: "#22D3C5"           # one accent in the check-in scenes only
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
    deep: "#110A21"
    stamp-bg: "#B3124F"
    on-marigold: "#0C0717"
  high-contrast:            # Settings > High contrast: black on white, no glows, no valley
    ink: "#000000"
    paper: "#FFFFFF"
    card: "#FFFFFF"
    line: "#000000"
    muted: "#1A1A1A"
    heal: "#4B0FA8"
    stamp: "#8E0B45"
    stamp-bg: "#8E0B45"
    marigold: "#8A5D00"
    bar: "#8A5D00"
    deep: "#000000"
    on-deep: "#FFFFFF"
    on-marigold: "#FFFFFF"
  valley:                   # the home sky's Kashmir art (tools/valley, app.css .kv-*); art, not UI
    mid-ridge: "#2B1850"
    far-ridge: "#1D0F3B"
    shore: "#140A2C"        # tree line and poplars
    houseboat: "#251140"    # a shade lighter than the shore so the shape reads
    houseboat-roof: "#0E061D"
    window: "#FFC857"       # lit panes; halo "#FFB347" at .2, reflection at .34
    rim: "#FFD27A"          # dawn rim light on the range (faded away from the sun)
    snow-reflection: "#CDBDF2"
    chinar-crown: "#170A2B" # warm leaves "#6E1A38"; trunk "#110720"
    chinar-leaves: ["#C2364F", "#E9A23B", "#B4532A", "#D9573A", "#8E2440"]
    star: "#FFF6EE"         # your stars; check-in stars "#FFF8E1" with a gold glow
    flock: ["#E9A3BD", "#FFE0A8"]   # dusk rose to pale gold, never confetti
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
  readability:
    body: "18px (1rem) everywhere, phones included; reading pages use rem, never px, so the text-size setting reaches them"
    secondary: ">= .9rem (16px): ledes, panel copy, footers, table cells"
    labels: ">= .76rem (13.7px) for captions, sources, caps labels; tab-bar labels .68rem under their icons"
    crisis-numbers: "1.3em of the strip (14.5px on a phone), bold; the strip keeps its two-line height"
    tables: "3+ columns stack into labelled cards under 560px (table.stack + data-label)"

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
  easing:                     # CSS --e-*; the same curves are named in GSAP by motion.js
    out: "cubic-bezier(.215,.61,.355,1)"      # --e-out2, GSAP "rk-out"
    out-soft: "cubic-bezier(.25,.46,.45,.94)" # --e-out1
    spring: "cubic-bezier(.16,1,.3,1)"        # --e-spring, GSAP "rk-dawn": arrives, then settles
    breath: "cubic-bezier(.45,0,.55,1)"       # GSAP "rk-breath": in and out
  breath: 11s                 # the sky's glow cycle: about 5.5 breaths a minute
  durations:
    view-fade: ".2s out, .38s in"     # the app's places and page-to-page links
    card-open: .46s                   # a check-in card grows into what it opens
    line-rise: .95s                   # a headline's lines, staggered .09s
    score: 650ms                      # the count and the scale marker arrive together
    opening: 9.6s                     # eight beats on one clock
    flock-settle: 15s                 # after the last cursor move, touch or scroll
    idle-leaf: "14-26s apart"
  dials: { DESIGN_VARIANCE: 4, MOTION_INTENSITY: 5, VISUAL_DENSITY: 3 }   # design-taste-frontend
  libraries:                  # self-hosted in vendor/, never a CDN
    gsap: "3.15 core + CustomEase + SplitText, every page (motion.js)"
    lenis: "1.3.27, laptops only, home and reading pages only"
    vanta-birds: "0.5.24 on three r134, strong devices only, after load"
  rules:
    - Animate transform and opacity of HTML layers only; never groups inside an SVG. A drawing changes only by being regenerated (tools/valley), never by animating its parts.
    - Idle loops run only while on screen; everything stops under prefers-reduced-motion, html.lite and Less motion.
    - Nothing moves under a thumb; reserve space; layout shift stays at 0.
    - Pointer effects (depth, spotlight, tilt) only for hover-capable fine pointers, or a strong Android phone's tilt.
    - Cinematic outside, calm inside: the home sky and the reading pages move; a check-in, a result, Get Help and the crisis step do not.
    - Split text by lines or words, never letters (Indic conjuncts break).
    - A scene of several beats runs on one clock that stops while the page is hidden; never a chain of timeouts.
    - Heavy layers fly only while someone is there, then settle; a still page costs nothing.
    - Decorative light never crosses words: fade it out before it reaches them.
---

# Ronak design language

## The idea
Light arriving. The opening is a room at night; a door opens; someone sits
beside the person on the floor; the head lifts; the bloom-sun opens. The home
page repeats it in scroll: the Kashmir valley at the end of the night, whose
sun rises between Harmukh's twin peaks as you move down, and check-ins that
are each a small scene of the moment *after* (a spark lighting, a bud
opening), never an illustration of the problem.

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
- **Opening (phones):** a full-bleed vertical story, never a letterboxed
  box. Upright: the picture fills the screen under the crisis strip, the
  camera frames the two people (window above them, door at the right edge,
  open night for the sun), a thin progress line across the top with Skip
  under its right end, caption and the six languages on a fade at the foot.
  Sideways: picture left at full height, controls right. Ends on Ooh beside
  the bloom and lowercase "ronak". Geometry lives in `otFit` (app.js).
- **The valley (home sky):** back to front, the Pir Panjal with Harmukh's
  twin summits and Kolahoi (snow moonlit, catching the alpenglow as you
  scroll), the flock, ridge mist, forested ridges, the lake with a poplar
  shore, lit houseboats and the mountains upside down, a shikara crossing,
  a chinar in front on the side away from the words. The panorama is aimed
  so the saddle between Harmukh's summits sits under `--sun-x`. It answers
  taps (ripples, falling leaves, the lantern, a peak in sunlight, a falling
  star) and leans with the cursor; all of it is aria-hidden decoration.
  Generated by `tools/valley` (`node tools/valley/apply.js`); CI fails if
  index.html and its source disagree.
- **Your stars:** one bright four-point star per check-in and a small one
  per day's mood, from this device's history only, placed by a hash of the
  date and never behind the words. History repeats them as "Your sky", laid
  out by date with the check-ins joined like a constellation, the counts
  in words beside it. The day's first mood tap sends a spark up toward it.
  Stars, not a streak: a missed day simply stays dark.
- **Headlines and figures:** on the home screen and the reading pages they
  rise out of their own lines once, as they come into view; whatever is on
  screen at load is left as painted.
- **Opening a check-in:** the card grows into the screen it opens; the
  result's marker travels to the score as the number counts. Neither
  celebrates a high band.
- **Tab bar (phones):** a floating pill at the bottom that slides away while
  scrolling down.
- **Moving around:** one calm cross-fade for the app's four places and for
  page-to-page links (`@view-transition`); the helpline strip and the nav
  hold still. Skipped for reduced motion, lite and "Less motion".
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
- Don't add streaks, points or badges: apps without gamification lose fewer
  people (Liu, Torous et al., JAMA Psychiatry 2026).
- Don't edit the valley by hand in index.html; change `tools/valley` and run
  `node tools/valley/apply.js`.
- Don't paste another brand's DESIGN.md tokens in here (see the design-md skill).
