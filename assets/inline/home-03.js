/* ===== FX ENGINE, attention cursor, spotlight, spatial, magnetics ===== */
(function () {
  var rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var body = document.body;

  /* auto-tag spotlight surfaces */
  [".cap", ".prob", ".pillar", ".aud", ".xp-card", ".cmp-old"].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.classList.add("spot");
    });
  });
  [".re", ".cmp-new", ".bdata"].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.classList.add("spot", "spot-d");
    });
  });

  /* scroll systems: progress + hero parallax + featured 3D entrance */
  var sprog = document.getElementById("sprog");
  var heroFlow = document.getElementById("heroFlow");
  var heroCopy = document.getElementById("heroCopy");
  var feat = document.getElementById("shotsFeatured");
  var heroTilting = false;
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    if (sprog) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      sprog.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    }
    if (rm) return;
    if (y < 900) {
      if (heroFlow && !heroTilting) heroFlow.style.transform = "translateY(" + y * 0.05 + "px)";
      if (heroCopy) heroCopy.style.transform = "translateY(" + y * 0.045 + "px)";
    }
    if (feat) {
      var r = feat.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        var p = 1 - (r.top - window.innerHeight * 0.12) / (window.innerHeight * 0.62);
        p = Math.min(1, Math.max(0, p));
        var e = 1 - Math.pow(1 - p, 3);
        feat.style.transform =
          "perspective(1300px) rotateX(" + (1 - e) * 11 + "deg) scale(" + (0.94 + e * 0.06) + ")";
        feat.style.opacity = 0.35 + e * 0.65;
      }
    }
  }
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", onScroll);
  onScroll();

  if (!fine || rm) return; /* pointer effects: desktop + motion-ok only */
  body.classList.add("fx");

  /* spotlight coordinates per card */
  document.querySelectorAll(".spot").forEach(function (el) {
    el.addEventListener(
      "mousemove",
      function (e) {
        var b = el.getBoundingClientRect();
        el.style.setProperty("--mx", e.clientX - b.left + "px");
        el.style.setProperty("--my", e.clientY - b.top + "px");
      },
      { passive: true },
    );
  });

  /* spatial tilt (hero flow) */
  document.querySelectorAll("[data-tilt]").forEach(function (el) {
    var base = "";
    el.addEventListener("mouseenter", function () {
      heroTilting = el === heroFlow;
      base =
        el === heroFlow
          ? el.style.transform.replace(/perspective[^)]*\)|rotate[XY][^)]*\)/g, "")
          : "";
      el.classList.add("tilting");
    });
    el.addEventListener(
      "mousemove",
      function (e) {
        var b = el.getBoundingClientRect();
        var px = (e.clientX - b.left) / b.width - 0.5;
        var py = (e.clientY - b.top) / b.height - 0.5;
        el.style.transform =
          "perspective(900px) rotateX(" + -py * 9 + "deg) rotateY(" + px * 9 + "deg)";
      },
      { passive: true },
    );
    el.addEventListener("mouseleave", function () {
      el.classList.remove("tilting");
      el.style.transform = base;
      heroTilting = false;
    });
  });
})();
