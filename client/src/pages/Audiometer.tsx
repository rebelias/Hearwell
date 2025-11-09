import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Download, HelpCircle, Settings } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAudiometerEngine } from "@/hooks/useAudiometerEngine";
import AudiogramChart from "@/components/AudiogramChart";
import CalibrationModal from "@/components/CalibrationModal";
import AudiogramInterpretation from "@/components/AudiogramInterpretation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ToolLayout from "@/components/ToolLayout";

type EarSelection = 'both' | 'left' | 'right';
type CellState = 'untested' | 'playing' | 'tested';
type ToneType = 'pure' | 'warble';

export default function Audiometer() {
  const [earSelection, setEarSelection] = useState<EarSelection>('both');
  const [testResults, setTestResults] = useState<Record<string, CellState>>({});
  const [toneType, setToneType] = useState<ToneType>('pure');
  const [showCalibration, setShowCalibration] = useState(false);
  const [calibrationOffset, setCalibrationOffset] = useState(1.0);
  const [isCalibrated, setIsCalibrated] = useState(false);
  
  const { toast } = useToast();
  const audioEngine = useAudiometerEngine();
  const cancelTokenRef = useRef<number>(0);

  useEffect(() => {
    // Check if already calibrated
    const calibrated = localStorage.getItem('audiometer-calibrated');
    if (calibrated === 'true') {
      const savedCalibration = localStorage.getItem('audiometer-calibration');
      if (savedCalibration) {
        setCalibrationOffset(parseInt(savedCalibration, 10) / 100);
        setIsCalibrated(true);
      }
    } else if (calibrated === null) {
      // First time user - show calibration
      setShowCalibration(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      audioEngine.cleanup();
    };
  }, []);

  const frequencies = [250, 500, 1000, 2000, 4000, 8000];
  const volumes = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const handleCellClick = async (freq: number, vol: number) => {
    const key = `${freq}-${vol}`;
    const currentState = testResults[key] || 'untested';
    
    if (currentState === 'untested' || currentState === 'tested') {
      const currentToken = cancelTokenRef.current;
      setTestResults(prev => ({ ...prev, [key]: 'playing' }));
      await audioEngine.playTone(freq, vol, earSelection, 1000, toneType, calibrationOffset);
      
      if (cancelTokenRef.current === currentToken) {
        setTestResults(prev => ({ ...prev, [key]: 'tested' }));
      }
    }
  };

  const handleCalibrationComplete = (calibrationValue: number) => {
    setCalibrationOffset(calibrationValue);
    setIsCalibrated(true);
    setShowCalibration(false);
    toast({
      title: "Calibration Complete",
      description: "Your audiometer is now calibrated for accurate testing",
    });
  };

  const handleRecalibrate = () => {
    setShowCalibration(true);
  };

  const clearResults = () => {
    cancelTokenRef.current++;
    audioEngine.stop();
    setTestResults({});
    toast({
      title: "Results Cleared",
      description: "All test markers have been removed",
    });
  };

  const handleDownload = () => {
    const getLowestTestedVolume = (freq: number): number | null => {
      for (const vol of volumes) {
        const key = `${freq}-${vol}`;
        if (testResults[key] === 'tested') {
          return vol;
        }
      }
      return null;
    };

    let csvContent = "Frequency (Hz),Hearing Threshold (dB)\n";
    
    frequencies.forEach(freq => {
      const threshold = getLowestTestedVolume(freq);
      if (threshold !== null) {
        csvContent += `${freq},${threshold}\n`;
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audiogram-results-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Results Downloaded",
      description: "Your audiogram results have been saved as CSV",
    });
  };

  const getCellStyle = (state: CellState) => {
    switch (state) {
      case 'playing':
        return 'bg-primary animate-pulse cursor-pointer';
      case 'tested':
        return 'bg-secondary cursor-pointer';
      default:
        return 'bg-muted hover-elevate cursor-pointer';
    }
  };

  const leftPanel = (
    <>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Before You Begin</AlertTitle>
        <AlertDescription className="text-sm">
          Use headphones in a quiet room. 
          {!isCalibrated && <strong> Click "Calibrate" below for best accuracy.</strong>}
          {' '}Click the cells from top to bottom for each frequency column 
          until you can just hear the tone. Results will appear on the audiogram.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Test Settings</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Calibration improves accuracy. Warble tones are easier to detect for some users - try both and see which works better for you.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecalibrate}
              className="gap-2"
              data-testid="button-recalibrate"
            >
              <Settings className="h-4 w-4" />
              {isCalibrated ? 'Recalibrate' : 'Calibrate'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm font-medium mb-2">Tone Type</div>
            <div className="flex gap-2">
              <Button
                variant={toneType === 'pure' ? 'default' : 'outline'}
                onClick={() => setToneType('pure')}
                className="flex-1"
                data-testid="button-tone-pure"
              >
                Pure Tone
              </Button>
              <Button
                variant={toneType === 'warble' ? 'default' : 'outline'}
                onClick={() => setToneType('warble')}
                className="flex-1"
                data-testid="button-tone-warble"
              >
                Warble Tone
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {toneType === 'pure' ? 'Steady pure tone (standard audiometry)' : 'Wobbling tone (easier to detect for some)'}
            </p>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Ear Selection</div>
            <div className="flex gap-2">
              <Button
                variant={earSelection === 'both' ? 'default' : 'outline'}
                onClick={() => setEarSelection('both')}
                className="flex-1"
                data-testid="button-test-both"
              >
                Both
              </Button>
              <Button
                variant={earSelection === 'left' ? 'default' : 'outline'}
                onClick={() => setEarSelection('left')}
                className="flex-1"
                data-testid="button-test-left"
              >
                Left
              </Button>
              <Button
                variant={earSelection === 'right' ? 'default' : 'outline'}
                onClick={() => setEarSelection('right')}
                className="flex-1"
                data-testid="button-test-right"
              >
                Right
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Testing Board</CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Start from the top row (quietest) and click down until you can barely hear the tone. Each column tests a different pitch - low pitches on the left, high pitches on the right.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <CardDescription>Click cells to test each frequency at different volumes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-7 gap-2 mb-3">
                <div className="text-sm font-semibold">Volume (dB)</div>
                {frequencies.map(freq => (
                  <div key={freq} className="text-center text-sm font-semibold">
                    {freq} Hz
                  </div>
                ))}
              </div>

              {volumes.map(vol => (
                <div key={vol} className="grid grid-cols-7 gap-2 mb-2">
                  <div className="flex items-center">
                    <Badge variant="outline">{vol}</Badge>
                  </div>
                  {frequencies.map(freq => {
                    const key = `${freq}-${vol}`;
                    const state = testResults[key] || 'untested';
                    return (
                      <button
                        key={key}
                        onClick={() => handleCellClick(freq, vol)}
                        className={`h-10 rounded-md transition-all ${getCellStyle(state)}`}
                        data-testid={`cell-${freq}-${vol}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded" />
              <span className="text-sm">Not Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded" />
              <span className="text-sm">Playing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded" />
              <span className="text-sm">Tested</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const rightPanel = (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Results</CardTitle>
            <CardDescription>Audiogram chart will display your results</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearResults} data-testid="button-clear">
              Clear Results
            </Button>
            <Button variant="outline" onClick={handleDownload} className="gap-2" data-testid="button-download">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AudiogramChart 
          testResults={testResults} 
          frequencies={frequencies}
          volumes={volumes}
        />
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <CalibrationModal 
        open={showCalibration} 
        onCalibrationComplete={handleCalibrationComplete}
      />
      <ToolLayout
        title="Online Audiometer"
        description="Professional hearing test with interactive audiogram and interpretation"
        leftPanel={leftPanel}
        rightPanel={rightPanel}
      >
        <AudiogramInterpretation 
          testResults={testResults}
          frequencies={frequencies}
          volumes={volumes}
        />
      </ToolLayout>
    </TooltipProvider>
  );
}
