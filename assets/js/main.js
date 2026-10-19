/* ==========================================================================
   Nitaq Al-A'mal — site behaviour
   ========================================================================== */

/* ---- Company contact details: edit these in ONE place ------------------ */
const CONFIG = {
  phoneDisplay: "+964 770 000 0000",   // TODO: replace with the real number
  phoneTel: "+9647700000000",          // same number, no spaces
  whatsapp: "9647700000000",           // international format, digits only
  email: "info@nitaq-alamal.com",      // TODO: replace with the real email
  address: "Baghdad, Iraq",            // TODO: replace with the real address
  employIqUrl: "#",                    // TODO: Employ IQ website, if any
  social: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
  },
};

document.documentElement.classList.remove("no-js");

/* ---- Fill contact details into the page ---------------------------------- */
function applyConfig() {
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.dataset.config;
    if (key === "phone") {
      el.textContent = CONFIG.phoneDisplay;
      if (el.tagName === "A") el.href = `tel:${CONFIG.phoneTel}`;
    } else if (key === "email") {
      el.textContent = CONFIG.email;
      if (el.tagName === "A") el.href = `mailto:${CONFIG.email}`;
    } else if (key === "address") {
      el.textContent = CONFIG.address;
    }
  });
  document.querySelectorAll("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    if (key === "tel") el.href = `tel:${CONFIG.phoneTel}`;
    else if (key === "mail") el.href = `mailto:${CONFIG.email}`;
    else if (key === "whatsapp") el.href = waLink(el.dataset.waText || "Hello, I'd like to know more about your services.");
    else if (key === "employiq") el.href = CONFIG.employIqUrl;
    else if (CONFIG.social[key]) el.href = CONFIG.social[key];
  });
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

function waLink(text) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
}

/* ---- Mobile menu with sliding submenu ------------------------------------ */
function initMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    menu.classList.remove("show-sub");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".i-open").hidden = open;
    toggle.querySelector(".i-close").hidden = !open;
    document.body.classList.toggle("no-scroll", open);
  };

  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
  menu.querySelectorAll("[data-sub-open]").forEach((b) => b.addEventListener("click", () => menu.classList.add("show-sub")));
  menu.querySelectorAll("[data-sub-close]").forEach((b) => b.addEventListener("click", () => menu.classList.remove("show-sub")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
  window.addEventListener("resize", () => window.innerWidth >= 1000 && setOpen(false));
}

/* ---- Carousels ------------------------------------------------------------ */
function initCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const track = root.querySelector(".carousel__track");
    const prev = root.querySelector("[data-prev]");
    const next = root.querySelector("[data-next]");
    const progress = root.querySelector(".progress");
    const items = [...track.children];

    if (progress) {
      progress.innerHTML = items.map(() => "<span></span>").join("");
    }
    const step = () => (items[0]?.getBoundingClientRect().width || 300) + 16;

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const pos = track.scrollLeft;
      prev.disabled = pos <= 4;
      next.disabled = pos >= max - 4;
      if (progress) {
        const idx = Math.round(pos / step());
        [...progress.children].forEach((s, i) => s.classList.toggle("is-active", i === Math.min(idx, items.length - 1)));
      }
    };

    prev.addEventListener("click", () => track.scrollBy({ left: -step() }));
    next.addEventListener("click", () => track.scrollBy({ left: step() }));
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    window.addEventListener("resize", update);
    update();
  });
}

