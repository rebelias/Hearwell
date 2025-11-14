import { useRef } from 'react';
import { logError } from '@/lib/errorLogger';

type EarSelection = 'both' | 'left' | 'right';
type ToneType = 'pure' | 'warble';

export function useAudiometerEngine() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);

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
          hook: 'useAudiometerEngine',
          operation: 'initAudioContext',
        }
      );
      throw error;
    }
  };

  const playTone = async (
    frequency: number,
    volumeDb: number,
    earSelection: EarSelection = 'both',
    duration: number = 1000,
    toneType: ToneType = 'pure',
    calibrationOffset: number = 0
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const executePlayback = async () => {
        try {
          const ctx = initAudioContext();

          // CRITICAL: Must await AudioContext resume before playing
          if (ctx.state === 'suspended') {
            try {
              await ctx.resume();
            } catch (error) {
              logError(
                error instanceof Error
                  ? error
                  : new Error('Failed to resume AudioContext'),
                {
                  hook: 'useAudiometerEngine',
                  operation: 'playTone',
                }
              );
              reject(error);
              return;
            }
          }

          if (oscillatorRef.current) {
            try {
              oscillatorRef.current.stop();
            } catch {
              // Already stopped
            }
          }

          if (lfoRef.current) {
            try {
              lfoRef.current.stop();
            } catch {
              // Already stopped
            }
          }

          if (gainNodeRef.current) {
            gainNodeRef.current.disconnect();
          }

          if (lfoGainRef.current) {
            lfoGainRef.current.disconnect();
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

          // Apply calibration offset
          gainValue =
            gainValue * (calibrationOffset > 0 ? calibrationOffset : 1);
          gainNode.gain.value = Math.min(gainValue, 0.5);

          if (earSelection === 'left') {
            panner.pan.value = -1;
          } else if (earSelection === 'right') {
            panner.pan.value = 1;
          } else {
            panner.pan.value = 0;
          }

          // Add warble modulation if toneType is 'warble'
          if (toneType === 'warble') {
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();

            lfo.frequency.value = 4.5; // 4.5 Hz modulation rate
            lfoGain.gain.value = frequency * 0.05; // ±5% frequency modulation

            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);

            lfo.start();
            lfoRef.current = lfo;
            lfoGainRef.current = lfoGain;
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
            } catch {
              // Already stopped
            }

            if (lfoRef.current) {
              try {
                lfoRef.current.stop();
                lfoRef.current.disconnect();
              } catch {
                // Already stopped
              }
              lfoRef.current = null;
            }

            try {
              gainNode.disconnect();
              panner.disconnect();
            } catch {
              // Already disconnected
            }

            if (lfoGainRef.current) {
              try {
                lfoGainRef.current.disconnect();
              } catch {
                // Already disconnected
              }
              lfoGainRef.current = null;
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
        } catch (error) {
          logError(
            error instanceof Error ? error : new Error('Failed to play tone'),
            {
              hook: 'useAudiometerEngine',
              operation: 'playTone',
              frequency,
              volumeDb,
              earSelection,
              duration,
              toneType,
            }
          );
          reject(error);
        }
      };

      executePlayback();
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
      } catch {
        // Already stopped
      }
      oscillatorRef.current = null;
    }

    if (lfoRef.current) {
      try {
        lfoRef.current.stop();
      } catch {
        // Already stopped
      }
      lfoRef.current = null;
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }

    if (lfoGainRef.current) {
      lfoGainRef.current.disconnect();
      lfoGainRef.current = null;
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

  const resumeAudioContext = async () => {
    try {
      const ctx = initAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to resume AudioContext'),
        {
          hook: 'useAudiometerEngine',
          operation: 'resumeAudioContext',
        }
      );
      throw error;
    }
  };

  return {
    playTone,
    stop,
    cleanup,
    resumeAudioContext,
  };
}
