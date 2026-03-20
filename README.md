# commo-agent-stack

Commo agent stack for OpenClaw: skill guidance + dedicated API plugin.

## What matters for agents

- `SKILL.md` is the authoritative skill definition.
- `references/api.md` contains endpoint and payload reference details.
- `plugins/commo-api/` provides the dedicated `commo_task` tool.

## Runtime configuration

Set values (or SecretRefs) under:

- `skills.entries.commo-api.env.COMMO_ENV`
- `skills.entries.commo-api.env.COMMO_DEV_WORKFLOW_ROOT`
- `skills.entries.commo-api.env.COMMO_DEV_API_TOKEN`
- `skills.entries.commo-api.env.COMMO_PROD_WORKFLOW_ROOT`
- `skills.entries.commo-api.env.COMMO_PROD_API_TOKEN`

## Repository layout

- `SKILL.md` — Commo skill guidance
- `references/` — API endpoint and payload references
- `plugins/commo-api/` — dedicated OpenClaw plugin tool for Commo API actions
