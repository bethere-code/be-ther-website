import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/** Be Ther app palette — coral primary, ink navy, cream, amber accent */
export type StatTone = 'coral' | 'ink' | 'amber' | 'cream' | 'success' | 'warning';

const statTone: Record<
  StatTone,
  { accent: string; iconBg: string; icon: string; label: string; value: string; chip: string }
> = {
  coral: {
    accent: 'bg-coral-500',
    iconBg: 'bg-coral-500/10',
    icon: 'text-coral-600',
    label: 'text-coral-700',
    value: 'text-ink-950',
    chip: 'bg-coral-100 text-coral-800',
  },
  ink: {
    accent: 'bg-ink-800',
    iconBg: 'bg-ink-800/10',
    icon: 'text-ink-700',
    label: 'text-ink-600',
    value: 'text-ink-950',
    chip: 'bg-ink-100 text-ink-800',
  },
  amber: {
    accent: 'bg-amber-500',
    iconBg: 'bg-amber-500/15',
    icon: 'text-amber-700',
    label: 'text-amber-800',
    value: 'text-ink-950',
    chip: 'bg-amber-100 text-amber-900',
  },
  cream: {
    accent: 'bg-cream-500',
    iconBg: 'bg-cream-200',
    icon: 'text-cream-800',
    label: 'text-cream-800',
    value: 'text-ink-950',
    chip: 'bg-cream-200 text-cream-900',
  },
  success: {
    accent: 'bg-success-500',
    iconBg: 'bg-success-500/10',
    icon: 'text-success-600',
    label: 'text-success-700',
    value: 'text-ink-950',
    chip: 'bg-success-500/10 text-success-700',
  },
  warning: {
    accent: 'bg-warning-500',
    iconBg: 'bg-warning-500/15',
    icon: 'text-amber-700',
    label: 'text-amber-800',
    value: 'text-ink-950',
    chip: 'bg-amber-100 text-amber-900',
  },
};

export function StatCard({
  label,
  value,
  tone = 'ink',
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  tone?: StatTone;
  detail?: string;
  icon?: LucideIcon;
}) {
  const t = statTone[tone];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-950/8 bg-white shadow-soft">
      <div className={`absolute inset-y-0 left-0 w-1 ${t.accent}`} aria-hidden />
      <div className="flex items-start justify-between gap-3 p-5 pl-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`text-xs font-semibold uppercase tracking-wider ${t.label}`}>{label}</p>
            {detail ? (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${t.chip}`}>{detail}</span>
            ) : null}
          </div>
          <p className={`mt-2 font-display text-3xl font-bold tabular-nums tracking-tight ${t.value}`}>{value}</p>
        </div>
        {Icon ? (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${t.iconBg}`}>
            <Icon className={`h-5 w-5 ${t.icon}`} aria-hidden />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-ink-950/8 bg-white shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-ink-950/8 bg-cream-50/80 px-5 py-3.5">
        <h2 className="text-sm font-semibold text-ink-950">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function DateRange({
  from,
  to,
  onFrom,
  onTo,
  disabled,
}: {
  from: string;
  to: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
  disabled?: boolean;
}) {
  const input =
    'h-9 min-w-[9rem] rounded-lg border border-ink-950/12 bg-white px-2.5 text-sm text-ink-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500/40 disabled:cursor-not-allowed disabled:opacity-50';
  return (
    <div className={`flex flex-wrap items-end gap-2.5 ${disabled ? 'opacity-60' : ''}`}>
      <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
        From
        <input
          type="date"
          className={`mt-1 block ${input}`}
          value={from}
          disabled={disabled}
          onChange={(e) => onFrom(e.target.value)}
        />
      </label>
      <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
        To
        <input
          type="date"
          className={`mt-1 block ${input}`}
          value={to}
          disabled={disabled}
          onChange={(e) => onTo(e.target.value)}
        />
      </label>
    </div>
  );
}

/** Compact filter control used on admin list pages. */
export const field =
  'h-9 rounded-lg border border-ink-950/12 bg-white px-2.5 text-sm text-ink-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500/40';

export const fieldLabel = 'text-[11px] font-semibold uppercase tracking-wide text-ink-500';

export function Empty({ text }: { text: string }) {
  return <p className="py-8 text-center text-sm text-ink-500">{text}</p>;
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-error-500/30 bg-error-500/5 p-4 text-sm text-ink-900">
      <p>{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 h-11 min-w-[8rem] rounded-xl bg-coral-500 px-4 text-sm font-semibold text-white hover:bg-coral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>;
}

export const th =
  'whitespace-nowrap px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-ink-500';
export const td = 'whitespace-nowrap px-3 py-2.5 text-center text-sm text-ink-900';

export function fmtRangeLabel(from: string, to: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return `${new Date(`${from}T12:00:00`).toLocaleDateString(undefined, opts)} – ${new Date(`${to}T12:00:00`).toLocaleDateString(undefined, opts)}`;
}
