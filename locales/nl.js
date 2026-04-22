/* XYZ Labs — Dutch (nl) locale dictionary.
 * Brand terms (XYZ Labs, PayMe, SKUs, URLs, product names like Studio /
 * Gateway / MktMaker, etc.) are deliberately preserved in Dutch text.
 * Missing keys fall back to English automatically via the i18n runtime.
 */
(function () {
  window.XYZ_LOCALES = window.XYZ_LOCALES || {};
  window.XYZ_LOCALES.nl = {
    meta: {
      indexTitle: "XYZ Labs — Live systemen voor moderne bedrijven",
      indexDescription:
        "XYZ Labs — premium digitale systemen, al ingezet. Storefronts, afrekenen, berichten en onchain-uitvoering.",
      cartTitle: "XYZ Labs — Winkelwagen & Afrekenen",
      cartDescription:
        "Bekijk je XYZ Labs-build en reken veilig af via PayMe — Stripe en USDC ondersteund.",
      buildTitle: "XYZ Labs — Jouw Build",
      buildDescription:
        "Stel je shortlist van XYZ Labs-systemen samen, bekijk prijzen en ga naar afrekenen wanneer je er klaar voor bent."
    },
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
      contact: "Contact",
      shippedBy: "Live systemen geleverd door XYZ Labs"
    },
    common: {
      top: "Top",
      payNow: "Nu betalen",
      backToCart: "Terug naar winkelwagen",
      emailStudio: "E-mail de studio",
      browseCatalog: "Bekijk catalogus",
      creatingCheckout: "Afrekenen starten…",
      checkoutError:
        "Kan afrekenen niet starten. Probeer het opnieuw of e-mail de studio.",
      learnMore: "Meer info",
      moreDetail: "Meer details",
      showLess: "Toon minder",
      buyItNow: "Nu kopen",
      addToBuild: "Toevoegen aan Build",
      inBuild: "In Build",
      addedToBuild: "Toegevoegd aan Build ✓",
      alreadyInBuild: "Al in Build",
      liveDemo: "Live demo",
      open: "Openen",
      openLiveDemo: "Open live demo",
      openLiveBuild: "Open live build",
      contactStudio: "Neem contact op",
      visitDocs: "Ga naar mktmaker.xyz",
      filterAll: "Alles",
      labelSetup: "Installatie",
      labelMonthly: "Maandelijks",
      monthSuffix: "/mnd",
      categoryCatalog: "Catalogus",
      categoryWeb3: "Web3",
      skuPrefix: "SKU",
      removeAria: "Verwijderen",
      decreaseAria: "Verlagen",
      increaseAria: "Verhogen",
      imageAria: "Afbeelding",
      previewAria: "Voorbeeld",
      closeAria: "Sluiten",
      walletComingSoon: "Web3 wallet — binnenkort beschikbaar"
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
        "Voeg een product toe of gebruik Nu kopen om je winkelwagen te vullen."
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
      clearConfirm: "Je Build-lijst wissen?",
      continueToCheckout: "Doorgaan naar afrekenen",
      emailThisBuild: "E-mail deze build",
      mailtoBuildSubject: "Build-aanvraag",
      mailtoCustomSubject: "Aanvraag Custom Build",
      mailtoCartSubject: "Aanvraag winkelwagen-afrekening",
      mailtoIntro: "Hallo XYZ Labs,",
      mailtoBody: "Ik wil het volgende afronden:",
      mailtoOutro: "Bedankt."
    },
    promo: {
      offSuffix: "KORTING",
      usdcBonus: "+10% USDC"
    },
    footer: {
      catalog: "Catalogus",
      web3: "Web3 / DeFi",
      connect: "Contact",
      tagline: "Systemen, tools en digitale infrastructuur door XYZ Labs.",
      madeIn: "XYZ Labs — gemaakt in de VS.",
      madeInStudio: "XYZ Labs — gemaakt in de studio.",
      socialYouTube: "YouTube",
      socialDiscord: "Discord",
      socialX: "X",
      socialEmail: "E-mail"
    },
    sections: {
      statementTag: "Wat we bouwen",
      statementHeadPre: "Front-ends, afrekenen en operationele oppervlakken —",
      statementHeadHl: "geproductiseerd",
      statementHeadPost: "en klaar om in te zetten.",
      statementBody:
        "Elk item hieronder is een live systeem in productie. Open de live demo, klap uit voor capaciteitsdetails of vraag een white-glove installatie aan.",
      catalogEyebrow: "De studio-catalogus",
      catalogTitle: "Live producten van XYZ Labs.",
      liveEyebrow: "Ingezet",
      liveTitle: "Elk oppervlak staat online.",
      liveBody:
        "Studio-catalogus en onchain-systemen — één ecosysteem, één lab. Elke tegel opent een werkende omgeving.",
      productionEyebrow: "In productie",
      productionTitle: "Op dit moment in productie.",
      productionBody:
        "Alley AI — een altijd-actieve executive assistant, live ingezet tijdens de ontwikkeling. Telefoonbeantwoording en screening, afspraakplanning en boekingen, e-mails opstellen en beantwoorden, herinneringen en follow-ups, spraaknotities en spraakopdrachten, agenda-integratie, Telegram en SMS, en automatische statusupdates — alles wat een topassistent doet, 24/7 oproepbaar.",
      productionStatus: "Live · build in uitvoering",
      productionSoon: "Binnenkort",
      productionFollow: "White-glove uitrol volgt",
      ctaEyebrow: "Werk samen met XYZ Labs",
      ctaTitle: "Breng een systeem op de markt.",
      ctaBody:
        "Kies een kant-en-klaar product of laat iets nieuws ontwikkelen. Alles hierboven is een referentie-implementatie die je vandaag nog kunt white-labelen.",
      ctaEmailStudio: "E-mail de studio",
      ctaJoinDiscord: "Word lid van Discord"
    },
    brand: {
      hero: {
        eyebrow: "XYZ Labs — Studio-catalogus",
        title: "Live systemen voor moderne bedrijven.",
        subtitle:
          "Storefronts, afrekenen, berichten en lanceeroppervlakken — premium digitale systemen, al ingezet.",
        status: "Studio // Actief"
      }
    },
    defi: {
      eyebrow: "Web3 / DeFi",
      title: "Onchain-uitvoeringsoppervlakken.",
      subtitle:
        "Uitvoeringsoppervlakken, swap-flows, vault-tooling, bridge-toegang en geautomatiseerde marktsystemen.",
      products: {
        "xyz_dfi01": {
          description:
            "Uitvoeringsterminal voor onchain market making — quote, hedge en beheer orderboeken in één oppervlak."
        },
        "xyz_dfi02": {
          description:
            "Token-swaps met gerouteerde liquiditeit en prijsbewuste uitvoering."
        },
        "xyz_dfi03": {
          description:
            "Yield-strategieën met transparante allocatie, limieten en rapportage."
        },
        "xyz_dfi04": {
          description:
            "Cross-chain asset-overdracht met zichtbare routes en bevestigingen."
        },
        "xyz_dfi05": {
          description:
            "Validator- en RPC-infrastructuur voor operators en protocollen."
        },
        "xyz_dfi06": {
          description:
            "Engagement- en loyaliteitslaag met onchain-administratie en beheer."
        }
      }
    },
    products: {
      "xyz_0444": {
        badge: "Bouwer",
        oneLinePromise:
          "Ontwerp en lanceer snel verzorgde bedrijfspagina's.",
        buyerOutcome:
          "Ga in minuten van idee naar live pagina met drag-and-drop tools.",
        bullets: [
          "Drag-and-drop pagina-bouwer met realtime preview",
          "Verzorgde lanceeroppervlakken voor elk product of dienst",
          "Branded paginasjablonen met eigen lettertypen en kleuren",
          "Eén-klik publicatie naar je eigen domein",
          "Standaard mobiel-responsief"
        ]
      },
      "xyz_0445": {
        badge: "Storefront",
        oneLinePromise: "Je webwinkel-front-end, klaar voor gebruik.",
        buyerOutcome:
          "Lanceer een complete storefront met ingebouwde checkout en klantentools.",
        bullets: [
          "Geïntegreerde checkout en betalingsverwerking",
          "Ingebouwde klantenservice met ticketrouting",
          "Business-in-a-box met begeleide onboarding",
          "Upgrade-klaar voor abonnementen en upsells"
        ]
      },
      "xyz_0446": {
        badge: "Doelgroep",
        oneLinePromise: "Tools voor klanttoegang en -verbinding.",
        buyerOutcome:
          "Laat je publiek groeien en betrek het vanuit één branded hub.",
        bullets: [
          "Community-touchpoints op web, mobiel en social",
          "Branded interactie-oppervlakken in jouw look-and-feel",
          "Ingebouwde tools voor groei en referral-tracking",
          "Sociale presentatielaag voor content en aankondigingen"
        ]
      },
      "xyz_0447": {
        badge: "Betalingen",
        oneLinePromise:
          "Betaalverzoeken, facturatie en checkout-tools.",
        buyerOutcome:
          "Verkoop meer met flexibele checkout, kortingscodes en klantinzichten.",
        bullets: [
          "Flexibele verkoop met eenmalige en terugkerende checkout-flows",
          "Ingebouwde kortingscodes en promotieprijzen",
          "Gestroomlijnde checkout met opgeslagen betaalmethoden",
          "Lichte CRM met klantprofielen en aankoophistorie"
        ]
      },
      "xyz_0448": {
        badge: "Communicatie",
        oneLinePromise:
          "Realtime berichttracking voor klantgerichte updates.",
        buyerOutcome:
          "Houd klanten op de hoogte met een lichte, altijd actuele statuspagina.",
        bullets: [
          "Realtime berichttracking-oppervlak",
          "Lichte klantgerichte statuspagina",
          "Gemaakt voor snelle updates en een strakke UI"
        ]
      },
      "xyz_0449": {
        badge: "Landingspagina",
        oneLinePromise:
          "Premium product-landing met 3D-showroom-uitstraling.",
        buyerOutcome:
          "Lanceer een high-end micro-verkoopomgeving met ingebouwde checkout en admin.",
        bullets: [
          "Premium product-landing met 3D-diepte",
          "Producttegels en PayMe-checkout ingebouwd",
          "Adminpagina plus meerdere betaalopties",
          "Micro-verkoopsysteem geoptimaliseerd voor premium aanbiedingen"
        ]
      },
      "xyz_0450": {
        badge: "Landingspagina",
        oneLinePromise:
          "Premium product-landing met galerij-presentatie.",
        buyerOutcome:
          "Toon premium productdrops in een gecureerd lanceeroppervlak in galerijstijl.",
        bullets: [
          "Premium product-landing met presentatie in galerijstijl",
          "Producttegels en PayMe-checkout ingebouwd",
          "Adminpagina plus meerdere betaalopties",
          "Micro-verkoopsysteem voor premium productdrops"
        ]
      },
      "xyz_0451": {
        badge: "Bedrijf",
        oneLinePromise:
          "Bedrijfspagina-systeem met Gateway-achtige layout.",
        buyerOutcome:
          "Run diensten of producten met drie aanpasbare pagina's plus een klantgedeelte.",
        bullets: [
          "Gateway-achtige layout zonder Web3-interface",
          "Drie aanpasbare pagina's plus een klantgedeelte",
          "Lichte CRM-functies van PayMe Pro inbegrepen",
          "Gemaakt voor diensten en producten met admin- plus klantflow"
        ]
      },
      "xyz_0452": {
        badge: "Sociaal",
        oneLinePromise:
          "Aanpasbare stickers-app voor scholen, groepen en clubs.",
        buyerOutcome:
          "Bied een leuke, begeleide stickerflow aan die makkelijk te delen is.",
        bullets: [
          "Aanpasbare stickers-app en spel voor scholen, groepen of clubs",
          "Eenvoudige begeleide aanpas-flow",
          "Ontworpen voor leuke betrokkenheid en eenvoudig delen"
        ]
      }
    },
    alley: {
      name: "Alley AI",
      productNumber: "ALLEY · IN PRODUCTIE",
      badge: "Live · build in uitvoering",
      tagline:
        "Een altijd-actieve AI executive assistant — live, ingezet tijdens de ontwikkeling.",
      features: [
        "Telefoonbeantwoording en screening met intelligente routing",
        "Afspraakplanning en boekingen in jouw agenda",
        "E-mails opstellen, triëren en automatisch beantwoorden",
        "Herinneringen voor berichten en proactieve follow-ups",
        "Spraaknotities en integratie van spraakopdrachten",
        "Agenda-integratie (Google, Outlook, iCloud)",
        "Telegram-, SMS- en chat-eerst gesprekken",
        "Voorbereidingsbriefings en samenvattingen na vergaderingen",
        "Reizen, reserveringen en logistieke coördinatie",
        "Automatische statusupdates en dagelijkse executive-digests"
      ]
    }
  };
})();
