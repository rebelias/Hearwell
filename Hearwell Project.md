# HearWell Project - Complete Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Technology Stack](#technology-stack)
4. [Design System](#design-system)
5. [Audio Engine Implementation](#audio-engine-implementation)
6. [Tool Documentation](#tool-documentation)
7. [File Structure](#file-structure)
8. [Extending the Application](#extending-the-application)

---

## Project Overview

**HearWell** is a comprehensive, browser-based hearing health and tinnitus management application that provides five professional-grade audio tools. Built entirely with React and TypeScript, it leverages the Web Audio API for precise, real-time audio generation and processing—all running client-side with zero server dependencies for audio functionality.

### Core Capabilities
The application provides five distinct tools:

1. **Tinnitus Frequency Finder** - Helps users identify the frequency of their tinnitus (50Hz - 20kHz)
2. **Online Audiometer** - Professional hearing test with real-time audiogram visualization
3. **Noise Generator** - 8-band equalizer for creating custom colored noise (white, pink, brown, violet, blue, grey)
4. **Tinnitus Matching** - Precision tone matching with frequency, volume, and waveform controls
5. **Notched Noise Generator** - Therapeutic noise with the user's tinnitus frequency removed

### Key Features
- **100% Client-Side Audio Processing** - All sound generation uses Web Audio API
- **Mobile-First Responsive Design** - Optimized for high-DPI devices (Galaxy S25 Ultra tested)
- **Dark/Light Theme Support** - Complete theme system with custom color tokens
- **Shareable Settings** - URL parameters allow sharing exact tone configurations
- **Real-Time Visualization** - Interactive audiogram charts using Recharts
- **Multiple Waveforms** - Sine, square, triangle, sawtooth, filtered, and noise options
- **Professional-Grade Controls** - Precise frequency (Hz) and volume (dB) control

### Medical Disclaimer
This is an educational tool and cannot replace professional audiological testing. Users should consult healthcare professionals for medical advice regarding hearing health.

---

## Technical Architecture

### Overall Architecture Pattern
HearWell follows a modern **client-side SPA (Single Page Application)** architecture:

```
┌─────────────────────────────────────────┐
│           React Frontend (SPA)          │
│  ┌───────────────────────────────────┐  │
│  │   Pages (5 Tool Interfaces)       │  │
│  └────────────┬──────────────────────┘  │
│               │                          │
│  ┌────────────▼──────────────────────┐  │
│  │   Custom Audio Hooks              │  │
│  │   (Web Audio API Wrappers)        │  │
│  └────────────┬──────────────────────┘  │
│               │                          │
│  ┌────────────▼──────────────────────┐  │
│  │   Browser Web Audio API           │  │
│  │   (AudioContext, Nodes, Filters)  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Frontend Architecture
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks (useState, useRef, useEffect)
- **Component Library**: Shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Charts**: Recharts for audiogram visualization

### Audio Processing Pipeline
All audio tools follow this pattern:

```
User Input → React State → Custom Hook → Web Audio Nodes → Browser Audio Output
```

Example flow for tone generation:
1. User adjusts frequency slider
2. React state updates (`setFrequency(value)`)
3. `useEffect` triggers in custom hook
4. Hook updates `OscillatorNode.frequency.value`
5. Browser outputs updated tone in real-time

### Data Flow
- **No Backend Required** - All audio processing is client-side
- **No Database** - Optional localStorage for user preferences
- **URL State** - Tool settings can be encoded in URL parameters for sharing

---

## Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI framework and component architecture |
| TypeScript | Latest | Type safety and developer experience |
| Vite | Latest | Build tool and dev server |
| Tailwind CSS | Latest | Utility-first styling system |
| Wouter | Latest | Lightweight routing (2KB) |

### UI Component Libraries
| Library | Purpose |
|---------|---------|
| Shadcn/ui | Pre-built accessible components |
| Radix UI | Primitive component library |
| Lucide React | Icon system |
| Recharts | Data visualization for audiogram |

### Audio Technology
- **Web Audio API** - Native browser API for audio synthesis
  - `AudioContext` - Main audio processing graph
  - `OscillatorNode` - Tone generation
  - `GainNode` - Volume control
  - `BiquadFilterNode` - Frequency filtering (EQ, notch)
  - `StereoPannerNode` - Left/right ear selection
  - `AudioBufferSourceNode` - Noise playback

### Development Tools
- **tsx** - TypeScript execution
- **Express** - Development server (serves Vite frontend)
- **PostCSS** - CSS processing with Tailwind

---

## Design System

### Color System
The application uses a custom Material Design 3-inspired color system defined in `client/src/index.css`:

**Light Mode:**
- **Primary**: Warm orange/peach (`38.23 87.6% 74.71%` in HSL) - Main actions, frequency displays
- **Accent**: Soft green - Secondary elements
- **Background**: White (`0 0% 100%`)
- **Foreground**: Dark gray (`20 14.3% 4.1%`)
- **Muted**: Light gray backgrounds (`60 4.8% 95.9%`)

**Dark Mode:**
- Automatically inverted using CSS custom properties
- Uses `.dark` class on root element

### Typography
**Font Families:**
- **Body Text**: Inter (400, 500, 600, 700) - Clean, medical-grade legibility
- **Display/Headings**: Manrope (600, 700) - Friendly, modern

**Responsive Typography Scale:**
- **H1**: `text-2xl sm:text-3xl md:text-4xl` (mobile → tablet → desktop)
- **Body**: `text-sm sm:text-base`
- **Labels**: `text-xs sm:text-sm`
- **Frequency Displays**: `text-xl sm:text-2xl md:text-3xl`

### Spacing System
Uses Tailwind's 8px-based spacing units:
- **Mobile**: Reduced padding (`py-6 sm:py-8 md:py-12`)
- **Cards**: Progressive spacing (`space-y-6 sm:space-y-8`)
- **Touch Targets**: Minimum 64px for buttons (w-16 h-16)

### Custom Utilities
Defined in `index.css`:
- `hover-elevate` - Subtle background elevation on hover
- `active-elevate-2` - More dramatic elevation on press
- Progressive responsive classes throughout

---

## Audio Engine Implementation

### Architecture Overview
Each tool uses a **custom React hook** that encapsulates Web Audio API logic. Hooks manage:
1. AudioContext lifecycle
2. Audio node creation and connection
3. Parameter updates (frequency, volume, filtering)
4. Play/pause state
5. Cleanup on unmount

### Common Pattern
All audio hooks follow this structure:

```typescript
export function useAudioHook(options?) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [node]Ref = useRef<[NodeType] | null>(null);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  };

  const play = () => {
    const ctx = initAudioContext();
    // Create and connect nodes
    // Start playback
    setIsPlaying(true);
  };

  const stop = () => {
    // Disconnect nodes
    // Stop sources
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      stop();
      audioContextRef.current?.close();
    };
  }, []);

  return { isPlaying, play, stop, updateParameter };
}
```

### Audio Node Graph Examples

**Tone Generation (useAudioEngine):**
```
OscillatorNode → GainNode → Destination
     ↓              ↓
  frequency       volume
```

**Audiometer (useAudiometerEngine):**
```
OscillatorNode → GainNode → StereoPannerNode → Destination
     ↓              ↓              ↓
  frequency      volume(dB)    left/right
```

**Noise with EQ (useNoiseGenerator):**
```
AudioBufferSource → [BiquadFilter×8] → GainNode → Destination
                         ↓
                    8-band EQ
```

**Notched Noise (useNotchedNoise):**
```
AudioBufferSource → BiquadFilter(notch) → GainNode → Destination
                         ↓
                   notch frequency
                   + notch width
```

### Critical Audio Implementations

#### 1. Noise Generation Algorithms
**Location**: `client/src/hooks/useNoiseGenerator.ts`, `useNotchedNoise.ts`, `useAudioEngine.ts`

**White Noise:**
```typescript
for (let i = 0; i < bufferSize; i++) {
  output[i] = Math.random() * 2 - 1;
}
```

**Pink Noise** (1/f spectrum):
Uses Paul Kellet's algorithm with 7 cascaded filters:
```typescript
let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
for (let i = 0; i < bufferSize; i++) {
  const white = Math.random() * 2 - 1;
  b0 = 0.99886 * b0 + white * 0.0555179;
  b1 = 0.99332 * b1 + white * 0.0750759;
  // ... (5 more filter stages)
  output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
  output[i] *= 0.11; // Normalize
}
```

**Brown Noise** (Brownian/random walk):
```typescript
let lastOut = 0;
for (let i = 0; i < bufferSize; i++) {
  const white = Math.random() * 2 - 1;
  output[i] = (lastOut + (0.02 * white)) / 1.02;
  lastOut = output[i];
  output[i] *= 3.5;
}
```

#### 2. 8-Band Equalizer
**Location**: `client/src/hooks/useNoiseGenerator.ts`

**Frequencies**: 32Hz, 64Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz

**Implementation**:
```typescript
const filterNodes: BiquadFilterNode[] = [];
const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000];

