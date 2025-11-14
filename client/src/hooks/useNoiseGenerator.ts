import { useEffect, useRef, useState } from 'react';
import { logError } from '@/lib/errorLogger';

export type NoiseColor =
  | 'white'
  | 'pink'
  | 'brown'
  | 'violet'
  | 'blue'
  | 'grey';

export function useNoiseGenerator() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodesRef = useRef<BiquadFilterNode[]>([]);

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
          hook: 'useNoiseGenerator',
          operation: 'initAudioContext',
        }
      );
      throw error;
    }
  };

  const createNoiseBuffer = (type: NoiseColor = 'white') => {
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
      } else if (type === 'violet') {
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          const current = white - lastOut;
          output[i] = current;
          lastOut = white;
          output[i] *= 0.3;
        }
      } else if (type === 'blue') {
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          const current = (white + lastOut) / 2;
          output[i] = current - lastOut;
          lastOut = current;
          output[i] *= 0.5;
        }
      } else if (type === 'grey') {
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
          hook: 'useNoiseGenerator',
          operation: 'createNoiseBuffer',
          noiseType: type,
        }
      );
      throw error;
    }
  };

  const play = (
    eqValues: number[],
    noiseColor: NoiseColor = 'white',
    volume: number = 50
  ) => {
    try {
      const ctx = initAudioContext();

      if (ctx.state === 'suspended') {
        ctx.resume().catch(error => {
          logError(
            error instanceof Error
              ? error
              : new Error('Failed to resume AudioContext'),
            {
              hook: 'useNoiseGenerator',
              operation: 'play',
            }
          );
        });
      }

      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop();
      }

      filterNodesRef.current.forEach(filter => filter.disconnect());
      filterNodesRef.current = [];

      if (!gainNodeRef.current) {
        gainNodeRef.current = ctx.createGain();
      }

      const normalizedVolume = volume / 100;
      gainNodeRef.current.gain.value = normalizedVolume * 0.3;

      noiseNodeRef.current = ctx.createBufferSource();
      noiseNodeRef.current.buffer = createNoiseBuffer(noiseColor);
      noiseNodeRef.current.loop = true;

      let currentNode: AudioNode = noiseNodeRef.current;

      const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000];

      frequencies.forEach((freq, index) => {
        const filter = ctx.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = freq;
        filter.Q.value = 1.0;
        filter.gain.value = (eqValues[index] - 50) * 0.4;

        currentNode.connect(filter);
        currentNode = filter;
        filterNodesRef.current.push(filter);
      });

      currentNode.connect(gainNodeRef.current);
      gainNodeRef.current.connect(ctx.destination);

      noiseNodeRef.current.start();
      setIsPlaying(true);
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error('Failed to play noise'),
        {
          hook: 'useNoiseGenerator',
          operation: 'play',
          noiseColor,
          eqValues,
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

    filterNodesRef.current.forEach(filter => {
      try {
        filter.disconnect();
      } catch {
        // Already disconnected
      }
    });
    filterNodesRef.current = [];

    setIsPlaying(false);
  };

  const updateEqualizer = (eqValues: number[]) => {
    try {
      if (
        filterNodesRef.current.length > 0 &&
        isPlaying &&
        audioContextRef.current
      ) {
        const ctx = audioContextRef.current;
        filterNodesRef.current.forEach((filter, index) => {
          if (index < eqValues.length) {
            filter.gain.setValueAtTime(
              (eqValues[index] - 50) * 0.4,
              ctx.currentTime
            );
          }
        });
      }
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to update equalizer'),
        {
          hook: 'useNoiseGenerator',
          operation: 'updateEqualizer',
          eqValues,
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
          hook: 'useNoiseGenerator',
          operation: 'updateVolume',
          volume,
        }
      );
    }
  };

  return {
    isPlaying,
    play,
    stop,
    toggle: (eqValues: number[], noiseColor: NoiseColor) =>
      isPlaying ? stop() : play(eqValues, noiseColor),
    updateEqualizer,
    updateVolume,
  };
}
