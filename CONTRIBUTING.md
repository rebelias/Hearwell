# Contributing to HearWell

Thank you for your interest in contributing to HearWell! This document provides guidelines for contributing to the project.

## 🎯 Project Mission

HearWell is a free, open-source hearing health toolkit designed to help people with tinnitus and hearing issues. Our mission is to make hearing health tools accessible to everyone, regardless of economic status.

## 🌟 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/rebelias/Hearwell/issues)
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots if applicable

### Suggesting Features

1. Check existing issues for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Potential implementation approach (optional)

### Code Contributions

#### Prerequisites

- Node.js 20+
- Git
- Familiarity with React, TypeScript, Web Audio API

#### Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/Hearwell.git
cd Hearwell

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Development Workflow

1. **Create a branch:**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes:**
   - Follow existing code style
   - Write clear, descriptive commit messages
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes:**

   ```bash
   # Run linter
   npm run lint

   # Fix linting issues
   npm run lint:fix

   # Type check
   npm run type-check

   # Run tests
   npm run test

   # Build to ensure no errors
   npm run build
   ```

4. **Commit your changes:**

   ```bash
   git add .
   git commit -m "feat: add new feature" # or "fix: resolve bug"
   ```

   **Commit message format:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

5. **Push and create Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a PR on GitHub.

## 📋 Code Standards

### TypeScript

- Use strict type checking (no `any` unless absolutely necessary)
- Define interfaces for all component props
- Use type inference where appropriate

### React

- Use functional components with hooks
- Follow React best practices (proper dependency arrays, memoization when needed)
- Avoid `setState` calls in `useEffect` (use initializer functions)

### Code Style

- Use ESLint and Prettier (pre-commit hooks enforce this)
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multi-line objects/arrays

### Naming Conventions

- Components: `PascalCase` (e.g., `AudiogramChart.tsx`)
- Hooks: `camelCase` with `use` prefix (e.g., `useAudioEngine.ts`)
- Utilities: `camelCase` (e.g., `audioUtils.ts`)
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`

### Testing

- Write unit tests for new hooks and utilities
- Test coverage target: 70%+
- Use descriptive test names
- Follow Arrange-Act-Assert pattern

### Internationalization (i18n)

- All user-facing text must be translatable
- Add new keys to ALL language files (`client/src/i18n/locales/*/`)
- Use descriptive key names (e.g., `frequencyFinder.title`)
- Test with multiple languages

### Audio Safety

- Always respect user's volume settings
- Implement proper fade-in/fade-out for audio
- Handle AudioContext state correctly
- Never start audio without user interaction

## 🌐 Translation Contributions

We welcome translations for new languages or improvements to existing ones!

**Supported languages:** EN, ES, FR, DE, PT, TR, ZH, HI, JA

**To add/improve translations:**

1. Navigate to `client/src/i18n/locales/[language-code]/`
2. Edit or create JSON files (e.g., `common.json`, `home.json`, `seo.json`)
3. Ensure natural, meaningful translations (not literal)
4. Test in the application
5. Submit a PR

## 🎨 Design Guidelines

- Follow existing design system (dark theme, purple primary color)
- Use Tailwind CSS utility classes
- Use Shadcn/ui components when possible
- Ensure mobile responsiveness
- Maintain accessibility (WCAG AA minimum)

### Accessibility Requirements

- All interactive elements must be keyboard accessible
- Proper ARIA labels for icons
- Sufficient color contrast (4.5:1 minimum)
- Semantic HTML elements
- Form inputs must have associated labels

## 🚫 What NOT to Contribute

- **No medical advice or claims:** This is an educational tool, not a medical device
- **No user tracking or analytics:** HearWell is 100% private
- **No external dependencies without justification:** Keep the bundle size small
- **No breaking changes without discussion:** Open an issue first
- **No proprietary code or licenses:** MIT only

## 📝 Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style and conventions
- [ ] All tests pass (`npm run test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Type check passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated (if needed)
- [ ] Translations added (if user-facing changes)
- [ ] Commits follow conventional format
- [ ] Branch is up-to-date with `main`

### PR Description

Include:

- Clear description of changes
- Motivation and context
- Screenshots (if UI changes)
- Related issue number (if applicable)

### Review Process

1. Automated CI checks must pass
2. Code review by maintainer
3. Discussion and feedback
4. Approval and merge

## 🔧 Project Structure

```
Hearwell/
├── client/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (routes)
│   │   ├── hooks/           # Custom React hooks (audio engines)
│   │   ├── lib/             # Utility functions
│   │   ├── i18n/            # Internationalization
│   │   │   ├── locales/     # Translation files (9 languages)
│   │   │   └── config.ts    # i18next configuration
│   │   └── App.tsx          # Main application component
│   └── public/              # Static assets
├── .github/workflows/       # CI/CD configuration
└── package.json
```

## 🧪 Testing

### Unit Tests (Vitest)

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# UI mode
npm run test:ui
```

### E2E Tests (Playwright)

```bash
# Install browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Headed mode (see browser)
npm run test:e2e:headed
```

## 🙏 Questions?

- Open a [Discussion](https://github.com/rebelias/Hearwell/discussions) for general questions
- Open an [Issue](https://github.com/rebelias/Hearwell/issues) for bugs or feature requests

## 📄 License

By contributing to HearWell, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making hearing health tools more accessible!** 🎉
