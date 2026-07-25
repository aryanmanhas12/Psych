# Psych Screener — Screen Early. Act Early.

**A free, private, multilingual mental-health screening web app built for India** — plus
the manifesto and evidence register that justify it.

**Live site:** https://aryanmanhas12.github.io/Psych/
**Built by:** [Aryan Manhas](https://github.com/aryanmanhas12) · MIT licensed

> If you or someone you know is struggling right now:
> **Tele-MANAS 14416** · **KIRAN 1800-599-0019** · **Emergency 112** (all free, 24×7)

---

## Why this exists

India has roughly **0.75 psychiatrists per 100,000 people** against a WHO recommendation
of 3+, and a **70–92% treatment gap**. The result is three-minute consultations, missed
diagnoses, care reduced to a prescription refill, and follow-ups that never happen. This
project attacks the two ends of that problem a website actually can reach: **finding
people earlier**, and **giving them the follow-up record the system doesn't**.

## What's here

| File | What it is |
|---|---|
| `index.html` | **The screener app** — instruments, guidance, history, follow-up reminders |
| `i18n.js` | **Translation layer** — every UI string and instrument item in 6 languages |
| `evidence.html` | **The Evidence Register** — 23 peer-reviewed citations behind every design decision |
| `manifesto.html` | **The Waiting Room is Full** — a citizen's manifesto on the treatment gap |
| `LICENSE` | MIT, plus a not-a-medical-device notice |

Plain HTML/CSS/JS. **No build step, no framework, no backend, no tracking.** Open any
file in a browser or host the folder anywhere static.

## Features

**Four validated instruments** — PHQ-4 (quick triage), PHQ-9 (depression), GAD-7
(anxiety), AUDIT-C (alcohol use), all public-domain and scored with published cutoffs.

**Six languages** — English, हिन्दी, मराठी, বাংলা, தமிழ், తెలుగు (roughly 70% of India by
first language). The choice persists between visits.

**A safety net** — any non-zero answer on the PHQ-9 self-harm item immediately surfaces a
crisis panel before the score is even discussed. Crisis lines are pinned on every page in
every language.

**Guidance, not just a number** — severity-matched next steps written for Indian care
pathways (PHC, District Mental Health Programme, Tele-MANAS), plus a "get care, not just
a refill" checklist of questions to ask the doctor.

**Follow-up built in** — scores saved privately on-device, charted over time against the
clinical cutoff, exportable/importable as JSON, printable as a doctor summary, and a
downloadable `.ics` reminder for the next re-screen (1–4 weeks by severity). Plus a daily
one-tap mood check-in with a 14-day strip and streak.

**Accessible by design** — text-size and high-contrast controls, full keyboard operation
(number keys and arrow keys answer questions), ARIA radiogroups and live regions, focus
management on view changes, a skip link, 44px+ touch targets, `prefers-reduced-motion`
support, and semantic tables.

**Private by architecture** — everything runs in the browser. There is no server, no
account, and no analytics; answers are stored only in `localStorage` on the user's own
device, and the user can export or delete all of it at any time.

### What it is not

A **screening and education tool, not a diagnostic instrument**. A high score means "talk
to a professional," never "you have X." It does not replace clinical assessment.

## Editing it

Everything is plain text — edit on GitHub in the browser (open a file → pencil icon →
commit) or clone and edit locally. Changes to `main` go live on GitHub Pages in ~1 minute.

| To change… | Edit |
|---|---|
| Wording, questions, guidance, resources | `i18n.js` — find the language block, edit the string |
| Add a language | Copy any language block in `i18n.js`, translate the values, keep the keys |
| Add an instrument | Add scoring to `META` in `index.html`, then add its text to every language in `i18n.js` |
| Colours, spacing, layout | The `:root` variables and CSS at the top of each HTML file |
| Citations | `evidence.html` |

Run it locally with any static server, e.g. `python3 -m http.server`, then open
`http://localhost:8000`.

## Roadmap

- Professionally validated translations for the instruments (published Hindi/Malayalam
  validations exist and should replace the working translations)
- More instruments: perceived stress (PSS-4), postpartum (EPDS), adolescent screeners
- Caregiver mode for ASHA / community health workers doing assisted screening
- PWA packaging for offline use in low-connectivity areas
- Field feedback from a DMHP clinic or college counselling centre

## Credits & licences

Code © 2026 Aryan Manhas, MIT licensed. PHQ-4, PHQ-9 and GAD-7 were developed by Drs.
Kroenke, Spitzer, Williams and colleagues and are free to use without permission; AUDIT-C
derives from the WHO AUDIT. Statistics cited come from the National Mental Health Survey
of India 2015–16 and the published literature indexed in `evidence.html`. Indian-language
instrument items here are working translations for accessibility, not the officially
validated language versions.
