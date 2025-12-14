import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTonalMasker } from '../useTonalMasker';

describe('useTonalMasker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize', () => {
    const { result } = renderHook(() => useTonalMasker());

    expect(result.current.isPlaying).toBe(false);
  });

  it('should play with default options', () => {
    const { result } = renderHook(() => useTonalMasker());

    act(() => {
      result.current.play();
    });

    expect(result.current.isPlaying).toBe(true);
  });

  it('should play with custom options', () => {
    const { result } = renderHook(() =>
      useTonalMasker({
        frequency: 4000,
        modulationType: 'am',
        modulationRate: 1.0,
        modulationDepth: 50,
        volume: 50,
      })
    );

    act(() => {
      result.current.play();
    });

    expect(result.current.isPlaying).toBe(true);
  });

  it('should stop', () => {
    const { result } = renderHook(() => useTonalMasker());

    act(() => {
      result.current.play();
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.stop();
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it('should toggle play/stop', () => {
    const { result } = renderHook(() => useTonalMasker());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it('should update frequency', () => {
    const { result } = renderHook(() => useTonalMasker());

    act(() => {
      result.current.play();
    });

    act(() => {
      result.current.updateFrequency(5000);
    });

    // Should not throw
    expect(result.current.isPlaying).toBe(true);
  });

  it('should update modulation rate', () => {
    const { result } = renderHook(() =>
      useTonalMasker({ modulationType: 'am' })
    );

    act(() => {
      result.current.play();
    });

    act(() => {
      result.current.updateModulationRate(2.0);
    });

    // Should not throw
    expect(result.current.isPlaying).toBe(true);
  });

  it('should update modulation depth', () => {
    const { result } = renderHook(() =>
      useTonalMasker({ modulationType: 'am' })
    );

    act(() => {
      result.current.play();
    });

    act(() => {
      result.current.updateModulationDepth(75);
    });

    // Should not throw
    expect(result.current.isPlaying).toBe(true);
  });

  it('should update volume', () => {
    const { result } = renderHook(() => useTonalMasker());

    act(() => {
      result.current.play();
    });

    act(() => {
      result.current.updateVolume(75);
    });

    // Should not throw
    expect(result.current.isPlaying).toBe(true);
  });

  it('should support CR mode', () => {
    const { result } = renderHook(() =>
      useTonalMasker({
        frequency: 4000,
        modulationType: 'cr',
      })
    );

    act(() => {
      result.current.play();
    });

    expect(result.current.isPlaying).toBe(true);
  });
});
