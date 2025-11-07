import { useEffect, useRef, useState } from 'react';

export type WaveformType = 'sine' | 'square' | 'triangle' | 'sawtooth' | 'filtered' | 'noise';

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
  
  const {
    frequency = 1000,
    waveform = 'sine',
    volume = 50
  } = options;

  useEffect(() => {
    return () => {
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const createNoiseBuffer = (type: 'white' | 'pink' | 'brown' = 'white') => {
    const ctx = audioContextRef.current!;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    }

    return buffer;
  };

  const play = () => {
    const ctx = initAudioContext();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (!gainNodeRef.current) {
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.connect(ctx.destination);
    }

    gainNodeRef.current.gain.value = volume / 100;

    if (waveform === 'noise') {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop();
      }
      noiseNodeRef.current = ctx.createBufferSource();
      noiseNodeRef.current.buffer = createNoiseBuffer('white');
      noiseNodeRef.current.loop = true;
      noiseNodeRef.current.connect(gainNodeRef.current);
      noiseNodeRef.current.start();
    } else {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      oscillatorRef.current = ctx.createOscillator();
      oscillatorRef.current.type = waveform === 'filtered' ? 'sine' : waveform;
      oscillatorRef.current.frequency.value = frequency;
      oscillatorRef.current.connect(gainNodeRef.current);
      oscillatorRef.current.start();
    }

    setIsPlaying(true);
  };

  const stop = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      oscillatorRef.current = null;
    }

    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      noiseNodeRef.current = null;
    }

    setIsPlaying(false);
  };

  const updateFrequency = (newFrequency: number) => {
    if (oscillatorRef.current && isPlaying) {
      oscillatorRef.current.frequency.setValueAtTime(
        newFrequency,
        audioContextRef.current!.currentTime
      );
    }
  };

  const updateVolume = (newVolume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        newVolume / 100,
        audioContextRef.current!.currentTime
      );
    }
  };

  const updateWaveform = (newWaveform: WaveformType) => {
    if (isPlaying) {
      stop();
      setTimeout(() => play(), 50);
    }
  };

  return {
    isPlaying,
    play,
    stop,
    toggle: () => isPlaying ? stop() : play(),
    updateFrequency,
    updateVolume,
    updateWaveform
  };
}
