import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Copy, Share2, Info, HelpCircle, Download } from "lucide-react";
import WaveformSelector, { WaveformType } from "@/components/WaveformSelector";
import AudioPlayer from "@/components/AudioPlayer";
import { useToast } from "@/hooks/use-toast";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { exportAudioAsWav, downloadBlob } from "@/lib/audioExport";

export default function TinnitusMatching() {
  const [frequency, setFrequency] = useState(4000);
  const [waveform, setWaveform] = useState<WaveformType>('sine');
  const [volume, setVolume] = useState(50);
  const { toast } = useToast();
  
  const audioEngine = useAudioEngine({ frequency, waveform, volume });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const freq = params.get('freq');
    const wave = params.get('wave');
    const vol = params.get('vol');
    
    if (freq) {
      const parsedFreq = parseInt(freq, 10);
      if (parsedFreq >= 50 && parsedFreq <= 20000) {
        setFrequency(parsedFreq);
      }
    }
    
    if (wave && ['sine', 'square', 'triangle', 'sawtooth', 'filtered', 'noise'].includes(wave)) {
      setWaveform(wave as WaveformType);
    }
    
    if (vol) {
      const parsedVol = parseInt(vol, 10);
      if (parsedVol >= 0 && parsedVol <= 100) {
        setVolume(parsedVol);
      }
    }
  }, []);

  useEffect(() => {
    audioEngine.updateFrequency(frequency);
  }, [frequency]);

  useEffect(() => {
    audioEngine.updateVolume(volume);
  }, [volume]);

  useEffect(() => {
    audioEngine.updateWaveform(waveform);
  }, [waveform]);

  const handleSaveSettings = () => {
    const settings = {
      frequency,
      waveform,
      volume,
      url: `${window.location.origin}/tinnitus-matching?freq=${frequency}&wave=${waveform}&vol=${volume}`
    };
    navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
    toast({
      title: "Settings Copied",
      description: "Your tinnitus tone settings have been saved to clipboard",
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/tinnitus-matching?freq=${frequency}&wave=${waveform}&vol=${volume}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Share this link to let others hear your tinnitus tone",
    });
  };

  const handleDownload = async () => {
    try {
      const duration = 30; // 30 seconds of audio
      const normalizedVolume = volume / 100;

      const blob = await exportAudioAsWav(duration, (offlineCtx) => {
        const gainNode = offlineCtx.createGain();
        gainNode.gain.value = normalizedVolume * 0.3;

        if (waveform === 'noise') {
          // Create white noise buffer
          const bufferSize = offlineCtx.sampleRate * 2;
          const buffer = offlineCtx.createBuffer(1, bufferSize, offlineCtx.sampleRate);
          const output = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          
          const noiseSource = offlineCtx.createBufferSource();
          noiseSource.buffer = buffer;
          noiseSource.loop = true;
          noiseSource.connect(gainNode);
          gainNode.connect(offlineCtx.destination);
          noiseSource.start(0);
        } else {
          // Create oscillator for all other waveforms
          const oscillator = offlineCtx.createOscillator();
          oscillator.frequency.value = frequency;
          oscillator.type = (waveform === 'filtered' ? 'sine' : waveform) as OscillatorType;
          
          // Apply low-pass filter for 'filtered' waveform
          if (waveform === 'filtered') {
            const lowpassFilter = offlineCtx.createBiquadFilter();
            lowpassFilter.type = 'lowpass';
            lowpassFilter.frequency.value = 1000; // 1kHz cutoff for softer sound
            lowpassFilter.Q.value = 1;
            
            oscillator.connect(lowpassFilter);
            lowpassFilter.connect(gainNode);
          } else {
            oscillator.connect(gainNode);
          }
          
          gainNode.connect(offlineCtx.destination);
          oscillator.start(0);
        }
      });

      const filename = `tinnitus-tone-${frequency}Hz-${waveform}-${new Date().toISOString().split('T')[0]}.wav`;
      downloadBlob(blob, filename);

      toast({
        title: "Tone Downloaded",
        description: `30 seconds of your matched tinnitus tone saved as WAV file`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to export audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="mb-6 sm:mb-8">
            <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-2">Tinnitus Matching Tool</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Match and share your exact tinnitus tone with others
            </p>
          </div>

          <Alert className="mb-6 sm:mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle className="text-sm sm:text-base">How to Match Your Tinnitus</AlertTitle>
            <AlertDescription className="text-xs sm:text-sm">
              Click PLAY and adjust the frequency slider until it matches your tinnitus. Select the waveform 
              that best represents the quality of your tinnitus sound, then save or share your settings.
            </AlertDescription>
          </Alert>

        <Tabs defaultValue="match" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="match" data-testid="tab-match">Match Tone</TabsTrigger>
            <TabsTrigger value="info" data-testid="tab-info">Information</TabsTrigger>
          </TabsList>

          <TabsContent value="match" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Tone Controls</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Fine-tune your tinnitus tone match</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 sm:space-y-8">
                {/* Audio Player */}
                <div className="flex justify-center">
                  <AudioPlayer 
                    isPlaying={audioEngine.isPlaying} 
                    onPlayPause={audioEngine.toggle}
                    volume={volume}
                    onVolumeChange={setVolume}
                    showVolume
                  />
                </div>

                {/* Frequency Slider */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">Frequency (Hz)</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs sm:text-sm">The pitch of your tinnitus sound. Lower = deeper (like a hum), higher = sharper (like a whistle). Most tinnitus is between 3-8 kHz.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-primary" data-testid="text-frequency">
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

                {/* Waveform Selector */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Tone Quality (Waveform)</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs sm:text-sm">How your tinnitus sounds: Sine = pure ring, Square = buzzy, Triangle = hollow, Sawtooth = harsh, Filtered = soft, Noise = hissing</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <WaveformSelector value={waveform} onChange={setWaveform} />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button onClick={handleSaveSettings} className="gap-2" data-testid="button-save-settings">
                    <Copy className="h-4 w-4" />
                    Save Settings
                  </Button>
                  <Button variant="outline" onClick={handleShare} className="gap-2" data-testid="button-share-tone">
                    <Share2 className="h-4 w-4" />
                    Share Tone
                  </Button>
                  <Button variant="outline" onClick={handleDownload} className="gap-2" data-testid="button-download">
                    <Download className="h-4 w-4" />
                    Download Audio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Tinnitus Matching</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Tinnitus matching helps you identify and communicate the specific characteristics of your 
                  tinnitus to healthcare providers and researchers.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Common Tinnitus Frequencies:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Low-pitched (250-1000 Hz): Often described as humming or rumbling</li>
                    <li>Mid-range (1000-4000 Hz): Common range for many tinnitus sufferers</li>
                    <li>High-pitched (4000-8000 Hz): Often described as ringing or whistling</li>
                    <li>Very high (8000+ Hz): Described as hissing or cicada-like</li>
                  </ul>
                </div>
                <p>
                  Once you've matched your tinnitus, you can use this information with treatment tools 
                  like the Notched Noise Generator for potential therapeutic benefit.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </TooltipProvider>
  );
}
