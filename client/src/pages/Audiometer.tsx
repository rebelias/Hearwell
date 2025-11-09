import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAudiometerEngine } from "@/hooks/useAudiometerEngine";
import AudiogramChart from "@/components/AudiogramChart";

type EarSelection = 'both' | 'left' | 'right';
type CellState = 'untested' | 'playing' | 'tested';

export default function Audiometer() {
  const [earSelection, setEarSelection] = useState<EarSelection>('both');
  const [testResults, setTestResults] = useState<Record<string, CellState>>({});
  const { toast } = useToast();
  const audioEngine = useAudiometerEngine();
  const cancelTokenRef = useRef<number>(0);

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
      await audioEngine.playTone(freq, vol, earSelection, 1000);
      
      if (cancelTokenRef.current === currentToken) {
        setTestResults(prev => ({ ...prev, [key]: 'tested' }));
      }
    }
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Online Audiometer</h1>
          <p className="text-muted-foreground">
            Professional hearing test with interactive audiogram
          </p>
        </div>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Before You Begin</AlertTitle>
          <AlertDescription>
            Use headphones in a quiet room. Click the cells from top to bottom for each frequency column 
            until you can just hear the tone. Results will appear on the audiogram below.
          </AlertDescription>
        </Alert>

        {/* Ear Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Ear to Test</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button
              variant={earSelection === 'both' ? 'default' : 'outline'}
              onClick={() => setEarSelection('both')}
              className="flex-1"
              data-testid="button-test-both"
            >
              Test Both Ears
            </Button>
            <Button
              variant={earSelection === 'left' ? 'default' : 'outline'}
              onClick={() => setEarSelection('left')}
              className="flex-1 bg-chart-1 hover:bg-chart-1/90"
              data-testid="button-test-left"
            >
              Left Ear
            </Button>
            <Button
              variant={earSelection === 'right' ? 'default' : 'outline'}
              onClick={() => setEarSelection('right')}
              className="flex-1 bg-destructive hover:bg-destructive/90"
              data-testid="button-test-right"
            >
              Right Ear
            </Button>
          </CardContent>
        </Card>

        {/* Testing Board */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Testing Board</CardTitle>
            <CardDescription>Click cells to test each frequency at different volumes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  <div className="text-sm font-semibold">Volume (dB)</div>
                  {frequencies.map(freq => (
                    <div key={freq} className="text-center text-sm font-semibold">
                      {freq} Hz
                    </div>
                  ))}
                </div>

                {/* Grid */}
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

            {/* Legend */}
            <div className="flex gap-6 mt-6 pt-6 border-t">
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

        {/* Results */}
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
      </div>
    </div>
  );
}
