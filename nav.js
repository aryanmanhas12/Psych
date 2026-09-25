/* ══════════════════════════════════════════════════════════════
   Shared navigation — collapses to a menu button on small screens
   ──────────────────────────────────────────────────────────────
   Nine links wrapping across four rows cost roughly 500px at 390px
   wide: more than half a phone screen spent before the reader has
   seen a single word of the page. On a phone the nav collapses to
   one row; above 720px nothing changes.

   Progressive enhancement on purpose. The markup ships as a plain
   row of links and stays usable if this file never loads — the
   collapsing styles key off a wrapper that only exists once this
   script has run.
   ══════════════════════════════════════════════════════════════ */
/* ── the sky ──
   One fixed, aria-hidden layer at the very back of every page: the
   breathing glows and the dawn that warms as you scroll (all of it is in
   site.css under .sky). It lives here rather than in six copies of the
   markup because this is the one script every page already loads.

   The dawn follows a CSS scroll timeline where the browser has one. Where
   it doesn't, a passive, rAF-gated listener writes one number, and writes
   it on the sky itself — not on <html>, where a custom property changing
   every frame would restyle the whole document to move one gradient. */
(function(){
  if(document.querySelector(".sky")) return;
  var sky = document.createElement("div");
  sky.className = "sky";
  sky.setAttribute("aria-hidden", "true");
  document.body.insertBefore(sky, document.body.firstChild);
  var native = window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()");
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(native || still) return;
  var ticking = false;
  function paint(){
    ticking = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    sky.style.setProperty("--dawn", (0.05 + p * 0.95).toFixed(3));
  }
  addEventListener("scroll", function(){
    if(!ticking){ ticking = true; requestAnimationFrame(paint); }
  }, { passive:true });
  addEventListener("resize", paint, { passive:true });
  paint();
})();

(function(){
  var nav = document.querySelector("nav.site");
  if(!nav) return;
  /* the poster page uses the wide container; both are valid nav shells */
  var wrap = nav.querySelector(".wrap, .wrap-wide");
  var links = wrap ? wrap.querySelectorAll("a.navlink") : [];
  if(!wrap || !links.length) return;

  var box = document.createElement("div");
  box.className = "navlinks";
  box.id = "siteNavLinks";
  links[0].parentNode.insertBefore(box, links[0]);
  Array.prototype.forEach.call(links, function(a){ box.appendChild(a); });

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "navtoggle";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "siteNavLinks");
  btn.innerHTML = '<span class="bars" aria-hidden="true"></span><span class="navtoggle-label">Menu</span>';
  wrap.insertBefore(btn, box);

  function setOpen(open){
    box.classList.toggle("open", open);
    /* Also on the nav itself, so the stylesheet can reach the row that
       holds these links. Below 380px that row is flex-wrap:nowrap — a
       deliberate choice, so the brand, Menu and Settings share one line
       on the narrowest phones — but nowrap also forbids the open menu
       from taking a line of its own. It stayed in the row instead,
       squeezed against the right edge with its labels cut off and the
       page scrolling sideways. Reported from a phone, with a recording.
       The class lets that rule be lifted for exactly as long as the menu
       is open, and not a moment longer. */
    nav.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", String(open));
  }
  btn.addEventListener("click", function(){
    setOpen(btn.getAttribute("aria-expanded") !== "true");
  });
  /* Escape returns focus to the control that opened the menu, so a
     keyboard user is never dropped somewhere they cannot see. */
  nav.addEventListener("keydown", function(e){
    if(e.key === "Escape" && btn.getAttribute("aria-expanded") === "true"){
      setOpen(false); btn.focus();
    }
  });
  document.addEventListener("click", function(e){
    if(!nav.contains(e.target)) setOpen(false);
  });
  /* Following a link should not leave the menu hanging open behind
     the next view — on this site several links are in-page. */
  box.addEventListener("click", function(e){
    if(e.target.closest("a")) setOpen(false);
  });
})();
