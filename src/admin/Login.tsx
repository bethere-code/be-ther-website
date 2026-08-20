import { useState } from 'react';
import { go, Link } from '../hooks/usePathRoute';
import { adminFetch, ApiError, setSession } from './api';

export function Login() {
  const [email, setEmail] = useState('admin@be-ther.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await adminFetch<{ accessToken: string; email: string }>('/api/v1/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setSession(data.accessToken, data.email);
      go('/admin/overview');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not sign in');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-4 text-ink-950">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-ink-950/10 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-coral-600">Be Ther</p>
        <h1 className="mt-1 text-2xl font-semibold">Admin</h1>
        <label className="mt-6 block text-xs font-medium text-ink-500">
          Email
          <input
            className="mt-1 h-12 w-full rounded-xl border border-ink-950/15 px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="mt-3 block text-xs font-medium text-ink-500">
          Password
          <input
            className="mt-1 h-12 w-full rounded-xl border border-ink-950/15 px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? (
          <p role="alert" className="mt-3 text-sm text-error-600">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 h-12 w-full rounded-xl bg-coral-500 text-sm font-semibold text-white hover:bg-coral-400 disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <Link to="/" className="mt-4 block text-center text-sm text-ink-500 hover:text-ink-950">
          Back to site
        </Link>
      </form>
    </div>
  );
}
