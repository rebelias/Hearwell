import { useEffect, useRef, useState } from 'react';

export type NoiseColor = 'white' | 'pink' | 'brown' | 'violet' | 'blue' | 'grey';

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
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const createNoiseBuffer = (type: NoiseColor = 'white') => {
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
  };

  const play = (eqValues: number[], noiseColor: NoiseColor = 'white') => {
    const ctx = initAudioContext();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (noiseNodeRef.current) {
      noiseNodeRef.current.stop();
    }

    filterNodesRef.current.forEach(filter => filter.disconnect());
    filterNodesRef.current = [];

    if (!gainNodeRef.current) {
      gainNodeRef.current = ctx.createGain();
    }

    gainNodeRef.current.gain.value = 0.3;

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

    filterNodesRef.current.forEach(filter => {
      try {
        filter.disconnect();
      } catch (e) {
        // Already disconnected
      }
    });
    filterNodesRef.current = [];

    setIsPlaying(false);
  };

  const updateEqualizer = (eqValues: number[]) => {
    if (filterNodesRef.current.length > 0 && isPlaying) {
      filterNodesRef.current.forEach((filter, index) => {
        if (index < eqValues.length) {
          filter.gain.setValueAtTime(
            (eqValues[index] - 50) * 0.4,
            audioContextRef.current!.currentTime
          );
        }
      });
    }
  };

  return {
    isPlaying,
    play,
    stop,
    toggle: (eqValues: number[], noiseColor: NoiseColor) => isPlaying ? stop() : play(eqValues, noiseColor),
    updateEqualizer
  };
}
