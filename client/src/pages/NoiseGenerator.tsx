import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Copy, Download, Info, HelpCircle } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNoiseGenerator, NoiseColor } from '@/hooks/useNoiseGenerator';
import { exportAudioAsWav, downloadBlob } from '@/lib/audioExport';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ToolLayout from '@/components/ToolLayout';

export default function NoiseGenerator() {
  const { t } = useTranslation(['noiseGenerator', 'common', 'tools']);
  const [eqValues, setEqValues] = useState([50, 50, 50, 50, 50, 50, 50, 50]);
  const [selectedPreset, setSelectedPreset] = useState<NoiseColor | null>(null);
  const [noiseColor, setNoiseColor] = useState<NoiseColor>('white');
  const [volume, setVolume] = useState(50);
  const { toast } = useToast();
  const noiseEngine = useNoiseGenerator();

  const frequencies = ['32', '64', '125', '250', '500', '1k', '2k', '4k'];

  const presets: Array<{ color: NoiseColor; values: number[] }> = [
    {
      color: 'white',
      values: [50, 50, 50, 50, 50, 50, 50, 50],
    },
    { color: 'pink', values: [70, 65, 60, 55, 50, 45, 40, 35] },
    {
      color: 'brown',
      values: [80, 70, 60, 50, 40, 30, 20, 10],
    },
    {
      color: 'violet',
      values: [30, 35, 40, 45, 50, 55, 60, 70],
    },
    { color: 'blue', values: [35, 40, 45, 50, 55, 60, 65, 70] },
    { color: 'grey', values: [50, 45, 50, 45, 50, 45, 50, 45] },
  ];

  const applyPreset = (preset: (typeof presets)[0]) => {
    setEqValues(preset.values);
    setNoiseColor(preset.color);
    setSelectedPreset(preset.color);
    if (noiseEngine.isPlaying) {
      noiseEngine.stop();
      setTimeout(
        () => noiseEngine.play(preset.values, preset.color, volume),
        50
      );
    }
  };

  const handleEqChange = (index: number, value: number) => {
    const newValues = [...eqValues];
    newValues[index] = value;
    setEqValues(newValues);
    setSelectedPreset(null);
    noiseEngine.updateEqualizer(newValues);
  };

  useEffect(() => {
    if (noiseEngine.isPlaying) {
      noiseEngine.stop();
      setTimeout(() => noiseEngine.play(eqValues, noiseColor, volume), 50);
    }
  }, [noiseColor, volume]);

  useEffect(() => {
    if (noiseEngine.isPlaying) {
      noiseEngine.updateVolume(volume);
    }
  }, [volume, noiseEngine]);

  const handleSaveSettings = () => {
    toast({
      title: t('noiseGenerator:settingsSaved'),
      description: t('noiseGenerator:settingsSavedDesc'),
    });
  };

  const handleDownload = async () => {
    try {
      const duration = 30;

      const blob = await exportAudioAsWav(duration, offlineCtx => {
        const createNoiseBuffer = (type: NoiseColor) => {
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
          } else if (type === 'violet') {
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              const current = white - lastOut;
              output[i] = current;
              lastOut = white;
              output[i] *= 0.3;
            }
          } else if (type === 'blue') {
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              const current = (white + lastOut) / 2;
              output[i] = current - lastOut;
              lastOut = current;
              output[i] *= 0.5;
            }
          } else if (type === 'grey') {
            for (let i = 0; i < bufferSize; i++) {
              output[i] = Math.random() * 2 - 1;
            }
          }

          return buffer;
        };

        const noiseBuffer = createNoiseBuffer(noiseColor);
        const noiseNode = offlineCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        const gainNode = offlineCtx.createGain();
        gainNode.gain.value = 0.3;

        const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000];
        const filterNodes: BiquadFilterNode[] = [];

        frequencies.forEach((freq, index) => {
          const filter = offlineCtx.createBiquadFilter();
          filter.type = 'peaking';
          filter.frequency.value = freq;
          filter.Q.value = 1.0;
          filter.gain.value = (eqValues[index] - 50) * 0.24;
          filterNodes.push(filter);
        });

        let currentNode: AudioNode = noiseNode;
        filterNodes.forEach(filter => {
          currentNode.connect(filter);
          currentNode = filter;
        });
        currentNode.connect(gainNode);
        gainNode.connect(offlineCtx.destination);

        noiseNode.start(0);
      });

      const filename = `noise-${noiseColor}-${new Date().toISOString().split('T')[0]}.wav`;
      downloadBlob(blob, filename);

      toast({
        title: t('noiseGenerator:audioDownloaded'),
        description: t('noiseGenerator:audioDownloadedDesc', {
          color: noiseColor,
        }),
      });
    } catch {
      toast({
        title: t('noiseGenerator:downloadFailed'),
        description: t('noiseGenerator:downloadFailedDesc'),
        variant: 'destructive',
      });
    }
  };

  const leftPanel = (
    <>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>{t('noiseGenerator:howToUse')}</AlertTitle>
        <AlertDescription className="text-sm">
          {t('noiseGenerator:howToUseText')}
        </AlertDescription>
      </Alert>

      {/* Equalizer and Presets side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Equalizer Settings - takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>{t('noiseGenerator:equalizerSettings')}</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{t('noiseGenerator:equalizerTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <CardDescription>
              {t('noiseGenerator:equalizerDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <AudioPlayer
                isPlaying={noiseEngine.isPlaying}
                onPlayPause={() => {
                  if (noiseEngine.isPlaying) {
                    noiseEngine.stop();
                  } else {
                    noiseEngine.play(eqValues, noiseColor, volume);
                  }
                }}
                volume={volume}
                onVolumeChange={setVolume}
                showVolume
              />
            </div>

            <div className="space-y-3">
              {frequencies.map((freq: string, index: number) => (
                <div key={freq} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-medium min-w-[50px]">
                    {freq}Hz
                  </span>
                  <Slider
                    value={[eqValues[index]]}
                    onValueChange={([value]) => handleEqChange(index, value)}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                    data-testid={`slider-eq-${freq}`}
                  />
                  <span className="text-sm text-muted-foreground min-w-[35px] text-right">
                    {eqValues[index]}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-3 border-t">
              <Button
                variant="outline"
                onClick={handleSaveSettings}
                className="gap-2"
                data-testid="button-save"
              >
                <Copy className="h-4 w-4" />
                {t('noiseGenerator:saveSettings')}
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="gap-2"
                data-testid="button-download"
              >
                <Download className="h-4 w-4" />
                {t('noiseGenerator:download')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Colored Noise Presets - takes 1 column */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">
                {t('noiseGenerator:presets')}
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{t('noiseGenerator:presetTooltipWhite')}</p>
                  <p>{t('noiseGenerator:presetTooltipPink')}</p>
                  <p>{t('noiseGenerator:presetTooltipBrown')}</p>
                  <p>{t('noiseGenerator:presetTooltipVioletBlue')}</p>
                  <p>{t('noiseGenerator:presetTooltipGrey')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {presets.map(preset => (
                <Button
                  key={preset.color}
                  variant={
                    selectedPreset === preset.color ? 'default' : 'outline'
                  }
                  onClick={() => applyPreset(preset)}
                  className="w-full justify-start"
                  data-testid={`button-preset-${preset.color}`}
                >
                  {t(`tools:${preset.color}`)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const rightPanel = (
    <>
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>{t('noiseGenerator:aboutColoredNoise')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>{t('noiseGenerator:aboutColoredNoiseText1')}</p>
          <p>{t('noiseGenerator:aboutColoredNoiseText2')}</p>
        </CardContent>
      </Card>
    </>
  );

  return (
    <>
      <SEO pageName="noiseGenerator" path="/noise-generator" />
      <TooltipProvider>
        <ToolLayout
          title={t('noiseGenerator:title')}
          description={t('noiseGenerator:description')}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
        />
      </TooltipProvider>
    </>
  );
}
