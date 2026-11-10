/**
 * Print a subtree on its own: mount it under `<body>`, hide the app, wait for
 * any async draw, `window.print()`, then clean up.
 *
 * The screen's layout cannot be trusted on paper (a responsive app narrows or
 * hides panels at print width), so what prints is rendered detached, not the
 * live view. This is the dance music's print view and the screenwriter app
 * each hand-roll; here once.
 */
import { pageCss } from '@sudobility/printing_core';
import type { PageGeometry } from '@sudobility/printing_core';

export interface DetachedPrintOptions {
  /** Emits the `@page` rule so the printer's page matches the packer's. */
  geometry: PageGeometry;
  /** Render the pages into the detached host. */
  mount: (host: HTMLElement) => void;
  /** What to hide in print while the detached pages show. Default `#root`. */
  hideSelector?: string;
  /** Resolve once every page has drawn — gate the print on async canvases here. */
  onReady?: () => Promise<void> | void;
}

export async function printDetached(opts: DetachedPrintOptions): Promise<void> {
  const { geometry, mount, hideSelector = '#root', onReady } = opts;

  const style = document.createElement('style');
  style.setAttribute('data-print-detached', '');
  style.textContent = `${pageCss(geometry)}\n@media print { ${hideSelector} { display: none !important; } }`;

  const host = document.createElement('div');
  host.setAttribute('data-print-detached-host', '');

  document.body.append(style, host);
  const cleanup = (): void => {
    style.remove();
    host.remove();
  };

  try {
    mount(host);
    await onReady?.();
    await printAndSettle();
  } finally {
    cleanup();
  }
}

/**
 * Resolve when the print is over. `afterprint` is the signal, but saving a PDF
 * without a dialog does not fire it — so the `print` media query leaving force
 * is a second signal, the same kind the layout itself reacts to.
 */
function printAndSettle(): Promise<void> {
  return new Promise<void>((resolve) => {
    const mql =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('print')
        : null;
    let settled = false;
    const finish = (): void => {
      if (settled) return;
      settled = true;
      window.removeEventListener('afterprint', finish);
      mql?.removeEventListener?.('change', onChange);
      resolve();
    };
    const onChange = (e: MediaQueryListEvent): void => {
      if (!e.matches) finish();
    };
    window.addEventListener('afterprint', finish);
    mql?.addEventListener?.('change', onChange);
    window.print();
  });
}
