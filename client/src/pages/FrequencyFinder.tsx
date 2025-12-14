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
import { Copy, Share2, Info, HelpCircle } from 'lucide-react';
import WaveformSelector, { WaveformType } from '@/components/WaveformSelector';
import AudioPlayer from '@/components/AudioPlayer';
import { useToast } from '@/hooks/use-toast';
import { useAudioEngine, type EarSelection } from '@/hooks/useAudioEngine';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ToolLayout from '@/components/ToolLayout';

export default function FrequencyFinder() {
  const { t } = useTranslation(['frequencyFinder', 'common', 'tools']);
  const [frequency, setFrequency] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const freq = params.get('freq');
    if (freq) {
      const parsedFreq = parseInt(freq, 10);
      if (parsedFreq >= 50 && parsedFreq <= 20000) {
        return parsedFreq;
      }
    }
    return 1000;
  });

  const [waveform, setWaveform] = useState<WaveformType>(() => {
    const params = new URLSearchParams(window.location.search);
    const wave = params.get('wave');
    if (
      wave &&
      ['sine', 'square', 'triangle', 'sawtooth', 'filtered', 'noise'].includes(
        wave
      )
    ) {
      return wave as WaveformType;
    }
    return 'sine';
  });

  const [earSelection, setEarSelection] = useState<EarSelection>(() => {
    const params = new URLSearchParams(window.location.search);
    const ear = params.get('ear');
    if (ear === 'left' || ear === 'right' || ear === 'both') {
      return ear;
    }
    const stored = localStorage.getItem('frequency-finder-ear');
    if (stored === 'left' || stored === 'right' || stored === 'both') {
      return stored;
    }
    return 'both';
  });

  const { toast } = useToast();

  const audioEngine = useAudioEngine({
    frequency,
    waveform,
    volume: 50,
    earSelection,
  });

  useEffect(() => {
    audioEngine.updateFrequency(frequency);
  }, [frequency]);

  useEffect(() => {
    audioEngine.updateWaveform(waveform);
  }, [waveform]);

  useEffect(() => {
    audioEngine.updateEarSelection(earSelection);
    localStorage.setItem('frequency-finder-ear', earSelection);
  }, [earSelection]);

  const handleCopySettings = () => {
    const earLabel = t(
      earSelection === 'both'
        ? 'frequencyFinder:earLabelBoth'
        : earSelection === 'left'
          ? 'frequencyFinder:earLabelLeft'
          : 'frequencyFinder:earLabelRight'
    );
    const settings = `Frequency: ${frequency}Hz, Waveform: ${waveform}, Ear: ${earLabel}`;
    navigator.clipboard.writeText(settings);
    // Save frequency to localStorage for Tonal Masker tool
    localStorage.setItem('tinnitus-frequency', frequency.toString());
    toast({
      title: t('frequencyFinder:settingsCopied'),
      description: t('frequencyFinder:settingsCopiedDesc'),
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/frequency-finder?freq=${frequency}&wave=${waveform}&ear=${earSelection}`;
    navigator.clipboard.writeText(url);
    // Save frequency to localStorage for Tonal Masker tool
    localStorage.setItem('tinnitus-frequency', frequency.toString());
    toast({
      title: t('frequencyFinder:linkCopied'),
      description: t('frequencyFinder:linkCopiedDesc'),
    });
  };

  const leftPanel = (
    <>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>{t('frequencyFinder:instructions')}</AlertTitle>
        <AlertDescription className="text-sm">
          {t('frequencyFinder:instructionsText')}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>{t('frequencyFinder:frequencyControl')}</CardTitle>
          <CardDescription>
            {t('frequencyFinder:frequencyControlDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <AudioPlayer
              isPlaying={audioEngine.isPlaying}
              onPlayPause={audioEngine.toggle}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t('frequencyFinder:frequencyHz')}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      {t('frequencyFinder:frequencyTooltip')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span
                className="text-2xl font-display font-bold text-primary"
                data-testid="text-frequency"
              >
                {frequency} Hz
              </span>
            </div>
            <Slider
              value={[frequency]}
              onValueChange={([value]) => setFrequency(value)}
              min={50}
              max={20000}
              step={10}
              className="w-full"
              data-testid="slider-frequency"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50 Hz</span>
              <span>1 kHz</span>
              <span>5 kHz</span>
              <span>10 kHz</span>
              <span>20 kHz</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t('frequencyFinder:toneQuality')}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    {t('frequencyFinder:toneQualityTooltip')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <WaveformSelector value={waveform} onChange={setWaveform} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t('tools:earSelection')}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={earSelection === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEarSelection('left')}
                data-testid="button-ear-left"
              >
                {t('tools:left')}
              </Button>
              <Button
                variant={earSelection === 'both' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEarSelection('both')}
                data-testid="button-ear-both"
              >
                {t('tools:both')}
              </Button>
              <Button
                variant={earSelection === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEarSelection('right')}
                data-testid="button-ear-right"
              >
                {t('tools:right')}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-3 border-t">
            <Button
              variant="outline"
              onClick={handleCopySettings}
              className="gap-2"
              data-testid="button-copy-settings"
            >
              <Copy className="h-4 w-4" />
              {t('frequencyFinder:copySettings')}
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="gap-2"
              data-testid="button-share"
            >
              <Share2 className="h-4 w-4" />
              {t('frequencyFinder:shareLink')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const rightPanel = (
    <>
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-xl font-display font-bold text-primary">
            {t('frequencyFinder:currentFrequency')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-display font-bold text-primary mb-2">
              {frequency} Hz
            </div>
            <div className="text-sm text-muted-foreground">
              {t('frequencyFinder:waveform')}: {waveform}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>{t('frequencyFinder:aboutTool')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>{t('frequencyFinder:aboutToolText1')}</p>
          <p>{t('frequencyFinder:aboutToolText2')}</p>
        </CardContent>
      </Card>
    </>
  );

  return (
    <>
      <SEO pageName="frequencyFinder" path="/frequency-finder" />
      <TooltipProvider>
        <ToolLayout
          title={t('frequencyFinder:title')}
          description={t('frequencyFinder:description')}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
        />
      </TooltipProvider>
    </>
  );
}
