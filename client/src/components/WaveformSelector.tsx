import { Button } from '@/components/ui/button';
import { Square, Triangle, Zap, Filter, Waves, LucideIcon } from 'lucide-react';

export type WaveformType =
  | 'sine'
  | 'square'
  | 'triangle'
  | 'sawtooth'
  | 'filtered';

interface WaveformSelectorProps {
  value: WaveformType;
  onChange: (value: WaveformType) => void;
}

export default function WaveformSelector({
  value,
  onChange,
}: WaveformSelectorProps) {
  const waveforms: { type: WaveformType; icon: LucideIcon; label: string }[] = [
    { type: 'sine', icon: Waves, label: 'Sine' },
    { type: 'square', icon: Square, label: 'Square' },
    { type: 'triangle', icon: Triangle, label: 'Triangle' },
    { type: 'sawtooth', icon: Zap, label: 'Sawtooth' },
    { type: 'filtered', icon: Filter, label: 'Filtered' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {waveforms.map(waveform => (
        <Button
          key={waveform.type}
          variant={value === waveform.type ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(waveform.type)}
          className="gap-2"
          data-testid={`button-waveform-${waveform.type}`}
        >
          <waveform.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{waveform.label}</span>
        </Button>
      ))}
    </div>
  );
}
