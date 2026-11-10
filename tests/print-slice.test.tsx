import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrintSlice } from '../src/print-slice';

describe('PrintSlice', () => {
  it('wraps children in a block that will not break across pages', () => {
    const { container } = render(<PrintSlice>hello</PrintSlice>);
    const div = container.firstElementChild as HTMLElement;
    expect(div.textContent).toBe('hello');
    expect(div.style.breakInside).toBe('avoid');
    expect(div.style.pageBreakInside).toBe('avoid');
  });
});
