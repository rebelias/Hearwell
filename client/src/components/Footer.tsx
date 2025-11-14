import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation(['footer', 'common']);

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} HearWell
          </p>
          <span className="hidden sm:inline text-xs text-muted-foreground">
            •
          </span>
          <Link
            href="/disclaimer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('footer:disclaimerLink')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
