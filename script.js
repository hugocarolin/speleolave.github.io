const header = document.querySelector("[data-header]");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];

const setScrolled = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 10);
};

setScrolled();
window.addEventListener("scroll", setScrolled, { passive: true });

toggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", Boolean(isOpen));
  toggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

const sections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-38% 0px -54% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => navObserver.observe(section));
}

const lightbox = document.querySelector("[data-lightbox-root]");
const lightboxImg = lightbox?.querySelector("img");
const lightboxClose = lightbox?.querySelector(".lightbox-close");

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    const src = button.getAttribute("data-lightbox");
    const alt = button.querySelector("img")?.getAttribute("alt") || "";
    if (!src || !lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.hidden = false;
    lightboxClose?.focus();
  });
});

const closeLightbox = () => {
  if (!lightbox || !lightboxImg) return;
  lightbox.hidden = true;
  lightboxImg.src = "";
};

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    nav?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
    closeLightbox();
  }
});
