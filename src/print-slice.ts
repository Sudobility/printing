/**
 * A block that never breaks across a printed page — the rule a system (music)
 * or a sheet (screenplay) carries. The web app relies on the browser to
 * paginate; this is how a unit tells it where a break may not fall.
 */
import { createElement } from 'react';
import type { ReactElement, ReactNode } from 'react';

export interface PrintSliceProps {
  children: ReactNode;
}

export function PrintSlice({ children }: PrintSliceProps): ReactElement {
  // Inline, not a class: this is the rule the element exists to carry, and
  // Tailwind-style class interpolation can silently drop it.
  return createElement(
    'div',
    { style: { breakInside: 'avoid', pageBreakInside: 'avoid' } },
    children
  );
}
