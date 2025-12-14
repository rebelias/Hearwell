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
  const { t } = useTranslation(['tonalMasker', 'common', 'tools']);
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
                          {t('tonalMasker:frequencySpreadTooltip')}
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
                      {t('tonalMasker:randomizedModulation')}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          {t('tonalMasker:randomizedModulationDesc')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Button
                    variant={randomizeModulation ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRandomizeModulation(!randomizeModulation)}
                  >
                    {randomizeModulation
                      ? t('common:enabled')
                      : t('common:disabled')}
                  </Button>
                </div>

                {randomizeModulation && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {t('tonalMasker:modulationRateRange')}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {t('tonalMasker:modulationRateRangeValue', {
                            min: modulationRateRange[0].toFixed(1),
                            max: modulationRateRange[1].toFixed(1),
                          })}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-muted-foreground mb-1 block">
                            {t('common:min')}
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
                            {t('common:max')}
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
                            {t('tonalMasker:modulationDepthRange')}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {t('tonalMasker:modulationDepthRangeValue', {
                            min: modulationDepthRange[0],
                            max: modulationDepthRange[1],
                          })}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-muted-foreground mb-1 block">
                            {t('common:min')}
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
                            {t('common:max')}
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
                            {t('tonalMasker:randomizationInterval')}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {t('tonalMasker:randomizationIntervalValue', {
                            value: randomizationInterval,
                          })}
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
                        <span>
                          {t('tonalMasker:secondsValue', { value: 1 })}
                        </span>
                        <span>
                          {t('tonalMasker:secondsValue', { value: 5 })}
                        </span>
                        <span>
                          {t('tonalMasker:secondsValue', { value: 10 })}
                        </span>
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
              <span className="text-sm font-medium">
                {t('tonalMasker:backgroundSound')}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    {t('tonalMasker:backgroundSoundTooltip')}
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
                    {t(`tonalMasker:${sound}`)}
                  </Button>
                )
              )}
            </div>
            {backgroundSound !== 'none' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {t('tonalMasker:backgroundVolume')}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {t('tonalMasker:backgroundVolumeValue', {
                      value: backgroundVolume,
                    })}
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
          <CardDescription>{t('tonalMasker:toneSettingsDesc')}</CardDescription>
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
              <span className="text-sm text-muted-foreground">
                {t('tonalMasker:waveform')}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{t('tonalMasker:waveformTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <WaveformSelector value={waveform} onChange={setWaveform} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t('tonalMasker:earSelection')}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    {t('tonalMasker:earSelectionTooltip')}
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
        </CardContent>
      </Card>
    </>
  );

  const rightPanel = (
    <>
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-xl font-display font-bold text-primary">
            {t('tonalMasker:currentSettings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">
                {t('tonalMasker:baseFrequency')}
              </span>
              <span className="font-semibold">
                {t('tonalMasker:frequencyValue', { value: frequency })}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">
                {t('tonalMasker:modulationType')}
              </span>
              <span className="font-semibold">
                {t(`tonalMasker:${modulationType}`)}
              </span>
            </div>
            {modulationType !== 'cr' && (
              <>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">
                    {t('tonalMasker:modulationRate')}
                  </span>
                  <span className="font-semibold">
                    {t('tonalMasker:modulationRateValue', {
                      value: modulationRate.toFixed(1),
                    })}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">
                    {t('tonalMasker:modulationDepth')}
                  </span>
                  <span className="font-semibold">
                    {t('tonalMasker:percentageValue', {
                      value: modulationDepth,
                    })}
                  </span>
                </div>
              </>
            )}
            {modulationType === 'cr' && (
              <>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">
                    {t('tonalMasker:toneDuration')}
                  </span>
                  <span className="font-semibold">
                    {t('tonalMasker:millisecondsValue', {
                      value: crToneDuration,
                    })}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">
                    {t('tonalMasker:gapDuration')}
                  </span>
                  <span className="font-semibold">
                    {t('tonalMasker:millisecondsValue', {
                      value: crGapDuration,
                    })}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">
                    {t('tonalMasker:frequencySpread')}
                  </span>
                  <span className="font-semibold">
                    {t('tonalMasker:percentageValue', {
                      value: crFrequencySpread,
                    })}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">
                {t('tonalMasker:waveform')}
              </span>
              <span className="font-semibold capitalize">{waveform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('tonalMasker:earSelection')}
              </span>
              <span className="font-semibold capitalize">
                {t(`tools:${earSelection}`)}
              </span>
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
            <h4 className="font-semibold text-foreground">
              {t('tonalMasker:modulationTypesTitle')}
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
              <li>{t('tonalMasker:modulationTypeAmDescription')}</li>
              <li>{t('tonalMasker:modulationTypeFmDescription')}</li>
              <li>{t('tonalMasker:modulationTypeBothDescription')}</li>
              <li>{t('tonalMasker:modulationTypeCrDescription')}</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">
              {t('tonalMasker:usageTipsTitle')}
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
              <li>{t('tonalMasker:usageTipComfortableVolume')}</li>
              <li>{t('tonalMasker:usageTipStartLowerRates')}</li>
              <li>{t('tonalMasker:usageTipCrDefaults')}</li>
              <li>{t('tonalMasker:usageTipDuration')}</li>
              <li>{t('tonalMasker:usageTipPatience')}</li>
            </ul>
          </div>
          <p className="text-xs pt-2 border-t">
            <strong>{t('tonalMasker:noteLabel')}</strong>{' '}
            {t('tonalMasker:noteText')}
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
