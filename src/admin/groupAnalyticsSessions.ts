/**
 * Group flat analytics events into user sessions.
 * A new session starts when the user changes or the gap since the previous
 * event's exit is greater than SESSION_GAP_MS (no sessionId on the API).
 */

export const SESSION_GAP_MS = 30 * 60 * 1000;

export type AnalyticsUser = {
  id: string;
  name: string;
  username: string;
};

export type AnalyticsSession = {
  key: string;
  user: AnalyticsUser;
  screens: string[];
  totalMs: number;
  startedAt: string;
  endedAt: string;
  eventCount: number;
};

export function analyticsUserOf(ev: Record<string, unknown>): AnalyticsUser {
  const raw = ev.userId;
  if (raw && typeof raw === 'object') {
    const u = raw as { _id?: unknown; username?: string; displayName?: string };
    return {
      id: String(u._id ?? ''),
      name: String(u.displayName || u.username || 'Unknown'),
      username: String(u.username || ''),
    };
  }
  return { id: String(raw ?? ''), name: 'Unknown', username: '' };
}

export function screenLabelOf(ev: Record<string, unknown>): string {
  if (ev.type === 'auth') {
    const action = String(ev.action || 'auth');
    return action.charAt(0).toUpperCase() + action.slice(1);
  }
  const screen = String(ev.screen || ev.path || 'unknown').replace(/^\/+/, '');
  if (!screen) return 'Unknown';
  return screen.charAt(0).toUpperCase() + screen.slice(1);
}

function eventBounds(ev: Record<string, unknown>): { start: number; end: number } {
  const start = new Date(String(ev.enteredAt || ev.occurredAt || 0)).getTime();
  const end = new Date(String(ev.exitedAt || ev.occurredAt || 0)).getTime();
  const s = Number.isFinite(start) ? start : 0;
  const e = Number.isFinite(end) ? end : s;
  return { start: s, end: Math.max(e, s) };
}

export function groupAnalyticsSessions(
  items: Record<string, unknown>[],
  gapMs: number = SESSION_GAP_MS
): AnalyticsSession[] {
  const sorted = [...items].sort((a, b) => {
    const ua = analyticsUserOf(a).id;
    const ub = analyticsUserOf(b).id;
    if (ua !== ub) return ua.localeCompare(ub);
    return eventBounds(a).start - eventBounds(b).start;
  });

  const sessions: AnalyticsSession[] = [];
  let cur: AnalyticsSession | null = null;
  let curEnd = 0;

  for (const ev of sorted) {
    const user = analyticsUserOf(ev);
    const { start, end } = eventBounds(ev);
    const label = screenLabelOf(ev);
    const isAuth = ev.type === 'auth';
    const duration = isAuth
      ? 0
      : Number(ev.durationMs ?? 0) || Math.max(0, end - start);

    const needsNew =
      !cur ||
      cur.user.id !== user.id ||
      start - curEnd > gapMs;

    if (needsNew) {
      cur = {
        key: `${user.id || 'anon'}-${start}-${sessions.length}`,
        user,
        screens: [],
        totalMs: 0,
        startedAt: new Date(start).toISOString(),
        endedAt: new Date(end).toISOString(),
        eventCount: 0,
      };
      sessions.push(cur);
      curEnd = end;
    }

    const session = cur!;
    session.eventCount += 1;
    if (!session.screens.includes(label)) session.screens.push(label);
    session.totalMs += duration;
    if (start < new Date(session.startedAt).getTime()) {
      session.startedAt = new Date(start).toISOString();
    }
    if (end > curEnd) {
      curEnd = end;
      session.endedAt = new Date(end).toISOString();
    }
  }

  return sessions;
}

/** e.g. "20 Aug 2026, 12:23 pm → 12:45 pm" (same day) or full range across days. */
export function fmtSessionRange(startedAt: string, endedAt: string): string {
  const start = new Date(startedAt);
  const end = new Date(endedAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '—';

  const dateOpts: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const timeOpts: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const startDate = start.toLocaleDateString('en-IN', dateOpts);
  const endDate = end.toLocaleDateString('en-IN', dateOpts);
  const startTime = start.toLocaleTimeString('en-IN', timeOpts);
  const endTime = end.toLocaleTimeString('en-IN', timeOpts);

  if (startDate === endDate) {
    return `${startDate}, ${startTime} → ${endTime}`;
  }
  return `${startDate}, ${startTime} → ${endDate}, ${endTime}`;
}

// --- self-check (node --experimental-strip-types or paste into node) ---
export function selfCheckGroupAnalyticsSessions(): void {
  const base = Date.parse('2026-08-20T06:53:00.000Z');
  const user = { _id: 'u1', displayName: 'Jhansi', username: 'jhansi' };
  const mk = (i: number, screen: string, offsetMs: number, dur: number) => ({
    _id: `e${i}`,
    type: 'screen_time',
    userId: user,
    screen,
    occurredAt: new Date(base + offsetMs).toISOString(),
    enteredAt: new Date(base + offsetMs).toISOString(),
    exitedAt: new Date(base + offsetMs + dur).toISOString(),
    durationMs: dur,
  });

  const sameSession = groupAnalyticsSessions([
    mk(1, 'settings', 0, 34_000),
    mk(2, 'profile', 40_000, 2_000),
    mk(3, 'search', 50_000, 2_000),
  ]);
  if (sameSession.length !== 1) throw new Error(`expected 1 session, got ${sameSession.length}`);
  if (sameSession[0].screens.join(',') !== 'Settings,Profile,Search') {
    throw new Error(`screens ${sameSession[0].screens.join(',')}`);
  }
  if (sameSession[0].totalMs !== 38_000) throw new Error(`totalMs ${sameSession[0].totalMs}`);

  const split = groupAnalyticsSessions([
    mk(1, 'feed', 0, 5_000),
    mk(2, 'explore', SESSION_GAP_MS + 60_000, 5_000),
  ]);
  if (split.length !== 2) throw new Error(`expected 2 sessions after gap, got ${split.length}`);
}
