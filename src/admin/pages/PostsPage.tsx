import { Image } from 'lucide-react';
import { go } from '../../hooks/usePathRoute';
import { dayEndIso, dayStartIso, fmtDate, idOf, toQuery } from '../api';
import { useAdminQuery } from '../useAdminQuery';
import { useStickyState } from '../adminFilters';
import { daysAgoIso, todayIso } from '../dates';
import { Pager } from '../Pager';
import { DateRange, Empty, ErrorBox, field, fieldLabel, fmtRangeLabel } from '../ui';

export function PostsPage() {
  const [from, setFrom] = useStickyState('posts.from', () => daysAgoIso(7));
  const [to, setTo] = useStickyState('posts.to', () => todayIso());
  const [sort, setSort] = useStickyState('posts.sort', () => 'createdAt');
  const [dir, setDir] = useStickyState('posts.dir', () => 'desc');
  const [page, setPage] = useStickyState('posts.page', () => 1);
  const url = `/api/v1/admin/posts${toQuery({
    sort,
    dir,
    page,
    from: dayStartIso(from),
    to: dayEndIso(to),
  })}`;
  const { data: rows, error, reload } = useAdminQuery<{ items: Record<string, unknown>[]; total: number }>(url);

  const orderLabel =
    sort === 'likesCount'
      ? { desc: 'Most liked', asc: 'Least liked' }
      : { desc: 'Newest first', asc: 'Oldest first' };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-950">Posts</h1>
        <p className="mt-1 text-sm text-ink-500">
          {fmtRangeLabel(from, to)}
          <span className="mx-2 text-ink-300">·</span>
          Tap a card for likes, RSVPs, and the event link
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-x-3 gap-y-2.5 rounded-2xl border border-ink-950/8 bg-white p-3.5 shadow-soft">
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
            <option value="createdAt">Created</option>
            <option value="likesCount">Likes</option>
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

      {!rows?.items.length && !error ? (
        <Empty text="No posts in this filter." />
      ) : (
        <>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            {rows?.total ?? 0} events
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(rows?.items ?? []).map((p) => {
              const author = p.authorId as
                | { username?: string; displayName?: string; avatarUrl?: string }
                | undefined;
              const image = String(p.imageUrl ?? '');
              const place = String(p.location || 'Untitled event');
              return (
                <button
                  key={idOf(p)}
                  type="button"
                  onClick={() => go(`/admin/posts/${idOf(p)}`)}
                  className="group overflow-hidden rounded-2xl border border-ink-950/8 bg-white text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-float focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
                    {image ? (
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-ink-800 to-coral-700">
                        <Image className="h-10 w-10 text-white/70" aria-hidden />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/80 to-transparent p-3 pt-10">
                      <p className="line-clamp-2 text-sm font-semibold text-white">{place}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-950">
                        {author?.displayName || author?.username || 'Unknown'}
                      </p>
                      <p className="truncate text-xs text-ink-500">@{author?.username ?? '—'}</p>
                    </div>
                    <div className="shrink-0 rounded-full bg-coral-100 px-2.5 py-1 text-xs font-semibold text-coral-700">
                      {String(p.likesCount ?? 0)} likes
                    </div>
                  </div>
                  <div className="border-t border-ink-950/5 px-3.5 py-2 text-[11px] text-ink-500">
                    {fmtDate(p.createdAt as string)} IST
                  </div>
                </button>
              );
            })}
          </div>
          <Pager page={page} total={rows?.total ?? 0} setPage={setPage} />
        </>
      )}
    </div>
  );
}
