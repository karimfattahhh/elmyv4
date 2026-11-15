(function () {
  var hz = document.querySelector(".hz");
  if (!hz) return;
  var steps = [].slice.call(hz.querySelectorAll(".hz-step")),
    done = false;
  function run() {
    if (done) return;
    done = true;
    hz.classList.add("run");
    steps.forEach(function (s, i) {
      setTimeout(
        function () {
          s.classList.add("on");
        },
        200 + i * 240,
      );
    });
  }
  window.elmyTrack = {
    run: run,
    isRun: function () {
      return hz.classList.contains("run");
    },
    allOn: function () {
      return steps.every(function (s) {
        return s.classList.contains("on");
      });
    },
  };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    run();
    return;
  }
  var io = new IntersectionObserver(
    function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      });
    },
    { threshold: 0.2 },
  );
  io.observe(hz);
  setTimeout(function () {
    if (!done) {
      run();
      try {
        io.disconnect();
      } catch (e) {}
    }
  }, 2500);
})();
