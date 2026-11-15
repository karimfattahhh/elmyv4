/* ===== product viewer ===== */
(function () {
  var tabsEl = document.getElementById("pvTabs"),
    railEl = document.getElementById("pvRail"),
    img = document.getElementById("pvImg"),
    shot = document.querySelector(".pv-shot"),
    titleEl = document.getElementById("pvTitle"),
    descEl = document.getElementById("pvDesc"),
    countEl = document.getElementById("pvCount"),
    urlEl = document.getElementById("pvUrl");
  if (!tabsEl || !img) return;
  var GROUPS = [
    ["Overview", ["Student dashboard", "Course & goals", "Notifications"]],
    ["Assess", ["Exam designer", "Question bank", "Smart-generate exam", "Exam publishing"]],
    ["Sit", ["Exam portal", "Exam interface", "Exam attempts", "Join session"]],
    ["Analyse", ["Common errors", "Syllabus reading"]],
    [
      "Manage",
      ["Create classroom", "Classroom filters", "Student roster", "Attendance", "Create menu"],
    ],
  ];
  var SLUG = {
    "Student dashboard": "dashboard",
    "Exam designer": "exams/new",
    "Question bank": "bank",
    "Exam portal": "exam/sit",
    Attendance: "attendance",
    "Classroom filters": "classrooms",
    "Student roster": "classrooms/roster",
    "Common errors": "insights/errors",
    Notifications: "inbox",
    "Syllabus reading": "syllabus",
    "Create classroom": "classrooms/new",
    "Course & goals": "goals",
    "Smart-generate exam": "exams/generate",
    "Exam publishing": "exams/publish",
    "Exam interface": "exam",
    "Exam attempts": "attempts",
    "Join session": "session",
    "Create menu": "new",
  };
  var items = [],
    idx = 0,
    group = 0;
  function collect() {
    var seen = {};
    items = [];
    [].slice
      .call(document.querySelectorAll("#shotsRow1 .shot, #shotsRow2 .shot"))
      .forEach(function (s) {
        var k = s.getAttribute("data-shot");
        if (!k || seen[k]) return;
        seen[k] = 1;
        items.push({ k: k, src: s.querySelector("img").getAttribute("src") });
      });
  }
  function inGroup(g) {
    var names = GROUPS[g][1];
    return items.filter(function (it) {
      return names.indexOf(it.k) >= 0;
    });
  }
  function paint() {
    var list = inGroup(group),
      it = list[idx];
    if (!it) return;
    shot.classList.add("swap");
    setTimeout(function () {
      img.src = it.src;
      img.alt = it.k;
      shot.classList.remove("swap");
    }, 140);
    titleEl.textContent = it.k;
    descEl.textContent =
      (window.__SHOTDESC || {})[it.k] || "A screen from the Elmy product surface.";
    countEl.textContent = idx + 1 + " / " + list.length;
    urlEl.textContent = "app.elmy.com/" + (SLUG[it.k] || "app");
    [].slice.call(railEl.children).forEach(function (t, i) {
      t.classList.toggle("on", i === idx);
      t.setAttribute("aria-selected", i === idx ? "true" : "false");
    });
  }
  function buildRail() {
    var list = inGroup(group);
    railEl.innerHTML = "";
    list.forEach(function (it, i) {
      var b = document.createElement("button");
      b.className = "pv-thumb";
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", it.k);
      var im = document.createElement("img");
      im.src = it.src;
      im.alt = "";
      im.loading = "lazy";
      b.appendChild(im);
      b.addEventListener("click", function () {
        idx = i;
        paint();
      });
      railEl.appendChild(b);
    });
  }
  function pickGroup(g) {
    group = g;
    idx = 0;
    [].slice.call(tabsEl.children).forEach(function (t, i) {
      t.classList.toggle("on", i === g);
      t.setAttribute("aria-selected", i === g ? "true" : "false");
    });
    buildRail();
    paint();
  }
  function build() {
    collect();
    if (!items.length) return;
    tabsEl.innerHTML = "";
    GROUPS.forEach(function (g, i) {
      var b = document.createElement("button");
      b.className = "pv-tab" + (i === 0 ? " on" : "");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.textContent = g[0];
      b.addEventListener("click", function () {
        pickGroup(i);
      });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          var n = (i + 1) % GROUPS.length;
          pickGroup(n);
          tabsEl.children[n].focus();
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          var p = (i - 1 + GROUPS.length) % GROUPS.length;
          pickGroup(p);
          tabsEl.children[p].focus();
        }
      });
      tabsEl.appendChild(b);
    });
    pickGroup(0);
  }
  document.getElementById("pvPrev").addEventListener("click", function () {
    var l = inGroup(group);
    idx = (idx - 1 + l.length) % l.length;
    paint();
  });
  document.getElementById("pvNext").addEventListener("click", function () {
    var l = inGroup(group);
    idx = (idx + 1) % l.length;
    paint();
  });
  if (document.readyState === "complete") setTimeout(build, 240);
  else
    window.addEventListener("load", function () {
      setTimeout(build, 240);
    });
  window.elmyPV = {
    build: build,
    pick: pickGroup,
    count: function () {
      collect();
      return items.length;
    },
    current: function () {
      return inGroup(group)[idx];
    },
    groups: GROUPS.length,
  };
})();
