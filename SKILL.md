---
name: commo-api
description: Control the Commo service through workflow API endpoints for task CRUD operations (create, read, update, archive, search). Use when the user asks to manage tasks in Commo, seed test tasks, or run operational checks against Commo task workflows.
---

# Commo API Skill

Use this skill with the dedicated `commo_task` plugin tool.

## Runtime config keys

Configure these keys under `skills.entries.commo-api.env` (literal values or SecretRefs):

- `COMMO_ENV` (`dev` or `prod`)
- `COMMO_DEV_WORKFLOW_ROOT`
- `COMMO_DEV_API_TOKEN`
- `COMMO_PROD_WORKFLOW_ROOT`
- `COMMO_PROD_API_TOKEN`

## Supported actions

- `create_task` (requires `title`)
- `get_task` (requires `id`)
- `update_task` (requires `id`)
- `archive_task` (requires `id`)
- `search_tasks` (optional `status`, `query`, `limit`)
- `seed_tasks` (optional `count`, default 10)

## Security notes

- Prefer plugin tool access over shell execution.
- For locked-down org agents, allow only `commo_task` (and optional `read`) and deny runtime shell tools.
