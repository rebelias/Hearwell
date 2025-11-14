# HearWell

**Free, Open-Source Hearing Health Tools**

A comprehensive browser-based application providing professional-grade audio tools for hearing health assessment and tinnitus management. Built entirely client-side with React and TypeScript, using the Web Audio API for precise, real-time audio generation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)

---

## 🌟 Features

HearWell provides five professional-grade audio tools, all running **100% client-side** in your browser:

### 1. **Tinnitus Frequency Finder**

Identify the frequency of your tinnitus by adjusting tones from 50Hz to 20kHz. Supports multiple waveforms (sine, square, triangle, sawtooth, filtered).

### 2. **Online Audiometer**

Professional hearing test with real-time audiogram visualization. Test frequencies from 250Hz to 10kHz (including 6kHz) at various volume levels. Intuitive three-button interface: Play sound, mark as heard, or mark as not heard. Supports left, right, or both ears. Comprehensive CSV report generation with test completion validation.

### 3. **Tonal Masker**

Acoustic neuromodulation therapy for tinnitus using amplitude modulation (AM), frequency modulation (FM), and Coordinated Reset (CR) randomized tone sequences. Features randomized modulation to prevent neural adaptation and optional background sounds for enhanced therapy.

### 4. **Noise Generator**

Create custom colored noise using an 8-band equalizer. Presets include white, pink, brown, violet, blue, and grey noise for relaxation, masking, or sound therapy.

### 5. **Notched Noise Generator**

