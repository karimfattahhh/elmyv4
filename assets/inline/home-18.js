(function () {
  var story = document.querySelector(".learning-story");
  if (!story) return;
  var tabs = Array.from(story.querySelectorAll('[role="tab"]'));
  var panels = Array.from(story.querySelectorAll('[role="tabpanel"]'));
  function select(index, focus) {
    tabs.forEach(function (tab, i) {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      select(i, false);
    });
    tab.addEventListener("keydown", function (e) {
      var next = i;
      if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") next = (i + tabs.length - 1) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      else return;
      e.preventDefault();
      select(next, true);
    });
  });
})();
