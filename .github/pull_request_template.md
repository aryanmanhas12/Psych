## What changed and why

<!-- One short paragraph: what a person using Ronak will notice, and why. -->

## Ship check (from `.claude/skills/ronak-ship-check`)

- [ ] `REL` in `sw.js` and every `?v=N` bumped to the next free number (after `git fetch origin main`)
- [ ] Syntax: every `.js` passes `node --check`; `ooh.mjs` imports
- [ ] Mobile regression suite ends `ALL CHECKS PASS` (includes the axe-core accessibility scan)
- [ ] Layout shift about 0 on home with the visit opened
- [ ] Idle main thread under about 60ms per 4s at 4x CPU throttle
- [ ] Looked at it: 390px, 320px and 1280px, light and dark, one Indic script

## Clinical-safety invariants

- [ ] Crisis strip on every page, above everything, numbers are `tel:` links
- [ ] Self-harm answer still interrupts with the safety step: no Ooh, no music, no effects
- [ ] No music and no corner Ooh while questions are answered
- [ ] "Screening is not diagnosis" wording untouched; clinical items and bands untouched
- [ ] Any new string exists in all six languages
- [ ] `ooh.mjs` still byte-identical to Arun's `well-beings/lib/ooh.mjs` (CI checks this)

## Numbers

<!-- Paste the measured CLS, idle cost and the suite's last line. -->
