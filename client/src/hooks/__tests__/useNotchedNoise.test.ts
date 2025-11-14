import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotchedNoise } from '../useNotchedNoise';

describe('useNotchedNoise', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize', () => {
    const { result } = renderHook(() => useNotchedNoise());

    expect(result.current.isPlaying).toBe(false);
  });

  it('should play notched noise', () => {
    const { result } = renderHook(() => useNotchedNoise());

    const options = {
      bandGains: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
      noiseType: 'white' as const,
      volume: 50,
      stereoWidth: 'normal' as const,
    };

    act(() => {
      result.current.play(options);
    });

    expect(result.current.isPlaying).toBe(true);
  });

  it('should stop notched noise', () => {
    const { result } = renderHook(() => useNotchedNoise());

    const options = {
      bandGains: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
      noiseType: 'white' as const,
      volume: 50,
      stereoWidth: 'normal' as const,
    };

    act(() => {
      result.current.play(options);
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.stop();
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it('should toggle play/stop', () => {
    const { result } = renderHook(() => useNotchedNoise());

    const options = {
      bandGains: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
      noiseType: 'white' as const,
      volume: 50,
      stereoWidth: 'normal' as const,
    };

    act(() => {
      result.current.toggle(options);
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.toggle(options);
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it('should update band gains', () => {
    const { result } = renderHook(() => useNotchedNoise());

    const options = {
      bandGains: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
      noiseType: 'white' as const,
      volume: 50,
      stereoWidth: 'normal' as const,
    };

    act(() => {
      result.current.play(options);
    });

    act(() => {
      result.current.updateBandGains([60, 55, 50, 45, 40, 35, 30, 25, 20, 15]);
    });

    // Should not throw
    expect(result.current.isPlaying).toBe(true);
  });

  it('should update volume', () => {
    const { result } = renderHook(() => useNotchedNoise());

    const options = {
      bandGains: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
      noiseType: 'white' as const,
      volume: 50,
      stereoWidth: 'normal' as const,
    };

    act(() => {
      result.current.play(options);
    });

    act(() => {
      result.current.updateVolume(75);
    });

    // Should not throw
    expect(result.current.isPlaying).toBe(true);
  });

  it('should update stereo width', () => {
    const { result } = renderHook(() => useNotchedNoise());

    const options = {
      bandGains: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
      noiseType: 'white' as const,
      volume: 50,
      stereoWidth: 'normal' as const,
    };

    act(() => {
      result.current.play(options);
    });

    act(() => {
      result.current.updateStereoWidth('wide');
    });

    // Should not throw
    expect(result.current.isPlaying).toBe(true);
  });

  it('should replace noise source', () => {
    const { result } = renderHook(() => useNotchedNoise());

    const initialOptions = {
      bandGains: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
      noiseType: 'white' as const,
      volume: 50,
      stereoWidth: 'normal' as const,
    };

    act(() => {
      result.current.play(initialOptions);
    });

    const newOptions = {
      ...initialOptions,
      noiseType: 'pink' as const,
    };

    act(() => {
      result.current.replaceNoiseSource(newOptions);
    });

    // Should not throw
    expect(result.current.isPlaying).toBe(true);
  });

  it('should support all noise types', () => {
    const { result } = renderHook(() => useNotchedNoise());

    const types: Array<'white' | 'pink' | 'brown' | 'purple' | 'grey'> = [
      'white',
      'pink',
      'brown',
      'purple',
      'grey',
    ];

    types.forEach(type => {
      act(() => {
        result.current.stop();
      });

      const options = {
        bandGains: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
        noiseType: type,
        volume: 50,
        stereoWidth: 'normal' as const,
      };

      act(() => {
        result.current.play(options);
      });

      expect(result.current.isPlaying).toBe(true);
    });
  });
});
