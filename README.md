# commo-agent-stack

Commo integration stack for OpenClaw: **skill guidance + commo-api plugin runtime**.

## Components

- `SKILL.md` — behavior guidance for using Commo workflows
- `plugins/commo-api/` — dedicated `commo_task` runtime tool
- `references/api.md` — endpoint/payload reference

## Runtime config (OpenClaw)

Configure under `skills.entries.commo-api.env`:

- `COMMO_ENV=dev|prod`
- `COMMO_DEV_WORKFLOW_ROOT`
- `COMMO_DEV_API_TOKEN`
- `COMMO_PROD_WORKFLOW_ROOT`
- `COMMO_PROD_API_TOKEN`

## SecretRef usage

Use refs instead of plaintext tokens:

- `COMMO_DEV_API_TOKEN=sops://COMMO_DEV_API_TOKEN`
- `COMMO_PROD_API_TOKEN=sops://COMMO_PROD_API_TOKEN`

The plugin resolves `sops://...` token refs from `~/.openclaw/secrets/secrets.enc.json` at runtime.

## Security posture (org agent)

Recommended org-facing agent policy:

- allow: `commo_task` (and optional `read`)
- deny: runtime shell tools (`exec`, `process`, `bash`) and cross-session tooling