frequencies.forEach((freq, index) => {
  const filter = ctx.createBiquadFilter();
  filter.type = 'peaking';
  filter.frequency.value = freq;
  filter.Q.value = 1.0;
  filter.gain.value = calculateGain(eqValues[index]);
  filterNodes.push(filter);
});

// Chain filters
noiseNode.connect(filterNodes[0]);
for (let i = 0; i < filterNodes.length - 1; i++) {
  filterNodes[i].connect(filterNodes[i + 1]);
}
filterNodes[filterNodes.length - 1].connect(gainNode);
```

#### 3. Notch Filter (Bandstop)
**Location**: `client/src/hooks/useNotchedNoise.ts`

**Purpose**: Remove specific frequency band for tinnitus therapy

**Implementation**:
```typescript
const notchFilter = ctx.createBiquadFilter();
notchFilter.type = 'notch';
notchFilter.frequency.value = notchFrequency; // User's tinnitus freq
notchFilter.Q.value = notchFrequency / notchWidth; // Bandwidth control

noiseNode.connect(notchFilter);
notchFilter.connect(gainNode);
gainNode.connect(ctx.destination);
```

**Q Factor Calculation**:
- Narrow notch: High Q (e.g., 8 for 500Hz width)
- Wide notch: Low Q (e.g., 2 for 2000Hz width)

#### 4. Audiometer Gain Calibration
**Location**: `client/src/hooks/useAudiometerEngine.ts`

**Problem**: Linear volume mapping makes low volumes inaudible

**Solution**: Calibrated gain curve with three segments:

```typescript
const normalizedDb = Math.max(-10, Math.min(100, volumeDb));
let gainValue: number;

