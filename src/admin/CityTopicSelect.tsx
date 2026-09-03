import { field, fieldLabel } from './ui';

export type CityTopic = {
  topic: string;
  label: string;
  subscribers: number;
};

export function CityTopicSelect({
  items,
  value,
  onChange,
  loading,
  error,
}: {
  items: CityTopic[];
  value: string;
  onChange: (topic: string) => void;
  loading: boolean;
  error: string;
}) {
  if (loading) {
    return (
      <div>
        <span className={fieldLabel}>City</span>
        <p className="mt-1 text-sm text-ink-400">Loading topics…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <span className={fieldLabel}>City</span>
        <p className="mt-1 text-sm text-red-600">{error}</p>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div>
        <span className={fieldLabel}>City</span>
        <p className="mt-1 text-sm text-ink-500">
          Nobody is subscribed to a city right now.
        </p>
      </div>
    );
  }

  const selected = items.find((t) => t.topic === value);

  return (
    <label className={fieldLabel}>
      City
      <select
        className={`mt-1 block w-full max-w-md ${field}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {items.map((t) => (
          <option key={t.topic} value={t.topic}>
            {t.label} ({t.subscribers})
          </option>
        ))}
      </select>
      <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-ink-400">
        {selected
          ? `Sends to ${selected.topic} · ${selected.subscribers} subscribed`
          : 'Only people currently subscribed via location.'}
      </span>
    </label>
  );
}
