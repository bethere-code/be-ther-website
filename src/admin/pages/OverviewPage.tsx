import { Activity, Flag, Heart, Image, LogIn, MessageCircle, UserPlus } from 'lucide-react';
import { dayEndIso, dayStartIso, fmtMs, toQuery } from '../api';
import { useAdminQuery } from '../useAdminQuery';
import { useStickyState } from '../adminFilters';
import { daysAgoIso, todayIso } from '../dates';
import { DateRange, ErrorBox, fmtRangeLabel, Panel, StatCard } from '../ui';

const laterIdeas = [
  'Flag duplicate accounts that share a deviceId',
  'Ban or mute from the user page (writes, not just reads)',
  'CSV export for a date range',
  'OTP attempt spikes (abuse / stuffing)',
  'Push-token health after Firebase lands',
  'City breakdown from post eventLocation',
];

export type Overview = {
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

export function OverviewPage() {
  const [from, setFrom] = useStickyState('overview.from', () => daysAgoIso(7));
  const [to, setTo] = useStickyState('overview.to', () => todayIso());
  const url = `/api/v1/admin/overview${toQuery({ from: dayStartIso(from), to: dayEndIso(to) })}`;
  const { data, error, reload } = useAdminQuery<Overview>(url);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-950">Overview</h1>
          <p className="mt-1 text-sm text-ink-500">
            {fmtRangeLabel(from, to)}
            <span className="mx-2 text-ink-300">·</span>
            All counts below are for this period only
          </p>
        </div>
        <DateRange from={from} to={to} onFrom={setFrom} onTo={setTo} />
      </div>
      {error ? <ErrorBox message={error} onRetry={reload} /> : null}
      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Signups" value={data.usersInRange} tone="coral" icon={UserPlus} />
            <StatCard label="New posts" value={data.postsInRange} tone="ink" icon={Image} />
            <StatCard
              label="Screen time"
              value={fmtMs(data.screenTimeMs)}
              tone="amber"
              icon={Activity}
              detail={`${data.screenEvents} sessions`}
            />
            <StatCard label="Logins" value={data.auth.login ?? 0} tone="ink" icon={LogIn} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Likes" value={data.likesInRange} tone="amber" icon={Heart} />
            {/* <StatCard label="Follows" value={data.followsInRange} tone="success" icon={UserCheck} /> */}
            <StatCard label="Comments" value={data.commentsInRange} tone="cream" icon={MessageCircle} />
            <StatCard label="Reports" value={data.reportsInRange} tone="warning" icon={Flag} />
          </div>
          {/* <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          </div> */}
        </>
      ) : !error ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[7.5rem] animate-pulse rounded-2xl bg-cream-200/80" />
          ))}
        </div>
      ) : null}
      <Panel title="Roadmap — useful extras">
        <ul className="grid gap-2 sm:grid-cols-2">
          {laterIdeas.map((t) => (
            <li key={t} className="flex gap-2 text-sm text-ink-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-500" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink-500">Read-only for now. Pick any of these when you want to go further.</p>
      </Panel>
    </div>
  );
}
