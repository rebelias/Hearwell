import { Link, useLocation } from 'wouter';
import { Menu, Moon, Sun, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const [location] = useLocation();
  const { t } = useTranslation('navigation');
  // Initialize from DOM to avoid setState in useEffect
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  const navItems = [
    { path: '/', label: t('home') },
    { path: '/audiometer', label: t('audiometer') },
    { path: '/tonal-masker', label: t('tonalMasker') },
    { path: '/frequency-finder', label: t('frequencyFinder') },
    { path: '/noise-generator', label: t('noiseGenerator') },
    { path: '/notched-noise', label: t('notchedNoise') },
    { path: '/learn', label: t('learn') },
    { path: '/about', label: t('about') },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2"
          >
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-xl">HearWell</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.slice(1).map(item => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? 'default' : 'ghost'}
                  size="sm"
                  data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="button-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-2 mt-8">
                  {navItems.map(item => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant={location === item.path ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
