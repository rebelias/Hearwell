import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/**
 * Node 18 compatibility shims for newer jsdom/webidl expectations.
 * These are no-ops on Node versions that already support them (e.g. Node 20+).
 */
const defineBooleanGetterIfMissing = (
  target: object,
  property: string,
  value: boolean
) => {
  const descriptor = Object.getOwnPropertyDescriptor(target, property);
  if (!descriptor) {
    Object.defineProperty(target, property, {
      configurable: true,
      enumerable: false,
      get: () => value,
    });
  }
};

const defineNumberGetterIfMissing = (
  target: object,
  property: string,
  value: number
) => {
  const descriptor = Object.getOwnPropertyDescriptor(target, property);
  if (!descriptor) {
    Object.defineProperty(target, property, {
      configurable: true,
      enumerable: false,
      get: () => value,
    });
  }
};

defineBooleanGetterIfMissing(ArrayBuffer.prototype, 'resizable', false);
defineNumberGetterIfMissing(ArrayBuffer.prototype, 'maxByteLength', 0);
if (typeof SharedArrayBuffer !== 'undefined') {
  defineBooleanGetterIfMissing(SharedArrayBuffer.prototype, 'growable', false);
  defineNumberGetterIfMissing(SharedArrayBuffer.prototype, 'maxByteLength', 0);
}

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

  createConstantSource() {
    return {
      offset: { value: 0 },
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    } as unknown as ConstantSourceNode;
  }

  createBuffer(channels: number, length: number, sampleRate: number) {
    return {
      numberOfChannels: channels,
      length,
      sampleRate,
      getChannelData: () => new Float32Array(length),
    } as AudioBuffer;
  }

  decodeAudioData(_arrayBuffer: ArrayBuffer) {
    return Promise.resolve(this.createBuffer(2, 44100, this.sampleRate));
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
