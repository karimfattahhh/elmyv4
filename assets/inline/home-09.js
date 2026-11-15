/* ===== pipeline animates on entry only ===== */
(function () {
  var p = document.querySelector(".pipeline");
  if (!p) return;
  var steps = [].slice.call(p.querySelectorAll(".pstep"));
  var done = false;
  function show() {
    if (done) return;
    done = true;
    p.classList.add("run");
    steps.forEach(function (s, i) {
      setTimeout(function () {
        /* inline end-state - cannot be stranded by a throttled animation clock */
        s.style.opacity = "1";
        s.style.transform = "none";
        var st = document.createElement("style");
        s.classList.add("shown");
      }, i * 160);
    });
    /* connectors draw after their step lands */
    setTimeout(function () {
      p.classList.add("drawn");
    }, 140);
    /* un-arm once the motion has had its window: nothing may hold a connector collapsed */
    setTimeout(
      function () {
        p.classList.remove("armed");
      },
      160 * steps.length + 700,
    );
  }
  window.elmyPipeline = {
    run: show,
    isRunning: function () {
      return p.classList.contains("run");
    },
    allVisible: function () {
      return steps.every(function (s) {
        return parseFloat(getComputedStyle(s).opacity) > 0.9;
      });
    },
  };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    return;
  } /* leave visible, no motion */
  p.classList.add("armed");
  var io = new IntersectionObserver(
    function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) {
          show();
          io.disconnect();
        }
      });
    },
    { threshold: 0.2 },
  );
  io.observe(p);
  setTimeout(function () {
    if (!done) {
      show();
      try {
        io.disconnect();
      } catch (e) {}
    }
  }, 2200); /* failsafe */
})();
