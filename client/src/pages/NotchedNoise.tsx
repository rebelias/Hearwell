import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Copy, Download, Info } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  useNotchedNoise,
  NotchNoiseType,
  StereoWidth,
  NotchedNoiseOptions,
} from '@/hooks/useNotchedNoise';
import { exportAudioAsWav, downloadBlob } from '@/lib/audioExport';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { TooltipProvider } from '@/components/ui/tooltip';
import ToolLayout from '@/components/ToolLayout';

const BAND_FREQUENCIES = [
  60, 125, 250, 500, 1000, 2000, 4000, 8000, 12000, 16000,
];

export default function NotchedNoise() {
  const { t } = useTranslation(['notchedNoise', 'common']);
  const [bandGains, setBandGains] = useState<number[]>([
    50, 50, 50, 50, 50, 50, 50, 50, 50, 50,
  ]);
  const [noiseType, setNoiseType] = useState<NotchNoiseType>('white');
  const [volume, setVolume] = useState(50);
  const [stereoWidth, setStereoWidth] = useState<StereoWidth>('normal');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const { toast } = useToast();
  const noiseEngine = useNotchedNoise();

  // Band labels with translations
  const BAND_LABELS_TRANSLATED = [
    t('notchedNoise:bandSubBass', 'Sub-bass'),
    t('notchedNoise:bandLowBass', 'Low Bass'),
    t('notchedNoise:bandBass', 'Bass'),
    t('notchedNoise:bandHighBass', 'High Bass'),
    t('notchedNoise:bandLowMids', 'Low Mids'),
    t('notchedNoise:bandMids', 'Mids'),
    t('notchedNoise:bandHighMids', 'High Mids'),
    t('notchedNoise:bandLowTreble', 'Low Treble'),
    t('notchedNoise:bandTreble', 'Treble'),
    t('notchedNoise:bandHighTreble', 'High Treble'),
  ];

  // Presets matching myNoise approach
  const presets: Array<{
    name: string;
    nameKey: string;
    values: number[];
    type: NotchNoiseType;
  }> = [
    {
      name: t('notchedNoise:presetBrown', 'Brown'),
      nameKey: 'presetBrown',
      values: [80, 75, 70, 65, 60, 55, 50, 45, 40, 35],
      type: 'brown',
    },
    {
      name: t('notchedNoise:presetPink', 'Pink'),
      nameKey: 'presetPink',
      values: [70, 68, 65, 62, 58, 55, 52, 48, 45, 42],
      type: 'pink',
    },
    {
      name: t('notchedNoise:presetWhite', 'White'),
      nameKey: 'presetWhite',
      values: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
      type: 'white',
    },
    {
      name: t('notchedNoise:presetGrey', 'Grey'),
      nameKey: 'presetGrey',
      values: [50, 48, 50, 48, 50, 48, 50, 48, 50, 48],
      type: 'grey',
    },
    {
      name: t('notchedNoise:preset60Hz', 'Around 60Hz'),
      nameKey: 'preset60Hz',
      values: [30, 50, 50, 50, 50, 50, 50, 50, 50, 50],
      type: 'white',
    },
    {
      name: t('notchedNoise:preset125Hz', '125Hz'),
      nameKey: 'preset125Hz',
      values: [50, 30, 50, 50, 50, 50, 50, 50, 50, 50],
      type: 'white',
    },
    {
      name: t('notchedNoise:preset250Hz', '250Hz'),
      nameKey: 'preset250Hz',
      values: [50, 50, 30, 50, 50, 50, 50, 50, 50, 50],
      type: 'white',
    },
    {
      name: t('notchedNoise:preset500Hz', '500Hz'),
      nameKey: 'preset500Hz',
      values: [50, 50, 50, 30, 50, 50, 50, 50, 50, 50],
      type: 'white',
    },
    {
      name: t('notchedNoise:preset1kHz', '1kHz'),
      nameKey: 'preset1kHz',
      values: [50, 50, 50, 50, 30, 50, 50, 50, 50, 50],
      type: 'white',
    },
    {
      name: t('notchedNoise:preset2kHz', '2kHz'),
      nameKey: 'preset2kHz',
      values: [50, 50, 50, 50, 50, 30, 50, 50, 50, 50],
      type: 'white',
    },
    {
      name: t('notchedNoise:preset4kHz', '4kHz'),
      nameKey: 'preset4kHz',
      values: [50, 50, 50, 50, 50, 50, 30, 50, 50, 50],
      type: 'white',
    },
    {
      name: t('notchedNoise:preset8kHz', '8kHz'),
      nameKey: 'preset8kHz',
      values: [50, 50, 50, 50, 50, 50, 50, 30, 50, 50],
      type: 'white',
    },
  ];

  const applyPreset = (preset: (typeof presets)[0]) => {
    setBandGains(preset.values);
    setNoiseType(preset.type);
    setSelectedPreset(preset.nameKey);
    if (noiseEngine.isPlaying) {
      const options: NotchedNoiseOptions = {
        bandGains: preset.values,
        noiseType: preset.type,
        volume,
        stereoWidth,
      };
      noiseEngine.stop();
      setTimeout(() => noiseEngine.play(options), 50);
    }
  };

  const handleBandChange = (index: number, value: number) => {
    const newGains = [...bandGains];
    newGains[index] = value;
    setBandGains(newGains);
    setSelectedPreset(null);
    if (noiseEngine.isPlaying) {
      noiseEngine.updateBandGains(newGains);
    }
  };

  const handleNoiseTypeChange = (newType: NotchNoiseType) => {
    setNoiseType(newType);
    if (noiseEngine.isPlaying) {
      const options: NotchedNoiseOptions = {
        bandGains,
        noiseType: newType,
        volume,
        stereoWidth,
      };
      noiseEngine.replaceNoiseSource(options);
    }
  };

  const handleStereoWidthChange = (width: StereoWidth) => {
    setStereoWidth(width);
    if (noiseEngine.isPlaying) {
      noiseEngine.updateStereoWidth(width);
    }
  };

  useEffect(() => {
    if (noiseEngine.isPlaying) {
      const options: NotchedNoiseOptions = {
        bandGains,
        noiseType,
        volume,
        stereoWidth,
      };
      noiseEngine.stop();
      setTimeout(() => noiseEngine.play(options), 50);
    }
  }, [noiseType, volume, stereoWidth]);

  useEffect(() => {
    if (noiseEngine.isPlaying) {
      noiseEngine.updateVolume(volume);
    }
  }, [volume, noiseEngine]);

  const handleSaveSettings = () => {
    const settings = {
      bandGains,
      noiseType,
      volume,
      stereoWidth,
    };
    navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
    toast({
      title: t('notchedNoise:settingsSaved'),
      description: t('notchedNoise:settingsSavedDesc'),
    });
  };

  const handleDownload = async () => {
    try {
      const duration = 30;

      const blob = await exportAudioAsWav(duration, offlineCtx => {
        // Simplified export - creates notched noise with current settings
        const createNoiseBuffer = (type: NotchNoiseType) => {
          const bufferSize = offlineCtx.sampleRate * 2;
          const buffer = offlineCtx.createBuffer(
            1,
            bufferSize,
            offlineCtx.sampleRate
          );
          const output = buffer.getChannelData(0);

          if (type === 'white') {
            for (let i = 0; i < bufferSize; i++) {
              output[i] = Math.random() * 2 - 1;
            }
          } else if (type === 'pink') {
            let b0 = 0,
              b1 = 0,
              b2 = 0,
              b3 = 0,
              b4 = 0,
              b5 = 0,
              b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              b0 = 0.99886 * b0 + white * 0.0555179;
              b1 = 0.99332 * b1 + white * 0.0750759;
              b2 = 0.969 * b2 + white * 0.153852;
              b3 = 0.8665 * b3 + white * 0.3104856;
              b4 = 0.55 * b4 + white * 0.5329522;
              b5 = -0.7616 * b5 - white * 0.016898;
              output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
              output[i] *= 0.11;
              b6 = white * 0.115926;
            }
          } else if (type === 'brown') {
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              output[i] = (lastOut + 0.02 * white) / 1.02;
              lastOut = output[i];
              output[i] *= 3.5;
            }
          } else if (type === 'purple') {
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              const current = white - lastOut;
              output[i] = current;
              lastOut = white;
              output[i] *= 0.3;
            }
          } else if (type === 'grey') {
            for (let i = 0; i < bufferSize; i++) {
              output[i] = Math.random() * 2 - 1;
            }
          }

          return buffer;
        };

        const noiseBuffer = createNoiseBuffer(noiseType);
        const noiseNode = offlineCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        const gainNode = offlineCtx.createGain();
        gainNode.gain.value = (volume / 100) * 0.3;

        // Apply band filters and notch filters
        let currentNode: AudioNode = noiseNode;
        BAND_FREQUENCIES.forEach((freq, index) => {
          const bandFilter = offlineCtx.createBiquadFilter();
          bandFilter.type = 'peaking';
          bandFilter.frequency.value = freq;
          bandFilter.Q.value = 1.0;
          const bandGain = (bandGains[index] || 50) - 50;
          bandFilter.gain.value = bandGain * 0.4;

          const notchFilter = offlineCtx.createBiquadFilter();
          notchFilter.type = 'notch';
          notchFilter.frequency.value = freq;
          notchFilter.Q.value = 2.0;

          currentNode.connect(bandFilter);
          bandFilter.connect(notchFilter);
          currentNode = notchFilter;
        });

        currentNode.connect(gainNode);
        gainNode.connect(offlineCtx.destination);

        noiseNode.start(0);
      });

      const filename = `notched-noise-${new Date().toISOString().split('T')[0]}.wav`;
      downloadBlob(blob, filename);

      toast({
        title: t('notchedNoise:audioDownloaded'),
        description: t('notchedNoise:audioDownloadedDesc', { type: noiseType }),
      });
    } catch {
      toast({
        title: t('notchedNoise:downloadFailed'),
        description: t('notchedNoise:downloadFailedDesc'),
        variant: 'destructive',
      });
    }
  };

  const leftPanel = (
    <>
      <Alert className="py-2">
        <Info className="h-3 w-3" />
        <AlertTitle className="text-sm">
          {t('notchedNoise:howItWorks')}
        </AlertTitle>
        <AlertDescription className="text-xs mt-1">
          {t('notchedNoise:howItWorksText')}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {t(
              'notchedNoise:equalizerTitle',
              '10-Band Notched Noise Equalizer'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-center pb-2">
            <AudioPlayer
              isPlaying={noiseEngine.isPlaying}
              onPlayPause={() => {
                if (noiseEngine.isPlaying) {
                  noiseEngine.stop();
                } else {
                  const options: NotchedNoiseOptions = {
                    bandGains,
                    noiseType,
                    volume,
                    stereoWidth,
                  };
                  noiseEngine.play(options);
                }
              }}
              volume={volume}
              onVolumeChange={setVolume}
              showVolume
            />
          </div>

          <div className="space-y-1">
            {BAND_LABELS_TRANSLATED.map((label, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="min-w-[70px]">
                  <span className="text-xs text-muted-foreground">
                    {label} {BAND_FREQUENCIES[index]}Hz
                  </span>
                </div>
                <Slider
                  value={[bandGains[index]]}
                  onValueChange={([value]) => handleBandChange(index, value)}
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1 h-2"
                  data-testid={`slider-band-${index}`}
                />
                <span className="text-xs text-muted-foreground min-w-[28px] text-right">
                  {bandGains[index]}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="space-y-1">
              <span className="text-xs font-medium">
                {t('notchedNoise:baseNoiseType')}
              </span>
              <RadioGroup
                value={noiseType}
                onValueChange={value =>
                  handleNoiseTypeChange(value as NotchNoiseType)
                }
                className="flex flex-wrap gap-x-3 gap-y-1"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem
                    value="white"
                    id="white"
                    className="h-3 w-3"
                  />
                  <Label htmlFor="white" className="cursor-pointer text-xs">
                    {t('notchedNoise:noiseWhite', 'White')}
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="pink" id="pink" className="h-3 w-3" />
                  <Label htmlFor="pink" className="cursor-pointer text-xs">
                    {t('notchedNoise:noisePink', 'Pink')}
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem
                    value="brown"
                    id="brown"
                    className="h-3 w-3"
                  />
                  <Label htmlFor="brown" className="cursor-pointer text-xs">
                    {t('notchedNoise:noiseBrown', 'Brown')}
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem
                    value="purple"
                    id="purple"
                    className="h-3 w-3"
                  />
                  <Label htmlFor="purple" className="cursor-pointer text-xs">
                    {t('notchedNoise:noisePurple', 'Purple')}
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="grey" id="grey" className="h-3 w-3" />
                  <Label htmlFor="grey" className="cursor-pointer text-xs">
                    {t('notchedNoise:noiseGrey', 'Grey')}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium">
                {t('notchedNoise:stereoWidth', 'Stereo Width')}
              </span>
              <RadioGroup
                value={stereoWidth}
                onValueChange={value =>
                  handleStereoWidthChange(value as StereoWidth)
                }
                className="flex flex-wrap gap-x-3 gap-y-1"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="mono" id="mono" className="h-3 w-3" />
                  <Label htmlFor="mono" className="cursor-pointer text-xs">
                    {t('notchedNoise:stereoMono', 'Mono')}
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem
                    value="narrow"
                    id="narrow"
                    className="h-3 w-3"
                  />
                  <Label htmlFor="narrow" className="cursor-pointer text-xs">
                    {t('notchedNoise:stereoNarrow', 'Narrow')}
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem
                    value="normal"
                    id="normal"
                    className="h-3 w-3"
                  />
                  <Label htmlFor="normal" className="cursor-pointer text-xs">
                    {t('notchedNoise:stereoNormal', 'Normal')}
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="wide" id="wide" className="h-3 w-3" />
                  <Label htmlFor="wide" className="cursor-pointer text-xs">
                    {t('notchedNoise:stereoWide', 'Wide')}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button
              variant="outline"
              onClick={handleSaveSettings}
              className="gap-1 h-7 text-xs"
              data-testid="button-save"
            >
              <Copy className="h-3 w-3" />
              {t('notchedNoise:saveSettings')}
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="gap-1 h-7 text-xs"
              data-testid="button-download"
            >
              <Download className="h-3 w-3" />
              {t('notchedNoise:downloadAudio')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {t('notchedNoise:presets', 'Presets')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1.5">
            {presets.map(preset => (
              <Button
                key={preset.nameKey}
                variant={
                  selectedPreset === preset.nameKey ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => applyPreset(preset)}
                className="text-xs h-6 px-2"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const rightPanel = (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle>{t('notchedNoise:treatmentGuidelines')}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-3">
        <p>{t('notchedNoise:treatmentGuidelinesText1')}</p>
        <p>{t('notchedNoise:treatmentGuidelinesText2')}</p>
        <div className="space-y-2 pt-2">
          <h4 className="font-semibold text-foreground">
            {t('notchedNoise:usageTips')}
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
            <li>{t('notchedNoise:usageTip1')}</li>
            <li>{t('notchedNoise:usageTip2')}</li>
            <li>{t('notchedNoise:usageTip3')}</li>
            <li>{t('notchedNoise:usageTip4')}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <SEO pageName="notchedNoise" path="/notched-noise" />
      <TooltipProvider>
        <ToolLayout
          title={t('notchedNoise:title')}
          description={t('notchedNoise:description')}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
        />
      </TooltipProvider>
    </>
  );
}
