/* ===== the launch cut: plays itself when it comes into view, pauses when it leaves ===== */
(function () {
  var frame = document.getElementById("filmFrame"),
    replay = document.getElementById("filmReplay");
  if (!frame) return;
  function api() {
    try {
      return frame.contentWindow && frame.contentWindow.elmyFilm;
    } catch (e) {
      return null;
    }
  }
  function withApi(fn, tries) {
    tries = tries || 0;
    var a = api();
    if (a) {
      fn(a);
      return;
    }
    if (tries < 40)
      setTimeout(function () {
        withApi(fn, tries + 1);
      }, 150); /* iframe still booting */
  }
  var started = false;
  function play() {
    withApi(function (a) {
      a.play();
      started = true;
    });
  }
  function pause() {
    var a = api();
    if (a) a.pause();
  }
  if (replay)
    replay.addEventListener("click", function () {
      withApi(function (a) {
        a.restart();
      });
    });
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return; /* leave it on its first frame, user can hit replay */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (en) {
        en.forEach(function (e) {
          if (window.elmyFilmEmbed) window.elmyFilmEmbed.setInView(e.isIntersecting);
          e.isIntersecting ? play() : pause();
        });
      },
      { threshold: 0.35 },
    );
    frame.addEventListener("load", function () {
      io.observe(frame);
    });
    io.observe(frame);
  } else {
    frame.addEventListener("load", play);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) pause();
  });

  /* loop while it is on screen: the cut ends at 38s and stops, so restart it */
  var inView = false,
    loopTimer = null;
  function watch() {
    var a = api();
    if (!a) return;
    if (inView && !a.isPlaying() && a.time() >= a.total - 0.25) a.restart();
  }
  loopTimer = setInterval(watch, 700);
  window.elmyFilmEmbed = {
    play: play,
    pause: pause,
    api: api,
    started: function () {
      return started;
    },
    setInView: function (v) {
      inView = v;
    },
    looping: function () {
      return !!loopTimer;
    },
  };
})();
