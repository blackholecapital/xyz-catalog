#!/usr/bin/env bash
set -e

PROJECT_DIR="xyz-labs-showroom"

mkdir -p "$PROJECT_DIR/assets"
cd "$PROJECT_DIR"

cat > index.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>XYZ Labs | Showroom</title>
  <link rel="stylesheet" href="./styles.css" />
</head>
<body>
  <div class="wrap">
    <header class="hero">
      <div class="brand-row">
        <div class="brand">
          <span class="dot"></span>
          <span id="siteTitle">XYZ Labs</span>
        </div>
        <div class="status" id="siteStatus">Live systems directory</div>
      </div>

      <h1 id="heroTitle"></h1>
      <p id="heroSubtitle" class="subtitle"></p>

      <div id="heroButtons" class="hero-buttons"></div>
    </header>

    <main id="sections" class="sections"></main>

    <footer class="footer">
      <span id="footerText">XYZ Labs modular systems showroom</span>
    </footer>
  </div>

  <script src="./content.js"></script>
  <script src="./app.js"></script>
</body>
</html>
EOF

cat > content.js <<'EOF'
window.SHOWROOM_CONTENT = {
  siteTitle: "XYZ Labs",
  siteStatus: "Live systems directory",
  heroTitle: "Component showroom for business tools, payments, referrals, quests, airdrops, and Web3 systems.",
  heroSubtitle: "A clean one-page launchpad for demos, internal reviews, client walkthroughs, and fast portfolio sends.",
  footerText: "XYZ Labs • modular systems showroom",

  heroButtons: [
    { label: "Open Gateway", url: "https://gateway.xyz-labs.xyz/" },
    { label: "Open Studio", url: "https://studio.xyz-labs.xyz/" },
    { label: "Open GotNodes", url: "https://gotnodes.xyz/" }
  ],

  sections: [
    {
      title: "Business Tools",
      tag: "B2B Stack",
      description: "Operational tools for lead capture, payments, referrals, loyalty loops, quests, and page deployment.",
      items: [
        {
          title: "Studio",
          url: "https://studio.xyz-labs.xyz/",
          image: "./assets/studio.jpg",
          description: "Main builder and demo environment."
        },
        {
          title: "PayMe",
          url: "https://payme.xyz-labs.xyz/",
          image: "./assets/payme.jpg",
          description: "Payments and access flow demo."
        },
        {
          title: "Payments",
          url: "https://payments.xyz-labs.xyz/",
          image: "./assets/payments.jpg",
          description: "Payment handling surface."
        },
        {
          title: "Gateway",
          url: "https://gateway.xyz-labs.xyz/",
          image: "./assets/gateway.jpg",
          description: "Rapid launch and page system."
        }
      ]
    },
    {
      title: "Growth Systems",
      tag: "Engagement",
      description: "Referral mechanics, points, quests, and admin layers.",
      items: [
        {
          title: "Points Admin",
          url: "https://points.xyz-labs.xyz/admin",
          image: "./assets/points.jpg",
          description: "Admin layer for points system."
        },
        {
          title: "Referrals",
          url: "https://refferals-xyz-it-in-a-cloud-flair-pages.labs.pages.dev/",
          image: "./assets/referrals.jpg",
          description: "Referral tracking and user flow."
        },
        {
          title: "EngageFi Quests",
          url: "https://engagefi-xyz-labs.pages.dev/quests",
          image: "./assets/quests.jpg",
          description: "Quest and task flow."
        },
        {
          title: "Airdrop",
          url: "https://airdrop.xyz-labs.xyz/",
          image: "./assets/airdrop.jpg",
          description: "Airdrop campaign surface."
        }
      ]
    },
    {
      title: "Infrastructure + Web3",
      tag: "Utility Layer",
      description: "Utility surfaces and support infrastructure.",
      items: [
        {
          title: "GotNodes",
          url: "https://gotnodes.xyz/",
          image: "./assets/gotnodes.jpg",
          description: "Node and utility platform."
        }
      ]
    }
  ]
};
EOF

cat > app.js <<'EOF'
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
EOF

