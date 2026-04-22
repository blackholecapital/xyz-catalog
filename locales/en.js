/* XYZ Labs — English locale dictionary.
 * Shell / global UI strings only. Product descriptions, marketing paragraphs,
 * modal body copy, and promo text stay in their source-of-truth files.
 * Brand terms (XYZ Labs, PayMe, SKUs, URLs, product names) are never translated.
 */
(function () {
  window.XYZ_LOCALES = window.XYZ_LOCALES || {};
  window.XYZ_LOCALES.en = {
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
      contact: "Contact"
    },
    common: {
      top: "Top",
      payNow: "Pay now",
      backToCart: "Back to cart",
      emailStudio: "Email studio instead",
      browseCatalog: "Browse catalog",
      creatingCheckout: "Creating checkout…",
      checkoutError:
        "Unable to start checkout. Please try again or email studio."
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
      continueToCheckout: "Continue to Checkout",
      emailThisBuild: "Email this build"
    },
    footer: {
      catalog: "Catalog",
      web3: "Web3 / DeFi",
      connect: "Connect",
      tagline: "Systems, tools, and digital infrastructure by XYZ Labs.",
      madeIn: "XYZ Labs — made in USA.",
      madeInStudio: "XYZ Labs — Made in studio."
    }
  };
})();
