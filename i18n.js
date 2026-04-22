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

  function detectLocale() {
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

  /* Internal path → locale-prefixed path. Leaves external / mail / tel /
   * fragment-only / already-prefixed links alone. */
  function localizePath(href) {
    if (!href) return href;
    if (locale === DEFAULT_LOCALE) return href;
    if (
      /^(?:[a-z]+:)?\/\//i.test(href) ||
      href.indexOf("mailto:") === 0 ||
      href.indexOf("tel:") === 0 ||
      href.charAt(0) === "#"
    ) {
      return href;
    }
    // Already prefixed.
    if (href === "/nl" || href.indexOf("/nl/") === 0 || href.indexOf("/nl#") === 0) {
      return href;
    }
    // Root + fragment, e.g. "/#catalog" → "/nl#catalog"
    if (href === "/") return "/nl";
    if (href.indexOf("/#") === 0) return "/nl" + href.slice(1);
    if (href === "/index.html") return "/nl";
    if (href === "/cart.html") return "/nl/cart";
    if (href === "/build.html") return "/nl/build";
    // Anything else we don't know how to remap — leave untouched.
    return href;
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

  function init() {
    try {
      document.documentElement.setAttribute("lang", locale);
    } catch (e) {}
    applyAll(document);
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
    apply: applyAll
  };
})();
