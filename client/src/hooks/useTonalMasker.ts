import { useRef, useState, useEffect, useCallback } from 'react';
import { logError } from '@/lib/errorLogger';
import { WaveformType } from './useAudioEngine';

export type ModulationType = 'am' | 'fm' | 'both' | 'cr';
export type EarSelection = 'both' | 'left' | 'right';

interface TonalMaskerOptions {
  frequency?: number;
  modulationType?: ModulationType;
  modulationRate?: number;
  modulationDepth?: number;
  volume?: number;
  waveform?: WaveformType;
  earSelection?: EarSelection;
  // CR mode specific parameters
  crToneDuration?: number; // Duration of each tone in milliseconds (default: 200ms)
  crGapDuration?: number; // Gap between tones in milliseconds (default: 50ms)
  crFrequencySpread?: number; // Percentage spread around tinnitus frequency (default: 10%)
  // Randomized modulation parameters
  randomizeModulation?: boolean; // Enable randomization of modulation parameters
  modulationRateRange?: [number, number]; // Min and max modulation rate for randomization (default: [0.5, 2])
  modulationDepthRange?: [number, number]; // Min and max modulation depth for randomization (default: [30, 70])
  randomizationInterval?: number; // How often to randomize in milliseconds (default: 5000ms)
  // Background sounds
  backgroundSound?: 'none' | 'cicadas' | 'birds' | 'ocean' | 'rain';
  backgroundVolume?: number; // Background sound volume 0-100 (default: 20)
}

