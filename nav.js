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
