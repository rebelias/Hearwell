import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';

export default function Learn() {
  const { t } = useTranslation(['learn', 'common']);

  return (
    <>
      <SEO pageName="learn" path="/learn" />
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
          {t('learn:title')}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
          {t('learn:subtitle')}
        </p>

        {/* Urgent Care Alert */}
        <Alert
          className="mb-6 sm:mb-8 border-destructive/50 bg-destructive/10"
          data-testid="alert-urgent"
        >
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="text-sm sm:text-base">
            <strong className="block mb-2">{t('learn:urgentCare')}</strong>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>{t('learn:urgentItem1')}</strong>
              </li>
              <li>
                <strong>{t('learn:urgentItem2')}</strong>
              </li>
              <li>
                <strong>{t('learn:urgentItem3')}</strong>
              </li>
              <li>
                <strong>{t('learn:urgentItem4')}</strong>
              </li>
            </ul>
            <p className="mt-2 text-xs">{t('learn:urgentNote')}</p>
          </AlertDescription>
        </Alert>

        {/* Quick Links */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              {t('learn:quickLinks')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <a
              href="https://www.nidcd.nih.gov/health/tinnitus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
              data-testid="link-nidcd"
            >
              <ExternalLink className="h-4 w-4" />
              {t('learn:linkNidcd')}
            </a>
            <a
              href="https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/tinnitus/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
              data-testid="link-aaohns"
            >
              <ExternalLink className="h-4 w-4" />
              {t('learn:linkAaohns')}
            </a>
            <a
              href="https://www.nice.org.uk/guidance/ng98"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
              data-testid="link-nice"
            >
              <ExternalLink className="h-4 w-4" />
              {t('learn:linkNice')}
            </a>
            <a
              href="https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/sudden-hearing-loss-update/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
              data-testid="link-sudden"
            >
              <ExternalLink className="h-4 w-4" />
              {t('learn:linkSudden')}
            </a>
            <a
              href="https://www.ncbi.nlm.nih.gov/books/NBK557713/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
              data-testid="link-hyperacusis"
            >
              <ExternalLink className="h-4 w-4" />
              {t('learn:linkHyperacusis')}
            </a>
            <a
              href="https://jnis.bmj.com/content/17/9/916"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
              data-testid="link-pulsatile"
            >
              <ExternalLink className="h-4 w-4" />
              {t('learn:linkPulsatile')}
            </a>
          </CardContent>
        </Card>

        {/* Symptom Table */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              {t('learn:symptomTable')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-semibold">
                      {t('learn:symptom')}
                    </th>
                    <th className="text-left p-2 font-semibold">
                      {t('learn:commonCauses')}
                    </th>
                    <th className="text-left p-2 font-semibold">
                      {t('learn:firstSteps')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-2 align-top">
                      <strong>{t('learn:symptom1')}</strong>
                    </td>
                    <td className="p-2 align-top text-muted-foreground">
                      {t('learn:cause1')}
                    </td>
                    <td className="p-2 align-top text-muted-foreground">
                      {t('learn:steps1')}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 align-top">
                      <strong>{t('learn:symptom2')}</strong>
                    </td>
                    <td className="p-2 align-top text-muted-foreground">
                      {t('learn:cause2')}
                    </td>
                    <td className="p-2 align-top text-muted-foreground">
                      {t('learn:steps2')}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 align-top">
                      <strong>{t('learn:symptom3')}</strong>
                    </td>
                    <td className="p-2 align-top text-muted-foreground">
                      {t('learn:cause3')}
                    </td>
                    <td className="p-2 align-top text-muted-foreground">
                      {t('learn:steps3')}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 align-top">
                      <strong>{t('learn:symptom4')}</strong>
                    </td>
                    <td className="p-2 align-top text-muted-foreground">
                      {t('learn:cause4')}
                    </td>
                    <td className="p-2 align-top text-muted-foreground">
                      {t('learn:steps4')}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 align-top">
                      <strong>{t('learn:symptom5')}</strong>
                    </td>
                    <td className="p-2 align-top text-muted-foreground">
                      {t('learn:cause5')}
                    </td>
                    <td className="p-2 align-top text-muted-foreground">
                      {t('learn:steps5')}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 align-top">
                      <strong>{t('learn:symptom6')}</strong>
                    </td>
                    <td className="p-2 align-top text-muted-foreground">
                      {t('learn:cause6')}
                    </td>
                    <td className="p-2 align-top text-destructive font-semibold">
                      {t('learn:steps6')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Conditions Library */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          {t('learn:conditionLibrary')}
        </h2>

        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          <ConditionCard
            title={t('learn:conditionTinnitusTitle')}
            description={t('learn:conditionTinnitusDesc')}
            links={[
              {
                text: t('learn:conditionTinnitusLink1'),
                url: 'https://www.nidcd.nih.gov/health/tinnitus',
              },
              {
                text: t('learn:conditionTinnitusLink2'),
                url: 'https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/tinnitus/',
              },
            ]}
          />

          <ConditionCard
            title={t('learn:conditionPulsatileTitle')}
            description={t('learn:conditionPulsatileDesc')}
            links={[
              {
                text: t('learn:conditionPulsatileLink1'),
                url: 'https://jnis.bmj.com/content/17/9/916',
              },
            ]}
          />

          <ConditionCard
            title={t('learn:conditionHyperacusisTitle')}
            description={t('learn:conditionHyperacusisDesc')}
            links={[
              {
                text: t('learn:conditionHyperacusisLink1'),
                url: 'https://www.ncbi.nlm.nih.gov/books/NBK557713/',
              },
            ]}
          />

          <ConditionCard
            title={t('learn:conditionMenieresTitle')}
            description={t('learn:conditionMenieresDesc')}
          />

          <ConditionCard
            title={t('learn:conditionSsnhlTitle')}
            description={t('learn:conditionSsnhlDesc')}
            links={[
              {
                text: t('learn:conditionSsnhlLink1'),
                url: 'https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/sudden-hearing-loss-update/',
              },
            ]}
            urgent
          />

          <ConditionCard
            title={t('learn:conditionNihlTitle')}
            description={t('learn:conditionNihlDesc')}
          />

          <ConditionCard
            title={t('learn:conditionPresbycusisTitle')}
            description={t('learn:conditionPresbycusisDesc')}
          />

          <ConditionCard
            title={t('learn:conditionEtdTitle')}
            description={t('learn:conditionEtdDesc')}
          />

          <ConditionCard
            title={t('learn:conditionOtotoxicTitle')}
            description={t('learn:conditionOtotoxicDesc')}
            links={[
              {
                text: t('learn:conditionOtotoxicLink1'),
                url: 'https://rnid.org.uk/information-and-support/hearing-loss/types-of-hearing-loss-and-deafness/ototoxic-drugs-and-hearing-loss/',
              },
              {
                text: t('learn:conditionOtotoxicLink2'),
                url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7328195/',
              },
            ]}
          />
        </div>

        {/* What Actually Helps */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              {t('learn:whatHelps')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">
                {t('learn:whatHelpsTinnitusTitle')}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>{t('learn:whatHelpsTinnitus1')}</li>
                <li>{t('learn:whatHelpsTinnitus2')}</li>
                <li>{t('learn:whatHelpsTinnitus3')}</li>
                <li>{t('learn:whatHelpsTinnitus4')}</li>
                <li>{t('learn:whatHelpsTinnitus5')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t('learn:whatHelpsHyperacusisTitle')}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>{t('learn:whatHelpsHyperacusis1')}</li>
                <li>{t('learn:whatHelpsHyperacusis2')}</li>
                <li>{t('learn:whatHelpsHyperacusis3')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t('learn:whatHelpsPulsatileTitle')}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>{t('learn:whatHelpsPulsatile1')}</li>
                <li>{t('learn:whatHelpsPulsatile2')}</li>
                <li>{t('learn:whatHelpsPulsatile3')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Practical Daily Tactics */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              {t('learn:dailyTactics')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>{t('learn:dailyTactics1')}</li>
              <li>{t('learn:dailyTactics2')}</li>
              <li>{t('learn:dailyTactics3')}</li>
              <li>{t('learn:dailyTactics4')}</li>
              <li>{t('learn:dailyTactics5')}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Glossary */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              {t('learn:glossary')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>{t('learn:glossaryAudiogram')}</div>
            <div>{t('learn:glossaryCbt')}</div>
            <div>{t('learn:glossaryEtd')}</div>
            <div>{t('learn:glossaryHyperacusis')}</div>
            <div>{t('learn:glossaryNihl')}</div>
            <div>{t('learn:glossaryPulsatile')}</div>
            <div>{t('learn:glossarySsnhl')}</div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="bg-muted/50">
          <AlertDescription className="text-xs sm:text-sm">
            <strong>{t('learn:disclaimer')}</strong>
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
}

interface ConditionCardProps {
  title: string;
  description: string;
  links?: { text: string; url: string }[];
  urgent?: boolean;
}

function ConditionCard({
  title,
  description,
  links,
  urgent,
}: ConditionCardProps) {
  return (
    <Card className={urgent ? 'border-destructive/50' : ''}>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          {urgent && <AlertTriangle className="h-4 w-4 text-destructive" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{description}</p>
        {links && links.length > 0 && (
          <div className="space-y-1">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-primary hover:underline"
                data-testid={`link-${title.toLowerCase().replace(/\s+/g, '-')}-${idx}`}
              >
                <ExternalLink className="h-3 w-3" />
                {link.text}
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
