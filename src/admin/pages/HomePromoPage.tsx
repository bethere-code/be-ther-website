import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Save, Trash2 } from 'lucide-react';
import { adminFetch, apiBase, getToken, ApiError } from '../api';
import { field, fieldLabel, Panel } from '../ui';
import { useAdminQuery } from '../useAdminQuery';

type ButtonTarget = 'none' | 'create_event' | 'explore' | 'search' | 'event' | 'external';
type Frequency = 'every_open' | 'daily' | 'weekly' | 'once';
type Audience = 'all' | 'new';

type HomePromo = {
  enabled: boolean;
  campaignId: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonLabel: string;
  buttonTarget: ButtonTarget;
  buttonUrl: string;
  frequency: Frequency;
  audience: Audience;
  startsOn: string;
  endsOn: string;
};

const FREQ: { id: Frequency; title: string; body: string }[] = [
  { id: 'every_open', title: 'Every app open', body: 'Each cold start and each return to the feed.' },
  { id: 'daily', title: 'Once a day', body: 'At most once per calendar day on the feed.' },
  { id: 'weekly', title: 'Once a week', body: 'At most once every 7 days.' },
  { id: 'once', title: 'Once forever', body: 'Once per campaign. Saving again starts a new campaign.' },
];

async function uploadPromoImage(file: File): Promise<string> {
  const body = new FormData();
  body.append('file', file);
  const headers = new Headers({ Accept: 'application/json' });
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${apiBase()}/api/v1/admin/home-promo/image`, { method: 'POST', headers, body });
  const json = (await res.json().catch(() => null)) as
    | { ok?: boolean; data?: { url?: string }; error?: { message?: string } }
    | null;
  if (res.status === 401) throw new ApiError(json?.error?.message ?? 'Signed out', 401);
  if (!res.ok || !json?.ok || !json.data?.url) {
    throw new ApiError(json?.error?.message ?? 'Upload failed', res.status);
  }
  return json.data.url;
}

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

export function HomePromoPage() {
  const { data, error: loadError, reload } = useAdminQuery<HomePromo>('/api/v1/admin/home-promo');
  const [draft, setDraft] = useState<HomePromo | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) setDraft({ ...data });
  }, [data]);

  function patch<K extends keyof HomePromo>(key: K, value: HomePromo[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSavedAt(null);
  }

  async function onPickImage(file: File | undefined) {
    if (!file || !draft) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadPromoImage(file);
      patch('imageUrl', url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function save() {
    if (!draft) return;
    if (draft.enabled && !draft.title.trim() && !draft.imageUrl.trim()) {
      setError('When On, add a title and/or an image.');
      return;
    }
    if (draft.buttonTarget === 'external' && !/^https:\/\//i.test(draft.buttonUrl.trim())) {
      setError('External button needs an https:// link.');
      return;
    }
    if (draft.buttonTarget === 'event' && !/^[a-f\d]{24}$/i.test(draft.buttonUrl.trim())) {
      setError('Event button needs a valid event id (from the Events detail URL).');
      return;
    }
    if (draft.startsOn && draft.endsOn && draft.endsOn < draft.startsOn) {
      setError('End date cannot be before start date.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await adminFetch<HomePromo>('/api/v1/admin/home-promo', {
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

  if (loadError) {
    return (
      <Panel title="Home promo">
        <p className="text-sm text-coral-700">{loadError}</p>
      </Panel>
    );
  }

  if (!draft) {
    return (
      <Panel title="Home promo">
        <p className="text-sm text-ink-500">Loading settings…</p>
      </Panel>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink-950">Home promo</h1>
        {/* <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-600">
          One dismissable popup on the feed (after the signup welcome). Saving always starts a new
          campaign so users see the updated content soon. Title and image are both optional when
          Off; when On you need at least one of them.
        </p> */}
      </div>

      <Panel title="Master">
        <Toggle
          id="promo-enabled"
          checked={draft.enabled}
          onChange={(v) => patch('enabled', v)}
          label="Show home promo"
        />
      </Panel>

      <Panel title="Content">
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className={fieldLabel}>Title</span>
            <input
              className={`${field} w-full`}
              value={draft.title}
              maxLength={80}
              placeholder="What's new"
              onChange={(e) => patch('title', e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={fieldLabel}>Subtitle (optional)</span>
            <textarea
              className="min-h-[4.5rem] w-full resize-y rounded-lg border border-ink-950/12 bg-white px-2.5 py-2 text-sm text-ink-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500/40"
              value={draft.subtitle}
              maxLength={200}
              placeholder="Short supporting line"
              onChange={(e) => patch('subtitle', e.target.value)}
            />
          </label>
          <div className="flex flex-col gap-1.5">
            <span className={fieldLabel}>Image (optional)</span>
            <div className="flex flex-wrap items-center gap-3">
              {draft.imageUrl ? (
                <img
                  src={draft.imageUrl}
                  alt=""
                  className="h-28 w-28 shrink-0 rounded-xl border border-ink-950/10 object-cover"
                />
              ) : (
                <div className="grid h-28 w-28 shrink-0 place-items-center rounded-xl border border-dashed border-ink-950/15 bg-cream-50 text-ink-400">
                  <ImagePlus className="h-6 w-6" aria-hidden />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => void onPickImage(e.target.files?.[0])}
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-ink-950/15 bg-white px-3 text-sm font-semibold text-ink-800 hover:bg-cream-100 disabled:opacity-60"
                >
                  <ImagePlus className="h-4 w-4" aria-hidden />
                  {uploading ? 'Uploading…' : draft.imageUrl ? 'Replace image' : 'Upload image'}
                </button>
                {draft.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => patch('imageUrl', '')}
                    className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-coral-700 hover:bg-coral-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    Remove image
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Button">
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className={fieldLabel}>Label (optional — default GOT IT)</span>
            <input
              className={`${field} w-full`}
              value={draft.buttonLabel}
              maxLength={40}
              placeholder="GOT IT"
              onChange={(e) => patch('buttonLabel', e.target.value)}
            />
          </label>
          <fieldset>
            <legend className={fieldLabel}>Where it goes</legend>
            <div className="mt-2 grid gap-2">
              {(
                [
                  { id: 'none' as const, title: 'Just close', body: 'No navigation.' },
                  { id: 'create_event' as const, title: 'Create event', body: 'Opens New Event.' },
                  { id: 'explore' as const, title: 'Explore', body: 'Opens Explore tab.' },
                  { id: 'search' as const, title: 'Search', body: 'Opens Search.' },
                  {
                    id: 'event' as const,
                    title: 'Specific event',
                    body: 'Opens one event page. Paste the id from /admin/posts/…',
                  },
                  { id: 'external' as const, title: 'External link', body: 'Opens https URL in the browser.' },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer gap-3 rounded-2xl border px-4 py-3 ${
                    draft.buttonTarget === opt.id
                      ? 'border-coral-500 bg-coral-500/5'
                      : 'border-ink-950/8 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    className="mt-1"
                    name="buttonTarget"
                    checked={draft.buttonTarget === opt.id}
                    onChange={() => patch('buttonTarget', opt.id)}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink-950">{opt.title}</span>
                    <span className="block text-xs text-ink-500">{opt.body}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          {draft.buttonTarget === 'external' ? (
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>https:// link</span>
              <input
                className={`${field} w-full`}
                value={draft.buttonUrl}
                maxLength={500}
                placeholder="https://…"
                onChange={(e) => patch('buttonUrl', e.target.value)}
              />
            </label>
          ) : null}
          {draft.buttonTarget === 'event' ? (
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>Event id</span>
              <input
                className={`${field} w-full`}
                value={draft.buttonUrl}
                maxLength={24}
                placeholder="Paste id from the event detail URL"
                onChange={(e) => patch('buttonUrl', e.target.value.trim())}
              />
              <span className="text-xs text-ink-500">
                Open Events → an event; the URL ends with <code>/admin/posts/&lt;id&gt;</code>. Use that id.
              </span>
            </label>
          ) : null}
        </div>
      </Panel>

      <Panel title="Who & how often">
        <div className="grid gap-4">
          <fieldset>
            <legend className={fieldLabel}>Audience</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(
                [
                  { id: 'all' as const, title: 'All signed-in users' },
                  { id: 'new' as const, title: 'New users only (joined in last 7 days)' },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer gap-3 rounded-2xl border px-4 py-3 ${
                    draft.audience === opt.id ? 'border-coral-500 bg-coral-500/5' : 'border-ink-950/8 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    className="mt-1"
                    name="audience"
                    checked={draft.audience === opt.id}
                    onChange={() => patch('audience', opt.id)}
                  />
                  <span className="text-sm font-semibold text-ink-950">{opt.title}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className={fieldLabel}>Frequency</legend>
            <div className="mt-2 grid gap-2">
              {FREQ.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer gap-3 rounded-2xl border px-4 py-3 ${
                    draft.frequency === opt.id
                      ? 'border-coral-500 bg-coral-500/5'
                      : 'border-ink-950/8 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    className="mt-1"
                    name="frequency"
                    checked={draft.frequency === opt.id}
                    onChange={() => patch('frequency', opt.id)}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink-950">{opt.title}</span>
                    <span className="block text-xs text-ink-500">{opt.body}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>Starts on (optional)</span>
              <input
                className={`${field} w-full`}
                type="date"
                value={draft.startsOn}
                onChange={(e) => patch('startsOn', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>Ends on (optional)</span>
              <input
                className={`${field} w-full`}
                type="date"
                value={draft.endsOn}
                onChange={(e) => patch('endsOn', e.target.value)}
              />
            </label>
          </div>
          <p className="text-xs text-ink-500">Dates use the India calendar day. Leave blank for no limit.</p>
        </div>
      </Panel>

      {error ? <p className="text-sm font-medium text-coral-700">{error}</p> : null}
      {savedAt ? (
        <p className="text-xs text-ink-500">
          Saved at {savedAt}
          {draft.campaignId ? ` · campaign ${draft.campaignId}` : ''}
        </p>
      ) : null}

      <div>
        <button
          type="button"
          disabled={busy || uploading}
          onClick={() => void save()}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-coral-500 px-5 text-sm font-semibold text-white hover:bg-coral-600 disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden />
          {busy ? 'Saving…' : 'Save promo'}
        </button>
      </div>
    </div>
  );
}
