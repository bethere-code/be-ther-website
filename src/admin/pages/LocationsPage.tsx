import { Building2, MapPin, MapPinOff, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { go } from '../../hooks/usePathRoute';
import { dayEndIso, dayStartIso, fmtDate, toQuery } from '../api';
import { useAdminQuery } from '../useAdminQuery';
import { useStickyState } from '../adminFilters';
import { todayIso } from '../dates';
import { DateRange, Empty, ErrorBox, fmtRangeLabel, Panel, StatCard, TableWrap, td, th } from '../ui';

type CityRow = { city: string; users: number; newInRange: number };
type Access = 'allowed' | 'denied' | 'blocked' | 'unanswered';

type Locations = {
  totals: {
    users: number;
    allowed: number;
    denied: number;
    blocked: number;
    unanswered: number;
    newUsers: number;
    newAllowed: number;
    firstEstimated: number;
    moved: number;
    cities: number;
    withFirstCity: number;
    withCurrentCity: number;
  };
  firstCities: CityRow[];
  currentCities: CityRow[];
  // moves: { from: string; to: string; users: number }[];
  noLocationZones: { timezone: string; users: number }[];
  eventCities: { city: string; events: number; newInRange: number }[];
  eventsWithCity: number;
  eventsWithoutCity: number;
  recent: {
    id: string;
    username: string;
    displayName: string;
    joinedAt: string;
    firstCity: string;
    currentCity: string;
    location: Access;
    timezone: string;
  }[];
};

const accessLabel: Record<Access, { text: string; cls: string }> = {
  allowed: { text: 'Allowed', cls: 'bg-success-500/10 text-success-700' },
  denied: { text: 'Denied', cls: 'bg-amber-100 text-amber-900' },
  blocked: { text: "Don't ask again", cls: 'bg-coral-100 text-coral-800' },
  unanswered: { text: 'Never answered', cls: 'bg-ink-100 text-ink-700' },
};

const pct = (n: number, of: number) => (of > 0 ? Math.round((n / of) * 100) : 0);

const COLLAPSED_ROWS = 5;

/** Horizontal bar list: label, bar scaled to the top row, count, share of [total]. Top 5 until expanded. */
function Bars({
  rows,
  total,
  barClass,
}: {
  rows: { label: string; users: number; newInRange?: number }[];
  total: number;
  barClass: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const max = Math.max(1, ...rows.map((r) => r.users));
  const shown = expanded ? rows : rows.slice(0, COLLAPSED_ROWS);
  return (
    <div>
      <ul className="space-y-2.5">
        {shown.map((r) => (
          <li key={r.label} className="grid grid-cols-[minmax(6rem,9rem)_1fr_auto] items-center gap-3 text-sm">
            <span className="truncate font-medium text-ink-900" title={r.label}>
              {r.label}
            </span>
            <div className="h-3 overflow-hidden rounded-full bg-cream-100" aria-hidden>
              <div className={`h-full rounded-full ${barClass}`} style={{ width: `${(r.users / max) * 100}%` }} />
            </div>
            <span className="whitespace-nowrap text-right tabular-nums text-ink-700">
              <span className="font-semibold text-ink-950">{r.users}</span>
              <span className="ml-1.5 text-xs text-ink-500">{pct(r.users, total)}%</span>
              {r.newInRange ? (
                <span className="ml-1.5 rounded-full bg-coral-100 px-1.5 py-0.5 text-[10px] font-semibold text-coral-800">
                  +{r.newInRange} new
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
      {rows.length > COLLAPSED_ROWS ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 h-9 rounded-lg px-3 text-xs font-semibold text-coral-700 hover:bg-coral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
        >
          {expanded ? `Show top ${COLLAPSED_ROWS}` : `Show all ${rows.length}`}
        </button>
      ) : null}
    </div>
  );
}

function CityBars({ rows, total, barClass }: { rows: CityRow[]; total: number; barClass: string }) {
  if (!rows.length) return <Empty text="No city data yet." />;
  return <Bars rows={rows.map((r) => ({ ...r, label: r.city }))} total={total} barClass={barClass} />;
}

export function LocationsPage() {
  const [from, setFrom] = useStickyState('locations.from', () => todayIso());
  const [to, setTo] = useStickyState('locations.to', () => todayIso());
  const url = `/api/v1/admin/locations${toQuery({ from: dayStartIso(from), to: dayEndIso(to) })}`;
  const { data, error, reload } = useAdminQuery<Locations>(url);
  const t = data?.totals;
  const noLocation = t ? t.denied + t.blocked + t.unanswered : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-950">Locations</h1>
          <p className="mt-1 text-sm text-ink-500">
            Totals cover all users
            <span className="mx-2 text-ink-300">·</span>
            “New” = joined {fmtRangeLabel(from, to)}
          </p>
        </div>
        <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
      </div>

      {error ? <ErrorBox message={error} onRetry={reload} /> : null}

      {data && t ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Location allowed"
              value={t.allowed}
              tone="success"
              icon={MapPin}
              detail={`${pct(t.allowed, t.users)}% of ${t.users}`}
            />
            <StatCard
              label="No location"
              value={noLocation}
              tone="warning"
              icon={MapPinOff}
              detail={`${t.denied + t.blocked} denied · ${t.unanswered} never answered`}
            />
            <StatCard label="Cities" value={t.cities} tone="coral" icon={Building2} detail="current" />
            <StatCard
              label="Joined in range · with location"
              value={`${t.newAllowed}/${t.newUsers}`}
              tone="amber"
              icon={UserPlus}
              detail={`${pct(t.newAllowed, t.newUsers)}%`}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Panel title="First city · where they signed up">
              <CityBars rows={data.firstCities} total={t.withFirstCity} barClass="bg-coral-500" />
              {t.firstEstimated > 0 ? (
                <p className="mt-4 text-xs text-ink-500">
                  {t.firstEstimated} user{t.firstEstimated === 1 ? '' : 's'} joined before the first city was recorded and
                  {t.firstEstimated === 1 ? ' is' : ' are'} counted under their current city.
                </p>
              ) : null}
            </Panel>
            <Panel title="Current city · where they are now">
              <CityBars rows={data.currentCities} total={t.withCurrentCity} barClass="bg-ink-800" />
            </Panel>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Panel title={`Events by city · ${data.eventsWithCity + data.eventsWithoutCity} events`}>
              {!data.eventCities.length ? (
                <Empty text="No events with a city yet." />
              ) : (
                <Bars
                  rows={data.eventCities.map((r) => ({ label: r.city, users: r.events, newInRange: r.newInRange }))}
                  total={data.eventsWithCity}
                  barClass="bg-success-500"
                />
              )}
              {data.eventsWithoutCity > 0 ? (
                <p className="mt-4 text-xs text-ink-500">
                  {data.eventsWithoutCity} event{data.eventsWithoutCity === 1 ? ' has' : 's have'} no city on the venue
                  and {data.eventsWithoutCity === 1 ? 'is' : 'are'} not counted.
                </p>
              ) : null}
            </Panel>
            {/* Moved city — hidden for now; re-enable together with `moves` in admin-locations.ts.
            <Panel title={`Moved city · ${t.moved} user${t.moved === 1 ? '' : 's'}`}>
              {!data.moves.length ? (
                <Empty text="Nobody has moved city yet." />
              ) : (
                <TableWrap>
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-ink-950/8">
                        <th className={`${th} !text-left`}>From</th>
                        <th className={`${th} !text-left`}>To</th>
                        <th className={th}>Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.moves.map((m) => (
                        <tr key={`${m.from}>${m.to}`} className="border-t border-ink-950/5">
                          <td className={`${td} !text-left`}>{m.from}</td>
                          <td className={`${td} !text-left`}>{m.to}</td>
                          <td className={`${td} tabular-nums`}>{m.users}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableWrap>
              )}
            </Panel>
            */}
            <Panel title={`No location · phone timezone (${noLocation})`}>
              {!data.noLocationZones.length ? (
                <Empty text="Everyone shared their location." />
              ) : (
                <>
                  <Bars
                    rows={data.noLocationZones.map((z) => ({ label: z.timezone, users: z.users }))}
                    total={noLocation}
                    barClass="bg-amber-500"
                  />
                  <p className="mt-4 text-xs text-ink-500">
                    A rough region, not a city: Asia/Kolkata covers all of India.
                  </p>
                </>
              )}
            </Panel>
          </div>

          <Panel title={`Recent joiners · ${t.newUsers} in range`}>
            {!data.recent.length ? (
              <Empty text="Nobody joined in this range." />
            ) : (
              <TableWrap>
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-ink-950/8">
                      <th className={`${th} !text-left`}>User</th>
                      <th className={th}>Joined</th>
                      <th className={th}>First city</th>
                      <th className={th}>Current city</th>
                      <th className={th}>Location</th>
                      <th className={th}>Timezone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((u) => {
                      const access = accessLabel[u.location];
                      const moved = u.firstCity && u.currentCity && u.firstCity !== u.currentCity;
                      return (
                        <tr
                          key={u.id}
                          tabIndex={0}
                          className="cursor-pointer border-t border-ink-950/5 transition-colors hover:bg-coral-50/40 focus:outline-none focus-visible:bg-coral-50/60"
                          onClick={() => go(`/admin/users/${u.id}`)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') go(`/admin/users/${u.id}`);
                          }}
                        >
                          <td className={`${td} whitespace-normal !text-left`}>
                            <p className="font-semibold leading-snug text-ink-950">{u.displayName || u.username || '—'}</p>
                            <p className="mt-0.5 text-xs text-ink-500">@{u.username}</p>
                          </td>
                          <td className={td}>{fmtDate(u.joinedAt)}</td>
                          <td className={td}>{u.firstCity || <span className="text-ink-400">—</span>}</td>
                          <td className={td}>
                            {u.currentCity || <span className="text-ink-400">—</span>}
                            {moved ? <span className="ml-1.5 text-xs font-semibold text-coral-700">moved</span> : null}
                          </td>
                          <td className={td}>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${access.cls}`}>{access.text}</span>
                          </td>
                          <td className={`${td} text-ink-600`}>{u.timezone || <span className="text-ink-400">—</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </TableWrap>
            )}
          </Panel>
        </>
      ) : !error ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[7.5rem] animate-pulse rounded-2xl bg-cream-200/80" />
          ))}
        </div>
      ) : null}
    </div>
  );
}
