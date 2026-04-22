/* XYZ Labs — lightweight i18n runtime.
 *
 * - Detects locale from the URL pathname (/nl prefix → "nl", otherwise "en").
 * - Looks up keys from window.XYZ_LOCALES[locale]; missing keys fall back to
 *   English automatically.
 * - Applies translations to any element carrying:
 *     data-i18n="key"           → textContent
 *     data-i18n-html="key"      → innerHTML (only for trusted dictionary text)
 *     data-i18n-attr="a:k,b:k2" → attribute(s)
 * - Rewrites internal <a href> links to stay inside the locale tree
 *   (e.g. /cart.html → /nl/cart when locale is nl).
 *
 * No backend, payment, or routing logic changes. Purely presentational.
 */
(function () {
  const LOCALES = window.XYZ_LOCALES || {};
  const DEFAULT_LOCALE = "en";
  const SUPPORTED = ["en", "nl"];
  const STORAGE_KEY = "xyz_locale";

  function readStored() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v && SUPPORTED.indexOf(v) !== -1) return v;
    } catch (e) {}
    return null;
  }

  function writeStored(next) {
    try {
      if (next && SUPPORTED.indexOf(next) !== -1) {
        localStorage.setItem(STORAGE_KEY, next);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
  }

  /* Detection precedence:
   *   1. Stored preference (set by the in-nav language switch). Lets users
   *      flip locale even before a Cloudflare Pages deploy picks up
   *      _redirects.
   *   2. URL pathname — /nl prefix → Dutch.
   *   3. Default (English). */
  function detectLocale() {
    const stored = readStored();
    if (stored) return stored;
    const p = (window.location.pathname || "").toLowerCase();
    if (p === "/nl" || p === "/nl/" || p.indexOf("/nl/") === 0) return "nl";
    return DEFAULT_LOCALE;
  }

  const locale = detectLocale();
  const active = LOCALES[locale] || {};
  const fallback = LOCALES[DEFAULT_LOCALE] || {};

  function lookup(dict, key) {
    if (!dict || !key) return undefined;
    const parts = String(key).split(".");
    let cur = dict;
    for (let i = 0; i < parts.length; i++) {
      if (cur && typeof cur === "object" && parts[i] in cur) {
        cur = cur[parts[i]];
      } else {
        return undefined;
      }
    }
    return cur;
  }

  /* Returns the raw value at `key` (any type) from the active locale, falling
   * back to English. Returns undefined if neither contains it. */
  function get(key) {
    const a = lookup(active, key);
    if (a !== undefined) return a;
    return lookup(fallback, key);
  }

  function t(key, fallbackText) {
    const v = lookup(active, key);
    if (typeof v === "string") return v;
    const fb = lookup(fallback, key);
    if (typeof fb === "string") return fb;
    return fallbackText !== undefined ? fallbackText : key;
  }

  /* Maps an internal path to its canonical form for `target` locale.
   * Handles both directions (en ↔ nl) and idempotently. */
  function pathForLocale(href, target) {
    if (!href) return href;
    if (
      /^(?:[a-z]+:)?\/\//i.test(href) ||
      href.indexOf("mailto:") === 0 ||
      href.indexOf("tel:") === 0 ||
      href.charAt(0) === "#"
    ) {
      return href;
    }
    // Split a possible fragment.
    const hashIdx = href.indexOf("#");
    const hash = hashIdx >= 0 ? href.slice(hashIdx) : "";
    let path = hashIdx >= 0 ? href.slice(0, hashIdx) : href;

    // Normalize Dutch-prefixed paths down to their English canonical form.
    if (path === "/nl" || path === "/nl/") {
      path = "/";
    } else if (path === "/nl/cart" || path === "/nl/cart/") {
      path = "/cart.html";
    } else if (path === "/nl/checkout" || path === "/nl/checkout/") {
      path = "/cart.html";
    } else if (path === "/nl/build" || path === "/nl/build/") {
      path = "/build.html";
    } else if (path === "/index.html") {
      path = "/";
    }

    if (target === "nl") {
      if (path === "/" || path === "") path = "/nl";
      else if (path === "/cart.html") path = "/nl/cart";
      else if (path === "/build.html") path = "/nl/build";
    }
    return path + hash;
  }

  /* Convenience: rewrite a link for the active locale. */
  function localizePath(href) {
    if (!href) return href;
    if (locale === DEFAULT_LOCALE) {
      // Still normalize accidental /nl links back to English canonical.
      if (
        href === "/nl" ||
        href === "/nl/" ||
        href.indexOf("/nl/") === 0 ||
        href.indexOf("/nl#") === 0
      ) {
        return pathForLocale(href, "en");
      }
      return href;
    }
    return pathForLocale(href, "nl");
  }

  /* User-invoked: store preference and navigate to the equivalent path. */
  function setLocale(next) {
    if (SUPPORTED.indexOf(next) === -1) return;
    writeStored(next);
    const target = pathForLocale(
      window.location.pathname + window.location.hash,
      next
    );
    if (target === window.location.pathname + window.location.hash) {
      window.location.reload();
    } else {
      window.location.href = target;
    }
  }

  function applyText(root) {
    (root || document).querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const val = t(key, null);
      if (val !== null && val !== undefined) el.textContent = val;
    });
  }

  function applyHtml(root) {
    (root || document).querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key) return;
      const val = t(key, null);
      if (val !== null && val !== undefined) el.innerHTML = val;
    });
  }

  function applyAttrs(root) {
    (root || document).querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const spec = el.getAttribute("data-i18n-attr");
      if (!spec) return;
      spec.split(",").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => (s || "").trim());
        if (!attr || !key) return;
        const val = t(key, null);
        if (val !== null && val !== undefined) el.setAttribute(attr, val);
      });
    });
  }

  function rewriteLinks(root) {
    if (locale === DEFAULT_LOCALE) return;
    (root || document).querySelectorAll("a[href]").forEach((a) => {
      const h = a.getAttribute("href");
      const next = localizePath(h);
      if (next !== h) a.setAttribute("href", next);
    });
  }

  function applyAll(root) {
    applyText(root);
    applyHtml(root);
    applyAttrs(root);
    rewriteLinks(root);
  }

  /* Wires any [data-locale-toggle] / [data-set-locale="nl|en"] elements
   * found in the DOM. Shows the active locale via a `data-active` attr so
   * existing .nav-pill styling can highlight it (see styles.css). */
  function wireLocaleSwitch(root) {
    (root || document)
      .querySelectorAll("[data-set-locale]")
      .forEach((el) => {
        const target = el.getAttribute("data-set-locale");
        el.setAttribute("data-active", target === locale ? "true" : "false");
        el.addEventListener("click", (e) => {
          e.preventDefault();
          if (target !== locale) setLocale(target);
        });
      });
    (root || document)
      .querySelectorAll("[data-locale-toggle]")
      .forEach((el) => {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          setLocale(locale === "nl" ? "en" : "nl");
        });
      });
    (root || document)
      .querySelectorAll("[data-locale-current]")
      .forEach((el) => {
        el.textContent = locale.toUpperCase();
      });
  }

  function init() {
    try {
      document.documentElement.setAttribute("lang", locale);
    } catch (e) {}
    applyAll(document);
    wireLocaleSwitch(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.XYZ_I18N = {
    locale,
    t,
    get,
    localizePath,
    apply: applyAll,
    setLocale
  };
})();
