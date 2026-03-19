---
name: commo-control
description: Control the Commo service through workflow API endpoints for task CRUD operations (create, read, update, archive, search). Use when the user asks to manage tasks in Commo, seed test tasks, or run operational checks against Commo task workflows.
---

# Commo Control

Use this skill to perform task operations in the Commo service via authenticated workflow APIs.

## Quick Start

1. Ensure env vars exist:
   - `COMMO_API_TOKEN`
   - `COMMO_WORKFLOW_ROOT` (default: `https://app.commocommunities.com/version-test/api/1.1/wf`)
2. Run the tool script:
   - `node scripts/commo-task.mjs create_task '{"title":"Example"}'`

## Supported Actions

- `create_task` (requires `title`)
- `get_task` (requires `id`)
- `update_task` (requires `id`)
- `archive_task` (requires `id`)
- `search_tasks` (optional `status`, `query`, `limit`)
- `seed_tasks` (optional `count`, default 10)

## Workflow

1. Validate required fields for the selected action.
2. Send POST request to `${COMMO_WORKFLOW_ROOT}/{endpoint}`.
3. Include bearer token header: `Authorization: Bearer ...`.
4. Normalize output and surface `ok`, `status`, and `response`.

## Notes

- Prefer `archive_task` over hard delete.
- Keep status values consistent (`open`, `in_progress`, `done`, `archived`).
- Use `version-test` for validation; move to live root only after verification.

## References

See `references/api.md` for endpoint mappings and payload examples.
