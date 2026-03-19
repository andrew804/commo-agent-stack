#!/usr/bin/env node
import crypto from "node:crypto";

const WORKFLOW_ROOT = process.env.COMMO_WORKFLOW_ROOT || "https://app.commocommunities.com/version-test/api/1.1/wf";
const TOKEN = process.env.COMMO_API_TOKEN;

if (!TOKEN) {
  console.error(JSON.stringify({ ok: false, error: "Missing COMMO_API_TOKEN" }, null, 2));
  process.exit(1);
}

const ACTIONS = {
  create_task: "oc_create_task",
  update_task: "oc_update_task",
  get_task: "oc_get_task",
  search_tasks: "oc_search_tasks",
  archive_task: "oc_archive_task"
};

function usage() {
  console.log(`Usage:\n  node scripts/commo-task.mjs <action> '<json-payload>'\n\nActions:\n  ${Object.keys(ACTIONS).join("\n  ")}\n  seed_tasks`);
}

function validate(action, data) {
  if (action === "create_task" && (!data?.title || typeof data.title !== "string")) {
    throw new Error("create_task requires string field: title");
  }
  if (["update_task", "get_task", "archive_task"].includes(action) && (!data?.id || typeof data.id !== "string")) {
    throw new Error(`${action} requires string field: id`);
  }
}

function body(action, data) {
  return {
    request_id: crypto.randomUUID(),
    action,
    actor: "openclaw",
    ts: Math.floor(Date.now() / 1000),
    ...data
  };
}

async function call(action, payload) {
  const endpoint = ACTIONS[action];
  const res = await fetch(`${WORKFLOW_ROOT}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${TOKEN}`
    },
    body: JSON.stringify(body(action, payload))
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { ok: res.ok, status: res.status, response: json };
}

function randomTask() {
  const verbs = ["Review", "Draft", "Plan", "Call", "Email", "Update", "Refactor", "Test", "Prepare", "Sync"];
  const objs = ["onboarding doc", "Q2 roadmap", "customer follow-up", "API checklist", "deploy notes", "invoice batch", "bug triage", "team agenda", "backup policy", "feature spec"];
  const statuses = ["open", "open", "in_progress"];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  return {
    title: `${pick(verbs)} ${pick(objs)} #${Math.floor(Math.random() * 900) + 100}`,
    status: pick(statuses),
    notes: "seeded by commo-control skill"
  };
}

async function seedTasks(count = 10) {
  const results = [];
  for (let i = 0; i < count; i++) {
    const r = await call("create_task", randomTask());
    results.push(r);
  }
  return results;
}

async function main() {
  const [, , action, payloadRaw] = process.argv;
  if (!action) return usage();

  if (action === "seed_tasks") {
    const payload = payloadRaw ? JSON.parse(payloadRaw) : {};
    const count = Number(payload.count || 10);
    const seeded = await seedTasks(count);
    console.log(JSON.stringify({ ok: true, count, seeded }, null, 2));
    return;
  }

  if (!ACTIONS[action]) return usage();

  let payload = {};
  if (payloadRaw) {
    try { payload = JSON.parse(payloadRaw); } catch { throw new Error("Payload must be valid JSON"); }
  }

  validate(action, payload);
  const result = await call(action, payload);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: err.message }, null, 2));
  process.exit(1);
});
