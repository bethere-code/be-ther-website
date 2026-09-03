import { useEffect, useState } from 'react';
import { adminFetch } from '../api';
import { CityTopicSelect } from '../CityTopicSelect';
import { OpenInApp, type OpenScreen } from '../OpenInApp';
import { UsernamePills, type PickedUser } from '../UsernamePills';
import type { PickedEvent } from '../EventPills';
import { field, fieldLabel, Panel } from '../ui';
import { useAdminQuery } from '../useAdminQuery';

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
  const [picked, setPicked] = useState<PickedUser[]>([]);
  const [openScreen, setOpenScreen] = useState<OpenScreen>('');
  const [openProfile, setOpenProfile] = useState<PickedUser | null>(null);
  const [openEvent, setOpenEvent] = useState<PickedEvent | null>(null);
  const [silent, setSilent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PushResult | null>(null);
  const topicsUrl = audience === 'city' ? '/api/v1/admin/push/city-topics' : null;
  const { data: topicData, error: topicError } = useAdminQuery<{
    items: { topic: string; label: string; subscribers: number }[];
  }>(topicsUrl);
  const cityTopics = topicData?.items ?? [];
  const topicsReady = audience !== 'city' || topicData != null || Boolean(topicError);

  useEffect(() => {
    if (audience !== 'city' || !topicData) return;
    const items = topicData.items;
    if (items.some((t) => t.topic === city)) return;
    setCity(items[0]?.topic ?? '');
  }, [audience, topicData, city]);

  async function send() {
    setError(null);
    setResult(null);
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required');
      return;
    }
    if (audience === 'city' && !city) {
      setError('Pick a city topic');
      return;
    }
    if (audience === 'usernames' && picked.length === 0) {
      setError('Pick at least one username');
      return;
    }
    if (!silent && openScreen === 'profile' && !openProfile) {
      setError('Pick a profile to open');
      return;
    }
    if (!silent && openScreen === 'event' && !openEvent) {
      setError('Pick an event to open');
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
      if (audience === 'city') payload.topic = city;
      if (audience === 'usernames') {
        payload.usernames = picked.map((u) => u.username);
      }
      if (!silent && openScreen) {
        payload.screen = openScreen;
        if (openScreen === 'profile' && openProfile) payload.id = openProfile.username;
        if (openScreen === 'event' && openEvent) payload.id = openEvent.id;
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
            <CityTopicSelect
              items={cityTopics}
              value={city}
              onChange={setCity}
              loading={!topicData && !topicError}
              error={topicError}
            />
          )}

          {audience === 'usernames' && (
            <UsernamePills value={picked} onChange={setPicked} />
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

          {!silent ? (
            <OpenInApp
              screen={openScreen}
              onScreen={setOpenScreen}
              profile={openProfile}
              onProfile={setOpenProfile}
              event={openEvent}
              onEvent={setOpenEvent}
            />
          ) : null}

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
            disabled={busy || (audience === 'city' && (!topicsReady || cityTopics.length === 0))}
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
            <li>Optional tap target: Alerts, settings, a profile, or an event</li>
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
