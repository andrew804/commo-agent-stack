# COPS Administration — API Reference

This is the complete list of operations available to the COPS admin agent. Each operation is a call to `commo_api` with a method, path, and optional body.

## Authentication

All requests are automatically authenticated with the COPS API key. No additional auth is needed.

---

## Swimmers & Families

| Method | Path | Body | What it does |
|--------|------|------|-------------|
| GET | `/api/members` | — | List all swimmers |
| POST | `/api/members` | `{ name, team?, payer_id?, renewal_frequency?, renewal_anchor_date? }` | Add a new swimmer |
| PATCH | `/api/members/:id` | `{ name?, team?, status?, payer_id? }` | Update swimmer details |
| GET | `/api/members/:id/billing-history` | — | See a swimmer's billing history |
| POST | `/api/members/:id/pause` | `{ reason? }` | Pause a swimmer's membership |
| POST | `/api/members/:id/resume` | — | Resume a paused membership |
| POST | `/api/members/:id/leave` | `{ final_invoice? }` | Mark a swimmer as left (with optional final invoice) |
| POST | `/api/members/plan-change/preview` | `{ member_id, new_plan_id }` | Preview what a plan change would cost |
| POST | `/api/members/:id/plan-change/apply` | `{ new_plan_id }` | Move a swimmer to a different plan |
| GET | `/api/payers` | — | List all payers (parents/guardians responsible for fees) |
| POST | `/api/payers` | `{ name, email? }` | Add a new payer |
| PATCH | `/api/payers/:id` | `{ name?, email? }` | Update payer details |

## Invoices

| Method | Path | Body | What it does |
|--------|------|------|-------------|
| GET | `/api/invoices` | — | List all invoices |
| POST | `/api/invoices` | `{ member_id, amount, description?, due_date?, type? }` | Create a new invoice |
| GET | `/api/invoices/:id` | — | See full invoice details |
| POST | `/api/invoices/:id/actions` | `{ action, ...params }` | Take an action on an invoice |

**Invoice actions** (put in the `action` field):
- `issue` — send the invoice to the payer
- `mark_paid` — record that the full amount was paid: `{ action: "mark_paid", method?, reference? }`
- `record_partial` — record a partial payment: `{ action: "record_partial", amount, method?, reference? }`
- `waive` — write off the remaining balance: `{ action: "waive", reason? }`
- `refund_note` — issue a credit note: `{ action: "refund_note", amount, reason? }`

## Payments & Billing

| Method | Path | Body | What it does |
|--------|------|------|-------------|
| GET | `/api/payments` | — | List all payments received |
| GET | `/api/payments/unallocated` | — | Payments not yet matched to an invoice |
| POST | `/api/payments` | `{ amount, method?, reference?, payer_id? }` | Record a payment |
| GET | `/api/payments/:id` | — | Payment details |
| GET | `/api/payments/:id/timeline` | — | Payment lifecycle events |
| POST | `/api/payments/:id/allocate` | `{ invoice_id }` | Match a payment to an invoice |
| GET | `/api/charge-approvals/queue` | — | Pending payment approvals |
| POST | `/api/charge-approvals/schedule` | `{ invoice_id }` | Schedule a payment for approval |
| PATCH | `/api/charge-approvals/:id` | `{ ...fields }` | Update a pending approval |
| POST | `/api/charge-approvals/:id/approve` | — | Approve a pending payment |
| POST | `/api/charge-approvals/:id/reject` | `{ reason? }` | Reject a pending payment |
| GET | `/api/arrears` | — | Who owes money and how much |
| GET | `/api/forecast` | — | Cash flow forecast (next 90 days) |
| GET | `/api/renewals-preview` | — | Upcoming membership renewals |
| POST | `/api/renewal-invoices/preview` | `{ ...filters }` | Preview renewal invoices before generating |
| POST | `/api/renewal-invoices/generate` | `{ ...filters }` | Generate renewal invoices in bulk |
| POST | `/api/proration` | `{ member_id, new_plan_id }` | Calculate prorated amount for a plan change |
| GET | `/api/adjustment-records/:id` | — | Details of a credit note, refund, or write-off |
| POST | `/api/adjustment-records` | `{ invoice_id, type, amount, reason? }` | Create a credit note, refund, or write-off |
| POST | `/api/adjustment-records/:id/reverse` | — | Reverse an adjustment |
| GET | `/api/adjustments/net-impact` | — | Net financial impact of all adjustments |
| GET | `/api/chasing/recent` | — | Recent overdue fee reminders sent |

## Subscriptions & Plans