cat > styles.css <<'EOF'
:root {
  --bg: #07110c;
  --panel: rgba(8, 23, 16, 0.88);
  --panel2: rgba(10, 28, 19, 0.94);
  --line: rgba(77, 255, 154, 0.18);
  --line2: rgba(77, 255, 154, 0.38);
  --text: #ecfff5;
  --muted: #9cb8a7;
  --accent: #4dff9a;
  --shadow: 0 20px 40px rgba(0,0,0,.35);
  --radius: 22px;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background:
    radial-gradient(circle at top left, rgba(77,255,154,.08), transparent 28%),
    linear-gradient(180deg, #08120d 0%, #040806 100%);
  color: var(--text);
}
.wrap {
  width: min(1180px, calc(100% - 24px));
  margin: 0 auto;
  padding: 24px 0 48px;
}
.hero, .section-card, .footer {
  background: linear-gradient(180deg, var(--panel2), var(--panel));
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  border-radius: 28px;
}
.hero {
  padding: 28px;
  margin-bottom: 18px;
}
.brand-row, .section-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: start;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 16px rgba(77,255,154,.8);
}
.status, .tag, .pill {
  border: 1px solid var(--line2);
  border-radius: 999px;
  background: rgba(9, 22, 16, .75);
}
.status, .tag {
  padding: 8px 12px;
  color: var(--muted);
  font-size: 12px;
}
h1 {
  font-size: clamp(34px, 6vw, 58px);
  line-height: .95;
  letter-spacing: -.04em;
  margin: 18px 0 10px;
  max-width: 850px;
}
.subtitle {
  color: var(--muted);
  max-width: 760px;
  line-height: 1.55;
  margin-bottom: 0;
}
.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}
.pill {
  color: var(--text);
  text-decoration: none;
  padding: 10px 14px;
  font-weight: 600;
}
.sections {
  display: grid;
  gap: 16px;
}
.section-card {
  padding: 22px;
}
.eyebrow {
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: .14em;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 10px;
}
.section-head h2 {
  margin: 0;
  max-width: 760px;
  font-size: clamp(22px, 3vw, 30px);
  line-height: 1.1;
  letter-spacing: -.03em;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 14px;
  margin-top: 18px;
}
.tool-card {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 14px;
  text-decoration: none;
  color: var(--text);
  background: rgba(9, 21, 15, .78);
  border: 1px solid var(--line);
  border-radius: 20px;
  overflow: hidden;
  transition: transform .16s ease, border-color .16s ease, background .16s ease;
}
.tool-card:hover {
  transform: translateY(-2px);
  border-color: var(--line2);
  background: rgba(12, 27, 19, .9);
}
.thumb {
  width: 100%;
  height: 100%;
  min-height: 120px;
  object-fit: cover;
  background: rgba(255,255,255,.03);
}
.card-body {
  padding: 14px 14px 14px 0;
}
.card-title-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: start;
}
.card-title-row h3 {
  margin: 0;
  font-size: 18px;
}
.arrow {
  color: var(--accent);
  font-size: 18px;
  flex-shrink: 0;
}
.card-body p {
  color: var(--muted);
  margin: 8px 0 10px;
  line-height: 1.5;
}
.url {
  font-size: 13px;
  color: var(--muted);
  word-break: break-all;
}
.footer {
  margin-top: 16px;
  padding: 16px 20px;
  color: var(--muted);
}
@media (max-width: 900px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .wrap {
    width: min(100% - 18px, 1180px);
    padding-top: 18px;
  }
  .hero, .section-card {
    padding: 18px;
  }
  .brand-row, .section-head {
    flex-direction: column;
  }
  .tool-card {
    grid-template-columns: 1fr;
  }
  .card-body {
    padding: 0 14px 14px;
  }
}
EOF

cat > push.sh <<'EOF'
#!/usr/bin/env bash
set -e

MSG="${1:-update showroom}"

git add .
git commit -m "$MSG" || echo "Nothing to commit"
git push
EOF

chmod +x push.sh

if [ ! -d .git ]; then
  git init
fi

echo "Scaffold created in $PROJECT_DIR"
echo "Edit content.js to change text, links, sections, and image paths."
echo "Drop images into /assets."
