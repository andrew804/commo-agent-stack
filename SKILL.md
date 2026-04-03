---
name: commo-api
description: Operate the Commo membership platform via its full REST API. Manage members, invoices, billing, subscriptions, payments, reconciliation, leadership roles, join requests, GoCardless integration, settings, and API keys.
---

# Commo API

Use this skill with the `commo_api` plugin tool to call any Commo API endpoint.

## Quick Start

1. Set environment mode:
   - `COMMO_ENV=dev` or `COMMO_ENV=prod`
2. Configure both environments (recommended):
   - `COMMO_DEV_BASE_URL` — e.g. `http://localhost:8787`
   - `COMMO_DEV_API_KEY` — API key starting with `cmk_`
   - `COMMO_PROD_BASE_URL` — e.g. `http://129.212.160.40`
   - `COMMO_PROD_API_KEY` — API key starting with `cmk_`
3. Call the `commo_api` tool with:
   - `method` — GET, POST, PATCH, or DELETE
   - `path` — API path, e.g. `/api/members`
   - `body` — JSON object (for POST/PATCH only)

## API Domains

See `references/api.md` for the full endpoint reference with parameters and response shapes.

**Members & Payers** — CRUD, lifecycle (pause/resume/leave), plan changes
**Invoices** — CRUD, actions (issue, mark_paid, record_partial, waive, refund_note)
**Billing & Payments** — payments, allocations, charge approvals, arrears, forecasting, renewals, adjustments, chasing
**Subscriptions & Plans** — product plans, membership subscriptions, subscription actions
**Leadership & Governance** — roles, role holders, admin checks
**Join Requests** — list, approve, reject, join code management
**Reconciliation** — bank matching, CSV import, confirmations, payout batches
**GoCardless** — connection status, sync, mandates, payouts, disconnect
**Settings** — org details, profile, billing
**API Keys** — create, list, revoke (admin only)

## Excluded Routes (not supported via this plugin)
- Multipart uploads (logo, avatar) — use the web UI
- GoCardless OAuth flows — browser-based redirect
- Inbound webhooks — server receives these, not the agent

## Security Notes

- API keys are org-scoped and grant admin access to that org.
- The key acts as its creator for audit trail attribution.
- If the creator is removed or loses admin, the key stops working.
- Rate limited to 60 requests per minute per key.
- Prefer plugin tool access over shell execution.
- For locked-down org agents, allow only `commo_api` and deny runtime shell tools.

## Secret References
Use secret refs in config instead of plaintext keys:
- `COMMO_DEV_API_KEY=sops://COMMO_DEV_API_KEY`
- `COMMO_PROD_API_KEY=sops://COMMO_PROD_API_KEY`
The plugin resolves these refs from `~/.openclaw/secrets/secrets.enc.json` at runtime.
