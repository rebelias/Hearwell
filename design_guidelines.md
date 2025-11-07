# Design Guidelines: Tinnitus & Hearing Health App

## Design Approach

**System Selected**: Material Design 3 principles with health-focused customization

**Rationale**: Medical utility app requiring clear hierarchy, accessibility, and trustworthy presentation while maintaining energetic appeal across age groups. Material Design provides robust component patterns for complex interactions (sliders, audio controls, data visualization) while supporting vibrant theming.

**Key Principles**:
- Clarity over decoration: Every UI element serves functional purpose
- Progressive disclosure: Complex tools broken into digestible steps
- Immediate feedback: Visual confirmation for all audio interactions
- Trust signals: Professional presentation with accessible language

## Typography

**Font System**: Google Fonts via CDN
- **Primary**: Inter (400, 500, 600, 700) - Clean, highly legible for medical content
- **Display**: Manrope (600, 700) - Friendly, modern for headings and tool titles

**Hierarchy**:
- **H1**: 2.5rem/3rem (mobile/desktop), font-weight 700, Manrope - Tool titles, page headers
- **H2**: 2rem/2.25rem, font-weight 600, Manrope - Section headers, step indicators
- **H3**: 1.5rem/1.75rem, font-weight 600, Inter - Subsections, feature titles
- **Body Large**: 1.125rem, font-weight 400, Inter - Instructions, descriptions
- **Body**: 1rem, font-weight 400, Inter - General content, labels
- **Caption**: 0.875rem, font-weight 500, Inter - Metadata, calibration values

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20 (e.g., p-4, gap-6, my-8)

**Container Strategy**:
- Navigation/Header: Full-width with max-w-7xl inner container
- Tool interfaces: max-w-6xl - wide enough for controls without feeling cramped
- Educational content: max-w-4xl - optimal reading width
- Mobile: Full-width with px-4 padding

**Grid Patterns**:
- Tool controls: Single column on mobile, 2-column on md+ for parameter/visualization split
- Feature showcase: 1/2/3 column grid (sm/md/lg) for tool cards on homepage
- Audiogram display: Flexible container maintaining aspect ratio

## Component Library

### Navigation
**Top Navigation Bar**:
- Logo/Brand left-aligned with icon + "HearWell" wordmark
- Horizontal tool menu (desktop): Frequency Finder | Audiometer | Noise Generator | Tinnitus Matching | Notched Sounds
- Hamburger menu (mobile) with slide-out drawer
- Accent color underline for active tool
- Sticky positioning with subtle shadow on scroll

### Audio Control Components
**Tone Generator Interface**:
- Large frequency slider (horizontal, full-width) with Hz value display above
- Play/Pause toggle button (circular, 64px, centered with icon)
- Waveform selector: Icon-based radio buttons (sine, square, triangle, sawtooth, filtered, noise)
- Volume indicator with visual bars
- Save/Share buttons (secondary style, top-right)

**Equalizer (Noise Generator)**:
- 8 vertical sliders with frequency labels beneath (32Hz to 16kHz)
- Preset buttons as icon tiles below sliders
- Background ambience toggles (checkboxes with icons: wave for sea, leaf for forest, wind icon)

**Audiogram Testing Board**:
- Grid layout: 6 columns (frequencies) × 12 rows (volume levels)
- Interactive cells: Default state, Playing state (pulsing), Completed state (checkmark)
- Color-coded ear selection buttons: Blue (left), Red (right), Purple (both)
- Real-time audiogram chart display below testing board

### Forms & Controls
- Range sliders: Material Design style with thumb, active track fill, value bubble on drag
- Buttons: Rounded (8px), medium height (44px touch target), distinct primary/secondary/ghost variants
- Toggle switches: For ear selection, background sounds
- Radio buttons: Icon-based for waveform selection

### Data Visualization
**Audiogram Chart**:
- Professional medical chart styling
- Grid with frequency (Hz) on x-axis, volume (dB) on y-axis
- Plotted results with connected line graph
- "Speech banana" overlay toggle
- Print/Export functionality

### Cards & Containers
**Tool Cards (Homepage)**:
- Elevated cards with hover lift effect
- Icon (top), Title (bold), Brief description, "Start Tool" CTA
- 16px border-radius, subtle shadow
- Grid layout: 1 column mobile, 2 columns tablet, 3 columns desktop

**Instruction Panels**:
- Collapsible sections with step numbering
- Light background differentiation from main content
- Clear visual hierarchy: Step number → Title → Instructions

### Overlays
- Calibration modal: Centered, max-w-lg, with audio player and visual calibration guide
- Results sharing: Copy-to-clipboard toast notification
- Educational info: Side sheet (desktop) or bottom sheet (mobile) for contextual help

## Images Section

**Hero Section**: No large hero image - focus on immediate tool access

**Tool Illustrations**:
- SVG iconography for each tool type (frequency waves, ear diagram, equalizer bars, sound waves)
- Size: 48px-64px for tool cards, 32px for navigation
- Style: Duotone with primary + accent colors
- Placement: Top of tool cards, inline with section headers

**Educational Diagrams**:
- Audiogram example chart (PNG/SVG) - 600×400px
- Ear anatomy illustration - for calibration instructions
- Waveform comparisons - visual representations of sine/square/triangle waves
- Placement: Inline within instruction sections

**Background Elements**:
- Subtle gradient overlays for section separation (never distracting)
- Abstract wave patterns (CSS-generated) for visual interest in empty states

## Animations

**Strategic Use Only**:
- Audio playback: Pulsing play button, animated waveform visualization
- Slider interaction: Smooth value transitions, haptic-style feedback
- Navigation: 200ms ease transitions for menu open/close
- Loading states: Spinner for audio generation
- Avoid: Page transitions, scroll-triggered effects, decorative animations

## Critical UX Patterns

**Mobile-First Audio Controls**:
- Larger touch targets (minimum 44px)
- Horizontal sliders with adequate thumb size for precision
- Volume controls accessible without blocking content

**Progressive Tool Flow**:
1. Brief introduction
2. Calibration step (if required)
3. Interactive tool interface
4. Results display
5. Share/Save options

**Accessibility Compliance**:
- WCAG 2.1 AA minimum
- Keyboard navigation for all controls
- Screen reader labels for audio states
- High contrast mode support
- Focus indicators on all interactive elements

This design system prioritizes functional clarity while maintaining visual energy through purposeful use of layout, typography hierarchy, and strategic interaction feedback.