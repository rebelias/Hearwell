import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Send, CheckCircle2, Heart } from 'lucide-react';
import SEO from '@/components/SEO';

export default function Feedback() {
  const { t } = useTranslation(['feedback', 'common']);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Formspree endpoint for HearWell feedback
      const response = await fetch('https://formspree.io/f/meeoqalv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: feedback,
          _subject: 'New HearWell Feedback',
          _replyto: 'noreply@hearwell.life',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFeedback('');
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      setError(t('feedback:submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO pageName="feedback" path="/feedback" />

      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h1 className="font-display font-bold text-3xl sm:text-4xl mb-3">
              {t('feedback:title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('feedback:subtitle')}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                {t('feedback:formTitle')}
              </CardTitle>
              <CardDescription>{t('feedback:formDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    {t('feedback:successMessage')}
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Alert>
                    <AlertDescription className="text-sm">
                      {t('feedback:privacyNotice')}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="feedback">
                      {t('feedback:messageLabel')}
                    </Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      placeholder={t('feedback:messagePlaceholder')}
                      rows={8}
                      required
                      minLength={10}
                      maxLength={2000}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {feedback.length}/2000
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || feedback.length < 10}
                    className="w-full"
                    size="lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting
                      ? t('feedback:submitting')
                      : t('feedback:submit')}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('feedback:whyFeedbackTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>✅ {t('feedback:benefit1')}</p>
              <p>✅ {t('feedback:benefit2')}</p>
              <p>✅ {t('feedback:benefit3')}</p>
              <p>✅ {t('feedback:benefit4')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
