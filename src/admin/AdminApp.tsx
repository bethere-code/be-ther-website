import { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  Users as UsersIcon,
  Image,
  X,
} from 'lucide-react';
import { go, Link } from '../hooks/usePathRoute';
import {
  adminEmail,
  adminFetch,
  ApiError,
  clearSession,
  dayEndIso,
  dayStartIso,
  fmtDate,
  fmtMs,
  getToken,
  idOf,
  setSession,
  toQuery,
} from './api';
import { DateRange, Empty, ErrorBox, Kpi, Panel, TableWrap, td, th } from './ui';

const laterIdeas = [
  'Flag duplicate accounts that share a deviceId',
  'Ban or mute from the user page (writes, not just reads)',
  'CSV export for a date range',
  'OTP attempt spikes (abuse / stuffing)',
  'Push-token health after Firebase lands',
  'City breakdown from post eventLocation',
];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoIso(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

type Overview = {
  usersTotal: number;
  usersInRange: number;
  postsTotal: number;
  postsInRange: number;
  followsInRange: number;
  commentsInRange: number;
  likesInRange: number;
  reportsInRange: number;
  screenTimeMs: number;
  screenEvents: number;
  auth: Record<string, number>;
};

export function AdminApp({ path }: { path: string }) {
  const authed = Boolean(getToken());
  if (!authed) return <Login />;
  return <Shell path={path} />;
}

function Login() {
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
        <p className="mt-2 text-sm text-ink-500">
          Sample emails: admin@be-ther.com, ops@be-ther.com. Passwords live in ADMIN_LOGINS.
        </p>
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

const nav = [
  { to: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
  { to: '/admin/posts', label: 'Posts', icon: Image },
  { to: '/admin/analytics', label: 'Analytics', icon: Activity },
  { to: '/admin/reports', label: 'Reports', icon: Flag },
];

function Shell({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const page =
    path.startsWith('/admin/users/') && path !== '/admin/users'
      ? 'user'
      : path.replace('/admin/', '') || 'overview';

  function logout() {
    clearSession();
    go('/admin');
  }

  return (
    <div className="min-h-screen bg-cream-100 text-ink-950">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-56 border-r border-ink-950/10 bg-white pt-16 transition-transform md:static md:translate-x-0 ${
            open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <nav className="flex flex-col gap-1 p-3" aria-label="Admin">
            {nav.map((item) => {
              const active =
                item.to === '/admin/overview'
                  ? path === '/admin' || path === '/admin/overview'
                  : path === item.to || path.startsWith(`${item.to}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex h-12 items-center gap-2 rounded-xl px-3 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 ${
                    active ? 'bg-coral-500 text-white' : 'text-ink-700 hover:bg-cream-100'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink-950/10 bg-white/90 px-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="grid h-12 w-12 place-items-center rounded-xl md:hidden"
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <p className="text-sm font-semibold">Ops</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-ink-500 sm:inline">{adminEmail()}</span>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-12 items-center gap-2 rounded-xl px-3 text-sm font-medium text-ink-700 hover:bg-cream-100"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </button>
            </div>
          </header>
          <main id="admin-main" className="p-4 md:p-6">
            {page === 'overview' || path === '/admin' ? <OverviewPage /> : null}
            {path === '/admin/users' ? <UsersPage /> : null}
            {page === 'user' ? <UserDetailPage id={path.split('/').pop() ?? ''} /> : null}
            {path === '/admin/posts' ? <PostsPage /> : null}
            {path === '/admin/analytics' ? <AnalyticsPage /> : null}
            {path === '/admin/reports' ? <ReportsPage /> : null}
          </main>
        </div>
      </div>
    </div>
  );
}

function OverviewPage() {
  const [from, setFrom] = useState(daysAgoIso(7));
  const [to, setTo] = useState(todayIso());
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setError('');
    try {
      const d = await adminFetch<Overview>(
        `/api/v1/admin/overview${toQuery({ from: dayStartIso(from), to: dayEndIso(to) })}`,
      );
      setData(d);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed');
    }
  }, [from, to]);
  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Overview</h1>
        <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
      </div>
      {error ? <ErrorBox message={error} onRetry={() => void load()} /> : null}
      {data ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Users" value={data.usersTotal} hint={`${data.usersInRange} in range`} />
          <Kpi label="Posts" value={data.postsTotal} hint={`${data.postsInRange} in range`} />
          <Kpi label="Screen time" value={fmtMs(data.screenTimeMs)} hint={`${data.screenEvents} visits`} />
          <Kpi label="Logins" value={data.auth.login ?? 0} hint={`${data.auth.signup ?? 0} signups`} />
          <Kpi label="Follows" value={data.followsInRange} hint="in range" />
          <Kpi label="Comments" value={data.commentsInRange} hint="in range" />
          <Kpi label="Likes" value={data.likesInRange} hint="in range" />
          <Kpi label="Reports" value={data.reportsInRange} hint="in range" />
        </div>
      ) : null}
      <Panel title="Later — useful extras">
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink-700">
          {laterIdeas.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-500">Read-only for now. We can pick any of these next.</p>
      </Panel>
    </div>
  );
}

function UsersPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [dir, setDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<{ items: Record<string, unknown>[]; total: number } | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setError('');
    try {
      const d = await adminFetch<{ items: Record<string, unknown>[]; total: number }>(
        `/api/v1/admin/users${toQuery({
          q,
          sort,
          dir,
          page,
          from: from ? dayStartIso(from) : undefined,
          to: to ? dayEndIso(to) : undefined,
        })}`,
      );
      setRows(d);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed');
    }
  }, [from, to, q, sort, dir, page]);
  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Users</h1>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs font-medium text-ink-500">
          Search
          <input
            className="mt-1 h-12 w-56 rounded-xl border border-ink-950/15 px-3 text-sm"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="username, email, name"
          />
        </label>
        <label className="text-xs font-medium text-ink-500">
          Sort
          <select
            className="mt-1 h-12 rounded-xl border border-ink-950/15 px-3 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="createdAt">Created</option>
            <option value="lastDevice.at">Last device</option>
            <option value="followersCount">Followers</option>
            <option value="eventsCount">Events</option>
          </select>
        </label>
        <label className="text-xs font-medium text-ink-500">
          Order
          <select
            className="mt-1 h-12 rounded-xl border border-ink-950/15 px-3 text-sm"
            value={dir}
            onChange={(e) => setDir(e.target.value)}
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
      {error ? <ErrorBox message={error} onRetry={() => void load()} /> : null}
      <Panel title={`${rows?.total ?? 0} accounts`}>
        {!rows?.items.length ? (
          <Empty text="No users in this filter." />
        ) : (
          <TableWrap>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className={th}>User</th>
                  <th className={th}>Email</th>
                  <th className={th}>Auth</th>
                  <th className={th}>Followers</th>
                  <th className={th}>Last phone</th>
                  <th className={th}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {rows.items.map((u) => {
                  const last = u.lastDevice as { model?: string; platform?: string } | undefined;
                  return (
                    <tr
                      key={idOf(u)}
                      tabIndex={0}
                      className="cursor-pointer border-t border-ink-950/5 hover:bg-cream-50 focus:outline-none focus-visible:bg-cream-50"
                      onClick={() => go(`/admin/users/${idOf(u)}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') go(`/admin/users/${idOf(u)}`);
                      }}
                    >
                      <td className={td}>
                        <span className="font-medium">@{String(u.username)}</span>
                        <span className="ml-2 text-ink-500">{String(u.displayName ?? '')}</span>
                      </td>
                      <td className={td}>{String(u.email)}</td>
                      <td className={td}>{String(u.authProvider ?? '')}</td>
                      <td className={td}>{String(u.followersCount ?? 0)}</td>
                      <td className={td}>{last?.model || last?.platform || '—'}</td>
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

function UserDetailPage({ id }: { id: string }) {
  const [data, setData] = useState<{
    user: Record<string, unknown>;
    posts: Record<string, unknown>[];
    events: Record<string, unknown>[];
  } | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setError('');
    try {
      setData(await adminFetch(`/api/v1/admin/users/${id}`));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed');
    }
  }, [id]);
  useEffect(() => {
    void load();
  }, [load]);
  const u = data?.user;
  const first = u?.firstDevice as Record<string, string> | undefined;
  const last = u?.lastDevice as Record<string, string> | undefined;
  const settings = u?.settings as Record<string, unknown> | undefined;

  return (
    <div className="space-y-4">
      <Link to="/admin/users" className="text-sm text-ink-500 hover:text-ink-950">
        ← Users
      </Link>
      {error ? <ErrorBox message={error} onRetry={() => void load()} /> : null}
      {u ? (
        <>
          <h1 className="text-xl font-semibold">
            @{String(u.username)} <span className="text-ink-500">{String(u.displayName)}</span>
          </h1>
          <div className="grid gap-3 lg:grid-cols-2">
            <Panel title="Account">
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-ink-500">Email</dt>
                <dd>{String(u.email)}</dd>
                <dt className="text-ink-500">Auth</dt>
                <dd>{String(u.authProvider)}</dd>
                <dt className="text-ink-500">Verified</dt>
                <dd>{String(u.emailVerified)}</dd>
                <dt className="text-ink-500">Age</dt>
                <dd>{String(u.age ?? '—')}</dd>
                <dt className="text-ink-500">Private</dt>
                <dd>{String(settings?.isPrivateProfile ?? false)}</dd>
                <dt className="text-ink-500">Push</dt>
                <dd>{String(settings?.pushEnabled ?? true)}</dd>
                <dt className="text-ink-500">FCM</dt>
                <dd className="break-all">{String(u.fcmToken || '—')}</dd>
                <dt className="text-ink-500">Followers</dt>
                <dd>{String(u.followersCount)}</dd>
                <dt className="text-ink-500">Following</dt>
                <dd>{String(u.followingCount)}</dd>
                <dt className="text-ink-500">Events</dt>
                <dd>{String(u.eventsCount)}</dd>
                <dt className="text-ink-500">Joined</dt>
                <dd>{fmtDate(u.createdAt as string)}</dd>
              </dl>
            </Panel>
            <Panel title="Devices">
              <p className="text-xs font-semibold uppercase text-ink-500">Signup</p>
              <p className="mt-1 text-sm">{deviceLine(first)}</p>
              <p className="mt-4 text-xs font-semibold uppercase text-ink-500">Last login</p>
              <p className="mt-1 text-sm">{deviceLine(last)}</p>
            </Panel>
          </div>
          <Panel title="Recent posts">
            {!data.posts.length ? (
              <Empty text="No posts." />
            ) : (
              <ul className="space-y-2 text-sm">
                {data.posts.map((p) => (
                  <li key={idOf(p)}>
                    {String(p.location)} · {String(p.status)} · {fmtDate(p.createdAt as string)}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Recent analytics">
            {!data.events.length ? (
              <Empty text="No events yet." />
            ) : (
              <TableWrap>
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className={th}>Type</th>
                      <th className={th}>Detail</th>
                      <th className={th}>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.events.map((ev) => (
                      <tr key={idOf(ev)} className="border-t border-ink-950/5">
                        <td className={td}>{String(ev.type)}</td>
                        <td className={td}>
                          {ev.type === 'auth'
                            ? String(ev.action)
                            : `${String(ev.screen)} ${fmtMs(Number(ev.durationMs ?? 0))}`}
                        </td>
                        <td className={td}>{fmtDate(ev.occurredAt as string)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            )}
          </Panel>
        </>
      ) : null}
    </div>
  );
}

function deviceLine(d?: Record<string, string>) {
  if (!d || (!d.model && !d.platform)) return 'Not recorded';
  return [d.model, d.platform, d.os, d.appVersion && `v${d.appVersion}`, d.deviceId]
    .filter(Boolean)
    .join(' · ');
}

function PostsPage() {
  return (
    <ListPage
      title="Posts"
      path="/api/v1/admin/posts"
      columns={['Author', 'Place', 'Status', 'Likes', 'Created']}
      render={(p) => {
        const author = p.authorId as { username?: string } | string;
        const name = typeof author === 'object' ? author.username : author;
        return (
          <>
            <td className={td}>@{String(name ?? '')}</td>
            <td className={td}>{String(p.location)}</td>
            <td className={td}>{String(p.status)}</td>
            <td className={td}>{String(p.likesCount ?? 0)}</td>
            <td className={td}>{fmtDate(p.createdAt as string)}</td>
          </>
        );
      }}
    />
  );
}

function AnalyticsPage() {
  const [type, setType] = useState('');
  return (
    <ListPage
      title="Analytics"
      path="/api/v1/admin/analytics/events"
      extra={{ type: type || undefined }}
      toolbar={
        <label className="text-xs font-medium text-ink-500">
          Type
          <select
            className="mt-1 h-12 rounded-xl border border-ink-950/15 px-3 text-sm"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All</option>
            <option value="screen_time">Screen time</option>
            <option value="auth">Auth</option>
          </select>
        </label>
      }
      defaultRange
      columns={['Type', 'User', 'Detail', 'When']}
      render={(ev) => (
        <>
          <td className={td}>{String(ev.type)}</td>
          <td className={td}>
            <button type="button" className="underline" onClick={() => go(`/admin/users/${String(ev.userId)}`)}>
              {String(ev.userId).slice(-6)}
            </button>
          </td>
          <td className={td}>
            {ev.type === 'auth' ? String(ev.action) : `${String(ev.screen ?? '')} ${fmtMs(Number(ev.durationMs ?? 0))}`}
          </td>
          <td className={td}>{fmtDate(ev.occurredAt as string)}</td>
        </>
      )}
    />
  );
}

function ReportsPage() {
  return (
    <div className="space-y-10">
      <ListPage
        title="Event reports"
        path="/api/v1/admin/reports"
        columns={['Type', 'Reporter', 'Post', 'When']}
        render={(r) => {
          const reporter = r.reporterId as { username?: string } | undefined;
          const post = r.postId as { location?: string } | undefined;
          return (
            <>
              <td className={td}>{String(r.type)}</td>
              <td className={td}>@{String(reporter?.username ?? '')}</td>
              <td className={td}>{String(post?.location ?? idOf(r))}</td>
              <td className={td}>{fmtDate(r.createdAt as string)}</td>
            </>
          );
        }}
      />
      <ListPage
        title="Account reports"
        path="/api/v1/admin/user-reports"
        columns={['Reason', 'Reporter', 'Account', 'Details', 'When']}
        render={(r) => {
          const reporter = r.reporterId as { username?: string } | undefined;
          const reported = r.reportedUserId as { username?: string } | undefined;
          return (
            <>
              <td className={td}>{String(r.reason)}</td>
              <td className={td}>@{String(reporter?.username ?? '')}</td>
              <td className={td}>@{String(reported?.username ?? '')}</td>
              <td className={td}>{String(r.details ?? '')}</td>
              <td className={td}>{fmtDate(r.createdAt as string)}</td>
            </>
          );
        }}
      />
    </div>
  );
}

function ListPage({
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
  const [from, setFrom] = useState(defaultRange ? daysAgoIso(7) : '');
  const [to, setTo] = useState(defaultRange ? todayIso() : '');
  const [dir, setDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<{ items: Record<string, unknown>[]; total: number } | null>(null);
  const [error, setError] = useState('');
  const extraKey = JSON.stringify(extra ?? {});
  const load = useCallback(async () => {
    setError('');
    try {
      const d = await adminFetch<{ items: Record<string, unknown>[]; total: number }>(
        `${path}${toQuery({
          dir,
          page,
          from: from ? dayStartIso(from) : undefined,
          to: to ? dayEndIso(to) : undefined,
          ...extra,
        })}`,
      );
      setRows(d);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed');
    }
    // extra is passed as object identity; stringify in deps via extraKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, dir, page, from, to, extraKey]);
  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex flex-wrap items-end gap-3">
          {toolbar}
          <label className="text-xs font-medium text-ink-500">
            Order
            <select
              className="mt-1 h-12 rounded-xl border border-ink-950/15 px-3 text-sm"
              value={dir}
              onChange={(e) => setDir(e.target.value)}
            >
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>
          </label>
          <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
        </div>
      </div>
      {error ? <ErrorBox message={error} onRetry={() => void load()} /> : null}
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

function Pager({ page, total, setPage }: { page: number; total: number; setPage: (n: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / 25));
  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <button
        type="button"
        className="h-12 rounded-xl px-4 text-sm disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>
      <span className="text-xs text-ink-500">
        {page} / {pages}
      </span>
      <button
        type="button"
        className="h-12 rounded-xl px-4 text-sm disabled:opacity-40"
        disabled={page >= pages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