// Segment 1: -10 to 0 dB (very quiet, exponential)
if (normalizedDb <= 0) {
  gainValue = 0.001 * Math.pow(1.4, normalizedDb + 10);
}
// Segment 2: 0 to 40 dB (linear ramp)
else if (normalizedDb <= 40) {
  gainValue = 0.005 + (normalizedDb / 40) * 0.095;
}
// Segment 3: 40 to 100 dB (slower linear ramp)
else {
  gainValue = 0.1 + ((normalizedDb - 40) / 60) * 0.4;
}

gainNode.gain.value = Math.min(gainValue, 0.5); // Cap at 0.5
```

**Result**: Audible tones across full -10dB to 100dB range

#### 5. Race Condition Prevention
**Location**: `client/src/pages/Audiometer.tsx`

**Problem**: Rapid clicks could mark wrong cells as "tested"

**Solution**: Cancellation token pattern:
```typescript
const cancelTokenRef = useRef<number>(0);

const handleCellClick = async (freq: number, vol: number) => {
  const currentToken = cancelTokenRef.current;
  setTestResults(prev => ({ ...prev, [key]: 'playing' }));
  
  await audioEngine.playTone(freq, vol, earSelection, 1000);
  
  // Only mark tested if token unchanged (not cancelled)
  if (cancelTokenRef.current === currentToken) {
    setTestResults(prev => ({ ...prev, [key]: 'tested' }));
  }
};

