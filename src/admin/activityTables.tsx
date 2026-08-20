import { useState, Fragment } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { fmtDate, fmtMs, idOf } from './api';
import { Empty, TableWrap, td, th } from './ui';
import {
  analyticsUserOf as analyticsUser,
  fmtSessionRange,
  screenLabelOf as screenLabel,
  type AnalyticsSession,
} from './groupAnalyticsSessions';

function screenChipClass(label: string): string {
  const key = label.toLowerCase();
  if (key === 'feed') return 'bg-coral-100 text-coral-800';
  if (key === 'explore') return 'bg-amber-100 text-amber-900';
  if (key === 'profile') return 'bg-ink-100 text-ink-800';
  if (key === 'settings') return 'bg-cream-200 text-cream-900';
  if (key === 'search') return 'bg-success-500/15 text-success-700';
  if (key === 'notifications') return 'bg-warning-500/15 text-amber-800';
  if (key === 'login' || key === 'signup' || key === 'logout') return 'bg-ink-800/10 text-ink-800';
  return 'bg-ink-950/5 text-ink-700';
}

type DeviceInfo = {
  platform?: string;
  model?: string;
  os?: string;
  appVersion?: string;
  appBuild?: string;
  deviceId?: string;
};

function deviceOf(ev: Record<string, unknown>): DeviceInfo | null {
  const d = ev.device;
  if (!d || typeof d !== 'object') return null;
  return d as DeviceInfo;
}

function deviceShort(d: DeviceInfo | null): string {
  if (!d) return '—';
  const bits = [d.model, d.platform, d.os].filter(Boolean);
  return bits.length ? bits.join(' · ') : '—';
}

function deviceDetailLines(d: DeviceInfo | null): Array<[string, string]> {
  if (!d) return [['Device', 'Not recorded']];
  return [
    ['Phone', d.model || '—'],
    ['Platform', d.platform || '—'],
    ['OS', d.os || '—'],
    ['App', d.appVersion ? `v${d.appVersion}${d.appBuild ? ` (${d.appBuild})` : ''}` : '—'],
    ['Device id', d.deviceId || '—'],
  ];
}

