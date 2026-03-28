/**
 * Pendel-Kapital-Rechner Page
 * 
 * Public SEO tool for calculating the true cost of commuting.
 * Part of the Relo-OS infrastructure link-magnet strategy.
 */

import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CommuteCapitalCalculator } from '@/components/relo-os/CommuteCapitalCalculator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, TrendingUp, Train, Calculator, Lightbulb, Users } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Pendel-Kapital-Rechner Schweiz",
  "description": "Berechnen Sie den wahren Wert Ihrer Pendelzeit in CHF. Vergleichen Sie Wohnorte und finden Sie den optimalen Kompromiss zwischen Miete und Pendelkosten.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CHF"
  },
  "provider": {
    "@type": "Organization",
    "name": "Umzugscheck.ch",
    "url": "https://umzugscheck.ch"
  }
};

const BENEFITS = [
  {
    icon: Clock,
    title: "Zeit = Geld",
    description: "Wandeln Sie Ihre Pendelzeit in einen konkreten CHF-Betrag um",
  },
  {
    icon: TrendingUp,
    title: "Fundierte Entscheidungen",
    description: "Vergleichen Sie Wohnorte objektiv anhand der Gesamtkosten",
  },
  {
    icon: Train,
    title: "ÖV-Kosten inklusive",
    description: "Automatische Schätzung der monatlichen Abo-Kosten",
  },
  {
    icon: Calculator,
    title: "Schweizer Daten",
    description: "Basierend auf SBB-Fahrzeiten zwischen Schweizer Städten",
  },
];

const INSIGHTS = [
  {
    stat: "56 Min.",
    label: "Durchschnittliche Pendelzeit Zürich–Bern",
    description: "Bei CHF 40/Std. entspricht das 9'856 CHF/Jahr",
  },
  {
    stat: "220",
    label: "Arbeitstage pro Jahr",
    description: "Standard für Schweizer Vollzeit-Anstellung",
  },
  {
    stat: "27.5",
    label: "Arbeitstage/Jahr im ÖV",
    description: "Bei 1h Pendeln verlieren Sie fast einen Monat Arbeitszeit",
  },
];

export default function PendelRechnerPage() {
  return (
    <>
      <Helmet>
        <title>Pendel-Kapital-Rechner Schweiz | Pendelzeit in CHF berechnen</title>
        <meta 
          name="description" 
          content="Berechnen Sie den wahren Wert Ihrer Pendelzeit. Vergleichen Sie die tatsächlichen Lebenskosten verschiedener Wohnorte inklusive Zeitkosten." 
        />
        <meta name="keywords" content="Pendeln Schweiz, Pendelkosten Rechner, Commute Calculator, ÖV Kosten, Arbeitsweg, Pendelzeit Wert" />
        <link rel="canonical" href="https://umzugscheck.ch/pendel-rechner" />
        <script type="application/ld+json">
          {JSON.stringify(STRUCTURED_DATA)}
        </script>
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="container max-w-5xl mx-auto px-4">
            <AnimatedSection className="text-center mb-10">
              <Badge variant="outline" className="mb-4">
                <Clock className="w-3 h-3 mr-1" />
                Kostenloses Tool
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Pendel-Kapital-Rechner
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Berechnen Sie den <strong>wahren Wert</strong> Ihrer Pendelzeit.
                Finden Sie heraus, ob sich ein günstigerer Wohnort wirklich lohnt – 
                oder ob die Zeitkosten die Ersparnis auffressen.
              </p>
            </AnimatedSection>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {BENEFITS.map((benefit, index) => (
                <Card key={index} className="text-center border-primary/10">
                  <CardContent className="pt-6 pb-4">
                    <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-16">
          <div className="container max-w-5xl mx-auto px-4">
            <CommuteCapitalCalculator />
          </div>
        </section>

        {/* Insights Section */}
        <section className="py-16 bg-muted/50">
          <div className="container max-w-5xl mx-auto px-4">
            <AnimatedSection className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Wussten Sie schon?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pendeln kostet mehr als nur das ÖV-Abo. Hier einige Fakten zum Nachdenken.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6">
              {INSIGHTS.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-bold">{insight.stat}</span>
                    </div>
                    <h3 className="font-medium mb-2">{insight.label}</h3>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container max-w-3xl mx-auto px-4">
            <AnimatedSection className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                So funktioniert der Rechner
              </h2>
            </AnimatedSection>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Wohn- und Arbeitsort wählen</h3>
                  <p className="text-sm text-muted-foreground">
                    Wählen Sie Ihren Wohnort und Arbeitsort aus der Liste der Schweizer Städte. 
                    Die Pendelzeit wird automatisch basierend auf SBB-Daten berechnet.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Ihren Stundensatz festlegen</h3>
                  <p className="text-sm text-muted-foreground">
                    Was ist Ihnen eine Stunde Ihrer Zeit wert? Oft entspricht dies Ihrem 
                    Bruttostundenlohn, aber Sie können auch einen höheren Wert für Ihre 
                    Freizeit ansetzen.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Wahre Kosten erkennen</h3>
                  <p className="text-sm text-muted-foreground">
                    Der Rechner zeigt Ihnen die monatlichen und jährlichen Kosten des Pendelns – 
                    aufgeteilt in Zeitkosten und Transportkosten. So sehen Sie, ob sich ein 
                    günstigerer Wohnort wirklich lohnt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/50">
          <div className="container max-w-3xl mx-auto px-4">
            <AnimatedSection className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Häufige Fragen
              </h2>
            </AnimatedSection>

            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">
                    Wie wird der Stundensatz berechnet?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Als Faustregel: Teilen Sie Ihr Jahresbruttogehalt durch 2'080 (52 Wochen × 40 Stunden). 
                    Bei CHF 100'000/Jahr entspricht das etwa CHF 48/Stunde.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">
                    Berücksichtigt der Rechner auch die Arbeitszeit im Zug?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Der Rechner geht davon aus, dass die Pendelzeit nicht produktiv nutzbar ist. 
                    Wenn Sie im Zug arbeiten können, reduzieren Sie Ihren Stundensatz entsprechend.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">
                    Woher kommen die Pendelzeiten?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Die Pendelzeiten basieren auf offiziellen SBB-Fahrplandaten für die schnellste 
                    Verbindung zwischen den Hauptbahnhöfen. Bei Verfügbarkeit werden Echtzeitdaten 
                    der OpenTransportData.swiss API verwendet.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
