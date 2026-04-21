# Slot Map

## Shell Slots

Slots are rendering positions owned by `product-shell/slot-map/`. Modules claim slots but do not own them.

| Slot ID | Location | Claimed By | Description |
|---|---|---|---|
| `shell.header` | Top bar | `product-shell` | App header, navigation controls |
| `shell.main` | Center viewport | Route-dependent module | Primary content area |
| `shell.bottom-nav` | Bottom bar | `product-shell` | Bottom navigation tabs |
| `shell.modal` | Overlay | Any module (on demand) | Modal overlay surface |

## Module Slot Claims (First Slice)

### modules/engagement

| Slot | Component | Route Context |
|---|---|---|
| `shell.main` | Showroom Landing | `/` |
| `shell.main` | Gallery Surface | `/gallery` |
| `shell.main` | Profile Card Expanded | `/profile/:id` |
| `shell.modal` | Media Lightbox | Any (on trigger) |

### modules/conversion

| Slot | Component | Route Context |
|---|---|---|
| `shell.main` | Cart Surface | `/cart` |
| `shell.main` | Checkout Flow | `/checkout` |
| `shell.main` | Payment Confirmation | `/checkout/confirm` |
| `shell.modal` | Offer Detail | `/gallery` (on trigger) |

### modules/trust

| Slot | Component | Route Context |
|---|---|---|
| `shell.modal` | Auth Boundary | Any (on auth challenge) |

### modules/operations

| Slot | Component | Route Context |
|---|---|---|
| `shell.modal` | Notification Toast | Any (on event) |

## Rules

1. Only `product-shell/slot-map/` defines slot positions
2. Modules claim slots — they do not create them
3. One module per slot per route context (no double-booking)
4. Modal slot is shared but mutex (one modal at a time)
