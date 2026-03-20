---
name: commo-api
description: Control the Commo service through workflow API endpoints for task CRUD operations (create, read, update, archive, search). Use when the user asks to manage tasks in Commo, seed test tasks, or run operational checks against Commo task workflows.
---

# Commo Control

Use this skill with the dedicated `commo_task` plugin tool to perform task operations in Commo.

## Quick Start

1. Set environment mode:
   - `COMMO_ENV=dev` or `COMMO_ENV=prod`
2. Configure both environments (recommended):
   - `COMMO_DEV_WORKFLOW_ROOT`
   - `COMMO_DEV_API_TOKEN`
   - `COMMO_PROD_WORKFLOW_ROOT`
   - `COMMO_PROD_API_TOKEN`
3. Call the `commo_task` tool with:
   - `action`
   - `payload` (JSON object)

## Supported Actions

- `create_task` (requires `title`)
- `get_task` (requires `id`)
- `update_task` (requires `id`)
- `archive_task` (requires `id`)
- `search_tasks` (optional `status`, `query`, `limit`)
- `seed_tasks` (optional `count`, default 10)

## Security Notes

- Prefer plugin tool access over shell execution.
- For locked-down org agents, allow only `commo_task` (and optional `read`) and deny runtime shell tools.


## Secret References
Use secret refs in config instead of plaintext tokens:
- `COMMO_DEV_API_TOKEN=sops://COMMO_DEV_API_TOKEN`
- `COMMO_PROD_API_TOKEN=sops://COMMO_PROD_API_TOKEN`
The plugin resolves these refs from `~/.openclaw/secrets/secrets.enc.json` at runtime.
