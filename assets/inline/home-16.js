(function () {
  var segs = [].slice.call(document.querySelectorAll(".wfmix-seg"));
  if (!segs.length) return;
  function open(i) {
    segs.forEach(function (s, j) {
      s.setAttribute("aria-expanded", j === i ? "true" : "false");
    });
  }
  segs.forEach(function (s, i) {
    s.addEventListener("click", function () {
      open(s.getAttribute("aria-expanded") === "true" ? -1 : i);
    });
  });
  window.elmyFormula = {
    open: open,
    count: segs.length,
    openIndex: function () {
      return segs.findIndex(function (s) {
        return s.getAttribute("aria-expanded") === "true";
      });
    },
  };
})();
