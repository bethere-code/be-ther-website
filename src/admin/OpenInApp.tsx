import { EventPills, type PickedEvent } from './EventPills';
import { UsernamePills, type PickedUser } from './UsernamePills';
import { field, fieldLabel } from './ui';

export type OpenScreen = '' | 'alerts' | 'settings' | 'profile' | 'event';

export function OpenInApp({
  screen,
  onScreen,
  profile,
  onProfile,
  event,
  onEvent,
}: {
  screen: OpenScreen;
  onScreen: (next: OpenScreen) => void;
  profile: PickedUser | null;
  onProfile: (next: PickedUser | null) => void;
  event: PickedEvent | null;
  onEvent: (next: PickedEvent | null) => void;
}) {
  return (
    <div className="space-y-3">
      <label className={fieldLabel}>
        Open in app
        <select
          className={`mt-1 block w-full max-w-md ${field}`}
          value={screen}
          onChange={(e) => {
            const next = e.target.value as OpenScreen;
            onScreen(next);
            onProfile(null);
            onEvent(null);
          }}
        >
          <option value="">Don’t open a screen</option>
          <option value="alerts">Alerts</option>
          <option value="settings">Profile settings</option>
          <option value="profile">A profile</option>
          <option value="event">An event</option>
        </select>
        <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-ink-400">
          Optional. Used when they tap the notification.
        </span>
      </label>
      {screen === 'profile' ? (
        <UsernamePills
          label="Profile"
          max={1}
          value={profile ? [profile] : []}
          onChange={(next) => onProfile(next[0] ?? null)}
        />
      ) : null}
      {screen === 'event' ? <EventPills value={event} onChange={onEvent} /> : null}
    </div>
  );
}
