import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  volume?: number;
  onVolumeChange?: (value: number) => void;
  showVolume?: boolean;
}

export default function AudioPlayer({ 
  isPlaying, 
  onPlayPause, 
  volume = 50,
  onVolumeChange,
  showVolume = false
}: AudioPlayerProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        size="lg"
        onClick={onPlayPause}
        className={`rounded-full w-16 h-16 ${isPlaying ? 'animate-pulse' : ''}`}
        data-testid="button-play-pause"
      >
        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
      </Button>
      
      {showVolume && onVolumeChange && (
        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <Volume2 className="h-5 w-5 text-muted-foreground" />
          <Slider
            value={[volume]}
            onValueChange={([value]) => onVolumeChange(value)}
            min={0}
            max={100}
            step={1}
            className="flex-1"
            data-testid="slider-volume"
          />
          <span className="text-sm text-muted-foreground w-12 text-right">{volume}%</span>
        </div>
      )}
    </div>
  );
}
