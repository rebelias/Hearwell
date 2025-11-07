import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Home from "@/pages/Home";
import FrequencyFinder from "@/pages/FrequencyFinder";
import Audiometer from "@/pages/Audiometer";
import NoiseGenerator from "@/pages/NoiseGenerator";
import TinnitusMatching from "@/pages/TinnitusMatching";
import NotchedNoise from "@/pages/NotchedNoise";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/frequency-finder" component={FrequencyFinder} />
      <Route path="/audiometer" component={Audiometer} />
      <Route path="/noise-generator" component={NoiseGenerator} />
      <Route path="/tinnitus-matching" component={TinnitusMatching} />
      <Route path="/notched-noise" component={NotchedNoise} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Navigation />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
