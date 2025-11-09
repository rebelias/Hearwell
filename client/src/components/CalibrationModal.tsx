import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Volume2 } from "lucide-react";
import { useAudiometerEngine } from "@/hooks/useAudiometerEngine";

interface CalibrationModalProps {
  open: boolean;
  onCalibrationComplete: (calibrationValue: number) => void;
}

export default function CalibrationModal({ open, onCalibrationComplete }: CalibrationModalProps) {
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioEngine = useAudiometerEngine();
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load saved calibration from localStorage
    const saved = localStorage.getItem('audiometer-calibration');
    if (saved) {
      setVolume(parseInt(saved, 10));
    }
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
      audioEngine.stop();
    };
  }, []);

  useEffect(() => {
    // Handle continuous playback
    if (isPlaying) {
      const playTone = async () => {
        await audioEngine.playTone(1000, 40, 'both', 800, 'pure', volume / 100);
      };
      
      playTone(); // Play immediately
      playIntervalRef.current = setInterval(playTone, 1000);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
      audioEngine.stop();
    }
  }, [isPlaying, volume]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleSaveCalibration = () => {
    audioEngine.stop();
    setIsPlaying(false);
    const calibrationValue = volume / 100;
    localStorage.setItem('audiometer-calibration', volume.toString());
    localStorage.setItem('audiometer-calibrated', 'true');
    onCalibrationComplete(calibrationValue);
  };

  const handleSkip = () => {
    audioEngine.stop();
    setIsPlaying(false);
    localStorage.setItem('audiometer-calibrated', 'false');
    onCalibrationComplete(1.0); // No calibration offset
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Calibrate Your Headphones
          </DialogTitle>
          <DialogDescription>
            This quick calibration improves test accuracy by adjusting for your headphones and environment.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Put on your headphones. Click Play to hear a 1000 Hz reference tone. Adjust the volume until 
            it's <strong>comfortable but clearly audible</strong> - not too loud, not too soft.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <Button 
              size="lg"
              variant={isPlaying ? "destructive" : "default"}
              onClick={handlePlay}
              className="w-32"
              data-testid="button-calibration-play"
            >
              {isPlaying ? "Stop" : "Play Tone"}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Volume Level</span>
              <span className="text-sm font-medium">{volume}%</span>
            </div>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              min={10}
              max={100}
              step={1}
              className="w-full"
              disabled={!isPlaying}
              data-testid="slider-calibration-volume"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleSkip} data-testid="button-calibration-skip">
            Skip Calibration
          </Button>
          <Button onClick={handleSaveCalibration} data-testid="button-calibration-save">
            Save & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
