import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudioEngine } from '../useAudioEngine';

describe('useAudioEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
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
    const { result } = renderHook(() => useAudioEngine({ waveform: 'sine' }));

    act(() => {
      result.current.play();
    });

    act(() => {
      result.current.updateWaveform('square');
    });

    // Waveform update should restart playback
    expect(result.current.isPlaying).toBe(true);
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
