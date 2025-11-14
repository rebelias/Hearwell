import { useEffect, useRef, useState } from 'react';
import { logError } from '@/lib/errorLogger';

export type WaveformType =
  | 'sine'
  | 'square'
  | 'triangle'
  | 'sawtooth'
  | 'filtered'
  | 'noise';

interface AudioEngineOptions {
  frequency?: number;
  waveform?: WaveformType;
  volume?: number;
}

export function useAudioEngine(options: AudioEngineOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Use refs to store current values so they can be updated dynamically
  const frequencyRef = useRef<number>(options.frequency ?? 1000);
  const waveformRef = useRef<WaveformType>(options.waveform ?? 'sine');
  const volumeRef = useRef<number>(options.volume ?? 50);

  const {
    frequency: initialFrequency = 1000,
    waveform: initialWaveform = 'sine',
    volume: initialVolume = 50,
  } = options;

  // Initialize refs with initial values
  useEffect(() => {
    frequencyRef.current = initialFrequency;
    waveformRef.current = initialWaveform;
    volumeRef.current = initialVolume;
  }, [initialFrequency, initialWaveform, initialVolume]);

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
          hook: 'useAudioEngine',
          operation: 'initAudioContext',
        }
      );
      throw error;
    }
  };

  const createNoiseBuffer = (type: 'white' | 'pink' | 'brown' = 'white') => {
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
      }

      return buffer;
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to create noise buffer'),
        {
          hook: 'useAudioEngine',
          operation: 'createNoiseBuffer',
          noiseType: type,
        }
      );
      throw error;
    }
  };

  const play = () => {
    try {
      const ctx = initAudioContext();

      if (ctx.state === 'suspended') {
        ctx.resume().catch(error => {
          logError(
            error instanceof Error
              ? error
              : new Error('Failed to resume AudioContext'),
            {
              hook: 'useAudioEngine',
              operation: 'play',
            }
          );
        });
      }

      if (!gainNodeRef.current) {
        gainNodeRef.current = ctx.createGain();
        gainNodeRef.current.connect(ctx.destination);
      }

      gainNodeRef.current.gain.value = volumeRef.current / 100;

      if (waveformRef.current === 'noise') {
        if (noiseNodeRef.current) {
          try {
            noiseNodeRef.current.stop();
          } catch {
            // Already stopped
          }
        }
        noiseNodeRef.current = ctx.createBufferSource();
        noiseNodeRef.current.buffer = createNoiseBuffer('white');
        noiseNodeRef.current.loop = true;
        noiseNodeRef.current.connect(gainNodeRef.current);
        noiseNodeRef.current.start();
      } else {
        if (oscillatorRef.current) {
          try {
            oscillatorRef.current.stop();
            oscillatorRef.current.disconnect();
          } catch {
            // Already stopped
          }
          oscillatorRef.current = null;
        }

        if (filterNodeRef.current) {
          filterNodeRef.current.disconnect();
          filterNodeRef.current = null;
        }

        oscillatorRef.current = ctx.createOscillator();
        const waveformType =
          waveformRef.current === 'filtered' ? 'sine' : waveformRef.current;
        oscillatorRef.current.type = waveformType as OscillatorType;
        oscillatorRef.current.frequency.value = frequencyRef.current;

        // Apply low-pass filter for 'filtered' waveform
        if (waveformRef.current === 'filtered') {
          filterNodeRef.current = ctx.createBiquadFilter();
          filterNodeRef.current.type = 'lowpass';
          filterNodeRef.current.frequency.value = 1000; // 1kHz cutoff for softer sound
          filterNodeRef.current.Q.value = 1;
          oscillatorRef.current.connect(filterNodeRef.current);
          filterNodeRef.current.connect(gainNodeRef.current);
        } else {
          oscillatorRef.current.connect(gainNodeRef.current);
        }

        oscillatorRef.current.start();
      }

      setIsPlaying(true);
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error('Failed to play audio'),
        {
          hook: 'useAudioEngine',
          operation: 'play',
          waveform: waveformRef.current,
          frequency: frequencyRef.current,
          volume: volumeRef.current,
        }
      );
      setIsPlaying(false);
      throw error;
    }
  };

  const stop = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch {
        // Already stopped
      }
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }

    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
      } catch {
        // Already stopped
      }
      noiseNodeRef.current.disconnect();
      noiseNodeRef.current = null;
    }

    if (filterNodeRef.current) {
      filterNodeRef.current.disconnect();
      filterNodeRef.current = null;
    }

    setIsPlaying(false);
  };

  const updateFrequency = (newFrequency: number) => {
    try {
      frequencyRef.current = newFrequency;
      if (oscillatorRef.current && isPlaying && audioContextRef.current) {
        oscillatorRef.current.frequency.setValueAtTime(
          newFrequency,
          audioContextRef.current.currentTime
        );
      }
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to update frequency'),
        {
          hook: 'useAudioEngine',
          operation: 'updateFrequency',
          frequency: newFrequency,
        }
      );
    }
  };

  const updateVolume = (newVolume: number) => {
    try {
      volumeRef.current = newVolume;
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setValueAtTime(
          newVolume / 100,
          audioContextRef.current.currentTime
        );
      }
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error('Failed to update volume'),
        {
          hook: 'useAudioEngine',
          operation: 'updateVolume',
          volume: newVolume,
        }
      );
    }
  };

  const updateWaveform = (newWaveform: WaveformType) => {
    waveformRef.current = newWaveform;
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      // Stop current playback
      stop();
      // Restart with new waveform after a brief delay
      setTimeout(() => {
        // Restart playback with the new waveform
        play();
      }, 50);
    }
  };

  return {
    isPlaying,
    play,
    stop,
    toggle: () => (isPlaying ? stop() : play()),
    updateFrequency,
    updateVolume,
    updateWaveform,
  };
}
