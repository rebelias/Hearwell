import { useTranslation } from 'react-i18next';
import ToolLayout from '@/components/ToolLayout';
import SEO from '@/components/SEO';

export default function About() {
  const { t } = useTranslation(['about', 'common']);

  return (
    <>
      <SEO pageName="about" path="/about" />
      <ToolLayout
        title={t('about:title')}
        description={t('about:description')}
        leftPanel={
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {t('about:intro')
                .split('\n\n')
                .map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base leading-relaxed text-foreground mb-4"
                  >
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
        }
      />
    </>
  );
}
