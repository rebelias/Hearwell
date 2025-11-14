import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

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
  const getLowestTestedVolume = (freq: number): number | null => {
    for (const vol of volumes) {
      const key = `${freq}-${vol}`;
      if (testResults[key] === 'tested') {
        return vol;
      }
    }
    return null;
  };

  const categorizeHearing = (threshold: number | null): string => {
    if (threshold === null) return 'Not tested';
    if (threshold <= 25) return 'Normal';
    if (threshold <= 40) return 'Mild';
    if (threshold <= 55) return 'Moderate';
    if (threshold <= 70) return 'Moderate-Severe';
    if (threshold <= 90) return 'Severe';
    return 'Profound';
  };

  const getOverallAssessment = (): {
    category: string;
    severity: 'normal' | 'caution' | 'warning';
  } => {
    const thresholds = frequencies
      .map(getLowestTestedVolume)
      .filter(t => t !== null) as number[];

    if (thresholds.length === 0) {
      return { category: 'No test results', severity: 'normal' };
    }

    const avgThreshold =
      thresholds.reduce((a, b) => a + b, 0) / thresholds.length;
    const maxThreshold = Math.max(...thresholds);

    if (maxThreshold > 55) {
      return { category: categorizeHearing(avgThreshold), severity: 'warning' };
    } else if (maxThreshold > 25) {
      return { category: categorizeHearing(avgThreshold), severity: 'caution' };
    }
    return { category: 'Normal hearing range', severity: 'normal' };
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
      insights.push(
        'High-frequency hearing loss detected (common with age and noise exposure)'
      );
    }

    if (
      lowFreqAvg.length > 0 &&
      lowFreqAvg.reduce((a, b) => a + b, 0) / lowFreqAvg.length > 40
    ) {
      insights.push(
        'Low-frequency hearing loss detected (less common, may indicate specific conditions)'
      );
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
        insights.push(
          'Relatively flat hearing profile across tested frequencies'
        );
      } else {
        insights.push(
          'Significant variation across frequencies - consider full audiological evaluation'
        );
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
            Audiogram Interpretation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Complete your hearing test to see personalized interpretation and
            guidance.
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
        <AlertTitle>Overall Assessment: {assessment.category}</AlertTitle>
        <AlertDescription className="text-sm">
          {assessment.severity === 'normal' &&
            'Your hearing appears to be in the normal range. Continue monitoring and protect your hearing from loud noise exposure.'}
          {assessment.severity === 'caution' &&
            'Mild hearing changes detected. Consider consulting an audiologist for a comprehensive evaluation.'}
          {assessment.severity === 'warning' &&
            'Significant hearing loss detected. We strongly recommend scheduling an appointment with an audiologist or ENT specialist for professional evaluation and treatment options.'}
        </AlertDescription>
      </Alert>

      {insights.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">
              Frequency-Specific Insights
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
          <CardTitle className="text-base">Hearing Loss Categories</CardTitle>
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
            Individual Frequency Results
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
                      Not tested
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
          <strong>Important:</strong> This online tool is for screening purposes
          only and cannot replace professional audiological testing. Results may
          be affected by background noise, headphone quality, and calibration.
          For medical diagnosis or hearing aid fitting, please consult a
          licensed audiologist.
        </AlertDescription>
      </Alert>
    </div>
  );
}
