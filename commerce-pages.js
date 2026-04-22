/* Renderers for build.html and cart.html.
 * Depend on: window.XYZ_COMMERCE (from cart.js) and window.XYZ_LABS (products.js).
 */
(function () {
  const t = (key, fb) =>
    (window.XYZ_I18N && window.XYZ_I18N.t && window.XYZ_I18N.t(key, fb)) || fb;
  const localizePath = (p) =>
    (window.XYZ_I18N && window.XYZ_I18N.localizePath && window.XYZ_I18N.localizePath(p)) ||
    p;
  /* Prefer the shared locale-aware formatter from cart.js; fall back to a
   * dollar-formatted string only if XYZ_COMMERCE hasn't loaded. */
  const fmtMono = (n) =>
    (window.XYZ_COMMERCE && window.XYZ_COMMERCE.formatUSD
      ? window.XYZ_COMMERCE.formatUSD(n)
      : "$" + Number(n || 0).toLocaleString());
  const fmtMonthly = (n) =>
    (n ? fmtMono(n) : fmtMono(0)) + t("common.monthSuffix", "/mo");
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  function localizedCategory(category) {
    if (category === "Web3") return t("common.categoryWeb3", "Web3");
    if (category === "Catalog") return t("common.categoryCatalog", "Catalog");
    return category;
  }

  const STUDIO_EMAIL =
    (window.XYZ_LABS && window.XYZ_LABS.brand && window.XYZ_LABS.brand.contact.email) ||
    "info@blackholecapital.xyz";

  const PROMO = { label: "LAUNCH30", amountPct: 30 };

  function footerYear() {
    const el = document.getElementById("footerYear");
    if (el) el.textContent = new Date().getFullYear();
  }

  function renderEmpty(container, kind) {
    const title =
      kind === "build"
        ? t("build.emptyTitle", "Your Build is empty.")
        : t("cart.emptyTitle", "Your cart is empty.");
    const sub =
      kind === "build"
        ? t(
            "build.emptySub",
            "Add systems from the catalog to create your shortlist."
          )
        : t(
            "cart.emptySub",
            "Add a product or use Buy It Now to populate your cart."
          );
    const browse = t("common.browseCatalog", "Browse catalog");
    container.innerHTML = `
      <div class="commerce-empty">
        <div class="commerce-empty-mark">◇</div>
        <div class="commerce-empty-title">${esc(title)}</div>
        <p class="commerce-empty-sub">${esc(sub)}</p>
        <a class="btn btn-primary btn-sm" href="${esc(localizePath("/"))}">${esc(browse)} <span class="btn-arrow">→</span></a>
      </div>`;
  }

  function itemRow(item, opts) {
    const tone = item.category === "Web3" ? "defi" : "studio";
    const thumb = item.image
      ? `<img src="${esc(item.image)}" alt="${esc(item.name)}" />`
      : `<span class="row-thumb-placeholder">${esc(
          item.name.substring(0, 2).toUpperCase()
        )}</span>`;
    const offLabel = t("promo.offSuffix", "OFF");
    const usdcBonus = t("promo.usdcBonus", "+10% USDC");
    const promoLine =
      opts.showPromo && item.category === "Catalog"
        ? `<div class="row-promo">
             <span class="promo-chip">${PROMO.amountPct}% ${esc(offLabel)} · ${PROMO.label}</span>
             <span class="promo-chip promo-chip-alt">${esc(usdcBonus)}</span>
           </div>`
        : "";
    const decAria = t("common.decreaseAria", "Decrease");
    const incAria = t("common.increaseAria", "Increase");
    const qty = opts.showQty
      ? `<div class="row-qty">
          <button data-dec aria-label="${esc(decAria)}">−</button>
          <span>${item.qty || 1}</span>
          <button data-inc aria-label="${esc(incAria)}">+</button>
        </div>`
      : "";
    const removeAria = t("common.removeAria", "Remove");
    const skuPrefix = t("common.skuPrefix", "SKU");
    const setupLabel = t("common.labelSetup", "Setup");
    return `
      <div class="commerce-row" data-sku="${esc(item.sku)}" data-tone="${tone}">
        <div class="row-thumb">${thumb}</div>
        <div class="row-main">
          <div class="row-head">
            <div class="row-name">${esc(item.name)}</div>
            <button class="row-remove" data-remove aria-label="${esc(removeAria)} ${esc(
              item.name
            )}">×</button>
          </div>
          <div class="row-sku">${esc(skuPrefix)} ${esc(item.sku)} · ${esc(localizedCategory(item.category))}</div>
          <div class="row-price">
            <span class="row-price-setup">${esc(setupLabel)} ${fmtMono(item.setup)}</span>
            <span class="row-price-sep">·</span>
            <span class="row-price-monthly">${fmtMonthly(item.monthly)}</span>
          </div>
          ${promoLine}
        </div>
        ${qty}
      </div>`;
  }

  function bindRowActions(container, onRemove, onQty) {
    container.querySelectorAll(".commerce-row").forEach((row) => {
      const sku = row.dataset.sku;
      const removeBtn = row.querySelector("[data-remove]");
      if (removeBtn) removeBtn.addEventListener("click", () => onRemove(sku));
      if (onQty) {
        const inc = row.querySelector("[data-inc]");
        const dec = row.querySelector("[data-dec]");
        if (inc) inc.addEventListener("click", () => onQty(sku, +1));
        if (dec) dec.addEventListener("click", () => onQty(sku, -1));
      }
    });
  }

  function syncNav() {
    const C = window.XYZ_COMMERCE;
    if (!C) return;
    const bc = document.getElementById("navBuildCount");
    const cc = document.getElementById("navCartCount");
    if (bc) {
      const n = C.Build.count();
      bc.textContent = n;
      bc.parentElement.dataset.empty = n === 0 ? "true" : "false";
    }
    if (cc) {
      const n = C.Cart.count();
      cc.textContent = n;
      cc.parentElement.dataset.empty = n === 0 ? "true" : "false";
    }
  }

  function buildSummaryFromItems(items) {
    return items.reduce(
      (a, i) => {
        a.setup += (i.setup || 0) * (i.qty || 1);
        a.monthly += (i.monthly || 0) * (i.qty || 1);
        return a;
      },
      { setup: 0, monthly: 0 }
    );
  }

  /* ---------- Build page ---------- */
  function renderBuildPage() {
    const C = window.XYZ_COMMERCE;
    if (!C) return;
    footerYear();
    syncNav();

    const body = document.getElementById("buildBody");
    const foot = document.getElementById("buildFoot");
    const items = C.Build.items();

    if (!items.length) {
      renderEmpty(body, "build");
      foot.hidden = true;
      return;
    }

    body.innerHTML =
      `<div class="commerce-rows">` +
      items.map((i) => itemRow(i, { showPromo: true })).join("") +
      `</div>`;

    const totals = buildSummaryFromItems(items);
    document.getElementById("buildCountLabel").textContent = items.length;
    document.getElementById("buildSetup").textContent = fmtMono(totals.setup);
    document.getElementById("buildMonthly").textContent = fmtMonthly(totals.monthly);
    foot.hidden = false;

    bindRowActions(body, (sku) => {
      C.Build.remove(sku);
      renderBuildPage();
    });

    document.getElementById("clearBuild").onclick = () => {
      if (confirm(t("build.clearConfirm", "Clear your Build list?"))) {
        C.Build.clear();
        renderBuildPage();
      }
    };

    document.getElementById("moveToCart").onclick = (e) => {
      e.preventDefault();
      items.forEach((i) => C.Cart.add(i));
      C.toCartPage();
    };

    const mailto = buildMailto(items, t("build.mailtoBuildSubject", "Build inquiry"));
    document.getElementById("emailBuild").href = mailto;
    document.getElementById("customizeLink").href = mailto;
    document.getElementById("customBuildLink").href =
      `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(
        "XYZ Labs — " + t("build.mailtoCustomSubject", "Custom build inquiry")
      )}`;

    window.addEventListener(C.CHANGE_EVENT, syncNav, { once: true });
  }

  /* ---------- Cart page ---------- */
  function renderCartPage() {
    const C = window.XYZ_COMMERCE;
    if (!C) return;
    footerYear();
    syncNav();

    const body = document.getElementById("cartBody");
    const foot = document.getElementById("cartFoot");
    const items = C.Cart.items();

    if (!items.length) {
      renderEmpty(body, "cart");
      foot.hidden = true;
      return;
    }

    body.innerHTML =
      `<div class="commerce-rows">` +
      items.map((i) => itemRow(i, { showQty: true })).join("") +
      `</div>`;

    const t = C.Cart.totals();
    document.getElementById("cartItemsLabel").textContent = t.unitCount;
    document.getElementById("cartSetup").textContent = fmtMono(t.setup);
    document.getElementById("cartMonthly").textContent = fmtMonthly(t.monthly);
    document.getElementById("cartDueToday").textContent = fmtMono(t.dueToday);
    foot.hidden = false;

    bindRowActions(
      body,
      (sku) => {
        C.Cart.remove(sku);
        renderCartPage();
      },
      (sku, delta) => {
        const item = C.Cart.items().find((i) => i.sku === sku);
        if (!item) return;
        C.Cart.setQty(sku, (item.qty || 1) + delta);
        renderCartPage();
      }
    );

    document.getElementById("payNow").onclick = () => startCheckout(items);
    document.getElementById("emailInstead").onclick = () => {
      window.location.href = buildMailto(
        items,
        t("build.mailtoCartSubject", "Cart checkout inquiry")
      );
    };
  }

  /* ---------- Checkout handoff (wired to showroom flow) ----------
   * POST https://api.xyz-labs.xyz/checkout/create
   * On success: redirect to data.redirect_url (Stripe-hosted page).
   * No modal, no dead-end — matches CartSurface + CheckoutFlow contract.
   */
  const CHECKOUT_ENDPOINT = "https://api.xyz-labs.xyz/checkout/create";

  function generateCheckoutId() {
    if (window.crypto && typeof crypto.randomUUID === "function") {
      return "co_" + crypto.randomUUID();
    }
    return (
      "co_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 10)
    );
  }

  function buildLineItems(items) {
    const lines = [];
    items.forEach((item) => {
      const qty = item.qty || 1;
      if (item.monthly > 0) {
        lines.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: `${item.name} — Hosting`,
              description: `${item.sku} · ${item.category}`,
              metadata: { sku: item.sku, kind: "monthly" }
            },
            unit_amount: Math.round(item.monthly * 100),
            recurring: { interval: "month", interval_count: 1 }
          },
          quantity: qty
        });
      }
      if (item.setup > 0) {
        lines.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: `${item.name} — Setup`,
              description: `${item.sku} · ${item.category}`,
              metadata: { sku: item.sku, kind: "setup" }
            },
            unit_amount: Math.round(item.setup * 100)
          },
          quantity: qty,
          one_time: true
        });
      }
    });
    return lines;
  }

  function selectedPaymentMethod() {
    const el = document.querySelector(
      'input[name="payment_method"]:checked'
    );
    return el ? el.value : "card";
  }

  function showCheckoutError(msg) {
    const el = document.getElementById("checkoutError");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
  }

  function clearCheckoutError() {
    const el = document.getElementById("checkoutError");
    if (!el) return;
    el.hidden = true;
    el.textContent = "";
  }

  async function startCheckout(items) {
    const btn = document.getElementById("payNow");
    const C = window.XYZ_COMMERCE;
    clearCheckoutError();
    if (!items.length) return;

    const checkout_id = generateCheckoutId();
    const totals = C.Cart.totals();
    const payload = {
      checkout_id,
      mode: "subscription",
      currency: "usd",
      success_url: `${window.location.origin}/checkout/confirm`,
      cancel_url: `${window.location.origin}/cart`,
      metadata: {
        source: "xyz-catalog",
        payment_method: selectedPaymentMethod(),
        item_count: String(totals.unitCount),
        setup_total_cents: String(Math.round(totals.setup * 100)),
        monthly_total_cents: String(Math.round(totals.monthly * 100)),
        skus: items.map((i) => i.sku).join(",")
      },
      line_items: buildLineItems(items)
    };

    const originalLabel = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = esc(t("common.creatingCheckout", "Creating checkout…"));

    try {
      const res = await fetch(CHECKOUT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Checkout failed (${res.status})`);
      }

      const data = await res.json();
      if (data && data.redirect_url) {
        window.location.href = data.redirect_url;
        return;
      }
      throw new Error("Checkout response missing redirect_url");
    } catch (err) {
      console.error("[checkout]", err);
      showCheckoutError(
        (err && err.message) ||
          t(
            "common.checkoutError",
            "Unable to start checkout. Please try again or email studio."
          )
      );
      btn.disabled = false;
      btn.innerHTML = originalLabel;
    }
  }

  function buildMailto(items, subjectPrefix) {
    const setupLabel = t("common.labelSetup", "Setup");
    const lines = items
      .map(
        (i) =>
          `- ${i.name} [${i.sku}] — ${setupLabel} ${fmtMono(i.setup)} · ${fmtMonthly(
            i.monthly
          )} × ${i.qty || 1}`
      )
      .join("%0D%0A");
    const intro = encodeURIComponent(t("build.mailtoIntro", "Hi XYZ Labs,"));
    const ask = encodeURIComponent(
      t("build.mailtoBody", "I'd like to finalize the following:")
    );
    const outro = encodeURIComponent(t("build.mailtoOutro", "Thanks."));
    const body = `${intro}%0D%0A%0D%0A${ask}%0D%0A%0D%0A${lines}%0D%0A%0D%0A${outro}`;
    return `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(
      "XYZ Labs — " + subjectPrefix
    )}&body=${body}`;
  }

  window.renderBuildPage = renderBuildPage;
  window.renderCartPage = renderCartPage;
})();
