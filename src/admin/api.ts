const TOKEN_KEY = 'bt_admin_token';

/** Production API (nginx: `/api/` → backend). Override with VITE_API_BASE if needed. */
const LIVE_API_BASE = 'https://be-ther.com/api';

export function apiBase(): string {
  const raw = (import.meta.env.VITE_API_BASE as string | undefined)?.trim();
  return (raw || LIVE_API_BASE).replace(/\/$/, '');
}

export function getToken(): string {
  return sessionStorage.getItem(TOKEN_KEY) ?? '';
}

export function setSession(token: string, email: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem('bt_admin_email', email);
}

export function clearSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem('bt_admin_email');
}

export function adminEmail(): string {
  return sessionStorage.getItem('bt_admin_email') ?? '';
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export function isAbortError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const name = (err as { name?: string }).name;
  return name === 'AbortError';
}

export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${apiBase()}${path}`, { ...init, headers });
  if (init.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  const json = (await res.json().catch(() => null)) as
    | { ok?: boolean; data?: T; error?: { message?: string } }
    | null;
  if (res.status === 401) {
    clearSession();
    throw new ApiError(json?.error?.message ?? 'Signed out', 401);
  }
  if (!res.ok || !json?.ok) {
    throw new ApiError(json?.error?.message ?? 'Request failed', res.status);
  }
  return json.data as T;
}

export function toQuery(params: Record<string, string | number | undefined | null>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export function dayStartIso(date: string): string {
  return new Date(`${date}T00:00:00.000Z`).toISOString();
}

export function dayEndIso(date: string): string {
  return new Date(`${date}T23:59:59.999Z`).toISOString();
}

const IST = 'Asia/Kolkata';

/** Admin timestamps in India Standard Time. */
export function fmtDate(raw: string | Date | undefined | null): string {
  if (!raw) return '—';
  const d = typeof raw === 'string' ? new Date(raw) : raw;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    timeZone: IST,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function fmtMs(ms: number): string {
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem === 0 ? `${h}h` : `${h}h ${rem}m`;
}

export function idOf(doc: { _id?: unknown }): string {
  const id = doc._id;
  if (id == null) return '';
  if (typeof id === 'string') return id;
  if (typeof id === 'object' && id !== null && '$oid' in id) {
    return String((id as { $oid: unknown }).$oid ?? '');
  }
  return String(id);
}
