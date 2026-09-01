/**
 * lib/hooks.ts
 * Reusable performance hooks for WealthSage frontend.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import debounce from "lodash.debounce";

/**
 * useDebounce — returns a debounced copy of `value` that updates only after
 * `delay` ms of inactivity. Use this for search/filter inputs to avoid
 * triggering expensive computations on every keystroke.
 *
 * Example:
 *   const debouncedSearch = useDebounce(searchInput, 300);
 *   const filtered = useMemo(() => items.filter(...), [debouncedSearch, items]);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Create a debounced setter that fires only after `delay` ms of quiet
    const handler = debounce((v: T) => setDebouncedValue(v), delay);
    handler(value);
    // Cancel on cleanup — prevents state update after unmount or rapid value changes
    return () => handler.cancel();
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useStableCallback — returns a stable function reference that never changes
 * identity across renders, even if the callback body closes over stale state.
 * Use this when passing callbacks to React.memo children to prevent re-renders.
 *
 * Example:
 *   const handleDelete = useStableCallback((id: string) => deleteItem(id));
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const ref = useRef<T>(fn);
  // Always keep the ref current so the stable wrapper calls the latest version
  useEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args: unknown[]) => ref.current(...args), []) as T;
}
