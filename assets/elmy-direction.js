(() => {
  "use strict";
  // Same-site contextual links remain local in this isolated preview.
  document.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (
      /(^|\/)learn([#?]|$)/.test(href) &&
      a.textContent.trim() === "Explore resources and insights"
    )
      a.setAttribute("href", href.replace(/learn(?=[#?]|$)/, "resources"));
  });
})();
