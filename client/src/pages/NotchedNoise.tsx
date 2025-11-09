import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Copy, Download, Info } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNotchedNoise, NotchNoiseType } from "@/hooks/useNotchedNoise";
import { exportAudioAsWav, downloadBlob } from "@/lib/audioExport";

export default function NotchedNoise() {
  const [notchFrequency, setNotchFrequency] = useState(4000);
  const [notchWidth, setNotchWidth] = useState(500);
  const [noiseType, setNoiseType] = useState<NotchNoiseType>('white');
  const { toast } = useToast();
  const noiseEngine = useNotchedNoise();

  useEffect(() => {
    if (noiseEngine.isPlaying) {
      noiseEngine.updateNotch(notchFrequency, notchWidth);
    }
  }, [notchFrequency, notchWidth]);

  const handleNoiseTypeChange = (newType: NotchNoiseType) => {
    setNoiseType(newType);
    if (noiseEngine.isPlaying) {
      noiseEngine.replaceNoiseSource(notchFrequency, notchWidth, newType);
    }
  };

  const handleSaveSettings = () => {
    const settings = {
      notchFrequency,
      notchWidth,
      noiseType,
    };
    navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
    toast({
      title: "Settings Saved",
      description: "Your notched noise settings have been copied",
    });
  };

  const handleDownload = async () => {
    try {
      const duration = 30; // 30 seconds of audio

      const blob = await exportAudioAsWav(duration, (offlineCtx) => {
        // Create noise buffer
        const createNoiseBuffer = (type: NotchNoiseType) => {
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
          } else if (type === 'purple') {
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              const current = white - lastOut;
              output[i] = current;
              lastOut = white;
              output[i] *= 0.3;
            }
          }

          return buffer;
        };

        // Create nodes
        const noiseBuffer = createNoiseBuffer(noiseType);
        const noiseNode = offlineCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        const gainNode = offlineCtx.createGain();
        gainNode.gain.value = 0.3;

        // Create notch filter
        const notchFilter = offlineCtx.createBiquadFilter();
        notchFilter.type = 'notch';
        notchFilter.frequency.value = notchFrequency;
        notchFilter.Q.value = notchFrequency / notchWidth;

        // Connect nodes
        noiseNode.connect(notchFilter);
        notchFilter.connect(gainNode);
        gainNode.connect(offlineCtx.destination);

        noiseNode.start(0);
      });

      const filename = `notched-noise-${notchFrequency}Hz-${new Date().toISOString().split('T')[0]}.wav`;
      downloadBlob(blob, filename);

      toast({
        title: "Audio Downloaded",
        description: `30 seconds of notched ${noiseType} noise saved as WAV file`,
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-2">Notched Noise Generator</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Therapeutic noise with your tinnitus frequency removed
          </p>
        </div>

        <Alert className="mb-6 sm:mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle className="text-sm sm:text-base">How Notched Noise Works</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm">
            Notched noise therapy plays white noise with your tinnitus frequency "notched out" (removed). 
            Theory suggests this may help reduce tinnitus perception over time by retraining your brain.
            Set the notch frequency to match your tinnitus frequency.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Notch Settings</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Configure the frequency notch and noise type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 sm:space-y-8">
            {/* Audio Player */}
            <div className="flex justify-center">
              <AudioPlayer 
                isPlaying={noiseEngine.isPlaying} 
                onPlayPause={() => noiseEngine.toggle(notchFrequency, notchWidth, noiseType)}
              />
            </div>

            {/* Notch Frequency */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">Notch Frequency (Your Tinnitus)</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-primary" data-testid="text-notch-frequency">
                  {notchFrequency} Hz
                </span>
              </div>
              <Slider
                value={[notchFrequency]}
                onValueChange={([value]) => setNotchFrequency(value)}
                min={250}
                max={12000}
                step={50}
                className="w-full"
                data-testid="slider-notch-frequency"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>250 Hz</span>
                <span>3 kHz</span>
                <span>6 kHz</span>
                <span>12 kHz</span>
              </div>
            </div>

            {/* Notch Width */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Notch Width</span>
                <span className="text-lg font-semibold" data-testid="text-notch-width">
                  ±{notchWidth} Hz
                </span>
              </div>
              <Slider
                value={[notchWidth]}
                onValueChange={([value]) => setNotchWidth(value)}
                min={100}
                max={2000}
                step={50}
                className="w-full"
                data-testid="slider-notch-width"
              />
              <p className="text-xs text-muted-foreground">
                Frequencies from {notchFrequency - notchWidth}Hz to {notchFrequency + notchWidth}Hz will be removed
              </p>
            </div>

            {/* Noise Type */}
            <div className="space-y-3">
              <span className="text-sm text-muted-foreground">Base Noise Type</span>
              <RadioGroup value={noiseType} onValueChange={(value) => handleNoiseTypeChange(value as NotchNoiseType)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="white" id="white" data-testid="radio-white" />
                  <Label htmlFor="white" className="cursor-pointer">White Noise (Equal across all frequencies)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pink" id="pink" data-testid="radio-pink" />
                  <Label htmlFor="pink" className="cursor-pointer">Pink Noise (Softer, more low-frequency)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="purple" id="purple" data-testid="radio-purple" />
                  <Label htmlFor="purple" className="cursor-pointer">Purple Noise (Higher frequency emphasis)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleSaveSettings} className="gap-2" data-testid="button-save">
                <Copy className="h-4 w-4" />
                Save Settings
              </Button>
              <Button variant="outline" onClick={handleDownload} className="gap-2" data-testid="button-download">
                <Download className="h-4 w-4" />
                Download Audio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Info */}
        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Treatment Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              For best results, listen to notched noise for 1-2 hours per day at a comfortable volume 
              (just loud enough to mask your tinnitus). Continue this therapy for several weeks.
            </p>
            <p>
              <strong className="text-foreground">Important:</strong> This is a supplementary treatment approach. 
              Always consult with a healthcare professional about your tinnitus management plan.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
