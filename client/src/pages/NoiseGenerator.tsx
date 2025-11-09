import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Copy, Download, Info, HelpCircle } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNoiseGenerator, NoiseColor } from "@/hooks/useNoiseGenerator";
import { exportAudioAsWav, downloadBlob } from "@/lib/audioExport";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NoiseGenerator() {
  const [eqValues, setEqValues] = useState([50, 50, 50, 50, 50, 50, 50, 50]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [noiseColor, setNoiseColor] = useState<NoiseColor>('white');
  const { toast } = useToast();
  const noiseEngine = useNoiseGenerator();

  const frequencies = ['32', '64', '125', '250', '500', '1k', '2k', '4k'];
  
  const presets: Array<{ name: string; values: number[]; color: NoiseColor }> = [
    { name: 'White', values: [50, 50, 50, 50, 50, 50, 50, 50], color: 'white' },
    { name: 'Pink', values: [70, 65, 60, 55, 50, 45, 40, 35], color: 'pink' },
    { name: 'Brown', values: [80, 70, 60, 50, 40, 30, 20, 10], color: 'brown' },
    { name: 'Violet', values: [30, 35, 40, 45, 50, 55, 60, 70], color: 'violet' },
    { name: 'Blue', values: [35, 40, 45, 50, 55, 60, 65, 70], color: 'blue' },
    { name: 'Grey', values: [50, 45, 50, 45, 50, 45, 50, 45], color: 'grey' },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setEqValues(preset.values);
    setNoiseColor(preset.color);
    setSelectedPreset(preset.name);
    if (noiseEngine.isPlaying) {
      noiseEngine.stop();
      setTimeout(() => noiseEngine.play(preset.values, preset.color), 50);
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
      setTimeout(() => noiseEngine.play(eqValues, noiseColor), 50);
    }
  }, [noiseColor]);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your noise settings have been copied to clipboard",
    });
  };

  const handleDownload = async () => {
    try {
      const duration = 30; // 30 seconds of audio

      const blob = await exportAudioAsWav(duration, (offlineCtx) => {
        // Create noise buffer
        const createNoiseBuffer = (type: NoiseColor) => {
          const bufferSize = offlineCtx.sampleRate * 2;
          const buffer = offlineCtx.createBuffer(1, bufferSize, offlineCtx.sampleRate);
          const output = buffer.getChannelData(0);

          if (type === 'white') {
            for (let i = 0; i < bufferSize; i++) {
              output[i] = Math.random() * 2 - 1;
            }
          } else if (type === 'pink') {
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              b0 = 0.99886 * b0 + white * 0.0555179;
              b1 = 0.99332 * b1 + white * 0.0750759;
              b2 = 0.96900 * b2 + white * 0.1538520;
              b3 = 0.86650 * b3 + white * 0.3104856;
              b4 = 0.55000 * b4 + white * 0.5329522;
              b5 = -0.7616 * b5 - white * 0.0168980;
              output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
              output[i] *= 0.11;
              b6 = white * 0.115926;
            }
          } else if (type === 'brown') {
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              output[i] = (lastOut + (0.02 * white)) / 1.02;
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

        // Create nodes
        const noiseBuffer = createNoiseBuffer(noiseColor);
        const noiseNode = offlineCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        const gainNode = offlineCtx.createGain();
        gainNode.gain.value = 0.3;

        // Create 8-band EQ
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

        // Connect nodes
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
        title: "Audio Downloaded",
        description: `30 seconds of ${noiseColor} noise saved as WAV file`,
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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-2">Noise Generator</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Create custom colored noise with 8-band equalizer
          </p>
        </div>

        <Alert className="mb-6 sm:mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle className="text-sm sm:text-base">How to Use</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm">
            Click PLAY and adjust the equalizer sliders to create a pleasing noise. Use presets for standard 
            colored noise types like white, pink, brown, violet, blue, or grey noise.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Equalizer Settings</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Adjust 8-band equalizer to customize your noise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 sm:space-y-8">
            {/* Audio Player */}
            <div className="flex justify-center">
              <AudioPlayer 
                isPlaying={noiseEngine.isPlaying} 
                onPlayPause={() => noiseEngine.toggle(eqValues, noiseColor)}
              />
            </div>

            {/* Presets */}
            <div className="space-y-3">
              <span className="text-sm text-muted-foreground">Colored Noise Presets</span>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant={selectedPreset === preset.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => applyPreset(preset)}
                    data-testid={`button-preset-${preset.name.toLowerCase()}`}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Equalizer */}
            <div className="space-y-6">
              <div className="space-y-4">
                {frequencies.map((freq: string, index: number) => (
                  <div key={freq} className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-muted-foreground font-medium min-w-[60px]">{freq}Hz</span>
                      <Slider
                        value={[eqValues[index]]}
                        onValueChange={([value]) => handleEqChange(index, value)}
                        min={0}
                        max={100}
                        step={1}
                        className="flex-1"
                        data-testid={`slider-eq-${freq}`}
                      />
                      <span className="text-sm text-muted-foreground min-w-[40px] text-right">{eqValues[index]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleSaveSettings} className="gap-2" data-testid="button-save">
                <Copy className="h-4 w-4" />
                Save Settings
              </Button>
              <Button variant="outline" onClick={handleDownload} className="gap-2" data-testid="button-download">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">About Colored Noise</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Different colored noises emphasize different frequency ranges. White noise has equal energy 
              across all frequencies, while pink noise emphasizes lower frequencies for a softer sound.
            </p>
            <p>
              Experiment with the equalizer to find the most pleasing and effective masking sound for your tinnitus.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
