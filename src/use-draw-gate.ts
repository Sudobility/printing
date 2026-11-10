/**
 * Gate a Print button until every page has drawn.
 *
 * On web a long score draws each system into its own canvas after the view
 * commits; pressing Print before the last one is drawn sends blank pages to
 * paper. Each page reports in with `markDrawn`; `ready` turns true once
 * `expected` of them have. A new plan calls `reset` to start the count over.
 */
import { useCallback, useState } from 'react';

export interface DrawGate {
  /** True once at least `expected` pages have reported drawn (always, if none are expected). */
  ready: boolean;
  markDrawn: (id: number) => void;
  reset: () => void;
}

export function useDrawGate(expected: number): DrawGate {
  const [drawn, setDrawn] = useState<ReadonlySet<number>>(() => new Set());

  const markDrawn = useCallback((id: number) => {
    setDrawn((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const reset = useCallback(() => setDrawn(new Set()), []);

  return { ready: drawn.size >= expected, markDrawn, reset };
}
