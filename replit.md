# HearWell - Tinnitus & Hearing Health Application

## Overview
HearWell is a comprehensive hearing health web application that provides five professional-grade tools for tinnitus management and hearing assessment. Built with React and TypeScript, it uses the Web Audio API for precise audio tone generation and playback.

## Current State
All five core tools are fully implemented and functional, plus an educational information hub:

1. **Frequency Finder** - Helps users identify their tinnitus frequency (50Hz - 20kHz)
2. **Online Audiometer** - Professional hearing test with interactive audiogram visualization
3. **Noise Generator** - 8-band equalizer for creating custom colored noise (white, pink, brown, violet, blue, grey)
4. **Tinnitus Matching** - Precise tone matching with frequency, volume, and waveform controls
5. **Notched Noise Generator** - Therapeutic noise with tinnitus frequency removed
6. **Learn** - Comprehensive science-based guide covering tinnitus, hearing loss, hyperacusis, and related conditions with authoritative medical links

## Technical Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for audiogram visualization
- **Audio**: Web Audio API for all sound generation

### Audio Implementation
All audio functionality uses custom React hooks wrapping the Web Audio API:

- `useAudioEngine.ts` - Tone generation for frequency finder and tinnitus matching
- `useAudiometerEngine.ts` - Precise frequency/volume control for hearing tests
- `useNoiseGenerator.ts` - Noise generation with multi-band EQ
- `useNotchedNoise.ts` - Bandstop filtering for therapeutic noise

