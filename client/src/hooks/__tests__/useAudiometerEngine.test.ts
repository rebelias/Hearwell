import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudiometerEngine } from '../useAudiometerEngine';

describe('useAudiometerEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize', () => {
    const { result } = renderHook(() => useAudiometerEngine());

    expect(result.current).toHaveProperty('playTone');
    expect(result.current).toHaveProperty('stop');
    expect(result.current).toHaveProperty('cleanup');
  });

  it('should play tone', async () => {
    const { result } = renderHook(() => useAudiometerEngine());

    const playPromise = act(async () => {
      await result.current.playTone(1000, 50, 'both', 100);
    });

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(100);
    });

    await playPromise;
    // Should complete without error
  });

  it('should play tone to left ear', async () => {
    const { result } = renderHook(() => useAudiometerEngine());

    const playPromise = act(async () => {
      await result.current.playTone(1000, 50, 'left', 100);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    await playPromise;
  });

  it('should play tone to right ear', async () => {
    const { result } = renderHook(() => useAudiometerEngine());

    const playPromise = act(async () => {
      await result.current.playTone(1000, 50, 'right', 100);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    await playPromise;
  });

  it('should stop tone', () => {
    const { result } = renderHook(() => useAudiometerEngine());

    act(() => {
      result.current.stop();
    });

    // Should not throw
    expect(result.current).toBeDefined();
  });

  it('should cleanup', () => {
    const { result, unmount } = renderHook(() => useAudiometerEngine());

    act(() => {
      result.current.cleanup();
    });

    unmount();
    // Should not throw
  });
});
