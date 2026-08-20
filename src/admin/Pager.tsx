export function Pager({
  page,
  total,
  limit = 25,
  setPage,
}: {
  page: number;
  total: number;
  limit?: number;
  setPage: (n: number) => void;
}) {
  if (total <= 0) return null;
  const pages = Math.max(1, Math.ceil(total / limit));
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-950/8 pt-4">
      <p className="text-sm text-ink-500">
        Showing <span className="font-medium text-ink-800">{from}–{to}</span> of{' '}
        <span className="font-medium text-ink-800">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="h-10 rounded-xl border border-ink-950/12 bg-white px-4 text-sm font-medium text-ink-800 transition-colors hover:border-coral-500/40 hover:text-coral-700 disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span className="min-w-[4rem] text-center text-sm tabular-nums text-ink-600">
          {page} / {pages}
        </span>
        <button
          type="button"
          className="h-10 rounded-xl border border-ink-950/12 bg-white px-4 text-sm font-medium text-ink-800 transition-colors hover:border-coral-500/40 hover:text-coral-700 disabled:opacity-40"
          disabled={page >= pages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
