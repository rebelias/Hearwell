import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DisclaimerModalProps {
  onAccept?: () => void;
}

export default function DisclaimerModal({ onAccept }: DisclaimerModalProps) {
  const { t } = useTranslation(['disclaimer', 'common']);
  // Initialize from localStorage to avoid setState in useEffect
  const [open, setOpen] = useState(() => {
    const hasAccepted = localStorage.getItem('hearwell-disclaimer-accepted');
    return !hasAccepted;
  });

  const handleAccept = () => {
    localStorage.setItem('hearwell-disclaimer-accepted', 'true');
    setOpen(false);
    // Notify parent that disclaimer was accepted
    if (onAccept) {
      onAccept();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        // Prevent closing without accepting - block all interactions
      }}
      modal={true}
    >
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto z-[9999]"
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
        onInteractOutside={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t('disclaimer:title')}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {t('disclaimer:readCarefully')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-semibold">
              {t('disclaimer:notMedicalAdvice')}
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm">
            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:medicalDisclaimer')}:
              </h3>
              <p className="text-muted-foreground ml-2">
                {t('disclaimer:medicalDisclaimerText')}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground mt-2">
                <li>{t('disclaimer:notMedicalAdviceText')}</li>
                <li>{t('disclaimer:notFdaApprovedText')}</li>
                <li>{t('disclaimer:accuracyLimitationsText')}</li>
                <li>{t('disclaimer:doNotSelfDiagnoseText')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:legalDisclaimer')}:
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                <li>{t('disclaimer:noWarrantyText')}</li>
                <li>{t('disclaimer:noLiabilityText')}</li>
                <li>{t('disclaimer:noMedicalLiabilityText')}</li>
                <li>{t('disclaimer:indemnificationText')}</li>
                <li>{t('disclaimer:acceptance')}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                {t('disclaimer:useAtOwnRisk')}:
              </h3>
              <p className="text-muted-foreground">
                {t('disclaimer:useAtOwnRiskText')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleAccept} className="w-full sm:w-auto" size="lg">
            {t('disclaimer:understandAndAccept')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
