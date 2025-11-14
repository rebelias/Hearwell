import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';

export default function Disclaimer() {
  const { t } = useTranslation(['disclaimer', 'common']);

  return (
    <>
      <SEO pageName="disclaimer" path="/disclaimer" />
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 sm:h-10 sm:w-10 text-destructive" />
            {t('disclaimer:title')}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t('disclaimer:readCarefully')}
          </p>
        </div>

        <Alert variant="destructive" className="mb-6 sm:mb-8">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription className="font-semibold">
            {t('disclaimer:notMedicalAdvice')}
          </AlertDescription>
        </Alert>

        {/* Medical Disclaimer Section */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {t('disclaimer:medicalDisclaimer')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base">
            <p className="text-muted-foreground">
              {t('disclaimer:medicalDisclaimerText')}
            </p>

            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:notMedicalAdviceTitle')}
              </h3>
              <p className="text-muted-foreground mb-3">
                {t('disclaimer:notMedicalAdviceText')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:notFdaApproved')}
              </h3>
              <p className="text-muted-foreground mb-3">
                {t('disclaimer:notFdaApprovedText')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:consultHealthcare')}
              </h3>
              <p className="text-muted-foreground mb-2">
                {t('disclaimer:consultHealthcareText')}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                <li>{t('disclaimer:consultItem1')}</li>
                <li>{t('disclaimer:consultItem2')}</li>
                <li>{t('disclaimer:consultItem3')}</li>
                <li>{t('disclaimer:consultItem4')}</li>
                <li>{t('disclaimer:consultItem5')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:accuracyLimitations')}
              </h3>
              <p className="text-muted-foreground">
                {t('disclaimer:accuracyLimitationsText')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:doNotSelfDiagnose')}
              </h3>
              <p className="text-muted-foreground">
                {t('disclaimer:doNotSelfDiagnoseText')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Legal Disclaimer Section */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              {t('disclaimer:legalDisclaimer')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base">
            <Alert variant="destructive" className="mb-4">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                <strong>{t('disclaimer:byUsing')}</strong>
              </AlertDescription>
            </Alert>

            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:noWarranty')}
              </h3>
              <p className="text-muted-foreground mb-3">
                {t('disclaimer:noWarrantyText')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:noLiability')}
              </h3>
              <p className="text-muted-foreground mb-2">
                {t('disclaimer:noLiabilityText')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:noMedicalLiability')}
              </h3>
              <p className="text-muted-foreground mb-2">
                {t('disclaimer:noMedicalLiabilityText')}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                <li>{t('disclaimer:noMedicalLiabilityItem1')}</li>
                <li>{t('disclaimer:noMedicalLiabilityItem2')}</li>
                <li>{t('disclaimer:noMedicalLiabilityItem3')}</li>
                <li>{t('disclaimer:noMedicalLiabilityItem4')}</li>
                <li>{t('disclaimer:noMedicalLiabilityItem5')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:userResponsibility')}
              </h3>
              <p className="text-muted-foreground mb-2">
                {t('disclaimer:userResponsibilityText')}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                <li>{t('disclaimer:userResponsibilityItem1')}</li>
                <li>{t('disclaimer:userResponsibilityItem2')}</li>
                <li>{t('disclaimer:userResponsibilityItem3')}</li>
                <li>{t('disclaimer:userResponsibilityItem4')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:indemnification')}
              </h3>
              <p className="text-muted-foreground">
                {t('disclaimer:indemnificationText')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:noGuarantees')}
              </h3>
              <p className="text-muted-foreground">
                {t('disclaimer:noGuaranteesText')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Audio Safety Warning */}
        <Card className="mb-6 sm:mb-8 border-destructive/50">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-destructive">
              {t('disclaimer:audioSafetyWarning')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base">
            <p className="text-muted-foreground font-semibold mb-2">
              {t('disclaimer:audioSafetyWarningText1')}
            </p>
            <p className="text-muted-foreground">
              {t('disclaimer:audioSafetyWarningText2')}
            </p>
          </CardContent>
        </Card>

        {/* Use at Your Own Risk */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">
              {t('disclaimer:useAtOwnRisk')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base">
            <p className="text-muted-foreground">
              {t('disclaimer:useAtOwnRiskText')}
            </p>
          </CardContent>
        </Card>

        {/* Acceptance */}
        <Alert className="bg-muted/50">
          <AlertDescription className="text-sm sm:text-base">
            <strong>{t('disclaimer:acceptance')}</strong>
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
}
