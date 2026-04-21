# Adapter Claims

## production/adapters/ui

**Owner**: UI rendering adapter layer

| Claim | Description |
|---|---|
| Component library binding | Connects chassis components to a UI framework |
| Theme and token resolution | Resolves design tokens to runtime values |
| Layout primitives | Provides shell-level layout primitives |

**Boundary**: No business logic. No domain state. Rendering only.

---

## production/adapters/payments

**Owner**: Payment provider adapter layer

| Claim | Description |
|---|---|
| Payment provider integration | Connects to external payment APIs |
| Transaction submission | Submits payment transactions |
| Payment status polling | Checks transaction status |
| Receipt generation | Produces payment receipts |

**Boundary**: No cart logic. No checkout UI. Wire protocol only.
**Trust dependency**: Must defer to `modules/trust/payment-truth` for state of truth.

---

## production/adapters/storage

**Owner**: Data persistence adapter layer

| Claim | Description |
|---|---|
| Local storage binding | Connects to browser/device local storage |
| Database client | Manages database connections |
| Cache layer | Provides caching for resolved data |
| Migration runner | Executes storage schema migrations |

**Boundary**: No domain logic. No business rules. CRUD and transport only.

---

## production/adapters/analytics

**Owner**: Analytics and observability adapter layer

| Claim | Description |
|---|---|
| Event emission | Emits touchpoint events to analytics providers |
| Session tracking | Tracks user session for analytics |
| Error reporting | Reports runtime errors to observability |

**Boundary**: No user-facing UI. No data mutation. Observation only.

---

## Adapter Rules

1. Adapters are the outermost layer — they connect chassis internals to external systems
2. Adapters may not import from modules directly; they receive contracts from resolver-boundary/
3. Adapters may not contain business logic or domain invariants
4. Adapters are replaceable — swapping a payment provider changes only `production/adapters/payments/`
5. Each adapter directory owns exactly one external concern
