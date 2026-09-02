/* ══════════════════════════════════════════════════════════════
   Psych Screener — translation layer
   Languages: English, हिन्दी, मराठी, বাংলা, தமிழ், తెలుగు

   NOTE ON CLINICAL USE: the English items are the original published
   instruments (PHQ-4/9, GAD-7 — Kroenke/Spitzer/Williams; AUDIT-C — WHO).
   The Indian-language item sets here are working translations provided
   for accessibility. Officially validated translations exist for several
   of these instruments and should be preferred for research or formal
   clinical use. The app states this to the user in every language.
   ══════════════════════════════════════════════════════════════ */
(window.I18N = window.I18N || {}).en = {
  label: "English", htmlLang: "en",
  ui: {
    skip: "Skip to main content",
    crisis: "IN DISTRESS? TELE-MANAS 14416 · KIRAN 1800-599-0019 · EMERGENCY 112",
    callLabel: "Call",
    crisisMeta: "FREE · 24×7 · CONFIDENTIAL",
    settings: "Settings",
    readMore: "Read more",
    navGuide: "Talk it through",
    theme: "Theme",
    themeAuto: "Auto",
    skipIntro: "Skip",
    replayIntro: "Replay the opening",
    introAlt: "A wordless animation: a person sits curled on the floor of a room while people pass the window without stopping; someone comes through the door and sits down beside them; the person lifts their head and the room warms.",
    introCap: "No words needed. A few seconds, then we begin.",
    themeLight: "Light",
    themeDark: "Dark",
    breatheOpen: "Try a breathing exercise",
    breatheTitle: "Slow breathing",
    breatheNote: "Paced breathing at about six breaths a minute calms the body's alarm response. It will not fix what's wrong — it buys you a few minutes of steadier ground to make a call from.",
    breatheStart: "Begin",
    breatheStop: "Stop",
    breatheIn: "Breathe in",
    breatheHold: "Hold",
    breatheOut: "Breathe out",
    breatheRounds: "{n} rounds",
    breatheDone: "That's enough for now. If the feeling is still heavy, please make the call.",
    install: "Install app",
    offline: "Works offline",
    navEthics: "Ethics",
    guideEyebrow: "Not sure where to start?",
    guideTitle: "Talk it through",
    guideHonest: "A guided conversation — not an AI chatbot. It follows a fixed script written with clinicians' guidance, runs entirely on your device, and stores nothing. It cannot diagnose you or read free text.",
    guideNow: "I need help now",
    guideRestart: "Start over",
    guideStep: "Step {n}",
    qStart: "What brings you here today?",
    oLost: "I've been struggling and don't know where to start",
    oCheck: "I want to check specific symptoms",
    oOther: "I'm worried about someone else",
    oNow: "I need help right now",
    qFeel: "Which of these is closest to what you've been feeling?",
    oLow: "Low, flat, or hopeless — nothing feels worth doing",
    oAnx: "Anxious, tense, or unable to stop worrying",
    oDrink: "I'm drinking more than I want to",
    oUnsure: "Something's wrong but I can't name it",
    rLow: "What you're describing — low mood, loss of interest, hopelessness — is what the PHQ-9 was built to measure. It takes about three minutes and nothing leaves this device.",
    rAnx: "Persistent worry you can't switch off is what the GAD-7 measures. It takes about two minutes and nothing leaves this device.",
    rDrink: "The AUDIT-C is three questions from the WHO about drinking patterns. It's short, non-judgemental, and nothing leaves this device.",
    rUnsure: "That's a completely normal place to be — and it's exactly what a brief screen is for. The PHQ-4 asks four questions and points you to whichever fuller check fits.",
    rOther: "Supporting someone takes less expertise than people think. Ask directly and plainly — \"are you thinking about ending your life?\" does not plant the idea; research consistently shows it lowers distress. Listen without fixing. Don't promise secrecy if they're in danger. Offer to sit with them while they call a helpline, or to go with them to an appointment. And look after yourself too — you're allowed to find this hard.",
    rCrisis: "You don't have to explain or justify anything to call these. They are free, confidential, and answered by trained people, 24 hours a day.",
    guideTake: "Take the {name} →",
    guideHelplines: "See helplines",
    guideMore: "Something else",
    tokenLabel: "TOKEN",
    aboutToggle: "What this is — and what it isn't",
    timeTaken: "You took {t} on this.",
    timeContext: "A psychiatric consultation in an overloaded Indian OPD often runs under five minutes — for history, diagnosis, prescription and counselling combined. You just gave yourself more unhurried attention than the system usually can.",
    navScreeners: "Screeners", navHistory: "My History", navHelp: "Get Help",
    tabScreeners: "Screeners", tabGuide: "Talk", tabHelp: "Help", tabHistory: "History",
    navEvidence: "Evidence", navManifesto: "Manifesto",
    langLabel: "Language", textSize: "Text size", contrast: "High contrast",

    homeEyebrow: "Screen Early · Act Early",
    homeTitle1: "Five minutes now beats", homeTitle2: "five years of silence.",
    homeSubtitle: "Check in on your mood, anxiety, or stress. Free, private, on-device screening with immediate guidance on what to do next — nothing leaves your phone.",
    homeLede: "India's treatment gap for mental illness is 70–92% — most people who need care never reach it, and many who do get a prescription refill instead of a plan. This tool uses the same validated questionnaires doctors use, tells you what your score means, and shows you how to get real care and real follow-up.",
    noticeTitle: "⚠ This is a screening tool, not a diagnosis.",
    noticeBody: "Only a qualified clinician can diagnose a mental illness. A high score means \"talk to a professional,\" never \"you have X.\" A low score with ongoing distress still deserves attention.",
    privacy: "🔒 Privacy: everything runs in your browser. Your answers never leave this device.",
    transNote: "🌐 Translation note: Indian-language versions are working translations for accessibility. Officially validated translations exist for some instruments and should be used for research or formal clinical work.",

    moodTitle: "Daily one-tap mood check-in",
    moodPrivate: "· private · this device only",
    moodPrompt: "How are you feeling today? One tap builds a 14-day picture you can show a doctor.",
    moodLogged: "Logged for today · {n}-day streak. A daily record beats a memory in any consultation.",
    moods: ["Very low", "Low", "Okay", "Good", "Great"],

    chooseScreener: "Choose a screener",
    start: "Start",
    primerPrivate: "Your answers stay on this phone. Nothing is sent anywhere.",
    primerGet: "At the end you get a score, what it means, and what to do next.",
    primerNot: "This is not a diagnosis.",
    primerBack: "Choose a different one",

    /* ── the speaker on each question ── */
    listen: "Listen to this question",

    /* ── the note a patient hands to a clinician ── */
    sbarBtn: "Copy note for doctor",
    sbarCopied: "\u2713 Copied \u2014 paste it anywhere",

    /* ── sharing ──
       Two separate things, because they carry very different weight. The
       tool is safe to pass around; a score is the person's own. */
    shareTool: "Share this tool",
    shareToolTitle: "Psych Screener",
    shareToolText: "A private mental health check you can do on your own phone \u2014 free, offline, in six languages. Nothing you answer leaves your device.",
    shareResult: "Share my result",
    shareResultNote: "This one includes your score.",
    shareResultTitle: "My {name} result",
    shareResultText: "My {name} screening came out {score}/{max} \u2014 {band}. I took it privately on my own phone at {url}",

    /* ── the safety plan, inside the crisis panel ── */
    spTitle: "Make a safety plan",
    spIntro: "A short private list you write for yourself now, so that a worse hour later has something to follow. It is saved only on this phone.",
    sp1: "1. Warning signs \u2014 what it feels like when it starts",
    sp2: "2. What helps me on my own",
    sp3: "3. Places and people that steady me",
    sp4: "4. Someone I can call",
    spPh1: "restless, not sleeping, shutting people out",
    spPh2: "a walk, a warm shower, slow breathing, music",
    spPh3: "the terrace, the park, my sister's place",
    spPh4: "a name and a number",
    spSave: "Save plan",
    spSaved: "\u2713 Saved on this phone only.",

    /* ── breathing: plain word first, clinical name in the tooltip, the
         same headline-and-credit split the screener cards use ── */
    protoVagal: "4-7-8 \u00b7 calming",
    protoVagalT: "4-7-8 breathing (vagal reset): in for 4, hold 7, out 8",
    protoBox: "Box \u00b7 steady",
    protoBoxT: "Box breathing: 4 in, 4 hold, 4 out, 4 hold",
    protoCoh: "5.5 \u00b7 even",
    protoCohT: "Resonance breathing at 5.5 seconds each way",

    /* ── the heading over the treatment-gap argument ── */
    homeLedeHead: "Why this exists",
    /* the three jobs the results screen's buttons actually do */
    groupDoctor: "To take to a doctor",
    groupTrack: "To come back to",
    groupShare: "To share",
    /* The five working documents, and the section that introduces them.
       These were hard-coded English in the markup — a reader who had set
       the site to Hindi scrolled past the screeners and hit a block of
       English with no warning. The documents themselves stay in English:
       they are a clinician-facing evidence register, an ethics charter and
       a long argument, and a working translation of those is a bigger
       promise than this project can keep honestly. So the section says so,
       rather than letting someone tap through into a wall. */
    behindTitle: "What's behind this",
    behindSub: "Every claim this tool makes is written down and checkable. These are the working documents, not marketing pages.",
    behindEnglish: "These five documents are in English.",

    behindEvidenceK: "Peer-reviewed",
    behindEvidenceT: "The Evidence Register",
    behindEvidenceD: "Every instrument and design decision, with the study behind it — sensitivity, sample size, and the figures that are weaker.",
    behindEvidenceG: "Read the register \u2192",

    behindGlobalK: "WHO & UN",
    behindGlobalT: "Global Frameworks",
    behindGlobalD: "How this maps to SDG 3.4, WHO's Action Plan, mhGAP and QualityRights — including what it cannot do.",
    behindGlobalG: "See the alignment \u2192",

    behindEthicsK: "Verifiable",
    behindEthicsT: "Ethics & Privacy Charter",
    behindEthicsD: "What is collected (nothing), how to check that yourself, and the capabilities deliberately refused.",
    behindEthicsG: "Check the claims \u2192",

    behindManifestoK: "The argument",
    behindManifestoT: "The Waiting Room is Full",
    behindManifestoD: "Why one psychiatrist for 133,000 people makes neglect a structural certainty, not a personal failing.",
    behindManifestoG: "Read the manifesto \u2192",

    behindPosterK: "Printable",
    behindPosterT: "Clinic Poster",
    behindPosterD: "One A4 sheet in six languages with a QR code. For a waiting room, a college corridor, a PHC wall.",
    behindPosterG: "Print a copy \u2192",

    whyRescreenTitle: "Why re-screen?",
    whyRescreen: "Scores are snapshots. Tracking them every 2–4 weeks is how clinicians measure whether treatment is working — this app saves your scores privately on this device and reminds you when it's time to check again. That's the follow-up the system forgets; do it for yourself.",

    qOf: "Question {i} of {n}", tapOrPress: "tap an answer to continue (or press 1–{k})",
    back: "← Back", cancel: "Cancel",

    resultOf: "out of {max}", yourResult: "Your Result", resultTitle: "{name} Result",
    whyTrust: "Why trust this score? See the evidence register →",
    whatToDo: "What to do with this score",
    rescreenOn: "📅 Recommended re-screen: {date}",
    rescreenTail: "({n} days from now). Tracking the trend is the follow-up care most OPDs can't give you — use the reminder button below.",
    doctorTitle: "If you see a doctor: get care, not just a prescription",
    doctorPoints: [
      "<b>Ask for your diagnosis by name</b> — and what the score or assessment behind it was.",
      "<b>Ask about non-drug options</b> — psychotherapy (CBT, counselling) is first-line treatment for mild–moderate depression and anxiety, not a luxury add-on.",
      "<b>If medication is prescribed:</b> ask what it's for, how long until it works, side effects, and how long you'll take it.",
      "<b>Before leaving, fix a follow-up date.</b> \"When should I come back, and what should improve by then?\" If the OPD can't book one, book your own re-screen here.",
      "<b>Bring your score history</b> — use \"Print summary\" below. Numbers over time are exactly what a rushed OPD consultation is missing."
    ],

    sheetBtn: "Sheet for your clinician",
    sheetEyebrow: "For the consultation",
    sheetTitle: "Clinical summary",
    sheetPrint: "Print / save as PDF",
    sheetLede: "One page to hand to a doctor. It carries your answers item by item, how your scores have moved over time, and the instrument's own accuracy and limits — so the conversation can start further along than a single number allows.",
    sheetPatientNote: "The sheet is written in English, the working language of most clinics: a mistranslated clinical form is more dangerous than an untranslated one. Your own answers appear in both English and your language, so you can read exactly what you are handing over. Nothing is sent anywhere — the page is built on your device and is gone when you close it.",
    printBtn: "Print this page", reminderBtn: "📅 Add re-screen reminder",
    viewHistory: "View my history", backHome: "Back to screeners",
    printHead: "PSYCH SCREENER SUMMARY · {name} · {date} · Self-administered screening — not a diagnosis. For clinical correlation.",

    safetyTitle: "⚠ Please read this first",
    safety1: "You said you've had thoughts of being better off dead or of hurting yourself. Those thoughts are a symptom — they are treatable, and they are more common than you think. You do not have to handle this alone or wait for it to pass.",
    safety2: "Talk to someone today:",
    safety3: "Tell one person you trust, today. If you can, don't be alone tonight.",
    lineTelemanas: "TELE-MANAS: 14416 (24×7, free, many Indian languages)",
    lineKiran: "KIRAN: 1800-599-0019 (24×7, free)",
    lineEmergency: "Emergency: 112 — if you are in immediate danger",

    meanings: [
      "This range is below the clinical concern threshold on this screener.",
      "This range suggests mild symptoms worth monitoring and acting on early.",
      "This range is at or above the level where clinical guidelines recommend professional assessment.",
      "This range indicates significant symptoms that warrant prompt professional care."
    ],
    noteAuditc: " Note: the positive-screen cutoff is 4+ for men and 3+ for women.",
    noteWho5: " Note: this scale runs the other way — a higher score is better, and a score of 12 or below (50 out of 100) is the point at which a fuller assessment is worth having.",
    wellbeingsTag: "Between screenings", wellbeingsTitle: "Keep a weekly pulse on how you're doing", wellbeingsBody: "This screener is for the occasional deeper check. Well-beings is built for the quick weekly one — a single tap that notices if things are slipping, and sends you back here when a fuller look is worth it.", wellbeingsCta: "Open Well-beings →", wbBackTag: "Sent from Well-beings", wbBackBody: "Your weekly check-in flagged that a fuller look might help. Pick a screener below whenever you're ready — there's no rush.", tourCtaBtn: "▶ Watch the intro",
    introQuestion: "Do you agree with the statement?", introYes: "Yes", introNo: "No", introSkip: "Skip these questions",
    introCrisisLead: "In distress right now? You can go straight to",
    introStatements: ["Feeling low for weeks at a time is just part of life — not something a doctor can help with.","I would find it hard to tell a doctor how I have actually been feeling.","If something were wrong, I would rather know sooner than later."],
    sheetNudge: "You said it would be hard to put this into words with a doctor. That is what the sheet below is for — it says it for you, item by item.", tourStart: "Take the tour", tourSkip: "Skip tour", tourNext: "Next", tourDone: "Done", tourCount: "Step {n} of {total}", tour: { tourSettings: { t:"Change how the page looks", b:"Language, text size, contrast and light or dark — all here, and nothing you pick leaves this device." }, tourScreeners: { t:"Pick a screener to begin", b:"Four to five minutes, whichever one fits what's on your mind right now. You can always take another later." }, tourCrisis: { t:"These numbers are always here", b:"Pinned to the top of every page, in every language. If today is urgent, start here instead." }, tourManifesto: { t:"Why this exists", b:"The argument behind the project, in full — the treatment gap this is trying to close, and why a five-minute screen matters." }, tourHowThis: { t:"What this is — and isn't", b:"Read this once. It says plainly what the tool can tell you and what only a clinician can." }, },
    notePhq4: " The PHQ-4 is a quick triage tool — if you scored 3+ on the first two questions, take the GAD-7; if 3+ on the last two, take the PHQ-9.",

    histTitle: "My score history", histEyebrow: "Follow-Up",
    histLede: "Saved privately in this browser only. This is your follow-up record — the trend matters more than any single score. Bring it to appointments.",
    histEmpty: "No screenings saved yet. Take a screener and your scores will appear here — privately, on this device only.",
    histLatest: "{name} — latest: {score}/{max} ({label})",
    histCount: "{n} screening(s)",
    trendDown: "improving since last screen", trendUp: "worse than last screen", trendFlat: "unchanged since last screen",
    colDate: "Date", colScore: "Score", colResult: "Result",
    exportBtn: "Export data (JSON)", importBtn: "Import data", deleteBtn: "Delete all my data",
    confirmDelete: "Delete all saved screening history from this device? This cannot be undone.",
    importOk: "Imported {n} saved screenings.", importFail: "That file didn't look like a Psych Screener export.",
    chartAria: "{name} scores over time; clinical cutoff at {cut}",

    resTitle: "Where to turn", resEyebrow: "Get Help · India",
    resources: [
      ["☎ Tele-MANAS — 14416 or 1-800-891-4416", "The Government of India's national tele-mental-health service. Free, 24×7, confidential, available in 20+ languages. Trained counsellors handle the call and can escalate to mental-health specialists and link you to services in your district. This is the single best first call for most people."],
      ["☎ KIRAN — 1800-599-0019", "National toll-free mental-health rehabilitation helpline, 24×7, 13 languages. Support for anxiety, depression, substance use, and crisis."],
      ["🚨 Emergency — 112", "If you or someone else is in immediate danger of harm, call 112 or go to the nearest hospital emergency department. Say the words \"psychiatric emergency.\""],
      ["🏥 District Mental Health Programme (DMHP)", "Most districts run a DMHP clinic at the district hospital with a psychiatrist or trained medical officer, free or near-free medicines, and counselling. Ask at your district hospital for the mental health clinic. Under the Mental Healthcare Act 2017, affordable mental healthcare is your legal right."],
      ["🩺 Your nearest PHC or family doctor", "You don't need a psychiatrist to start. General physicians can diagnose and begin first-line treatment for depression and anxiety, and refer when needed. Bring your printed score summary from this app — it gives a rushed consultation a head start."],
      ["🧠 Psychotherapy — ask for it by name", "For mild-to-moderate depression and anxiety, talking therapies (CBT, behavioural activation, counselling) are first-line, evidence-based treatment — medication is not the only option. Ask any doctor: \"Is psychotherapy appropriate for me, and where can I get it?\""],
      ["📱 What \"good follow-up\" looks like", "A named diagnosis (or an honest \"we're not sure yet — here's the plan\"). A treatment plan with a review date, typically 2–4 weeks after starting or changing treatment. Symptom scores repeated over time. A clear answer on therapy, not just tablets. Someone to call between visits — save 14416 in your phone."]
    ],

    disclaimer: "<strong>Disclaimer:</strong> This tool uses public-domain screening instruments (PHQ-4, PHQ-9, GAD-7 — Kroenke, Spitzer &amp; Williams; AUDIT-C — WHO). It provides education and screening only; it does not provide medical advice, diagnosis, or treatment, and it is not a substitute for consultation with a qualified health professional. All data stays on your device.",
    builtBy: "Built by Aryan Manhas"
  },
  inst: {
    phq4: { tag:"Quick Check · Start Here", about:"Low mood and anxiety, in four questions. A good place to begin if you're not sure.", name:"PHQ-4", meta:"4 questions · ~1 min",
      desc:"A 4-question ultra-brief check for both depression and anxiety. If it flags anything, it points you to the full screeners below.",
      intro:"Over the last 2 weeks, how often have you been bothered by the following problems?",
      period:"OVER THE LAST 2 WEEKS",
      opts:["Not at all","Several days","More than half the days","Nearly every day"],
      q:["Feeling nervous, anxious, or on edge","Not being able to stop or control worrying","Feeling down, depressed, or hopeless","Little interest or pleasure in doing things"],
      bands:["No significant distress","Mild distress","Moderate distress","Severe distress"],
      cutoffLabel:"Moderate (6+)" },
    phq9: { tag:"Depression", about:"Mood, sleep, appetite, energy, concentration — and thoughts of harming yourself.", name:"PHQ-9", meta:"9 questions · ~3 min",
      desc:"The standard depression screener used in clinics worldwide and in India's District Mental Health Programme.",
      intro:"Over the last 2 weeks, how often have you been bothered by any of the following problems?",
      period:"OVER THE LAST 2 WEEKS",
      opts:["Not at all","Several days","More than half the days","Nearly every day"],
      q:["Little interest or pleasure in doing things","Feeling down, depressed, or hopeless","Trouble falling or staying asleep, or sleeping too much","Feeling tired or having little energy","Poor appetite or overeating","Feeling bad about yourself — or that you are a failure or have let yourself or your family down","Trouble concentrating on things, such as reading the newspaper or watching television","Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual","Thoughts that you would be better off dead or of hurting yourself in some way"],
      bands:["Minimal depression","Mild depression","Moderate depression","Moderately severe depression","Severe depression"],
      cutoffLabel:"Clinical cutoff (10+)" },
    gad7: { tag:"Anxiety", about:"Feeling nervous, unable to stop worrying, restless, or easily irritated.", name:"GAD-7", meta:"7 questions · ~2 min",
      desc:"The standard screener for generalised anxiety, also sensitive to panic and social anxiety symptoms.",
      intro:"Over the last 2 weeks, how often have you been bothered by the following problems?",
      period:"OVER THE LAST 2 WEEKS",
      opts:["Not at all","Several days","More than half the days","Nearly every day"],
      q:["Feeling nervous, anxious, or on edge","Not being able to stop or control worrying","Worrying too much about different things","Trouble relaxing","Being so restless that it is hard to sit still","Becoming easily annoyed or irritable","Feeling afraid, as if something awful might happen"],
      bands:["Minimal anxiety","Mild anxiety","Moderate anxiety","Severe anxiety"],
      cutoffLabel:"Clinical cutoff (10+)" },
    who5: { tag:"Well-Being", about:"How cheerful, calm, rested and interested you've felt over the last two weeks.", name:"WHO-5", meta:"5 questions · ~1 min",
          desc:"The World Health Organization's well-being index — the one screener here that asks what is going right, not what is wrong.",
          intro:"Please indicate for each of the five statements which is closest to how you have been feeling over the last two weeks.",
          period:"OVER THE LAST 2 WEEKS",
          opts:["At no time","Some of the time","Less than half the time","More than half the time","Most of the time","All of the time"],
          q:["I have felt cheerful and in good spirits","I have felt calm and relaxed","I have felt active and vigorous","I woke up feeling fresh and rested","My daily life has been filled with things that interest me"],
          bands:["Very low well-being","Low well-being","Moderate well-being","Good well-being"] },
    auditc: { tag:"Alcohol Use", about:"How often you drink, how much, and how often it's a heavy amount.", name:"AUDIT-C", meta:"3 questions · ~1 min",
      desc:"The WHO's brief screen for hazardous drinking — one of India's most under-recognised mental-health burdens.",
      intro:"Please answer about your alcohol use in the past year. One \"drink\" = roughly 30 ml spirits, 100 ml wine, or 285 ml of regular beer.",
      period:"OVER THE PAST YEAR",
      q:["How often do you have a drink containing alcohol?","How many drinks containing alcohol do you have on a typical day when you are drinking?","How often do you have six or more drinks on one occasion?"],
      optsets:[["Never","Monthly or less","2–4 times a month","2–3 times a week","4 or more times a week"],["1 or 2","3 or 4","5 or 6","7 to 9","10 or more"],["Never","Less than monthly","Monthly","Weekly","Daily or almost daily"]],
      bands:["Lower risk","Possible risk (above cutoff for women)","Hazardous drinking likely","High risk / possible dependence"],
      cutoffLabel:"Positive screen (4+; 3+ for women)" }
  },
  guidance: [
    ["Your score doesn't suggest a significant problem right now. If you still feel something is wrong, trust that feeling — screeners miss things, and a conversation with a doctor or counsellor is never wasted.",
     "Protect the basics: sleep, movement, sunlight, and real conversation are genuinely protective.",
     "Re-screen in about 4 weeks, or sooner if things change."],
    ["Your score suggests mild symptoms. Many people at this level improve with support and self-care — but don't ignore it: mild is the cheapest stage to act at.",
     "Tell someone you trust how you've been feeling. Silence is what turns mild into severe.",
     "Consider calling Tele-MANAS (14416) — talking to a trained counsellor is free and confidential.",
     "Re-screen in 2 weeks. If your score is rising, or this is your third mild result in a row, see a doctor."],
    ["Your score suggests moderate symptoms — the level at which clinical guidelines recommend professional care, and at which treatment (psychotherapy and/or medication) clearly helps.",
     "See a doctor within the next 1–2 weeks: your PHC, family doctor, or the District Mental Health Programme clinic at your district hospital. You do not need a psychiatrist to start.",
     "Call Tele-MANAS (14416) — they can counsel you now and tell you exactly where to go in your district.",
     "Ask specifically about psychotherapy, not only medication.",
     "Re-screen in 2 weeks to see whether treatment is working."],
    ["Your score suggests severe symptoms. This deserves professional attention this week — not someday. Severe symptoms are highly treatable, and people recover.",
     "See a doctor within days: district hospital psychiatry OPD / DMHP clinic, or any doctor who can refer you urgently.",
     "Call Tele-MANAS (14416) today — 24×7 — to be connected to a specialist and local services.",
     "Involve one person you trust in getting to the appointment. You shouldn't have to organise care while carrying this.",
     "Re-screen in 1 week and bring both scores to your appointment."]
  ]
};
