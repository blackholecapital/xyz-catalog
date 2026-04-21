# File System Remap

## Chassis Structure (Final Authority)

```
Showroom/
  invariants/                    # Domain invariants and business rules
  factory-language/              # Shared vocabulary and type language
  product-shell/                 # Shell authority (single shell)
    landing/                     # Landing surface
    route-map/                   # Route definitions
    slot-map/                    # Slot allocation
    touchpoint-map/              # Touchpoint definitions
  modules/
    engagement/                  # Showroom engagement domain
      showroom/
      gallery/
      profile/
      media/
    conversion/                  # Purchase conversion domain
      cart/
      offers/
      checkout/
      swipe-card-actions/
    trust/                       # Trust and verification domain
      payment-truth/
      auth-boundary/
      webhook-verification/
    operations/                  # Operational domain
      notifications/
      admin/
      config/
      reconciliation/
  variation-control/             # Feature flags and variants
  resolver-boundary/             # Data access boundary
  production/
    adapters/
      ui/                        # UI adapter layer
      payments/                  # Payment adapter layer
      storage/                   # Storage adapter layer
      analytics/                 # Analytics adapter layer
  docs/                          # Documentation
  examples/                      # Reference examples
      docs/_legacy-quarantine/        # Quarantined legacy artifacts (no authority, nested under docs/)
```

## Remap Actions Performed

### Folders Created (New)
- `invariants/`
- `factory-language/`
- `product-shell/` (with `landing/`, `route-map/`, `slot-map/`, `touchpoint-map/`)
- `modules/engagement/` (with `showroom/`, `gallery/`, `profile/`, `media/`)
- `modules/conversion/` (with `cart/`, `offers/`, `checkout/`, `swipe-card-actions/`)
- `modules/trust/` (with `payment-truth/`, `auth-boundary/`, `webhook-verification/`)
- `modules/operations/` (with `notifications/`, `admin/`, `config/`, `reconciliation/`)
- `variation-control/`
- `resolver-boundary/`
- `production/adapters/` (with `ui/`, `payments/`, `storage/`, `analytics/`)
- `examples/`

### Paths Moved to Quarantine
- `src/` -> `docs/_legacy-quarantine/src/`
- `public/` -> `docs/_legacy-quarantine/public/`
- `e2e/` -> `docs/_legacy-quarantine/e2e/`
- `qa-checklists/` -> `docs/_legacy-quarantine/qa-checklists/`
- `index.html` -> `docs/_legacy-quarantine/index.html`
- `package.json` -> `docs/_legacy-quarantine/package.json`
- `package-lock.json` -> `docs/_legacy-quarantine/package-lock.json`
- `vite.config.ts` -> `docs/_legacy-quarantine/vite.config.ts`
- `tailwind.config.ts` -> `docs/_legacy-quarantine/tailwind.config.ts`
- `postcss.config.js` -> `docs/_legacy-quarantine/postcss.config.js`
- `tsconfig.json` -> `docs/_legacy-quarantine/tsconfig.json`
- `tsconfig.node.json` -> `docs/_legacy-quarantine/tsconfig.node.json`
- `wrangler.toml` -> `docs/_legacy-quarantine/wrangler.toml`
- `eslint.config.js` -> `docs/_legacy-quarantine/eslint.config.js`
- `.env.example` -> `docs/_legacy-quarantine/.env.example`
- `prototype-scope.md` -> `docs/_legacy-quarantine/prototype-scope.md`
- `wallpaper.png` -> `docs/_legacy-quarantine/wallpaper.png`

### Preserved (Unchanged)
- `docs/` (existing, extended with new documentation)
- `README.md` (root — to be updated post-approval)
- `.gitignore` (root)

### Explicitly Removed from Scope
- Second shell (none permitted)
- Redirect checkout flow
- Remote session flow
- Legacy root carry-forward as approved structure