| Method | Path | Body | What it does |
|--------|------|------|-------------|
| GET | `/api/product-plans` | — | List all squad plans (add `?include_archived=true` for archived) |
| GET | `/api/product-plans/:id` | — | Plan details with current subscribers |
| POST | `/api/product-plans` | `{ name, amount, frequency, description? }` | Create a new plan |
| PATCH | `/api/product-plans/:id` | `{ name?, amount?, description?, archived? }` | Update or archive a plan |
| GET | `/api/membership-subscriptions` | — | List all active subscriptions |
| GET | `/api/membership-subscriptions/:id` | — | Subscription details |
| GET | `/api/membership-subscriptions/:id/timeline` | — | Subscription event history |
| POST | `/api/membership-subscriptions/:id/actions` | `{ action, ...params }` | Take an action on a subscription |

**Subscription actions:**
- `cancel` — cancel the subscription
- `pause` — pause it temporarily
- `resume` — resume a paused subscription
- `change_payment_method` — switch payment method: `{ payment_method }`
- `switch_plan` — move to a different plan: `{ new_plan_id }`

## Committee & Governance

| Method | Path | Body | What it does |
|--------|------|------|-------------|
| GET | `/api/leadership/roles` | — | List all committee roles |
| GET | `/api/leadership/is-admin` | — | Check if you have admin access |
| GET | `/api/leadership/community-members` | — | List members available for role assignment |
| GET | `/api/leadership/roles/:id` | — | Details of a specific role |
| POST | `/api/leadership/roles` | `{ title, category?, is_admin?, description? }` | Create a new committee role |
| PATCH | `/api/leadership/roles/:id` | `{ title?, description?, is_admin? }` | Update a role |
| DELETE | `/api/leadership/roles/:id` | — | Remove a role |
| POST | `/api/leadership/roles/reorder` | `{ order: [{ id, sort_order }] }` | Reorder roles |
| POST | `/api/leadership/roles/:id/holder` | `{ email, name }` | Assign someone to a role |
| DELETE | `/api/leadership/roles/:id/holder` | — | Remove someone from a role |

## New Member Requests

| Method | Path | Body | What it does |
|--------|------|------|-------------|
| GET | `/api/join-requests` | — | See pending join requests |
| POST | `/api/join-requests/:id/approve` | — | Approve a request (adds them as a member) |
| POST | `/api/join-requests/:id/reject` | — | Reject a request |
| GET | `/api/join-requests/code` | — | Get the current join code (shared via WhatsApp) |
| POST | `/api/join-requests/code/generate` | — | Generate a new join code |

## Bank Reconciliation

| Method | Path | Body | What it does |
|--------|------|------|-------------|
| GET | `/api/reconciliation` | — | Monthly reconciliation with auto-matched transactions |
| POST | `/api/reconciliation/import-csv` | `{ csv }` | Import a bank statement (CSV) |
| POST | `/api/reconciliation/confirm` | `{ bank_transaction_id }` | Confirm a matched transaction |
| POST | `/api/reconciliation/undo` | `{ bank_transaction_id }` | Undo a confirmation |
| POST | `/api/reconciliation/confirm-all` | — | Confirm all high-confidence matches at once |
| GET | `/api/reconciliation/export` | — | Export the reconciliation report |
| GET | `/api/reconciliation/payments` | — | List payments available for manual matching |
| POST | `/api/payout-batches` | — | Create a payout batch |
| POST | `/api/reconciliation/match-payout` | `{ payment_id, batch_id }` | Add a payment to a payout batch |
| POST | `/api/reconciliation/bank-transactions` | `{ date, description, amount }` | Manually add a bank transaction |
| POST | `/api/reconciliation/match-bank` | `{ bank_transaction_id, payment_id }` | Manually match a bank transaction to a payment |

## GoCardless (Direct Debit)

| Method | Path | Body | What it does |
|--------|------|------|-------------|
| GET | `/api/gocardless/status` | — | Check if GoCardless is connected |
| POST | `/api/gocardless/sync` | — | Pull latest payments from GoCardless |
| POST | `/api/gocardless/disconnect` | — | Disconnect GoCardless |
| POST | `/api/gocardless/sync-payouts` | — | Pull latest payout data |
| GET | `/api/gocardless/payouts` | — | List payouts received |
| POST | `/api/gocardless/create-mandate` | `{ member_id }` | Set up direct debit for a family |

## Club Settings

| Method | Path | Body | What it does |
|--------|------|------|-------------|
| GET | `/api/settings/organisation` | — | Club name, description, and logo |
| PATCH | `/api/settings/organisation` | `{ name?, description? }` | Update club details |
| DELETE | `/api/settings/organisation/logo` | — | Remove the club logo |

## API Keys

| Method | Path | Body | What it does |
|--------|------|------|-------------|
| POST | `/api/api-keys` | `{ name }` | Create a new API key (admin only, shown once) |
| GET | `/api/api-keys` | — | List existing keys |
| DELETE | `/api/api-keys/:id` | — | Revoke a key |

## Dashboard & Health

| Method | Path | Body | What it does |
|--------|------|------|-------------|
| GET | `/health` | — | System health check |
| GET | `/api/dashboard` | — | Club dashboard summary (member counts, revenue, arrears) |
