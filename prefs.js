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

  /* lite and "Less motion", decided before the first paint, exactly as
     index.html's own head script does. The static pages used to learn
     about either only when companion.js ran, after they had already
     painted and started their motion. */
  try{
    var nv = navigator, cn = nv.connection || {};
    if((nv.deviceMemory && nv.deviceMemory <= 2) || cn.saveData) root.className += " lite";
  }catch(e){}
  try{ if((JSON.parse(localStorage.getItem("ronak-feel")) || {}).still) root.className += " lite still"; }catch(e){}

  /* Moving between pages cross-fades (site.css, @view-transition) except
     where motion is unwelcome: lite and "Less motion" skip it on both the
     page being left and the page arriving. */
  function noPageFade(e){ if(e.viewTransition && /\blite\b/.test(root.className)) e.viewTransition.skipTransition(); }
  addEventListener("pageswap", noPageFade);
  addEventListener("pagereveal", noPageFade);

  var p;
  try{ p = JSON.parse(localStorage.getItem("psych-prefs")) || {}; }
  catch(e){ return; }              /* storage blocked — defaults are fine */

  if(p.theme && p.theme !== "auto") root.setAttribute("data-theme", p.theme);
  if(p.contrast) root.setAttribute("data-contrast", "high");
  if(p.scale && p.scale !== 1) root.style.setProperty("--scale", p.scale);
})();
