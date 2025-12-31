import { useTranslation } from 'react-i18next';
import { Github } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

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

            {/* GitHub Project Link */}
            <div className="bg-dark-card border border-white/10 rounded-lg p-6 mt-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Github className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t('about:openSource')}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('about:openSourceDesc')}
                  </p>
                  <Button asChild variant="outline" className="gap-2">
                    <a
                      href="https://github.com/rebelias/Hearwell"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4" />
                      {t('about:viewOnGitHub')}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
}
