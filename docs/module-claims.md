# Module Claims

## modules/engagement

**Owner**: Showroom engagement surfaces

| Claim | Description |
|---|---|
| `showroom` | Showroom landing surface, studio profile card display |
| `gallery` | Product/offer browsing gallery |
| `profile` | Studio profile expanded view |
| `media` | Media display, image lightbox, product media |

**Does NOT own**: cart, checkout, payment, auth, notifications

---

## modules/conversion

**Owner**: Purchase conversion flow

| Claim | Description |
|---|---|
| `cart` | Cart state, add/remove items, cart surface |
| `offers` | Offer display, offer detail, offer selection |
| `checkout` | In-app payment flow, checkout surface |
| `swipe-card-actions` | Swipe gestures on product/offer cards |

**Does NOT own**: product display, profile, media, payment truth, auth

---

## modules/trust

**Owner**: Trust, verification, and payment integrity

| Claim | Description |
|---|---|
| `payment-truth` | Payment state of truth, transaction integrity |
| `auth-boundary` | Authentication challenge and resolution boundary |
| `webhook-verification` | Inbound webhook signature verification |

**Does NOT own**: checkout UI, cart, user profile, notifications

---

## modules/operations

**Owner**: Operational concerns

| Claim | Description |
|---|---|
| `notifications` | User-facing notification delivery |
| `admin` | Administrative surfaces and controls |
| `config` | Runtime configuration management |
| `reconciliation` | State reconciliation and consistency |

**Does NOT own**: any user-facing product surface, payment, auth

---

## Boundary Rules

1. Each module owns its claimed domains exclusively
2. No module may reach into another module's claimed domain
3. Cross-module communication goes through resolver-boundary/ or events
4. product-shell/ owns the shell — modules own content within slots
5. invariants/ owns business rules — modules enforce them
