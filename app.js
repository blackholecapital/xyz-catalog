/* XYZ Labs catalog renderer.
 * Expects window.XYZ_LABS (products.js) to be loaded first.
 */
(function () {
  const data = window.XYZ_LABS;
  if (!data) return;

  const { brand, products } = data;

  /* ---------- Hero ---------- */
  document.getElementById("heroEyebrow").textContent = brand.hero.eyebrow;
  document.getElementById("heroTitle").textContent = brand.hero.title;
  document.getElementById("heroSubtitle").textContent = brand.hero.subtitle;
  document.getElementById(
    "heroMeta"
  ).textContent = `${products.length} live systems • shipped by ${brand.name}`;

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
          <a class="btn btn-primary btn-sm" href="${p.demoUrl}" target="_blank" rel="noopener noreferrer">
            Live demo
            <span class="btn-arrow">↗</span>
          </a>
          <button class="btn btn-ghost btn-sm" data-learn-more>Learn more</button>
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

  /* ---------- Live band ---------- */
  const liveGrid = document.getElementById("liveGrid");
  products.forEach((p) => {
    const a = document.createElement("a");
    a.className = "live-card";
    a.href = p.demoUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = `
      <div class="live-card-head">
        <span><span class="live-dot"></span>Live</span>
        <span>${escapeHtml(p.productNumber)}</span>
      </div>
      <div>
        <div class="live-card-name">${escapeHtml(p.name)}</div>
      </div>
      <div class="live-card-url">${escapeHtml(
        p.demoUrl.replace(/^https?:\/\//, "")
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