export function useTonalMasker(options: TonalMaskerOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const carrierOscRef = useRef<OscillatorNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const lfoGainAMRef = useRef<GainNode | null>(null);
  const lfoGainFMRef = useRef<GainNode | null>(null);
  const constantSourceRef = useRef<ConstantSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // CR mode specific refs
  const crIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const crToneSequenceRef = useRef<number[]>([]);
  const crCurrentIndexRef = useRef<number>(0);
  const crOscillatorRef = useRef<OscillatorNode | null>(null);
  const crGainRef = useRef<GainNode | null>(null);
  const crPannerRef = useRef<StereoPannerNode | null>(null);
  const crPlayingRef = useRef<boolean>(false);

  // Randomized modulation refs
  const randomizationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentModulationRateRef = useRef<number>(options.modulationRate ?? 1);
  const currentModulationDepthRef = useRef<number>(
    options.modulationDepth ?? 50
  );

  // Background sound refs
  const backgroundNoiseRef = useRef<AudioBufferSourceNode | null>(null);
  const backgroundGainRef = useRef<GainNode | null>(null);
  const backgroundFilterRef = useRef<BiquadFilterNode | null>(null);
  const backgroundBufferCacheRef = useRef<Map<string, AudioBuffer>>(new Map());

  // Use refs for dynamic updates
  const frequencyRef = useRef<number>(options.frequency ?? 4000);
  const modulationTypeRef = useRef<ModulationType>(
    options.modulationType ?? 'am'
  );
  const modulationRateRef = useRef<number>(options.modulationRate ?? 1);
  const modulationDepthRef = useRef<number>(options.modulationDepth ?? 50);
  const volumeRef = useRef<number>(options.volume ?? 30);
  const waveformRef = useRef<WaveformType>(options.waveform ?? 'sine');
  const earSelectionRef = useRef<EarSelection>(options.earSelection ?? 'both');
  const crToneDurationRef = useRef<number>(options.crToneDuration ?? 200);
  const crGapDurationRef = useRef<number>(options.crGapDuration ?? 50);
  const crFrequencySpreadRef = useRef<number>(options.crFrequencySpread ?? 10);
  const randomizeModulationRef = useRef<boolean>(
    options.randomizeModulation ?? false
  );
  const modulationRateRangeRef = useRef<[number, number]>(
    options.modulationRateRange ?? [0.5, 2]
  );
  const modulationDepthRangeRef = useRef<[number, number]>(
    options.modulationDepthRange ?? [30, 70]
  );
  const randomizationIntervalMsRef = useRef<number>(
    options.randomizationInterval ?? 5000
  );
  const backgroundSoundRef = useRef<
    'none' | 'cicadas' | 'birds' | 'ocean' | 'rain'
  >(options.backgroundSound ?? 'none');
  const backgroundVolumeRef = useRef<number>(options.backgroundVolume ?? 20);

  // Initialize refs with initial values
  useEffect(() => {
    frequencyRef.current = options.frequency ?? 4000;
    modulationTypeRef.current = options.modulationType ?? 'am';
    modulationRateRef.current = options.modulationRate ?? 1;
    modulationDepthRef.current = options.modulationDepth ?? 50;
    volumeRef.current = options.volume ?? 30;
    waveformRef.current = options.waveform ?? 'sine';
    earSelectionRef.current = options.earSelection ?? 'both';
    crToneDurationRef.current = options.crToneDuration ?? 200;
    crGapDurationRef.current = options.crGapDuration ?? 50;
    crFrequencySpreadRef.current = options.crFrequencySpread ?? 10;
    randomizeModulationRef.current = options.randomizeModulation ?? false;
    modulationRateRangeRef.current = options.modulationRateRange ?? [0.5, 2];
    modulationDepthRangeRef.current = options.modulationDepthRange ?? [30, 70];
    randomizationIntervalMsRef.current = options.randomizationInterval ?? 5000;
    backgroundSoundRef.current = options.backgroundSound ?? 'none';
    backgroundVolumeRef.current = options.backgroundVolume ?? 20;

    // Initialize current modulation values
    currentModulationRateRef.current = options.modulationRate ?? 1;
    currentModulationDepthRef.current = options.modulationDepth ?? 50;
  }, [
    options.frequency,
    options.modulationType,
    options.modulationRate,
    options.modulationDepth,
    options.volume,
    options.waveform,
    options.earSelection,
    options.crToneDuration,
    options.crGapDuration,
    options.crFrequencySpread,
    options.randomizeModulation,
    options.modulationRateRange,
    options.modulationDepthRange,
    options.randomizationInterval,
    options.backgroundSound,
    options.backgroundVolume,
  ]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      // Stop randomization interval
      if (randomizationIntervalRef.current) {
        clearInterval(randomizationIntervalRef.current);
        randomizationIntervalRef.current = null;
      }

      // Stop CR interval
      if (crIntervalRef.current) {
        clearInterval(crIntervalRef.current);
        crIntervalRef.current = null;
      }

      // Stop oscillators
      if (carrierOscRef.current) {
        try {
          carrierOscRef.current.stop();
        } catch {
          // Already stopped
        }
        carrierOscRef.current.disconnect();
        carrierOscRef.current = null;
      }

      if (crOscillatorRef.current) {
        try {
          crOscillatorRef.current.stop();
        } catch {
          // Already stopped
        }
        crOscillatorRef.current.disconnect();
        crOscillatorRef.current = null;
      }

      if (lfoRef.current) {
        try {
          lfoRef.current.stop();
        } catch {
          // Already stopped
        }
        lfoRef.current.disconnect();
        lfoRef.current = null;
      }

      if (constantSourceRef.current) {
        try {
          constantSourceRef.current.stop();
        } catch {
          // Already stopped
        }
        constantSourceRef.current.disconnect();
        constantSourceRef.current = null;
      }

      // Stop background sound
      if (backgroundNoiseRef.current) {
        try {
          backgroundNoiseRef.current.stop();
        } catch {
          // Already stopped
        }
        backgroundNoiseRef.current.disconnect();
        backgroundNoiseRef.current = null;
      }

      // Disconnect nodes
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }

      if (pannerRef.current) {
        pannerRef.current.disconnect();
        pannerRef.current = null;
      }

      if (filterNodeRef.current) {
        filterNodeRef.current.disconnect();
        filterNodeRef.current = null;
      }

      if (lfoGainAMRef.current) {
        lfoGainAMRef.current.disconnect();
        lfoGainAMRef.current = null;
      }

      if (lfoGainFMRef.current) {
        lfoGainFMRef.current.disconnect();
        lfoGainFMRef.current = null;
      }

      if (crGainRef.current) {
        crGainRef.current.disconnect();
        crGainRef.current = null;
      }

      if (crPannerRef.current) {
        crPannerRef.current.disconnect();
        crPannerRef.current = null;
      }

      if (backgroundGainRef.current) {
        backgroundGainRef.current.disconnect();
        backgroundGainRef.current = null;
      }

      if (backgroundFilterRef.current) {
        backgroundFilterRef.current.disconnect();
        backgroundFilterRef.current = null;
      }

      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []); // Empty deps - only run on mount/unmount

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
          hook: 'useTonalMasker',
          operation: 'initAudioContext',
        }
      );
      throw error;
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
          hook: 'useTonalMasker',
          operation: 'resumeAudioContext',
        }
      );
      throw error;
    }
  };

  // Generate CR tone frequencies: 2 below and 2 above tinnitus frequency
  const generateCRFrequencies = (
    baseFreq: number,
    spreadPercent: number
  ): number[] => {
    const spread = (baseFreq * spreadPercent) / 100;
    // Generate 4 frequencies: 2 below, 2 above
    const frequencies = [
      baseFreq - spread * 1.5, // Lower frequency 1
      baseFreq - spread * 0.5, // Lower frequency 2
      baseFreq + spread * 0.5, // Higher frequency 1
      baseFreq + spread * 1.5, // Higher frequency 2
    ];
    // Ensure frequencies are within valid range (50-20000 Hz)
    return frequencies.map(f => Math.max(50, Math.min(20000, f)));
  };

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Play a single CR tone
  const playCRTone = async (frequency: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const executeTone = async () => {
        try {
          const ctx = initAudioContext();

          if (ctx.state === 'suspended') {
            await resumeAudioContext();
          }

          // Stop any currently playing CR tone
          if (crOscillatorRef.current) {
            try {
              crOscillatorRef.current.stop();
            } catch {
              // Already stopped
            }
            crOscillatorRef.current.disconnect();
          }

          if (crGainRef.current) {
            crGainRef.current.disconnect();
          }

          if (crPannerRef.current) {
            crPannerRef.current.disconnect();
          }

          // Create oscillator for this tone
          const oscillator = ctx.createOscillator();
          const waveformType =
            waveformRef.current === 'filtered' ? 'sine' : waveformRef.current;
          oscillator.type = waveformType as OscillatorType;
          oscillator.frequency.value = frequency;

          // Create gain node
          const gain = ctx.createGain();
          gain.gain.value = volumeRef.current / 100;

          // Create panner
          const panner = ctx.createStereoPanner();
          if (earSelectionRef.current === 'left') {
            panner.pan.value = -1;
          } else if (earSelectionRef.current === 'right') {
            panner.pan.value = 1;
          } else {
            panner.pan.value = 0;
          }

          // Apply filter if needed
          if (waveformRef.current === 'filtered') {
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1000;
            filter.Q.value = 1;
            oscillator.connect(filter);
            filter.connect(gain);
          } else {
            oscillator.connect(gain);
          }

          gain.connect(panner);
          panner.connect(ctx.destination);

          // Store references
          crOscillatorRef.current = oscillator;
          crGainRef.current = gain;
          crPannerRef.current = panner;

          // Start oscillator
          oscillator.start();

          // Stop after tone duration
          setTimeout(() => {
            try {
              oscillator.stop();
              oscillator.disconnect();
            } catch {
              // Already stopped
            }
            if (crGainRef.current) {
              crGainRef.current.disconnect();
            }
            if (crPannerRef.current) {
              crPannerRef.current.disconnect();
            }
            if (crOscillatorRef.current === oscillator) {
              crOscillatorRef.current = null;
            }
            if (crGainRef.current === gain) {
              crGainRef.current = null;
            }
            if (crPannerRef.current === panner) {
              crPannerRef.current = null;
            }
            resolve();
          }, crToneDurationRef.current);
        } catch (error) {
          logError(
            error instanceof Error
              ? error
              : new Error('Failed to play CR tone'),
            {
              hook: 'useTonalMasker',
              operation: 'playCRTone',
              frequency,
            }
          );
          reject(error);
        }
      };

      executeTone();
    });
  };

  // Load audio file and cache it
  const loadAudioFile = async (filename: string): Promise<AudioBuffer> => {
    const cache = backgroundBufferCacheRef.current;

    // Check cache first
    const cachedBuffer = cache.get(filename);
    if (cachedBuffer) {
      return cachedBuffer;
    }

    try {
      const ctx = initAudioContext();
      const response = await fetch(`/sounds/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load audio file: ${filename}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      // Cache the buffer
      cache.set(filename, audioBuffer);
      return audioBuffer;
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error('Failed to load audio file'),
        {
          hook: 'useTonalMasker',
          operation: 'loadAudioFile',
          filename,
        }
      );
      throw error;
    }
  };

  // Create background sound buffer procedurally (fallback if files not available)
  const createBackgroundSoundBuffer = (
    type: 'cicadas' | 'birds' | 'ocean' | 'rain',
    duration: number = 10
  ): AudioBuffer => {
    const ctx = initAudioContext();
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(2, length, sampleRate);

    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);

    switch (type) {
      case 'cicadas': {
        // Realistic cicada chirping: rapid bursts of high-frequency tones
        let chirpPhase = 0;
        let chirpActive = false;
        let chirpDuration = 0;
        let chirpFrequency = 4000;
        let chirpCountdown = 0;

        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;

          // Chirp timing: active for ~50ms, then pause for 100-300ms
          if (chirpCountdown <= 0) {
            if (chirpActive) {
              // End chirp, start pause
              chirpActive = false;
              chirpCountdown = sampleRate * (0.1 + Math.random() * 0.2); // 100-300ms pause
              chirpPhase = 0;
            } else {
              // Start new chirp
              chirpActive = true;
              chirpDuration = sampleRate * (0.03 + Math.random() * 0.02); // 30-50ms chirp
              chirpCountdown = chirpDuration;
              chirpFrequency = 3500 + Math.random() * 3000; // 3.5-6.5 kHz
            }
          }

          let sample = 0;
          if (chirpActive) {
            // Rapid frequency modulation for chirp effect
            const modFreq = chirpFrequency + Math.sin(chirpPhase * 20) * 500;
            sample = Math.sin(2 * Math.PI * modFreq * t);
            // Envelope: quick attack, sustain, quick release
            const envelope = Math.min(
              1,
              Math.min(
                chirpPhase / (sampleRate * 0.005),
                (chirpDuration - chirpPhase) / (sampleRate * 0.005)
              )
            );
            sample *= envelope * 0.4;
            chirpPhase++;
          }

          // Add some background noise/hum
          sample += (Math.random() * 2 - 1) * 0.05;

          leftChannel[i] = sample;
          rightChannel[i] = sample * (0.8 + Math.random() * 0.4); // Slight stereo variation
          chirpCountdown--;
        }
        break;
      }

      case 'birds': {
        // Realistic bird calls: distinct melodic patterns with pauses
        let birdCallPhase = 0;
        let birdCallActive = false;
        let birdCallDuration = 0;
        let birdCallFrequency = 2000;
        let birdCallCountdown = 0;
        let birdCallPattern = 0;

        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;

          // Bird call timing: calls last 200-800ms, pauses 500-2000ms
          if (birdCallCountdown <= 0) {
            if (birdCallActive) {
              // End call, start pause
              birdCallActive = false;
              birdCallCountdown = sampleRate * (0.5 + Math.random() * 1.5); // 500-2000ms pause
              birdCallPhase = 0;
              birdCallPattern = Math.floor(Math.random() * 3); // Different call patterns
            } else {
              // Start new call
              birdCallActive = true;
              birdCallDuration = sampleRate * (0.2 + Math.random() * 0.6); // 200-800ms call
              birdCallCountdown = birdCallDuration;
              birdCallFrequency = 1500 + Math.random() * 2500; // 1.5-4 kHz
              birdCallPhase = 0;
            }
          }

          let sample = 0;
          if (birdCallActive) {
            // Create melodic pattern with frequency sweeps
            let freq = birdCallFrequency;
            const progress = birdCallPhase / birdCallDuration;

            if (birdCallPattern === 0) {
              // Rising trill
              freq += progress * 1000;
            } else if (birdCallPattern === 1) {
              // Falling then rising
              freq += Math.sin(progress * Math.PI * 2) * 800;
            } else {
              // Wobble
              freq += Math.sin(progress * Math.PI * 8) * 400;
            }

            sample = Math.sin(2 * Math.PI * freq * t);
            // Envelope: smooth attack and release
            const envelope = Math.sin(progress * Math.PI) * 0.5;
            sample *= envelope;
            birdCallPhase++;
          }

          // Add subtle background
          sample += (Math.random() * 2 - 1) * 0.03;

          leftChannel[i] = sample;
          rightChannel[i] = sample * (0.9 + Math.random() * 0.2);
          birdCallCountdown--;
        }
        break;
      }

      case 'ocean':
        // Realistic ocean waves: low-frequency rumbling with white noise overlay
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;

          // Low-frequency wave component (20-200 Hz) - the rumble
          const waveFreq1 = 30 + Math.sin(t * 0.05) * 20;
          const waveFreq2 = 80 + Math.sin(t * 0.07) * 50;
          const wave1 = Math.sin(2 * Math.PI * waveFreq1 * t) * 0.6;
          const wave2 = Math.sin(2 * Math.PI * waveFreq2 * t) * 0.4;

          // Wave envelope - slow rise and fall
          const waveEnvelope = 0.5 + 0.5 * Math.sin(t * 0.3);

          // White noise for water movement (filtered to mid frequencies)
          const noise = Math.random() * 2 - 1;
          // Filter noise: emphasize 200-2000 Hz range
          const noiseFilter = 0.3 + 0.2 * Math.sin(2 * Math.PI * 500 * t);
          const filteredNoise = noise * noiseFilter * 0.3;

          // Combine: waves + noise
          const combined = (wave1 + wave2) * waveEnvelope + filteredNoise;

          // Stereo panning for realism
          const pan = Math.sin(t * 0.1) * 0.3; // Slow panning
          leftChannel[i] = combined * (0.7 + pan);
          rightChannel[i] = combined * (0.7 - pan);
        }
        break;

      case 'rain':
        // Realistic rain: filtered white noise with occasional drops
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;

          // Base white noise
          const noise = Math.random() * 2 - 1;

          // Filter: emphasize high frequencies (2-8 kHz) like rain hitting surfaces
          const filterGain = 0.4 + 0.3 * Math.sin(2 * Math.PI * 3000 * t);
          let filtered = noise * filterGain;

          // Add occasional "drops" - brief spikes
          if (Math.random() < 0.01) {
            // 1% chance per sample
            const dropFreq = 4000 + Math.random() * 2000;
            const drop = Math.sin(2 * Math.PI * dropFreq * t) * 0.2;
            filtered += drop;
          }

          // Envelope variation
          const envelope = 0.7 + 0.3 * Math.random();
          filtered *= envelope * 0.4;

          leftChannel[i] = filtered;
          rightChannel[i] = filtered * (0.85 + Math.random() * 0.3);
        }
        break;
    }

    return buffer;
  };

  // Start background sound
  const startBackgroundSound = async () => {
    if (backgroundSoundRef.current === 'none') {
      return;
    }

    try {
      const ctx = initAudioContext();

      // Stop existing background sound
      stopBackgroundSound();

      // Map sound types to filenames (try WAV first, then MP3)
      const soundFiles: Record<string, string[]> = {
        cicadas: ['cicadas.wav', 'cicadas.mp3'],
        birds: ['birds.wav', 'birds.mp3'],
        ocean: ['ocean.wav', 'ocean.mp3'],
        rain: ['rain.wav', 'rain.mp3'],
      };

      let buffer: AudioBuffer;
      const filesToTry = soundFiles[backgroundSoundRef.current];
      let loaded = false;

      // Try each file format until one works
      for (const filename of filesToTry) {
        try {
          buffer = await loadAudioFile(filename);
          loaded = true;
          break;
        } catch {
          // Try next format
          continue;
        }
      }

      if (!loaded) {
        // Fallback to procedural generation if no files found
        console.warn(
          `Audio files not found for ${backgroundSoundRef.current}, using procedural generation`
        );
        buffer = createBackgroundSoundBuffer(backgroundSoundRef.current, 10);
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      // Create gain node for volume control
      const gain = ctx.createGain();
      gain.gain.value = backgroundVolumeRef.current / 100;

      // Connect: source -> gain -> destination (no filter for real sounds)
      source.connect(gain);
      gain.connect(ctx.destination);

      source.start();

      backgroundNoiseRef.current = source;
      backgroundGainRef.current = gain;
      backgroundFilterRef.current = null; // No filter for real sounds
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to start background sound'),
        {
          hook: 'useTonalMasker',
          operation: 'startBackgroundSound',
          soundType: backgroundSoundRef.current,
        }
      );
    }
  };

  // Stop background sound
  const stopBackgroundSound = () => {
    if (backgroundNoiseRef.current) {
      try {
        backgroundNoiseRef.current.stop();
      } catch {
        // Already stopped
      }
      backgroundNoiseRef.current.disconnect();
      backgroundNoiseRef.current = null;
    }
    if (backgroundGainRef.current) {
      backgroundGainRef.current.disconnect();
      backgroundGainRef.current = null;
    }
    if (backgroundFilterRef.current) {
      backgroundFilterRef.current.disconnect();
      backgroundFilterRef.current = null;
    }
  };

  // Randomize modulation parameters
  const randomizeModulation = () => {
    if (
      !randomizeModulationRef.current ||
      modulationTypeRef.current === 'cr' ||
      !isPlaying ||
      !audioContextRef.current
    ) {
      return;
    }

    const [minRate, maxRate] = modulationRateRangeRef.current;
    const [minDepth, maxDepth] = modulationDepthRangeRef.current;

    // Generate random values within range
    currentModulationRateRef.current =
      minRate + Math.random() * (maxRate - minRate);
    currentModulationDepthRef.current =
      minDepth + Math.random() * (maxDepth - minDepth);

    const ctx = audioContextRef.current;
    const currentTime = ctx.currentTime;

    // Update LFO frequency smoothly if playing
    if (lfoRef.current) {
      lfoRef.current.frequency.cancelScheduledValues(currentTime);
      lfoRef.current.frequency.setValueAtTime(
        lfoRef.current.frequency.value,
        currentTime
      );
      lfoRef.current.frequency.linearRampToValueAtTime(
        currentModulationRateRef.current,
        currentTime + 0.05 // 50ms ramp for randomization
      );
    }

    // Update AM gain smoothly if playing
    if (
      lfoGainAMRef.current &&
      constantSourceRef.current &&
      (modulationTypeRef.current === 'am' ||
        modulationTypeRef.current === 'both')
    ) {
      const depth = currentModulationDepthRef.current / 100;

      lfoGainAMRef.current.gain.cancelScheduledValues(currentTime);
      lfoGainAMRef.current.gain.setValueAtTime(
        lfoGainAMRef.current.gain.value,
        currentTime
      );
      lfoGainAMRef.current.gain.linearRampToValueAtTime(
        depth / 2,
        currentTime + 0.05
      );

      constantSourceRef.current.offset.cancelScheduledValues(currentTime);
      constantSourceRef.current.offset.setValueAtTime(
        constantSourceRef.current.offset.value,
        currentTime
      );
      constantSourceRef.current.offset.linearRampToValueAtTime(
        1 - depth / 2,
        currentTime + 0.05
      );
    }

    // Update FM gain smoothly if playing
    if (
      lfoGainFMRef.current &&
      (modulationTypeRef.current === 'fm' ||
        modulationTypeRef.current === 'both')
    ) {
      const depth = currentModulationDepthRef.current / 100;

      lfoGainFMRef.current.gain.cancelScheduledValues(currentTime);
      lfoGainFMRef.current.gain.setValueAtTime(
        lfoGainFMRef.current.gain.value,
        currentTime
      );
      lfoGainFMRef.current.gain.linearRampToValueAtTime(
        frequencyRef.current * depth,
        currentTime + 0.05
      );
    }
  };

  // Start randomization interval
  const startRandomization = () => {
    if (!randomizeModulationRef.current || modulationTypeRef.current === 'cr') {
      return;
    }

    // Randomize immediately
    randomizeModulation();

    // Set up interval for periodic randomization
    if (randomizationIntervalRef.current) {
      clearInterval(randomizationIntervalRef.current);
    }
    randomizationIntervalRef.current = setInterval(() => {
      if (isPlaying && randomizeModulationRef.current) {
        randomizeModulation();
      }
    }, randomizationIntervalMsRef.current);
  };

  // Stop randomization interval
  const stopRandomization = () => {
    if (randomizationIntervalRef.current) {
      clearInterval(randomizationIntervalRef.current);
      randomizationIntervalRef.current = null;
    }
  };

  // CR mode: Play randomized sequence of tones
  const playCRSequence = async () => {
    try {
      const ctx = initAudioContext();

      if (ctx.state === 'suspended') {
        await resumeAudioContext();
      }

      // Generate the 4 frequencies
      const frequencies = generateCRFrequencies(
        frequencyRef.current,
        crFrequencySpreadRef.current
      );

      // Create randomized sequence
      crToneSequenceRef.current = shuffleArray(frequencies);
      crCurrentIndexRef.current = 0;

      // Play tones in sequence
      const playNextTone = async () => {
        if (!crPlayingRef.current || modulationTypeRef.current !== 'cr') {
          return;
        }

        // Play current tone
        await playCRTone(crToneSequenceRef.current[crCurrentIndexRef.current]);

        if (!crPlayingRef.current || modulationTypeRef.current !== 'cr') {
          return;
        }

        // Wait for gap duration
        await new Promise(resolve =>
          setTimeout(resolve, crGapDurationRef.current)
        );

        if (!crPlayingRef.current || modulationTypeRef.current !== 'cr') {
          return;
        }

        // Move to next tone (or reshuffle if at end)
        crCurrentIndexRef.current++;
        if (crCurrentIndexRef.current >= crToneSequenceRef.current.length) {
          // Reshuffle for next cycle
          crToneSequenceRef.current = shuffleArray(frequencies);
          crCurrentIndexRef.current = 0;
        }

        // Continue playing
        playNextTone();
      };

      // Start playing
      crPlayingRef.current = true;
      playNextTone();
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to play CR sequence'),
        {
          hook: 'useTonalMasker',
          operation: 'playCRSequence',
        }
      );
      setIsPlaying(false);
      throw error;
    }
  };

  const play = async () => {
    try {
      const ctx = initAudioContext();

      // Resume AudioContext if suspended
      if (ctx.state === 'suspended') {
        await resumeAudioContext();
      }

      // Clean up existing nodes
      stop();

      // CR mode uses different playback mechanism
      if (modulationTypeRef.current === 'cr') {
        // Start background sound for CR mode too (async but don't await)
        startBackgroundSound().catch(() => {
          // Error already logged
        });
        setIsPlaying(true);
        playCRSequence();
        return;
      }

      // Create carrier oscillator
      const carrier = ctx.createOscillator();
      const waveformType =
        waveformRef.current === 'filtered' ? 'sine' : waveformRef.current;
      carrier.type = waveformType as OscillatorType;
      carrier.frequency.value = frequencyRef.current;

      // Create main gain node
      const mainGain = ctx.createGain();
      mainGain.gain.value = volumeRef.current / 100;

      // Create stereo panner
      const panner = ctx.createStereoPanner();
      if (earSelectionRef.current === 'left') {
        panner.pan.value = -1;
      } else if (earSelectionRef.current === 'right') {
        panner.pan.value = 1;
      } else {
        panner.pan.value = 0;
      }

      // Start background sound (async but don't await - non-blocking)
      startBackgroundSound().catch(() => {
        // Error already logged in startBackgroundSound
      });

      // Start randomization if enabled
      startRandomization();

      // Use randomized values if randomization is enabled, otherwise use base values
      const effectiveModulationRate = randomizeModulationRef.current
        ? currentModulationRateRef.current
        : modulationRateRef.current;
      const effectiveModulationDepth = randomizeModulationRef.current
        ? currentModulationDepthRef.current
        : modulationDepthRef.current;

      // Create LFO for modulation
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = effectiveModulationRate;

      // Apply modulation based on type
      if (
        modulationTypeRef.current === 'am' ||
        modulationTypeRef.current === 'both'
      ) {
        // Amplitude Modulation: LFO modulates the gain
        const depth = effectiveModulationDepth / 100; // 0-1
        const baseGain = 1 - depth; // Minimum gain level

        // Create a gain node that will be modulated
        const amGain = ctx.createGain();
        amGain.gain.value = baseGain; // Set base gain

        // Create a gain node to scale the LFO output
        // LFO outputs -1 to 1, we want to scale it to modulate gain from baseGain to 1
        const lfoGainAM = ctx.createGain();
        lfoGainAM.gain.value = depth / 2; // Scale LFO to half depth

        // Create a constant source for DC offset
        const constantSource = ctx.createConstantSource();
        constantSource.offset.value = 1 - depth / 2; // Center point: (1 - depth/2) + (±depth/2) = 1-depth to 1

        // Connect LFO through gain to the amGain.gain AudioParam
        lfo.connect(lfoGainAM);
        lfoGainAM.connect(amGain.gain);

        // Connect constant source to add DC offset
        // Note: AudioParam can accept multiple connections, they will be summed
        constantSource.connect(amGain.gain);
        constantSource.start();

        carrier.connect(amGain);
        amGain.connect(mainGain);

        lfoGainAMRef.current = lfoGainAM;
        constantSourceRef.current = constantSource;
      } else {
        // No AM, connect carrier directly
        carrier.connect(mainGain);
      }

      if (
        modulationTypeRef.current === 'fm' ||
        modulationTypeRef.current === 'both'
      ) {
        // Frequency Modulation: LFO modulates the carrier frequency
        const lfoGainFM = ctx.createGain();
        const depth = effectiveModulationDepth / 100;
        // FM depth: modulate frequency by ±(depth * frequency)
        lfoGainFM.gain.value = frequencyRef.current * depth;

        lfo.connect(lfoGainFM);
        lfoGainFM.connect(carrier.frequency);

        lfoGainFMRef.current = lfoGainFM;
      }

      // Apply low-pass filter for 'filtered' waveform
      if (waveformRef.current === 'filtered') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000; // 1kHz cutoff
        filter.Q.value = 1;

        mainGain.connect(filter);
        filter.connect(panner);
        filterNodeRef.current = filter;
      } else {
        mainGain.connect(panner);
      }

      panner.connect(ctx.destination);

      // Start oscillators
      lfo.start();
      carrier.start();

      // Store references
      carrierOscRef.current = carrier;
      lfoRef.current = lfo;
      gainNodeRef.current = mainGain;
      pannerRef.current = panner;

      setIsPlaying(true);
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to play modulated tone'),
        {
          hook: 'useTonalMasker',
          operation: 'play',
          frequency: frequencyRef.current,
          modulationType: modulationTypeRef.current,
        }
      );
      setIsPlaying(false);
      throw error;
    }
  };

  const stop = useCallback(() => {
    // Stop randomization
    stopRandomization();

    // Stop background sound
    stopBackgroundSound();

    // Stop CR mode
    crPlayingRef.current = false;

    if (crIntervalRef.current) {
      clearTimeout(crIntervalRef.current);
      crIntervalRef.current = null;
    }

    if (crOscillatorRef.current) {
      try {
        crOscillatorRef.current.stop();
      } catch {
        // Already stopped
      }
      crOscillatorRef.current.disconnect();
      crOscillatorRef.current = null;
    }

    if (crGainRef.current) {
      crGainRef.current.disconnect();
      crGainRef.current = null;
    }

    if (crPannerRef.current) {
      crPannerRef.current.disconnect();
      crPannerRef.current = null;
    }

    // Stop continuous modulation modes
    if (carrierOscRef.current) {
      try {
        carrierOscRef.current.stop();
      } catch {
        // Already stopped
      }
      carrierOscRef.current.disconnect();
      carrierOscRef.current = null;
    }

    if (lfoRef.current) {
      try {
        lfoRef.current.stop();
      } catch {
        // Already stopped
      }
      lfoRef.current.disconnect();
      lfoRef.current = null;
    }

    if (lfoGainAMRef.current) {
      lfoGainAMRef.current.disconnect();
      lfoGainAMRef.current = null;
    }

    if (constantSourceRef.current) {
      try {
        constantSourceRef.current.stop();
      } catch {
        // Already stopped
      }
      constantSourceRef.current.disconnect();
      constantSourceRef.current = null;
    }

    if (lfoGainFMRef.current) {
      lfoGainFMRef.current.disconnect();
      lfoGainFMRef.current = null;
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }

    if (pannerRef.current) {
      pannerRef.current.disconnect();
      pannerRef.current = null;
    }

    if (filterNodeRef.current) {
      filterNodeRef.current.disconnect();
      filterNodeRef.current = null;
    }

    setIsPlaying(false);
  }, [stopRandomization, stopBackgroundSound]);

  const updateFrequency = (newFrequency: number) => {
    try {
      frequencyRef.current = newFrequency;

      // For CR mode or if not playing, just update the ref
      if (
        modulationTypeRef.current === 'cr' ||
        !isPlaying ||
        !audioContextRef.current
      ) {
        return;
      }

      const ctx = audioContextRef.current;
      const currentTime = ctx.currentTime;

      // Update carrier frequency smoothly
      if (carrierOscRef.current) {
        carrierOscRef.current.frequency.cancelScheduledValues(currentTime);
        carrierOscRef.current.frequency.setValueAtTime(
          carrierOscRef.current.frequency.value,
          currentTime
        );
        carrierOscRef.current.frequency.linearRampToValueAtTime(
          newFrequency,
          currentTime + 0.01 // 10ms ramp for smooth transition
        );
      }

      // Update FM gain if FM is active
      if (
        lfoGainFMRef.current &&
        (modulationTypeRef.current === 'fm' ||
          modulationTypeRef.current === 'both')
      ) {
        const depth = randomizeModulationRef.current
          ? currentModulationDepthRef.current / 100
          : modulationDepthRef.current / 100;
        lfoGainFMRef.current.gain.cancelScheduledValues(currentTime);
        lfoGainFMRef.current.gain.setValueAtTime(
          lfoGainFMRef.current.gain.value,
          currentTime
        );
        lfoGainFMRef.current.gain.linearRampToValueAtTime(
          newFrequency * depth,
          currentTime + 0.01
        );
      }
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to update frequency'),
        {
          hook: 'useTonalMasker',
          operation: 'updateFrequency',
        }
      );
    }
  };

  const updateModulationType = async (newType: ModulationType) => {
    modulationTypeRef.current = newType;
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      stop();
      setTimeout(async () => {
        await play();
      }, 50);
    }
  };

  const updateModulationRate = (newRate: number) => {
    try {
      modulationRateRef.current = newRate;

      // Don't update if randomization is active (it manages its own rate)
      if (randomizeModulationRef.current && isPlaying) {
        return;
      }

      if (lfoRef.current && isPlaying && audioContextRef.current) {
        const ctx = audioContextRef.current;
        const currentTime = ctx.currentTime;

        // Smooth transition
        lfoRef.current.frequency.cancelScheduledValues(currentTime);
        lfoRef.current.frequency.setValueAtTime(
          lfoRef.current.frequency.value,
          currentTime
        );
        lfoRef.current.frequency.linearRampToValueAtTime(
          newRate,
          currentTime + 0.01
        );
      }
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to update modulation rate'),
        {
          hook: 'useTonalMasker',
          operation: 'updateModulationRate',
        }
      );
    }
  };

  const updateModulationDepth = (newDepth: number) => {
    try {
      modulationDepthRef.current = newDepth;

      // Don't update if randomization is active (it manages its own depth)
      if (randomizeModulationRef.current && isPlaying) {
        return;
      }

      const depth = newDepth / 100;

      if (isPlaying && audioContextRef.current) {
        const ctx = audioContextRef.current;
        const currentTime = ctx.currentTime;

        // Update AM if active - smooth transition
        if (
          lfoGainAMRef.current &&
          constantSourceRef.current &&
          (modulationTypeRef.current === 'am' ||
            modulationTypeRef.current === 'both')
        ) {
          lfoGainAMRef.current.gain.cancelScheduledValues(currentTime);
          lfoGainAMRef.current.gain.setValueAtTime(
            lfoGainAMRef.current.gain.value,
            currentTime
          );
          lfoGainAMRef.current.gain.linearRampToValueAtTime(
            depth / 2,
            currentTime + 0.01
          );

          constantSourceRef.current.offset.cancelScheduledValues(currentTime);
          constantSourceRef.current.offset.setValueAtTime(
            constantSourceRef.current.offset.value,
            currentTime
          );
          constantSourceRef.current.offset.linearRampToValueAtTime(
            1 - depth / 2,
            currentTime + 0.01
          );
        }

        // Update FM if active - smooth transition
        if (
          lfoGainFMRef.current &&
          (modulationTypeRef.current === 'fm' ||
            modulationTypeRef.current === 'both')
        ) {
          lfoGainFMRef.current.gain.cancelScheduledValues(currentTime);
          lfoGainFMRef.current.gain.setValueAtTime(
            lfoGainFMRef.current.gain.value,
            currentTime
          );
          lfoGainFMRef.current.gain.linearRampToValueAtTime(
            frequencyRef.current * depth,
            currentTime + 0.01
          );
        }
      }
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to update modulation depth'),
        {
          hook: 'useTonalMasker',
          operation: 'updateModulationDepth',
        }
      );
    }
  };

  const updateVolume = (newVolume: number) => {
    try {
      volumeRef.current = newVolume;
      if (gainNodeRef.current && audioContextRef.current) {
        const ctx = audioContextRef.current;
        const currentTime = ctx.currentTime;

        // Smooth volume transition
        gainNodeRef.current.gain.cancelScheduledValues(currentTime);
        gainNodeRef.current.gain.setValueAtTime(
          gainNodeRef.current.gain.value,
          currentTime
        );
        gainNodeRef.current.gain.linearRampToValueAtTime(
          newVolume / 100,
          currentTime + 0.01
        );
      }
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error('Failed to update volume'),
        {
          hook: 'useTonalMasker',
          operation: 'updateVolume',
        }
      );
    }
  };

  const updateWaveform = (newWaveform: WaveformType) => {
    waveformRef.current = newWaveform;
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      stop();
      setTimeout(() => {
        play();
      }, 50);
    }
  };

  const updateEarSelection = (newEar: EarSelection) => {
    try {
      earSelectionRef.current = newEar;
      if (pannerRef.current && audioContextRef.current) {
        if (newEar === 'left') {
          pannerRef.current.pan.setValueAtTime(
            -1,
            audioContextRef.current.currentTime
          );
        } else if (newEar === 'right') {
          pannerRef.current.pan.setValueAtTime(
            1,
            audioContextRef.current.currentTime
          );
        } else {
          pannerRef.current.pan.setValueAtTime(
            0,
            audioContextRef.current.currentTime
          );
        }
      }
    } catch (error) {
      logError(
        error instanceof Error
          ? error
          : new Error('Failed to update ear selection'),
        {
          hook: 'useTonalMasker',
          operation: 'updateEarSelection',
        }
      );
    }
  };

  const updateCRToneDuration = (newDuration: number) => {
    crToneDurationRef.current = newDuration;
  };

  const updateCRGapDuration = (newGap: number) => {
    crGapDurationRef.current = newGap;
  };

  const updateCRFrequencySpread = (newSpread: number) => {
    crFrequencySpreadRef.current = newSpread;
    // If CR mode is playing, regenerate sequence
    if (isPlaying && modulationTypeRef.current === 'cr') {
      const wasPlaying = isPlaying;
      stop();
      setTimeout(async () => {
        if (wasPlaying) {
          await play();
        }
      }, 50);
    }
  };

  const updateRandomizeModulation = (enabled: boolean) => {
    randomizeModulationRef.current = enabled;
    if (enabled && isPlaying && modulationTypeRef.current !== 'cr') {
      startRandomization();
    } else {
      stopRandomization();
      // Reset to base values
      if (isPlaying && lfoRef.current) {
        lfoRef.current.frequency.value = modulationRateRef.current;
      }
    }
  };

  const updateModulationRateRange = (range: [number, number]) => {
    modulationRateRangeRef.current = range;
  };

  const updateModulationDepthRange = (range: [number, number]) => {
    modulationDepthRangeRef.current = range;
  };

  const updateRandomizationInterval = (interval: number) => {
    randomizationIntervalMsRef.current = interval;
    // Restart randomization if active
    if (randomizeModulationRef.current && isPlaying) {
      stopRandomization();
      startRandomization();
    }
  };

  const updateBackgroundSound = async (
    sound: 'none' | 'cicadas' | 'birds' | 'ocean' | 'rain'
  ) => {
    backgroundSoundRef.current = sound;
    if (isPlaying) {
      stopBackgroundSound();
      if (sound !== 'none') {
        // Don't await - non-blocking
        startBackgroundSound().catch(() => {
          // Error already logged
        });
      }
    }
  };

  const updateBackgroundVolume = (volume: number) => {
    backgroundVolumeRef.current = volume;
    if (backgroundGainRef.current && audioContextRef.current) {
      backgroundGainRef.current.gain.setValueAtTime(
        volume / 100,
        audioContextRef.current.currentTime
      );
    }
  };

  return {
    isPlaying,
    play,
    stop,
    toggle: () => (isPlaying ? stop() : play()),
    updateFrequency,
    updateModulationType,
    updateModulationRate,
    updateModulationDepth,
    updateVolume,
    updateWaveform,
    updateEarSelection,
    updateCRToneDuration,
    updateCRGapDuration,
    updateCRFrequencySpread,
    updateRandomizeModulation,
    updateModulationRateRange,
    updateModulationDepthRange,
    updateRandomizationInterval,
    updateBackgroundSound,
    updateBackgroundVolume,
    resumeAudioContext,
  };
}
