(() => {
  const storageKey = "linguamentor-language";
  const languageSelect = document.getElementById("languageSelect");
  const contactLanguage = document.getElementById("contactLanguage");
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.getElementById("navLinks");

  const getNested = (obj, path) => path.split(".").reduce((value, key) => value?.[key], obj);

  function applyLanguage(lang) {
    const selected = translations[lang] ? lang : "it";
    document.documentElement.lang = selected;
    languageSelect.value = selected;
    localStorage.setItem(storageKey, selected);

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const value = getNested(translations[selected], el.dataset.i18n);
      if (value !== undefined) el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const value = getNested(translations[selected], el.dataset.i18nPlaceholder);
      if (value !== undefined) el.placeholder = value;
    });

    // Keep the user's selected language aligned with the contact form.
    if (!contactLanguage.dataset.userChanged) contactLanguage.value = selected;
  }

  const savedLanguage = localStorage.getItem(storageKey) || "it";
  applyLanguage(savedLanguage);

  languageSelect.addEventListener("change", e => applyLanguage(e.target.value));
  contactLanguage.addEventListener("change", () => contactLanguage.dataset.userChanged = "true");

  document.querySelectorAll(".card-link").forEach(link => {
    link.addEventListener("click", () => {
      if (link.dataset.language) {
        contactLanguage.value = link.dataset.language;
        contactLanguage.dataset.userChanged = "true";
      }
    });
  });

  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(`Richiesta ripetizioni - ${data.get("language")}`);
    const body = encodeURIComponent(
      `Nome: ${data.get("name")}\nEmail: ${data.get("email")}\nLingua: ${data.get("language")}\n\nMessaggio:\n${data.get("message")}`
    );
    window.location.href = `mailto:ciao@linguamentor.example?subject=${subject}&body=${body}`;
    status.textContent = "Apertura del tuo programma email…";
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
})();
