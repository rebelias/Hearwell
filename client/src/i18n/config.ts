import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files - English (base)
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enTools from './locales/en/tools.json';
import enHome from './locales/en/home.json';
import enFrequencyFinder from './locales/en/frequencyFinder.json';
import enNoiseGenerator from './locales/en/noiseGenerator.json';
import enAudiometer from './locales/en/audiometer.json';
import enTonalMasker from './locales/en/tonalMasker.json';
import enNotchedNoise from './locales/en/notchedNoise.json';
import enDisclaimer from './locales/en/disclaimer.json';
import enFooter from './locales/en/footer.json';
import enCalibration from './locales/en/calibration.json';
import enNotFound from './locales/en/notFound.json';
import enLearn from './locales/en/learn.json';
import enAbout from './locales/en/about.json';
import enSeo from './locales/en/seo.json';

// Spanish
import esCommon from './locales/es/common.json';
import esNavigation from './locales/es/navigation.json';
import esTools from './locales/es/tools.json';
import esHome from './locales/es/home.json';
import esFrequencyFinder from './locales/es/frequencyFinder.json';
import esNoiseGenerator from './locales/es/noiseGenerator.json';
import esAudiometer from './locales/es/audiometer.json';
import esTonalMasker from './locales/es/tonalMasker.json';
import esNotchedNoise from './locales/es/notchedNoise.json';
import esDisclaimer from './locales/es/disclaimer.json';
import esFooter from './locales/es/footer.json';
import esCalibration from './locales/es/calibration.json';
import esNotFound from './locales/es/notFound.json';
import esLearn from './locales/es/learn.json';
import esAbout from './locales/es/about.json';
import esSeo from './locales/es/seo.json';

// French
import frCommon from './locales/fr/common.json';
import frNavigation from './locales/fr/navigation.json';
import frTools from './locales/fr/tools.json';
import frHome from './locales/fr/home.json';
import frFrequencyFinder from './locales/fr/frequencyFinder.json';
import frNoiseGenerator from './locales/fr/noiseGenerator.json';
import frAudiometer from './locales/fr/audiometer.json';
import frTonalMasker from './locales/fr/tonalMasker.json';
import frNotchedNoise from './locales/fr/notchedNoise.json';
import frDisclaimer from './locales/fr/disclaimer.json';
import frFooter from './locales/fr/footer.json';
import frCalibration from './locales/fr/calibration.json';
import frNotFound from './locales/fr/notFound.json';
import frLearn from './locales/fr/learn.json';
import frAbout from './locales/fr/about.json';
import frSeo from './locales/fr/seo.json';

// German
import deCommon from './locales/de/common.json';
import deNavigation from './locales/de/navigation.json';
import deTools from './locales/de/tools.json';
import deHome from './locales/de/home.json';
import deFrequencyFinder from './locales/de/frequencyFinder.json';
import deNoiseGenerator from './locales/de/noiseGenerator.json';
import deAudiometer from './locales/de/audiometer.json';
import deTonalMasker from './locales/de/tonalMasker.json';
import deNotchedNoise from './locales/de/notchedNoise.json';
import deDisclaimer from './locales/de/disclaimer.json';
import deFooter from './locales/de/footer.json';
import deCalibration from './locales/de/calibration.json';
import deNotFound from './locales/de/notFound.json';
import deLearn from './locales/de/learn.json';
import deAbout from './locales/de/about.json';
import deSeo from './locales/de/seo.json';

// Portuguese
import ptCommon from './locales/pt/common.json';
import ptNavigation from './locales/pt/navigation.json';
import ptTools from './locales/pt/tools.json';
import ptHome from './locales/pt/home.json';
import ptFrequencyFinder from './locales/pt/frequencyFinder.json';
import ptNoiseGenerator from './locales/pt/noiseGenerator.json';
import ptAudiometer from './locales/pt/audiometer.json';
import ptTonalMasker from './locales/pt/tonalMasker.json';
import ptNotchedNoise from './locales/pt/notchedNoise.json';
import ptDisclaimer from './locales/pt/disclaimer.json';
import ptFooter from './locales/pt/footer.json';
import ptCalibration from './locales/pt/calibration.json';
import ptNotFound from './locales/pt/notFound.json';
import ptLearn from './locales/pt/learn.json';
import ptAbout from './locales/pt/about.json';
import ptSeo from './locales/pt/seo.json';

