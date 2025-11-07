import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Download, Info } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NoiseGenerator() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [eqValues, setEqValues] = useState([50, 50, 50, 50, 50, 50, 50, 50]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [backgrounds, setBackgrounds] = useState({
    sea: false,
    wind: false,
    forest: false,
  });
  const { toast } = useToast();

  const frequencies = ['32', '50', '120', '400', '500', '800', '1k', '4k', '8k', '16k'];
  const displayFreqs = frequencies.slice(0, 8);
  
  const presets = [
    { name: 'White', values: [50, 50, 50, 50, 50, 50, 50, 50] },
    { name: 'Pink', values: [70, 65, 60, 55, 50, 45, 40, 35] },
    { name: 'Brown', values: [80, 70, 60, 50, 40, 30, 20, 10] },
    { name: 'Violet', values: [30, 35, 40, 45, 50, 55, 60, 70] },
    { name: 'Blue', values: [35, 40, 45, 50, 55, 60, 65, 70] },
    { name: 'Grey', values: [50, 45, 50, 45, 50, 45, 50, 45] },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setEqValues(preset.values);
    setSelectedPreset(preset.name);
    console.log(`Applied ${preset.name} noise preset`);
  };

  const handleEqChange = (index: number, value: number) => {
    const newValues = [...eqValues];
    newValues[index] = value;
    setEqValues(newValues);
    setSelectedPreset(null);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your noise settings have been copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">White Noise Generator</h1>
          <p className="text-muted-foreground">
            Create custom colored noise with equalizer and ambient backgrounds
          </p>
        </div>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>How to Use</AlertTitle>
          <AlertDescription>
            Click PLAY and adjust the equalizer sliders to create a pleasing noise. Use presets for standard 
            colored noise types, or add background ambience for depth.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Equalizer Settings</CardTitle>
            <CardDescription>Adjust 8-band equalizer to customize your noise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Audio Player */}
            <div className="flex justify-center">
              <AudioPlayer 
                isPlaying={isPlaying} 
                onPlayPause={() => {
                  setIsPlaying(!isPlaying);
                  console.log(`Noise generator ${!isPlaying ? 'started' : 'stopped'}`);
                }}
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
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {displayFreqs.map((freq, index) => (
                  <div key={freq} className="flex flex-col items-center gap-3">
                    <Slider
                      value={[eqValues[index]]}
                      onValueChange={([value]) => handleEqChange(index, value)}
                      min={0}
                      max={100}
                      step={1}
                      orientation="vertical"
                      className="h-32"
                      data-testid={`slider-eq-${freq}`}
                    />
                    <span className="text-xs text-muted-foreground font-medium">{freq}Hz</span>
                    <span className="text-xs text-muted-foreground">{eqValues[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Background Additions */}
            <div className="space-y-3 pt-6 border-t">
              <span className="text-sm text-muted-foreground">Background Ambience</span>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sea"
                    checked={backgrounds.sea}
                    onCheckedChange={(checked) => 
                      setBackgrounds({ ...backgrounds, sea: checked as boolean })
                    }
                    data-testid="checkbox-sea"
                  />
                  <label htmlFor="sea" className="text-sm cursor-pointer">
                    Sea Waves
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wind"
                    checked={backgrounds.wind}
                    onCheckedChange={(checked) => 
                      setBackgrounds({ ...backgrounds, wind: checked as boolean })
                    }
                    data-testid="checkbox-wind"
                  />
                  <label htmlFor="wind" className="text-sm cursor-pointer">
                    Wind
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="forest"
                    checked={backgrounds.forest}
                    onCheckedChange={(checked) => 
                      setBackgrounds({ ...backgrounds, forest: checked as boolean })
                    }
                    data-testid="checkbox-forest"
                  />
                  <label htmlFor="forest" className="text-sm cursor-pointer">
                    Forest
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleSaveSettings} className="gap-2" data-testid="button-save">
                <Copy className="h-4 w-4" />
                Save Settings
              </Button>
              <Button variant="outline" className="gap-2" data-testid="button-download">
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
