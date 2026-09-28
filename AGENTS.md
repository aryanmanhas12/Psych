# AGENTS.md — Ronak

Read this first, every session. It is the project's memory for Claude Code
(`CLAUDE.md` imports it) and for Codex.

## What this is
Ronak ("radiance"): a free, private, offline mental-wellbeing check-in web app
for India, in six languages (English, Hindi, Marathi, Bengali, Tamil, Telugu).
Validated screeners (PHQ-4, PHQ-9, GAD-7, WHO-5, AUDIT-C) scored on the device.
Screening is not diagnosis. Static site, no build step, published by GitHub
Pages from `main` at https://aryanmanhas12.github.io/Psych/.

Sister app: **Arun** (repo `aryanmanhas12/Well-beings`, Next.js in
`well-beings/`), the daily-life wellbeing picture. The two share one guide,
**Ooh**, drawn by `ooh.mjs`, which must stay byte-identical to Arun's
`well-beings/lib/ooh.mjs` (change it there, copy it here). They also share the
brand family: the bloom-sun, the lowercase Karla 700 wordmark.

## Files that matter
| File | Role |
|---|---|
| `index.html` | the app shell: every view, the opening scene, settings |
| `app.js` / `app.css` | app logic and app styles |
| `site.css` | shared design system for all pages (tokens, nav, Ooh, feel) |
| `nav.js` | the sky layer and the collapsing nav, on every page |
| `companion.js` | Ooh the guide, UI sounds, haptics and visual haptics |
| `ooh.mjs` | Ooh's drawing, shared with Arun |
| `music.js` | the generated sunrise music (Web Audio, no files) |
| `i18n.<lang>.js` | every string, six files; `T.ooh` holds Ooh's lines |
| `sw.js` | offline cache; `REL` is the release number |
| `test/mobile.js` | the Playwright regression suite CI runs |
| `DESIGN.md` | the design source of truth: read before any visual work |

## Skills: use them every time (they live in `.claude/skills/`)
1. **Before any visual change:** read `DESIGN.md` (skill `design-md`), then
   `design-taste-frontend` for the brief and dials (Ronak: VARIANCE 4,
   MOTION 5, DENSITY 3). For calm/premium polish add `high-end-visual-design`.
2. **Changing something that exists:** `redesign-existing-projects` (audit
   first, fix without breaking).
3. **Building from a picture or screenshot:** `image-to-code` (analyse the
   image fully, then implement to match).
4. **Motion or micro-interactions:** `animated-ui-libraries` (Aceternity UI,
   Cult UI, Componentry). Ronak ports effects to vanilla CSS/JS on the
   compositor; never add React/Tailwind here.
5. **Review:** `web-design-guidelines` (fetch the live Vercel rules, report
   `file:line`), then fix what is real.
6. **See it:** `playwright-cli` (open, snapshot, click, screenshot) or a
   Playwright script with `executablePath:'/opt/pw-browsers/chromium'`.
7. **Long output:** `full-output-enforcement` (no placeholders).
8. **Before every commit:** `ronak-ship-check` (version bump, suite, layout
   shift, idle cost, screenshots, safety invariants).

## Rules that never bend
- The crisis strip (Tele-MANAS 14416, Vandrevala 9999-666-555, 112) is on every
  page and on top of everything, including the opening. Numbers are `tel:`.
- Self-harm item endorsed: the safety step interrupts, with no Ooh, no music,
  no sound, no effects. No music and no corner Ooh during questionnaire items.
- Ooh never implies anyone is watching, waiting or coming; gentle moods only
  on a risk result; English lines <= 120 characters, no em dashes.
- Six languages move together. Clinical wording is not "improved" casually.
- Motion: transform/opacity on HTML layers only; stops under reduced motion
  and `html.lite`; layout shift stays ~0; idle main thread stays small on a
  4x-throttled phone (see `ronak-ship-check`).
- No third-party requests at runtime (fonts are self-hosted; sounds are local;
  music is generated). Nothing leaves the device.

## Working conventions
- Another Claude session works on Arun and sometimes on Ronak's shared brand.
  `git fetch origin main` before starting and before a release; take the next
  free `REL`. Never force-push `main`.
- Commit messages explain why; end with the attribution lines the session
  gives. PRs go to `main`; CI is the "mobile regression suite" workflow.
