// Main UI hooks.
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"], .footer-nav a[href^="#"]');
const sectionLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
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

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
