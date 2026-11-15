/* ===== contrast engine (Step 2) - computes each label's scrim instead of guessing ===== */
(function () {
  var TARGET = 4.5,
    INK = [11, 15, 42];
  function lin(v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }
  function L(r, g, b) {
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  }
  function ratioWhiteOver(r, g, b, a) {
    /* ink scrim at alpha a composited over the sampled pixel, white text on top */
    var cr = INK[0] * a + r * (1 - a),
      cg = INK[1] * a + g * (1 - a),
      cb = INK[2] * a + b * (1 - a);
    var Lb = L(cr, cg, cb);
    return (1.0 + 0.05) / (Lb + 0.05);
  }
  var cv = document.createElement("canvas"),
    cx = cv.getContext("2d", { willReadFrequently: true });

  /* per-element function: a var inside a for-loop would close over the LAST element
     and mis-scrim every label but one */
  function measure(shot) {
    var img = shot.querySelector("img"),
      lab = shot.querySelector(".lab");
    if (!img || !lab || !img.naturalWidth) return null;
    var ib = img.getBoundingClientRect(),
      lb = lab.getBoundingClientRect();
    if (!ib.width || !ib.height) return null;
    /* map the label box through object-fit:cover + object-position into natural coords */
    var nw = img.naturalWidth,
      nh = img.naturalHeight;
    var scale = Math.max(ib.width / nw, ib.height / nh);
    var dw = nw * scale,
      dh = nh * scale;
    var op = getComputedStyle(img).objectPosition.split(" ");
    var px = parseFloat(op[0]) / 100;
    if (isNaN(px)) px = 0.5;
    var py = parseFloat(op[1]) / 100;
    if (isNaN(py)) py = 0.5;
    var offX = (ib.width - dw) * px,
      offY = (ib.height - dh) * py;
    var sx = (lb.left - ib.left - offX) / scale,
      sy = (lb.top - ib.top - offY) / scale;
    var sw = lb.width / scale,
      sh = lb.height / scale;
    sx = Math.max(0, Math.min(nw - 1, sx));
    sy = Math.max(0, Math.min(nh - 1, sy));
    sw = Math.max(1, Math.min(nw - sx, sw));
    sh = Math.max(1, Math.min(nh - sy, sh));
    var W = 12,
      H = 6;
    cv.width = W;
    cv.height = H;
    try {
      cx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
      var d = cx.getImageData(0, 0, W, H).data;
    } catch (e) {
      return null;
    } /* tainted canvas -> keep the CSS fallback */
    var worst = -1,
      wr = 0,
      wg = 0,
      wb = 0;
    for (var i = 0; i < d.length; i += 4) {
      var l = L(d[i], d[i + 1], d[i + 2]);
      if (l > worst) {
        worst = l;
        wr = d[i];
        wg = d[i + 1];
        wb = d[i + 2];
      } /* brightest cell = worst case */
    }
    /* binary-search the minimum alpha that clears TARGET */
    var lo = 0,
      hi = 1;
    if (ratioWhiteOver(wr, wg, wb, 0) >= TARGET) {
      lo = 0;
      hi = 0;
    } else {
      for (var k = 0; k < 24; k++) {
        var mid = (lo + hi) / 2;
        if (ratioWhiteOver(wr, wg, wb, mid) >= TARGET) hi = mid;
        else lo = mid;
      }
    }
    var a = Math.min(1, Math.ceil(hi * 100) / 100); /* ceil, never round below the AA target */
    lab.style.setProperty("--scrim", a);
    lab.setAttribute("data-scrim-alpha", a);
    return { alpha: a, effective: +ratioWhiteOver(wr, wg, wb, a).toFixed(2) };
  }
  function runAll() {
    var out = [];
    var shots = document.querySelectorAll(".shot");
    for (var i = 0; i < shots.length; i++) {
      (function (shot) {
        /* per-element scope */
        var img = shot.querySelector("img");
        if (img && !img.complete) {
          img.addEventListener(
            "load",
            function () {
              measure(shot);
            },
            { once: true },
          );
          return;
        }
        var r = measure(shot);
        if (r) out.push(r);
      })(shots[i]);
    }
    window.__scrim = {
      count: out.length,
      min: out.length
        ? Math.min.apply(
            null,
            out.map(function (x) {
              return x.alpha;
            }),
          )
        : null,
      max: out.length
        ? Math.max.apply(
            null,
            out.map(function (x) {
              return x.alpha;
            }),
          )
        : null,
      minEffective: out.length
        ? Math.min.apply(
            null,
            out.map(function (x) {
              return x.effective;
            }),
          )
        : null,
    };
    return window.__scrim;
  }
  window.elmyScrim = runAll;
  if (document.readyState === "complete") runAll();
  else window.addEventListener("load", runAll);
  var t;
  window.addEventListener("resize", function () {
    clearTimeout(t);
    t = setTimeout(runAll, 200);
  });
  new MutationObserver(function () {
    clearTimeout(t);
    t = setTimeout(runAll, 200);
  }).observe(document.body, { childList: true, subtree: true });
})();
