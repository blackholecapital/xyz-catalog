/* XYZ Labs — shared Build + Cart state.
 *
 * Storage-only client module (Cloudflare Pages / static). Designed so the
 * schema matches PayMe's BasketItem shape — a future handoff to the real
 * PayMe / Stripe worker only needs to POST this payload.
 *
 * Item shape:
 *   {
 *     id, sku, name, category, image,
 *     setup, monthly, currency,
 *     demoUrl, qty, addedAt
 *   }
 */
(function () {
  const BUILD_KEY = "xyz_build_v1";
  const CART_KEY = "xyz_cart_v1";
  const CHANGE_EVENT = "xyz:commerce-change";

  function read(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return { items: [] };
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
      return parsed;
    } catch {
      return { items: [] };
    }
  }

  function write(key, state) {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }));
  }

  function normalize(raw) {
    return {
      id: raw.sku || raw.id,
      sku: raw.sku || raw.id,
      name: raw.name,
      category: raw.category || "Catalog",
      image: raw.image || null,
      setup: Number(raw.setup) || 0,
      monthly: Number(raw.monthly) || 0,
      currency: raw.currency || "usd",
      demoUrl: raw.demoUrl || null
    };
  }

  const Build = {
    key: BUILD_KEY,
    get() {
      return read(BUILD_KEY);
    },
    add(raw) {
      const item = normalize(raw);
      const state = Build.get();
      if (state.items.some((i) => i.sku === item.sku)) {
        return { added: false, reason: "duplicate" };
      }
      state.items.push({ ...item, addedAt: Date.now() });
      write(BUILD_KEY, state);
      return { added: true };
    },
    remove(sku) {
      const state = Build.get();
      state.items = state.items.filter((i) => i.sku !== sku);
      write(BUILD_KEY, state);
    },
    has(sku) {
      return Build.get().items.some((i) => i.sku === sku);
    },
    clear() {
      write(BUILD_KEY, { items: [] });
    },
    count() {
      return Build.get().items.length;
    },
    items() {
      return Build.get().items;
    }
  };

  const Cart = {
    key: CART_KEY,
    get() {
      return read(CART_KEY);
    },
    add(raw) {
      const item = normalize(raw);
      const state = Cart.get();
      const existing = state.items.find((i) => i.sku === item.sku);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        state.items.push({ ...item, qty: 1, addedAt: Date.now() });
      }
      write(CART_KEY, state);
      return { added: true };
    },
    setQty(sku, qty) {
      const state = Cart.get();
      const item = state.items.find((i) => i.sku === sku);
      if (!item) return;
      if (qty <= 0) {
        state.items = state.items.filter((i) => i.sku !== sku);
      } else {
        item.qty = qty;
      }
      write(CART_KEY, state);
    },
    remove(sku) {
      const state = Cart.get();
      state.items = state.items.filter((i) => i.sku !== sku);
      write(CART_KEY, state);
    },
    clear() {
      write(CART_KEY, { items: [] });
    },
    count() {
      return Cart.get().items.reduce((a, i) => a + (i.qty || 1), 0);
    },
    items() {
      return Cart.get().items;
    },
    totals() {
      const items = Cart.items();
      const setup = items.reduce(
        (a, i) => a + (i.setup || 0) * (i.qty || 1),
        0
      );
      const monthly = items.reduce(
        (a, i) => a + (i.monthly || 0) * (i.qty || 1),
        0
      );
      return {
        itemCount: items.length,
        unitCount: Cart.count(),
        setup,
        monthly,
        dueToday: setup + monthly
      };
    }
  };

  /* Presentation-only currency symbol swap: Dutch locale shows € instead
   * of $. The stored amount, Stripe line items, and checkout payload stay
   * in their original USD values — this is a display override only. */
  function formatUSD(n) {
    const i18n = window.XYZ_I18N;
    const sym = (i18n && i18n.t && i18n.t("common.currencySymbol", "$")) || "$";
    const code = (i18n && i18n.t && i18n.t("common.currencyCode", "en-US")) || "en-US";
    const sep = (i18n && i18n.t && i18n.t("common.currencySeparator", "")) || "";
    return sym + sep + Number(n || 0).toLocaleString(code);
  }

  function localizePath(p) {
    if (window.XYZ_I18N && typeof window.XYZ_I18N.localizePath === "function") {
      return window.XYZ_I18N.localizePath(p);
    }
    return p;
  }
  function toCartPage() {
    window.location.href = localizePath("/cart.html");
  }
  function toBuildPage() {
    window.location.href = localizePath("/build.html");
  }

  window.XYZ_COMMERCE = {
    Build,
    Cart,
    CHANGE_EVENT,
    formatUSD,
    toCartPage,
    toBuildPage
  };
})();

/* =========================================================
   Shared UI wiring: day/night theme toggle + back-to-top.
   Presentation-only. No backend / commerce interaction.
   ========================================================= */
(function () {
  const THEME_KEY = "xyz_theme";

  function applyTheme(theme) {
    const mode = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", mode);
    const i18n = window.XYZ_I18N;
    const dayLabel = i18n && i18n.t ? i18n.t("nav.themeDay", "Day") : "Day";
    const nightLabel = i18n && i18n.t ? i18n.t("nav.themeNight", "Night") : "Night";
    const btns = document.querySelectorAll(".nav-pill-theme .theme-label");
    btns.forEach((el) => {
      el.textContent = mode === "light" ? dayLabel : nightLabel;
    });
  }

  function currentTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || "dark";
    } catch {
      return "dark";
    }
  }

  function init() {
    applyTheme(currentTheme());

    document.querySelectorAll("#themeToggle, .nav-pill-theme").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const next = currentTheme() === "light" ? "dark" : "light";
        try { localStorage.setItem(THEME_KEY, next); } catch {}
        applyTheme(next);
      });
    });

    document.querySelectorAll("[data-scroll-top]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
