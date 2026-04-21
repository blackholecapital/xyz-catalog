# Route Map

## First Slice Routes

The first slice implements the following flow:

**Studio Profile Card Landing -> Product/Offer Selection -> Add to Cart -> In-App Pay Flow -> Payment Confirmation -> Return to Showroom**

| Route | Module Owner | Surface |
|---|---|---|
| `/` | `modules/engagement/showroom` | Showroom landing — studio profile card |
| `/gallery` | `modules/engagement/gallery` | Product/offer gallery for selection |
| `/profile/:id` | `modules/engagement/profile` | Expanded studio profile |
| `/cart` | `modules/conversion/cart` | Cart with selected products/offers |
| `/checkout` | `modules/conversion/checkout` | In-app payment flow |
| `/checkout/confirm` | `modules/conversion/checkout` | Payment confirmation |

## Route Authority

- All routes are owned by `product-shell/route-map/`
- Each route delegates rendering to its owning module
- No route may bypass the product-shell boundary
- No redirect checkout routes exist (removed from scope)
- No remote session routes exist (removed from scope)

## Route Lifecycle (First Slice)

1. User lands on `/` — Showroom surface with studio profile card
2. User browses `/gallery` — selects product or offer
3. User adds to cart — navigates to `/cart`
4. User initiates checkout — enters `/checkout` (in-app pay flow)
5. Payment completes — `/checkout/confirm` shown
6. User returns to `/` — back to Showroom
