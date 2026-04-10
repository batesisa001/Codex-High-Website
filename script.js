// Main UI hooks.
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"], .footer-nav a[href^="#"]');
const sectionLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const yearElement = document.getElementById("year");

// Keep the header compact once the user starts scrolling.
function updateHeaderState() {
  if (window.scrollY > 24) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
}

function closeMobileNav() {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function openMobileNav() {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
}

function scrollToTarget(targetId) {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  const headerOffset = header ? header.offsetHeight + 18 : 0;
  const targetTop = targetId === "home"
    ? 0
    : target.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: "smooth"
  });
}

// Provide a simple active state for the in-page navigation.
function setActiveLink(sectionId) {
  sectionLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("active", isActive);
  });
}

function updateActiveSection() {
  if (!sections.length) {
    return;
  }

  const headerOffset = header ? header.offsetHeight + 28 : 28;
  const scrollPosition = window.scrollY + headerOffset;
  let activeSectionId = sections[0].id;

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      activeSectionId = section.id;
    }
  });

  setActiveLink(activeSectionId);
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function showFieldError(field, message) {
  const errorElement = field.parentElement.querySelector(".form-error");
  field.classList.add("is-invalid");
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearFieldError(field) {
  const errorElement = field.parentElement.querySelector(".form-error");
  field.classList.remove("is-invalid");
  if (errorElement) {
    errorElement.textContent = "";
  }
}

function clearFormStatus() {
  formStatus.textContent = "";
  formStatus.classList.remove("is-success", "is-error");
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.contains("is-open");
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (href && href.startsWith("#")) {
      event.preventDefault();
      scrollToTarget(href.slice(1));
    }

    closeMobileNav();
  });
});

document.addEventListener("click", (event) => {
  if (!siteNav || !navToggle) {
    return;
  }

  const clickedInsideNav = siteNav.contains(event.target);
  const clickedToggle = navToggle.contains(event.target);

  if (!clickedInsideNav && !clickedToggle) {
    closeMobileNav();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileNav();
  }
});

updateHeaderState();
updateActiveSection();
window.addEventListener("scroll", () => {
  updateHeaderState();
  updateActiveSection();
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => {
    if (!item.classList.contains("is-visible")) {
      revealObserver.observe(item);
    }
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (contactForm) {
  // Lightweight front-end validation for a no-backend static form.
  const fields = ["name", "email", "company", "message"].map((id) =>
    document.getElementById(id)
  );

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      clearFieldError(field);
      clearFormStatus();
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormStatus();

    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const companyField = document.getElementById("company");
    const messageField = document.getElementById("message");
    const values = {
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      company: companyField.value.trim(),
      message: messageField.value.trim()
    };

    let hasErrors = false;

    fields.forEach((field) => clearFieldError(field));

    if (!values.name) {
      showFieldError(nameField, "Please enter your name.");
      hasErrors = true;
    }

    if (!values.email) {
      showFieldError(emailField, "Please enter your email address.");
      hasErrors = true;
    } else if (!validateEmail(values.email)) {
      showFieldError(emailField, "Please enter a valid email address.");
      hasErrors = true;
    }

    if (!values.company) {
      showFieldError(companyField, "Please enter your company name.");
      hasErrors = true;
    }

    if (!values.message) {
      showFieldError(messageField, "Please enter a short message.");
      hasErrors = true;
    } else if (values.message.length < 20) {
      showFieldError(messageField, "Please provide a bit more detail so the inquiry is useful.");
      hasErrors = true;
    }

    if (hasErrors) {
      formStatus.textContent = "Please review the highlighted fields and try again.";
      formStatus.classList.add("is-error");
      return;
    }

    contactForm.reset();
    formStatus.textContent =
      "Thank you. Your message has been prepared successfully. Add your real email routing or backend handler when ready to receive submissions.";
    formStatus.classList.add("is-success");
  });
}

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
