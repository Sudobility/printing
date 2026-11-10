import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDrawGate } from '../src/use-draw-gate';

describe('useDrawGate', () => {
  it('is ready immediately when nothing is expected', () => {
    const { result } = renderHook(() => useDrawGate(0));
    expect(result.current.ready).toBe(true);
  });

  it('turns ready only once every expected page reports', () => {
    const { result } = renderHook(() => useDrawGate(2));
    expect(result.current.ready).toBe(false);
    act(() => result.current.markDrawn(0));
    expect(result.current.ready).toBe(false);
    act(() => result.current.markDrawn(0)); // duplicate ignored
    expect(result.current.ready).toBe(false);
    act(() => result.current.markDrawn(1));
    expect(result.current.ready).toBe(true);
  });

  it('reset starts the count over', () => {
    const { result } = renderHook(() => useDrawGate(1));
    act(() => result.current.markDrawn(0));
    expect(result.current.ready).toBe(true);
    act(() => result.current.reset());
    expect(result.current.ready).toBe(false);
  });
});
