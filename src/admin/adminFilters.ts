import { useState, type Dispatch, type SetStateAction } from 'react';

/** In-memory only — survives SPA navigation, clears on full page refresh. */
const bag = new Map<string, unknown>();

export function useStickyState<T>(key: string, initial: () => T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (bag.has(key)) return bag.get(key) as T;
    return initial();
  });

  const setSticky: Dispatch<SetStateAction<T>> = (action) => {
    setState((prev) => {
      const next = typeof action === 'function' ? (action as (p: T) => T)(prev) : action;
      bag.set(key, next);
      return next;
    });
  };

  return [state, setSticky];
}
