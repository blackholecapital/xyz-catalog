# Touchpoint Map

## Definition

A touchpoint is any user-facing interaction boundary where the system receives input or delivers output.
Touchpoints are owned by `product-shell/touchpoint-map/` and delegated to modules.

## First Slice Touchpoints

| Touchpoint ID | Type | Module Owner | Description |
|---|---|---|---|
| `tp.landing.view` | View | `engagement/showroom` | User sees studio profile card landing |
| `tp.gallery.browse` | View | `engagement/gallery` | User browses product/offer gallery |
| `tp.gallery.select` | Action | `engagement/gallery` | User selects a product or offer |
| `tp.profile.expand` | Action | `engagement/profile` | User expands a studio profile |
| `tp.media.view` | Action | `engagement/media` | User opens media lightbox |
| `tp.cart.add` | Action | `conversion/cart` | User adds item to cart |
| `tp.cart.view` | View | `conversion/cart` | User views cart contents |
| `tp.cart.remove` | Action | `conversion/cart` | User removes item from cart |
| `tp.offers.view` | View | `conversion/offers` | User views offer details |
| `tp.checkout.start` | Action | `conversion/checkout` | User initiates in-app pay flow |
| `tp.checkout.pay` | Action | `conversion/checkout` | User submits payment |
| `tp.checkout.confirm` | View | `conversion/checkout` | User sees payment confirmation |
| `tp.checkout.return` | Navigation | `conversion/checkout` | User returns to showroom |
| `tp.swipe.action` | Action | `conversion/swipe-card-actions` | User swipes on a product card |
| `tp.auth.challenge` | Action | `trust/auth-boundary` | Auth challenge presented |
| `tp.auth.resolve` | Action | `trust/auth-boundary` | Auth challenge resolved |
| `tp.notification.show` | View | `operations/notifications` | Notification displayed |

## Flow (First Slice)

```
tp.landing.view
  -> tp.gallery.browse
    -> tp.gallery.select
      -> tp.cart.add
        -> tp.cart.view
          -> tp.checkout.start
            -> tp.checkout.pay
              -> tp.checkout.confirm
                -> tp.checkout.return -> tp.landing.view
```

## Rules

1. Every user-facing interaction must map to a registered touchpoint
2. Touchpoints are defined in `product-shell/touchpoint-map/`, not in modules
3. Modules implement touchpoint handlers, not touchpoint definitions
4. No touchpoint may exist outside the product-shell boundary
