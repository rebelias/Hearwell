import { useEffect, useRef, useState } from 'react';
import { logError } from '@/lib/errorLogger';
import { createNoiseBuffer as sharedCreateNoiseBuffer } from '@/lib/noiseUtils';
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

  const getNoiseBuffer = (type: NotchNoiseType = 'white') => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx) {
        throw new Error('AudioContext not initialized');
      }
      return sharedCreateNoiseBuffer(ctx, type);
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to create noise buffer'),
        {
          hook: 'useNotchedNoise',
          operation: 'getNoiseBuffer',
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
      noiseNodeRef.current.buffer = getNoiseBuffer(options.noiseType);
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
      newNode.buffer = getNoiseBuffer(options.noiseType);
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
