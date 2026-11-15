/* ===== reports + audiences interactivity ===== */
(function () {
  var reportFigure = document.querySelector(".report-evidence-layout .product-evidence");
  if (reportFigure)
    new ResizeObserver(function (entries) {
      reportFigure.style.setProperty(
        "--report-height",
        entries[0].borderBoxSize?.[0]?.blockSize + "px",
      );
    }).observe(reportFigure);
  var reportViews = [
    [
      "classroom-performance.png",
      "Elmy classroom syllabus showing performance and completion across course modules",
      "Compare the learning context across modules.",
      1440,
      1109,
    ],
    [
      "attempt-timeline.png",
      "Elmy assessment timeline showing response timing, question progress and answer-change events",
      "Review timing alongside the learner’s answers.",
      1440,
      925,
    ],
    [
      "question-performance.png",
      "Elmy question-level report with difficulty labels and illustrative class success rates",
      "Compare question performance by difficulty.",
      1440,
      1128,
    ],
    [
      "task-completion.png",
      "Elmy classroom tasks showing completion rates, average time and assessment progress",
      "Use completion evidence to start a conversation.",
      1440,
      1281,
    ],
  ];
  var reportRows = Array.from(document.querySelectorAll(".tf-row"));
  var desktopReports = matchMedia("(min-width:901px)");
  var reportCache = [],
    reportRequest = 0,
    activeReport = -1;
  function prepareReport(index) {
    if (!reportCache[index]) {
      var preload = new Image();
      preload.src = "assets/product/" + reportViews[index][0];
      reportCache[index] = preload.decode().catch(function () {});
    }
    return reportCache[index];
  }
  function showReport(index) {
    if (!reportFigure || activeReport === index) return;
    var request = ++reportRequest;
    prepareReport(index).then(function () {
      if (request !== reportRequest) return;
      activeReport = index;
      var view = reportViews[index],
        image = reportFigure.querySelector("img"),
        link = reportFigure.querySelector("a"),
        caption = reportFigure.querySelector("figcaption strong");
      image.src = "assets/product/" + view[0];
      image.alt = view[1];
      link.href = image.src;
      link.setAttribute("aria-label", view[1] + " — open full-size image in a new tab");
      caption.textContent = view[2];
      reportRows.forEach(function (r, i) {
        r.classList.toggle("report-selected", i === index);
      });
      image.getAnimations().forEach(function (a) {
        a.cancel();
      });
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        image.animate([{ opacity: 0.65 }, { opacity: 1 }], { duration: 180, easing: "ease-out" });
    });
  }
  function reportLayout() {
    reportRows.forEach(function (row, i) {
      row.setAttribute("aria-expanded", desktopReports.matches ? "true" : "false");
      row.nextElementSibling.hidden = !desktopReports.matches;
    });
  }
  reportLayout();
  desktopReports.addEventListener("change", reportLayout);
  showReport(0);
  var preloadObserver = new IntersectionObserver(
    function (entries) {
      if (
        entries.some(function (e) {
          return e.isIntersecting;
        })
      ) {
        reportViews.forEach(function (_, i) {
          prepareReport(i);
        });
        preloadObserver.disconnect();
      }
    },
    { rootMargin: "600px" },
  );
  preloadObserver.observe(reportFigure);
  reportRows.forEach(function (row) {
    row.addEventListener("click", function () {
      showReport(Number(row.dataset.tf));
      if (desktopReports.matches) return;
      var open = row.getAttribute("aria-expanded") === "true";
      reportRows.forEach(function (r) {
        r.setAttribute("aria-expanded", "false");
        r.nextElementSibling.hidden = true;
      });
      if (!open) {
        row.setAttribute("aria-expanded", "true");
        row.nextElementSibling.hidden = false;
      }
    });
  });
  var reportObserver = new IntersectionObserver(
    function (entries) {
      if (!desktopReports.matches) return;
      var current = entries.filter(function (e) {
        return e.isIntersecting;
      });
      if (current.length) showReport(Number(current[current.length - 1].target.dataset.tf));
    },
    { rootMargin: "-25% 0px -45% 0px", threshold: 0 },
  );
  reportRows.forEach(function (row) {
    reportObserver.observe(row);
  });
  var tabs = [].slice.call(document.querySelectorAll(".aud-tab"));
  var panels = [].slice.call(document.querySelectorAll(".aud-panel"));
  function pick(k) {
    tabs.forEach(function (t, i) {
      t.classList.toggle("on", i === k);
      t.setAttribute("aria-selected", i === k ? "true" : "false");
    });
    panels.forEach(function (p, i) {
      p.classList.toggle("on", i === k);
      p.hidden = i !== k;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      pick(i);
    });
    t.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        var n = (i + 1) % tabs.length;
        pick(n);
        tabs[n].focus();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        var p = (i - 1 + tabs.length) % tabs.length;
        pick(p);
        tabs[p].focus();
      }
    });
  });
  window.elmyReports = {
    openRow: function (i) {
      document.querySelectorAll(".tf-row")[i].click();
    },
    pickAudience: pick,
    tabs: tabs.length,
    rows: document.querySelectorAll(".tf-row").length,
  };
})();
