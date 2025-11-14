import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTonalMasker } from '../useTonalMasker';

// Mock AudioContext and related APIs
global.AudioContext = vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn().mockReturnValue({
    frequency: { value: 0 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }),
  createGain: vi.fn().mockReturnValue({
    gain: { value: 0 },
    connect: vi.fn(),
  }),
  createStereoPanner: vi.fn().mockReturnValue({
    pan: { value: 0 },
    connect: vi.fn(),
  }),
  createBiquadFilter: vi.fn().mockReturnValue({
    frequency: { value: 0 },
    Q: { value: 0 },
    gain: { value: 0 },
    connect: vi.fn(),
  }),
  createConstantSource: vi.fn().mockReturnValue({
    offset: { value: 0 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }),
  destination: {},
  currentTime: 0,
  state: 'running',
  resume: vi.fn().mockResolvedValue(undefined),
  close: vi.fn(),
}));

// Mock AudioBufferSourceNode
global.AudioBufferSourceNode = vi.fn().mockImplementation(() => ({
  buffer: null,
  loop: false,
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock AudioBuffer
global.AudioBuffer = vi.fn().mockImplementation(() => ({
  getChannelData: vi.fn().mockReturnValue(new Float32Array(44100)),
}));

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
