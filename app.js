/* XYZ Labs catalog renderer.
 * Expects window.XYZ_LABS (products.js) to be loaded first.
 */
(function () {
  const data = window.XYZ_LABS;
  if (!data) return;

  const Commerce = window.XYZ_COMMERCE;
  const { brand, products, defi } = data;

  /* ---------- Commerce adapters ---------- */
  function toLineItem(source, kind) {
    if (kind === "defi") {
      return {
        sku: source.sku,
        name: source.name,
        category: "Web3",
        image: null,
        setup: source.pricing ? source.pricing.setup : 0,
        monthly: source.pricing ? source.pricing.monthly : 0,
        demoUrl: source.url
      };
    }
    return {
      sku: source.productNumber,
      name: source.name,
      category: "Catalog",
      image: (source.images && source.images[0]) || null,
      setup: source.pricing ? source.pricing.setup : 0,
      monthly: source.pricing ? source.pricing.monthly : 0,
      demoUrl: source.demoUrl
    };
  }

  function flashButton(btn, msg, cls) {
    const original = btn.dataset.original || btn.innerHTML;
    btn.dataset.original = original;
    btn.innerHTML = msg;
    btn.classList.add(cls || "added");
    btn.disabled = true;
    clearTimeout(btn._flashTimer);
    btn._flashTimer = setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove(cls || "added");
      btn.disabled = false;
    }, 1400);
  }

  function handleAdd(item, btn) {
    if (!Commerce) return;
    if (Commerce.Build.has(item.sku)) {
      flashButton(btn, "Already in Build", "exists");
      return;
    }
    Commerce.Build.add(item);
    flashButton(btn, "Added to Build ✓", "added");
  }

  function handleBuy(item) {
    if (!Commerce) return;
    Commerce.Cart.add(item);
    Commerce.toCartPage();
  }

  /* ---------- Hero ---------- */
  document.getElementById("heroEyebrow").textContent = brand.hero.eyebrow;
  document.getElementById("heroTitle").textContent = brand.hero.title;
  document.getElementById("heroSubtitle").textContent = brand.hero.subtitle;
  document.getElementById("heroMeta").textContent =
    brand.hero.status || "Studio // Active";

  const heroContactBtn = document.getElementById("heroContactBtn");
  heroContactBtn.href = `mailto:${brand.contact.email}`;

  const heroVisual = document.getElementById("heroVisual");
  const tiles = ["t1", "t2", "t3", "t4"];
  brand.hero.featuredImages.slice(0, 4).forEach((src, i) => {
    const tile = document.createElement("div");
    tile.className = `hero-tile ${tiles[i]}`;
    tile.innerHTML = `<img src="/public${src}" alt="" loading="lazy" />`;
    heroVisual.appendChild(tile);
  });

  /* ---------- Filter chips ---------- */
  const filterBar = document.getElementById("filterBar");
  const categories = ["All", ...new Set(products.map((p) => p.badge))];
  const chipEls = [];
  categories.forEach((cat) => {
    const chip = document.createElement("button");
    chip.className = "filter-chip" + (cat === "All" ? " active" : "");
    chip.textContent = cat;
    chip.dataset.cat = cat;
    chip.addEventListener("click", () => {
      chipEls.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      filterProducts(cat);
    });
    filterBar.appendChild(chip);
    chipEls.push(chip);
  });

  function filterProducts(cat) {
    document.querySelectorAll(".product").forEach((el) => {
      const match = cat === "All" || el.dataset.badge === cat;
      el.style.display = match ? "" : "none";
    });
  }

  /* ---------- Product stack ---------- */
  const stack = document.getElementById("productStack");

  products.forEach((p, idx) => {
    const reverse = idx % 2 === 1;
    const section = document.createElement("article");
    section.className = "product collapsed" + (reverse ? " reverse" : "");
    section.dataset.badge = p.badge;
    section.id = `product-${p.productNumber}`;

    const bullets = p.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("");
    const price = renderPrice(p.pricing);
    const dots = p.images
      .map(
        (_, i) =>
          `<button class="${
            i === 0 ? "active" : ""
          }" data-i="${i}" aria-label="Image ${i + 1}"></button>`
      )
      .join("");
    const imgs = p.images
      .map(
        (src, i) =>
          `<img src="${src}" alt="${escapeAttr(p.name)} screen ${
            i + 1
          }" class="${i === 0 ? "active" : ""}" loading="lazy" />`
      )
      .join("");

    section.innerHTML = `
      <div class="product-media">
        <span class="media-badge">${escapeHtml(p.badge)}</span>
        ${imgs}
        ${p.images.length > 1 ? `<div class="media-dots">${dots}</div>` : ""}
      </div>
      <div class="product-copy">
        <div class="product-id">${escapeHtml(p.productNumber)}</div>
        <h3>${escapeHtml(p.name)}</h3>
        <p class="product-promise">${escapeHtml(p.oneLinePromise)}</p>
        <ul class="bullet-list">${bullets}</ul>
        <div class="pricing">${price}</div>
        <div class="product-actions">
          <button class="btn btn-primary btn-sm" data-buy>
            Buy It Now
            <span class="btn-arrow">→</span>
          </button>
          <button class="btn btn-ghost btn-sm" data-add-build>Add to Build</button>
          <a class="btn btn-ghost btn-sm" href="${p.demoUrl}" target="_blank" rel="noopener noreferrer">
            Live demo <span class="btn-arrow">↗</span>
          </a>
          <button class="btn btn-link btn-sm" data-learn-more>Learn more</button>
        </div>
        <button class="expand-toggle" data-expand>
          <span class="expand-label">More detail</span>
          <span class="chev">▾</span>
        </button>
        <div class="product-extra">
          <strong style="color: var(--text);">${escapeHtml(p.name)} — ${escapeHtml(
      p.productNumber
    )}</strong>
          <p style="margin-top: 10px;">${escapeHtml(p.buyerOutcome)}</p>
        </div>
      </div>
    `;

    // Carousel dots
    const dotBtns = section.querySelectorAll(".media-dots button");
    const imgEls = section.querySelectorAll(".product-media > img");
    dotBtns.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const i = Number(e.currentTarget.dataset.i);
        dotBtns.forEach((b) => b.classList.remove("active"));
        imgEls.forEach((im) => im.classList.remove("active"));
        dotBtns[i].classList.add("active");
        imgEls[i].classList.add("active");
      })
    );

    // Auto-advance carousel subtly on hover
    let autoTimer = null;
    section.querySelector(".product-media").addEventListener("mouseenter", () => {
      if (imgEls.length <= 1) return;
      autoTimer = setInterval(() => {
        const active = Array.from(dotBtns).findIndex((b) =>
          b.classList.contains("active")
        );
        const next = (active + 1) % imgEls.length;
        dotBtns.forEach((b) => b.classList.remove("active"));
        imgEls.forEach((im) => im.classList.remove("active"));
        dotBtns[next].classList.add("active");
        imgEls[next].classList.add("active");
      }, 1400);
    });
    section.querySelector(".product-media").addEventListener("mouseleave", () => {
      if (autoTimer) clearInterval(autoTimer);
    });

    // Expand
    const expandBtn = section.querySelector("[data-expand]");
    const expandLabel = expandBtn.querySelector(".expand-label");
    expandBtn.addEventListener("click", () => {
      const isExpanded = section.classList.toggle("expanded");
      section.classList.toggle("collapsed", !isExpanded);
      expandLabel.textContent = isExpanded ? "Show less" : "More detail";
    });

    // Learn more → modal
    section
      .querySelector("[data-learn-more]")
      .addEventListener("click", () => openModal(p));

    // Add to Build / Buy It Now
    const lineItem = toLineItem(p, "catalog");
    const addBtn = section.querySelector("[data-add-build]");
    const buyBtn = section.querySelector("[data-buy]");
    if (Commerce && Commerce.Build.has(lineItem.sku)) {
      addBtn.classList.add("exists");
      addBtn.textContent = "In Build";
    }
    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleAdd(lineItem, addBtn);
    });
    buyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleBuy(lineItem);
    });

    // Pointer glow
    section.addEventListener("pointermove", (e) => {
      const r = section.getBoundingClientRect();
      section.style.setProperty("--mx", `${e.clientX - r.left}px`);
      section.style.setProperty("--my", `${e.clientY - r.top}px`);
    });

    stack.appendChild(section);
  });

  function renderPrice(pricing) {
    const setup = `
      <div class="price-pill">
        <span class="label">Setup</span>
        <span class="value">$${pricing.setup.toLocaleString()}</span>
      </div>`;
    const monthly = `
      <div class="price-pill">
        <span class="label">Monthly</span>
        <span class="value">$${pricing.monthly}<span class="suffix">/mo</span></span>
      </div>`;
    return setup + monthly;
  }

  /* ---------- Web3 / DeFi ---------- */
  if (defi) {
    document.getElementById("defiEyebrow").textContent = defi.eyebrow;
    document.getElementById("defiTitle").textContent = defi.title;
    document.getElementById("defiSubtitle").textContent = defi.subtitle;
    document.getElementById("defiDocs").href = defi.docs;

    const defiGrid = document.getElementById("defiGrid");
    defi.products.forEach((d, i) => {
      const article = document.createElement("article");
      article.className = "defi-card";
      const idx = String(i + 1).padStart(2, "0");
      const host = d.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
      const pricing = d.pricing
        ? `<div class="defi-price">
             <span class="defi-price-setup">${Commerce ? Commerce.formatUSD(d.pricing.setup) : "$" + d.pricing.setup}</span>
             <span class="defi-price-sep">·</span>
             <span class="defi-price-monthly">${Commerce ? Commerce.formatUSD(d.pricing.monthly) : "$" + d.pricing.monthly}<span class="suffix">/mo</span></span>
           </div>`
        : "";
      article.innerHTML = `
        <a class="defi-media" href="${d.url}" target="_blank" rel="noopener noreferrer">
          <span class="defi-badge">${escapeHtml(d.tag)}</span>
          <span class="defi-meta">${idx} / ${escapeHtml(d.name)}</span>
          ${motifSvg(d.motif)}
        </a>
        <div class="defi-body">
          <div class="defi-label">${escapeHtml(d.label)}</div>
          <div class="defi-name">${escapeHtml(d.name)}</div>
          <p class="defi-desc">${escapeHtml(d.description)}</p>
          ${pricing}
          <div class="defi-actions">
            <button class="btn btn-primary-defi btn-sm" data-buy>Buy It Now <span class="btn-arrow">→</span></button>
            <button class="btn btn-ghost btn-sm" data-add-build>Add to Build</button>
            <a class="btn btn-link btn-sm" href="${d.url}" target="_blank" rel="noopener noreferrer">Open ↗</a>
          </div>
          <div class="defi-foot">
            <span class="defi-url">${escapeHtml(host)}</span>
            <span class="defi-sku">${escapeHtml(d.sku)}</span>
          </div>
        </div>
      `;

      const lineItem = toLineItem(d, "defi");
      const addBtn = article.querySelector("[data-add-build]");
      const buyBtn = article.querySelector("[data-buy]");
      if (Commerce && Commerce.Build.has(lineItem.sku)) {
        addBtn.classList.add("exists");
        addBtn.textContent = "In Build";
      }
      addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handleAdd(lineItem, addBtn);
      });
      buyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handleBuy(lineItem);
      });

      defiGrid.appendChild(article);
    });
  }

  /* ---------- Live band (catalog + DeFi unified) ---------- */
  const liveGrid = document.getElementById("liveGrid");
  const liveItems = [
    ...products.map((p) => ({
      name: p.name,
      label: p.productNumber,
      url: p.demoUrl,
      badge: "Live",
      tone: "studio"
    })),
    ...(defi ? defi.products : []).map((d) => ({
      name: d.name,
      label: d.label,
      url: d.url,
      badge: d.tag,
      tone: "defi"
    }))
  ];
  liveItems.forEach((item) => {
    const a = document.createElement("a");
    a.className = "live-card";
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.dataset.tone = item.tone;
    a.innerHTML = `
      <div class="live-card-head">
        <span class="live-badge"><span class="live-dot"></span>${escapeHtml(
          item.badge
        )}</span>
        <span class="live-label">${escapeHtml(item.label)}</span>
      </div>
      <div class="live-card-name">${escapeHtml(item.name)}</div>
      <div class="live-card-url">${escapeHtml(
        item.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
      )}</div>
    `;
    liveGrid.appendChild(a);
  });

  /* ---------- CTA ---------- */
  document.getElementById("ctaEmail").href = `mailto:${brand.contact.email}`;
  document.getElementById("ctaDiscord").href = brand.contact.discord;

  /* ---------- Footer ---------- */
  const footerCatalog = document.getElementById("footerCatalog");
  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#product-${p.productNumber}">${escapeHtml(
      p.name
    )}</a>`;
    footerCatalog.appendChild(li);
  });

  const footerDefi = document.getElementById("footerDefi");
  if (footerDefi && defi) {
    defi.products.forEach((d) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${d.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(
        d.label
      )}</a>`;
      footerDefi.appendChild(li);
    });
  }

  const footerSocial = document.getElementById("footerSocial");
  const socials = [
    {
      label: "YouTube",
      href: brand.contact.youtube,
      icon:
        '<svg viewBox="0 0 24 24"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4A3 3 0 0 0 23 16.5 31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.5zM10 15V9l5.2 3L10 15z"/></svg>'
    },
    {
      label: "Discord",
      href: brand.contact.discord,
      icon:
        '<svg viewBox="0 0 24 24"><path d="M20 4.5A17 17 0 0 0 15.7 3l-.2.4a12 12 0 0 1 3.7 1.8 13 13 0 0 0-14.4 0A12 12 0 0 1 8.5 3.4L8.3 3A17 17 0 0 0 4 4.5C1.5 8.4.8 12.2 1.1 15.9A17 17 0 0 0 6.2 18l1-1.4a10 10 0 0 1-1.8-.9l.4-.3a13 13 0 0 0 12.4 0l.4.3a10 10 0 0 1-1.8.9l1 1.4a17 17 0 0 0 5.1-2C23.3 11.6 22.2 7.8 20 4.5zM8.7 14.2c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.9.9 1.8 2-.8 2-1.8 2zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.9.9 1.8 2-.8 2-1.8 2z"/></svg>'
    },
    {
      label: "X",
      href: brand.contact.x,
      icon:
        '<svg viewBox="0 0 24 24"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.797l-5.32-6.54L4.8 22H1.54l8.03-9.17L1 2h6.91l4.8 6.02L18.244 2zm-1.194 18h1.88L7.05 4h-2L17.05 20z"/></svg>'
    },
    {
      label: "Email",
      href: `mailto:${brand.contact.email}`,
      icon:
        '<svg viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 8.5L20 7H4l8 5.5zM4 9v9h16V9l-8 5.5L4 9z"/></svg>'
    }
  ];
  socials.forEach((s) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${s.href}" ${
      s.href.startsWith("mailto:") ? "" : 'target="_blank" rel="noopener noreferrer"'
    }>${s.icon}<span>${s.label}</span></a>`;
    footerSocial.appendChild(li);
  });

  document.getElementById("footerYear").textContent = `© ${new Date().getFullYear()}`;

  /* ---------- Nav Build/Cart counts ---------- */
  function syncNavCounts() {
    if (!Commerce) return;
    const bc = document.getElementById("navBuildCount");
    const cc = document.getElementById("navCartCount");
    if (bc) {
      const n = Commerce.Build.count();
      bc.textContent = n;
      bc.parentElement.dataset.empty = n === 0 ? "true" : "false";
    }
    if (cc) {
      const n = Commerce.Cart.count();
      cc.textContent = n;
      cc.parentElement.dataset.empty = n === 0 ? "true" : "false";
    }
  }
  syncNavCounts();
  if (Commerce) {
    window.addEventListener(Commerce.CHANGE_EVENT, syncNavCounts);
    window.addEventListener("storage", syncNavCounts);
  }

  /* ---------- Modal ---------- */
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");

  function openModal(p) {
    const gallery = p.images
      .map(
        (src, i) =>
          `<img src="${src}" alt="${escapeAttr(p.name)} ${i + 1}" loading="lazy" />`
      )
      .join("");
    const bullets = p.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("");
    modalBody.innerHTML = `
      <div class="modal-gallery">${gallery}</div>
      <div class="modal-content">
        <div class="product-id">${escapeHtml(p.productNumber)}</div>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.buyerOutcome)}</p>
        <ul class="bullet-list">${bullets}</ul>
        <div class="pricing">${renderPrice(p.pricing)}</div>
        <div class="product-actions">
          <a class="btn btn-primary btn-sm" href="${p.demoUrl}" target="_blank" rel="noopener noreferrer">
            Open live demo <span class="btn-arrow">↗</span>
          </a>
          <a class="btn btn-ghost btn-sm" href="mailto:${brand.contact.email}?subject=${encodeURIComponent(
      p.name + " — " + p.productNumber
    )}">Contact studio</a>
        </div>
      </div>
    `;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  /* ---------- DeFi motif SVG placeholders ---------- */
  /* Temporary product visuals — replace with live screenshots when captured.
   * Each motif is a HUD-style abstract rendered in the cool DeFi accent palette.
   */
  function motifSvg(kind) {
    const c1 = "#7ff0d9"; // primary teal
    const c2 = "#4dff9a"; // studio green
    const c3 = "#5fb8ff"; // cool blue
    const dim = "#1a2a2a";
    const grid = `
      <defs>
        <linearGradient id="g-${kind}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="${c1}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
        </linearGradient>
        <filter id="f-${kind}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
      </defs>
    `;
    switch (kind) {
      case "chart":
        return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">${grid}
          <g stroke="${dim}" stroke-width="0.6">
            <line x1="0" y1="40" x2="320" y2="40"/>
            <line x1="0" y1="80" x2="320" y2="80"/>
            <line x1="0" y1="120" x2="320" y2="120"/>
            <line x1="0" y1="160" x2="320" y2="160"/>
          </g>
          <path d="M 0 140 L 40 120 L 70 130 L 110 90 L 150 100 L 190 70 L 230 80 L 270 50 L 320 60"
                fill="none" stroke="${c1}" stroke-width="1.4" filter="url(#f-chart)" opacity="0.6"/>
          <path d="M 0 140 L 40 120 L 70 130 L 110 90 L 150 100 L 190 70 L 230 80 L 270 50 L 320 60"
                fill="none" stroke="${c1}" stroke-width="1.4"/>
          <path d="M 0 140 L 40 120 L 70 130 L 110 90 L 150 100 L 190 70 L 230 80 L 270 50 L 320 60 L 320 200 L 0 200 Z"
                fill="url(#g-chart)"/>
          <g fill="${c2}">
            <rect x="60" y="110" width="6" height="22" opacity="0.6"/>
            <rect x="120" y="80" width="6" height="30" opacity="0.6"/>
            <rect x="180" y="65" width="6" height="24" opacity="0.6"/>
            <rect x="250" y="45" width="6" height="20" opacity="0.7"/>
          </g>
        </svg>`;
      case "swap":
        return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">${grid}
          <circle cx="100" cy="100" r="42" fill="none" stroke="${c1}" stroke-width="1.2" opacity="0.6"/>
          <circle cx="100" cy="100" r="28" fill="none" stroke="${c1}" stroke-width="1.2"/>
          <circle cx="220" cy="100" r="42" fill="none" stroke="${c2}" stroke-width="1.2" opacity="0.6"/>
          <circle cx="220" cy="100" r="28" fill="none" stroke="${c2}" stroke-width="1.2"/>
          <path d="M 140 80 Q 160 40 180 80" fill="none" stroke="${c1}" stroke-width="1.2"/>
          <polygon points="176,78 184,80 180,86" fill="${c1}"/>
          <path d="M 180 120 Q 160 160 140 120" fill="none" stroke="${c2}" stroke-width="1.2"/>
          <polygon points="144,122 136,120 140,114" fill="${c2}"/>
          <text x="100" y="105" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="${c1}">ETH</text>
          <text x="220" y="105" text-anchor="middle" font-family="JetBrains Mono" font-size="10" fill="${c2}">USDC</text>
        </svg>`;
      case "vault":
        return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">${grid}
          <g transform="translate(160 100)">
            <circle r="70" fill="none" stroke="${dim}" stroke-width="1"/>
            <circle r="55" fill="none" stroke="${c1}" stroke-width="0.8" opacity="0.4"/>
            <circle r="40" fill="none" stroke="${c1}" stroke-width="1"/>
            <circle r="28" fill="none" stroke="${c2}" stroke-width="0.8" opacity="0.6"/>
            <circle r="14" fill="${c1}" opacity="0.15"/>
            <circle r="4" fill="${c1}"/>
            <g stroke="${c1}" stroke-width="1" stroke-linecap="round">
              <line x1="0" y1="-70" x2="0" y2="-58"/>
              <line x1="70" y1="0" x2="58" y2="0"/>
              <line x1="0" y1="70" x2="0" y2="58"/>
              <line x1="-70" y1="0" x2="-58" y2="0"/>
            </g>
            <path d="M 0 -40 A 40 40 0 0 1 28 28" fill="none" stroke="${c2}" stroke-width="1.6" stroke-linecap="round"/>
          </g>
          <text x="160" y="176" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="${c1}" letter-spacing="2">ALLOC · 68%</text>
        </svg>`;
      case "bridge":
        return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">${grid}
          <g stroke="${c1}" stroke-width="1">
            <circle cx="60" cy="100" r="22" fill="none"/>
            <circle cx="60" cy="100" r="4" fill="${c1}"/>
            <circle cx="260" cy="100" r="22" fill="none" stroke="${c2}"/>
            <circle cx="260" cy="100" r="4" fill="${c2}"/>
          </g>
          <path d="M 82 100 Q 160 40 238 100" fill="none" stroke="${c1}" stroke-width="1.4"/>
          <path d="M 82 100 Q 160 160 238 100" fill="none" stroke="${c2}" stroke-width="1.4" opacity="0.6"/>
          <g fill="${c1}">
            <circle cx="120" cy="72" r="2"/>
            <circle cx="160" cy="60" r="2.5"/>
            <circle cx="200" cy="72" r="2"/>
          </g>
          <text x="60" y="146" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="${c1}" letter-spacing="2">CHAIN A</text>
          <text x="260" y="146" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="${c2}" letter-spacing="2">CHAIN B</text>
        </svg>`;
      case "nodes":
        return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">${grid}
          <g stroke="${c1}" stroke-width="0.8" opacity="0.4">
            <line x1="80" y1="60" x2="160" y2="100"/>
            <line x1="80" y1="60" x2="160" y2="40"/>
            <line x1="240" y1="60" x2="160" y2="100"/>
            <line x1="240" y1="60" x2="160" y2="40"/>
            <line x1="160" y1="100" x2="80" y2="140"/>
            <line x1="160" y1="100" x2="240" y2="140"/>
            <line x1="80" y1="140" x2="160" y2="160"/>
            <line x1="240" y1="140" x2="160" y2="160"/>
          </g>
          <g fill="${c1}">
            <circle cx="80" cy="60" r="5"/>
            <circle cx="240" cy="60" r="5"/>
            <circle cx="80" cy="140" r="5"/>
            <circle cx="240" cy="140" r="5"/>
            <circle cx="160" cy="40" r="4"/>
            <circle cx="160" cy="160" r="4"/>
          </g>
          <circle cx="160" cy="100" r="10" fill="${c2}" opacity="0.2"/>
          <circle cx="160" cy="100" r="5" fill="${c2}"/>
        </svg>`;
      case "points":
        return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">${grid}
          <g stroke="${dim}" stroke-width="0.6">
            <line x1="40" y1="150" x2="280" y2="150"/>
          </g>
          <g fill="${c1}">
            <circle cx="60" cy="150" r="3"/>
            <circle cx="100" cy="140" r="3"/>
            <circle cx="140" cy="125" r="3.5"/>
            <circle cx="180" cy="105" r="4"/>
            <circle cx="220" cy="80" r="4.5"/>
            <circle cx="260" cy="55" r="5"/>
          </g>
          <path d="M 60 150 L 100 140 L 140 125 L 180 105 L 220 80 L 260 55"
                fill="none" stroke="${c1}" stroke-width="1.4"/>
          <path d="M 60 150 L 100 140 L 140 125 L 180 105 L 220 80 L 260 55 L 260 150 Z"
                fill="url(#g-points)"/>
          <g fill="${c2}" opacity="0.9">
            <circle cx="260" cy="55" r="8" opacity="0.2"/>
          </g>
          <text x="40" y="178" font-family="JetBrains Mono" font-size="9" fill="${c1}" letter-spacing="2">LVL · 06</text>
          <text x="280" y="178" text-anchor="end" font-family="JetBrains Mono" font-size="9" fill="${c2}" letter-spacing="2">+1240 PTS</text>
        </svg>`;
      default:
        return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">${grid}
          <rect x="20" y="20" width="280" height="160" fill="none" stroke="${c1}" stroke-width="1" opacity="0.3"/>
          <text x="160" y="108" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="${c1}" letter-spacing="4">XYZ // ONCHAIN</text>
        </svg>`;
    }
  }

  /* ---------- Helpers ---------- */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }
})();
