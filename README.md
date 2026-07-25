# Psych — Screen Early. Act Early.

**A free, private, on-device mental-health screener built for India** — plus a public
manifesto about the crisis it answers: too few psychiatrists, three-minute consultations,
care reduced to prescription refills, and follow-ups that never happen.

> If you or someone you know is struggling right now:
> **Tele-MANAS 14416** · **KIRAN 1800-599-0019** · **Emergency 112** (all free, 24×7)

## What's here

| File | What it is |
|---|---|
| `index.html` | **The screener app** — validated instruments, guidance, history tracking, follow-up reminders |
| `manifesto.html` | **The Waiting Room is Full** — a citizen's manifesto on India's mental-health treatment gap |

Both are plain HTML/CSS/JS with zero build step and zero backend. Open them in any
browser, or host them on GitHub Pages.

## The screener

The app uses the same public-domain instruments clinicians use:

- **PHQ-4** — 4-question quick triage for depression + anxiety
- **PHQ-9** — the standard depression screener (with a safety net: any response on the
  self-harm item immediately surfaces crisis helplines)
- **GAD-7** — the standard generalised-anxiety screener
- **AUDIT-C** — the WHO's brief screen for hazardous alcohol use

For every result it gives:

- **Score + severity band** with a plain-language explanation of what it means
- **Severity-matched next steps** for India — PHC/family doctor, District Mental Health
  Programme clinics, Tele-MANAS, when to go this week vs. watch and wait
- **A "get care, not just a refill" checklist** — questions to ask the doctor about
  diagnosis, psychotherapy, medication, and a fixed follow-up date
- **Follow-up built in** — scores are saved privately in the browser (localStorage,
  nothing leaves the device), charted over time, exportable, and printable as a summary
  to hand to a doctor; a downloadable `.ics` reminder schedules the next re-screen
  (1–4 weeks depending on severity)

### What it is not

This is a **screening and education tool, not a diagnostic instrument**. A high score
means "talk to a professional," never "you have X." It does not replace clinical
assessment and it stores no data on any server.

## Hosting on GitHub Pages

Settings → Pages → deploy from branch → `/ (root)`. The site is fully static.

## Roadmap

- Hindi and regional-language versions of the instruments (validated translations exist
  for PHQ-9/GAD-7)
- More instruments: perceived stress (PSS-4), postpartum (EPDS), adolescent screeners
- Optional caregiver mode for ASHA / community health workers doing assisted screening
- PWA packaging for offline use in low-connectivity areas

## Credits & licences

PHQ-4, PHQ-9, GAD-7 developed by Drs. Kroenke, Spitzer, Williams and colleagues — free
to use, no permission required. AUDIT-C derives from the WHO AUDIT. Statistics cited in
the manifesto are from the National Mental Health Survey of India 2015–16 and published
workforce estimates.
