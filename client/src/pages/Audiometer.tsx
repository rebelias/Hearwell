import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Download, HelpCircle, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAudiometerEngine } from '@/hooks/useAudiometerEngine';
import { useTranslation } from 'react-i18next';
import AudiogramChart from '@/components/AudiogramChart';
import CalibrationModal from '@/components/CalibrationModal';
import AudiogramInterpretation from '@/components/AudiogramInterpretation';
import SEO from '@/components/SEO';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ToolLayout from '@/components/ToolLayout';

type EarSelection = 'both' | 'left' | 'right';
type CellState = 'untested' | 'playing' | 'played' | 'heard' | 'not_heard';
type ToneType = 'pure' | 'warble';

export default function Audiometer() {
  const { t } = useTranslation(['audiometer', 'common']);
  const [earSelection, setEarSelection] = useState<EarSelection>('both');
  const [testResults, setTestResults] = useState<
    Record<EarSelection, Record<string, CellState>>
  >({
    both: {},
    left: {},
    right: {},
  });
  const [toneType, setToneType] = useState<ToneType>('pure');
  const [showCalibration, setShowCalibration] = useState(() => {
    const calibrated = localStorage.getItem('audiometer-calibrated');
    return calibrated === null; // First time user
  });

  const [calibrationOffset, setCalibrationOffset] = useState(() => {
    const savedCalibration = localStorage.getItem('audiometer-calibration');
    return savedCalibration ? parseInt(savedCalibration, 10) / 100 : 1.0;
  });

  const [isCalibrated, setIsCalibrated] = useState(() => {
    return localStorage.getItem('audiometer-calibrated') === 'true';
  });

  const { toast } = useToast();
  const audioEngine = useAudiometerEngine();
  const cancelTokenRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      audioEngine.cleanup();
    };
  }, []);

  const frequencies = [250, 500, 1000, 2000, 4000, 6000, 8000, 10000];
  const volumes = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const [showInstructions, setShowInstructions] = useState(true);

  const handlePlaySound = async (freq: number, vol: number) => {
    const key = `${freq}-${vol}`;
    const currentState = testResults[earSelection][key] || 'untested';

    // Don't play if already playing
    if (currentState === 'playing') return;

    const currentToken = cancelTokenRef.current;
    setTestResults(prev => ({
      ...prev,
      [earSelection]: { ...prev[earSelection], [key]: 'playing' },
    }));
    await audioEngine.playTone(
      freq,
      vol,
      earSelection,
      1000,
      toneType,
      calibrationOffset
    );

    if (cancelTokenRef.current === currentToken) {
      // After playing, mark as 'played' (unless already 'heard')
      const newState = currentState === 'heard' ? 'heard' : 'played';
      setTestResults(prev => ({
        ...prev,
        [earSelection]: { ...prev[earSelection], [key]: newState },
      }));
    }
  };

  const handleMarkHeard = (freq: number, vol: number) => {
    const key = `${freq}-${vol}`;
    const currentState = testResults[earSelection][key] || 'untested';

    // Toggle: if already heard, unmark it (but keep as played)
    if (currentState === 'heard') {
      setTestResults(prev => ({
        ...prev,
        [earSelection]: { ...prev[earSelection], [key]: 'played' },
      }));
      return;
    }

    // Mark as heard
    setTestResults(prev => ({
      ...prev,
      [earSelection]: { ...prev[earSelection], [key]: 'heard' },
    }));

    // Clear quieter volumes that were marked as played but not heard
    const volIndex = volumes.indexOf(vol);
    for (let i = 0; i < volIndex; i++) {
      const lowerVolKey = `${freq}-${volumes[i]}`;
      const lowerState = testResults[earSelection][lowerVolKey];
      // Only clear if it was just 'played' (not 'heard')
      if (lowerState === 'played') {
        setTestResults(prev => {
          const newEarResults = { ...prev[earSelection] };
          delete newEarResults[lowerVolKey];
          return { ...prev, [earSelection]: newEarResults };
        });
      }
    }
  };

  const handleMarkNotHeard = (freq: number, vol: number) => {
    const key = `${freq}-${vol}`;
    const currentState = testResults[earSelection][key] || 'untested';

    // Toggle: if already not_heard, unmark it (but keep as played)
    if (currentState === 'not_heard') {
      setTestResults(prev => ({
        ...prev,
        [earSelection]: { ...prev[earSelection], [key]: 'played' },
      }));
      return;
    }

    // Mark as not heard
    setTestResults(prev => ({
      ...prev,
      [earSelection]: { ...prev[earSelection], [key]: 'not_heard' },
    }));
  };

  const handleCalibrationComplete = (calibrationValue: number) => {
    setCalibrationOffset(calibrationValue);
    setIsCalibrated(true);
    setShowCalibration(false);
    toast({
      title: t('audiometer:calibrationComplete'),
      description: t('audiometer:calibrationCompleteDesc'),
    });
  };

  const handleRecalibrate = () => {
    setShowCalibration(true);
  };

  const clearResults = () => {
    cancelTokenRef.current++;
    audioEngine.stop();
    setTestResults(prev => ({
      ...prev,
      [earSelection]: {},
    }));
    toast({
      title: t('audiometer:resultsCleared'),
      description: t('audiometer:resultsClearedDesc'),
    });
  };

  const handleDownload = () => {
    // Validate that test is complete
    if (!isTestComplete()) {
      toast({
        title: t('audiometer:testIncomplete'),
        description: t('audiometer:testIncompleteDesc', {
          total: frequencies.length,
          completed: progress.completed,
        }),
        variant: 'destructive',
      });
      return;
    }
    const getLowestHeardVolume = (freq: number): number | null => {
      const earResults = testResults[earSelection];
      for (const vol of volumes) {
        const key = `${freq}-${vol}`;
        if (earResults[key] === 'heard') {
          return vol;
        }
      }
      return null;
    };

    const wasTested = (freq: number): boolean => {
      const earResults = testResults[earSelection];
      return volumes.some(vol => {
        const key = `${freq}-${vol}`;
        const state = earResults[key];
        return state === 'heard' || state === 'not_heard' || state === 'played';
      });
    };

    const wasNotHeard = (freq: number): boolean => {
      const earResults = testResults[earSelection];
      // Check if user marked any volume as "not heard" and didn't mark any as "heard"
      const hasNotHeard = volumes.some(vol => {
        const key = `${freq}-${vol}`;
        return earResults[key] === 'not_heard';
      });
      const hasHeard = volumes.some(vol => {
        const key = `${freq}-${vol}`;
        return earResults[key] === 'heard';
      });
      return hasNotHeard && !hasHeard;
    };

    // Get calibration info
    const calibrationVolume = localStorage.getItem('audiometer-calibration');
    const isCalibrated =
      localStorage.getItem('audiometer-calibrated') === 'true';

    // Format date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Format ear selection
    const earLabel =
      earSelection === 'both'
        ? 'Both Ears'
        : earSelection === 'left'
          ? 'Left Ear'
          : 'Right Ear';

    // Build comprehensive CSV report with better formatting
    let csvContent = '';

    // Add BOM for UTF-8 to ensure proper Excel display
    csvContent += '\ufeff';

    // Header Section with visual separation
    csvContent +=
      '═══════════════════════════════════════════════════════════════\n';
    csvContent += '                    HEARWELL AUDIOGRAM TEST RESULTS\n';
    csvContent +=
      '═══════════════════════════════════════════════════════════════\n';
    csvContent += '\n';

    // Test Information Section
    csvContent +=
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    csvContent += 'TEST INFORMATION\n';
    csvContent +=
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    csvContent += `Date:,"${dateStr}"\n`;
    csvContent += `Time:,"${timeStr}"\n`;
    csvContent += `Ear Tested:,"${earLabel}"\n`;
    csvContent += `Tone Type:,"${toneType === 'pure' ? 'Pure Tone' : 'Warble Tone'}"\n`;
    csvContent += `Calibration:,"${isCalibrated ? `Yes (Volume: ${calibrationVolume}%)` : 'No'}"\n`;
    csvContent += '\n';
    csvContent += '\n';

    // Results Summary Section
    const heardCount = frequencies.filter(
      freq => getLowestHeardVolume(freq) !== null
    ).length;
    const notHeardCount = frequencies.filter(freq => wasNotHeard(freq)).length;
    const testedCount = frequencies.filter(freq => wasTested(freq)).length;

    csvContent +=
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    csvContent += 'TEST SUMMARY\n';
    csvContent +=
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    csvContent += `Total Frequencies Tested:,"${testedCount} of ${frequencies.length}"\n`;
    csvContent += `Frequencies with Hearing Threshold:,"${heardCount}"\n`;
    csvContent += `Frequencies Not Heard:,"${notHeardCount}"\n`;
    csvContent += `Frequencies Not Tested:,"${frequencies.length - testedCount}"\n`;
    csvContent += '\n';
    csvContent += '\n';

    // Detailed Results Table - Show ALL frequencies with clear status
    csvContent +=
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    csvContent += 'DETAILED RESULTS - ALL FREQUENCIES\n';
    csvContent +=
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    csvContent += '\n';
    csvContent +=
      '"Frequency (Hz)","Hearing Threshold (dB)","Status","Notes"\n';

    frequencies.forEach(freq => {
      const threshold = getLowestHeardVolume(freq);
      let status = '';
      let notes = '';

      if (threshold !== null) {
        status = 'HEARD';
        notes = `Sound was heard at ${threshold} dB or quieter`;
      } else if (wasNotHeard(freq)) {
        status = 'NOT HEARD';
        notes = 'Sound was not heard at any tested volume level';
      } else {
        status = 'NOT TESTED';
        notes = 'This frequency was not tested';
      }

      const thresholdStr = threshold !== null ? threshold.toString() : 'N/A';
      csvContent += `"${freq}","${thresholdStr}","${status}","${notes}"\n`;
    });

    csvContent += '\n';
    csvContent += '\n';

    // Notes Section - use single quotes to prevent Excel formula interpretation
    csvContent +=
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    csvContent += 'UNDERSTANDING YOUR RESULTS\n';
    csvContent +=
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    csvContent += '\n';
    csvContent +=
      ',"Hearing Threshold is the quietest volume (in dB) where you could hear the tone."\n';
    csvContent +=
      ',"Lower dB values indicate better hearing at that frequency."\n';
    csvContent += '\n';
    csvContent += ',"Interpretation Guide:"\n';
    csvContent += ',"- 0 to 20 dB: Normal hearing"\n';
    csvContent += ',"- 21 to 40 dB: Mild hearing loss"\n';
    csvContent += ',"- 41 to 60 dB: Moderate hearing loss"\n';
    csvContent += ',"- 61 to 80 dB: Severe hearing loss"\n';
    csvContent += ',"- 81+ dB: Profound hearing loss"\n';
    csvContent += '\n';
    csvContent += '\n';

    // Prominent Disclaimer Section - properly quoted to prevent Excel formula errors
    csvContent +=
      '═══════════════════════════════════════════════════════════════\n';
    csvContent += '                    IMPORTANT MEDICAL DISCLAIMER\n';
    csvContent +=
      '═══════════════════════════════════════════════════════════════\n';
    csvContent += '\n';
    csvContent +=
      ',"WARNING: This test is for informational and educational purposes only."\n';
    csvContent += '\n';
    csvContent += ',"NOT A MEDICAL DEVICE:"\n';
    csvContent +=
      ',"- This test is NOT a medical device and does NOT provide medical diagnosis."\n';
    csvContent +=
      ',"- Results are NOT a substitute for professional audiological evaluation."\n';
    csvContent +=
      ',"- Accuracy may vary based on equipment, environment, and user factors."\n';
    csvContent += '\n';
    csvContent += ',"CONSULT A PROFESSIONAL:"\n';
    csvContent +=
      ',"- If you experience hearing loss, tinnitus, or any hearing-related symptoms,"\n';
    csvContent +=
      ',"  you MUST consult a qualified audiologist or healthcare provider immediately."\n';
    csvContent +=
      ',"- Do NOT use these results to self-diagnose or self-treat any medical condition."\n';
    csvContent +=
      ',"- For accurate diagnosis and treatment, professional medical evaluation is essential."\n';
    csvContent += '\n';
    csvContent += ',"LIMITATION OF LIABILITY:"\n';
    csvContent +=
      ',"- You assume full responsibility for your use of this tool."\n';
    csvContent +=
      ',"- The developers and operators of HearWell are NOT liable for any damages,"\n';
    csvContent +=
      ',"  injuries, or losses resulting from your use of these tools."\n';
    csvContent +=
      ',"- By using this tool, you acknowledge that you understand and accept these risks."\n';
    csvContent += '\n';
    csvContent +=
      '═══════════════════════════════════════════════════════════════\n';
    csvContent += `,"Report Generated: ${dateStr} at ${timeStr}"\n`;
    csvContent += ',"For more information, visit: https://hearwell.life"\n';
    csvContent +=
      '═══════════════════════════════════════════════════════════════\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = now.toISOString().split('T')[0].replace(/-/g, '');
    link.download = `hearwell-audiogram-${timestamp}-${earSelection}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: t('audiometer:downloadResults'),
      description: t(
        'audiometer:downloadResultsDesc',
        'Your comprehensive audiogram report has been saved'
      ),
    });
  };

  // Removed - buttons handle their own styling now

  // Calculate progress - a frequency is "completed" if user has marked it as heard OR not_heard
  const getProgress = () => {
    const earResults = testResults[earSelection];
    const completedFrequencies = frequencies.filter(freq => {
      // Check if user has marked any volume as "heard" OR "not_heard" for this frequency
      return volumes.some(vol => {
        const key = `${freq}-${vol}`;
        return earResults[key] === 'heard' || earResults[key] === 'not_heard';
      });
    }).length;
    return {
      completed: completedFrequencies,
      total: frequencies.length,
      percentage: Math.round((completedFrequencies / frequencies.length) * 100),
    };
  };

  // Check if test is complete - all frequencies must be tested (heard or not_heard)
  const isTestComplete = () => {
    const earResults = testResults[earSelection];
    return frequencies.every(freq => {
      return volumes.some(vol => {
        const key = `${freq}-${vol}`;
        return earResults[key] === 'heard' || earResults[key] === 'not_heard';
      });
    });
  };

  const progress = getProgress();

  const leftPanel = (
    <>
      {showInstructions && (
        <Alert className="mb-3 sm:mb-4">
          <Info className="h-3 w-3 sm:h-4 sm:w-4" />
          <AlertTitle className="flex items-center justify-between text-sm sm:text-base">
            <span>{t('audiometer:instructions')}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInstructions(false)}
              className="h-5 w-5 sm:h-6 sm:w-6 p-0"
            >
              ×
            </Button>
          </AlertTitle>
          <AlertDescription className="text-xs sm:text-sm space-y-1.5 sm:space-y-2 mt-1.5 sm:mt-2">
            {t('audiometer:instructionsText')}
          </AlertDescription>
        </Alert>
      )}

      {!showInstructions && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInstructions(true)}
          className="w-full mb-3 sm:mb-4 h-7 sm:h-8 text-xs"
        >
          <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
          {t('audiometer:showInstructions')}
        </Button>
      )}

      {progress.completed > 0 && (
        <Card className="mb-3 sm:mb-4">
          <CardContent className="pt-3 sm:pt-4 px-3 sm:px-4 py-2 sm:py-3">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium">
                  {t('audiometer:testProgress')}
                </span>
                <span className="text-muted-foreground">
                  {t('audiometer:progress', {
                    completed: progress.completed,
                    total: progress.total,
                  })}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                <div
                  className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">
                {t('audiometer:testSettings')}
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Calibration improves accuracy. Warble tones are easier to
                    detect for some users.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecalibrate}
              className="gap-1.5 h-7 text-xs px-2"
              data-testid="button-recalibrate"
            >
              <Settings className="h-3 w-3" />
              {isCalibrated
                ? t('audiometer:recalibrate')
                : t('audiometer:calibrate')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="text-xs font-medium">
                {t('audiometer:toneType')}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    <strong>Pure Tone:</strong> Steady tone (standard)
                    <br />
                    <strong>Warble Tone:</strong> Wobbling tone (easier to
                    detect)
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant={toneType === 'pure' ? 'default' : 'outline'}
                onClick={() => setToneType('pure')}
                size="sm"
                className="flex-1 h-7 text-xs"
                data-testid="button-tone-pure"
              >
                {t('audiometer:pure')}
              </Button>
              <Button
                variant={toneType === 'warble' ? 'default' : 'outline'}
                onClick={() => setToneType('warble')}
                size="sm"
                className="flex-1 h-7 text-xs"
                data-testid="button-tone-warble"
              >
                {t('audiometer:warble')}
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="text-xs font-medium">
                {t('audiometer:earSelection')}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Choose which ear(s) to test. &quot;Both&quot; for quick
                    test, or test separately for detailed results.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant={earSelection === 'both' ? 'default' : 'outline'}
                onClick={() => setEarSelection('both')}
                size="sm"
                className="flex-1 h-7 text-xs"
                data-testid="button-test-both"
              >
                {t('audiometer:both')}
              </Button>
              <Button
                variant={earSelection === 'left' ? 'default' : 'outline'}
                onClick={() => setEarSelection('left')}
                size="sm"
                className="flex-1 h-7 text-xs"
                data-testid="button-test-left"
              >
                {t('audiometer:left')}
              </Button>
              <Button
                variant={earSelection === 'right' ? 'default' : 'outline'}
                onClick={() => setEarSelection('right')}
                size="sm"
                className="flex-1 h-7 text-xs"
                data-testid="button-test-right"
              >
                {t('audiometer:right')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  // Extract Testing Board from leftPanel to make it full-width
  const testingBoardCard = (
    <Card className="w-full">
      <CardHeader className="pb-2 px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base sm:text-lg">
            {t('audiometer:testingBoard')}
          </CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="font-semibold mb-1 text-xs">Testing Board Guide:</p>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>Each column tests a different pitch (frequency)</li>
                <li>Start from the top (quietest sounds) and work down</li>
                <li>
                  Click <strong>▶</strong> button to hear the sound
                </li>
                <li>
                  Click <strong>✓</strong> if you heard it (green) or{' '}
                  <strong>✗</strong> if you didn&apos;t (red)
                </li>
                <li>Results appear at the bottom after you start testing</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription className="text-xs">
          {t('audiometer:testingBoardDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
          <div className="w-full">
            <div className="grid grid-cols-9 gap-0.5 sm:gap-1 mb-2 sm:mb-3">
              <div className="text-[10px] sm:text-xs font-semibold px-0.5 sm:px-1">
                {t('audiometer:hearingLevel')}
              </div>
              {frequencies.map(freq => (
                <div
                  key={freq}
                  className="text-center text-[10px] sm:text-xs font-semibold px-0.5 sm:px-1"
                >
                  {freq >= 1000 ? `${freq / 1000}k` : freq} Hz
                </div>
              ))}
            </div>

            <div className="grid grid-rows-12 gap-0.5 sm:gap-1">
              {volumes.map(vol => (
                <div key={vol} className="grid grid-cols-9 gap-0.5 sm:gap-1">
                  <div className="flex items-center px-0.5 sm:px-1">
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs py-0 px-1.5"
                    >
                      {vol}
                    </Badge>
                  </div>
                  {frequencies.map(freq => {
                    const key = `${freq}-${vol}`;
                    const state = testResults[earSelection][key] || 'untested';
                    const isPlaying = state === 'playing';
                    const canMark =
                      state === 'played' ||
                      state === 'heard' ||
                      state === 'not_heard';

                    return (
                      <div
                        key={key}
                        className="flex gap-0.5 h-7 sm:h-8 md:h-9 lg:h-10"
                        data-testid={`cell-${freq}-${vol}`}
                      >
                        <Button
                          onClick={() => handlePlaySound(freq, vol)}
                          disabled={isPlaying}
                          variant={isPlaying ? 'default' : 'outline'}
                          size="sm"
                          className="flex-1 h-full px-0.5 text-[9px] sm:text-[10px] font-semibold"
                          title={t('audiometer:playSound')}
                        >
                          {isPlaying ? '▶' : '▶'}
                        </Button>
                        <Button
                          onClick={() => handleMarkHeard(freq, vol)}
                          disabled={isPlaying || !canMark}
                          variant={state === 'heard' ? 'default' : 'outline'}
                          size="sm"
                          className={`flex-1 h-full px-0.5 text-[9px] sm:text-[10px] font-semibold ${
                            state === 'heard'
                              ? 'bg-green-500 hover:bg-green-600 text-white border-green-500'
                              : ''
                          }`}
                          title={
                            !canMark
                              ? t('audiometer:playSound')
                              : state === 'heard'
                                ? t('audiometer:markHeard')
                                : t('audiometer:markHeard')
                          }
                        >
                          ✓
                        </Button>
                        <Button
                          onClick={() => handleMarkNotHeard(freq, vol)}
                          disabled={isPlaying || !canMark}
                          variant={
                            state === 'not_heard' ? 'default' : 'outline'
                          }
                          size="sm"
                          className={`flex-1 h-full px-0.5 text-[9px] sm:text-[10px] font-semibold ${
                            state === 'not_heard'
                              ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
                              : ''
                          }`}
                          title={
                            !canMark
                              ? t('audiometer:playSound')
                              : state === 'not_heard'
                                ? t('audiometer:markNotHeard')
                                : t('audiometer:markNotHeard')
                          }
                        >
                          ✗
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-3 pt-3 border-t">
          <div className="text-xs font-medium mb-1.5">
            {t('audiometer:howToUse')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                disabled
                className="text-[9px] sm:text-[10px] h-5 w-5 p-0"
              >
                ▶
              </Button>
              <span>{t('audiometer:playSound')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                disabled
                className="text-[9px] sm:text-[10px] h-5 w-5 p-0"
              >
                ✓
              </Button>
              <span>{t('audiometer:markHeard')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                disabled
                className="text-[9px] sm:text-[10px] h-5 w-5 p-0"
              >
                ✗
              </Button>
              <span>{t('audiometer:markNotHeard')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const rightPanel = null; // Results moved to bottom section

  const resultsSection = (
    <Card className="mt-4 sm:mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('audiometer:testResults')}</CardTitle>
            <CardDescription>
              {progress.completed === 0
                ? t(
                    'audiometer:testResultsDesc',
                    'Complete the hearing test above to see your results'
                  )
                : t('audiometer:progress', {
                    completed: progress.completed,
                    total: progress.total,
                  })}
            </CardDescription>
          </div>
          {progress.completed > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearResults}
                data-testid="button-clear"
              >
                {t('audiometer:clearResults')}
              </Button>
              <Button
                variant={isTestComplete() ? 'default' : 'outline'}
                onClick={handleDownload}
                className="gap-2"
                data-testid="button-download"
                disabled={!isTestComplete()}
                title={
                  !isTestComplete()
                    ? t('audiometer:testIncompleteDesc', {
                        total: frequencies.length,
                        completed: progress.completed,
                      })
                    : t('audiometer:downloadResults')
                }
              >
                <Download className="h-4 w-4" />
                {isTestComplete()
                  ? t('audiometer:downloadResults')
                  : t('audiometer:downloadResults') +
                    ` (${progress.completed}/${frequencies.length})`}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {progress.completed > 0 ? (
          <>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>{t('audiometer:chartDescription')}</strong>
              </p>
              <p>
                <strong>{t('audiometer:chartHowToRead')}</strong>
              </p>
            </div>
            <AudiogramChart
              testResults={testResults[earSelection]}
              frequencies={frequencies}
              volumes={volumes}
            />
            <AudiogramInterpretation
              testResults={testResults[earSelection]}
              frequencies={frequencies}
              volumes={volumes}
            />
          </>
        ) : (
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              {t('audiometer:startTestingPrompt')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <SEO pageName="audiometer" path="/audiometer" />
      <TooltipProvider>
        <CalibrationModal
          open={showCalibration}
          onCalibrationComplete={handleCalibrationComplete}
        />
        <ToolLayout
          title={t('audiometer:title')}
          description={t('audiometer:description')}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
        >
          {testingBoardCard}
          {resultsSection}
        </ToolLayout>
      </TooltipProvider>
    </>
  );
}
