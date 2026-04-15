import { useDebounce } from '@/shared/hooks/useDebounce';
import { renderHook, act } from '@testing-library/react-native';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('actualiza el valor tras el retardo', () => {
    const { result, rerender } = renderHook(({ v, ms }: { v: string; ms: number }) => useDebounce(v, ms), {
      initialProps: { v: 'a', ms: 100 },
    });

    expect(result.current).toBe('a');

    rerender({ v: 'b', ms: 100 });
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('b');
  });
});
