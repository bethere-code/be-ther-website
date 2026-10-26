import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { adminFetch } from '../api';
import { field, fieldLabel, Panel } from '../ui';
import { useAdminQuery } from '../useAdminQuery';

type PlatformPolicy = {
  minVersion: string;
  minBuild: number;
  latestVersion: string;
  latestBuild: number;
};

type AppUpdateSettings = { android: PlatformPolicy; ios: PlatformPolicy };
type Platform = keyof AppUpdateSettings;

function summary(p: PlatformPolicy): string {
  const parts: string[] = [];
  if (p.minBuild > 0) parts.push(`Builds below ${p.minBuild} must update (popup can't be closed).`);
  if (p.latestBuild > 0 && p.latestBuild > p.minBuild) {
    parts.push(
      `Builds ${p.minBuild > 0 ? `${p.minBuild}–` : 'up to '}${p.latestBuild - 1} see an optional popup once per app open.`,
    );
  }
  return parts.length ? parts.join(' ') : 'Off: nobody sees an update popup.';
}

function invalid(p: PlatformPolicy): string | null {
  if (p.latestBuild > 0 && p.minBuild > p.latestBuild) {
    return 'Minimum build cannot be higher than the latest build.';
  }
  return null;
}

export function AppUpdatesPage() {
  const { data, error: loadError, reload } = useAdminQuery<AppUpdateSettings>('/api/v1/admin/app-update');
  const [draft, setDraft] = useState<AppUpdateSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (data) setDraft({ android: { ...data.android }, ios: { ...data.ios } });
  }, [data]);

  function patch<K extends keyof PlatformPolicy>(platform: Platform, key: K, value: PlatformPolicy[K]) {
    setDraft((prev) => (prev ? { ...prev, [platform]: { ...prev[platform], [key]: value } } : prev));
    setSavedAt(null);
  }

  async function save() {
    if (!draft) return;
    const problem = invalid(draft.android) ?? invalid(draft.ios);
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await adminFetch<AppUpdateSettings>('/api/v1/admin/app-update', {
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
      <Panel title="App updates">
        <p className="text-sm text-coral-700">{loadError}</p>
      </Panel>
    );
  }

  if (!draft) {
    return (
      <Panel title="App updates">
        <p className="text-sm text-ink-500">Loading settings…</p>
      </Panel>
    );
  }

  const platformPanel = (platform: Platform, title: string, note: string) => {
    const p = draft[platform];
    const build = (key: 'minBuild' | 'latestBuild', label: string) => (
      <label className="block">
        <span className={fieldLabel}>{label}</span>
        <input
          className={field}
          type="number"
          min={0}
          value={p[key]}
          onChange={(e) => patch(platform, key, Math.max(0, Math.floor(Number(e.target.value) || 0)))}
        />
      </label>
    );
    const version = (key: 'minVersion' | 'latestVersion', label: string) => (
      <label className="block">
        <span className={fieldLabel}>{label}</span>
        <input
          className={field}
          value={p[key]}
          maxLength={20}
          placeholder="1.0.10"
          onChange={(e) => patch(platform, key, e.target.value)}
        />
      </label>
    );
    return (
      <Panel title={title}>
        <p className="mb-4 text-xs text-ink-500">{note}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {version('minVersion', 'Minimum version (label only)')}
          {build('minBuild', 'Minimum build (mandatory below this)')}
          {version('latestVersion', 'Latest version (label only)')}
          {build('latestBuild', 'Latest build (optional below this)')}
        </div>
        <p className={`mt-4 text-sm ${invalid(p) ? 'text-coral-700' : 'text-ink-700'}`}>
          {invalid(p) ?? summary(p)}
        </p>
      </Panel>
    );
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink-950">App updates</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-600">
          Controls the update popup on the feed. Only the build number (the <code>+N</code> in{' '}
          <code>1.0.10+14</code>) decides who sees it; versions are labels for you. Set a build to 0
          to turn that popup off. Changes reach apps within about a minute.
        </p>
        <p className="mt-2 max-w-2xl rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-ink-800">
          Only raise a build after that release is fully live on the store. Otherwise users tap
          Update and the store has nothing to install.
        </p>
      </div>

      {platformPanel('android', 'Android', 'Update opens Google Play’s in-app update screen.')}
      {platformPanel('ios', 'iOS', 'Leave at 0 until the App Store listing is live (IOS_STORE_URL must be set).')}

      {error ? <p className="text-sm font-medium text-coral-700">{error}</p> : null}
      {savedAt ? <p className="text-xs text-ink-500">Saved at {savedAt}</p> : null}

      <div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void save()}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-coral-500 px-5 text-sm font-semibold text-white hover:bg-coral-600 disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden />
          {busy ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </div>
  );
}