### Key Features
- **Real-time Audio Processing**: All sounds generated client-side using Web Audio API
- **Mobile Responsive**: Fully optimized for mobile and desktop
- **Dark Mode**: Complete dark/light theme support
- **Shareable Settings**: URL parameters for sharing tinnitus tone settings
- **Interactive Audiogram**: Real-time chart visualization of hearing test results
- **Multiple Waveforms**: Sine, square, triangle, sawtooth, filtered, and noise options
- **Download Functionality**: Export test results and audio files
  - Audiometer: CSV export of hearing test results
  - Noise Generator: 30-second WAV audio export with custom EQ settings
  - Notched Noise: 30-second WAV audio export with notch filter applied

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   ├── Navigation.tsx   # Main navigation with dark mode toggle
│   │   ├── WaveformSelector.tsx  # Waveform type selector
│   │   ├── AudioPlayer.tsx  # Play/pause control component
│   │   └── AudiogramChart.tsx  # Recharts audiogram visualization
│   ├── hooks/
│   │   ├── useAudioEngine.ts      # Tone generator for frequency/tinnitus matching
│   │   ├── useAudiometerEngine.ts # Audiometer tone playback
│   │   ├── useNoiseGenerator.ts   # Noise generation with EQ
│   │   └── useNotchedNoise.ts     # Notched noise generation
│   ├── lib/
│   │   └── audioExport.ts         # WAV audio export utility
│   ├── pages/
│   │   ├── Home.tsx               # Landing page with tool cards
│   │   ├── FrequencyFinder.tsx    # Tinnitus frequency identification
│   │   ├── Audiometer.tsx         # Hearing test with audiogram
│   │   ├── NoiseGenerator.tsx     # Custom noise with EQ
│   │   ├── TinnitusMatching.tsx   # Precision tone matching
│   │   ├── NotchedNoise.tsx       # Therapeutic notched noise
│   │   └── Learn.tsx              # Educational info hub with medical guidance
│   └── index.css                  # Custom design tokens and utilities
└── design_guidelines.md           # Complete design system documentation
```

## Design System
- **Primary Color**: Warm orange/peach (#38.23 87.6% 74.71% in HSL)
- **Accent**: Soft green for secondary elements
- **Typography**: Inter (body), Manrope (headings)
- **Interactions**: Custom elevation utilities (hover-elevate, active-elevate-2)
- **Spacing**: Consistent 8px base unit system

## Recent Changes

### November 9, 2025 (Latest Session - Part 2)
- **Enhanced Audiometer Features**:
  - **1kHz Reference Calibration System**: Added CalibrationModal that appears on first use, allows users to adjust 1kHz reference tone to comfortable listening level, stores calibration in localStorage for persistent accuracy improvement
  - **Warble Tone Support**: Implemented frequency-modulated tones (±5% at 4.5 Hz) in useAudiometerEngine as alternative to pure tones - warble tones are easier to detect for some users, especially those with tinnitus
  - **Intelligent Audiogram Interpretation**: Created AudiogramInterpretation component that:
    - Categorizes hearing loss (Normal 0-25dB, Mild 26-40dB, Moderate 41-55dB, Moderate-Severe 56-70dB, Severe 71-90dB, Profound 91+dB)
    - Provides frequency-specific insights (high-freq vs low-freq loss detection, profile variance analysis)
    - Displays overall assessment with severity-based color coding (green/yellow/red alerts)
    - Shows individual frequency results with threshold values and categories
    - Includes color-coded hearing loss legend and medical disclaimer
  - **Improved Audiometer UI**: Reorganized left panel with "Test Settings" card containing calibration button, tone type toggle (Pure/Warble), and ear selection - more compact and professional layout
  - **localStorage Integration**: Calibration persists across sessions, users only need to calibrate once per device/headphones

### November 9, 2025 (Latest Session - Part 1)
- **Educational Learn Page**:
  - Added comprehensive "Learn" page to navbar with science-based hearing health information
  - Covers tinnitus (pulsatile and non-pulsatile), hyperacusis, hearing loss, SSNHL, and 15+ conditions
  - Includes urgent care guidelines, symptom-to-diagnosis table, and evidence-based treatment approaches
  - Links to authoritative medical sources (NIDCD, AAO-HNS, NICE, NIH/NCBI)
  - Mobile-responsive design with Cards, tables, and color-coded urgency alerts

- **Accessibility Enhancement - Plain-Language Tooltips**:
  - Added comprehensive tooltip system across all 5 tools (FrequencyFinder, TinnitusMatching, NoiseGenerator, NotchedNoise, Audiometer)
  - Technical terms remain visible, with HelpCircle icons providing plain-language explanations
  - All tooltips use shadcn/ui TooltipProvider, TooltipTrigger, and TooltipContent components
  - Examples: "4000 Hz" explained as "High pitch - like a bird chirping", "Equalizer" described as "bass/treble on a stereo"
  - Improves accessibility for non-technical users while maintaining professional terminology

- **Filtered Waveform Implementation**:
  - Added 1kHz low-pass filter (Q=1) to 'filtered' waveform option in useAudioEngine.ts
  - Filter creates softer, warmer tone compared to pure sine wave
  - Both real-time playback and WAV export now apply the same filter
  - Ensures downloaded audio matches what users hear in-app

- **Download Functionality Improvements**:
  - TinnitusMatching: Fixed download to handle all waveform types (sine, square, triangle, sawtooth, filtered, noise)
  - Noise waveform now correctly generates white noise buffer in export
  - Filtered waveform applies low-pass filter in offline rendering
  - All exported WAV files faithfully reproduce the live audio experience

- **Download Functionality Implementation** (Earlier in session):
  - Created `audioExport.ts` utility for WAV audio export
  - Audiometer: Export hearing test results as CSV file with frequency/threshold data
  - Noise Generator: Export 30-second WAV audio files with custom EQ settings applied
  - Notched Noise: Export 30-second WAV audio files with notch filter applied
  - Tinnitus Matching: Export 30-second WAV audio files with exact waveform/frequency/volume
  - All audio exports use OfflineAudioContext for non-real-time rendering at 48kHz stereo
  - Fixed AudioContext resource leak by using default sample rate instead of creating disposable contexts
  - WAV files encoded as 16-bit PCM stereo format
  - Descriptive filenames include settings and timestamps

### November 8, 2025
- **Mobile Responsiveness Overhaul** (Galaxy S25 Ultra optimization):
  - Progressive font scaling: All headings and body text use responsive breakpoints (text-2xl sm:text-3xl md:text-4xl)
  - Reduced mobile spacing: Container padding py-6 sm:py-8 md:py-12 (was fixed py-12)
  - Optimized card spacing: space-y-6 sm:space-y-8 (was fixed space-y-8)
  - Smaller mobile typography: text-xs sm:text-sm for labels, text-sm sm:text-base for body text
  - Frequency displays scale appropriately: text-xl sm:text-2xl md:text-3xl
  - Maintained 64px touch targets for buttons and sliders
  - Applied across all pages: Home, FrequencyFinder, TinnitusMatching, NoiseGenerator, NotchedNoise

### November 7, 2025
- **Critical Audio Fixes**:
  - Audiometer: Per-playback node creation ensures immediate left/right ear routing without center bleed
  - Audiometer: Calibrated gain curve (0.001 at -10 dB to 0.5 max) ensures audibility across full range
  - Notched Noise: Synchronous noise type switching via replaceNoiseSource method eliminates race conditions
  - Audiometer UI: Fixed state management to show playing→tested transitions properly
  - Audiometer Timeout Management: Independent timeout resolution prevents race conditions during rapid clicks
- **UX Improvements**:
  - Noise Generator: Changed EQ sliders from vertical to horizontal layout for better usability
  - Noise Generator: Updated page title from "White Noise Generator" to "Noise Generator"
  - Tinnitus Matching: Fixed volume slider allowing full 0-100% range (removed min constraint)
  - Removed non-functional background ambience controls (sea/wind/forest)
- Implemented all five core audio tools with Web Audio API
- Added real-time audiogram chart visualization
- Integrated URL parameter support for shareable settings
- Created custom audio engine hooks for each tool type

## Usage
1. Navigate to any tool from the home page
2. Use headphones for accurate results
3. Click PLAY to start audio generation
4. Adjust controls (frequency, volume, waveform) in real-time
5. Save or share your settings using the action buttons

## Medical Disclaimer
This is an educational tool and cannot replace professional audiological testing. Users should consult healthcare professionals for medical advice regarding hearing health.

## Development
The application runs on port 5000 with hot module reloading enabled. All audio processing happens client-side with no server dependencies for audio generation.
