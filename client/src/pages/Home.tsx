import { Link } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Volume2, Waves, Filter, Radio } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';

export default function Home() {
  const { t } = useTranslation(['home', 'common']);
  const tools = [
    {
      title: t('home:frequencyFinder.title'),
      description: t('home:frequencyFinder.description'),
      icon: Activity,
      path: '/frequency-finder',
      color: 'text-primary',
    },
    {
      title: t('home:audiometer.title'),
      description: t('home:audiometer.description'),
      icon: Volume2,
      path: '/audiometer',
      color: 'text-secondary',
    },
    {
      title: t('home:tonalMasker.title'),
      description: t('home:tonalMasker.description'),
      icon: Radio,
      path: '/tonal-masker',
      color: 'text-chart-2',
    },
    {
      title: t('home:noiseGenerator.title'),
      description: t('home:noiseGenerator.description'),
      icon: Waves,
      path: '/noise-generator',
      color: 'text-chart-1',
    },
    {
      title: t('home:notchedNoise.title'),
      description: t('home:notchedNoise.description'),
      icon: Filter,
      path: '/notched-noise',
      color: 'text-chart-5',
    },
  ];

  return (
    <>
      <SEO pageName="home" path="/" />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 px-2">
              {t('home:title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
              {t('home:subtitle')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/frequency-finder">
                <Button
                  size="lg"
                  className="gap-2"
                  data-testid="button-get-started"
                >
                  <Activity className="h-5 w-5" />
                  {t('home:getStarted')}
                </Button>
              </Link>
              <Link href="/learn">
                <Button
                  size="lg"
                  variant="outline"
                  data-testid="button-learn-more"
                  className="w-full sm:w-auto"
                >
                  {t('home:learnMore')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(tool => (
              <Card key={tool.path} className="hover-elevate transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-3 bg-muted rounded-lg ${tool.color}`}>
                      <tool.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="font-display">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={tool.path}>
                    <Button
                      className="w-full"
                      data-testid={`button-start-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {t('tools:startTool', { ns: 'tools' })}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Disclaimer */}
          <Card className="mt-16 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                {t('home:medicalDisclaimer')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{t('home:disclaimerText')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
