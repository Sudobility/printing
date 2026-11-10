import { afterEach, describe, expect, it, vi } from 'vitest';
import { pageGeometry } from '@sudobility/printing_core';
import { printDetached } from '../src/print-detached';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('printDetached', () => {
  it('mounts detached pages, emits @page, prints, then cleans up', async () => {
    let hostDuringPrint: Element | null = null;
    let styleText = '';
    vi.stubGlobal(
      'print',
      vi.fn(() => {
        hostDuringPrint = document.querySelector('[data-print-detached-host]');
        styleText =
          document.querySelector('[data-print-detached]')?.textContent ?? '';
        window.dispatchEvent(new Event('afterprint'));
      })
    );

    const onReady = vi.fn();
    await printDetached({
      geometry: pageGeometry('a4', 'portrait'),
      mount: (h) => h.append(document.createElement('span')),
      onReady,
    });

    // Present and populated while printing...
    expect(hostDuringPrint).not.toBeNull();
    expect(hostDuringPrint!.querySelector('span')).not.toBeNull();
    expect(styleText).toContain('@page { size: A4 portrait; margin: 12mm; }');
    expect(styleText).toContain('#root');
    expect(onReady).toHaveBeenCalled();
    // ...gone afterward.
    expect(document.querySelector('[data-print-detached-host]')).toBeNull();
    expect(document.querySelector('[data-print-detached]')).toBeNull();
  });

  it('settles via the print media query when afterprint never fires', async () => {
    // A PDF save with no dialog never fires afterprint; the print media query
    // leaving force is the second signal.
    const changeListeners: Array<(e: { matches: boolean }) => void> = [];
    const mql = {
      matches: true,
      addEventListener: (_ev: string, cb: (e: { matches: boolean }) => void) =>
        changeListeners.push(cb),
      removeEventListener: (
        _ev: string,
        cb: (e: { matches: boolean }) => void
      ) => {
        const i = changeListeners.indexOf(cb);
        if (i >= 0) changeListeners.splice(i, 1);
      },
    };
    vi.stubGlobal('matchMedia', vi.fn(() => mql));
    vi.stubGlobal(
      'print',
      vi.fn(() => {
        changeListeners.forEach((cb) => cb({ matches: true })); // still printing
        changeListeners.forEach((cb) => cb({ matches: false })); // done
      })
    );

    await printDetached({
      geometry: pageGeometry('a4', 'portrait'),
      mount: () => {},
      hideSelector: '#app',
    });
    expect(document.querySelector('[data-print-detached-host]')).toBeNull();
  });

  it('cleans up even if printing throws', async () => {
    vi.stubGlobal(
      'print',
      vi.fn(() => {
        throw new Error('no printer');
      })
    );
    await expect(
      printDetached({
        geometry: pageGeometry('letter', 'landscape'),
        mount: () => {},
      })
    ).rejects.toThrow('no printer');
    expect(document.querySelector('[data-print-detached-host]')).toBeNull();
  });
});
