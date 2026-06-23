const loadIncludes = async () => {
  const includeSlots = [...document.querySelectorAll("[data-include]")];
  const bundledSections = window.SPELEOLAVE_SECTIONS || {};

  await Promise.all(
    includeSlots.map(async (slot) => {
      const path = slot.getAttribute("data-include");
      if (!path) return;

      try {
        if (bundledSections[path]) {
          slot.outerHTML = bundledSections[path];
          return;
        }

        if (window.location.protocol === "file:") {
          throw new Error("Chargement local sans sections.js disponible");
        }

        const response = await fetch(path);
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        slot.outerHTML = await response.text();
      } catch (error) {
        console.error(`Impossible de charger ${path}`, error);
        slot.innerHTML = `
          <section class="component-error section-dark">
            <div class="container">
              <p>Cette section n’a pas pu être chargée.</p>
            </div>
          </section>
        `;
      }
    })
  );
};

const initHeader = () => {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = [...document.querySelectorAll(".site-nav a")];
  let activeLockTimer;
  let lockedActiveId = "";

  const closeNav = () => {
    nav?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
  };

  const setScrolled = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => {
      const hash = new URL(link.href, window.location.href).hash;
      const isActive = hash === `#${sectionId}`;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const lockActiveLink = (sectionId) => {
    lockedActiveId = sectionId;
    setActiveLink(sectionId);

    window.clearTimeout(activeLockTimer);
    activeLockTimer = window.setTimeout(() => {
      lockedActiveId = "";
    }, 1800);
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
      const hash = new URL(link.href, window.location.href).hash;
      closeNav();

      if (hash) {
        lockActiveLink(decodeURIComponent(hash.slice(1)));
      }
    });
  });

  const sections = [...document.querySelectorAll("main section[id]")];

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        if (lockedActiveId) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-38% 0px -54% 0px", threshold: 0.01 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  window.addEventListener("hashchange", () => {
    if (!window.location.hash) return;
    lockActiveLink(decodeURIComponent(window.location.hash.slice(1)));
  });

  if (window.location.hash) {
    lockActiveLink(decodeURIComponent(window.location.hash.slice(1)));
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  return { closeNav, setActiveLink };
};

const initLightbox = () => {
  const lightbox = document.querySelector("[data-lightbox-root]");
  const lightboxImg = lightbox?.querySelector("img");
  const lightboxClose = lightbox?.querySelector(".lightbox-close");

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
  };

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

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
};

const scrollToInitialHash = () => {
  if (!window.location.hash) return;

  requestAnimationFrame(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    document.getElementById(id)?.scrollIntoView();
  });
};

(async () => {
  await loadIncludes();
  initHeader();
  initLightbox();
  scrollToInitialHash();
})();