export function ActivityTable({
  items,
  showUser,
  empty,
  sort = 'occurredAt',
  dir = 'desc',
  onSort,
  onRowClick,
  expandable = false,
}: {
  items: Record<string, unknown>[];
  showUser: boolean;
  empty: string;
  sort?: 'occurredAt' | 'durationMs';
  dir?: 'asc' | 'desc';
  onSort?: (key: 'occurredAt' | 'durationMs') => void;
  onRowClick?: (userId: string) => void;
  /** User personal page — tap a row for auth/device detail. */
  expandable?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (!items.length) return <Empty text={empty} />;

  function SortHead({
    label,
    column,
    align = 'center',
  }: {
    label: string;
    column: 'occurredAt' | 'durationMs';
    align?: 'left' | 'center' | 'right';
  }) {
    const active = sort === column;
    const Icon = active && dir === 'asc' ? ChevronUp : ChevronDown;
    return (
      <th className={`${th} ${align === 'left' ? 'text-left' : 'text-center'}`}>
        <button
          type="button"
          className={`inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:text-coral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500/40 ${
            active ? 'text-coral-700' : 'text-ink-500'
          } ${align === 'left' ? '' : 'w-full justify-center'}`}
          onClick={(e) => {
            e.stopPropagation();
            onSort?.(column);
          }}
          aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}
        >
          {label}
          <Icon className={`h-3.5 w-3.5 ${active ? 'opacity-100' : 'opacity-40'}`} aria-hidden />
        </button>
      </th>
    );
  }

  const colCount = (showUser ? 1 : 0) + 3;

  return (
    <TableWrap>
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-ink-950/8">
            {showUser ? <th className={th}>User</th> : null}
            <th className={`${th} text-left`}>{expandable ? 'Activity' : 'Screen'}</th>
            <SortHead label={expandable ? 'Detail' : 'Time spent'} column="durationMs" />
            <SortHead label="When (IST)" column="occurredAt" />
          </tr>
        </thead>
        <tbody>
          {items.map((ev) => {
            const rowId = idOf(ev);
            const user = analyticsUser(ev);
            const label = screenLabel(ev);
            const isAuth = ev.type === 'auth';
            const duration = isAuth ? null : Number(ev.durationMs ?? 0);
            const device = deviceOf(ev);
            const open = expandable && openId === rowId;
            const navClick = Boolean(onRowClick && user.id);
            return (
              <Fragment key={rowId}>
                <tr
                  className={`border-t border-ink-950/5 transition-colors ${
                    expandable || navClick ? 'cursor-pointer hover:bg-coral-500/5' : ''
                  } ${open ? 'bg-coral-500/5' : ''}`}
                  onClick={() => {
                    if (expandable) {
                      setOpenId(open ? null : rowId);
                      return;
                    }
                    if (navClick) onRowClick!(user.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    if (expandable) setOpenId(open ? null : rowId);
                    else if (navClick) onRowClick!(user.id);
                  }}
                  tabIndex={expandable || navClick ? 0 : undefined}
                  role={expandable || navClick ? 'button' : undefined}
                >
                  {showUser ? (
                    <td className={`${td} whitespace-normal`}>
                      <div className="flex flex-col items-center">
                        <p className="font-medium text-ink-950">{user.name}</p>
                        <p className="mt-0.5 text-xs text-ink-500">
                          {user.username ? `@${user.username}` : '—'}
                        </p>
                      </div>
                    </td>
                  ) : null}
                  <td className={`${td} text-left`}>
                    <span
                      className={`inline-flex max-w-full truncate rounded-md px-2 py-1 text-xs font-semibold tracking-wide ${screenChipClass(label)}`}
                    >
                      {label}
                    </span>
                  </td>
                  <td className={td}>
                    {isAuth ? (
                      <span className="text-xs text-ink-600">{deviceShort(device)}</span>
                    ) : duration == null ? (
                      <span className="text-ink-400">—</span>
                    ) : (
                      <span className="font-display text-base font-bold tabular-nums text-ink-950">
                        {fmtMs(duration)}
                      </span>
                    )}
                  </td>
                  <td className={`${td} text-ink-600`}>{fmtDate(ev.occurredAt as string)}</td>
                </tr>
                {open ? (
                  <tr className="border-t border-ink-950/5 bg-cream-50/80">
                    <td colSpan={colCount} className="px-4 py-3 text-left">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-coral-700">
                        {isAuth
                          ? `${label} · ${fmtDate(ev.occurredAt as string)} IST`
                          : `${label} · ${fmtMs(Number(ev.durationMs ?? 0))} · ${fmtDate(ev.occurredAt as string)} IST`}
                      </p>
                      {isAuth ? (
                        <dl className="mt-2 grid gap-1.5 text-sm sm:grid-cols-2">
                          {deviceDetailLines(device).map(([k, v]) => (
                            <div key={k} className="flex gap-2">
                              <dt className="w-20 shrink-0 text-ink-500">{k}</dt>
                              <dd className="min-w-0 break-all font-medium text-ink-900">{v}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <dl className="mt-2 grid gap-1.5 text-sm sm:grid-cols-2">
                          <div className="flex gap-2">
                            <dt className="w-20 shrink-0 text-ink-500">Path</dt>
                            <dd className="font-medium text-ink-900">{String(ev.path || '—')}</dd>
                          </div>
                          <div className="flex gap-2">
                            <dt className="w-20 shrink-0 text-ink-500">Exit</dt>
                            <dd className="font-medium text-ink-900">{String(ev.exitReason || '—')}</dd>
                          </div>
                        </dl>
                      )}
                      <p className="mt-2 text-xs text-ink-400">Tap the row again to close</p>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function SessionActivityTable({
  sessions,
  showUser,
  empty,
  sort = 'occurredAt',
  dir = 'desc',
  onSort,
  onRowClick,
}: {
  sessions: AnalyticsSession[];
  showUser: boolean;
  empty: string;
  sort?: 'occurredAt' | 'durationMs';
  dir?: 'asc' | 'desc';
  onSort?: (key: 'occurredAt' | 'durationMs') => void;
  onRowClick?: (userId: string) => void;
}) {
  if (!sessions.length) return <Empty text={empty} />;

  function SortHead({
    label,
    column,
    align = 'center',
  }: {
    label: string;
    column: 'occurredAt' | 'durationMs';
    align?: 'left' | 'center' | 'right';
  }) {
    const active = sort === column;
    const Icon = active && dir === 'asc' ? ChevronUp : ChevronDown;
    return (
      <th className={`${th} ${align === 'left' ? 'text-left' : 'text-center'}`}>
        <button
          type="button"
          className={`inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:text-coral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500/40 ${
            active ? 'text-coral-700' : 'text-ink-500'
          } ${align === 'left' ? '' : 'w-full justify-center'}`}
          onClick={(e) => {
            e.stopPropagation();
            onSort?.(column);
          }}
          aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}
        >
          {label}
          <Icon className={`h-3.5 w-3.5 ${active ? 'opacity-100' : 'opacity-40'}`} aria-hidden />
        </button>
      </th>
    );
  }

  return (
    <TableWrap>
      <table className="min-w-full table-fixed">
        <thead>
          <tr className="border-b border-ink-950/8">
            {showUser ? (
              <th className={`${th} w-[30%] text-left`} style={{ width: '30%' }}>
                User
              </th>
            ) : null}
            <th className={`${th} text-left`}>Screens</th>
            <SortHead label="Time spent" column="durationMs" />
            <SortHead label="Session (IST)" column="occurredAt" />
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => {
            const clickable = Boolean(onRowClick && session.user.id);
            return (
              <tr
                key={session.key}
                className={`border-t border-ink-950/5 transition-colors ${
                  clickable ? 'cursor-pointer hover:bg-coral-500/5' : ''
                }`}
                onClick={clickable ? () => onRowClick!(session.user.id) : undefined}
                onKeyDown={
                  clickable
                    ? (e) => {
                        if (e.key === 'Enter') onRowClick!(session.user.id);
                      }
                    : undefined
                }
                tabIndex={clickable ? 0 : undefined}
                role={clickable ? 'link' : undefined}
              >
                {showUser ? (
                  <td className={`${td} w-[30%] whitespace-normal text-left`} style={{ width: '30%' }}>
                    <div className="flex flex-col items-start">
                      <p className="font-medium text-ink-950">{session.user.name}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {session.user.username ? `@${session.user.username}` : '—'}
                      </p>
                    </div>
                  </td>
                ) : null}
                <td className={`${td} whitespace-normal text-left`}>
                  <div className="flex flex-wrap justify-start gap-1.5">
                    {session.screens.map((label) => (
                      <span
                        key={`${session.key}-${label}`}
                        className={`inline-flex max-w-full truncate rounded-md px-2 py-1 text-xs font-semibold tracking-wide ${screenChipClass(label)}`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </td>
                <td className={td}>
                  {session.totalMs <= 0 ? (
                    <span className="text-ink-400">—</span>
                  ) : (
                    <span className="font-display text-base font-bold tabular-nums text-ink-950">
                      {fmtMs(session.totalMs)}
                    </span>
                  )}
                </td>
                <td className={`${td} whitespace-normal text-ink-600`}>
                  <span className="text-xs leading-relaxed tabular-nums">
                    {fmtSessionRange(session.startedAt, session.endedAt)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableWrap>
  );
}
