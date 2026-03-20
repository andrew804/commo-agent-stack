const ACTIONS = {
  create_task: { endpoint: "create-task", required: ["title"] },
  get_task: { endpoint: "get-task", required: ["id"] },
  update_task: { endpoint: "update-task", required: ["id"] },
  archive_task: { endpoint: "archive-task", required: ["id"] },
  search_tasks: { endpoint: "search-tasks", required: [] },
  seed_tasks: { endpoint: "seed-tasks", required: [] },
} as const;

type Action = keyof typeof ACTIONS;

type JsonRecord = Record<string, unknown>;

function asRecord(v: unknown): JsonRecord {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as JsonRecord) : {};
}

function getCommoEnv(api: any): { root: string; token: string; envName: string } {
  const cfg = api?.runtime?.config?.loadConfig?.() ?? {};
  const envCfg =
    cfg?.skills?.entries?.["commo-api"]?.env &&
    typeof cfg.skills.entries["commo-api"].env === "object"
      ? cfg.skills.entries["commo-api"].env
      : {};

  const envNameRaw = String(envCfg.COMMO_ENV ?? "dev").toLowerCase();
  const envName = envNameRaw === "prod" ? "prod" : "dev";

  const rootKey = envName === "prod" ? "COMMO_PROD_WORKFLOW_ROOT" : "COMMO_DEV_WORKFLOW_ROOT";
  const tokenKey = envName === "prod" ? "COMMO_PROD_API_TOKEN" : "COMMO_DEV_API_TOKEN";

  const root = String(envCfg[rootKey] ?? "").trim().replace(/\/+$/, "");
  const token = String(envCfg[tokenKey] ?? "").trim();

  if (!root || !token) {
    throw new Error(`Commo env is not configured: missing ${rootKey} and/or ${tokenKey}`);
  }

  return { root, token, envName };
}

function validateRequired(action: Action, payload: JsonRecord) {
  const missing = ACTIONS[action].required.filter((k) => {
    const v = payload[k];
    return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
  });
  if (missing.length > 0) {
    throw new Error(`Missing required fields for ${action}: ${missing.join(", ")}`);
  }
}

export default function register(api: any) {
  api.registerTool(
    {
      name: "commo_task",
      description:
        "Run approved Commo workflows only (create_task, get_task, update_task, archive_task, search_tasks, seed_tasks).",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          action: {
            type: "string",
            enum: Object.keys(ACTIONS),
          },
          payload: {
            type: "object",
            additionalProperties: true,
          },
        },
        required: ["action"],
      },
      async execute(_id: string, params: { action: Action; payload?: JsonRecord }) {
        try {
          const action = params?.action;
          if (!action || !(action in ACTIONS)) {
            throw new Error("Invalid action");
          }

          const payload = asRecord(params?.payload ?? {});
          validateRequired(action, payload);

          const { root, token, envName } = getCommoEnv(api);
          const endpoint = ACTIONS[action].endpoint;
          const url = `${root}/${endpoint}`;

          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          let responseBody: unknown;
          try {
            responseBody = await res.json();
          } catch {
            responseBody = await res.text();
          }

          const out = {
            ok: res.ok,
            status: res.status,
            action,
            env: envName,
            response: responseBody,
          };

          return {
            content: [{ type: "text", text: JSON.stringify(out) }],
          };
        } catch (err: any) {
          const out = {
            ok: false,
            error: err?.message || String(err),
          };
          return {
            content: [{ type: "text", text: JSON.stringify(out) }],
          };
        }
      },
    },
    { optional: true },
  );
}
