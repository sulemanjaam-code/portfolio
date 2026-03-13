const navToggle = document.querySelector(".nav__toggle");
const navLinks = document.querySelector(".nav__links");
const yearSpan = document.getElementById("year");
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("nav__toggle--open");
    navLinks.classList.toggle("nav__links--open");
  });

  navLinks.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) {
      navToggle.classList.remove("nav__toggle--open");
      navLinks.classList.remove("nav__links--open");
    }
  });
}

if (form && statusEl) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    if (!name || !email || !message) {
      statusEl.textContent = "Please fill in all required fields.";
      statusEl.classList.remove("form__status--success");
      statusEl.classList.add("form__status--error");
      return;
    }

    statusEl.textContent = "Thanks! This demo form doesn't send an email, but your details were validated successfully.";
    statusEl.classList.remove("form__status--error");
    statusEl.classList.add("form__status--success");

    form.reset();
  });
}

