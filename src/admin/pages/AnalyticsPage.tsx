import { go } from '../../hooks/usePathRoute';
import { dayEndIso, dayStartIso, toQuery } from '../api';
import { useAdminQuery } from '../useAdminQuery';
import { useStickyState } from '../adminFilters';
import { daysAgoIso, todayIso } from '../dates';
import { SessionActivityTable } from '../activityTables';
import type { AnalyticsSession } from '../groupAnalyticsSessions';
import { Pager } from '../Pager';
import { DateRange, ErrorBox, field, fieldLabel, fmtRangeLabel, Panel } from '../ui';

type SessionsResponse = {
  items: AnalyticsSession[];
  total: number;
  scannedEvents: number;
  eventTotal: number;
  truncated: boolean;
};

export function AnalyticsPage() {
  const [type, setType] = useStickyState('analytics.type', () => 'screen_time');
  const [from, setFrom] = useStickyState('analytics.from', () => daysAgoIso(7));
  const [to, setTo] = useStickyState('analytics.to', () => todayIso());
  const [sort, setSort] = useStickyState<'occurredAt' | 'durationMs'>('analytics.sort', () => 'occurredAt');
  const [dir, setDir] = useStickyState<'asc' | 'desc'>('analytics.dir', () => 'desc');
  const [page, setPage] = useStickyState('analytics.page', () => 1);
  const SESSION_PAGE_SIZE = 25;
  const url = `/api/v1/admin/analytics/sessions${toQuery({
    type: type || undefined,
    sort,
    dir,
    page,
    limit: SESSION_PAGE_SIZE,
    from: dayStartIso(from),
    to: dayEndIso(to),
  })}`;
  const { data: rows, error, reload } = useAdminQuery<SessionsResponse>(url);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-950">Analytics</h1>
        <p className="mt-1 text-sm text-ink-500">
          {fmtRangeLabel(from, to)}
          <span className="mx-2 text-ink-300">·</span>
          Grouped by user session on the server · tap a row to open the user
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-x-3 gap-y-2.5 rounded-2xl border border-ink-950/8 bg-white p-3.5 shadow-soft">
        <label className={fieldLabel}>
          Show
          <select
            className={`mt-1 block ${field}`}
            value={type}
            onChange={(e) => {
              setPage(1);
              setType(e.target.value);
            }}
          >
            <option value="screen_time">Screen time</option>
            <option value="auth">Auth</option>
            <option value="">All</option>
          </select>
        </label>
        <DateRange
          from={from}
          to={to}
          onFrom={(v) => {
            setPage(1);
            setFrom(v);
          }}
          onTo={(v) => {
            setPage(1);
            setTo(v);
          }}
        />
      </div>

      {error ? <ErrorBox message={error} onRetry={reload} /> : null}

      <Panel title={`${rows?.total ?? 0} sessions`}>
        <SessionActivityTable
          sessions={rows?.items ?? []}
          showUser
          empty="Nothing in this filter."
          sort={sort}
          dir={dir}
          onSort={(key) => {
            setPage(1);
            if (sort === key) {
              setDir((d) => (d === 'desc' ? 'asc' : 'desc'));
            } else {
              setSort(key);
              setDir('desc');
            }
          }}
          onRowClick={(userId) => go(`/admin/users/${userId}`)}
        />
        <Pager
          page={page}
          total={rows?.total ?? 0}
          limit={SESSION_PAGE_SIZE}
          setPage={setPage}
        />
        {rows?.truncated ? (
          <p className="mt-3 text-xs text-ink-400">
            Sessions built from the first {rows.scannedEvents.toLocaleString()} of{' '}
            {rows.eventTotal.toLocaleString()} events in this range (scan cap).
          </p>
        ) : null}
      </Panel>
    </div>
  );
}
