/**
 * Web printing surface (`@sudobility/printing`).
 *
 * The web app prints *live DOM* and lets the browser paginate and rasterize;
 * this library only arranges the DOM and emits the right CSS. Phase 0 scaffold:
 * the one `@page` helper that both music_ui and the screenwriter app will share
 * so a print margin is written in exactly one place. The detached-print
 * machinery (`printDetached`, `PrintSlice`, `useDrawGate`) arrives in Phase 1
 * (see `music_app/docs/printing-libraries.md`).
 */

/** Which way up the sheet is printed. */
export type PaperOrientation = 'portrait' | 'landscape';

/** The inputs to a CSS `@page` rule. */
export interface PageCssInput {
  /** The CSS size token, e.g. `'A4'` or `'letter'`. */
  sizeCss: string;
  orientation: PaperOrientation;
  marginMm: number;
}

/**
 * The CSS `@page` rule for a printout — the single place a print margin is
 * written on web, so the printer's page and the packer's page cannot drift.
 */
export function pageCss({
  sizeCss,
  orientation,
  marginMm,
}: PageCssInput): string {
  return `@page { size: ${sizeCss} ${orientation}; margin: ${marginMm}mm; }`;
}
