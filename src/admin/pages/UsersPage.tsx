import { go } from '../../hooks/usePathRoute';
import { dayEndIso, dayStartIso, fmtDate, idOf, toQuery } from '../api';
import { useAdminQuery } from '../useAdminQuery';
import { useStickyState } from '../adminFilters';
import { daysAgoIso, todayIso } from '../dates';
import { Pager } from '../Pager';
import { DateRange, Empty, ErrorBox, field, fieldLabel, fmtRangeLabel, Panel, TableWrap, td, th } from '../ui';

export function UsersPage() {
  const [from, setFrom] = useStickyState('users.from', () => daysAgoIso(7));
  const [to, setTo] = useStickyState('users.to', () => todayIso());
  const [q, setQ] = useStickyState('users.q', () => '');
  const [sort, setSort] = useStickyState('users.sort', () => 'createdAt');
  const [dir, setDir] = useStickyState('users.dir', () => 'desc');
  const [page, setPage] = useStickyState('users.page', () => 1);
  const searching = q.trim().length >= 2;
  const url = `/api/v1/admin/users${toQuery({
    q,
    sort,
    dir,
    page,
    from: searching ? undefined : from ? dayStartIso(from) : undefined,
    to: searching ? undefined : to ? dayEndIso(to) : undefined,
  })}`;
  const { data: rows, error, reload } = useAdminQuery<{ items: Record<string, unknown>[]; total: number }>(url);

  const orderLabel =
    sort === 'followersCount' || sort === 'followingCount' || sort === 'eventsCount'
      ? { desc: 'High → low', asc: 'Low → high' }
      : sort === 'lastDevice.at'
        ? { desc: 'Recent first', asc: 'Oldest first' }
        : { desc: 'Newest first', asc: 'Oldest first' };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-950">Users</h1>
        <p className="mt-1 text-sm text-ink-500">
          {searching ? 'Search · date range ignored' : fmtRangeLabel(from, to)}
          <span className="mx-2 text-ink-300">·</span>
          Tap a row for email, devices, and activity
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-x-3 gap-y-2.5 rounded-2xl border border-ink-950/8 bg-white p-3.5 shadow-soft">
        <label className={fieldLabel}>
          Search
          <input
            className={`mt-1 block w-52 ${field}`}
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="name, @username, email"
          />
        </label>
        <label className={fieldLabel}>
          Sort by
          <select
            className={`mt-1 block ${field}`}
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
          >
            <option value="createdAt">Joined</option>
            <option value="lastDevice.at">Last active</option>
            <option value="eventsCount">Events</option>
            <option value="followersCount">Followers</option>
            <option value="followingCount">Following</option>
          </select>
        </label>
        <label className={fieldLabel}>
          Order
          <select
            className={`mt-1 block ${field}`}
            value={dir}
            onChange={(e) => {
              setPage(1);
              setDir(e.target.value);
            }}
          >
            <option value="desc">{orderLabel.desc}</option>
            <option value="asc">{orderLabel.asc}</option>
          </select>
        </label>
        <DateRange
          from={from}
          to={to}
          disabled={searching}
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
      <Panel title={`${rows?.total ?? 0} users`}>
        {!rows?.items.length ? (
          <Empty text="No users in this filter." />
        ) : (
          <TableWrap>
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-ink-950/8">
                  <th className={`${th} !text-left`}>User</th>
                  <th className={`${th}`}>Events</th>
                  <th className={`${th}`}>Followers</th>
                  <th className={`${th}`}>Following</th>
                  <th className={th}>Last active</th>
                  <th className={th}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {rows.items.map((u) => {
                  const last = u.lastDevice as
                    | { model?: string; platform?: string; at?: string }
                    | undefined;
                  const lastActiveAt = (u.lastActiveAt as string | undefined) || last?.at;
                  const phone = last?.model || last?.platform || '';
                  return (
                    <tr
                      key={idOf(u)}
                      tabIndex={0}
                      className="cursor-pointer border-t border-ink-950/5 transition-colors hover:bg-coral-50/40 focus:outline-none focus-visible:bg-coral-50/60"
                      onClick={() => go(`/admin/users/${idOf(u)}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') go(`/admin/users/${idOf(u)}`);
                      }}
                    >
                      <td className={`${td} whitespace-normal !text-left`}>
                        <div className="flex flex-col items-start">
                          <p className="font-semibold leading-snug text-ink-950">
                            {String(u.displayName || u.username || '—')}
                          </p>
                          <p className="mt-0.5 text-xs text-ink-500">@{String(u.username)}</p>
                        </div>
                      </td>
                      <td className={`${td} tabular-nums`}>{String(u.eventsCount ?? 0)}</td>
                      <td className={`${td} tabular-nums`}>{String(u.followersCount ?? 0)}</td>
                      <td className={`${td} tabular-nums`}>{String(u.followingCount ?? 0)}</td>
                      <td className={`${td} whitespace-normal`}>
                        {phone || lastActiveAt ? (
                          <div className="flex flex-col items-center">
                            <p className="leading-snug text-ink-900">{phone || 'Last seen'}</p>
                            <p className="mt-0.5 text-xs text-ink-500">{fmtDate(lastActiveAt)}</p>
                          </div>
                        ) : (
                          <span className="text-ink-400">—</span>
                        )}
                      </td>
                      <td className={td}>{fmtDate(u.createdAt as string)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        )}
        <Pager page={page} total={rows?.total ?? 0} setPage={setPage} />
      </Panel>
    </div>
  );
}
