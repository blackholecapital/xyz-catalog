# Legacy Artifact Quarantine List

All items below have been moved to `docs/_legacy-quarantine/` and stripped of final executable authority.
They exist for reference and controlled migration only. No direct reuse as final executable roots is permitted.
The quarantine path is nested under `docs/` to prevent root-level sibling authority with chassis folders.

## Quarantined Runtime Roots

| Original Path | Quarantine Path | Reason |
|---|---|---|
| `src/` | `docs/_legacy-quarantine/src/` | Legacy app root — not approved as final shell |
| `public/` | `docs/_legacy-quarantine/public/` | Legacy static assets — no chassis authority |
| `e2e/` | `docs/_legacy-quarantine/e2e/` | Legacy test harness — not chassis-governed |
| `qa-checklists/` | `docs/_legacy-quarantine/qa-checklists/` | Legacy QA artifacts — migration reference only |
| `index.html` | `docs/_legacy-quarantine/index.html` | Legacy SPA entry — replaced by product-shell |
| `package.json` | `docs/_legacy-quarantine/package.json` | Legacy dependency manifest |
| `package-lock.json` | `docs/_legacy-quarantine/package-lock.json` | Legacy lockfile |
| `vite.config.ts` | `docs/_legacy-quarantine/vite.config.ts` | Legacy build config |
| `tailwind.config.ts` | `docs/_legacy-quarantine/tailwind.config.ts` | Legacy style config |
| `postcss.config.js` | `docs/_legacy-quarantine/postcss.config.js` | Legacy PostCSS config |
| `tsconfig.json` | `docs/_legacy-quarantine/tsconfig.json` | Legacy TS config |
| `tsconfig.node.json` | `docs/_legacy-quarantine/tsconfig.node.json` | Legacy TS node config |
| `wrangler.toml` | `docs/_legacy-quarantine/wrangler.toml` | Legacy Cloudflare config |
| `eslint.config.js` | `docs/_legacy-quarantine/eslint.config.js` | Legacy lint config |
| `.env.example` | `docs/_legacy-quarantine/.env.example` | Legacy env template |
| `prototype-scope.md` | `docs/_legacy-quarantine/prototype-scope.md` | Legacy scope document |
| `wallpaper.png` | `docs/_legacy-quarantine/wallpaper.png` | Legacy asset |

## Quarantined Sub-Trees (inside _legacy-quarantine/src/)

| Sub-Tree | Status |
|---|---|
| `src/app/` | Legacy app shell — no carry-forward as final root |
| `src/checkout-path/` | Legacy redirect checkout — removed from scope |
| `src/_quarantine/social/` | Already quarantined social module — double-quarantined |
| `src/components/` | Legacy UI primitives — migration candidates only |
| `src/pages/` | Legacy page routes — replaced by product-shell route-map |
| `src/routes/` | Legacy routing — replaced by product-shell route-map |
| `src/features/` | Legacy features — migration candidates only |
| `src/domain/` | Legacy domain types — migration candidates for invariants/ |
| `src/lib/` | Legacy utilities — migration candidates for production/adapters/ |
| `src/repositories/` | Legacy data access — migration candidates for resolver-boundary/ |

## Rules

1. No file in `docs/_legacy-quarantine/` may be imported by chassis-governed code
2. Migration from quarantine requires Blueprint approval per-artifact
3. `app/`, `src/`, and `payme-checkout-engine/` are never approved as final executable roots
4. Redirect checkout flow is removed from scope
5. Remote session flow is removed from scope
6. Legacy root carry-forward is not approved structure