Advanced therapeutic noise generator with 10-band equalizer, multiple noise types (white, pink, brown, purple, grey), stereo width control, and presets. Designed for comprehensive tinnitus therapy with precise frequency control.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- Modern web browser with Web Audio API support (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/rebelias/Hearwell.git
cd Hearwell

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000` (or the port specified in your `PORT` environment variable).

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Development Commands

```bash
# Run development server
npm run dev

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check

# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests (requires: npx playwright install)
npm run test:e2e
```

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript 5.6, Vite 5
- **Styling:** Tailwind CSS 3, Shadcn/ui components
- **Routing:** Wouter (lightweight SPA router)
- **Audio:** Web Audio API (native browser API)
- **Charts:** Recharts (for audiogram visualization)
- **Internationalization:** react-i18next (9 languages: EN, ES, FR, DE, PT, TR, ZH, HI, JA)
- **Testing:** Vitest (unit tests), Playwright (E2E tests)
- **Code Quality:** ESLint 8, Prettier, Husky (pre-commit hooks)
- **CI/CD:** GitHub Actions, Cloudflare Pages deployment
- **License:** MIT (free and open-source)

---

## 📖 Documentation

- **[Complete Technical Documentation](./Hearwell%20Project.md)** - Comprehensive 1400+ line guide covering architecture, implementation, and extension
- **[Design Guidelines](./design_guidelines.md)** - Complete design system and UI/UX specifications

---

## 🔒 Privacy & Data

**No User Authentication Required**  
HearWell operates entirely client-side. No user accounts, no login, no data collection.

**No Backend Server**  
All audio processing happens in your browser using the Web Audio API. No data is sent to any server.

**No Data Collection**

- No analytics tracking
- No user data storage
- No third-party scripts
- Optional localStorage for user preferences only (stored locally on your device)

**100% Private**  
Your hearing test results, tinnitus frequency, and settings remain on your device. You can share settings via URL parameters if you choose, but nothing is stored server-side.

**GDPR Compliant**  
HearWell includes a comprehensive disclaimer modal shown on first visit, clearly stating that this is an educational tool and not a medical device. All liability is shifted to the user, ensuring full compliance with GDPR and EU regulations.

---

## 🌐 Browser Compatibility

- ✅ **Chrome/Edge** - Full support
- ✅ **Firefox** - Full support
- ✅ **Safari** - Full support (may require user interaction to start audio)
- ✅ **Mobile browsers** - Supported (iOS Safari requires user gesture)

## 🌍 Multi-Language Support

HearWell is fully internationalized and supports **9 languages**:

- 🇬🇧 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇵🇹 Portuguese
- 🇹🇷 Turkish
- 🇨🇳 Chinese (Mandarin)
- 🇮🇳 Hindi
- 🇯🇵 Japanese

Language preference is automatically detected from your browser settings and can be changed via the language switcher in the navigation bar. All tool interfaces, educational content, and disclaimers are fully translated.

---

## 📝 Contributing

Contributions are welcome! This is an open-source project under the MIT license.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests if applicable.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ IMPORTANT LEGAL DISCLAIMER

**PLEASE READ CAREFULLY BEFORE USING THIS SOFTWARE**

### Medical Disclaimer

**HearWell is an educational and informational tool only. It is NOT a medical device, medical service, or replacement for professional medical care.**

1. **Not Medical Advice:** This software does not provide medical diagnosis, treatment, or professional audiological services. The tools provided are for educational and informational purposes only.

2. **Not FDA Approved:** This software is not approved, cleared, or regulated by the U.S. Food and Drug Administration (FDA) or any other medical device regulatory authority. It is not intended for diagnostic or therapeutic purposes.

3. **Consult Healthcare Professionals:** Always consult qualified healthcare providers, audiologists, or otolaryngologists for:
   - Professional hearing assessments
   - Medical diagnosis of hearing conditions
   - Treatment recommendations
   - Tinnitus management strategies
   - Any concerns about your hearing health

4. **No Warranty:** The software is provided "AS IS" without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement.

### Limitation of Liability

**BY USING THIS SOFTWARE, YOU AGREE TO THE FOLLOWING:**

1. **No Liability:** The developers, contributors, and maintainers of HearWell (collectively, "the Software Providers") shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use this software.

2. **No Medical Liability:** The Software Providers assume no responsibility or liability for:
   - Any medical decisions made based on information from this software
   - Any health outcomes related to use of this software
   - Any misdiagnosis or failure to seek professional medical care
   - Any adverse effects from using the audio tools
   - Any hearing damage that may occur from improper use

3. **User Responsibility:** You acknowledge that:
   - You are solely responsible for your use of this software
   - You will use the software at your own risk
   - You will not hold the Software Providers liable for any consequences of your use
   - You will seek professional medical advice for any hearing-related concerns

4. **Indemnification:** You agree to indemnify, defend, and hold harmless the Software Providers from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:
   - Your use of the software
   - Your violation of this disclaimer
   - Your violation of any applicable laws or regulations
   - Any medical decisions or actions you take based on information from this software

5. **No Guarantees:** The Software Providers make no representations or warranties regarding:
   - The accuracy of any hearing assessments
   - The effectiveness of any tinnitus management tools
   - The safety of prolonged use
   - The compatibility with your specific hearing condition

### Audio Safety Warning

**IMPORTANT:** Always use headphones or earbuds at safe volume levels. Prolonged exposure to loud sounds can cause permanent hearing damage. If you experience any discomfort, pain, or changes in your hearing, stop using the software immediately and consult a healthcare professional.

### Jurisdiction

This disclaimer shall be governed by and construed in accordance with applicable laws. If any provision of this disclaimer is found to be unenforceable, the remaining provisions shall remain in full force and effect.

### Acceptance

**By accessing, downloading, installing, or using HearWell, you acknowledge that you have read, understood, and agree to be bound by this disclaimer and all applicable laws and regulations. If you do not agree with any part of this disclaimer, you must not use this software.**

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- Audio processing using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- Charts powered by [Recharts](https://recharts.org/)

---

## 📧 Support

For technical issues, feature requests, or contributions, please open an issue on [GitHub](https://github.com/rebelias/Hearwell/issues).

**For medical or hearing health questions, please consult a qualified healthcare professional.**

---

**Last Updated:** November 12, 2025  
**Version:** 1.1.0

## 🧪 Testing

HearWell includes comprehensive testing infrastructure:

- **Unit Tests:** Vitest with React Testing Library (70%+ coverage target for audio hooks)
- **E2E Tests:** Playwright for end-to-end testing across all 5 tools
- **Code Quality:** ESLint + Prettier with pre-commit hooks
- **CI/CD:** Automated testing via GitHub Actions, Cloudflare Pages deployment
- **Error Handling:** React Error Boundaries with client-side error logging (no data transmission)
- **Security:** Content Security Policy (CSP) headers and Helmet middleware

Run `npm run test` for unit tests and `npm run test:e2e` for E2E tests.

## 🎨 User Interface Features

- **Disclaimer Modal:** Medical and legal disclaimer shown on first visit, ensuring users understand the tool's limitations (fully translated)
- **Footer:** Simplified footer with copyright and translated disclaimer link
- **About Page:** Information about the project creator and mission
- **Learn Page:** Comprehensive educational content about hearing health and tinnitus (fully translated)
- **Language Switcher:** Easy access to change interface language in navigation bar
- **AudioContext Management:** Automatic AudioContext resume on user interaction for reliable audio playback across all browsers
- **Responsive Design:** Optimized for 5K resolution screens with full-view test panels while maintaining mobile device compatibility
