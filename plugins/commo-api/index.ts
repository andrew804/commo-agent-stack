import { execFileSync } from "node:child_process";

type JsonRecord = Record<string, unknown>;
type SecretMap = Record<string, string>;

const SOPS_REF_PREFIX = "sops://";
const DEFAULT_SOPS_FILE = `${process.env.HOME || ""}/.openclaw/secrets/secrets.enc.json`;

let sopsCache: SecretMap | null = null;

function loadSopsSecrets(): SecretMap {
  if (sopsCache) return sopsCache;
  const raw = execFileSync("sops", ["-d", DEFAULT_SOPS_FILE], { encoding: "utf8" });
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Invalid SOPS secrets document");
  }
  const out: SecretMap = {};
  for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof v === "string") out[k] = v;
  }
  sopsCache = out;
  return out;
}

function resolveSecretRef(rawValue: string, keyName: string): string {
  const value = String(rawValue ?? "").trim();
  if (!value) return "";
  if (!value.startsWith(SOPS_REF_PREFIX)) return value;
  const secretKey = value.slice(SOPS_REF_PREFIX.length).trim();
  if (!secretKey) throw new Error(`Invalid secret ref for ${keyName}: missing key name`);
  const secrets = loadSopsSecrets();
  const resolved = String(secrets[secretKey] ?? "").trim();
  if (!resolved) throw new Error(`Missing SOPS secret for ${keyName}: ${secretKey}`);
  return resolved;
}

function getCommoEnv(api: any): { baseUrl: string; apiKey: string; envName: string } {
  const cfg = api?.runtime?.config?.loadConfig?.() ?? {};
  const envCfg =
    cfg?.skills?.entries?.["commo-api"]?.env &&
    typeof cfg.skills.entries["commo-api"].env === "object"
      ? cfg.skills.entries["commo-api"].env
      : {};

  const envNameRaw = String(envCfg.COMMO_ENV ?? "dev").toLowerCase();
  const envName = envNameRaw === "prod" ? "prod" : "dev";

  const urlKey = envName === "prod" ? "COMMO_PROD_BASE_URL" : "COMMO_DEV_BASE_URL";
  const tokenKey = envName === "prod" ? "COMMO_PROD_API_KEY" : "COMMO_DEV_API_KEY";

  const baseUrl = String(envCfg[urlKey] ?? "").trim().replace(/\/+$/, "");
  const apiKey = resolveSecretRef(String(envCfg[tokenKey] ?? ""), tokenKey);

  if (!baseUrl || !apiKey) {
    throw new Error(`Commo env not configured: missing ${urlKey} and/or ${tokenKey}`);
  }

  return { baseUrl, apiKey, envName };
}

const ALLOWED_METHODS = new Set(["GET", "POST", "PATCH", "DELETE"]);

export default function register(api: any) {
  api.registerTool(
    {
      name: "commo_api",
      description:
        "Administer City of Peterborough Swimming Club (COPS). Manage swimmers, families, invoices, payments, subscriptions, committee roles, join requests, bank reconciliation, and GoCardless direct debits. See references/api.md for available operations.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          method: {
            type: "string",
            enum: ["GET", "POST", "PATCH", "DELETE"],
            description: "HTTP method",
          },
          path: {
            type: "string",
            description:
              "API path, e.g. /api/members, /api/invoices/5, /api/invoices/5/actions",
          },
          body: {
            type: "object",
            additionalProperties: true,
            description: "Request body (for POST/PATCH). Omit for GET/DELETE.",
          },
        },
        required: ["method", "path"],
      },
      async execute(
        _id: string,
        params: { method: string; path: string; body?: JsonRecord },
      ) {
        try {
          const method = (params?.method || "").toUpperCase();
          if (!ALLOWED_METHODS.has(method)) {
            throw new Error(
              `Invalid method: ${method}. Use GET, POST, PATCH, or DELETE.`,
            );
          }

          const path = params?.path || "";
          if (!path.startsWith("/api/") && path !== "/health") {
            throw new Error(
              `Invalid path: ${path}. Must start with /api/ or be /health.`,
            );
          }

          const { baseUrl, apiKey, envName } = getCommoEnv(api);
          const url = `${baseUrl}${path}`;

          const headers: Record<string, string> = {
            Authorization: `Bearer ${apiKey}`,
          };

          const fetchOpts: RequestInit = { method, headers };

          if (params?.body && (method === "POST" || method === "PATCH")) {
            headers["Content-Type"] = "application/json";
            fetchOpts.body = JSON.stringify(params.body);
          }

          const res = await fetch(url, fetchOpts);

          let responseBody: unknown;
          try {
            responseBody = await res.json();
          } catch {
            responseBody = await res.text();
          }

          const out = {
            ok: res.ok,
            status: res.status,
            method,
            path,
            env: envName,
            response: responseBody,
          };

          return {
            content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
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
