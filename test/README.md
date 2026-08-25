# Mobile regression suite

    python3 -m http.server 8099     # from the repo root
    node test/mobile.js

Needs `playwright` (`npm i playwright`). Point it elsewhere with
`PSYCH_URL=…` and `PW_CHROME=…`.

Every check here exists because something broke on a real phone first and
was reported. It lives in the repo, rather than in a scratch directory,
because the point of it is to be re-run after a change — and because most
of these faults were invisible to the way the site was being checked
before:

1. **Reflow** — 7 widths × 3 text sizes × menu open and shut. The site
   was only correct at the default text size; at 135% the cards, the tab
   bar and the open menu each ran off the right of the screen.
2. **Opening sequence** — including a device carrying flags from an older
   build, and changing language mid-scene, which used to freeze it dead.
   Ends by checking the reader is put back at the top of the page.
3. **Crisis path** — a `#resources` deep link is never interrupted.
4. **Contrast** — light, dark and high contrast. The crisis strip was
   2.90:1 in dark mode; the No button was 1:1 in high contrast.
5. **Screeners** — all five run to completion, PHQ-9 raises the safety
   box, results reach history.
6. **Degradation** — a dropped `i18n.js` used to throw and leave a blank
   page with one working phone number on it.
7. **Offline** — the project's stated promise.
8. **Layout stability** — the nav used to render 229px tall then collapse
   to 64, lurching the page 165px while you read it.
9. **Every page** — the crisis strip is present and finger-sized on all
   of them, not just the home page.

A green run says nothing about whether a fix has actually reached a
phone. `sw.js` serves assets stale-while-revalidate for that reason; see
the note at the top of it.
