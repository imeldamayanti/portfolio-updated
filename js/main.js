document.documentElement.classList.add("js");

/* ============ INTRO LOADER (text in → blocks drop) ============ */
(function loader() {
  const l = document.getElementById("loader");
  if (!l) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { l.remove(); return; }

  document.body.classList.add("loading");
  const txt = l.querySelector(".loader__text");
  txt.innerHTML = txt.textContent
    .split("")
    .map((c, i) =>
      `<span class="ch" style="transition-delay:${(i * 0.05).toFixed(2)}s">${c === " " ? "&nbsp;" : c}</span>`
    )
    .join("");

  setTimeout(() => l.classList.add("in"), 30);     // letters rise in
  setTimeout(() => l.classList.add("drop"), 1500); // text out, columns fall
  setTimeout(() => {
    l.remove();
    document.body.classList.remove("loading");
  }, 2650);
})();

/* dev helper: /?y=1200 jumps to a scroll offset on load */
const yParam = new URLSearchParams(location.search).get("y");
if (yParam) {
  addEventListener("load", () =>
    window.scrollTo({ top: +yParam, behavior: "instant" })
  );
}

/* ============ NAV: shrink to floating pill on scroll ============ */
(function navPill() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  let ticking = false;
  function update() {
    nav.classList.toggle("nav--pill", scrollY > 120);
  }
  addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    },
    { passive: true }
  );
  update();
})();

/* ============ MOBILE MENU ============ */
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    })
  );
}

/* ============ SCROLL REVEALS ============ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        revealObserver.unobserve(e.target);
      }
    }
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ============ TIMELINE PROGRESS ============ */
/* line fills and nodes light up as they pass mid-viewport */
(function timeline() {
  const tl = document.querySelector(".timeline");
  if (!tl || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const progress = tl.querySelector(".timeline__progress");
  const items = [...tl.querySelectorAll(":scope > li")]; // timeline entries only, not bullet lists inside cards

  function update() {
    const r = tl.getBoundingClientRect();
    const mid = innerHeight * 0.55;
    const p = Math.min(Math.max((mid - r.top - 28) / (r.height - 56), 0), 1);
    progress.style.height = p * (r.height - 56) + "px";
    for (const li of items) {
      const n = li.querySelector(".timeline__node").getBoundingClientRect();
      li.classList.toggle("is-active", n.top + n.height / 2 <= mid);
    }
  }

  let ticking = false;
  addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    },
    { passive: true }
  );
  addEventListener("resize", update);
  addEventListener("load", update);
  update();
})();

