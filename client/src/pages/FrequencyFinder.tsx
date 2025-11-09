import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Copy, Share2, Info, HelpCircle } from "lucide-react";
import WaveformSelector, { WaveformType } from "@/components/WaveformSelector";
import AudioPlayer from "@/components/AudioPlayer";
import { useToast } from "@/hooks/use-toast";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export default function FrequencyFinder() {
  const [frequency, setFrequency] = useState(1000);
  const [waveform, setWaveform] = useState<WaveformType>('sine');
  const { toast } = useToast();
  
  const audioEngine = useAudioEngine({ frequency, waveform, volume: 50 });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const freq = params.get('freq');
    const wave = params.get('wave');
    
    if (freq) {
      const parsedFreq = parseInt(freq, 10);
      if (parsedFreq >= 50 && parsedFreq <= 20000) {
        setFrequency(parsedFreq);
      }
    }
    
    if (wave && ['sine', 'square', 'triangle', 'sawtooth', 'filtered', 'noise'].includes(wave)) {
      setWaveform(wave as WaveformType);
    }
  }, []);

  useEffect(() => {
    audioEngine.updateFrequency(frequency);
  }, [frequency]);

  useEffect(() => {
    audioEngine.updateWaveform(waveform);
  }, [waveform]);

  const handleCopySettings = () => {
    const settings = `Frequency: ${frequency}Hz, Waveform: ${waveform}`;
    navigator.clipboard.writeText(settings);
    toast({
      title: "Settings Copied",
      description: "Your tinnitus settings have been copied to clipboard",
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/frequency-finder?freq=${frequency}&wave=${waveform}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Shareable link copied to clipboard",
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="mb-6 sm:mb-8">
            <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-2">Tinnitus Frequency Finder</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Find the frequency that matches your tinnitus by adjusting the slider
            </p>
          </div>

          <Alert className="mb-6 sm:mb-8">
            <Info className="h-4 w-4" />
            <AlertTitle className="text-sm sm:text-base">Instructions</AlertTitle>
            <AlertDescription className="text-xs sm:text-sm">
              Click PLAY and adjust the frequency slider until you find the tone that matches your tinnitus. 
              Then select the waveform quality that most closely matches how your tinnitus sounds.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Frequency Control</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Adjust the frequency from 50Hz to 20,000Hz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 sm:space-y-8">
            {/* Audio Player */}
            <div className="flex justify-center">
              <AudioPlayer 
                isPlaying={audioEngine.isPlaying} 
                onPlayPause={audioEngine.toggle}
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
                      <p className="text-xs sm:text-sm">Frequency is the pitch of sound measured in Hertz (Hz). Lower numbers = deeper sounds (like thunder), higher numbers = sharper sounds (like a whistle)</p>
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
                    <p className="text-xs sm:text-sm">Different waveforms create different sound qualities. Sine = pure tone, Square = buzzy, Triangle = hollow, Sawtooth = harsh, Filtered = softer, Noise = static-like</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <WaveformSelector value={waveform} onChange={setWaveform} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleCopySettings} className="gap-2" data-testid="button-copy-settings">
                <Copy className="h-4 w-4" />
                Copy Settings
              </Button>
              <Button variant="outline" onClick={handleShare} className="gap-2" data-testid="button-share">
                <Share2 className="h-4 w-4" />
                Share Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Educational Info */}
        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">About This Tool</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              This frequency finder helps you identify the specific pitch of your tinnitus. Most people 
              experience tinnitus in the range of 3,000-8,000 Hz, but it can vary significantly.
            </p>
            <p>
              Once you've identified your frequency, you can use this information with our other treatment 
              tools like the Notched Noise Generator or discuss it with your healthcare provider.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    </TooltipProvider>
  );
}
