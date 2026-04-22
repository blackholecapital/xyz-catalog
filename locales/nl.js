/* XYZ Labs — Dutch (nl) locale dictionary.
 * Shell / global UI only. Missing keys fall back to English automatically via
 * the i18n runtime (see i18n.js).
 * Brand terms (XYZ Labs, PayMe, SKUs, URLs, product names) are never translated.
 */
(function () {
  window.XYZ_LOCALES = window.XYZ_LOCALES || {};
  window.XYZ_LOCALES.nl = {
    nav: {
      catalog: "Catalogus",
      web3: "Web3 / DeFi",
      live: "Live demo's",
      inProduction: "In productie",
      contact: "Contact",
      build: "Build",
      cart: "Winkelwagen",
      themeNight: "Nacht",
      themeDay: "Dag",
      themeToggleLabel: "Dag/nacht-thema wisselen"
    },
    hero: {
      viewCatalog: "Bekijk catalogus",
      exploreLiveDemos: "Bekijk live demo's",
      contact: "Contact"
    },
    common: {
      top: "Top",
      payNow: "Nu betalen",
      backToCart: "Terug naar winkelwagen",
      emailStudio: "E-mail de studio",
      browseCatalog: "Bekijk catalogus",
      creatingCheckout: "Afrekenen starten…",
      checkoutError:
        "Kan afrekenen niet starten. Probeer het opnieuw of e-mail de studio."
    },
    payment: {
      method: "Betaalmethode",
      card: "Kaart",
      cardSub: "Visa · Mastercard · Amex — via Stripe",
      wallet: "Apple Pay / Google Pay",
      walletSub: "Express wallet-betaling",
      usdc: "USDC · Base",
      usdcSub: "Onchain-afhandeling",
      web3Wallet: "Web3 / Wallet",
      soon: "Binnenkort",
      poweredBy: "Mogelijk gemaakt door PayMe",
      paymeTitle: "PayMe Afrekenen",
      paymeSub: "Veilig · Stripe · USDC"
    },
    cart: {
      eyebrow: "Je winkelwagen",
      title: "Controleer en reken af.",
      subtitle:
        "Eenmalige installatie plus maandelijks terugkerend. Afrekenen verloopt via de bestaande PayMe / Stripe-overdracht — je wordt doorgestuurd om de betaling af te ronden.",
      items: "Items",
      setupSubtotal: "Installatie-subtotaal",
      monthlyRecurring: "Maandelijks terugkerend",
      dueToday: "Vandaag te betalen",
      monthlyNote:
        "Maandelijkse verlenging wordt na de eerste betaling in rekening gebracht.",
      emptyTitle: "Je winkelwagen is leeg.",
      emptySub:
        "Voeg een product toe of gebruik Nu Kopen om je winkelwagen te vullen."
    },
    build: {
      eyebrow: "Jouw Build",
      title: "Stel je stack samen.",
      subtitle:
        "Bewaar systemen die je wilt inzetten. Bekijk prijzen, pas aan of verplaats ze naar afrekenen wanneer je er klaar voor bent.",
      emptyTitle: "Je Build is leeg.",
      emptySub:
        "Voeg systemen uit de catalogus toe om je shortlist samen te stellen.",
      customizeIt: "Pas aan",
      customBuild: "Custom Build",
      clearList: "Lijst wissen",
      continueToCheckout: "Doorgaan naar afrekenen",
      emailThisBuild: "E-mail deze build"
    },
    footer: {
      catalog: "Catalogus",
      web3: "Web3 / DeFi",
      connect: "Contact",
      tagline: "Systemen, tools en digitale infrastructuur door XYZ Labs.",
      madeIn: "XYZ Labs — gemaakt in de VS.",
      madeInStudio: "XYZ Labs — gemaakt in de studio."
    }
  };
})();
