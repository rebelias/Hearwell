import { useRef } from 'react';

type EarSelection = 'both' | 'left' | 'right';

export function useAudiometerEngine() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playTone = (frequency: number, volumeDb: number, earSelection: EarSelection = 'both', duration: number = 1000): Promise<void> => {
    return new Promise((resolve) => {
      const ctx = initAudioContext();
      
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
          // Already stopped
        }
      }

      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }

      if (pannerRef.current) {
        pannerRef.current.disconnect();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const panner = ctx.createStereoPanner();

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      const normalizedDb = Math.max(-10, Math.min(100, volumeDb));
      let gainValue: number;
      if (normalizedDb <= 0) {
        gainValue = 0.001 * Math.pow(1.4, normalizedDb + 10);
      } else if (normalizedDb <= 40) {
        gainValue = 0.005 + (normalizedDb / 40) * 0.095;
      } else {
        gainValue = 0.1 + ((normalizedDb - 40) / 60) * 0.4;
      }
      gainNode.gain.value = Math.min(gainValue, 0.5);

      if (earSelection === 'left') {
        panner.pan.value = -1;
      } else if (earSelection === 'right') {
        panner.pan.value = 1;
      } else {
        panner.pan.value = 0;
      }

      oscillator.connect(gainNode);
      gainNode.connect(panner);
      panner.connect(ctx.destination);

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      pannerRef.current = panner;

      oscillator.start();

      const timeoutId = setTimeout(() => {
        try {
          oscillator.stop();
          oscillator.disconnect();
        } catch (e) {
          // Already stopped
        }
        
        try {
          gainNode.disconnect();
          panner.disconnect();
        } catch (e) {
          // Already disconnected
        }
        
        if (oscillatorRef.current === oscillator) {
          oscillatorRef.current = null;
        }
        if (gainNodeRef.current === gainNode) {
          gainNodeRef.current = null;
        }
        if (pannerRef.current === panner) {
          pannerRef.current = null;
        }
        
        if (timeoutIdRef.current === timeoutId) {
          timeoutIdRef.current = null;
        }
        
        resolve();
      }, duration);
      
      timeoutIdRef.current = timeoutId;
    });
  };

  const stop = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      oscillatorRef.current = null;
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }

    if (pannerRef.current) {
      pannerRef.current.disconnect();
      pannerRef.current = null;
    }
  };

  const cleanup = () => {
    stop();
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  return {
    playTone,
    stop,
    cleanup
  };
}
