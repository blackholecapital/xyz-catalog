/* XYZ Labs — English locale dictionary.
 * Brand terms (XYZ Labs, PayMe, SKUs, URLs, product names) are never
 * translated. Product description / bullet / outcome strings live in
 * products.js as the source of truth; they appear here only to pin English
 * fallbacks for keys also present in nl.js.
 */
(function () {
  window.XYZ_LOCALES = window.XYZ_LOCALES || {};
  window.XYZ_LOCALES.en = {
    meta: {
      indexTitle: "XYZ Labs — Live Systems for Modern Businesses",
      indexDescription:
        "XYZ Labs — premium digital systems, already deployed. Storefronts, checkout, messaging, and onchain execution.",
      cartTitle: "XYZ Labs — Cart & Checkout",
      cartDescription:
        "Review your XYZ Labs build and check out securely via PayMe — Stripe and USDC supported.",
      buildTitle: "XYZ Labs — Your Build",
      buildDescription:
        "Shortlist XYZ Labs systems, review pricing, and move them to checkout when ready."
    },
    nav: {
      catalog: "Catalog",
      web3: "Web3 / DeFi",
      live: "Live Demos",
      inProduction: "In Production",
      contact: "Contact",
      build: "Build",
      cart: "Cart",
      themeNight: "Night",
      themeDay: "Day",
      themeToggleLabel: "Toggle day/night theme"
    },
    hero: {
      viewCatalog: "View catalog",
      exploreLiveDemos: "Explore live demos",
      contact: "Contact",
      shippedBy: "Live systems shipped by XYZ Labs"
    },
    common: {
      top: "Top",
      payNow: "Pay now",
      backToCart: "Back to cart",
      emailStudio: "Email studio instead",
      browseCatalog: "Browse catalog",
      creatingCheckout: "Creating checkout…",
      checkoutError:
        "Unable to start checkout. Please try again or email studio.",
      learnMore: "Learn more",
      moreDetail: "More detail",
      showLess: "Show less",
      buyItNow: "Buy It Now",
      addToBuild: "Add to Build",
      inBuild: "In Build",
      addedToBuild: "Added to Build ✓",
      alreadyInBuild: "Already in Build",
      liveDemo: "Live demo",
      open: "Open",
      openLiveDemo: "Open live demo",
      openLiveBuild: "Open live build",
      contactStudio: "Contact studio",
      visitDocs: "Visit mktmaker.xyz",
      filterAll: "All",
      labelSetup: "Setup",
      labelMonthly: "Monthly",
      monthSuffix: "/mo",
      currencySymbol: "$",
      currencyCode: "en-US",
      currencySeparator: "",
      categoryCatalog: "Catalog",
      categoryWeb3: "Web3",
      skuPrefix: "SKU",
      removeAria: "Remove",
      decreaseAria: "Decrease",
      increaseAria: "Increase",
      imageAria: "Image",
      previewAria: "Preview",
      closeAria: "Close",
      walletComingSoon: "Web3 wallet — coming soon"
    },
    payment: {
      method: "Payment method",
      card: "Card",
      cardSub: "Visa · Mastercard · Amex — via Stripe",
      wallet: "Apple Pay / Google Pay",
      walletSub: "Express wallet checkout",
      usdc: "USDC · Base",
      usdcSub: "Onchain settlement",
      web3Wallet: "Web3 / Wallet",
      soon: "Soon",
      poweredBy: "Powered by PayMe",
      paymeTitle: "PayMe Checkout",
      paymeSub: "Secure · Stripe · USDC"
    },
    cart: {
      eyebrow: "Your Cart",
      title: "Review and check out.",
      subtitle:
        "One-time setup plus monthly recurring. Checkout runs through the existing PayMe / Stripe handoff — you will be redirected to complete payment.",
      items: "Items",
      setupSubtotal: "Setup subtotal",
      monthlyRecurring: "Monthly recurring",
      dueToday: "Due today",
      monthlyNote: "Monthly renewal billed after first charge.",
      emptyTitle: "Your cart is empty.",
      emptySub: "Add a product or use Buy It Now to populate your cart."
    },
    build: {
      eyebrow: "Your Build",
      title: "Shortlist your stack.",
      subtitle:
        "Save systems you want to deploy. Review pricing, customize, or move them to checkout whenever you're ready.",
      emptyTitle: "Your Build is empty.",
      emptySub: "Add systems from the catalog to create your shortlist.",
      customizeIt: "Customize It",
      customBuild: "Custom Build",
      clearList: "Clear list",
      clearConfirm: "Clear your Build list?",
      continueToCheckout: "Continue to Checkout",
      emailThisBuild: "Email this build",
      mailtoBuildSubject: "Build inquiry",
      mailtoCustomSubject: "Custom build inquiry",
      mailtoCartSubject: "Cart checkout inquiry",
      mailtoIntro: "Hi XYZ Labs,",
      mailtoBody: "I'd like to finalize the following:",
      mailtoOutro: "Thanks."
    },
    promo: {
      offSuffix: "OFF",
      usdcBonus: "+10% USDC"
    },
    footer: {
      catalog: "Catalog",
      web3: "Web3 / DeFi",
      connect: "Connect",
      tagline: "Systems, tools, and digital infrastructure by XYZ Labs.",
      madeIn: "XYZ Labs — made in USA.",
      madeInStudio: "XYZ Labs — Made in studio.",
      socialYouTube: "YouTube",
      socialDiscord: "Discord",
      socialX: "X",
      socialEmail: "Email"
    },
    sections: {
      statementTag: "What we build",
      statementHeadPre: "Front ends, checkout, and operating surfaces —",
      statementHeadHl: "productized",
      statementHeadPost: "and ready to deploy.",
      statementBody:
        "Every item below is a live system in production. Open the deployed demo, expand for capability detail, or request white-glove setup.",
      catalogEyebrow: "The studio catalog",
      catalogTitle: "Live products from XYZ Labs.",
      liveEyebrow: "Deployed",
      liveTitle: "Every surface is online.",
      liveBody:
        "Studio catalog and onchain systems — one ecosystem, one lab. Every tile opens a working environment.",
      productionEyebrow: "In production",
      productionTitle: "Currently in production.",
      productionBody:
        "Alley AI — an always-on executive assistant deployed live during development. Call answering and screening, appointment scheduling and booking, email drafting and replies, message reminders and follow-ups, voice notes and voice commands, calendar integration, Telegram and SMS, and auto status updates — ad-lib anything a great EA does, on call 24/7.",
      productionStatus: "Live · build in progress",
      productionSoon: "Coming soon",
      productionFollow: "White-glove rollout to follow",
      ctaEyebrow: "Work with XYZ Labs",
      ctaTitle: "Bring a system to market.",
      ctaBody:
        "Pick a product off the shelf or commission something new. Everything above is a reference implementation you can white-label today.",
      ctaEmailStudio: "Email the studio",
      ctaJoinDiscord: "Join Discord"
    },
    brand: {
      hero: {
        eyebrow: "XYZ Labs — Studio Catalog",
        title: "Live systems for modern businesses.",
        subtitle:
          "Storefronts, checkout, messaging, and launch surfaces — premium digital systems, already deployed.",
        status: "Studio // Active"
      }
    },
    defi: {
      eyebrow: "Web3 / DeFi",
      title: "Onchain execution surfaces.",
      subtitle:
        "Execution surfaces, swap flows, vault tooling, bridge access, and automated market systems.",
      products: {}
    },
    products: {},
    alley: {
      name: "Alley AI",
      productNumber: "ALLEY · IN PRODUCTION",
      badge: "Live · build in progress",
      tagline:
        "An always-on AI executive assistant — live, deployed during development.",
      features: [
        "Call answering and screening with intelligent routing",
        "Appointment scheduling and booking across your calendar",
        "Email drafting, triage, and auto-responses",
        "Message reminders and proactive follow-ups",
        "Voice notes and voice command integration",
        "Calendar integration (Google, Outlook, iCloud)",
        "Telegram, SMS, and chat-first conversations",
        "Meeting prep briefs and post-meeting summaries",
        "Travel, reservations, and logistics coordination",
        "Auto status updates and daily executive digests"
      ]
    }
  };
})();
