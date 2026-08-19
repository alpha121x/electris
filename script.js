document.documentElement.classList.add("js");

const navbarToggler = document.querySelector(".navbar-toggler");
const navbarCollapse = document.querySelector(".navbar-collapse");
navbarToggler?.addEventListener("click", () => {
  navbarCollapse?.classList.toggle("show");
});

function makeSelectable(selector) {
  const cards = [...document.querySelectorAll(selector)];

  cards.forEach((card) => {
    card.tabIndex = card.tabIndex || 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", card.classList.contains("card-selected") || card.classList.contains("selected") ? "true" : "false");

    const select = () => {
      cards.forEach((item) => {
        item.classList.remove("selected", "card-selected", "expanded");
        item.setAttribute("aria-pressed", "false");
      });

      card.classList.add("card-selected");
      if (card.matches(".solution-cards figure")) card.classList.add("expanded");
      card.setAttribute("aria-pressed", "true");
    };

    card.addEventListener("click", select);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      select();
    });
  });
}

makeSelectable(".tech-cards article");
makeSelectable(".solution-cards figure");

const navLinks = [...document.querySelectorAll(".navbar .nav-link")];
const sectionsByNav = navLinks
  .map((link) => {
    const href = link.getAttribute("href") || "";
    return { link, target: href.startsWith("#") ? document.querySelector(href) : null };
  })
  .filter((item) => item.target);

function setActiveNav(activeLink) {
  navLinks.forEach((link) => {
    const isActive = link === activeLink;
    link.classList.toggle("active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveNav(link));
  link.addEventListener("focus", () => setActiveNav(link));
});

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const match = sectionsByNav.find((item) => item.target === visible.target);
      if (match) setActiveNav(match.link);
    },
    { rootMargin: "-35% 0px -50% 0px", threshold: [0.15, 0.35, 0.6] },
  );

  sectionsByNav.forEach((item) => navObserver.observe(item.target));
}

const revealItems = document.querySelectorAll(
  ".stat-card,.heading,.reason-row,.tech h2,.tech-cards article,.world,.solutions h2,.solution-cards figure,.cta",
);

revealItems.forEach((item) => item.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