// Turkish
import trCommon from './locales/tr/common.json';
import trNavigation from './locales/tr/navigation.json';
import trTools from './locales/tr/tools.json';
import trHome from './locales/tr/home.json';
import trFrequencyFinder from './locales/tr/frequencyFinder.json';
import trNoiseGenerator from './locales/tr/noiseGenerator.json';
import trAudiometer from './locales/tr/audiometer.json';
import trTonalMasker from './locales/tr/tonalMasker.json';
import trNotchedNoise from './locales/tr/notchedNoise.json';
import trDisclaimer from './locales/tr/disclaimer.json';
import trFooter from './locales/tr/footer.json';
import trCalibration from './locales/tr/calibration.json';
import trNotFound from './locales/tr/notFound.json';
import trLearn from './locales/tr/learn.json';
import trAbout from './locales/tr/about.json';
import trSeo from './locales/tr/seo.json';

// Chinese
import zhCommon from './locales/zh/common.json';
import zhNavigation from './locales/zh/navigation.json';
import zhTools from './locales/zh/tools.json';
import zhHome from './locales/zh/home.json';
import zhFrequencyFinder from './locales/zh/frequencyFinder.json';
import zhNoiseGenerator from './locales/zh/noiseGenerator.json';
import zhAudiometer from './locales/zh/audiometer.json';
import zhTonalMasker from './locales/zh/tonalMasker.json';
import zhNotchedNoise from './locales/zh/notchedNoise.json';
import zhDisclaimer from './locales/zh/disclaimer.json';
import zhFooter from './locales/zh/footer.json';
import zhCalibration from './locales/zh/calibration.json';
import zhNotFound from './locales/zh/notFound.json';
import zhLearn from './locales/zh/learn.json';
import zhAbout from './locales/zh/about.json';
import zhSeo from './locales/zh/seo.json';

// Hindi
import hiCommon from './locales/hi/common.json';
import hiNavigation from './locales/hi/navigation.json';
import hiTools from './locales/hi/tools.json';
import hiHome from './locales/hi/home.json';
import hiFrequencyFinder from './locales/hi/frequencyFinder.json';
import hiNoiseGenerator from './locales/hi/noiseGenerator.json';
import hiAudiometer from './locales/hi/audiometer.json';
import hiTonalMasker from './locales/hi/tonalMasker.json';
import hiNotchedNoise from './locales/hi/notchedNoise.json';
import hiDisclaimer from './locales/hi/disclaimer.json';
import hiFooter from './locales/hi/footer.json';
import hiCalibration from './locales/hi/calibration.json';
import hiNotFound from './locales/hi/notFound.json';
import hiLearn from './locales/hi/learn.json';
import hiAbout from './locales/hi/about.json';
import hiSeo from './locales/hi/seo.json';

