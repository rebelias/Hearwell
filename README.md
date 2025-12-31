# HearWell 🎧

> **Free, open-source hearing health toolkit. No ads, no tracking, no accounts required.**

[![Live Demo](https://img.shields.io/badge/🌐_Live-hearwell.life-blue?style=for-the-badge)](https://hearwell.life)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg?style=flat-square)](https://react.dev/)
[![GitHub issues](https://img.shields.io/github/issues/rebelias/Hearwell?style=flat-square)](https://github.com/rebelias/Hearwell/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/rebelias/Hearwell?style=flat-square)](https://github.com/rebelias/Hearwell/pulls)

## 🌟 Featured On

<!-- This section will be updated as HearWell gets mentioned in various platforms -->

- 🚀 Product Hunt - Coming soon!
- 🔥 Hacker News - Coming soon!
- 📰 Dev.to - Coming soon!

---

## 🌟 Why HearWell?

I've been living with chronic tinnitus for 8 years. During this time, I've discovered that the tools needed to manage tinnitus and monitor hearing health are either:

- Locked behind expensive paywalls ($50-200 per app)
- Require creating accounts and sharing personal data
- Not accessible in multiple languages
- Lack proper scientific backing

**HearWell exists to fix this.** It's completely free, runs entirely in your browser, and respects your privacy. No data collection, no accounts, no barriers—just tools that help.

---

## ✨ Features

### 🎵 **Online Audiometer**

Professional-grade hearing test with real-time audiogram visualization. Test frequencies from 250Hz to 10kHz across 12 volume levels. Export comprehensive CSV reports for your records or to share with your audiologist.

### 🔍 **Tinnitus Frequency Finder**

Pinpoint the exact frequency of your tinnitus (50Hz - 20kHz) using multiple waveforms. Essential first step for personalized sound therapy.

### 🎼 **Tonal Masker (14 Modes)**

Advanced neuromodulation therapy using:

- **Amplitude Modulation (AM)** - Varying intensity
- **Frequency Modulation (FM)** - Wobbling tones
- **Coordinated Reset (CR)** - Randomized sequences to prevent neural adaptation
- **Background Sounds** - Nature sounds (rain, ocean, birds, cicadas)

### 🌊 **Noise Generators**

- **Colored Noise** - White, pink, brown, violet, blue, grey with 8-band EQ
- **Notched Noise** - Advanced therapy with 10-band EQ and precise frequency control

### 🌍 **9 Languages**

English, Spanish, French, German, Portuguese, Turkish, Chinese, Hindi, Japanese

---

## 🚀 Quick Start

**🌐 Use it online:** [hearwell.life](https://hearwell.life) - No installation needed!

**💻 Run locally:**

```bash
git clone https://github.com/rebelias/Hearwell.git
cd Hearwell
npm install
npm run dev
```

Open `http://localhost:5000` in your browser.

---

## 🔒 Privacy First

- ✅ **100% Client-Side** - All processing happens in your browser
- ✅ **No Data Collection** - Zero tracking, zero analytics
- ✅ **No Accounts / No Backend** - Static site; nothing to sign up for
- ✅ **No Third-Party Scripts** - Your data stays yours (no analytics/ads)
- ✅ **GDPR Compliant** - Privacy by design

Your hearing test results never leave your device unless you choose to export them.

### What data is stored locally?

- **LocalStorage only** (on your device) for:
  - Disclaimer acceptance (`hearwell-disclaimer-accepted`)
  - Calibration settings (`audiometer-calibration`, `audiometer-calibrated`)
  - UI preferences (theme, language, and some tool settings)
  - Optional local error logs for debugging (`hearwell_errors`)

### Third-party requests

- **Google Fonts** are loaded from `fonts.googleapis.com` / `fonts.gstatic.com` for typography. This makes a network request to Google’s CDN (no analytics scripts are used).

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript 5.6 + Vite 5
- **Styling:** Tailwind CSS + Shadcn/ui
- **Audio:** Web Audio API (native browser API)
- **i18n:** react-i18next (9 languages)
- **Testing:** Vitest + Playwright
- **CI/CD:** GitHub Actions + Cloudflare Pages

---

## 🎯 Use Cases

- 🩺 **For Individuals:** Monitor your hearing health, manage tinnitus
- 🏥 **For Clinics:** Free screening tool for resource-limited settings
- 🎓 **For Students:** Learn about audiology and Web Audio API
- 🔬 **For Researchers:** Collect hearing data in studies (with consent)
- 🌍 **For Communities:** Accessible hearing health in any language

---

## 📖 Documentation

- **[Technical Documentation](./Hearwell%20Project.md)** - 1400+ line architecture guide
- **[Design Guidelines](./design_guidelines.md)** - UI/UX specifications
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute

---

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or translating to new languages:

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Ideas for contributions:**

- 🌐 Add translations (more languages needed!)
- 🎨 Improve UI/UX
- 🐛 Fix bugs
- 📚 Improve documentation
- ✨ Add new therapeutic sound modes

---

## 🧪 Testing

```bash
npm run test              # Unit tests
npm run test:coverage     # Coverage report
npm run test:e2e          # End-to-end tests (requires: npx playwright install)
npm run lint              # Linting
```

Target: 80%+ code coverage

---

## 🌐 Browser Support

| Browser     | Status            |
| ----------- | ----------------- |
| Chrome/Edge | ✅ Full support   |
| Firefox     | ✅ Full support   |
| Safari      | ✅ Full support\* |
| Mobile      | ✅ Supported\*    |

\*May require user interaction to start audio (browser security policy)

---

## 📦 Building for Production

```bash
npm run build   # Creates optimized production build
npm start       # Serves production build
```

Deploy to any static hosting (Cloudflare Pages, Vercel, Netlify, GitHub Pages).

---

## ⚠️ Medical Disclaimer

**HearWell is an educational tool, NOT a medical device.**

- ❌ Not a replacement for professional audiological evaluation
- ❌ Not FDA approved or medically certified
- ❌ Not for diagnosis or treatment decisions

**Always consult qualified healthcare professionals for:**

- Professional hearing assessments
- Medical diagnosis
- Treatment recommendations
- Any concerns about your hearing health

**Audio Safety:** Use headphones at safe volumes. Stop immediately if you experience discomfort.

By using HearWell, you agree to use it at your own risk. See full [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built with love by someone who knows what it's like to live with tinnitus.

Special thanks to:

- The open-source community
- Web Audio API contributors
- Everyone who suggested features and reported bugs

---

## 📬 Support

- 🐛 **Bug Reports:** [Open an issue](https://github.com/rebelias/Hearwell/issues)
- 💡 **Feature Requests:** [Start a discussion](https://github.com/rebelias/Hearwell/discussions)
- 💬 **Share Your Experience:** [Leave feedback](https://hearwell.life/feedback)
- 🌟 **Star the repo** if HearWell helps you!
- 💬 **Spread the word** to anyone who might benefit

**For medical questions, please consult a healthcare professional.**

---

## 🏆 Recognition

- ⭐ GitHub Stars: ![GitHub stars](https://img.shields.io/github/stars/rebelias/Hearwell?style=social)
- 🍴 Forks: ![GitHub forks](https://img.shields.io/github/forks/rebelias/Hearwell?style=social)
- 🌍 Available in **9 languages**
- 🎯 **100% privacy-focused** - No tracking, no data collection

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=rebelias/Hearwell&type=Date)](https://star-history.com/#rebelias/Hearwell&Date)

---

## 🔗 Links & Resources

- 🌐 **Live Application:** [hearwell.life](https://hearwell.life)
- 📦 **GitHub Repository:** [github.com/rebelias/Hearwell](https://github.com/rebelias/Hearwell)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/rebelias/Hearwell/discussions)
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/rebelias/Hearwell/issues)
- 🔒 **Security Policy:** [SECURITY.md](https://github.com/rebelias/Hearwell/blob/main/.github/SECURITY.md)
- 🤝 **Contributing Guide:** [CONTRIBUTING.md](https://github.com/rebelias/Hearwell/blob/main/CONTRIBUTING.md)

## 🔍 Keywords & Search Terms

**For SEO and discoverability:**

tinnitus relief tools, online hearing test, free audiometer, tinnitus frequency finder, sound therapy, hearing loss test, notched noise therapy, coordinated reset, tinnitus management, hearing health, web-based audiometer, browser hearing test, tinnitus masking, acoustic neuromodulation, hearing assessment, tinnitus treatment, sound masking, white noise generator, pink noise, brown noise, hearing test app, audiogram online, pure tone audiometry, hearing conservation, tinnitus therapy, open source medical tools

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

**TL;DR:** Free to use, modify, and distribute. Just don't sue us. 😊

---

## 🌱 Roadmap

- [ ] Add more therapeutic sound modes
- [ ] Implement frequency-specific volume testing
- [ ] Add data export options (JSON, PDF)
- [ ] Create mobile apps (React Native)
- [ ] Add more languages (Arabic, Korean, Italian, etc.)
- [ ] Implement sound quality presets
- [ ] Add calibration for different headphone types

Want to help? Pick an item and open a PR!

---

<div align="center">

**Made with ❤️ by someone who lives with tinnitus, for everyone who does.**

[⭐ Star this repo](https://github.com/rebelias/Hearwell) • [🌐 Try it now](https://hearwell.life) • [📣 Share with others](https://twitter.com/intent/tweet?text=Check%20out%20HearWell%20-%20free%20hearing%20health%20tools!&url=https://hearwell.life)

</div>
