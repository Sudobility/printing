import { describe, expect, it } from 'vitest';
import { pageCss } from '../src/page-css';

describe('pageCss', () => {
  it('emits a @page rule with size, orientation and margin', () => {
    expect(
      pageCss({ sizeCss: 'A4', orientation: 'portrait', marginMm: 10 })
    ).toBe('@page { size: A4 portrait; margin: 10mm; }');
  });

  it('carries the orientation through', () => {
    expect(
      pageCss({ sizeCss: 'letter', orientation: 'landscape', marginMm: 12.7 })
    ).toBe('@page { size: letter landscape; margin: 12.7mm; }');
  });
});
