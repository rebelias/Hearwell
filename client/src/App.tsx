import { useState } from 'react';
import { Switch, Route } from 'wouter';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DisclaimerModal from '@/components/DisclaimerModal';
import CalibrationModal from '@/components/CalibrationModal';
import Home from '@/pages/Home';
import FrequencyFinder from '@/pages/FrequencyFinder';
import Audiometer from '@/pages/Audiometer';
import NoiseGenerator from '@/pages/NoiseGenerator';
import NotchedNoise from '@/pages/NotchedNoise';
import TonalMasker from '@/pages/TonalMasker';
import Learn from '@/pages/Learn';
import Disclaimer from '@/pages/Disclaimer';
import About from '@/pages/About';
import Feedback from '@/pages/Feedback';
import NotFound from '@/pages/not-found';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/frequency-finder" component={FrequencyFinder} />
      <Route path="/audiometer" component={Audiometer} />
      <Route path="/noise-generator" component={NoiseGenerator} />
      <Route path="/notched-noise" component={NotchedNoise} />
      <Route path="/tonal-masker" component={TonalMasker} />
      <Route path="/learn" component={Learn} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/about" component={About} />
      <Route path="/feedback" component={Feedback} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize state from localStorage to avoid setState in useEffect
  const [showCalibration, setShowCalibration] = useState(() => {
    const hasAcceptedDisclaimer = localStorage.getItem(
      'hearwell-disclaimer-accepted'
    );
    const calibrated = localStorage.getItem('audiometer-calibrated');
    return hasAcceptedDisclaimer === 'true' && calibrated === null;
  });

  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    return localStorage.getItem('hearwell-disclaimer-accepted') === 'true';
  });

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
    // Show calibration modal after disclaimer is accepted
    const calibrated = localStorage.getItem('audiometer-calibrated');
    if (calibrated === null) {
      setShowCalibration(true);
    }
  };

  const handleCalibrationComplete = () => {
    setShowCalibration(false);
  };

  // Block access if disclaimer not accepted
  if (!disclaimerAccepted) {
    return (
      <ErrorBoundary>
        <HelmetProvider>
          <TooltipProvider>
            <DisclaimerModal onAccept={handleDisclaimerAccept} />
            <div className="min-h-screen flex flex-col opacity-50 pointer-events-none select-none">
              <Navigation />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
          </TooltipProvider>
        </HelmetProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <TooltipProvider>
          <DisclaimerModal onAccept={handleDisclaimerAccept} />
          {showCalibration && (
            <>
              <CalibrationModal
                open={showCalibration}
                onCalibrationComplete={handleCalibrationComplete}
              />
              {/* Block site interaction while calibration is open */}
              <div className="fixed inset-0 z-[99] bg-background/80 pointer-events-auto" />
            </>
          )}
          <div
            className={`min-h-screen flex flex-col ${showCalibration ? 'opacity-50 pointer-events-none select-none' : ''}`}
          >
            <Navigation />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
