# Security Policy

## 🔒 Our Privacy-First Architecture

HearWell is a **100% client-side application** with:

- ✅ No backend servers
- ✅ No user accounts or authentication
- ✅ No data collection or tracking
- ✅ No third-party analytics

**Your hearing test results never leave your device** unless you choose to export them.

## 🛡️ Security Measures

- All audio processing happens in your browser using Web Audio API
- Optional localStorage only stores:
  - Disclaimer acceptance flag
  - Calibration settings
  - UI preferences (theme, language)
- No cookies except localStorage for preferences
- Content Security Policy (CSP) headers implemented
- No external script execution

## 🐛 Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public issue
2. Use GitHub Security Advisories: [Report a vulnerability](https://github.com/rebelias/Hearwell/security/advisories/new)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We'll acknowledge receipt within 48 hours and provide a timeline for a fix.

## ✅ Supported Versions

| Version | Supported           |
| ------- | ------------------- |
| Latest  | ✅ Yes              |
| < 1.0   | ❌ No (pre-release) |

## 🔐 Best Practices for Users

- Use HearWell with the latest browser version
- Keep your headphones at safe volumes
- Don't share exported test results publicly if they contain personal notes

---

**Thank you for helping keep HearWell safe**
