(() => {
  "use strict";
  const types = {
    resources: {
      title: "Request a resource brief",
      description: "Tell us which exam you teach and the resources or reporting you need.",
      message:
        "Which exam do you teach, how many students do you have, when do classes start, and what support would help?",
      placeholder:
        "For example: SAT, 80 students, classes start in January and we would like a report for each class.",
    },
    assessment: {
      title: "Discuss institutional assessment",
      description: "Coming soon. Tell us about your school’s assessment priorities.",
      message: "Which grades, subjects and skills would you like to assess?",
      placeholder:
        "For example: identify the Math skills our Grade 7 and 8 students need to strengthen.",
    },
    discovery: {
      title: "Discuss an institutional project",
      description:
        "Share your programme requirements so we can discuss the scope and delivery approach.",
      message: "What do you need to deliver, for whom, and by when?",
      placeholder: "For example: recruitment testing for 500 candidates in March.",
    },
    careers: {
      title: "Ask about careers",
      description: "Tell us about your field and the experience you would bring to Elmy.",
      message: "Which area of work interests you, and what is your relevant experience?",
      placeholder:
        "For example: SAT Math content development, with experience teaching and writing assessment questions.",
    },
    general: {
      title: "Something else",
      description: "Ask a question about Elmy or our services.",
      message: "Your question",
      placeholder: "Tell us a little about what you need.",
    },
  };
  const form = document.getElementById("contact-form");
  if (!form) return;
  const selector = document.getElementById("enquiry-type"),
    remainder = document.getElementById("contact-remainder"),
    output = document.getElementById("enquiry-draft"),
    drafts = {};
  let active = "";
  const aliases = {
    demo: "resources",
    pricing: "resources",
    expert: "general",
    pilot: "discovery",
    foundation: "general",
    benchmarking: "assessment",
  };
  function update() {
    if (active) drafts[active] = form.elements.message.value;
    active = selector.value;
    const config = types[active];
    remainder.hidden = !config;
    output.hidden = true;
    if (!config) return;
    document.getElementById("context-title").textContent = config.title;
    document.getElementById("context-description").textContent = config.description;
    document.getElementById("message-label").textContent = config.message;
    form.elements.message.placeholder = config.placeholder;
    form.elements.message.value = drafts[active] || "";
    const institutional = !["careers", "general"].includes(active);
    for (const name of ["institution", "institution_type"]) {
      const input = form.elements[name];
      input.required = institutional;
      input.closest("label").hidden = !institutional;
    }
    document.getElementById("contact-update").textContent =
      "Questions updated for: " + config.title;
    remainder.dispatchEvent(
      new CustomEvent("elmy:state-change", { bubbles: true, detail: { kind: "contact" } }),
    );
  }
  selector.addEventListener("change", () => {
    update();
    history.replaceState(null, "", location.pathname + (active ? "#" + active : ""));
  });
  function fromLink() {
    const key = location.hash.slice(1);
    selector.value = types[key] ? key : aliases[key] || "";
    update();
  }
  window.addEventListener("hashchange", fromLink);
  fromLink();
  const to = form.dataset.email || "";
  if (to)
    document.getElementById("contact-delivery").textContent =
      "Prepare your message, then send it through your email app. Nothing is sent automatically.";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity() || !active) return;
    const f = form.elements,
      lines = [
        "Request: " + types[active].title,
        "",
        f.message.value,
        "",
        "Name: " + f.name.value,
        "Email: " + f.email.value,
      ];
    if (!["careers", "general"].includes(active))
      lines.push("Organisation: " + f.institution.value, "Type: " + f.institution_type.value);
    if (f.role.value) lines.push("Role: " + f.role.value);
    const message = lines.join("\n");
    document.getElementById("draft-text").value = message;
    output.hidden = false;
    document.getElementById("draft-status").textContent =
      "Not sent. This draft stays in your browser until you leave this page.";
    document.getElementById("contact-update").textContent =
      "Your enquiry is ready. It has not been sent.";
    if (to) {
      document.getElementById("draft-status").textContent =
        "Your email app will open. Review the message there before sending.";
      location.href =
        "mailto:" +
        to +
        "?subject=" +
        encodeURIComponent("Elmy website: " + types[active].title) +
        "&body=" +
        encodeURIComponent(message);
    } else document.getElementById("draft-heading").focus({ preventScroll: true });
    output.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "instant" : "smooth",
      block: "center",
    });
  });
  // A prepared enquiry must always match the current answers.
  function invalidateDraft(event) {
    if (output.hidden || output.contains(event.target)) return;
    output.hidden = true;
    document.getElementById("draft-text").value = "";
    document.getElementById("contact-update").textContent =
      "Your answers changed. Prepare the enquiry again to include your latest details.";
  }
  form.addEventListener("input", invalidateDraft);
  form.addEventListener("change", invalidateDraft);
  document.getElementById("draft-heading").tabIndex = -1;
  document.getElementById("copy-enquiry").addEventListener("click", async () => {
    const field = document.getElementById("draft-text");
    try {
      await navigator.clipboard.writeText(field.value);
      document.getElementById("contact-update").textContent =
        "Enquiry copied. It has not been sent.";
      document.getElementById("draft-status").textContent =
        "Copied. This enquiry has not been sent.";
    } catch {
      field.focus();
      field.select();
      document.getElementById("draft-status").textContent =
        "Select and copy the enquiry text. It has not been sent.";
    }
  });
})();
