import { DateRange, Empty, ErrorBox, field, fieldLabel, Panel, TableWrap, th } from './ui';
import { dayEndIso, dayStartIso, idOf, toQuery } from './api';
import { useAdminQuery } from './useAdminQuery';
import { useStickyState } from './adminFilters';
import { daysAgoIso, todayIso } from './dates';
import { Pager } from './Pager';

export function ListPage({
  title,
  path,
  columns,
  render,
  extra,
  toolbar,
  defaultRange,
}: {
  title: string;
  path: string;
  columns: string[];
  render: (row: Record<string, unknown>) => React.ReactNode;
  extra?: Record<string, string | undefined>;
  toolbar?: React.ReactNode;
  defaultRange?: boolean;
}) {
  const [from, setFrom] = useStickyState(`list.${path}.from`, () => (defaultRange ? daysAgoIso(7) : ''));
  const [to, setTo] = useStickyState(`list.${path}.to`, () => (defaultRange ? todayIso() : ''));
  const [dir, setDir] = useStickyState(`list.${path}.dir`, () => 'desc');
  const [page, setPage] = useStickyState(`list.${path}.page`, () => 1);
  const url = `${path}${toQuery({
    dir,
    page,
    from: from ? dayStartIso(from) : undefined,
    to: to ? dayEndIso(to) : undefined,
    ...extra,
  })}`;
  const { data: rows, error, reload } = useAdminQuery<{ items: Record<string, unknown>[]; total: number }>(url);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex flex-wrap items-end gap-3">
          {toolbar}
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
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
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
      </div>
      {error ? <ErrorBox message={error} onRetry={reload} /> : null}
      <Panel title={`${rows?.total ?? 0} rows`}>
        {!rows?.items.length ? (
          <Empty text="Nothing in this filter." />
        ) : (
          <TableWrap>
            <table className="min-w-full">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c} className={th}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.items.map((row) => (
                  <tr key={idOf(row)} className="border-t border-ink-950/5">
                    {render(row)}
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
        <Pager page={page} total={rows?.total ?? 0} setPage={setPage} />
      </Panel>
    </div>
  );
}
