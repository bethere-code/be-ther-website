import { useState } from 'react';
import { adminFetch } from '../api';
import { field, fieldLabel, Panel } from '../ui';

type Audience = 'all' | 'city' | 'usernames';

type PushResult = {
  mode?: string;
  topic?: string;
  success?: number;
  failure?: number;
  usersMatched?: number;
  tokensTargeted?: number;
};

/**
 * Admin FCM sender.
 * - all → FCM topic `broadcast` (every logged-in app that subscribed)
 * - city → topic `city_<slug>` (users whose GPS city matches)
 * - usernames → direct device tokens for listed accounts
 */
export function PushPage() {
  const [audience, setAudience] = useState<Audience>('all');
  const [title, setTitle] = useState('BE THER');
  const [body, setBody] = useState('');
  const [city, setCity] = useState('');
  const [usernames, setUsernames] = useState('');
  const [silent, setSilent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PushResult | null>(null);

  async function send() {
    setError(null);
    setResult(null);
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required');
      return;
    }
    setBusy(true);
    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        body: body.trim(),
        audience,
        silent,
      };
      if (audience === 'city') payload.city = city.trim();
      if (audience === 'usernames') {
        payload.usernames = usernames
          .split(/[\s,]+/)
          .map((u) => u.replace(/^@/, '').trim().toLowerCase())
          .filter(Boolean);
      }
      const data = await adminFetch<PushResult>('/api/v1/admin/push', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Send failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-950">Push</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-500">
          Send FCM to the app. Social alerts (follow, wishlist, calendar) are automatic.
          Use this for announcements, city event blasts, or a custom user list.
        </p>
      </div>

      <Panel title="Compose">
        <div className="space-y-4 p-4">
          <label className={fieldLabel}>
            Audience
            <select
              className={`mt-1 block w-full max-w-md ${field}`}
              value={audience}
              onChange={(e) => setAudience(e.target.value as Audience)}
            >
              <option value="all">Everyone (broadcast topic)</option>
              <option value="city">City topic (e.g. Hyderabad)</option>
              <option value="usernames">Specific usernames</option>
            </select>
          </label>

          {audience === 'city' && (
            <label className={fieldLabel}>
              City
              <input
                className={`mt-1 block w-full max-w-md ${field}`}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Hyderabad"
              />
              <span className="mt-1 block text-xs text-ink-400">
                Sends to topic city_hyderabad — only users currently subscribed via location.
              </span>
            </label>
          )}

          {audience === 'usernames' && (
            <label className={fieldLabel}>
              Usernames
              <textarea
                className={`mt-1 block w-full max-w-lg ${field}`}
                rows={4}
                value={usernames}
                onChange={(e) => setUsernames(e.target.value)}
                placeholder="alice bob @carol"
              />
            </label>
          )}

          <label className={fieldLabel}>
            Title
            <input
              className={`mt-1 block w-full max-w-md ${field}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />
          </label>

          <label className={fieldLabel}>
            Body
            <textarea
              className={`mt-1 block w-full max-w-lg ${field}`}
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={500}
              placeholder="Short message shown on the lock screen"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={silent}
              onChange={(e) => setSilent(e.target.checked)}
            />
            Silent (data-only — refreshes badge, no banner)
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          {result && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Sent ({result.mode}
              {result.topic ? ` · ${result.topic}` : ''}
              {typeof result.success === 'number'
                ? ` · ok ${result.success} / fail ${result.failure ?? 0}`
                : ''}
              {typeof result.usersMatched === 'number'
                ? ` · users ${result.usersMatched}`
                : ''}
              )
            </p>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => void send()}
            className="rounded-xl bg-coral-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-coral-600 disabled:opacity-60"
          >
            {busy ? 'Sending…' : 'Send push'}
          </button>
        </div>
      </Panel>

      <Panel title="What you can do from the web">
        <div className="space-y-2 p-4 text-sm text-ink-600">
          <ul className="list-disc space-y-1 pl-5">
            <li>Announce to all subscribed devices (broadcast)</li>
            <li>Blast people currently in a city (city topic)</li>
            <li>Target a hand-picked username list (device tokens)</li>
            <li>Silent sync so the app refreshes unread without a banner</li>
          </ul>
          <p className="pt-2 text-xs text-ink-400">
            Requires FIREBASE_SERVICE_ACCOUNT on the API. Users must have push enabled and an
            FCM token registered after login.
          </p>
        </div>
      </Panel>
    </div>
  );
}