/* ---- Tabs ----------------------------------------------------------------- */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
    const prev = root.querySelector("[data-prev]");
    const next = root.querySelector("[data-next]");
    let current = 0;

    const select = (i, focus = false) => {
      current = Math.max(0, Math.min(tabs.length - 1, i));
      tabs.forEach((t, j) => {
        const on = j === current;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      const t = tabs[current];
      t.parentElement.scrollTo({ left: t.offsetLeft - t.parentElement.offsetLeft - 20, behavior: "smooth" });
      if (focus) t.focus();
      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current === tabs.length - 1;
    };

    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(i));
      t.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") select(current + 1, true);
        if (e.key === "ArrowLeft") select(current - 1, true);
      });
    });
    prev?.addEventListener("click", () => select(current - 1));
    next?.addEventListener("click", () => select(current + 1));

    // Links elsewhere on the page can open a specific tab: <a data-open-tab="payroll">
    document.querySelectorAll("[data-open-tab]").forEach((a) =>
      a.addEventListener("click", () => {
        const i = tabs.findIndex((t) => t.id === `tab-${a.dataset.openTab}`);
        if (i > -1) select(i);
      })
    );
    // Deep links from other pages: index.html#tab-payroll
    const fromHash = tabs.findIndex((t) => `#${t.id}` === location.hash);
    select(fromHash > -1 ? fromHash : 0);
    if (fromHash > -1) root.closest("section").scrollIntoView();
  });
}

/* ---- Footer columns are accordions on mobile, always open on desktop ------ */
function initFooter() {
  const mq = window.matchMedia("(min-width: 900px)");
  const sync = () => document.querySelectorAll(".site-footer details").forEach((d) => (d.open = mq.matches));
  mq.addEventListener("change", sync);
  sync();
}

/* ---- Pre-select a service in the quote form ------------------------------- */
function initServiceLinks() {
  const select = document.getElementById("q-service");
  if (!select) return;
  document.querySelectorAll("[data-service]").forEach((a) =>
    a.addEventListener("click", () => {
      select.value = a.dataset.service;
    })
  );
}

/* ---- Forms → WhatsApp ----------------------------------------------------- */
function initForms() {
  document.querySelectorAll("textarea[maxlength]").forEach((ta) => {
    const counter = ta.parentElement.querySelector(".counter");
    if (!counter) return;
    const update = () => (counter.textContent = `${ta.value.length}/${ta.maxLength}`);
    ta.addEventListener("input", update);
    update();
  });

  document.querySelectorAll("form[data-wa-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let firstBad = null;
      form.querySelectorAll("[required]").forEach((input) => {
        const field = input.closest(".field");
        const ok = input.checkValidity();
        field.classList.toggle("is-invalid", !ok);
        if (!ok && !firstBad) firstBad = input;
      });
      if (firstBad) {
        firstBad.focus();
        return;
      }

      const lines = [form.dataset.waForm];
      form.querySelectorAll("input, select, textarea").forEach((input) => {
        const value = input.value.trim();
        if (!value || input.type === "hidden") return;
        const label = input.closest(".field").querySelector("label").childNodes[0].textContent.trim();
        lines.push(`${label}: ${value}`);
      });
      window.open(waLink(lines.join("\n")), "_blank", "noopener");
      form.querySelector(".form-success")?.classList.add("is-visible");
    });

    form.querySelectorAll("input, select, textarea").forEach((input) =>
      input.addEventListener("input", () => input.closest(".field")?.classList.remove("is-invalid"))
    );
  });
}

/* ---- Floating buttons ----------------------------------------------------- */
function initFloating() {
  const top = document.querySelector(".to-top");
  if (top) {
    const onScroll = () => top.classList.toggle("is-visible", window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    top.addEventListener("click", () => window.scrollTo({ top: 0 }));
    onScroll();
  }

  const bubble = document.querySelector(".wa-bubble");
  if (bubble) {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem("wa-bubble") === "closed"; } catch (_) {}
    if (!dismissed) setTimeout(() => (bubble.hidden = false), 2500);
    bubble.querySelector("button").addEventListener("click", () => {
      bubble.hidden = true;
      try { sessionStorage.setItem("wa-bubble", "closed"); } catch (_) {}
    });
  }
}

/* ---- Reveal on scroll ----------------------------------------------------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      }),
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

applyConfig();
initMenu();
initCarousels();
initTabs();
initServiceLinks();
initFooter();
initForms();
initFloating();
initReveal();
