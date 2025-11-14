import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  pageName:
    | 'home'
    | 'audiometer'
    | 'frequencyFinder'
    | 'tonalMasker'
    | 'noiseGenerator'
    | 'notchedNoise'
    | 'learn'
    | 'about'
    | 'disclaimer';
  path: string;
  structuredData?: object;
}

// Language to locale mapping for Open Graph
const languageToLocale: Record<string, string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  pt: 'pt_PT',
  tr: 'tr_TR',
  zh: 'zh_CN',
  hi: 'hi_IN',
  ja: 'ja_JP',
};

export default function SEO({ pageName, path, structuredData }: SEOProps) {
  const { t, i18n } = useTranslation('seo');
  const currentLanguage = i18n.language || 'en';

  const baseUrl = 'https://hearwell.life';
  const defaultOgImage = `${baseUrl}/og-image.png`;
  const defaultTwitterImage = `${baseUrl}/og-image.png`; // Same image for both

  // Get translated SEO content
  const title = t(`${pageName}.title`);
  const description = t(`${pageName}.description`);
  const keywords = t(`${pageName}.keywords`);

  // Construct canonical URL
  const canonical = `${baseUrl}${path}`;

  // Available languages
  const languages = ['en', 'es', 'fr', 'de', 'pt', 'tr', 'zh', 'hi', 'ja'];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Language Alternatives (hreflang) */}
      {languages.map(lang => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${baseUrl}${path}?lang=${lang}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={defaultOgImage} />
      <meta property="og:site_name" content="HearWell" />
      <meta
        property="og:locale"
        content={languageToLocale[currentLanguage] || 'en_US'}
      />

      {/* OG Alternate Locales */}
      {languages
        .filter(lang => lang !== currentLanguage)
        .map(lang => (
          <meta
            key={`og-locale-${lang}`}
            property="og:locale:alternate"
            content={languageToLocale[lang]}
          />
        ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={defaultTwitterImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
