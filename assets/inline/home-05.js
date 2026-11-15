/* ===== side-rail controller (Step 4) ===== */
(function () {
  var rail = document.getElementById("rail");
  if (!rail) return;
  var scroller = document.scrollingElement || document.documentElement;
  function scrollTop() {
    return window.scrollY || scroller.scrollTop || document.body.scrollTop || 0;
  }
  function update() {
    var hero = document.querySelector(".hero");
    var trigger = hero ? hero.offsetHeight * 0.6 : 400;
    rail.classList.toggle("on", scrollTop() > trigger);
  }
  ["scroll", "resize"].forEach(function (ev) {
    window.addEventListener(ev, update, { passive: true });
    document.body.addEventListener(ev, update, { passive: true });
  });
  update();
  rail.addEventListener("click", function (e) {
    var b = e.target.closest("[data-rail]");
    if (!b) return;
    var a = b.getAttribute("data-rail");
    if (a === "demo") {
      var d = document.getElementById("demo");
      if (d) d.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    /* call the overlay API directly - a synthetic click on the search trigger would
       bubble on to the document handler and immediately close what it just opened */
    else if (a === "explore") {
      if (window.elmyDsc) window.elmyDsc.open(null, b);
    } else if (a === "top") {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        window.scrollTo(0, 0);
      }
      scroller.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  });
  window.elmyRail = {
    el: rail,
    update: update,
    isShown: function () {
      return rail.classList.contains("on");
    },
  };
})();
