# commo-agent-stack

Commo membership platform integration for OpenClaw: **skill guidance + commo-api plugin runtime**.

Gives AI agents full access to the Commo API: members, invoices, billing, subscriptions, payments, reconciliation, GoCardless, leadership, join requests, settings, and API key management.

## Components

- `SKILL.md` — behavior guidance and API domain overview
- `plugins/commo-api/` — `commo_api` runtime tool (generic HTTP proxy)
- `references/api.md` — complete endpoint reference with parameters

## Runtime config (OpenClaw)

Configure under `skills.entries.commo-api.env`:

- `COMMO_ENV=dev|prod`
- `COMMO_DEV_BASE_URL` — dev server URL (e.g. `http://localhost:8787`)
- `COMMO_DEV_API_KEY` — dev API key (`cmk_...`)
- `COMMO_PROD_BASE_URL` — prod server URL
- `COMMO_PROD_API_KEY` — prod API key (`cmk_...`)

## Creating an API key

API keys are created via the Commo API itself (admin only):

```
POST /api/api-keys
Body: { "name": "Production Agent" }
Response: { "id": 1, "key": "cmk_...", "prefix": "cmk_abcd1234", "name": "Production Agent" }
```

The raw key is returned once on creation. Store it securely.

## SecretRef usage

Use refs instead of plaintext keys:

- `COMMO_DEV_API_KEY=sops://COMMO_DEV_API_KEY`
- `COMMO_PROD_API_KEY=sops://COMMO_PROD_API_KEY`

The plugin resolves `sops://...` refs from `~/.openclaw/secrets/secrets.enc.json` at runtime.

## Security posture (org agent)

Recommended org-facing agent policy:

- allow: `commo_api` (and optional `read`)
- deny: runtime shell tools (`exec`, `process`, `bash`) and cross-session tooling

## Excluded routes

The plugin handles all JSON REST endpoints. These are excluded:
- Multipart uploads (logo, avatar) — use the web UI
- GoCardless OAuth redirect flows — browser-based
- Inbound webhooks — the server receives these
