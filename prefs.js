/* ══════════════════════════════════════════════════════════════
   Shared display preferences
   ──────────────────────────────────────────────────────────────
   Theme, text size and high contrast are chosen in the screener's
   settings panel, which lives only on index.html. Everything else —
   the evidence register, the ethics page, the manifesto — had no code
   reading those choices, so turning on high contrast and then opening
   any of them silently dropped back to defaults. For a setting someone
   turns on because they otherwise cannot read the page, that is not a
   cosmetic inconsistency.

   Loaded WITHOUT defer, deliberately. These attributes decide what the
   first paint looks like; applying them after parsing means a flash of
   the wrong theme, which is worst for exactly the people who changed
   the setting. It is a few lines and one localStorage read.
   ══════════════════════════════════════════════════════════════ */
(function(){
  var p;
  try{ p = JSON.parse(localStorage.getItem("psych-prefs")) || {}; }
  catch(e){ return; }              /* storage blocked — defaults are fine */
  var root = document.documentElement;

  if(p.theme && p.theme !== "auto") root.setAttribute("data-theme", p.theme);
  if(p.contrast) root.setAttribute("data-contrast", "high");
  if(p.scale && p.scale !== 1) root.style.setProperty("--scale", p.scale);
})();
