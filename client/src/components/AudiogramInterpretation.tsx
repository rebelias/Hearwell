import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AudiogramInterpretationProps {
  testResults: Record<string, string>;
  frequencies: number[];
  volumes: number[];
}

type HearingCategory = {
  name: string;
  range: string;
  color: string;
  description: string;
};

const hearingCategories: HearingCategory[] = [
  {
    name: 'Normal',
    range: '0-25 dB',
    color: 'bg-green-500',
    description: 'No hearing loss detected',
  },
  {
    name: 'Mild',
    range: '26-40 dB',
    color: 'bg-yellow-500',
    description: 'Difficulty with soft sounds',
  },
  {
    name: 'Moderate',
    range: '41-55 dB',
    color: 'bg-orange-500',
    description: 'Difficulty with normal conversation',
  },
  {
    name: 'Moderate-Severe',
    range: '56-70 dB',
    color: 'bg-orange-600',
    description: 'Significant hearing challenges',
  },
  {
    name: 'Severe',
    range: '71-90 dB',
    color: 'bg-red-500',
    description: 'Only loud sounds audible',
  },
  {
    name: 'Profound',
    range: '91+ dB',
    color: 'bg-red-700',
    description: 'Very limited hearing',
  },
];

export default function AudiogramInterpretation({
  testResults,
  frequencies,
  volumes,
}: AudiogramInterpretationProps) {
  const { t } = useTranslation(['audiometer', 'common']);

  const getLowestTestedVolume = (freq: number): number | null => {
    for (const vol of volumes) {
      const key = `${freq}-${vol}`;
      if (testResults[key] === 'heard') {
        return vol;
      }
    }
    return null;
  };

  const categorizeHearing = (threshold: number | null): string => {
    if (threshold === null) return t('audiometer:interp.notTested');
    if (threshold <= 25) return t('audiometer:interp.normal');
    if (threshold <= 40) return t('audiometer:interp.mild');
    if (threshold <= 55) return t('audiometer:interp.moderate');
    if (threshold <= 70) return t('audiometer:interp.moderateSevere');
    if (threshold <= 90) return t('audiometer:interp.severe');
    return t('audiometer:interp.profound');
  };

  const getOverallAssessment = (): {
    category: string;
    severity: 'normal' | 'caution' | 'warning';
  } => {
    const thresholds = frequencies
      .map(getLowestTestedVolume)
      .filter(t => t !== null) as number[];

    if (thresholds.length === 0) {
      return { category: t('audiometer:interp.noResults'), severity: 'normal' };
    }

    const avgThreshold =
      thresholds.reduce((a, b) => a + b, 0) / thresholds.length;
    const maxThreshold = Math.max(...thresholds);

    if (maxThreshold > 55) {
      return { category: categorizeHearing(avgThreshold), severity: 'warning' };
    } else if (maxThreshold > 25) {
      return { category: categorizeHearing(avgThreshold), severity: 'caution' };
    }
    return { category: t('audiometer:interp.normalRange'), severity: 'normal' };
  };

  const getFrequencySpecificInsights = (): string[] => {
    const insights: string[] = [];
    const lowFreqAvg = [250, 500]
      .map(getLowestTestedVolume)
      .filter(t => t !== null) as number[];
    const highFreqAvg = [4000, 8000]
      .map(getLowestTestedVolume)
      .filter(t => t !== null) as number[];

    if (
      highFreqAvg.length > 0 &&
      highFreqAvg.reduce((a, b) => a + b, 0) / highFreqAvg.length > 40
    ) {
      insights.push(t('audiometer:interp.highFreqLoss'));
    }

    if (
      lowFreqAvg.length > 0 &&
      lowFreqAvg.reduce((a, b) => a + b, 0) / lowFreqAvg.length > 40
    ) {
      insights.push(t('audiometer:interp.lowFreqLoss'));
    }

    const allThresholds = frequencies
      .map(getLowestTestedVolume)
      .filter(t => t !== null) as number[];
    if (allThresholds.length >= 3) {
      const variance =
        allThresholds.reduce((acc, val, _, arr) => {
          const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
          return acc + Math.pow(val - mean, 2);
        }, 0) / allThresholds.length;

      if (variance < 100) {
        insights.push(t('audiometer:interp.flatProfile'));
      } else {
        insights.push(t('audiometer:interp.variableProfile'));
      }
    }

    return insights;
  };

  const assessment = getOverallAssessment();
  const insights = getFrequencySpecificInsights();
  const testedCount = frequencies.filter(
    f => getLowestTestedVolume(f) !== null
  ).length;

  if (testedCount === 0) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t('audiometer:interp.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('audiometer:interp.completeTest')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Alert
        variant={
          assessment.severity === 'warning'
            ? 'destructive'
            : assessment.severity === 'caution'
              ? 'default'
              : 'default'
        }
      >
        {assessment.severity === 'normal' && (
          <CheckCircle2 className="h-4 w-4" />
        )}
        {assessment.severity === 'caution' && <Info className="h-4 w-4" />}
        {assessment.severity === 'warning' && (
          <AlertTriangle className="h-4 w-4" />
        )}
        <AlertTitle>
          {t('audiometer:interp.overallAssessment')}: {assessment.category}
        </AlertTitle>
        <AlertDescription className="text-sm">
          {assessment.severity === 'normal' &&
            t('audiometer:interp.normalMessage')}
          {assessment.severity === 'caution' &&
            t('audiometer:interp.cautionMessage')}
          {assessment.severity === 'warning' &&
            t('audiometer:interp.warningMessage')}
        </AlertDescription>
      </Alert>

      {insights.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">
              {t('audiometer:interp.frequencyInsights')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">
            {t('audiometer:interp.hearingCategories')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {hearingCategories.map(category => (
              <div key={category.name} className="flex items-center gap-3">
                <div className={`h-4 w-4 rounded ${category.color}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{category.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {category.range}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">
            {t('audiometer:interp.individualResults')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {frequencies.map(freq => {
              const threshold = getLowestTestedVolume(freq);
              const category = categorizeHearing(threshold);
              return (
                <div key={freq} className="text-center space-y-1">
                  <div className="text-sm font-medium">{freq} Hz</div>
                  {threshold !== null ? (
                    <>
                      <div className="text-lg font-bold text-primary">
                        {threshold} dB
                      </div>
                      <Badge
                        variant={
                          category === 'Normal' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {category}
                      </Badge>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {t('audiometer:interp.notTested')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>{t('audiometer:interp.important')}:</strong>{' '}
          {t('audiometer:interp.disclaimer')}
        </AlertDescription>
      </Alert>
    </div>
  );
}
