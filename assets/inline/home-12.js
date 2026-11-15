/* populate the four stage screens from the rendered marquee */
(function () {
  function go() {
    var slots = [].slice.call(document.querySelectorAll("[data-side-slot]"));
    if (!slots.length) return;
    var seen = {},
      pool = [];
    [].slice
      .call(document.querySelectorAll("#shotsRow1 .shot, #shotsRow2 .shot"))
      .forEach(function (s) {
        var k = s.getAttribute("data-shot");
        if (!k || seen[k]) return;
        seen[k] = 1;
        pool.push(s);
      });
    if (pool.length < 4) return;
    var pick = [pool[0], pool[3], pool[6], pool[9]].filter(Boolean);
    slots.forEach(function (slot, i) {
      if (!pick[i] || slot.children.length) return;
      var c = pick[i].cloneNode(true);
      c.removeAttribute("aria-hidden");
      c.removeAttribute("tabindex");
      slot.appendChild(c);
    });
    if (window.elmyScrim) window.elmyScrim();
  }
  if (document.readyState === "complete") setTimeout(go, 220);
  else
    window.addEventListener("load", function () {
      setTimeout(go, 220);
    });
  window.elmyStage = go;
})();
