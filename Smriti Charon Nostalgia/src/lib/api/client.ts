import type { AuthTokens, Paginated } from "./types";

/** Base URL of the Smritocharon backend, e.g. http://localhost:4000 */
export const API_BASE = (
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "http://localhost:4000"
).replace(/\/$/, "");

const ACCESS_KEY = "smriti.accessToken";
const REFRESH_KEY = "smriti.refreshToken";

const browser = () => typeof window !== "undefined";

export const tokenStore = {
  access: () => (browser() ? localStorage.getItem(ACCESS_KEY) : null),
  refresh: () => (browser() ? localStorage.getItem(REFRESH_KEY) : null),
  set(tokens: AuthTokens) {
    if (!browser()) return;
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
    window.dispatchEvent(new Event("smriti-auth"));
  },
  clear() {
    if (!browser()) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    window.dispatchEvent(new Event("smriti-auth"));
  },
};

export class ApiError extends Error {
  code: string;
  status: number;
  fields?: Record<string, string[]>;

  constructor(status: number, code: string, message: string, fields?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    if (fields) this.fields = fields;
  }
}

type Envelope<T> = {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details?: { fields?: Record<string, string[]> } } | null;
};

export type RequestOptions = {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  /** multipart/form-data payload; when set, `body` is ignored. */
  form?: FormData;
  auth?: boolean;
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

let refreshing: Promise<boolean> | null = null;

/** Rotate the refresh token once; concurrent callers share the same attempt. */
async function refreshSession(): Promise<boolean> {
  if (refreshing) return refreshing;
  const refreshToken = tokenStore.refresh();
  if (!refreshToken) return false;

  refreshing = (async () => {
    try {
      const res = await fetch(buildUrl("/api/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const json = (await res.json()) as Envelope<{ tokens: AuthTokens }>;
      if (!res.ok || !json.success || !json.data) {
        tokenStore.clear();
        return false;
      }
      tokenStore.set(json.data.tokens);
      return true;
    } catch {
      return false;
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
}

async function once<T>(path: string, options: RequestOptions): Promise<Response> {
  const headers: Record<string, string> = {};
  if (options.auth !== false) {
    const token = tokenStore.access();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  let body: BodyInit | undefined;
  if (options.form) {
    body = options.form;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }
  const init: RequestInit = { method: options.method ?? "GET", headers };
  if (body !== undefined) init.body = body;
  if (options.signal) init.signal = options.signal;
  return fetch(buildUrl(path, options.query), init);
}

/** Perform an API request, unwrapping the `{ success, data, error }` envelope. */
export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let res: Response;
  try {
    res = await once(path, options);
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Could not reach the server");
  }

  if (res.status === 401 && options.auth !== false && tokenStore.refresh()) {
    if (await refreshSession()) {
      res = await once(path, options);
    }
  }

  if (res.status === 204) return undefined as T;

  let json: Envelope<T> | null = null;
  const text = await res.text();
  if (text) {
    try {
      json = JSON.parse(text) as Envelope<T>;
    } catch {
      json = null;
    }
  }

  if (!res.ok || !json || json.success === false) {
    const code = json?.error?.code ?? (res.status === 429 ? "RATE_LIMITED" : "SERVER_ERROR");
    const message = json?.error?.message ?? `Request failed (${res.status})`;
    const fields = json?.error?.details?.fields;
    if (res.status === 401 && options.auth !== false) tokenStore.clear();
    throw new ApiError(res.status, code, message, fields);
  }

  return json.data as T;
}

/** Absolute URL for a `/media/...` path returned by the API. */
export function mediaUrl(path?: string | null, shareToken?: string) {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  const base = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const token = shareToken ?? tokenStore.access();
  if (!token) return base;
  const sep = base.includes("?") ? "&" : "?";
  // Media supports Bearer auth or ?token= (public shares). Query param keeps <img>/<video> simple.
  return shareToken ? `${base}${sep}token=${encodeURIComponent(shareToken)}` : base;
}

export type { Paginated };