// Japanese
import jaCommon from './locales/ja/common.json';
import jaNavigation from './locales/ja/navigation.json';
import jaTools from './locales/ja/tools.json';
import jaHome from './locales/ja/home.json';
import jaFrequencyFinder from './locales/ja/frequencyFinder.json';
import jaNoiseGenerator from './locales/ja/noiseGenerator.json';
import jaAudiometer from './locales/ja/audiometer.json';
import jaTonalMasker from './locales/ja/tonalMasker.json';
import jaNotchedNoise from './locales/ja/notchedNoise.json';
import jaDisclaimer from './locales/ja/disclaimer.json';
import jaFooter from './locales/ja/footer.json';
import jaCalibration from './locales/ja/calibration.json';
import jaNotFound from './locales/ja/notFound.json';
import jaLearn from './locales/ja/learn.json';
import jaAbout from './locales/ja/about.json';
import jaSeo from './locales/ja/seo.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'hearwell-language',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    resources: {
      en: {
        common: enCommon,
        navigation: enNavigation,
        tools: enTools,
        home: enHome,
        frequencyFinder: enFrequencyFinder,
        noiseGenerator: enNoiseGenerator,
        audiometer: enAudiometer,
        tonalMasker: enTonalMasker,
        notchedNoise: enNotchedNoise,
        disclaimer: enDisclaimer,
        footer: enFooter,
        calibration: enCalibration,
        notFound: enNotFound,
        learn: enLearn,
        about: enAbout,
        seo: enSeo,
      },
      es: {
        common: esCommon,
        navigation: esNavigation,
        tools: esTools,
        home: esHome,
        frequencyFinder: esFrequencyFinder,
        noiseGenerator: esNoiseGenerator,
        audiometer: esAudiometer,
        tonalMasker: esTonalMasker,
        notchedNoise: esNotchedNoise,
        disclaimer: esDisclaimer,
        footer: esFooter,
        calibration: esCalibration,
        notFound: esNotFound,
        learn: esLearn,
        about: esAbout,
        seo: esSeo,
      },
      fr: {
        common: frCommon,
        navigation: frNavigation,
        tools: frTools,
        home: frHome,
        frequencyFinder: frFrequencyFinder,
        noiseGenerator: frNoiseGenerator,
        audiometer: frAudiometer,
        tonalMasker: frTonalMasker,
        notchedNoise: frNotchedNoise,
        disclaimer: frDisclaimer,
        footer: frFooter,
        calibration: frCalibration,
        notFound: frNotFound,
        learn: frLearn,
        about: frAbout,
        seo: frSeo,
      },
      de: {
        common: deCommon,
        navigation: deNavigation,
        tools: deTools,
        home: deHome,
        frequencyFinder: deFrequencyFinder,
        noiseGenerator: deNoiseGenerator,
        audiometer: deAudiometer,
        tonalMasker: deTonalMasker,
        notchedNoise: deNotchedNoise,
        disclaimer: deDisclaimer,
        footer: deFooter,
        calibration: deCalibration,
        notFound: deNotFound,
        learn: deLearn,
        about: deAbout,
        seo: deSeo,
      },
      pt: {
        common: ptCommon,
        navigation: ptNavigation,
        tools: ptTools,
        home: ptHome,
        frequencyFinder: ptFrequencyFinder,
        noiseGenerator: ptNoiseGenerator,
        audiometer: ptAudiometer,
        tonalMasker: ptTonalMasker,
        notchedNoise: ptNotchedNoise,
        disclaimer: ptDisclaimer,
        footer: ptFooter,
        calibration: ptCalibration,
        notFound: ptNotFound,
        learn: ptLearn,
        about: ptAbout,
        seo: ptSeo,
      },
      tr: {
        common: trCommon,
        navigation: trNavigation,
        tools: trTools,
        home: trHome,
        frequencyFinder: trFrequencyFinder,
        noiseGenerator: trNoiseGenerator,
        audiometer: trAudiometer,
        tonalMasker: trTonalMasker,
        notchedNoise: trNotchedNoise,
        disclaimer: trDisclaimer,
        footer: trFooter,
        calibration: trCalibration,
        notFound: trNotFound,
        learn: trLearn,
        about: trAbout,
        seo: trSeo,
      },
      zh: {
        common: zhCommon,
        navigation: zhNavigation,
        tools: zhTools,
        home: zhHome,
        frequencyFinder: zhFrequencyFinder,
        noiseGenerator: zhNoiseGenerator,
        audiometer: zhAudiometer,
        tonalMasker: zhTonalMasker,
        notchedNoise: zhNotchedNoise,
        disclaimer: zhDisclaimer,
        footer: zhFooter,
        calibration: zhCalibration,
        notFound: zhNotFound,
        learn: zhLearn,
        about: zhAbout,
        seo: zhSeo,
      },
      hi: {
        common: hiCommon,
        navigation: hiNavigation,
        tools: hiTools,
        home: hiHome,
        frequencyFinder: hiFrequencyFinder,
        noiseGenerator: hiNoiseGenerator,
        audiometer: hiAudiometer,
        tonalMasker: hiTonalMasker,
        notchedNoise: hiNotchedNoise,
        disclaimer: hiDisclaimer,
        footer: hiFooter,
        calibration: hiCalibration,
        notFound: hiNotFound,
        learn: hiLearn,
        about: hiAbout,
        seo: hiSeo,
      },
      ja: {
        common: jaCommon,
        navigation: jaNavigation,
        tools: jaTools,
        home: jaHome,
        frequencyFinder: jaFrequencyFinder,
        noiseGenerator: jaNoiseGenerator,
        audiometer: jaAudiometer,
        tonalMasker: jaTonalMasker,
        notchedNoise: jaNotchedNoise,
        disclaimer: jaDisclaimer,
        footer: jaFooter,
        calibration: jaCalibration,
        notFound: jaNotFound,
        learn: jaLearn,
        about: jaAbout,
        seo: jaSeo,
      },
    },

    defaultNS: 'common',
    ns: [
      'common',
      'navigation',
      'tools',
      'home',
      'frequencyFinder',
      'noiseGenerator',
      'audiometer',
      'tonalMasker',
      'notchedNoise',
      'disclaimer',
      'footer',
      'calibration',
      'notFound',
      'learn',
      'about',
      'seo',
    ],
  });

export default i18n;
