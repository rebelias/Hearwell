import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { HelpCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import WaveformSelector, { WaveformType } from '@/components/WaveformSelector';
import AudioPlayer from '@/components/AudioPlayer';
import { useToast } from '@/hooks/use-toast';
import {
  useTonalMasker,
  ModulationType,
  EarSelection,
} from '@/hooks/useTonalMasker';
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

export default function TonalMasker() {
  const { t } = useTranslation(['tonalMasker', 'common']);
  const [frequency, setFrequency] = useState(() => {
    const savedFrequency = localStorage.getItem('tinnitus-frequency');
    if (savedFrequency) {
      const parsedFreq = parseInt(savedFrequency, 10);
      if (parsedFreq >= 50 && parsedFreq <= 20000) {
        return parsedFreq;
      }
    }
    return 4000;
  });
  const [modulationType, setModulationType] = useState<ModulationType>('am');
  const [modulationRate, setModulationRate] = useState(1);
  const [modulationDepth, setModulationDepth] = useState(50);
  const [volume, setVolume] = useState(30);
  const [waveform, setWaveform] = useState<WaveformType>('sine');
  const [earSelection, setEarSelection] = useState<EarSelection>('both');
  const [crToneDuration, setCrToneDuration] = useState(200);
  const [crGapDuration, setCrGapDuration] = useState(50);
  const [crFrequencySpread, setCrFrequencySpread] = useState(10);
  const [randomizeModulation, setRandomizeModulation] = useState(false);
  const [modulationRateRange, setModulationRateRange] = useState<
    [number, number]
  >([0.5, 2]);
  const [modulationDepthRange, setModulationDepthRange] = useState<
    [number, number]
  >([30, 70]);
  const [randomizationInterval, setRandomizationInterval] = useState(5000);
  const [backgroundSound, setBackgroundSound] = useState<
    'none' | 'cicadas' | 'birds' | 'ocean' | 'rain'
  >('none');
  const [backgroundVolume, setBackgroundVolume] = useState(20);
  const [hasFrequency, setHasFrequency] = useState(() => {
    return localStorage.getItem('tinnitus-frequency') !== null;
  });
  const { toast } = useToast();

  const audioEngine = useTonalMasker({
    frequency,
    modulationType,
    modulationRate,
    modulationDepth,
    volume,
    waveform,
    earSelection,
    crToneDuration,
    crGapDuration,
    crFrequencySpread,
    randomizeModulation,
    modulationRateRange,
    modulationDepthRange,
    randomizationInterval,
    backgroundSound,
    backgroundVolume,
  });

  // Check URL parameters on mount
  useEffect(() => {
    // Check URL parameters (intentionally overriding localStorage values)
    const params = new URLSearchParams(window.location.search);
    const freq = params.get('freq');
    const modType = params.get('modType');
    const modRate = params.get('modRate');
    const modDepth = params.get('modDepth');
    const vol = params.get('vol');
    const wave = params.get('wave');
    const ear = params.get('ear');

    if (freq) {
      const parsedFreq = parseInt(freq, 10);
      if (parsedFreq >= 50 && parsedFreq <= 20000) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFrequency(parsedFreq);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasFrequency(true);
      }
    }

    if (modType && ['am', 'fm', 'both', 'cr'].includes(modType)) {
      setModulationType(modType as ModulationType);
    }

    const crToneDur = params.get('crToneDur');
    const crGapDur = params.get('crGapDur');
    const crSpread = params.get('crSpread');

    if (crToneDur) {
      const parsed = parseInt(crToneDur, 10);
      if (parsed >= 50 && parsed <= 1000) {
        setCrToneDuration(parsed);
      }
    }

    if (crGapDur) {
      const parsed = parseInt(crGapDur, 10);
      if (parsed >= 0 && parsed <= 500) {
        setCrGapDuration(parsed);
      }
    }

    if (crSpread) {
      const parsed = parseInt(crSpread, 10);
      if (parsed >= 1 && parsed <= 50) {
        setCrFrequencySpread(parsed);
      }
    }

    if (modRate) {
      const parsedRate = parseFloat(modRate);
      if (parsedRate >= 0.1 && parsedRate <= 10) {
        setModulationRate(parsedRate);
      }
    }

    if (modDepth) {
      const parsedDepth = parseInt(modDepth, 10);
      if (parsedDepth >= 0 && parsedDepth <= 100) {
        setModulationDepth(parsedDepth);
      }
    }

    if (vol) {
      const parsedVol = parseInt(vol, 10);
      if (parsedVol >= 0 && parsedVol <= 100) {
        setVolume(parsedVol);
      }
    }

    if (
      wave &&
      ['sine', 'square', 'triangle', 'sawtooth', 'filtered'].includes(wave)
    ) {
      setWaveform(wave as WaveformType);
    }

    if (ear && ['left', 'right', 'both'].includes(ear)) {
      setEarSelection(ear as EarSelection);
    }
  }, []);

  useEffect(() => {
    audioEngine.updateFrequency(frequency);
  }, [frequency]);

  useEffect(() => {
    audioEngine.updateModulationType(modulationType);
  }, [modulationType]);

  useEffect(() => {
    audioEngine.updateModulationRate(modulationRate);
  }, [modulationRate]);

  useEffect(() => {
    audioEngine.updateModulationDepth(modulationDepth);
  }, [modulationDepth]);

  useEffect(() => {
    audioEngine.updateVolume(volume);
  }, [volume]);

  useEffect(() => {
    audioEngine.updateWaveform(waveform);
  }, [waveform]);

  useEffect(() => {
    audioEngine.updateEarSelection(earSelection);
  }, [earSelection]);

  useEffect(() => {
    audioEngine.updateCRToneDuration(crToneDuration);
  }, [crToneDuration]);

  useEffect(() => {
    audioEngine.updateCRGapDuration(crGapDuration);
  }, [crGapDuration]);

  useEffect(() => {
    audioEngine.updateCRFrequencySpread(crFrequencySpread);
  }, [crFrequencySpread]);

  useEffect(() => {
    audioEngine.updateRandomizeModulation(randomizeModulation);
  }, [randomizeModulation]);

  useEffect(() => {
    audioEngine.updateModulationRateRange(modulationRateRange);
  }, [modulationRateRange]);

  useEffect(() => {
    audioEngine.updateModulationDepthRange(modulationDepthRange);
  }, [modulationDepthRange]);

  useEffect(() => {
    audioEngine.updateRandomizationInterval(randomizationInterval);
  }, [randomizationInterval]);

  useEffect(() => {
    audioEngine.updateBackgroundSound(backgroundSound);
  }, [backgroundSound]);

  useEffect(() => {
    audioEngine.updateBackgroundVolume(backgroundVolume);
  }, [backgroundVolume]);

  const handlePlay = async () => {
    try {
      await audioEngine.resumeAudioContext();
      audioEngine.toggle();
    } catch {
      toast({
        title: t('common:error', 'Error'),
        description: t(
          'common:playbackError',
          'Failed to start playback. Please try again.'
        ),
        variant: 'destructive',
      });
    }
  };

  const leftPanel = (
    <>
      {!hasFrequency && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('tonalMasker:findFrequencyFirst')}</AlertTitle>
          <AlertDescription className="text-sm">
            {t('tonalMasker:findFrequencyFirstText')}
            <Link href="/frequency-finder">
              <Button variant="outline" size="sm" className="mt-2 gap-2">
                <ExternalLink className="h-4 w-4" />
                {t('tonalMasker:findFrequencyLink')}
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('tonalMasker:controls')}</CardTitle>
          <CardDescription>{t('tonalMasker:playbackSettings')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Playback Controls - Top */}
          <div className="flex justify-center pb-4 border-b">
            <AudioPlayer
              isPlaying={audioEngine.isPlaying}
              onPlayPause={handlePlay}
              volume={volume}
              onVolumeChange={setVolume}
              showVolume
            />
          </div>

          {/* Modulation Type - Right below playback */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {t('tonalMasker:modulationType')}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    {t('tonalMasker:modulationTypeTooltip')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <RadioGroup
              value={modulationType}
              onValueChange={value =>
                setModulationType(value as ModulationType)
              }
            >
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="am" id="mod-am" />
                  <Label htmlFor="mod-am" className="cursor-pointer">
                    {t('tonalMasker:am')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fm" id="mod-fm" />
                  <Label htmlFor="mod-fm" className="cursor-pointer">
                    {t('tonalMasker:fm')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="mod-both" />
                  <Label htmlFor="mod-both" className="cursor-pointer">
                    {t('tonalMasker:both')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cr" id="mod-cr" />
                  <Label htmlFor="mod-cr" className="cursor-pointer">
                    {t('tonalMasker:cr')}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 ml-1 inline text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          Coordinated Reset: Randomized sequence of 4 tones to
                          desynchronize neural activity.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Modulation Parameters - Right below type selection */}
          {modulationType !== 'cr' && (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {t('tonalMasker:modulationRate')}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          {t('tonalMasker:modulationRateTooltip')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-lg font-display font-semibold text-primary">
                    {modulationRate.toFixed(1)} Hz
                  </span>
                </div>
                <Slider
                  value={[modulationRate]}
                  onValueChange={([value]) => setModulationRate(value)}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="w-full"
                  data-testid="slider-modulation-rate"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.1 Hz</span>
                  <span>1 Hz</span>
                  <span>5 Hz</span>
                  <span>10 Hz</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {t('tonalMasker:modulationDepth')}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          {t('tonalMasker:modulationDepthTooltip')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-lg font-display font-semibold text-primary">
                    {modulationDepth}%
                  </span>
                </div>
                <Slider
                  value={[modulationDepth]}
                  onValueChange={([value]) => setModulationDepth(value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                  data-testid="slider-modulation-depth"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </>
          )}

          {modulationType === 'cr' && (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {t('tonalMasker:toneDuration')}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          How long each tone plays before switching to the next.
                          Typical range: 100-500ms.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-lg font-display font-semibold text-primary">
                    {crToneDuration} ms
                  </span>
                </div>
                <Slider
                  value={[crToneDuration]}
                  onValueChange={([value]) => setCrToneDuration(value)}
                  min={50}
                  max={1000}
                  step={10}
                  className="w-full"
                  data-testid="slider-cr-tone-duration"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50 ms</span>
                  <span>200 ms</span>
                  <span>500 ms</span>
                  <span>1000 ms</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {t('tonalMasker:gapDuration')}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          Silence between tones. Helps create distinct tone
                          boundaries for better desynchronization.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-lg font-display font-semibold text-primary">
                    {crGapDuration} ms
                  </span>
                </div>
                <Slider
                  value={[crGapDuration]}
                  onValueChange={([value]) => setCrGapDuration(value)}
                  min={0}
                  max={500}
                  step={10}
                  className="w-full"
                  data-testid="slider-cr-gap-duration"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 ms</span>
                  <span>50 ms</span>
                  <span>200 ms</span>
                  <span>500 ms</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {t('tonalMasker:frequencySpread')}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          How far above and below your tinnitus frequency the 4
                          tones are spread. Higher values create more variation.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-lg font-display font-semibold text-primary">
                    {crFrequencySpread}%
                  </span>
                </div>
                <Slider
                  value={[crFrequencySpread]}
                  onValueChange={([value]) => setCrFrequencySpread(value)}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                  data-testid="slider-cr-frequency-spread"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1%</span>
                  <span>10%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
            </>
          )}

          {/* Randomized Modulation - Only for AM/FM/Both */}
          {modulationType !== 'cr' && (
            <>
              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Randomize Modulation
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          Randomly vary modulation rate and depth within
                          specified ranges to prevent neural adaptation.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Button
                    variant={randomizeModulation ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRandomizeModulation(!randomizeModulation)}
                  >
                    {randomizeModulation ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                {randomizeModulation && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Rate Range (Hz)
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {modulationRateRange[0].toFixed(1)} -{' '}
                          {modulationRateRange[1].toFixed(1)} Hz
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-muted-foreground mb-1 block">
                            Min
                          </span>
                          <Slider
                            value={[modulationRateRange[0]]}
                            onValueChange={([value]) =>
                              setModulationRateRange([
                                value,
                                modulationRateRange[1],
                              ])
                            }
                            min={0.1}
                            max={5}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground mb-1 block">
                            Max
                          </span>
                          <Slider
                            value={[modulationRateRange[1]]}
                            onValueChange={([value]) =>
                              setModulationRateRange([
                                modulationRateRange[0],
                                value,
                              ])
                            }
                            min={0.1}
                            max={5}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Depth Range (%)
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {modulationDepthRange[0]} - {modulationDepthRange[1]}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-muted-foreground mb-1 block">
                            Min
                          </span>
                          <Slider
                            value={[modulationDepthRange[0]]}
                            onValueChange={([value]) =>
                              setModulationDepthRange([
                                value,
                                modulationDepthRange[1],
                              ])
                            }
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground mb-1 block">
                            Max
                          </span>
                          <Slider
                            value={[modulationDepthRange[1]]}
                            onValueChange={([value]) =>
                              setModulationDepthRange([
                                modulationDepthRange[0],
                                value,
                              ])
                            }
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Randomization Interval (ms)
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {randomizationInterval} ms
                        </span>
                      </div>
                      <Slider
                        value={[randomizationInterval]}
                        onValueChange={([value]) =>
                          setRandomizationInterval(value)
                        }
                        min={1000}
                        max={10000}
                        step={500}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1s</span>
                        <span>5s</span>
                        <span>10s</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Background Sounds */}
          <div className="pt-4 border-t space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Background Sound</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Optional nature sounds to enhance relaxation and mask
                    environmental noise.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['none', 'cicadas', 'birds', 'ocean', 'rain'] as const).map(
                sound => (
                  <Button
                    key={sound}
                    variant={backgroundSound === sound ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBackgroundSound(sound)}
                  >
                    {sound.charAt(0).toUpperCase() + sound.slice(1)}
                  </Button>
                )
              )}
            </div>
            {backgroundSound !== 'none' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Background Volume
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {backgroundVolume}%
                  </span>
                </div>
                <Slider
                  value={[backgroundVolume]}
                  onValueChange={([value]) => setBackgroundVolume(value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('tonalMasker:toneSettings')}</CardTitle>
          <CardDescription>
            {t(
              'tonalMasker:toneSettingsDesc',
              'Configure the base tone parameters'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {t('tonalMasker:baseFrequency')}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      {t('tonalMasker:baseFrequencyTooltip')}
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
              onValueChange={([value]) => {
                setFrequency(value);
                setHasFrequency(true); // Mark as having frequency when manually adjusted
              }}
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
              <span className="text-sm text-muted-foreground">Waveform</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    The waveform shape of the carrier tone. Sine is typically
                    recommended for tinnitus therapy.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <WaveformSelector value={waveform} onChange={setWaveform} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Ear Selection
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Select which ear(s) to play the tone to. Use this if your
                    tinnitus is primarily in one ear.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex gap-2">
              <Button
                variant={earSelection === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEarSelection('left')}
                data-testid="button-ear-left"
              >
                Left
              </Button>
              <Button
                variant={earSelection === 'both' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEarSelection('both')}
                data-testid="button-ear-both"
              >
                Both
              </Button>
              <Button
                variant={earSelection === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEarSelection('right')}
                data-testid="button-ear-right"
              >
                Right
              </Button>
            </div>
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
            Current Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Frequency:</span>
              <span className="font-semibold">{frequency} Hz</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Modulation:</span>
              <span className="font-semibold">
                {modulationType.toUpperCase()}
              </span>
            </div>
            {modulationType !== 'cr' && (
              <>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Rate:</span>
                  <span className="font-semibold">
                    {modulationRate.toFixed(1)} Hz
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Depth:</span>
                  <span className="font-semibold">{modulationDepth}%</span>
                </div>
              </>
            )}
            {modulationType === 'cr' && (
              <>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Tone Duration:</span>
                  <span className="font-semibold">{crToneDuration} ms</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Gap Duration:</span>
                  <span className="font-semibold">{crGapDuration} ms</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">
                    Frequency Spread:
                  </span>
                  <span className="font-semibold">{crFrequencySpread}%</span>
                </div>
              </>
            )}
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Waveform:</span>
              <span className="font-semibold capitalize">{waveform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ear:</span>
              <span className="font-semibold capitalize">{earSelection}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>{t('tonalMasker:aboutNeuromodulation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>{t('tonalMasker:aboutNeuromodulationText')}</p>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Modulation Types:</h4>
            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
              <li>
                <strong>AM (Amplitude):</strong> Varies volume to create pulsing
                effect
              </li>
              <li>
                <strong>FM (Frequency):</strong> Varies pitch to create warble
                effect
              </li>
              <li>
                <strong>Both:</strong> Combines AM and FM modulation
              </li>
              <li>
                <strong>CR (Coordinated Reset):</strong> Randomized sequence of
                4 tones to desynchronize neural activity (based on clinical
                research)
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Usage Tips:</h4>
            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
              <li>Use at comfortable volume levels (30-50%)</li>
              <li>For AM/FM: Start with lower modulation rates (0.5-2 Hz)</li>
              <li>
                For CR: Use default settings (200ms tone, 50ms gap, 10% spread)
              </li>
              <li>Use for 15-30 minutes daily</li>
              <li>Results may take several weeks to appear</li>
            </ul>
          </div>
          <p className="text-xs pt-2 border-t">
            <strong>Note:</strong> This tool is for research and educational
            purposes. Consult with a healthcare professional before using as a
            treatment for tinnitus.
          </p>
        </CardContent>
      </Card>
    </>
  );

  return (
    <>
      <SEO pageName="tonalMasker" path="/tonal-masker" />
      <TooltipProvider>
        <ToolLayout
          title={t('tonalMasker:title')}
          description={t('tonalMasker:description')}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
        />
      </TooltipProvider>
    </>
  );
}
