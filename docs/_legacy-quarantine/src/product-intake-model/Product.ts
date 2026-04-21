export type Product = {
  name: string;
  oneLinePromise: string;
  buyerOutcome: string;
  actionPath: string;
  orderedImages: string[];
  bullets: [string, string, string, ...string[]];
};

export const productFixtures: Product[] = [
  {
    name: 'Studio',
    oneLinePromise: 'Design and deploy polished business pages fast.',
    buyerOutcome: 'Go from idea to live page in minutes with drag-and-drop tools.',
    actionPath: '/product/studio',
    orderedImages: [
      '/Studio1.png',
      '/Studio2.png',
      '/Studio3.png',
      '/Studio4.png',
      '/Studio5.png',
      '/Studio6.png'
    ],
    bullets: [
      'Drag-and-drop page builder with real-time preview',
      'Polished launch surfaces for any product or service',
      'Branded page templates with custom fonts and colors',
      'One-click deploy to your own domain',
      'Mobile-responsive output by default'
    ]
  },
  {
    name: 'Gateway',
    oneLinePromise: 'Your web business front end, ready to run.',
    buyerOutcome: 'Launch a complete storefront with checkout and customer tools built in.',
    actionPath: '/product/gateway',
    orderedImages: [
      '/Gateway1.png',
      '/Gateway2.png',
      '/Gateway3.png',
      '/Gateway4.png',
      '/Gateway5.png',
      '/Gateway6.png',
      '/Gateway7.png'
    ],
    bullets: [
      'Integrated checkout and payment processing',
      'Built-in customer service area with ticket routing',
      'Business-in-a-box setup with guided onboarding',
      'Upgrade-ready customer flows for subscriptions and upsells'
    ]
  },
  {
    name: 'Connect',
    oneLinePromise: 'A social framework for branded audience engagement.',
    buyerOutcome: 'Grow and engage your audience from one branded hub.',
    actionPath: '/product/connect',
    orderedImages: [
      '/connect1.png',
      '/connect2.png',
      '/connect3.png',
      '/connect4.png',
      '/connect6.png'
    ],
    bullets: [
      'Community touchpoints across web, mobile, and social',
      'Branded interaction surfaces with your look and feel',
      'Built-in audience growth tools and referral tracking',
      'Social presentation layer for content and announcements'
    ]
  },
  {
    name: 'PayMe Pro',
    oneLinePromise: 'Modern commerce with built-in promotion and customer tools.',
    buyerOutcome: 'Sell more with flexible checkout, coupons, and customer insights.',
    actionPath: '/product/payme-pro',
    orderedImages: [
      '/paymepro1.png',
      '/paymepro2.png',
      '/paymepro3.png',
      '/paymepro4.png',
      '/paymepro5.png',
      '/paymepro6.png'
    ],
    bullets: [
      'Flexible selling with one-time and recurring checkout flows',
      'Coupon codes and promotional pricing built in',
      'Streamlined checkout with saved payment methods',
      'Light CRM with customer profiles and purchase history'
    ]
  }
];

export function getProductById(id: string): Product | undefined {
  return productFixtures.find((item) => slugifyProductName(item.name) === id);
}

export function slugifyProductName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
