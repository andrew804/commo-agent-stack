# Commo API Reference

## Runtime Config

Configured under `skills.entries.commo-api.env`:

| Key | Description |
|-----|-------------|
| `COMMO_ENV` | `dev` or `prod` |
| `COMMO_DEV_BASE_URL` | Dev server URL (e.g. `http://localhost:8787`) |
| `COMMO_DEV_API_KEY` | Dev API key (`cmk_...`) |
| `COMMO_PROD_BASE_URL` | Prod server URL (e.g. `http://129.212.160.40`) |
| `COMMO_PROD_API_KEY` | Prod API key (`cmk_...`) |

## Authentication

All requests use `Authorization: Bearer <cmk_...>` header. The API key is org-scoped, so no `?organization=` parameter is needed.

---

## Members & Payers

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/members` | — | List all members |
| POST | `/api/members` | `{ name, team?, payer_id?, renewal_frequency?, renewal_anchor_date? }` | Create member |
| PATCH | `/api/members/:id` | `{ name?, team?, status?, payer_id? }` | Update member |
| GET | `/api/members/:id/billing-history` | — | Billing config history |
| POST | `/api/members/:id/pause` | `{ reason? }` | Pause membership |
| POST | `/api/members/:id/resume` | — | Resume membership |
| POST | `/api/members/:id/leave` | `{ final_invoice? }` | Mark inactive |
| POST | `/api/members/plan-change/preview` | `{ member_id, new_plan_id }` | Preview proration |
| POST | `/api/members/:id/plan-change/apply` | `{ new_plan_id }` | Apply plan change |
| GET | `/api/payers` | — | List all payers |
| POST | `/api/payers` | `{ name, email? }` | Create payer |
| PATCH | `/api/payers/:id` | `{ name?, email? }` | Update payer |

## Invoices

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/invoices` | — | List all invoices |
| POST | `/api/invoices` | `{ member_id, amount, description?, due_date?, type? }` | Create invoice |
| GET | `/api/invoices/:id` | — | Invoice detail (enriched) |
| POST | `/api/invoices/:id/actions` | `{ action, ...params }` | Perform action |

**Invoice actions** (in body `action` field):
- `issue` — move from draft to issued
- `mark_paid` — record full payment: `{ action: "mark_paid", method?, reference? }`
- `record_partial` — partial payment: `{ action: "record_partial", amount, method?, reference? }`
- `waive` — write off balance: `{ action: "waive", reason? }`
- `refund_note` — credit note: `{ action: "refund_note", amount, reason? }`

## Billing & Payments

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/payments` | — | List all payments |
| GET | `/api/payments/unallocated` | — | Unallocated payments |
| POST | `/api/payments` | `{ amount, method?, reference?, payer_id? }` | Record payment |
| GET | `/api/payments/:id` | — | Payment detail |
| GET | `/api/payments/:id/timeline` | — | Payment lifecycle |
| POST | `/api/payments/:id/allocate` | `{ invoice_id }` | Allocate to invoice |
| GET | `/api/charge-approvals/queue` | — | Pending approvals |
| POST | `/api/charge-approvals/schedule` | `{ invoice_id }` | Create approval |
| PATCH | `/api/charge-approvals/:id` | `{ ...fields }` | Update approval |
| POST | `/api/charge-approvals/:id/approve` | — | Approve and issue |
| POST | `/api/charge-approvals/:id/reject` | `{ reason? }` | Reject |
| GET | `/api/arrears` | — | Outstanding balances by member |
| GET | `/api/forecast` | — | Cash flow forecast (default 90 days) |
| GET | `/api/renewals-preview` | — | Upcoming renewals |
| POST | `/api/renewal-invoices/preview` | `{ ...filters }` | Preview renewal invoices |
| POST | `/api/renewal-invoices/generate` | `{ ...filters }` | Batch generate renewals |
| POST | `/api/proration` | `{ member_id, new_plan_id }` | Calculate proration |
| GET | `/api/adjustment-records/:id` | — | Adjustment detail |
| POST | `/api/adjustment-records` | `{ invoice_id, type, amount, reason? }` | Create adjustment |
| POST | `/api/adjustment-records/:id/reverse` | — | Reverse adjustment |
| GET | `/api/adjustments/net-impact` | — | Net impact by invoice |
| GET | `/api/chasing/recent` | — | Recent dunning activity |

## Subscriptions & Plans

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/product-plans` | — | List plans (add `?include_archived=true` for all) |
| GET | `/api/product-plans/:id` | — | Plan detail with subscriptions |
| POST | `/api/product-plans` | `{ name, amount, frequency, description? }` | Create plan |
| PATCH | `/api/product-plans/:id` | `{ name?, amount?, description?, archived? }` | Update plan |
| GET | `/api/membership-subscriptions` | — | List subscriptions |
| GET | `/api/membership-subscriptions/:id` | — | Subscription detail |
| GET | `/api/membership-subscriptions/:id/timeline` | — | Event timeline |
| POST | `/api/membership-subscriptions/:id/actions` | `{ action, ...params }` | Subscription action |

