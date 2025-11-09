import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ExternalLink } from "lucide-react";

export default function Learn() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
        Hearing & Tinnitus Info Hub
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
        A practical, science-based guide for people with ringing, hissing, pulsing, fullness, sound sensitivity, or hearing loss.
      </p>

      {/* Urgent Care Alert */}
      <Alert className="mb-6 sm:mb-8 border-destructive/50 bg-destructive/10" data-testid="alert-urgent">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <AlertDescription className="text-sm sm:text-base">
          <strong className="block mb-2">When to Seek Urgent Care (Same day if possible)</strong>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Sudden hearing loss in one ear</strong> (over hours to ≤3 days), with or without tinnitus/vertigo</li>
            <li><strong>Neurologic signs</strong> (face droop/weakness, numbness, severe headache, double vision)</li>
            <li><strong>Pulsatile tinnitus</strong> (sound in sync with heartbeat), especially new/worsening</li>
            <li><strong>Ear pain, fever, drainage</strong>, or post-head injury hearing change</li>
          </ul>
          <p className="mt-2 text-xs">If in doubt, treat as urgent and arrange medical assessment.</p>
        </AlertDescription>
      </Alert>

      {/* Quick Links */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Quick Links (Authoritative)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <a href="https://www.nidcd.nih.gov/health/tinnitus" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline" data-testid="link-nidcd">
            <ExternalLink className="h-4 w-4" />
            Tinnitus (overview – NIDCD/NIH)
          </a>
          <a href="https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/tinnitus/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline" data-testid="link-aaohns">
            <ExternalLink className="h-4 w-4" />
            AAO-HNS Tinnitus Guideline (clinician-oriented)
          </a>
          <a href="https://www.nice.org.uk/guidance/ng98" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline" data-testid="link-nice">
            <ExternalLink className="h-4 w-4" />
            Hearing Loss in Adults – NICE NG98 (UK)
          </a>
          <a href="https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/sudden-hearing-loss-update/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline" data-testid="link-sudden">
            <ExternalLink className="h-4 w-4" />
            Sudden Hearing Loss (AAO-HNS guideline update)
          </a>
          <a href="https://www.ncbi.nlm.nih.gov/books/NBK557713/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline" data-testid="link-hyperacusis">
            <ExternalLink className="h-4 w-4" />
            Hyperacusis (NIH/NCBI review)
          </a>
          <a href="https://jnis.bmj.com/content/17/9/916" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline" data-testid="link-pulsatile">
            <ExternalLink className="h-4 w-4" />
            Pulsatile Tinnitus – imaging algorithm (JNIS 2025)
          </a>
        </CardContent>
      </Card>

      {/* Symptom Table */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Symptom → What It Might Mean</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Symptom</th>
                  <th className="text-left p-2 font-semibold">Common Causes</th>
                  <th className="text-left p-2 font-semibold">First Steps</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-2 align-top"><strong>Ringing / hissing / buzzing</strong></td>
                  <td className="p-2 align-top text-muted-foreground">Noise-induced hearing loss, age-related loss, earwax, otitis, ototoxic meds, TMJ, stress/anxiety</td>
                  <td className="p-2 align-top text-muted-foreground">Check earwax; review meds; basic hearing screen; protect from loud sound</td>
                </tr>
                <tr>
                  <td className="p-2 align-top"><strong>Pulsing sound (heartbeat-like)</strong></td>
                  <td className="p-2 align-top text-muted-foreground">Vascular causes, high BP, anemia, thyroid disease, middle-ear myoclonus</td>
                  <td className="p-2 align-top text-muted-foreground">Measure BP; medical eval; consider imaging per clinician</td>
                </tr>
                <tr>
                  <td className="p-2 align-top"><strong>Sound sensitivity / pain to sound</strong></td>
                  <td className="p-2 align-top text-muted-foreground">Hyperacusis, migraine spectrum, anxiety, noise overexposure</td>
                  <td className="p-2 align-top text-muted-foreground">Reduce overprotection, gradual sound enrichment, CBT-based support</td>
                </tr>
                <tr>
                  <td className="p-2 align-top"><strong>Ear fullness / popping</strong></td>
                  <td className="p-2 align-top text-muted-foreground">Eustachian tube dysfunction, allergies, barotrauma, Ménière's</td>
                  <td className="p-2 align-top text-muted-foreground">Auto-insufflation (gently), treat nose/allergy, medical exam if persistent</td>
                </tr>
                <tr>
                  <td className="p-2 align-top"><strong>Vertigo + tinnitus + fluctuating hearing</strong></td>
                  <td className="p-2 align-top text-muted-foreground">Ménière's disease, vestibular migraine, SSCD</td>
                  <td className="p-2 align-top text-muted-foreground">ENT/otology evaluation</td>
                </tr>
                <tr>
                  <td className="p-2 align-top"><strong>Rapid one-sided hearing change</strong></td>
                  <td className="p-2 align-top text-muted-foreground">Sudden sensorineural hearing loss (SSNHL)</td>
                  <td className="p-2 align-top text-destructive font-semibold">URGENT ENT/audiology</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Conditions Library */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Condition Library</h2>
      
      <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
        <ConditionCard
          title="Tinnitus (non-pulsatile)"
          description="A sound no one else hears—often ringing, hissing, whistling. Frequently linked to hearing-pathway changes after noise exposure, aging, or middle-ear issues. Anxiety, poor sleep, and stress can amplify it."
          links={[
            { text: "NIDCD overview", url: "https://www.nidcd.nih.gov/health/tinnitus" },
            { text: "AAO-HNS CPG", url: "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/tinnitus/" }
          ]}
        />

        <ConditionCard
          title="Pulsatile Tinnitus"
          description="A rhythmic sound in time with your heartbeat. Needs medical evaluation to rule out vascular/middle-ear causes. Work-up may include targeted imaging based on exam."
          links={[
            { text: "JNIS imaging algorithm", url: "https://jnis.bmj.com/content/17/9/916" }
          ]}
        />

        <ConditionCard
          title="Hyperacusis (Sound Sensitivity)"
          description="Everyday sounds feel too loud or painful. Often co-occurs with tinnitus, migraine spectrum, or anxiety. Care focuses on graded sound exposure, counseling, and avoiding constant earplug use in safe environments."
          links={[
            { text: "NIH/NCBI review", url: "https://www.ncbi.nlm.nih.gov/books/NBK557713/" }
          ]}
        />

        <ConditionCard
          title="Ménière's Disease"
          description="Spells of vertigo, fluctuating hearing loss, tinnitus, and ear fullness (classically unilateral). Salt moderation, trigger management, and specialist care are typical."
        />

        <ConditionCard
          title="Sudden Sensorineural Hearing Loss (SSNHL)"
          description="Rapid inner-ear hearing drop (usually one ear) over ≤72 hours. This is an emergency. Early audiometry and evidence-based treatment (often steroids) improve odds of recovery."
          links={[
            { text: "AAO-HNS guideline", url: "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/sudden-hearing-loss-update/" }
          ]}
          urgent
        />

        <ConditionCard
          title="Noise-Induced Hearing Loss (NIHL)"
          description="From loud concerts, tools, gunfire, or long-term headphone overuse. Prevention (limits + protection) is key; hearing aids help when loss occurs."
        />

        <ConditionCard
          title="Presbycusis (Age-Related)"
          description="Gradual high-frequency hearing decline; speech sounds less clear, especially in noise. Modern hearing aids and communication strategies help."
        />

        <ConditionCard
          title="Eustachian Tube Dysfunction (ETD)"
          description="Ear pressure/fullness, popping, muffled hearing, often after colds/allergies or flights. Treat nose/allergy; autoinflation; specialist if persistent."
        />

        <ConditionCard
          title="Ototoxic Medications"
          description="Some antibiotics (e.g., aminoglycosides), chemotherapy (e.g., cisplatin), loop diuretics, high-dose salicylates/NSAIDs, and others can cause tinnitus or hearing loss. Never stop a prescribed drug without medical advice."
          links={[
            { text: "RNID info page", url: "https://rnid.org.uk/information-and-support/hearing-loss/types-of-hearing-loss-and-deafness/ototoxic-drugs-and-hearing-loss/" },
            { text: "NIH/NCBI review", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7328195/" }
          ]}
        />
      </div>

      {/* What Actually Helps */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">What Actually Helps? (Evidence-Based)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">For Non-pulsatile Tinnitus</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Education + reassurance:</strong> Tinnitus is a common brain/ear signal—severity often improves when you understand it</li>
              <li><strong className="text-foreground">Address hearing loss:</strong> Hearing aids can reduce tinnitus intrusiveness by restoring input</li>
              <li><strong className="text-foreground">Sound therapy/enrichment:</strong> Low-level ambient sound especially at night</li>
              <li><strong className="text-foreground">CBT-based approaches:</strong> Reduce distress, improve sleep and quality of life</li>
              <li><strong className="text-foreground">Sleep & stress care:</strong> Treat insomnia/anxiety; exercise and mindfulness help</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">For Hyperacusis</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Graded exposure + sound enrichment (do not live in earplugs)</li>
              <li>Treat comorbid migraine/anxiety</li>
              <li>CBT/skills training for sound tolerance</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">For Pulsatile Tinnitus</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Check blood pressure, anemia, thyroid, pregnancy, new meds</li>
              <li>Specialist exam + appropriate imaging</li>
              <li>Treat the cause (e.g., BP control, venous stenosis stenting, etc.)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Practical Daily Tactics */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Practical Daily Tactics</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li><strong className="text-foreground">Protect, don't isolate:</strong> Use hearing protection for truly loud settings (concerts, tools), but avoid constant plug use in normal sound</li>
            <li><strong className="text-foreground">Volume hygiene:</strong> 60/60 rule for headphones (≤60% volume, ≤60 minutes at a time)</li>
            <li><strong className="text-foreground">Sleep routine:</strong> Regular schedule, lower caffeine late, wind-down audio at low level</li>
            <li><strong className="text-foreground">Medication review:</strong> Ask your clinician to check for ototoxic risks</li>
            <li><strong className="text-foreground">Track patterns:</strong> Log tinnitus loudness vs. stress, sleep, BP, caffeine, salt, alcohol</li>
          </ul>
        </CardContent>
      </Card>

      {/* Glossary */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Glossary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div><strong>Audiogram:</strong> Graph of hearing thresholds</div>
          <div><strong>CBT:</strong> Cognitive behavioral therapy</div>
          <div><strong>ETD:</strong> Eustachian tube dysfunction</div>
          <div><strong>Hyperacusis:</strong> Painful/irritating loudness of everyday sounds</div>
          <div><strong>NIHL:</strong> Noise-induced hearing loss</div>
          <div><strong>Pulsatile tinnitus:</strong> Tinnitus in time with the heartbeat</div>
          <div><strong>SSNHL:</strong> Sudden sensorineural hearing loss (inner-ear)</div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert className="bg-muted/50">
        <AlertDescription className="text-xs sm:text-sm">
          <strong>Disclaimer:</strong> This guide is for education, not personal medical advice. If you have red-flag symptoms or worsening issues, seek in-person care promptly.
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface ConditionCardProps {
  title: string;
  description: string;
  links?: { text: string; url: string }[];
  urgent?: boolean;
}

function ConditionCard({ title, description, links, urgent }: ConditionCardProps) {
  return (
    <Card className={urgent ? "border-destructive/50" : ""}>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          {urgent && <AlertTriangle className="h-4 w-4 text-destructive" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{description}</p>
        {links && links.length > 0 && (
          <div className="space-y-1">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-primary hover:underline"
                data-testid={`link-${title.toLowerCase().replace(/\s+/g, '-')}-${idx}`}
              >
                <ExternalLink className="h-3 w-3" />
                {link.text}
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
