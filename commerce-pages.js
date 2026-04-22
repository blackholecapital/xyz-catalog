/* Renderers for build.html and cart.html.
 * Depend on: window.XYZ_COMMERCE (from cart.js) and window.XYZ_LABS (products.js).
 */
(function () {
  const fmtMono = (n) => "$" + Number(n || 0).toLocaleString();
  const fmtMonthly = (n) => (n ? fmtMono(n) + "/mo" : "$0/mo");
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

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
      kind === "build" ? "Your Build is empty." : "Your cart is empty.";
    const sub =
      kind === "build"
        ? "Add systems from the catalog to create your shortlist."
        : "Add a product or use Buy It Now to populate your cart.";
    container.innerHTML = `
      <div class="commerce-empty">
        <div class="commerce-empty-mark">◇</div>
        <div class="commerce-empty-title">${esc(title)}</div>
        <p class="commerce-empty-sub">${esc(sub)}</p>
        <a class="btn btn-primary btn-sm" href="/">Browse catalog <span class="btn-arrow">→</span></a>
      </div>`;
  }

  function itemRow(item, opts) {
    const tone = item.category === "Web3" ? "defi" : "studio";
    const thumb = item.image
      ? `<img src="${esc(item.image)}" alt="${esc(item.name)}" />`
      : `<span class="row-thumb-placeholder">${esc(
          item.name.substring(0, 2).toUpperCase()
        )}</span>`;
    const promoLine =
      opts.showPromo && item.category === "Catalog"
        ? `<div class="row-promo">
             <span class="promo-chip">${PROMO.amountPct}% OFF · ${PROMO.label}</span>
             <span class="promo-chip promo-chip-alt">+10% USDC</span>
           </div>`
        : "";
    const qty = opts.showQty
      ? `<div class="row-qty">
          <button data-dec aria-label="Decrease">−</button>
          <span>${item.qty || 1}</span>
          <button data-inc aria-label="Increase">+</button>
        </div>`
      : "";
    return `
      <div class="commerce-row" data-sku="${esc(item.sku)}" data-tone="${tone}">
        <div class="row-thumb">${thumb}</div>
        <div class="row-main">
          <div class="row-head">
            <div class="row-name">${esc(item.name)}</div>
            <button class="row-remove" data-remove aria-label="Remove ${esc(
              item.name
            )}">×</button>
          </div>
          <div class="row-sku">SKU ${esc(item.sku)} · ${esc(item.category)}</div>
          <div class="row-price">
            <span class="row-price-setup">Setup ${fmtMono(item.setup)}</span>
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
      if (confirm("Clear your Build list?")) {
        C.Build.clear();
        renderBuildPage();
      }
    };

    document.getElementById("moveToCart").onclick = (e) => {
      e.preventDefault();
      items.forEach((i) => C.Cart.add(i));
      C.toCartPage();
    };

    const mailto = buildMailto(items, "Build inquiry");
    document.getElementById("emailBuild").href = mailto;
    document.getElementById("customizeLink").href = mailto;
    document.getElementById("customBuildLink").href =
      `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(
        "XYZ Labs — Custom build inquiry"
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

    document.getElementById("payNow").onclick = () => openCheckoutModal(items, t);
    document.getElementById("emailInstead").onclick = () => {
      window.location.href = buildMailto(items, "Cart checkout inquiry");
    };

    const modal = document.getElementById("checkoutModal");
    modal.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) closeCheckoutModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeCheckoutModal();
    });
  }

  function openCheckoutModal(items, totals) {
    const modal = document.getElementById("checkoutModal");
    const linesEl = document.getElementById("modalLineItems");
    const totalsEl = document.getElementById("modalTotals");
    linesEl.innerHTML = items
      .map(
        (i) => `
        <li>
          <strong>${esc(i.name)}</strong>
          <span style="color: var(--text-muted); font-family: var(--mono); font-size: 11px; margin-left: 8px;">${esc(i.sku)}</span>
          <span style="float: right; color: var(--text-dim);">
            ${fmtMono(i.setup)} + ${fmtMonthly(i.monthly)} × ${i.qty || 1}
          </span>
        </li>`
      )
      .join("");
    totalsEl.innerHTML = `
      <div class="price-pill"><span class="label">Setup subtotal</span><span class="value">${fmtMono(
        totals.setup
      )}</span></div>
      <div class="price-pill"><span class="label">Monthly</span><span class="value">${fmtMono(
        totals.monthly
      )}<span class="suffix">/mo</span></span></div>
      <div class="price-pill"><span class="label">Due today</span><span class="value">${fmtMono(
        totals.dueToday
      )}</span></div>
    `;
    document.getElementById("modalEmail").href = buildMailto(
      items,
      "Checkout confirmation"
    );
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeCheckoutModal() {
    const modal = document.getElementById("checkoutModal");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function buildMailto(items, subjectPrefix) {
    const lines = items
      .map(
        (i) =>
          `- ${i.name} [${i.sku}] — Setup ${fmtMono(i.setup)} · ${fmtMonthly(
            i.monthly
          )} × ${i.qty || 1}`
      )
      .join("%0D%0A");
    const body = `Hi XYZ Labs,%0D%0A%0D%0AI'd like to finalize the following:%0D%0A%0D%0A${lines}%0D%0A%0D%0AThanks.`;
    return `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(
      "XYZ Labs — " + subjectPrefix
    )}&body=${body}`;
  }

  window.renderBuildPage = renderBuildPage;
  window.renderCartPage = renderCartPage;
})();
