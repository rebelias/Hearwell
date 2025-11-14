import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Web Audio API
global.AudioContext = class MockAudioContext {
  state = 'running';
  sampleRate = 44100;
  currentTime = 0;
  destination = {} as AudioDestinationNode;

  createOscillator() {
    return {
      type: 'sine',
      frequency: { value: 440 },
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    } as unknown as OscillatorNode;
  }

  createGain() {
    return {
      gain: { value: 1 },
      connect: vi.fn(),
      disconnect: vi.fn(),
    } as unknown as GainNode;
  }

  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: { value: 1000 },
      Q: { value: 1 },
      gain: { value: 0 },
      connect: vi.fn(),
      disconnect: vi.fn(),
    } as unknown as BiquadFilterNode;
  }

  createStereoPanner() {
    return {
      pan: { value: 0 },
      connect: vi.fn(),
      disconnect: vi.fn(),
    } as unknown as StereoPannerNode;
  }

  createBufferSource() {
    return {
      buffer: null,
      loop: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    } as unknown as AudioBufferSourceNode;
  }

  createBuffer(channels: number, length: number, sampleRate: number) {
    return {
      numberOfChannels: channels,
      length,
      sampleRate,
      getChannelData: () => new Float32Array(length),
    } as AudioBuffer;
  }

  resume() {
    return Promise.resolve();
  }

  close() {
    return Promise.resolve();
  }
} as unknown as typeof AudioContext;

global.window.AudioContext = global.AudioContext;
(
  global.window as unknown as { webkitAudioContext: typeof AudioContext }
).webkitAudioContext = global.AudioContext;
