# Commo Task API Reference

## Base URL

- Workflow API root: `https://app.commocommunities.com/version-test/api/1.1/wf`

## Auth

- Header: `Authorization: Bearer <COMMO_API_TOKEN>`

## Endpoints

- `oc_create_task`
- `oc_get_task`
- `oc_update_task`
- `oc_archive_task`
- `oc_search_tasks`

## Common metadata sent by tool

```json
{
  "request_id": "uuid",
  "action": "create_task",
  "actor": "openclaw",
  "ts": 1760000000
}
```

## Example create payload

```json
{
  "request_id": "uuid",
  "action": "create_task",
  "actor": "openclaw",
  "ts": 1760000000,
  "title": "Example task",
  "status": "open",
  "notes": "optional",
  "due_at": "2026-03-19T10:00:00Z"
}
```
