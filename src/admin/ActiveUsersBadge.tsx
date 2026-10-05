import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { adminFetch } from './api';

type ActiveUsersPayload = {
  count: number;
  windowMinutes: number;
  asOf: string;
};

export function ActiveUsersBadge() {
  const [data, setData] = useState<ActiveUsersPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const next = await adminFetch<ActiveUsersPayload>(
        '/api/v1/admin/analytics/active-users',
      );
      setData(next);
    } catch {
      setError('Could not refresh');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div
      className="flex shrink-0 items-center gap-2.5 rounded-full border border-coral-500/25 bg-coral-500/5 px-4 py-2 shadow-soft"
      title={
        data
          ? `Distinct users with app screen activity in the last ${data.windowMinutes} minutes`
          : 'Active users in the app'
      }
    >
      <span
        className="relative flex h-2.5 w-2.5 shrink-0"
        aria-hidden
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral-500 opacity-40" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-coral-500" />
      </span>
      <span className="text-sm font-medium text-ink-700">
        Active users:
      </span>
      <span className="min-w-[2ch] text-lg font-bold tabular-nums text-ink-950">
        {data != null ? data.count.toLocaleString() : '—'}
      </span>
      <button
        type="button"
        onClick={() => void refresh()}
        disabled={loading}
        className="rounded-full p-1 text-ink-600 transition hover:bg-ink-950/5 hover:text-coral-600 disabled:opacity-50"
        aria-label="Refresh active user count"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      </button>
      {error ? (
        <span className="sr-only">{error}</span>
      ) : null}
    </div>
  );
}
