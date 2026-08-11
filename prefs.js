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
  var root = document.documentElement;

  /* ── "scripts are running", decided before the first paint ──
     nav.js ships the navigation as nine plain links and collapses them
     into a menu once it has run, which keeps the nav usable if that file
     never arrives. The cost was paid by everyone else: on a phone the
     nine links render as a 229px block, then jump to 64px when nav.js
     executes, and the entire page below lurches 165px upwards. Measured
     at 0.169 cumulative layout shift — all of the page's CLS, and above
     the 0.1 that counts as good.

     This class lets the stylesheet collapse the nav from the very first
     paint, so the height never changes. It is set here, in the one file
     that already loads synchronously in <head> for exactly this reason,
     because a deferred script would set it after the paint it is meant
     to fix. No script, no class, and the links stay visible — which is
     the guarantee nav.js was written to make in the first place. */
  root.className += (root.className ? " " : "") + "js";

  var p;
  try{ p = JSON.parse(localStorage.getItem("psych-prefs")) || {}; }
  catch(e){ return; }              /* storage blocked — defaults are fine */

  if(p.theme && p.theme !== "auto") root.setAttribute("data-theme", p.theme);
  if(p.contrast) root.setAttribute("data-contrast", "high");
  if(p.scale && p.scale !== 1) root.style.setProperty("--scale", p.scale);
})();