**Subscription actions:**
- `cancel` — cancel active subscription
- `pause` — pause active subscription
- `resume` — resume paused subscription
- `change_payment_method` — switch card/DD: `{ payment_method }`
- `switch_plan` — change plan: `{ new_plan_id }`

## Leadership & Governance

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/leadership/roles` | — | List roles |
| GET | `/api/leadership/is-admin` | — | Check if current user is admin |
| GET | `/api/leadership/community-members` | — | Members for role picker |
| GET | `/api/leadership/roles/:id` | — | Role detail |
| POST | `/api/leadership/roles` | `{ title, category?, is_admin?, description? }` | Create role (admin) |
| PATCH | `/api/leadership/roles/:id` | `{ title?, description?, is_admin? }` | Update role (admin) |
| DELETE | `/api/leadership/roles/:id` | — | Delete role (admin) |
| POST | `/api/leadership/roles/reorder` | `{ order: [{ id, sort_order }] }` | Reorder (admin) |
| POST | `/api/leadership/roles/:id/holder` | `{ email, name }` | Assign holder (admin) |
| DELETE | `/api/leadership/roles/:id/holder` | — | Remove holder (admin) |

## Join Requests

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/join-requests` | — | List requests (admin) |
| POST | `/api/join-requests/:id/approve` | — | Approve (admin) |
| POST | `/api/join-requests/:id/reject` | — | Reject (admin) |
| GET | `/api/join-requests/code` | — | Get join code (admin) |
| POST | `/api/join-requests/code/generate` | — | New join code (admin) |

## Reconciliation

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/reconciliation` | — | Monthly reconciliation with auto-matches |
| POST | `/api/reconciliation/import-csv` | `{ csv }` | Import bank CSV |
| POST | `/api/reconciliation/confirm` | `{ bank_transaction_id }` | Confirm match |
| POST | `/api/reconciliation/undo` | `{ bank_transaction_id }` | Undo confirmation |
| POST | `/api/reconciliation/confirm-all` | — | Bulk confirm high-confidence |
| GET | `/api/reconciliation/export` | — | Export report |
| GET | `/api/reconciliation/payments` | — | Payments for manual matching |
| POST | `/api/payout-batches` | — | Create payout batch |
| POST | `/api/reconciliation/match-payout` | `{ payment_id, batch_id }` | Match to payout |
| POST | `/api/reconciliation/bank-transactions` | `{ date, description, amount }` | Manual bank txn |
| POST | `/api/reconciliation/match-bank` | `{ bank_transaction_id, payment_id }` | Manual match |

## GoCardless

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/gocardless/status` | — | Connection status |
| POST | `/api/gocardless/sync` | — | Sync payments |
| POST | `/api/gocardless/disconnect` | — | Disconnect |
| POST | `/api/gocardless/sync-payouts` | — | Sync payouts |
| GET | `/api/gocardless/payouts` | — | Payout list |
| POST | `/api/gocardless/create-mandate` | `{ member_id }` | Create DD mandate |

## Settings

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/settings/organisation` | — | Org name, description, logo |
| PATCH | `/api/settings/organisation` | `{ name?, description? }` | Update org (admin) |
| DELETE | `/api/settings/organisation/logo` | — | Remove logo (admin) |

## API Keys

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/api-keys` | `{ name }` | Create key (admin). Returns raw key once. |
| GET | `/api/api-keys` | — | List keys (admin). Never shows raw key. |
| DELETE | `/api/api-keys/:id` | — | Revoke key (admin). Idempotent. |

## Dashboard & Health

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/health` | — | Health check |
| GET | `/api/dashboard` | — | Dashboard summary |
