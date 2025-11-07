import { useEffect, useRef, useState } from 'react';

export type NotchNoiseType = 'white' | 'pink' | 'purple';

export function useNotchedNoise() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const notchFilterRef = useRef<BiquadFilterNode | null>(null);

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

  const createNoiseBuffer = (type: NotchNoiseType = 'white') => {
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
    } else if (type === 'purple') {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        const current = white - lastOut;
        output[i] = current;
        lastOut = white;
        output[i] *= 0.3;
      }
    }

    return buffer;
  };

  const play = (notchFrequency: number, notchWidth: number, noiseType: NotchNoiseType = 'white') => {
    const ctx = initAudioContext();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (noiseNodeRef.current) {
      noiseNodeRef.current.stop();
    }

    if (notchFilterRef.current) {
      notchFilterRef.current.disconnect();
    }

    if (!gainNodeRef.current) {
      gainNodeRef.current = ctx.createGain();
    }

    gainNodeRef.current.gain.value = 0.3;

    noiseNodeRef.current = ctx.createBufferSource();
    noiseNodeRef.current.buffer = createNoiseBuffer(noiseType);
    noiseNodeRef.current.loop = true;

    notchFilterRef.current = ctx.createBiquadFilter();
    notchFilterRef.current.type = 'notch';
    notchFilterRef.current.frequency.value = notchFrequency;
    notchFilterRef.current.Q.value = notchFrequency / notchWidth;

    noiseNodeRef.current.connect(notchFilterRef.current);
    notchFilterRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(ctx.destination);

    noiseNodeRef.current.start();
    setIsPlaying(true);
  };

  const stop = () => {
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      noiseNodeRef.current = null;
    }

    if (notchFilterRef.current) {
      try {
        notchFilterRef.current.disconnect();
      } catch (e) {
        // Already disconnected
      }
      notchFilterRef.current = null;
    }

    setIsPlaying(false);
  };

  const updateNotch = (frequency: number, width: number) => {
    if (notchFilterRef.current && isPlaying && audioContextRef.current) {
      notchFilterRef.current.frequency.setValueAtTime(
        frequency,
        audioContextRef.current.currentTime
      );
      notchFilterRef.current.Q.setValueAtTime(
        frequency / width,
        audioContextRef.current.currentTime
      );
    }
  };

  const replaceNoiseSource = (notchFrequency: number, notchWidth: number, noiseType: NotchNoiseType) => {
    if (!isPlaying || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oldNode = noiseNodeRef.current;

    const newNode = ctx.createBufferSource();
    newNode.buffer = createNoiseBuffer(noiseType);
    newNode.loop = true;

    if (notchFilterRef.current && gainNodeRef.current) {
      newNode.connect(notchFilterRef.current);
      newNode.start();
      
      noiseNodeRef.current = newNode;

      if (oldNode) {
        try {
          oldNode.stop();
          oldNode.disconnect();
        } catch (e) {
          // Already stopped
        }
      }
    }
  };

  return {
    isPlaying,
    play,
    stop,
    toggle: (notchFrequency: number, notchWidth: number, noiseType: NotchNoiseType) => 
      isPlaying ? stop() : play(notchFrequency, notchWidth, noiseType),
    updateNotch,
    replaceNoiseSource
  };
}
