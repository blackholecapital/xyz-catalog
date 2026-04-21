const data = window.SHOWROOM_CONTENT;

document.getElementById("siteTitle").textContent = data.siteTitle;
document.getElementById("siteStatus").textContent = data.siteStatus;
document.getElementById("heroTitle").textContent = data.heroTitle;
document.getElementById("heroSubtitle").textContent = data.heroSubtitle;
document.getElementById("footerText").textContent = data.footerText;

const heroButtons = document.getElementById("heroButtons");
data.heroButtons.forEach(btn => {
  const a = document.createElement("a");
  a.className = "pill";
  a.href = btn.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = btn.label;
  heroButtons.appendChild(a);
});

const sectionsEl = document.getElementById("sections");

data.sections.forEach(section => {
  const sectionCard = document.createElement("section");
  sectionCard.className = "section-card";

  sectionCard.innerHTML = `
    <div class="section-head">
      <div>
        <div class="eyebrow">${section.title}</div>
        <h2>${section.description}</h2>
      </div>
      <div class="tag">${section.tag}</div>
    </div>
    <div class="card-grid"></div>
  `;

  const grid = sectionCard.querySelector(".card-grid");

  section.items.forEach(item => {
    const card = document.createElement("a");
    card.className = "tool-card";
    card.href = item.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    const imgHtml = item.image
      ? `<img src="${item.image}" alt="${item.title}" class="thumb" onerror="this.style.display='none'" />`
      : "";

    card.innerHTML = `
      ${imgHtml}
      <div class="card-body">
        <div class="card-title-row">
          <h3>${item.title}</h3>
          <span class="arrow">↗</span>
        </div>
        <p>${item.description || ""}</p>
        <div class="url">${item.url}</div>
      </div>
    `;

    grid.appendChild(card);
  });

  sectionsEl.appendChild(sectionCard);
});