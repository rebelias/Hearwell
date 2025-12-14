import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudioEngine } from '../useAudioEngine';

describe('useAudioEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAudioEngine());

    expect(result.current.isPlaying).toBe(false);
  });

  it('should initialize with custom options', () => {
    const { result } = renderHook(() =>
      useAudioEngine({
        frequency: 2000,
        waveform: 'square',
        volume: 75,
      })
    );

    expect(result.current.isPlaying).toBe(false);
  });

  it('should play audio', () => {
    const { result } = renderHook(() => useAudioEngine());

    act(() => {
      result.current.play();
    });

    expect(result.current.isPlaying).toBe(true);
  });

  it('should stop audio', () => {
    const { result } = renderHook(() => useAudioEngine());

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
    const { result } = renderHook(() => useAudioEngine());

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
    const { result } = renderHook(() => useAudioEngine({ frequency: 1000 }));

    act(() => {
      result.current.play();
    });

    act(() => {
      result.current.updateFrequency(2000);
    });

    // Frequency update should not throw
    expect(result.current.isPlaying).toBe(true);
  });

  it('should update volume', () => {
    const { result } = renderHook(() => useAudioEngine({ volume: 50 }));

    act(() => {
      result.current.play();
    });

    act(() => {
      result.current.updateVolume(75);
    });

    // Volume update should not throw
    expect(result.current.isPlaying).toBe(true);
  });

  it('should update waveform', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useAudioEngine({ waveform: 'sine' }));

    act(() => {
      result.current.play();
    });

    act(() => {
      result.current.updateWaveform('square');
    });

    // updateWaveform stops then restarts after a short timeout
    act(() => {
      vi.advanceTimersByTime(60);
    });

    expect(result.current.isPlaying).toBe(true);
  });

  it('should update ear selection', () => {
    const { result } = renderHook(() => useAudioEngine());

    act(() => {
      result.current.play();
    });

    expect(() => {
      act(() => {
        result.current.updateEarSelection('left');
      });
    }).not.toThrow();
  });

  it('should set panner value based on ear selection', () => {
    const panner = {
      pan: { value: 0 },
      connect: vi.fn(),
      disconnect: vi.fn(),
    } as unknown as StereoPannerNode;

    const createStereoPannerSpy = vi
      .spyOn(global.AudioContext.prototype, 'createStereoPanner')
      .mockReturnValue(panner);

    const { result } = renderHook(() => useAudioEngine());

    act(() => {
      result.current.play();
    });

    act(() => {
      result.current.updateEarSelection('left');
    });
    expect(panner.pan.value).toBe(-1);

    act(() => {
      result.current.updateEarSelection('right');
    });
    expect(panner.pan.value).toBe(1);

    act(() => {
      result.current.updateEarSelection('both');
    });
    expect(panner.pan.value).toBe(0);

    createStereoPannerSpy.mockRestore();
  });

  it('should handle errors gracefully', () => {
    // Mock AudioContext to throw error
    const originalAudioContext = global.AudioContext;
    global.AudioContext = vi.fn().mockImplementation(() => {
      throw new Error('AudioContext creation failed');
    }) as unknown as typeof AudioContext;

    const { result } = renderHook(() => useAudioEngine());

    expect(() => {
      act(() => {
        result.current.play();
      });
    }).toThrow();

    // Restore
    global.AudioContext = originalAudioContext;
  });
});
