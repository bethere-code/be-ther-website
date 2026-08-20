import type { ReactNode } from 'react';

export function Kpi({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-ink-950/10 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-ink-950">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
    </div>
  );
}

export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-ink-950/10 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-ink-950/10 px-4 py-3">
        <h2 className="text-sm font-semibold text-ink-950">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function DateRange({
  from,
  to,
  onFrom,
  onTo,
}: {
  from: string;
  to: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
}) {
  const input = 'h-12 rounded-xl border border-ink-950/15 bg-cream-50 px-3 text-sm text-ink-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500';
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="text-xs font-medium text-ink-500">
        From
        <input type="date" className={`mt-1 block ${input}`} value={from} onChange={(e) => onFrom(e.target.value)} />
      </label>
      <label className="text-xs font-medium text-ink-500">
        To
        <input type="date" className={`mt-1 block ${input}`} value={to} onChange={(e) => onTo(e.target.value)} />
      </label>
    </div>
  );
}

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
          className="mt-3 h-12 min-w-[8rem] rounded-xl bg-coral-500 px-4 text-sm font-semibold text-white hover:bg-coral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
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

export const th = 'whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-500';
export const td = 'whitespace-nowrap px-3 py-2.5 text-sm text-ink-900';
