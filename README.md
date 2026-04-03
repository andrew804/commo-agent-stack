# COPS Admin Agent

AI administrative assistant for **City of Peterborough Swimming Club (COPS)**.

This OpenClaw plugin gives an AI agent full administrative access to the COPS club management system. The agent can manage swimmers, chase fees, generate invoices, reconcile bank statements, approve new members, and handle committee roles.

## What the agent can do

- **Swimmers & families** — look up, create, pause, resume, handle leavers
- **Invoices & payments** — create, issue, record payments, chase overdue, write off
- **Subscriptions & plans** — manage squad plans (Performance, Development, etc.), handle plan changes
- **Direct debit** — sync GoCardless payments, create mandates, view payouts
- **Bank reconciliation** — import statements, match transactions, export reports
- **Committee roles** — manage Chair, Treasurer, Secretary roles and assignments
- **New members** — approve/reject join requests, manage join codes
- **Club settings** — update name, description

## Setup

Configure under `skills.entries.commo-api.env`:

```
COMMO_ENV=prod
COMMO_PROD_BASE_URL=http://129.212.160.40
COMMO_PROD_API_KEY=cmk_...
```

The API key is created by a COPS admin via the club management system. It grants admin-level access scoped to COPS only.

## Components

- `SKILL.md` — agent personality and capability guide (framed around COPS operations)
- `plugins/commo-api/` — `commo_api` runtime tool
- `references/api.md` — full endpoint reference

## Security

- API key is scoped to COPS only (one club, one key)
- Actions attributed to the admin who created the key
- Key auto-revokes if the admin loses committee access
- Rate limited to 60 req/min
- Recommended policy: allow `commo_api` only, deny shell tools

## What the agent can't do

- Upload images (club logo, member photos) — use the web dashboard
- Connect GoCardless — browser-based OAuth flow
- Receive webhooks — the server handles these automatically