const clearResults = () => {
  cancelTokenRef.current++; // Invalidate all pending operations
  audioEngine.stop();
};
```

---

## Tool Documentation

### 1. Tinnitus Frequency Finder

**Purpose**: Help users identify the frequency of their tinnitus by playing adjustable tones.

**File Location**: `client/src/pages/FrequencyFinder.tsx`

**Audio Engine**: `client/src/hooks/useAudioEngine.ts`

#### How It Works

1. **User Interface**:
   - Frequency slider (50Hz - 20,000Hz, 10Hz steps)
   - Waveform selector (6 types)
   - Play/pause button
   - Save/share settings buttons

2. **Audio Generation**:
   ```typescript
   const audioEngine = useAudioEngine({ 
     frequency: 1000,  // Initial frequency
     waveform: 'sine', // Initial waveform
     volume: 50        // Fixed at 50%
   });
   ```

3. **State Management**:
   ```typescript
   const [frequency, setFrequency] = useState(1000);
   const [waveform, setWaveform] = useState<WaveformType>('sine');
   
   useEffect(() => {
     audioEngine.updateFrequency(frequency);
   }, [frequency]);
   
   useEffect(() => {
     audioEngine.updateWaveform(waveform);
   }, [waveform]);
   ```

4. **Waveform Types**:
   - **Sine**: Pure tone (default) - `oscillator.type = 'sine'`
   - **Square**: Hollow/clarinet-like - `oscillator.type = 'square'`
   - **Triangle**: Flute-like - `oscillator.type = 'triangle'`
   - **Sawtooth**: Bright/buzzy - `oscillator.type = 'sawtooth'`
   - **Filtered**: Sine wave through low-pass filter
   - **Noise**: White noise through bandpass filter centered at frequency

5. **URL Sharing**:
   ```typescript
   const handleShare = () => {
     const url = `${window.location.origin}/frequency-finder?freq=${frequency}&wave=${waveform}`;
     navigator.clipboard.writeText(url);
   };
   ```

**Key Components Used**:
- `AudioPlayer` - Play/pause button
- `WaveformSelector` - Icon-based waveform selection
- `Slider` - Shadcn range slider
- `Card`, `Alert` - Layout components

---

### 2. Online Audiometer

**Purpose**: Professional hearing test that generates an interactive audiogram chart showing hearing thresholds.

**File Location**: `client/src/pages/Audiometer.tsx`

**Audio Engine**: `client/src/hooks/useAudiometerEngine.ts`

**Chart Component**: `client/src/components/AudiogramChart.tsx`

#### How It Works

1. **Test Grid Setup**:
   ```typescript
   const frequencies = [250, 500, 1000, 2000, 4000, 8000]; // Hz
   const volumes = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]; // dB
   ```
   Creates a 6×12 grid (72 test points)

2. **Ear Selection**:
   ```typescript
   type EarSelection = 'both' | 'left' | 'right';
   const [earSelection, setEarSelection] = useState<EarSelection>('both');
   ```
   Uses `StereoPannerNode`:
   - Left: `pan.value = -1`
   - Right: `pan.value = 1`
   - Both: `pan.value = 0`

3. **Cell State Machine**:
   ```typescript
   type CellState = 'untested' | 'playing' | 'tested';
   ```
   - **Untested**: Gray, hover effect
   - **Playing**: Primary color, pulsing animation
   - **Tested**: Secondary color, marked complete

4. **Test Execution**:
   ```typescript
   const handleCellClick = async (freq: number, vol: number) => {
     const key = `${freq}-${vol}`;
     const currentToken = cancelTokenRef.current;
     
     setTestResults(prev => ({ ...prev, [key]: 'playing' }));
     await audioEngine.playTone(freq, vol, earSelection, 1000);
     
     if (cancelTokenRef.current === currentToken) {
       setTestResults(prev => ({ ...prev, [key]: 'tested' }));
     }
   };
   ```

5. **Audiogram Visualization**:
   ```typescript
   // AudiogramChart.tsx
   const getLowestTestedVolume = (freq: number): number | null => {
     for (const vol of volumes) {
       const key = `${freq}-${vol}`;
       if (testResults[key] === 'tested') {
         return vol; // First tested = hearing threshold
       }
     }
     return null;
   };
   ```
   Plots lowest tested volume for each frequency

6. **Audio Node Configuration**:
   ```typescript
   // Per-playback node creation (prevents race conditions)
   const oscillator = ctx.createOscillator();
   const gainNode = ctx.createGain();
   const panner = ctx.createStereoPanner();
   
   oscillator.frequency.value = frequency;
   gainNode.gain.value = calibratedGain(volumeDb);
   panner.pan.value = earToPan(earSelection);
   
   oscillator.connect(gainNode)
            .connect(panner)
            .connect(ctx.destination);
   
   oscillator.start();
   setTimeout(() => oscillator.stop(), duration);
   ```

**Key Features**:
- Independent timeout handling prevents race conditions
- Calibrated gain curve ensures audibility at all volumes
- Per-playback node creation prevents stereo bleed
- Real-time Recharts audiogram with reversed Y-axis (medical standard)

---

### 3. Noise Generator

**Purpose**: Create custom colored noise using an 8-band equalizer for relaxation, masking, or sound therapy.

**File Location**: `client/src/pages/NoiseGenerator.tsx`

**Audio Engine**: `client/src/hooks/useNoiseGenerator.ts`

#### How It Works

1. **Equalizer Bands**:
   ```typescript
   const frequencies = ['32', '64', '125', '250', '500', '1k', '2k', '4k'];
   const [eqValues, setEqValues] = useState([50, 50, 50, 50, 50, 50, 50, 50]);
   ```
   Each value: 0-100 (maps to -12dB to +12dB)

2. **Noise Color Presets**:
   ```typescript
   const presets = [
     { name: 'White', values: [50, 50, 50, 50, 50, 50, 50, 50], color: 'white' },
     { name: 'Pink', values: [70, 65, 60, 55, 50, 45, 40, 35], color: 'pink' },
     { name: 'Brown', values: [80, 70, 60, 50, 40, 30, 20, 10], color: 'brown' },
     { name: 'Violet', values: [30, 35, 40, 45, 50, 55, 60, 70], color: 'violet' },
     { name: 'Blue', values: [35, 40, 45, 50, 55, 60, 65, 70], color: 'blue' },
     { name: 'Grey', values: [50, 45, 50, 45, 50, 45, 50, 45], color: 'grey' },
   ];
   ```

3. **Noise Buffer Creation**:
   ```typescript
   const createNoiseBuffer = (type: NoiseColor) => {
     const bufferSize = ctx.sampleRate * 2; // 2 seconds
     const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
     const output = buffer.getChannelData(0);
     
     // Algorithm varies by type (white/pink/brown/violet/blue/grey)
     // See "Audio Engine Implementation" section for details
     
     return buffer;
   };
   ```

4. **Equalizer Application**:
   ```typescript
   const filterNodes: BiquadFilterNode[] = [];
   const actualFreqs = [32, 64, 125, 250, 500, 1000, 2000, 4000];
   
   actualFreqs.forEach((freq, index) => {
     const filter = ctx.createBiquadFilter();
     filter.type = 'peaking';
     filter.frequency.value = freq;
     filter.Q.value = 1.0;
     filter.gain.value = (eqValues[index] - 50) * 0.24; // -12 to +12 dB
     filterNodes.push(filter);
   });
   
   // Chain all filters
   let currentNode: AudioNode = noiseNode;
   filterNodes.forEach(filter => {
     currentNode.connect(filter);
     currentNode = filter;
   });
   currentNode.connect(gainNode).connect(ctx.destination);
   ```

5. **Real-Time EQ Updates**:
   ```typescript
   const handleEqChange = (index: number, value: number) => {
     const newValues = [...eqValues];
     newValues[index] = value;
     setEqValues(newValues);
     noiseEngine.updateEqualizer(newValues);
   };
   
   // In hook:
   const updateEqualizer = (values: number[]) => {
     filterNodesRef.current.forEach((filter, index) => {
       filter.gain.value = (values[index] - 50) * 0.24;
     });
   };
   ```

6. **Noise Type Switching**:
   ```typescript
   useEffect(() => {
     if (noiseEngine.isPlaying) {
       noiseEngine.stop();
       setTimeout(() => noiseEngine.play(eqValues, noiseColor), 50);
     }
   }, [noiseColor]);
   ```

**UI Layout**:
- 8 horizontal sliders (changed from vertical for mobile usability)
- Preset buttons for quick noise color selection
- Volume control (0-100%)
- Real-time visual feedback

---

### 4. Tinnitus Matching

**Purpose**: Create a precise match of your tinnitus tone with full control over frequency, volume, and waveform for documentation and sharing.

**File Location**: `client/src/pages/TinnitusMatching.tsx`

**Audio Engine**: `client/src/hooks/useAudioEngine.ts`

#### How It Works

1. **Control Parameters**:
   ```typescript
   const [frequency, setFrequency] = useState(4000); // 50-20000 Hz
   const [volume, setVolume] = useState(30);         // 0-100%
   const [waveform, setWaveform] = useState<WaveformType>('sine');
   ```

2. **Volume Control Implementation**:
   ```typescript
   // Native HTML range input for reliable touch response
   <input
     type="range"
     min="0"
     max="100"
     value={volume}
     onInput={(e) => setVolume(Number(e.currentTarget.value))}
     onChange={(e) => setVolume(Number(e.currentTarget.value))}
     className="w-full"
   />
   ```
   - `onInput`: Real-time updates during drag
   - `onChange`: Compatibility fallback

3. **Real-Time Audio Updates**:
   ```typescript
   useEffect(() => {
     audioEngine.updateFrequency(frequency);
   }, [frequency]);
   
   useEffect(() => {
     audioEngine.updateVolume(volume);
   }, [volume]);
   
   useEffect(() => {
     audioEngine.updateWaveform(waveform);
   }, [waveform]);
   ```

4. **Settings Persistence**:
   ```typescript
   const handleSaveSettings = () => {
     const settings = {
       frequency,
       volume,
       waveform,
       timestamp: new Date().toISOString()
     };
     localStorage.setItem('tinnitusSettings', JSON.stringify(settings));
     navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
   };
   ```

5. **URL Sharing**:
   ```typescript
   const handleShare = () => {
     const params = new URLSearchParams({
       freq: frequency.toString(),
       vol: volume.toString(),
       wave: waveform
     });
     const url = `${window.location.origin}/tinnitus-matching?${params}`;
     navigator.clipboard.writeText(url);
   };
   
   // On page load:
   useEffect(() => {
     const params = new URLSearchParams(window.location.search);
     const freq = params.get('freq');
     const vol = params.get('vol');
     const wave = params.get('wave');
     
     if (freq) setFrequency(parseInt(freq, 10));
     if (vol) setVolume(parseInt(vol, 10));
     if (wave) setWaveform(wave as WaveformType);
   }, []);
   ```

6. **Waveform Component**:
   ```typescript
   // WaveformSelector.tsx
   const waveforms = [
     { type: 'sine', icon: Activity, label: 'Pure Tone' },
     { type: 'square', icon: Square, label: 'Square' },
     { type: 'triangle', icon: Triangle, label: 'Triangle' },
     { type: 'sawtooth', icon: Zap, label: 'Sawtooth' },
     { type: 'filtered', icon: Filter, label: 'Filtered' },
     { type: 'noise', icon: Radio, label: 'Noise' }
   ];
   ```

**Key Features**:
- Tabs for "Match Tone" vs "Information"
- Full 0-100% volume range (no minimum constraint)
- Frequency display with responsive sizing (text-xl sm:text-2xl md:text-3xl)
- Copy/share functionality for clinical documentation

---

### 5. Notched Noise Generator

**Purpose**: Therapeutic noise with the user's tinnitus frequency "notched out" for potential habituation therapy.

**File Location**: `client/src/pages/NotchedNoise.tsx`

**Audio Engine**: `client/src/hooks/useNotchedNoise.ts`

#### How It Works

1. **Core Parameters**:
   ```typescript
   const [notchFrequency, setNotchFrequency] = useState(4000); // 250-12000 Hz
   const [notchWidth, setNotchWidth] = useState(500);          // 100-2000 Hz
   const [noiseType, setNoiseType] = useState<NotchNoiseType>('white');
   ```

2. **Notch Filter Mathematics**:
   ```typescript
   // BiquadFilter in 'notch' mode
   const notchFilter = ctx.createBiquadFilter();
   notchFilter.type = 'notch';
   notchFilter.frequency.value = notchFrequency;
   
   // Q factor determines bandwidth
   // Higher Q = narrower notch
   notchFilter.Q.value = notchFrequency / notchWidth;
   
   // Example: 4000Hz frequency, 500Hz width
   // Q = 4000 / 500 = 8 (narrow notch)
   ```

3. **Notch Width Control**:
   ```typescript
   <Slider
     value={[notchWidth]}
     onValueChange={([value]) => setNotchWidth(value)}
     min={100}
     max={2000}
     step={50}
   />
   ```
   - 100Hz: Very narrow notch (surgical removal)
   - 500Hz: Standard therapeutic width
   - 2000Hz: Wide notch (gentler approach)

4. **Noise Type Switching** (Race Condition Fix):
   ```typescript
   // Problem: Changing noise type while playing caused overlapping sounds
   // Solution: Synchronous source replacement
   
   const replaceNoiseSource = (freq: number, width: number, type: NotchNoiseType) => {
     // Stop current source
     if (noiseNodeRef.current) {
       noiseNodeRef.current.stop();
       noiseNodeRef.current.disconnect();
     }
     
     // Create new buffer with new type
     const buffer = createNoiseBuffer(type);
     const newNoiseNode = ctx.createBufferSource();
     newNoiseNode.buffer = buffer;
     newNoiseNode.loop = true;
     
     // Reconnect through existing filter chain
     newNoiseNode.connect(notchFilterRef.current!);
     newNoiseNode.start();
     
     noiseNodeRef.current = newNoiseNode;
   };
   
   // UI trigger:
   const handleNoiseTypeChange = (newType: NotchNoiseType) => {
     setNoiseType(newType);
     if (noiseEngine.isPlaying) {
       noiseEngine.replaceNoiseSource(notchFrequency, notchWidth, newType);
     }
   };
   ```

5. **Real-Time Notch Updates**:
   ```typescript
   useEffect(() => {
     if (noiseEngine.isPlaying) {
       noiseEngine.updateNotch(notchFrequency, notchWidth);
     }
   }, [notchFrequency, notchWidth]);
   
   // In hook:
   const updateNotch = (freq: number, width: number) => {
     if (notchFilterRef.current) {
       notchFilterRef.current.frequency.value = freq;
       notchFilterRef.current.Q.value = freq / width;
     }
   };
   ```

6. **Audio Signal Chain**:
   ```
   NoiseBuffer → NotchFilter → GainNode → Destination
                      ↓
               [Frequency removed]
   ```

**Therapeutic Theory**:
- Playing noise with tinnitus frequency removed may reduce neural activity at that frequency
- Recommended usage: 1-2 hours daily over weeks/months
- Match notch frequency to your identified tinnitus frequency

**UI Features**:
- Radio button selector for noise type (White/Pink/Purple)
- Dual sliders for notch frequency and width
- Visual indicators showing current settings
- Save/export settings functionality

---

## File Structure

```
hearwell/
├── client/                          # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Shadcn UI components (20+ files)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   └── ...
│   │   │   ├── AudiogramChart.tsx   # Recharts audiogram visualization
│   │   │   ├── AudioPlayer.tsx      # Play/pause button component
│   │   │   ├── Navigation.tsx       # Top nav with theme toggle
│   │   │   ├── ThemeProvider.tsx    # Dark/light mode provider
│   │   │   └── WaveformSelector.tsx # Icon-based waveform picker
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAudioEngine.ts           # Tone generation (Freq Finder, Tinnitus Match)
│   │   │   ├── useAudiometerEngine.ts      # Hearing test audio
│   │   │   ├── useNoiseGenerator.ts        # 8-band EQ noise
│   │   │   ├── useNotchedNoise.ts          # Notched noise therapy
│   │   │   ├── use-toast.ts                # Toast notification hook
│   │   │   └── use-mobile.ts               # Mobile detection
│   │   │
│   │   ├── lib/
│   │   │   ├── queryClient.ts       # TanStack Query setup (if backend added)
│   │   │   └── utils.ts             # cn() class merger, helpers
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Landing page with tool cards
│   │   │   ├── FrequencyFinder.tsx  # Tool 1: Tinnitus frequency finder
│   │   │   ├── Audiometer.tsx       # Tool 2: Hearing test
│   │   │   ├── NoiseGenerator.tsx   # Tool 3: Custom noise generator
│   │   │   ├── TinnitusMatching.tsx # Tool 4: Precision tone matching
│   │   │   ├── NotchedNoise.tsx     # Tool 5: Therapeutic notched noise
│   │   │   └── not-found.tsx        # 404 page
│   │   │
│   │   ├── App.tsx                  # Root component with routing
│   │   ├── main.tsx                 # React entry point
│   │   ├── index.css                # Global styles, custom utilities, theme
│   │   └── vite-env.d.ts            # TypeScript declarations
│   │
│   ├── index.html                   # HTML entry point
│   └── public/                      # Static assets
│
├── server/                          # Backend (minimal, serves frontend)
│   ├── index.ts                     # Express server entry
│   ├── vite.ts                      # Vite dev middleware
│   └── routes.ts                    # API routes (none for audio)
│
├── shared/                          # Shared types (currently unused)
│   └── schema.ts
│
├── design_guidelines.md             # Complete design system spec
├── replit.md                        # Project summary
├── Hearwell Project.md              # THIS FILE - comprehensive docs
│
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind CSS config
├── vite.config.ts                   # Vite build config
├── postcss.config.js                # PostCSS with Tailwind
└── .replit                          # Replit configuration
```

### Key Directories Explained

**`client/src/hooks/`** - Audio Engine Layer
- Each hook encapsulates Web Audio API logic
- Manages AudioContext lifecycle
- Provides simple play/stop/update interface
- Handles cleanup on unmount

**`client/src/pages/`** - Tool Interfaces
- Each page is a complete tool
- Uses corresponding audio hook
- Manages UI state (sliders, buttons, forms)
- Implements URL parameter handling

**`client/src/components/ui/`** - Shadcn Components
- Pre-built accessible components
- Customized with Tailwind variants
- Used throughout all pages

**`client/src/index.css`** - Design System
- CSS custom properties for theming
- Tailwind base, components, utilities
- Custom animation utilities (hover-elevate, etc.)

---

## Extending the Application

### Adding a New Tool

1. **Create Audio Hook** (`client/src/hooks/useMyTool.ts`):
```typescript
import { useState, useRef, useEffect } from 'react';

