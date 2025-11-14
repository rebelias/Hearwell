import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  showVolume = false,
}: AudioPlayerProps) {
  const { t } = useTranslation('common');
  return (
    <div className="flex items-center gap-4">
      <Button
        size="lg"
        onClick={onPlayPause}
        className={`rounded-full w-16 h-16 ${isPlaying ? 'animate-pulse' : ''}`}
        data-testid="button-play-pause"
        aria-label={isPlaying ? t('pause') : t('play')}
        title={isPlaying ? t('pause') : t('play')}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6 ml-1" />
        )}
      </Button>

      {showVolume && onVolumeChange && (
        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <Volume2
            className="h-5 w-5 text-muted-foreground"
            aria-label={t('volume')}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={volume}
            onInput={e =>
              onVolumeChange(parseInt((e.target as HTMLInputElement).value, 10))
            }
            onChange={e => onVolumeChange(parseInt(e.target.value, 10))}
            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
            data-testid="slider-volume"
            aria-label={t('volume')}
            title={t('volume')}
          />
          <span className="text-sm text-muted-foreground w-12 text-right">
            {volume}%
          </span>
        </div>
      )}
    </div>
  );
}
