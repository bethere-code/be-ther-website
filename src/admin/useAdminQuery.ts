import { useCallback, useEffect, useState } from 'react';
import { adminFetch, ApiError, isAbortError } from './api';

/**
 * One in-flight GET per URL. Aborts when the URL changes or the component unmounts
 * so filter edits / navigation never apply a stale response.
 */
export function useAdminQuery<T>(url: string | null): {
  data: T | null;
  error: string;
  reload: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!url) {
      setData(null);
      setError('');
      return;
    }
    const ac = new AbortController();
    setData(null);
    setError('');
    void (async () => {
      try {
        const next = await adminFetch<T>(url, { signal: ac.signal });
        if (!ac.signal.aborted) setData(next);
      } catch (e) {
        if (ac.signal.aborted || isAbortError(e)) return;
        setError(e instanceof ApiError ? e.message : 'Failed');
      }
    })();
    return () => ac.abort();
  }, [url, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { data, error, reload };
}
