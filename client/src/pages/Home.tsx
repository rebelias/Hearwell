import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Volume2, Waves, SlidersHorizontal, Filter, Sparkles } from "lucide-react";

export default function Home() {
  const tools = [
    {
      title: "Frequency Finder",
      description: "Find your tinnitus frequency using an interactive slider with multiple waveform options",
      icon: Activity,
      path: "/frequency-finder",
      color: "text-primary",
    },
    {
      title: "Online Audiometer",
      description: "Complete hearing test with interactive audiogram chart for professional assessments",
      icon: Volume2,
      path: "/audiometer",
      color: "text-secondary",
    },
    {
      title: "Noise Generator",
      description: "Create custom white noise with 8-band equalizer and ambient background sounds",
      icon: Waves,
      path: "/noise-generator",
      color: "text-chart-1",
    },
    {
      title: "Tinnitus Matching",
      description: "Match and share your exact tinnitus tone with frequency and waveform controls",
      icon: SlidersHorizontal,
      path: "/tinnitus-matching",
      color: "text-chart-3",
    },
    {
      title: "Notched Noise",
      description: "Generate therapeutic notched white noise for tinnitus treatment",
      icon: Filter,
      path: "/notched-noise",
      color: "text-chart-5",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-primary/10 rounded-2xl">
              <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </div>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 px-2">
            Comprehensive Hearing Health Tools
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
            Professional-grade tools for tinnitus management and hearing assessment. 
            No downloads required, just headphones and your device.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/frequency-finder">
              <Button size="lg" className="gap-2" data-testid="button-get-started">
                <Activity className="h-5 w-5" />
                Get Started
              </Button>
            </Link>
            <Button size="lg" variant="outline" data-testid="button-learn-more">
              Learn More
            </Button>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.path} className="hover-elevate transition-all">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-3 bg-muted rounded-lg ${tool.color}`}>
                    <tool.icon className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="font-display">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={tool.path}>
                  <Button className="w-full" data-testid={`button-start-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    Start Tool
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <Card className="mt-16 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Medical Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              An online hearing test performed in an uncontrolled environment cannot replace calibrated tests 
              performed in a sound-proof booth with a professional audiologist. This information should not be 
              considered medical advice. If you have a medical problem, please contact your local physician for 
              diagnosis and treatment.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
