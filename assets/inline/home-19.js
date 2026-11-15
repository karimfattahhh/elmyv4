document.getElementById("watch-demo").addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();
  var target = document.getElementById("platform");
  if (window.elmyScroll) {
    window.elmyScroll.scrollTo(target, { offset: -100, duration: 1.1 });
  } else {
    target.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }
  history.replaceState(null, "", "#platform");
});
