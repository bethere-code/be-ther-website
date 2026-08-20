import { Image, UserCheck, Users as UsersIcon } from 'lucide-react';
import { useState } from 'react';
import { go, Link } from '../../hooks/usePathRoute';
import { fmtDate, idOf, toQuery } from '../api';
import { useAdminQuery } from '../useAdminQuery';
import { ActivityTable } from '../activityTables';
import { Pager } from '../Pager';
import { Empty, ErrorBox, Panel, StatCard } from '../ui';

function deviceLine(d?: Record<string, string>) {
  if (!d || (!d.model && !d.platform)) return 'Not recorded';
  return [d.model, d.platform, d.os, d.appVersion && `v${d.appVersion}`, d.deviceId]
    .filter(Boolean)
    .join(' · ');
}

function permLabel(entry?: { granted?: boolean } | null): 'On' | 'Off' {
  return entry?.granted === true ? 'On' : 'Off';
}

export function UserDetailPage({ id }: { id: string }) {
  const { data, error, reload } = useAdminQuery<{
    user: Record<string, unknown>;
  }>(id ? `/api/v1/admin/users/${id}` : null);
  const [postsPage, setPostsPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [activitySort, setActivitySort] = useState<'occurredAt' | 'durationMs'>('occurredAt');
  const [activityDir, setActivityDir] = useState<'asc' | 'desc'>('desc');
  const postsUrl = id
    ? `/api/v1/admin/posts${toQuery({ authorId: id, page: postsPage, limit: 10, dir: 'desc' })}`
    : null;
  const activityUrl = id
    ? `/api/v1/admin/analytics/events${toQuery({
        userId: id,
        page: activityPage,
        sort: activitySort,
        dir: activityDir,
        limit: 25,
      })}`
    : null;
  const {
    data: postsData,
    error: postsError,
    reload: reloadPosts,
  } = useAdminQuery<{ items: Record<string, unknown>[]; total: number }>(postsUrl);
  const {
    data: activity,
    error: activityError,
    reload: reloadActivity,
  } = useAdminQuery<{ items: Record<string, unknown>[]; total: number }>(activityUrl);

  const u = data?.user;
  const posts = postsData?.items ?? [];
  const first = u?.firstDevice as Record<string, string> | undefined;
  const last = u?.lastDevice as Record<string, string> | undefined;
  const lastActiveAt = (u?.lastActiveAt as string | undefined) || last?.at;
  const settings = u?.settings as Record<string, unknown> | undefined;
  const devicePerms = u?.devicePermissions as
    | {
        notification?: { granted?: boolean; status?: string };
        location?: { granted?: boolean; status?: string };
      }
    | undefined;

  return (
    <div className="space-y-5">
      <Link
        to="/admin/users"
        className="inline-flex text-sm font-medium text-ink-500 transition-colors hover:text-coral-600"
      >
        ← Users
      </Link>
      {error ? <ErrorBox message={error} onRetry={reload} /> : null}
      {u ? (
        <>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink-950">
              {String(u.displayName || u.username)}
            </h1>
            <p className="mt-1 text-sm text-ink-500">@{String(u.username)}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Events" value={Number(u.eventsCount ?? 0)} tone="ink" icon={Image} />
            <StatCard label="Followers" value={Number(u.followersCount ?? 0)} tone="coral" icon={UsersIcon} />
            <StatCard label="Following" value={Number(u.followingCount ?? 0)} tone="success" icon={UserCheck} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Account">
              <dl className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-2.5 text-sm">
                <dt className="text-ink-500">Email</dt>
                <dd className="break-all font-medium">{String(u.email)}</dd>
                <dt className="text-ink-500">Private</dt>
                <dd>{settings?.isPrivateProfile ? 'Yes' : 'No'}</dd>
                <dt className="text-ink-500">Push</dt>
                <dd>{settings?.pushEnabled === false ? 'Off' : 'On'}</dd>
                <dt className="text-ink-500">Notifications</dt>
                <dd>{permLabel(devicePerms?.notification)}</dd>
                <dt className="text-ink-500">Location</dt>
                <dd>{permLabel(devicePerms?.location)}</dd>
                <dt className="text-ink-500">Age</dt>
                <dd>{u.age != null ? String(u.age) : '—'}</dd>
                <dt className="text-ink-500">Bio</dt>
                <dd className="whitespace-pre-wrap text-ink-800">{String(u.bio || '—')}</dd>
                <dt className="text-ink-500">Joined</dt>
                <dd>{fmtDate(u.createdAt as string)} IST</dd>
                <dt className="text-ink-500">FCM</dt>
                <dd className="break-all text-xs text-ink-600">{String(u.fcmToken || '—')}</dd>
                <dt className="text-ink-500">Auth</dt>
                <dd>
                  {String(u.authProvider ?? '—')}
                  <span className="ml-2 text-xs text-ink-500">
                    {u.emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </dd>
              </dl>
            </Panel>
            <Panel title="Devices">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-coral-600">Signup device</p>
                  <p className="mt-1.5 text-ink-900">{deviceLine(first)}</p>
                  <p className="mt-1 text-xs text-ink-500">{fmtDate(first?.at)} IST</p>
                </div>
                <div className="border-t border-ink-950/8 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Last login</p>
                  <p className="mt-1.5 text-ink-900">{deviceLine(last)}</p>
                  <p className="mt-1 text-xs text-ink-500">{fmtDate(last?.at || lastActiveAt)} IST</p>
                </div>
              </div>
            </Panel>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <Panel title={`Recent events (${postsData?.total ?? 0})`}>
              {postsError ? <ErrorBox message={postsError} onRetry={reloadPosts} /> : null}
              {!postsError && !posts.length ? (
                <Empty text="No events." />
              ) : posts.length ? (
                <ul className="divide-y divide-ink-950/5">
                  {posts.map((p) => (
                    <li key={idOf(p)}>
                      <button
                        type="button"
                        className="flex w-full items-baseline justify-between gap-3 py-3 text-left transition-colors hover:bg-coral-500/5"
                        onClick={() => go(`/admin/posts/${idOf(p)}`)}
                      >
                        <span className="min-w-0 font-medium text-ink-950">{String(p.location || 'Untitled')}</span>
                        <span className="shrink-0 text-xs tabular-nums text-ink-500">
                          {fmtDate(p.createdAt as string)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <Pager page={postsPage} total={postsData?.total ?? 0} limit={10} setPage={setPostsPage} />
            </Panel>
            <Panel title={`Activity (${activity?.total ?? 0})`}>
              {activityError ? <ErrorBox message={activityError} onRetry={reloadActivity} /> : null}
              <ActivityTable
                items={activity?.items ?? []}
                showUser={false}
                empty="No activity yet."
                expandable
                sort={activitySort}
                dir={activityDir}
                onSort={(key) => {
                  setActivityPage(1);
                  if (activitySort === key) {
                    setActivityDir((d) => (d === 'desc' ? 'asc' : 'desc'));
                  } else {
                    setActivitySort(key);
                    setActivityDir('desc');
                  }
                }}
              />
              <Pager page={activityPage} total={activity?.total ?? 0} limit={25} setPage={setActivityPage} />
            </Panel>
          </div>
        </>
      ) : !error ? (
        <p className="text-sm text-ink-500">Loading…</p>
      ) : null}
    </div>
  );
}
