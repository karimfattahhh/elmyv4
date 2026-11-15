/* destination-less links: flagged, and guarded so they don't jump the page (Step 6) */
(function () {
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[data-todo="no-destination"]');
    if (a) {
      e.preventDefault();
    }
  });
  window.elmyTodo = function () {
    return [...document.querySelectorAll('[data-todo="no-destination"]')].map(function (a) {
      return (a.textContent || "").trim();
    });
  };
})();
