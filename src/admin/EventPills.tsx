import { X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { fmtDate, idOf, toQuery } from './api';
import { fieldLabel } from './ui';
import { useAdminQuery } from './useAdminQuery';

export type PickedEvent = { id: string; title: string; dateLabel: string };

type PostHit = {
  _id?: unknown;
  location?: string;
  eventDetails?: { date?: string };
  createdAt?: string;
};

const MIN_CHARS = 3;

export function EventPills({
  value,
  onChange,
}: {
  value: PickedEvent | null;
  onChange: (next: PickedEvent | null) => void;
}) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q.trim()), 220);
    return () => window.clearTimeout(t);
  }, [q]);

  const search = debounced.length >= MIN_CHARS ? debounced : '';
  const url = search
    ? `/api/v1/admin/posts${toQuery({ q: search, page: 1, limit: 8 })}`
    : null;
  const { data, error } = useAdminQuery<{ items: PostHit[] }>(url);
  const suggestions = useMemo(() => {
    const items = data?.items ?? [];
    const taken = value?.id ?? '';
    return items.filter((p) => {
      const id = idOf(p);
      return id.length > 0 && id !== taken;
    });
  }, [data, value]);

  useEffect(() => {
    setHi(0);
  }, [search, suggestions.length]);

  function add(hit: PostHit) {
    const id = idOf(hit);
    if (!id) return;
    const title = String(hit.location || 'Untitled event');
    const raw = hit.eventDetails?.date || hit.createdAt;
    onChange({ id, title, dateLabel: fmtDate(raw) });
    setQ('');
    setDebounced('');
    setOpen(false);
  }

  const showMenu = open && q.trim().length >= MIN_CHARS;

  return (
    <div>
      <span className={fieldLabel}>Event</span>
      <div
        className="relative mt-1 w-full max-w-lg"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
        }}
      >
        <div
          className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-ink-950/12 bg-white px-2 py-1.5 focus-within:ring-2 focus-within:ring-coral-500/40"
          onClick={() => inputRef.current?.focus()}
        >
          {value ? (
            <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-coral-50 py-0.5 pl-2.5 pr-1 text-xs text-ink-900">
              <span className="truncate font-medium">{value.title}</span>
              <span className="shrink-0 text-ink-400">{value.dateLabel}</span>
              <button
                type="button"
                aria-label="Remove event"
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-ink-500 hover:bg-coral-100 hover:text-ink-900"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </span>
          ) : (
            <input
              ref={inputRef}
              className="min-w-[9rem] flex-1 border-0 bg-transparent py-0.5 text-sm text-ink-950 outline-none placeholder:text-ink-400"
              value={q}
              role="combobox"
              aria-expanded={showMenu}
              aria-controls={listId}
              aria-autocomplete="list"
              autoComplete="off"
              placeholder="Type 3+ letters"
              onFocus={() => setOpen(true)}
              onChange={(e) => {
                setQ(e.target.value);
                setOpen(true);
              }}
              onKeyDown={(e) => {
                if (!showMenu || suggestions.length === 0) return;
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHi((i) => (i + 1) % suggestions.length);
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHi((i) => (i - 1 + suggestions.length) % suggestions.length);
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  const hit = suggestions[hi];
                  if (hit) add(hit);
                } else if (e.key === 'Escape') {
                  setOpen(false);
                }
              }}
            />
          )}
        </div>
        {showMenu && !value ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-ink-950/10 bg-white py-1 shadow-soft"
          >
            {url && !data && !error ? (
              <li className="px-3 py-2 text-sm text-ink-400">Searching…</li>
            ) : error ? (
              <li className="px-3 py-2 text-sm text-red-600">{error}</li>
            ) : suggestions.length === 0 ? (
              <li className="px-3 py-2 text-sm text-ink-400">No matches</li>
            ) : (
              suggestions.map((hit, i) => {
                const id = idOf(hit);
                const title = String(hit.location || 'Untitled event');
                const dateLabel = fmtDate(hit.eventDetails?.date || hit.createdAt);
                return (
                  <li key={id} role="option" aria-selected={i === hi}>
                    <button
                      type="button"
                      className={`flex w-full flex-col items-start px-3 py-2 text-left text-sm ${
                        i === hi ? 'bg-coral-50' : 'hover:bg-ink-50'
                      }`}
                      onMouseEnter={() => setHi(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => add(hit)}
                    >
                      <span className="font-medium text-ink-950">{title}</span>
                      <span className="text-xs text-ink-500">{dateLabel}</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
