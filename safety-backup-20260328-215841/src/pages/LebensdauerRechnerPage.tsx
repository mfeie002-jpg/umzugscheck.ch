/**
 * Lebensdauer-Rechner Page
 * 
 * Public tool for calculating fixture depreciation based on
 * the Swiss Paritätische Lebensdauertabelle.
 * 
 * SEO target: "lebensdauertabelle rechner", "wohnungsabgabe abzüge"
 */

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LebensdauerCalculator } from '@/components/relo-os/LebensdauerCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Calculator, 
  Scale, 
  BookOpen, 
  CheckCircle, 
  HelpCircle,
  ExternalLink,
  Shield
} from 'lucide-react';
import type { DamageAssessment } from '@/lib/relo-os/swiss-integration/lebensdauer';

export default function LebensdauerRechnerPage() {
  const [assessments, setAssessments] = useState<DamageAssessment[]>([]);

  const handleAssessment = (assessment: DamageAssessment) => {
    setAssessments(prev => [...prev, assessment]);
  };

  const totalTenant = assessments.reduce((sum, a) => sum + a.tenantPaysCHF, 0);
  const totalLandlord = assessments.reduce((sum, a) => sum + a.landlordPaysCHF, 0);

  return (
    <>
      <Helmet>
        <title>Lebensdauer-Rechner | Wohnungsabgabe Abzüge berechnen | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Kostenloser Rechner für die Wohnungsabgabe: Berechnen Sie Abzüge nach der paritätischen Lebensdauertabelle. Schützen Sie sich vor überhöhten Forderungen." 
        />
        <meta name="keywords" content="lebensdauertabelle, wohnungsabgabe, abzüge berechnen, mieterrechte, restwert, amortisation" />
        <link rel="canonical" href="https://umzugscheck.ch/lebensdauer-rechner" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Lebensdauer-Rechner",
            "description": "Berechnen Sie Abzüge bei der Wohnungsabgabe nach der paritätischen Lebensdauertabelle",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "CHF"
            },
            "provider": {
              "@type": "Organization",
              "name": "Umzugscheck.ch"
            }
          })}
        </script>
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4" variant="outline">
                <Scale className="w-3 h-3 mr-1" />
                Offiziell nach SMV/HEV Tabelle
              </Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Lebensdauer-Rechner
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                Berechnen Sie Abzüge bei der Wohnungsabgabe nach der 
                <strong> paritätischen Lebensdauertabelle</strong>. 
                Schützen Sie sich vor überhöhten Forderungen.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>100% kostenlos</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>100+ Gegenstände</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Rechtlich fundiert</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Calculator Section */}
        <section className="py-12 md:py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calculator */}
              <div className="lg:col-span-2">
                <LebensdauerCalculator onAssessmentComplete={handleAssessment} />
              </div>

              {/* Results Summary */}
              <div className="space-y-6">
                {/* Saved Assessments */}
                {assessments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Ihre Berechnung
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {assessments.map((a, i) => (
                        <div key={i} className="flex justify-between items-center text-sm border-b pb-2">
                          <div>
                            <div className="font-medium">{a.fixtureName}</div>
                            <div className="text-xs text-muted-foreground">
                              {a.depreciation.residualPercent}% Restwert
                            </div>
                          </div>
                          {a.replacementCostCHF > 0 && (
                            <div className="text-right">
                              <div className="font-medium text-primary">
                                CHF {a.tenantPaysCHF}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {(totalTenant > 0 || totalLandlord > 0) && (
                        <div className="pt-2 space-y-1">
                          <div className="flex justify-between font-semibold">
                            <span>Total Mieter:</span>
                            <span className="text-primary">CHF {totalTenant.toLocaleString('de-CH')}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Total Vermieter:</span>
                            <span>CHF {totalLandlord.toLocaleString('de-CH')}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Was ist die Lebensdauertabelle?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-3">
                    <p>
                      Die <strong>paritätische Lebensdauertabelle</strong> wird vom 
                      Schweizerischen Mieterinnen- und Mieterverband (SMV) und dem 
                      Hauseigentümerverband (HEV) gemeinsam herausgegeben.
                    </p>
                    <p>
                      Sie definiert die <strong>übliche Lebensdauer</strong> von 
                      Einrichtungsgegenständen in Mietwohnungen und dient als 
                      Grundlage für die Berechnung von Abzügen bei der Wohnungsabgabe.
                    </p>
                    <a 
                      href="https://www.mieterverband.ch/mv/mietrecht-beratung/ratgeber-mietrecht/top-faelle/lebensdauer.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Mehr erfahren
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </CardContent>
                </Card>

                {/* Trust Badge */}
                <Card className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="font-semibold text-green-800 dark:text-green-200">
                          Rechtlich fundiert
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-300">
                          Basiert auf offizieller SMV/HEV Tabelle 2024
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              <HelpCircle className="w-6 h-6 inline mr-2" />
              Häufige Fragen
            </h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>
                  Wann muss ich für Schäden aufkommen?
                </AccordionTrigger>
                <AccordionContent>
                  Sie müssen nur für Schäden zahlen, die über die <strong>normale Abnützung</strong> 
                  hinausgehen. Normale Gebrauchsspuren (Kratzer im Parkett, leichte Abnutzung der Wände) 
                  gehören zum normalen Wohnen und sind vom Mietzins abgedeckt. Bei übermässigen 
                  Beschädigungen (Löcher, Brandflecken, Wasserschäden) wird der <strong>Restwert</strong> 
                  nach Lebensdauertabelle berechnet.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="q2">
                <AccordionTrigger>
                  Was passiert wenn ein Gegenstand älter ist als seine Lebensdauer?
                </AccordionTrigger>
                <AccordionContent>
                  Wenn ein Gegenstand seine <strong>Lebensdauer überschritten</strong> hat 
                  (z.B. 10 Jahre alter Kühlschrank mit 10 Jahren Lebensdauer), ist er 
                  <strong> vollständig amortisiert</strong>. Sie müssen in diesem Fall 
                  <strong> nichts bezahlen</strong> – auch wenn Sie ihn beschädigt haben. 
                  Der Vermieter muss ihn ohnehin bald ersetzen.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="q3">
                <AccordionTrigger>
                  Wie berechne ich den Abzug korrekt?
                </AccordionTrigger>
                <AccordionContent>
                  Die Formel ist: <strong>Restwert = 1 - (Alter ÷ Lebensdauer)</strong>. 
                  Bei einem 12-jährigen Laminatboden (Lebensdauer 15 Jahre) beträgt der Restwert 
                  20%. Bei Ersatzkosten von CHF 1000 zahlen Sie maximal CHF 200, der Vermieter 
                  zahlt CHF 800. Unser Rechner macht diese Berechnung automatisch.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="q4">
                <AccordionTrigger>
                  Wann beginnt die Lebensdauer zu laufen?
                </AccordionTrigger>
                <AccordionContent>
                  Die Lebensdauer beginnt ab dem <strong>Einbau- bzw. Erneuerungsdatum</strong>, 
                  nicht ab Ihrem Einzug. Wurde die Wohnung vor Ihrem Einzug renoviert 
                  (z.B. neu gestrichen), beginnt die Lebensdauer ab diesem Zeitpunkt. 
                  Fragen Sie im Zweifelsfall die Verwaltung nach Belegen.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="q5">
                <AccordionTrigger>
                  Ist diese Tabelle rechtlich verbindlich?
                </AccordionTrigger>
                <AccordionContent>
                  Die paritätische Lebensdauertabelle ist <strong>kein Gesetz</strong>, wird aber 
                  von Gerichten und Schlichtungsbehörden als <strong>Richtlinie</strong> anerkannt 
                  und regelmässig angewandt. Da sie gemeinsam von Mieter- und Vermieterverbänden 
                  erstellt wurde, gilt sie als <strong>faire Grundlage</strong> für beide Seiten.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Umzug geplant?
            </h2>
            <p className="text-muted-foreground mb-6">
              Erhalten Sie kostenlose Offerten von geprüften Umzugsfirmen.
            </p>
            <a 
              href="/umzugsofferten"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Offerten vergleichen
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
