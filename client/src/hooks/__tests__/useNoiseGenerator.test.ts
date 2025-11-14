import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNoiseGenerator } from '../useNoiseGenerator';

describe('useNoiseGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize', () => {
    const { result } = renderHook(() => useNoiseGenerator());

    expect(result.current.isPlaying).toBe(false);
  });

  it('should play noise', () => {
    const { result } = renderHook(() => useNoiseGenerator());

    act(() => {
      result.current.play([50, 50, 50, 50, 50, 50, 50, 50], 'white');
    });

    expect(result.current.isPlaying).toBe(true);
  });

  it('should stop noise', () => {
    const { result } = renderHook(() => useNoiseGenerator());

    act(() => {
      result.current.play([50, 50, 50, 50, 50, 50, 50, 50], 'white');
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.stop();
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it('should toggle play/stop', () => {
    const { result } = renderHook(() => useNoiseGenerator());

    act(() => {
      result.current.toggle([50, 50, 50, 50, 50, 50, 50, 50], 'white');
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.toggle([50, 50, 50, 50, 50, 50, 50, 50], 'white');
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it('should update equalizer', () => {
    const { result } = renderHook(() => useNoiseGenerator());

    act(() => {
      result.current.play([50, 50, 50, 50, 50, 50, 50, 50], 'white');
    });

    act(() => {
      result.current.updateEqualizer([60, 60, 60, 60, 60, 60, 60, 60]);
    });

    // Should not throw
    expect(result.current.isPlaying).toBe(true);
  });

  it('should update volume', () => {
    const { result } = renderHook(() => useNoiseGenerator());

    act(() => {
      result.current.play([50, 50, 50, 50, 50, 50, 50, 50], 'white', 50);
    });

    act(() => {
      result.current.updateVolume(75);
    });

    // Should not throw
    expect(result.current.isPlaying).toBe(true);
  });

  it('should support different noise colors', () => {
    const { result } = renderHook(() => useNoiseGenerator());

    const colors: Array<
      'white' | 'pink' | 'brown' | 'violet' | 'blue' | 'grey'
    > = ['white', 'pink', 'brown', 'violet', 'blue', 'grey'];

    colors.forEach(color => {
      act(() => {
        result.current.stop();
      });

      act(() => {
        result.current.play([50, 50, 50, 50, 50, 50, 50, 50], color);
      });

      expect(result.current.isPlaying).toBe(true);
    });
  });
});
