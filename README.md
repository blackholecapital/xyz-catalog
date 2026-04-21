# Showroom

## Chassis Structure

This repository follows Blueprint chassis authority. The approved root contains only chassis folders — no legacy runtime roots hold final authority.

### Approved Root Authorities

```
invariants/           # Domain invariants and business rules
factory-language/     # Shared vocabulary and type language
product-shell/        # Single shell authority (landing, route-map, slot-map, touchpoint-map)
modules/              # Domain modules (engagement, conversion, trust, operations)
variation-control/    # Feature flags and variants
resolver-boundary/    # Data access boundary
production/           # Adapters (ui, payments, storage, analytics)
docs/                 # Documentation and legacy quarantine
examples/             # Reference examples
```

### First Slice

Studio Profile Card Landing -> Product/Offer Selection -> Add to Cart -> In-App Pay Flow -> Payment Confirmation -> Return to Showroom

### Module Ownership

- **modules/engagement/** — showroom, gallery, profile, media
- **modules/conversion/** — cart, offers, checkout, swipe/card actions
- **modules/trust/** — payment truth, auth boundary, webhook verification
- **modules/operations/** — notifications, admin, config, reconciliation

### Legacy Quarantine

All legacy runtime artifacts are quarantined under `docs/_legacy-quarantine/`. No file in that path holds executable authority. See `docs/legacy-artifact-quarantine-list.md` for the full manifest.

### Documentation

- `docs/file-system-remap.md` — remap actions and folder tree
- `docs/legacy-artifact-quarantine-list.md` — quarantined artifact manifest
- `docs/route-map.md` — first slice route definitions
- `docs/slot-map.md` — shell slot allocations
- `docs/touchpoint-map.md` — user-facing interaction boundaries
- `docs/module-claims.md` — module ownership claims
- `docs/adapter-claims.md` — production adapter claims
