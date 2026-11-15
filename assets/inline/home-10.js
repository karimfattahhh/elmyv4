/* ===== screen viewer ===== */
(function () {
  var sv = document.getElementById("sv");
  if (!sv) return;
  var img = document.getElementById("svImg"),
    t = document.getElementById("svTitle"),
    d = document.getElementById("svDesc"),
    c = document.getElementById("svCount");
  var list = [],
    idx = 0,
    last = null;
  function collect() {
    var seen = {};
    list = [];
    [].slice.call(document.querySelectorAll(".shot")).forEach(function (s) {
      var k = s.getAttribute("data-shot");
      if (!k || seen[k]) return;
      seen[k] = 1;
      list.push({ k: k, src: s.querySelector("img").getAttribute("src") });
    });
  }
  function paint() {
    var it = list[idx];
    if (!it) return;
    img.src = it.src;
    img.alt = it.k;
    t.textContent = it.k;
    var desc = (window.__SHOTDESC || {})[it.k];
    d.textContent = desc || "A screen from the Elmy product surface.";
    c.textContent = idx + 1 + " / " + list.length;
  }
  function open(key, trigger) {
    collect();
    var i = list.findIndex(function (x) {
      return x.k === key;
    });
    idx = i < 0 ? 0 : i;
    last = trigger || null;
    sv.hidden = false;
    sv.classList.add("show");
    document.body.style.overflow = "hidden";
    paint();
    setTimeout(function () {
      sv.querySelector(".sv-x").focus();
    }, 30);
  }
  function close() {
    sv.classList.remove("show");
    sv.hidden = true;
    document.body.style.overflow = "";
    if (last && last.focus) last.focus();
    last = null;
  }
  function step(n) {
    if (!list.length) return;
    idx = (idx + n + list.length) % list.length;
    paint();
  }
  document.addEventListener("click", function (e) {
    var s = e.target.closest(".shot");
    if (s) {
      e.preventDefault();
      open(s.getAttribute("data-shot"), s);
      return;
    }
    if (e.target.closest("[data-sv-close]")) {
      close();
      return;
    }
    if (e.target.closest("[data-sv-prev]")) {
      step(-1);
      return;
    }
    if (e.target.closest("[data-sv-next]")) {
      step(1);
      return;
    }
  });
  document.addEventListener("keydown", function (e) {
    if (!sv.classList.contains("show")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "Tab") {
      var f = sv.querySelectorAll("button");
      if (!f.length) return;
      var first = f[0],
        lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  window.elmyViewer = {
    open: open,
    close: close,
    count: function () {
      collect();
      return list.length;
    },
    isOpen: function () {
      return sv.classList.contains("show");
    },
    current: function () {
      return list[idx];
    },
  };
})();
