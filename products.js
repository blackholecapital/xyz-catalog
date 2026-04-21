/* Canonical product data for XYZ Labs catalog.
 * Sourced from product_source_of_truth.json. Images resolve from /public.
 * Edit here to update the catalog.
 */
window.XYZ_LABS = {
  brand: {
    name: "XYZ Labs",
    tagline: "Systems, tools, and digital infrastructure",
    hero: {
      eyebrow: "XYZ Labs — Product Catalog 2026",
      title: "Live systems for modern businesses.",
      subtitle:
        "A working catalog of deployed products from XYZ Labs — storefronts, checkout, messaging, and launch surfaces you can try in the browser right now.",
      featuredImages: [
        "/Studio1.png",
        "/Gateway2.png",
        "/paymepro3.png",
        "/sho1.png"
      ]
    },
    contact: {
      email: "info@blackholecapital.xyz",
      youtube: "https://www.youtube.com/@xyz-Labs-xyz",
      discord: "https://discord.com/invite/NyYT6YNWZJ",
      x: "https://x.com/Mktmakerxyz"
    }
  },

  products: [
    {
      name: "Studio",
      productNumber: "xyz.0444",
      oneLinePromise: "Design and deploy polished business pages fast.",
      buyerOutcome:
        "Go from idea to live page in minutes with drag-and-drop tools.",
      demoUrl: "https://studio.xyz-labs.xyz/",
      badge: "Builder",
      images: [
        "/public/Studio1.png",
        "/public/Studio2.png",
        "/public/Studio3.png",
        "/public/Studio4.png",
        "/public/Studio5.png",
        "/public/Studio6.png"
      ],
      bullets: [
        "Drag-and-drop page builder with real-time preview",
        "Polished launch surfaces for any product or service",
        "Branded page templates with custom fonts and colors",
        "One-click deploy to your own domain",
        "Mobile-responsive output by default"
      ],
      pricing: { setup: 199, monthly: 20 }
    },
    {
      name: "Gateway",
      productNumber: "xyz.0445",
      oneLinePromise: "Your web business front end, ready to run.",
      buyerOutcome:
        "Launch a complete storefront with checkout and customer tools built in.",
      demoUrl: "https://gateway.xyz-labs.xyz/",
      badge: "Storefront",
      images: [
        "/public/Gateway1.png",
        "/public/Gateway2.png",
        "/public/Gateway3.png",
        "/public/Gateway4.png",
        "/public/Gateway5.png",
        "/public/Gateway6.png",
        "/public/Gateway7.png"
      ],
      bullets: [
        "Integrated checkout and payment processing",
        "Built-in customer service area with ticket routing",
        "Business-in-a-box setup with guided onboarding",
        "Upgrade-ready customer flows for subscriptions and upsells"
      ],
      pricing: { setup: 999, monthly: 20 }
    },
    {
      name: "Connect",
      productNumber: "xyz.0446",
      oneLinePromise: "Customer access and connection tools.",
      buyerOutcome: "Grow and engage your audience from one branded hub.",
      demoUrl: "https://connect.xyz-labs.xyz/",
      badge: "Audience",
      images: [
        "/public/connect1.png",
        "/public/connect2.png",
        "/public/connect3.png",
        "/public/connect4.png",
        "/public/connect6.png"
      ],
      bullets: [
        "Community touchpoints across web, mobile, and social",
        "Branded interaction surfaces with your look and feel",
        "Built-in audience growth tools and referral tracking",
        "Social presentation layer for content and announcements"
      ],
      pricing: { setup: 99, monthly: 10 }
    },
    {
      name: "PayMe Pro",
      productNumber: "xyz.0447",
      oneLinePromise: "Payment requests, billing, and checkout tools.",
      buyerOutcome:
        "Sell more with flexible checkout, coupons, and customer insights.",
      demoUrl: "https://payme.xyz-labs.xyz/",
      badge: "Payments",
      images: [
        "/public/paymepro1.png",
        "/public/paymepro2.png",
        "/public/paymepro3.png",
        "/public/paymepro4.png",
        "/public/paymepro5.png",
        "/public/paymepro6.png"
      ],
      bullets: [
        "Flexible selling with one-time and recurring checkout flows",
        "Coupon codes and promotional pricing built in",
        "Streamlined checkout with saved payment methods",
        "Light CRM with customer profiles and purchase history"
      ],
      pricing: { setup: 199, monthly: 10 }
    },
    {
      name: "Message Track",
      productNumber: "xyz.0448",
      oneLinePromise: "Real-time message tracking for client-facing updates.",
      buyerOutcome:
        "Keep clients in the loop with a lightweight, always-current status surface.",
      demoUrl: "https://message-track.xyz-labs.xyz/",
      badge: "Comms",
      images: [
        "/public/mt1.png",
        "/public/mt2.png",
        "/public/mt3.png",
        "/public/mt4.png",
        "/public/mt5.png"
      ],
      bullets: [
        "Real-time message tracking surface",
        "Lightweight client-facing status page",
        "Built for fast updates and clean UI"
      ],
      pricing: { setup: 199, monthly: 20 }
    },
    {
      name: "Showroom",
      productNumber: "xyz.0449",
      oneLinePromise:
        "Premium product placement landing page with 3D showroom feel.",
      buyerOutcome:
        "Launch a high-end micro-sales surface with built-in checkout and admin.",
      demoUrl: "https://showroom.xyz-labs.xyz/",
      badge: "Landing",
      images: ["/public/sho1.png", "/public/Sho2.png", "/public/Sho3.png"],
      bullets: [
        "Premium product placement landing page with 3D depth",
        "Product tiles and PayMe checkout built in",
        "Admin page plus multiple payment options",
        "Micro-sales system optimized for premium offers"
      ],
      pricing: { setup: 199, monthly: 20 }
    },
    {
      name: "Gallery",
      productNumber: "xyz.0450",
      oneLinePromise:
        "Premium product placement landing page with gallery-style presentation.",
      buyerOutcome:
        "Showcase premium product drops in a curated, gallery-style launch surface.",
      demoUrl: "https://gallery.xyz-labs.xyz/browse",
      badge: "Landing",
      images: ["/public/gal1.png", "/public/gal2.png", "/public/gal3.png"],
      bullets: [
        "Premium product placement landing page with gallery-style presentation",
        "Product tiles and PayMe checkout built in",
        "Admin page plus multiple payment options",
        "Micro-sales system for premium product drops"
      ],
      pricing: { setup: 199, monthly: 20 }
    },
    {
      name: "Biz Pages",
      productNumber: "xyz.0451",
      oneLinePromise: "Business pages system with Gateway-style layout.",
      buyerOutcome:
        "Run services or products with three customizable pages plus a customer area.",
      demoUrl: "https://bizpages.xyz-labs.xyz/home",
      badge: "Business",
      images: ["/public/Biz1.png", "/public/Biz2.png", "/public/biz3.png"],
      bullets: [
        "Gateway-style layout without the Web3 interface",
        "Three customizable pages plus a customer area",
        "PayMe Pro light CRM features included",
        "Built for services and products with admin plus customer flow"
      ],
      pricing: { setup: 599, monthly: 20 }
    },
    {
      name: "Stickers",
      productNumber: "xyz.0452",
      oneLinePromise:
        "Customizable stickers app for schools, groups, and clubs.",
      buyerOutcome:
        "Run a fun, guided sticker customization flow built for easy sharing.",
      demoUrl: "https://stickers.xyz-labs.xyz/",
      badge: "Social",
      images: ["/public/stick1.png", "/public/Stick2.png", "/public/Stick3.png"],
      bullets: [
        "Customizable stickers app and game for schools, groups, or clubs",
        "Simple guided customization flow",
        "Designed for fun engagement and easy sharing"
      ],
      pricing: { setup: 199, monthly: 10 }
    }
  ]
};
