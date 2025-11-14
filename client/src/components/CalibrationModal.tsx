import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Volume2 } from 'lucide-react';
import { useAudiometerEngine } from '@/hooks/useAudiometerEngine';

interface CalibrationModalProps {
  open: boolean;
  onCalibrationComplete: () => void;
}

export default function CalibrationModal({
  open,
  onCalibrationComplete,
}: CalibrationModalProps) {
  // Initialize volume from localStorage
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('audiometer-calibration');
    return saved ? parseInt(saved, 10) : 50;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioEngine = useAudiometerEngine();
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const volumeRef = useRef(volume);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioEngineRef = useRef(audioEngine);

  // Keep refs in sync with state/objects
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    audioEngineRef.current = audioEngine;
  }, [audioEngine]);

  const stopPlayback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    audioEngineRef.current.stop();
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []); // No dependencies - uses refs instead

  useEffect(() => {
    // Initialize AudioContext when modal opens
    if (open && audioEngineRef.current.resumeAudioContext) {
      audioEngineRef.current.resumeAudioContext().catch(() => {
        // AudioContext initialization failed
      });
    }
  }, [open]);

  // Separate effect to handle cleanup when modal closes
  useEffect(() => {
    if (!open) {
      // Clear intervals and audio without directly calling setIsPlaying
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
      audioEngineRef.current.stop();
      isPlayingRef.current = false;
    }
  }, [open]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, [stopPlayback]);

  useEffect(() => {
    // Handle continuous playback
    if (isPlaying) {
      // Stop any currently playing tone before starting a new one
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      audioEngineRef.current.stop();

      const playTone = async () => {
        // Check ref (current value) instead of closure
        if (!isPlayingRef.current) {
          return;
        }
        try {
          // Ensure AudioContext is resumed before playing (required by browsers)
          if (audioEngineRef.current.resumeAudioContext) {
            await audioEngineRef.current.resumeAudioContext();
          }
          const calibrationMultiplier = volumeRef.current / 100;
          await audioEngineRef.current.playTone(
            1000,
            40,
            'both',
            800,
            'pure',
            calibrationMultiplier
          );
        } catch {
          // If playTone fails, stop playing by clearing intervals and refs
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          if (playIntervalRef.current) {
            clearInterval(playIntervalRef.current);
            playIntervalRef.current = null;
          }
          audioEngineRef.current.stop();
          isPlayingRef.current = false;
          setIsPlaying(false);
        }
      };

      // Small delay to ensure previous tone is stopped and AudioContext is ready
      timeoutRef.current = setTimeout(async () => {
        if (isPlayingRef.current) {
          await playTone(); // Play immediately
          if (isPlayingRef.current) {
            playIntervalRef.current = setInterval(async () => {
              if (isPlayingRef.current) {
                await playTone();
              } else {
                if (playIntervalRef.current) {
                  clearInterval(playIntervalRef.current);
                  playIntervalRef.current = null;
                }
                audioEngineRef.current.stop();
              }
            }, 1000);
          }
        }
      }, 100);

      return () => {
        // Use refs directly in cleanup to avoid dependency issues
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (playIntervalRef.current) {
          clearInterval(playIntervalRef.current);
          playIntervalRef.current = null;
        }
        audioEngineRef.current.stop();
      };
    } else {
      // When isPlaying becomes false, cleanup timers and audio
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
      audioEngineRef.current.stop();
    }
  }, [isPlaying]); // Removed stopPlayback from dependencies to avoid circular updates

  const handlePlay = () => {
    // Toggle state immediately - the useEffect will handle AudioContext resume and playback
    setIsPlaying(prev => !prev);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleSaveCalibration = () => {
    stopPlayback();
    localStorage.setItem('audiometer-calibration', volume.toString());
    localStorage.setItem('audiometer-calibrated', 'true');
    onCalibrationComplete();
  };

  const handleSkip = () => {
    stopPlayback();
    localStorage.setItem('audiometer-calibrated', 'false');
    onCalibrationComplete();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        // Prevent closing without completing calibration
        if (!isOpen) {
          // Only allow closing via Skip or Save buttons
          return;
        }
      }}
      modal={true}
    >
      <DialogContent
        className="sm:max-w-md z-[100]"
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
        onInteractOutside={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Calibrate Your Headphones
          </DialogTitle>
          <DialogDescription>
            This quick calibration improves test accuracy by adjusting for your
            headphones and environment.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Put on your headphones. Click Play to hear a 1000 Hz reference tone.
            Adjust the volume until it&apos;s{' '}
            <strong>comfortable but clearly audible</strong> - not too loud, not
            too soft.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <Button
              size="lg"
              variant={isPlaying ? 'destructive' : 'default'}
              onClick={handlePlay}
              className="w-32"
              data-testid="button-calibration-play"
            >
              {isPlaying ? 'Stop' : 'Play Tone'}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Volume Level
              </span>
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
          <Button
            variant="outline"
            onClick={handleSkip}
            data-testid="button-calibration-skip"
          >
            Skip Calibration
          </Button>
          <Button
            onClick={handleSaveCalibration}
            data-testid="button-calibration-save"
          >
            Save & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
