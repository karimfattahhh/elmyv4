/* ===== nav scroll-spy (nav links scroll, they do not open search) ===== */
(function () {
  var links = [].slice.call(document.querySelectorAll('.nav-trig[href^="#"]'));
  if (!links.length) return;
  var targets = links.map(function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  function spy() {
    var y =
        (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0) +
        140,
      best = -1;
    targets.forEach(function (t, i) {
      if (t && t.offsetTop <= y) best = i;
    });
    links.forEach(function (a, i) {
      a.classList.toggle("cur", i === best);
      a.setAttribute("aria-current", i === best ? "true" : "false");
    });
  }
  ["scroll", "resize"].forEach(function (ev) {
    window.addEventListener(ev, spy, { passive: true });
    document.body.addEventListener(ev, spy, { passive: true });
  });
  spy();
  window.elmySpy = spy;
})();
