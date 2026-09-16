import { useEffect, useState } from 'react';
import { AlarmClock, Play, Save, Sparkles } from 'lucide-react';
import { adminFetch } from '../api';
import { field, fieldLabel, Panel, StatCard } from '../ui';
import { useAdminQuery } from '../useAdminQuery';

type Runner = 'interval' | 'external' | 'off';

type NudgeSettings = {
  enabled: boolean;
  interestedEnabled: boolean;
  goingEnabled: boolean;
  quietStartHour: number;
  quietEndHour: number;
  goingHoursBefore: number;
  tickIntervalMinutes: number;
  runner: Runner;
  defaultTimezone: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function Toggle({
  id,
  checked,
  onChange,
  label,
  hint,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-ink-950/8 bg-cream-50/80 px-4 py-3"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink-950">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-ink-500">{hint}</span> : null}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 ${
          checked ? 'bg-coral-500' : 'bg-ink-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}

export function NudgesPage() {
  const { data, error: loadError, reload } = useAdminQuery<NudgeSettings>(
    '/api/v1/admin/nudge-settings',
  );
  const [draft, setDraft] = useState<NudgeSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const [runBusy, setRunBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);

  useEffect(() => {
    if (data) setDraft({ ...data });
  }, [data]);

  function patch<K extends keyof NudgeSettings>(key: K, value: NudgeSettings[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSavedAt(null);
  }

  async function save() {
    if (!draft) return;
    setBusy(true);
    setError(null);
    try {
      const res = await adminFetch<NudgeSettings>('/api/v1/admin/nudge-settings', {
        method: 'PATCH',
        body: JSON.stringify(draft),
      });
      setDraft(res);
      setSavedAt(new Date().toLocaleTimeString());
      reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function runNow() {
    setRunBusy(true);
    setError(null);
    try {
      const d = await adminFetch<{
        interestedSent: number;
        goingSent: number;
        skipped: boolean;
        reason?: string;
      }>('/api/v1/admin/nudge-settings/run', { method: 'POST', body: '{}' });
      setLastRun(
        d.skipped
          ? `Skipped (${d.reason ?? 'n/a'})`
          : `Sent interested=${d.interestedSent}, going=${d.goingSent}`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Run failed');
    } finally {
      setRunBusy(false);
    }
  }

  if (loadError) {
    return (
      <Panel title="Event nudges">
        <p className="text-sm text-coral-700">{loadError}</p>
      </Panel>
    );
  }

  if (!draft) {
    return (
      <Panel title="Event nudges">
        <p className="text-sm text-ink-500">Loading settings…</p>
      </Panel>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink-950">Event nudges</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-600">
          Automated push reminders for calendar RSVPs. Interested users get one witty combined nudge
          per local day; going users get one vibe-matched ping before the event. Tunable here —
          no backend redeploy.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Master"
          value={draft.enabled ? 'On' : 'Off'}
          tone={draft.enabled ? 'success' : 'ink'}
          icon={Sparkles}
        />
        <StatCard
          label="Quiet window"
          value={`${draft.quietStartHour}:00–${draft.quietEndHour}:00`}
          tone="amber"
          detail="Recipient local time"
          icon={AlarmClock}
        />
        <StatCard
          label="Going lead"
          value={`${draft.goingHoursBefore}h`}
          tone="coral"
          detail="Before event start"
        />
      </div>

      <Panel title="Switches">
        <div className="flex flex-col gap-3">
          <Toggle
            id="nudge-enabled"
            checked={draft.enabled}
            onChange={(v) => patch('enabled', v)}
            label="Enable event nudges"
            hint="Master kill switch for all automated RSVP pushes."
          />
          <Toggle
            id="nudge-interested"
            checked={draft.interestedEnabled}
            onChange={(v) => patch('interestedEnabled', v)}
            label="Interested daily nudges"
            hint="One combined push per user per local day inside the quiet window."
          />
          <Toggle
            id="nudge-going"
            checked={draft.goingEnabled}
            onChange={(v) => patch('goingEnabled', v)}
            label="Going reminders"
            hint="Single push N hours before event start, with event-specific copy."
          />
        </div>
      </Panel>

      <Panel title="Timing">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={fieldLabel}>Quiet start (local hour)</span>
            <select
              className={field}
              value={draft.quietStartHour}
              onChange={(e) => patch('quietStartHour', Number(e.target.value))}
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={fieldLabel}>Quiet end (local hour)</span>
            <select
              className={field}
              value={draft.quietEndHour}
              onChange={(e) => patch('quietEndHour', Number(e.target.value))}
            >
              {[...HOURS, 24].map((h) => (
                <option key={h} value={h}>
                  {h === 24 ? '24:00' : `${String(h).padStart(2, '0')}:00`}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={fieldLabel}>Going hours before</span>
            <input
              className={field}
              type="number"
              min={1}
              max={72}
              value={draft.goingHoursBefore}
              onChange={(e) => patch('goingHoursBefore', Number(e.target.value) || 6)}
            />
          </label>
          <label className="block">
            <span className={fieldLabel}>Tick interval (minutes)</span>
            <input
              className={field}
              type="number"
              min={2}
              max={30}
              value={draft.tickIntervalMinutes}
              onChange={(e) => patch('tickIntervalMinutes', Number(e.target.value) || 5)}
            />
            <span className="mt-1 block text-xs text-ink-500">
              Used only when runner is “In-process”. Higher = less wake-ups.
            </span>
          </label>
          <label className="block sm:col-span-2">
            <span className={fieldLabel}>Default timezone</span>
            <input
              className={field}
              value={draft.defaultTimezone}
              onChange={(e) => patch('defaultTimezone', e.target.value)}
              placeholder="Asia/Kolkata"
            />
            <span className="mt-1 block text-xs text-ink-500">
              Fallback when a user or event has no device timezone yet.
            </span>
          </label>
        </div>
      </Panel>

      <Panel title="Runner (CPU-friendly)">
        <p className="mb-3 text-sm text-ink-600">
          The API already stays up for HTTP. The nudge loop is a cheap timer (unref’d) that sleeps
          between ticks. Prefer <strong>In-process</strong> on a single VPS, or{' '}
          <strong>External cron</strong> if you want Node fully idle between curls.
        </p>
        <div className="grid gap-2">
          {(
            [
              {
                id: 'interval' as const,
                title: 'In-process',
                body: 'setTimeout every N minutes inside the API. Near-zero CPU while sleeping.',
              },
              {
                id: 'external' as const,
                title: 'External cron',
                body: 'Only runs when VPS cron hits POST /api/v1/internal/nudge-tick (needs NUDGE_TICK_SECRET).',
              },
              {
                id: 'off' as const,
                title: 'Off',
                body: 'No automatic ticks. Use “Run tick now” for manual tests.',
              },
            ] as const
          ).map((opt) => (
            <label
              key={opt.id}
              className={`flex cursor-pointer gap-3 rounded-2xl border px-4 py-3 ${
                draft.runner === opt.id
                  ? 'border-coral-500 bg-coral-500/5'
                  : 'border-ink-950/8 bg-white'
              }`}
            >
              <input
                type="radio"
                className="mt-1"
                name="runner"
                checked={draft.runner === opt.id}
                onChange={() => patch('runner', opt.id)}
              />
              <span>
                <span className="block text-sm font-semibold text-ink-950">{opt.title}</span>
                <span className="block text-xs text-ink-500">{opt.body}</span>
              </span>
            </label>
          ))}
        </div>
      </Panel>

      {error ? <p className="text-sm font-medium text-coral-700">{error}</p> : null}
      {savedAt ? <p className="text-xs text-ink-500">Saved at {savedAt}</p> : null}
      {lastRun ? <p className="text-xs text-ink-500">Last run: {lastRun}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => void save()}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-coral-500 px-5 text-sm font-semibold text-white hover:bg-coral-600 disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden />
          {busy ? 'Saving…' : 'Save settings'}
        </button>
        <button
          type="button"
          disabled={runBusy}
          onClick={() => void runNow()}
          className="inline-flex h-12 items-center gap-2 rounded-2xl border border-ink-950/15 bg-white px-5 text-sm font-semibold text-ink-800 hover:bg-cream-100 disabled:opacity-60"
        >
          <Play className="h-4 w-4" aria-hidden />
          {runBusy ? 'Running…' : 'Run tick now'}
        </button>
      </div>
    </div>
  );
}
