(function () {
  /* the marquee duplicates its rows to loop - the second copy must not be
     reachable by keyboard or announced twice */
  setTimeout(function () {
    document.querySelectorAll(".marq-row").forEach(function (row) {
      var seen = {};
      row.querySelectorAll(".shot").forEach(function (s) {
        var k = s.getAttribute("data-shot");
        if (seen[k]) {
          s.setAttribute("aria-hidden", "true");
          s.setAttribute("tabindex", "-1");
        } else seen[k] = 1;
      });
    });
  }, 80);
})();