export function useMyTool() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  };
  
  const play = () => {
    const ctx = initAudioContext();
    // Create and connect audio nodes
    setIsPlaying(true);
  };
  
  const stop = () => {
    // Cleanup
    setIsPlaying(false);
  };
  
  useEffect(() => {
    return () => {
      stop();
      audioContextRef.current?.close();
    };
  }, []);
  
  return { isPlaying, play, stop };
}
```

2. **Create Page Component** (`client/src/pages/MyTool.tsx`):
```typescript
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AudioPlayer from "@/components/AudioPlayer";
import { useMyTool } from "@/hooks/useMyTool";

export default function MyTool() {
  const audioEngine = useMyTool();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-2">
          My New Tool
        </h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 sm:space-y-8">
            <AudioPlayer 
              isPlaying={audioEngine.isPlaying}
              onPlayPause={audioEngine.toggle}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

3. **Register Route** (`client/src/App.tsx`):
```typescript
import MyTool from "@/pages/MyTool";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/my-tool" component={MyTool} />
      {/* ... other routes */}
    </Switch>
  );
}
```

4. **Add to Navigation** (`client/src/components/Navigation.tsx`):
```typescript
const navItems = [
  { path: "/", label: "Home" },
  { path: "/my-tool", label: "My Tool" },
  // ... other items
];
```

5. **Add Tool Card** (`client/src/pages/Home.tsx`):
```typescript
const tools = [
  {
    title: "My Tool",
    description: "Description of what it does",
    icon: MyIcon,
    path: "/my-tool",
    color: "bg-purple-500"
  },
  // ... other tools
];
```

### Adding a New Waveform Type

**In `useAudioEngine.ts`**:
```typescript
export type WaveformType = 'sine' | 'square' | 'triangle' | 'sawtooth' | 'filtered' | 'noise' | 'mywave';

// In play() function:
if (waveform === 'mywave') {
  // Custom implementation
  const customOsc = ctx.createOscillator();
  customOsc.type = 'sine';
  customOsc.frequency.value = frequency;
  
  // Add processing (filters, etc.)
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1000;
  
  customOsc.connect(filter).connect(gainNode);
  customOsc.start();
  oscillatorRef.current = customOsc;
}
```

**In `WaveformSelector.tsx`**:
```typescript
const waveforms = [
  // ... existing
  { type: 'mywave', icon: MyCustomIcon, label: 'My Wave' }
];
```

### Adding a New Noise Color

**In `useNoiseGenerator.ts`**:
```typescript
export type NoiseColor = 'white' | 'pink' | 'brown' | 'violet' | 'blue' | 'grey' | 'mynoise';

// In createNoiseBuffer():
else if (type === 'mynoise') {
  // Custom algorithm
  for (let i = 0; i < bufferSize; i++) {
    // Generate samples
    output[i] = /* your algorithm */;
  }
}
```

**In `NoiseGenerator.tsx`**:
```typescript
const presets = [
  // ... existing
  { name: 'My Noise', values: [60, 55, 50, 45, 40, 35, 30, 25], color: 'mynoise' }
];
```

### Adding Custom Styling

**Update `index.css`**:
```css
@layer base {
  :root {
    --my-custom-color: 200 100% 50%;
  }
  
  .dark {
    --my-custom-color: 200 100% 30%;
  }
}

@layer utilities {
  .my-utility {
    /* custom styles */
  }
}
```

**Update `tailwind.config.ts`**:
```typescript
theme: {
  extend: {
    colors: {
      'my-custom': 'hsl(var(--my-custom-color))'
    }
  }
}
```

### Adding Data Persistence

**Example: Save User Settings**:
```typescript
// In tool page:
const saveSettings = () => {
  const settings = {
    frequency,
    volume,
    waveform,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('toolSettings', JSON.stringify(settings));
};

const loadSettings = () => {
  const saved = localStorage.getItem('toolSettings');
  if (saved) {
    const settings = JSON.parse(saved);
    setFrequency(settings.frequency);
    setVolume(settings.volume);
    setWaveform(settings.waveform);
  }
};

useEffect(() => {
  loadSettings();
}, []);
```

### Adding Backend API (Optional)

If you need to save user data server-side:

1. **Create Schema** (`shared/schema.ts`):
```typescript
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  toolName: text('tool_name').notNull(),
  settings: text('settings').notNull(), // JSON string
  createdAt: timestamp('created_at').defaultNow(),
});
```

2. **Create API Route** (`server/routes.ts`):
```typescript
app.post('/api/settings', async (req, res) => {
  const { userId, toolName, settings } = req.body;
  // Save to database
  res.json({ success: true });
});
```

3. **Use in Frontend** (with TanStack Query):
```typescript
const mutation = useMutation({
  mutationFn: async (settings) => {
    return apiRequest('/api/settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    });
  }
});
```

---

## Performance Considerations

### Audio Buffer Management
- Noise buffers are 2 seconds (bufferSize = sampleRate * 2)
- Buffers are created once and reused (loop = true)
- Prevents memory allocation on every play

### State Updates
- Volume changes use refs to avoid React re-renders during drag
- Frequency updates are throttled in some tools
- Audio nodes are disconnected properly to prevent memory leaks

### Mobile Optimization
- Touch targets minimum 64px (Play button: w-16 h-16)
- Progressive font scaling prevents layout shift
- Reduced padding on mobile saves scroll distance
- Native HTML range inputs for reliable touch response

### Responsive Images
- Tool cards use SVG icons (infinitely scalable)
- No heavy images in critical path
- Lazy-loaded components if needed

---

## Browser Compatibility

### Web Audio API Support
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (may need user gesture to start AudioContext)
- **Mobile browsers**: Generally good, iOS requires user interaction

### Known Issues
1. **iOS Safari**: AudioContext must be created in user gesture (play button click)
2. **Mobile Chrome**: Better performance with smaller buffer sizes
3. **Firefox**: Slightly different filter characteristics

### Polyfills
```typescript
// In audio hooks:
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
```

---

## Testing Guidelines

### Manual Testing Checklist

**For Each Tool:**
- [ ] Play button works
- [ ] Stop button works  
- [ ] Parameter changes update audio in real-time
- [ ] Volume slider works (both drag and click)
- [ ] Settings can be saved
- [ ] Share button copies to clipboard
- [ ] URL parameters load correctly
- [ ] Responsive layout on mobile
- [ ] Dark mode displays correctly
- [ ] Audio stops on page navigation
- [ ] No memory leaks (check browser task manager)

**Audiometer Specific:**
- [ ] Each frequency column works
- [ ] Left/right/both ear selection works
- [ ] Audiogram chart updates in real-time
- [ ] No center bleed when testing single ear
- [ ] All volume levels audible (test with headphones)
- [ ] Rapid clicking doesn't cause race conditions

**Noise Generator Specific:**
- [ ] All 8 EQ sliders work
- [ ] Preset buttons apply correctly
- [ ] Noise type switching works without glitches
- [ ] Volume control affects all frequencies

**Notched Noise Specific:**
- [ ] Notch frequency slider works
- [ ] Notch width slider works
- [ ] Noise type switching works smoothly
- [ ] Can hear frequency removal (test at various frequencies)

### Browser Testing
Test on:
- Chrome (desktop)
- Firefox (desktop)
- Safari (desktop)
- Safari (iOS)
- Chrome (Android)

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader announces controls
- [ ] High contrast mode works
- [ ] Touch targets are adequate (minimum 64px)

---

## Deployment

### Build Process
```bash
npm run build
```
Creates optimized production bundle in `dist/`.

### Environment Variables
None required for audio functionality. Optional:
- `VITE_ANALYTICS_ID` - Analytics tracking
- `VITE_API_URL` - If backend is added

### Hosting Recommendations
- **Vercel**: Zero config, excellent performance
- **Netlify**: Good for static sites
- **Cloudflare Pages**: Fast edge network
- **Replit**: Current hosting, works well

### Production Checklist
- [ ] Remove console.logs
- [ ] Test all tools in production build
- [ ] Verify analytics tracking
- [ ] Test on real mobile devices
- [ ] Check bundle size (should be < 500KB)
- [ ] Enable gzip compression
- [ ] Set proper cache headers

---

## Troubleshooting

### Audio Not Playing
1. Check browser console for errors
2. Verify AudioContext is not suspended (Chrome auto-suspends)
3. Ensure user has interacted with page (required for iOS)
4. Check system volume and headphone connection

### Choppy/Glitchy Audio
1. Reduce buffer size for lower latency
2. Check CPU usage (close other tabs)
3. Try different browser
4. Disable browser extensions

### Race Conditions in Audiometer
- Verify cancellation token is incrementing
- Check that timeout IDs are being cleared
- Ensure per-playback node creation

### Volume Too Quiet/Loud
- Check calibrated gain curve in `useAudiometerEngine.ts`
- Verify `gainNode.gain.value` is clamped (0-0.5)
- Test with different headphones

### Layout Issues on Mobile
- Check responsive classes (text-xs sm:text-sm, etc.)
- Verify touch target sizes (minimum 64px)
- Test on actual device, not just browser DevTools

---

## Maintenance Notes

### Updating Dependencies
```bash
npm update
```
Test thoroughly after updates, especially:
- Radix UI components
- Recharts
- Tailwind CSS

### Known Technical Debt
1. Audiometer could use TypeScript strict mode fixes
2. Some useEffect dependencies could be optimized
3. Consider React.memo for expensive components
4. Add error boundaries for production

### Future Enhancements
- [ ] User accounts with saved settings
- [ ] Tinnitus tracking over time (calendar view)
- [ ] Export audiogram as PDF
- [ ] Multiple tinnitus tone matching (bilateral)
- [ ] Frequency masking calculator
- [ ] Sound therapy session timer
- [ ] Integration with hearing aid settings
- [ ] Calibration wizard for different headphones

---

## Credits & References

### Audio Algorithms
- **Pink Noise**: Paul Kellet's algorithm
- **Brown Noise**: Random walk / Brownian motion
- **Audiogram Standards**: Based on ISO 389-8 pure-tone audiometry

### Libraries
- React Team - UI framework
- Shadcn - Component library
- Radix UI - Accessible primitives
- Tailwind Labs - Utility CSS
- Recharts Team - Charts

### Medical Disclaimer
This application is for educational purposes only. It cannot replace professional audiological testing or medical diagnosis. Always consult qualified healthcare providers for hearing-related concerns.

---

## Contact & Support

For technical questions about this codebase:
1. Review this documentation thoroughly
2. Check `replit.md` for recent changes
3. Examine relevant hook/page files
4. Test in isolation to identify issue

---

**Document Version**: 1.0  
**Last Updated**: November 8, 2025  
**Application Version**: Production-ready with 5 complete tools

---

*This document serves as the complete technical reference for the HearWell project. It should be updated whenever significant architectural changes are made.*
