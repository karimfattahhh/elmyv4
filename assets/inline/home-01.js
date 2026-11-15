(function () {
  var nav = document.getElementById("nav"),
    hero = document.querySelector(".hero");
  function onScroll() {
    var dashboard = document.querySelector(".hero-dashboard-stage");
    var h = dashboard
      ? dashboard.getBoundingClientRect().top + window.scrollY - 100
      : hero
        ? hero.offsetHeight - 80
        : 560;
    nav.classList.toggle("scrolled", window.scrollY > h);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  window.addEventListener("resize", onScroll);

  // stagger grid reveals
  var groups = document.querySelectorAll(".prob-grid.pillars.bento.layers-row.reassure.xp-cards");
  for (var g = 0; g < groups.length; g++) {
    var kids = groups[g].children;
    for (var i = 0; i < kids.length; i++) {
      if (kids[i].classList.contains("reveal")) kids[i].style.transitionDelay = i * 70 + "ms";
    }
  }
  // reveal on scroll
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      obs.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
    });
  }
})();
