import { useEffect, useRef, useState } from 'react';
import { logError } from '@/lib/errorLogger';

export type NotchNoiseType = 'white' | 'pink' | 'brown' | 'purple' | 'grey';
export type StereoWidth = 'mono' | 'narrow' | 'normal' | 'wide';

// 10-band frequency centers (Hz) - matching myNoise approach
const BAND_FREQUENCIES = [
  60, // Sub-bass
  125, // Low Bass
  250, // Bass
  500, // High Bass
  1000, // Low Mids
  2000, // Mids
  4000, // High Mids
  8000, // Low Treble
  12000, // Treble
  16000, // High Treble
];

export interface NotchedNoiseOptions {
  bandGains: number[]; // 10 values, 0-100, representing gain for each band
  noiseType: NotchNoiseType;
  volume: number; // 0-100
  stereoWidth: StereoWidth;
}

export function useNotchedNoise() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pannerNodeRef = useRef<StereoPannerNode | null>(null);
  const bandFiltersRef = useRef<BiquadFilterNode[]>([]);
  const notchFiltersRef = useRef<BiquadFilterNode[]>([]);

  useEffect(() => {
    return () => {
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initAudioContext = () => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }
      return audioContextRef.current;
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to initialize AudioContext'),
        {
          hook: 'useNotchedNoise',
          operation: 'initAudioContext',
        }
      );
      throw error;
    }
  };

  const createNoiseBuffer = (type: NotchNoiseType = 'white') => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx) {
        throw new Error('AudioContext not initialized');
      }
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      if (type === 'white') {
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
      } else if (type === 'pink') {
        let b0 = 0,
          b1 = 0,
          b2 = 0,
          b3 = 0,
          b4 = 0,
          b5 = 0,
          b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
          b6 = white * 0.115926;
        }
      } else if (type === 'brown') {
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }
      } else if (type === 'purple') {
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          const current = white - lastOut;
          output[i] = current;
          lastOut = white;
          output[i] *= 0.3;
        }
      } else if (type === 'grey') {
        // Grey noise is white noise with equal loudness curve applied
        // Simplified version - white noise with slight filtering
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
      }

      return buffer;
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to create noise buffer'),
        {
          hook: 'useNotchedNoise',
          operation: 'createNoiseBuffer',
          noiseType: type,
        }
      );
      throw error;
    }
  };

  const getStereoPanValue = (width: StereoWidth): number => {
    switch (width) {
      case 'mono':
        return 0;
      case 'narrow':
        return 0.3;
      case 'normal':
        return 0.5;
      case 'wide':
        return 0.7;
      default:
        return 0;
    }
  };

  const play = (options: NotchedNoiseOptions) => {
    try {
      const ctx = initAudioContext();

      if (ctx.state === 'suspended') {
        ctx.resume().catch(error => {
          logError(
            error instanceof Error
              ? error
              : new Error('Failed to resume AudioContext'),
            {
              hook: 'useNotchedNoise',
              operation: 'play',
            }
          );
        });
      }

      // Clean up existing nodes
      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop();
      }
      bandFiltersRef.current.forEach(filter => filter.disconnect());
      notchFiltersRef.current.forEach(filter => filter.disconnect());
      bandFiltersRef.current = [];
      notchFiltersRef.current = [];

      // Create gain node
      if (!gainNodeRef.current) {
        gainNodeRef.current = ctx.createGain();
      }
      const normalizedVolume = options.volume / 100;
      gainNodeRef.current.gain.value = normalizedVolume * 0.3;

      // Create stereo panner
      if (!pannerNodeRef.current) {
        pannerNodeRef.current = ctx.createStereoPanner();
      }
      pannerNodeRef.current.pan.value = getStereoPanValue(options.stereoWidth);

      // Create noise source
      noiseNodeRef.current = ctx.createBufferSource();
      noiseNodeRef.current.buffer = createNoiseBuffer(options.noiseType);
      noiseNodeRef.current.loop = true;

      // Build the filter chain: noise -> band filters -> notch filters -> panner -> gain -> destination
      let currentNode: AudioNode = noiseNodeRef.current;

      // Create 10 band filters (peaking) and notch filters for each band
      BAND_FREQUENCIES.forEach((freq, index) => {
        // Band filter (peaking) - controls gain for this frequency band
        const bandFilter = ctx.createBiquadFilter();
        bandFilter.type = 'peaking';
        bandFilter.frequency.value = freq;
        bandFilter.Q.value = 1.0;
        const bandGain = (options.bandGains[index] || 50) - 50; // Convert 0-100 to -50 to +50
        bandFilter.gain.value = bandGain * 0.4; // Scale to dB

        // Notch filter - creates a dip in the middle of the band
        const notchFilter = ctx.createBiquadFilter();
        notchFilter.type = 'notch';
        notchFilter.frequency.value = freq;
        notchFilter.Q.value = 2.0; // Sharp notch

        currentNode.connect(bandFilter);
        bandFilter.connect(notchFilter);
        currentNode = notchFilter;

        bandFiltersRef.current.push(bandFilter);
        notchFiltersRef.current.push(notchFilter);
      });

      // Connect to stereo panner and gain
      currentNode.connect(pannerNodeRef.current);
      pannerNodeRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(ctx.destination);

      noiseNodeRef.current.start();
      setIsPlaying(true);
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to play notched noise'),
        {
          hook: 'useNotchedNoise',
          operation: 'play',
          options,
        }
      );
      setIsPlaying(false);
      throw error;
    }
  };

  const stop = () => {
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
      } catch {
        // Already stopped
      }
      noiseNodeRef.current = null;
    }

    bandFiltersRef.current.forEach(filter => {
      try {
        filter.disconnect();
      } catch {
        // Already disconnected
      }
    });
    bandFiltersRef.current = [];

    notchFiltersRef.current.forEach(filter => {
      try {
        filter.disconnect();
      } catch {
        // Already disconnected
      }
    });
    notchFiltersRef.current = [];

    setIsPlaying(false);
  };

  const updateBandGains = (bandGains: number[]) => {
    try {
      if (
        bandFiltersRef.current.length > 0 &&
        isPlaying &&
        audioContextRef.current
      ) {
        const now = audioContextRef.current.currentTime;
        bandFiltersRef.current.forEach((filter, index) => {
          if (index < bandGains.length) {
            const bandGain = (bandGains[index] || 50) - 50;
            filter.gain.cancelScheduledValues(now);
            filter.gain.linearRampToValueAtTime(bandGain * 0.4, now + 0.01);
          }
        });
      }
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to update band gains'),
        {
          hook: 'useNotchedNoise',
          operation: 'updateBandGains',
          bandGains,
        }
      );
    }
  };

  const updateVolume = (volume: number) => {
    try {
      if (gainNodeRef.current && audioContextRef.current) {
        const normalizedVolume = volume / 100;
        const now = audioContextRef.current.currentTime;
        gainNodeRef.current.gain.cancelScheduledValues(now);
        gainNodeRef.current.gain.linearRampToValueAtTime(
          normalizedVolume * 0.3,
          now + 0.01
        );
      }
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error('Failed to update volume'),
        {
          hook: 'useNotchedNoise',
          operation: 'updateVolume',
          volume,
        }
      );
    }
  };

  const updateStereoWidth = (width: StereoWidth) => {
    try {
      if (pannerNodeRef.current && audioContextRef.current) {
        const now = audioContextRef.current.currentTime;
        pannerNodeRef.current.pan.cancelScheduledValues(now);
        pannerNodeRef.current.pan.linearRampToValueAtTime(
          getStereoPanValue(width),
          now + 0.01
        );
      }
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to update stereo width'),
        {
          hook: 'useNotchedNoise',
          operation: 'updateStereoWidth',
          width,
        }
      );
    }
  };

  const replaceNoiseSource = (options: NotchedNoiseOptions) => {
    try {
      if (!isPlaying || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const oldNode = noiseNodeRef.current;

      const newNode = ctx.createBufferSource();
      newNode.buffer = createNoiseBuffer(options.noiseType);
      newNode.loop = true;

      if (bandFiltersRef.current.length > 0) {
        newNode.connect(bandFiltersRef.current[0]);
        newNode.start();

        noiseNodeRef.current = newNode;

        if (oldNode) {
          try {
            oldNode.stop();
            oldNode.disconnect();
          } catch {
            // Already stopped
          }
        }
      }
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to replace noise source'),
        {
          hook: 'useNotchedNoise',
          operation: 'replaceNoiseSource',
          options,
        }
      );
    }
  };

  return {
    isPlaying,
    play,
    stop,
    toggle: (options: NotchedNoiseOptions) =>
      isPlaying ? stop() : play(options),
    updateBandGains,
    updateVolume,
    updateStereoWidth,
    replaceNoiseSource,
  };
}
