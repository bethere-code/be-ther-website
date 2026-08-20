import { CalendarCheck, ExternalLink, Heart, Image, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { go, Link } from '../../hooks/usePathRoute';
import { fmtDate, toQuery } from '../api';
import { useAdminQuery } from '../useAdminQuery';
import { Empty, ErrorBox, Panel } from '../ui';

type PeopleKind = 'likes' | 'interested' | 'going';

export function PostDetailPage({ id }: { id: string }) {
  const [peopleKind, setPeopleKind] = useState<PeopleKind | null>(null);
  const { data, error, reload } = useAdminQuery<{
    post: Record<string, unknown>;
    likesCount: number;
    interestedCount: number;
    goingCount: number;
    shareUrl: string;
  }>(id ? `/api/v1/admin/posts/${id}` : null);

  const peopleUrl =
    id && peopleKind
      ? `/api/v1/admin/posts/${id}/people${toQuery({ kind: peopleKind })}`
      : null;
  const {
    data: peopleData,
    error: peopleError,
  } = useAdminQuery<{
    items: { _id: string; username: string; displayName: string; avatarUrl: string; at: string | null }[];
  }>(peopleUrl);
  const people = peopleData?.items ?? null;

  const p = data?.post;
  const author = p?.authorId as
    | { _id?: string; username?: string; displayName?: string; avatarUrl?: string; email?: string }
    | undefined;
  const image = String(p?.imageUrl ?? '');
  const details = p?.eventDetails as
    | { date?: string; time?: string; venue?: string; ticketUrl?: string }
    | undefined;
  const ticketUrl = String(details?.ticketUrl ?? '').trim();

  return (
    <div className="space-y-5">
      <Link
        to="/admin/posts"
        className="inline-flex text-sm font-medium text-ink-500 transition-colors hover:text-coral-600"
      >
        ← Posts
      </Link>
      {error ? <ErrorBox message={error} onRetry={reload} /> : null}
      {p && data ? (
        <>
          <div className="overflow-hidden rounded-2xl border border-ink-950/8 bg-white shadow-soft sm:grid sm:grid-cols-2">
            <div className="relative aspect-[4/3] bg-ink-100 sm:aspect-auto sm:min-h-[240px]">
              {image ? (
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-[200px] items-center justify-center bg-gradient-to-br from-ink-800 to-coral-700 sm:absolute sm:inset-0">
                  <Image className="h-10 w-10 text-white/70" aria-hidden />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 p-4 sm:p-5">
              <div className="min-w-0">
                <h1 className="text-lg font-bold tracking-tight text-ink-950 sm:text-xl">
                  {String(p.location || 'Untitled event')}
                </h1>
                {p.caption ? (
                  <p className="mt-1 line-clamp-2 text-sm text-ink-600">{String(p.caption)}</p>
                ) : null}
              </div>

              <button
                type="button"
                className="flex w-fit items-center gap-2 rounded-lg border border-ink-950/8 bg-cream-50 px-2.5 py-1.5 text-left transition hover:bg-cream-100"
                onClick={() => author?._id && go(`/admin/users/${author._id}`)}
              >
                {author?.avatarUrl ? (
                  <img src={author.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-ink-200 text-xs font-bold text-ink-700">
                    {(author?.displayName || author?.username || '?').slice(0, 1).toUpperCase()}
                  </div>
                )}
                <span>
                  <span className="block text-sm font-semibold text-ink-950">
                    {author?.displayName || author?.username || 'Unknown'}
                  </span>
                  <span className="block text-[11px] text-ink-500">@{author?.username ?? '—'}</span>
                </span>
              </button>

              <dl className="grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-1 text-xs sm:text-sm">
                <dt className="text-ink-500">When</dt>
                <dd>{[details?.date, details?.time].filter(Boolean).join(' · ') || '—'}</dd>
                <dt className="text-ink-500">Venue</dt>
                <dd className="truncate">{details?.venue || '—'}</dd>
                <dt className="text-ink-500">Posted</dt>
                <dd>{fmtDate(p.createdAt as string)} IST</dd>
              </dl>

              {ticketUrl ? (
                <a
                  href={ticketUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-fit items-center gap-1.5 rounded-lg bg-ink-900 px-3 text-xs font-semibold text-cream-50 transition hover:bg-ink-800"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  Event link
                </a>
              ) : null}

              <div className="mt-auto grid grid-cols-3 gap-2">
                {(
                  [
                    {
                      kind: 'likes' as const,
                      label: 'Likes',
                      value: data.likesCount,
                      active: 'bg-coral-100 text-coral-800 ring-coral-300',
                      idle: 'bg-coral-50 text-coral-700 hover:bg-coral-100',
                      Icon: Heart,
                    },
                    {
                      kind: 'interested' as const,
                      label: 'Interested',
                      value: data.interestedCount,
                      active: 'bg-amber-100 text-amber-900 ring-amber-300',
                      idle: 'bg-amber-50 text-amber-800 hover:bg-amber-100',
                      Icon: UserPlus,
                    },
                    {
                      kind: 'going' as const,
                      label: 'Going',
                      value: data.goingCount,
                      active: 'bg-success-500/15 text-success-700 ring-success-500/40',
                      idle: 'bg-success-500/10 text-success-700 hover:bg-success-500/15',
                      Icon: CalendarCheck,
                    },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.kind}
                    type="button"
                    onClick={() => setPeopleKind(peopleKind === m.kind ? null : m.kind)}
                    className={`rounded-xl px-2.5 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 ${
                      peopleKind === m.kind ? `ring-2 ${m.active}` : m.idle
                    }`}
                  >
                    <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide opacity-80">
                      <m.Icon className="h-3 w-3" aria-hidden />
                      {m.label}
                    </span>
                    <span className="mt-0.5 block text-lg font-bold tabular-nums">{m.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {peopleKind ? (
            <Panel
              title={
                peopleKind === 'likes'
                  ? 'People who liked'
                  : peopleKind === 'interested'
                    ? 'People interested'
                    : 'People going'
              }
              action={
                <button
                  type="button"
                  className="text-xs font-semibold text-ink-500 hover:text-ink-950"
                  onClick={() => setPeopleKind(null)}
                >
                  Close
                </button>
              }
            >
              {peopleError ? <ErrorBox message={peopleError} /> : null}
              {peopleKind && peopleData == null && !peopleError ? (
                <p className="text-sm text-ink-500">Loading…</p>
              ) : null}
              {people && !people.length ? <Empty text="Nobody in this list yet." /> : null}
              {people && people.length > 0 ? (
                <ul className="divide-y divide-ink-950/5">
                  {people.map((person) => (
                    <li key={person._id}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 py-2.5 text-left transition hover:bg-cream-50"
                        onClick={() => go(`/admin/users/${person._id}`)}
                      >
                        {person.avatarUrl ? (
                          <img
                            src={person.avatarUrl}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-ink-100 text-xs font-bold text-ink-700">
                            {person.displayName.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-ink-950">
                            {person.displayName}
                          </span>
                          <span className="block truncate text-xs text-ink-500">@{person.username}</span>
                        </span>
                        <span className="shrink-0 text-[11px] text-ink-400">{fmtDate(person.at)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Panel>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
