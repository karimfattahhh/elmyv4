/* timeline: spine fills, dots light in order. End state is inline. */
(function () {
  var tl = document.querySelector(".tl");
  if (!tl) return;
  var steps = [].slice.call(tl.querySelectorAll(".tl-step")),
    done = false;
  function light() {
    if (done) return;
    done = true;
    tl.classList.add("run");
    steps.forEach(function (s, i) {
      setTimeout(
        function () {
          s.classList.add("on");
        },
        220 + i * 230,
      );
    });
  }
  window.elmyTimeline = {
    run: light,
    isRun: function () {
      return tl.classList.contains("run");
    },
    allOn: function () {
      return steps.every(function (s) {
        return s.classList.contains("on");
      });
    },
  };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    light();
    return;
  }
  var io = new IntersectionObserver(
    function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) {
          light();
          io.disconnect();
        }
      });
    },
    { threshold: 0.15 },
  );
  io.observe(tl);
  setTimeout(function () {
    if (!done) {
      light();
      try {
        io.disconnect();
      } catch (e) {}
    }
  }, 2500);
})();
