import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update until the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'ab' });
    expect(result.current).toBe('a');

    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('a');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('ab');
  });

  it('only keeps the last value when changes come faster than the delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'ab' });
    act(() => vi.advanceTimersByTime(100));
    rerender({ value: 'abc' });
    act(() => vi.advanceTimersByTime(100));
    rerender({ value: 'abcd' });
    act(() => vi.advanceTimersByTime(300));

    expect(result.current).toBe('abcd');
  });
});
