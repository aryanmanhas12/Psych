/* ══════════════════════════════════════════════════════════════
   Psych Screener — crisis & support lines, worldwide
   ──────────────────────────────────────────────────────────────
   SAFETY ARCHITECTURE — read before editing:

   Helpline numbers change, merge, and get discontinued. A hardcoded
   list in a static site WILL go stale. So this file is deliberately
   DIRECTORY-FIRST: the maintained international directories below are
   always shown at the top of the help view and are always current,
   because they are maintained by organisations whose job that is.
   The per-region numbers are a convenience layer beneath them, never
   the only path to help.

   If you add a number: cite where you verified it, and update
   LAST_REVIEWED. If you cannot verify a number, do not add it —
   an unanswered crisis number is worse than no number.

   Names, numbers and org titles are intentionally NOT translated:
   they are proper nouns and dialable strings, identical in every
   language. Only the surrounding UI chrome is translated.
   ══════════════════════════════════════════════════════════════ */

window.HELP = {

  LAST_REVIEWED: "2026-07",

  /* Always-current, maintained directories. Shown first, everywhere. */
  directories: [
    { name: "Find A Helpline",
      url:  "https://findahelpline.com",
      note: "Free, verified helplines in 130+ countries. Pick your country, get numbers, live chat and text options that are checked and kept current." },
    { name: "IASP — Crisis Centres",
      url:  "https://www.iasp.info/crisis-centres-helplines/",
      note: "The International Association for Suicide Prevention's global directory of crisis centres, listed country by country." },
    { name: "Befrienders Worldwide",
      url:  "https://befrienders.org",
      note: "Emotional-support centres across 30+ countries offering confidential listening, in local languages." }
  ],

  /* Emergency services — for immediate danger to life. */
  emergency: [
    { where: "India, EU, and much of the world", num: "112" },
    { where: "United States & Canada",           num: "911" },
    { where: "United Kingdom",                   num: "999" },
    { where: "Australia",                        num: "000" },
    { where: "New Zealand",                      num: "111" }
  ],

  /* Regional lines. `tel` is stripped to digits for the dial link. */
  regions: [
    { id: "sa", label: "South Asia", lines: [
      { country:"India",       org:"Tele-MANAS (Govt. of India)", num:"14416",          tel:"14416",        note:"24×7, free, 20+ languages" },
      { country:"India",       org:"KIRAN",                       num:"1800-599-0019",  tel:"18005990019",  note:"24×7, free, 13 languages" },
      { country:"India",       org:"AASRA",                       num:"+91 98204 66726",tel:"+919820466726",note:"24×7 volunteer-run" },
      { country:"Bangladesh",  org:"Kaan Pete Roi",               num:"09612-119911",   tel:"09612119911",  note:"Emotional support" },
      { country:"Pakistan",    org:"Umang",                       num:"0311-7786264",   tel:"03117786264",  note:"Trained volunteers" },
      { country:"Sri Lanka",   org:"CCCline",                     num:"1333",           tel:"1333",         note:"24×7 free" },
      { country:"Nepal",       org:"TUTH Suicide Hotline",        num:"1166",           tel:"1166",         note:"24×7" }
    ]},
    { id: "ap", label: "Asia-Pacific", lines: [
      { country:"Australia",   org:"Lifeline",                    num:"13 11 14",       tel:"131114",       note:"24×7 crisis support" },
      { country:"Australia",   org:"Beyond Blue",                 num:"1300 22 4636",   tel:"1300224636",   note:"24×7" },
      { country:"New Zealand", org:"Need to Talk?",               num:"1737",           tel:"1737",         note:"Call or text, 24×7" },
      { country:"Japan",       org:"TELL Lifeline",               num:"03-5774-0992",   tel:"0357740992",   note:"English-language support" },
      { country:"Singapore",   org:"Samaritans of Singapore",     num:"1767",           tel:"1767",         note:"24×7" },
      { country:"Philippines", org:"NCMH Crisis Hotline",         num:"1553",           tel:"1553",         note:"24×7 toll-free" },
      { country:"Malaysia",    org:"Befrienders KL",              num:"03-7627 2929",   tel:"0376272929",   note:"24×7" }
    ]},
    { id: "eu", label: "Europe", lines: [
      { country:"UK & Ireland",org:"Samaritans",                  num:"116 123",        tel:"116123",       note:"24×7, free" },
      { country:"Many EU states", org:"Emotional support line",   num:"116 123",        tel:"116123",       note:"EU-harmonised number; availability varies by country" },
      { country:"France",      org:"3114 — Souffrance & prévention", num:"3114",       tel:"3114",         note:"24×7 national line" },
      { country:"Germany",     org:"Telefonseelsorge",            num:"0800 111 0 111", tel:"08001110111",  note:"24×7, free" },
      { country:"Netherlands", org:"113 Zelfmoordpreventie",      num:"113",            tel:"113",          note:"24×7" }
    ]},
    { id: "am", label: "Americas", lines: [
      { country:"USA & Canada",org:"Suicide & Crisis Lifeline",   num:"988",            tel:"988",          note:"Call or text, 24×7" },
      { country:"Brazil",      org:"CVV",                         num:"188",            tel:"188",          note:"24×7, free" },
      { country:"Mexico",      org:"Línea de la Vida",            num:"800 911 2000",   tel:"8009112000",   note:"24×7" },
      { country:"Argentina",   org:"Salud Mental Responde",       num:"0800-345-1435",  tel:"08003451435",  note:"Free" }
    ]},
    { id: "af", label: "Africa & Middle East", lines: [
      { country:"South Africa",org:"SADAG",                       num:"0800 567 567",   tel:"0800567567",   note:"24×7 free" },
      { country:"Kenya",       org:"Befrienders Kenya",           num:"+254 722 178 177",tel:"+254722178177",note:"Emotional support" },
      { country:"Nigeria",     org:"SURPIN",                      num:"+234 806 210 6493",tel:"+2348062106493",note:"Suicide research & prevention" },
      { country:"Israel",      org:"ERAN",                        num:"1201",           tel:"1201",         note:"24×7" }
    ]}
  ]
};
