import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calculator, TrendingDown, Shield, AlertCircle, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Umzugspreise Schweiz 2025",
  "description": "Transparente Übersicht der Umzugskosten in der Schweiz. Vergleichen Sie Preise und finden Sie die günstigste Umzugsfirma.",
  "url": "https://umzugscheck.ch/preise"
};

const Preise = () => {
  return (
    <>
      <SEOHead
        title="Umzugspreise Schweiz 2025 - Kosten & Preisvergleich | Umzugscheck.ch"
        description="Transparente Übersicht der Umzugskosten in der Schweiz. Vergleichen Sie Preise von geprüften Umzugsfirmen und sparen Sie bis zu 40%. Kostenloser Preisrechner."
        keywords="umzugskosten schweiz, umzugspreise, umzug kosten, preisvergleich umzug, günstige umzugsfirma"
        canonical="/preise"
        structuredData={structuredData}
      />

      <Navigation />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "Preise", href: "/preise" }
            ]}
          />

          {/* Hero Section */}
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 md:mb-16 mt-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                Umzugspreise in der Schweiz 2025
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">
                Ein Umzug in der Schweiz kostet je nach Wohnungsgrösse, Distanz und Zusatzleistungen zwischen CHF 800 und CHF 6'000+. Verschaffen Sie sich einen transparenten Überblick über die Preise.
              </p>
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to="/rechner">
                  <Calculator className="w-5 h-5 mr-2" />
                  Jetzt Preis berechnen
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          {/* Example Price Table */}
          <ScrollReveal delay={0.1}>
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
                Typische Umzugskosten-Szenarien
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  {
                    title: "1-2 Zimmer",
                    price: "CHF 800 - 1'500",
                    volume: "15-25 m³",
                    duration: "4-6 Std",
                    features: ["1-2 Helfer", "Lokaler Umzug", "Basisausstattung"]
                  },
                  {
                    title: "3-4 Zimmer",
                    price: "CHF 1'500 - 3'000",
                    volume: "30-45 m³",
                    duration: "6-10 Std",
                    features: ["2-3 Helfer", "Bis 100 km", "Normales Inventar"],
                    popular: true
                  },
                  {
                    title: "5+ Zimmer / Haus",
                    price: "CHF 3'000 - 6'000+",
                    volume: "50-80+ m³",
                    duration: "10-16+ Std",
                    features: ["3-4 Helfer", "Beliebige Distanz", "Viel Inventar"]
                  },
                  {
                    title: "Firmenumzug",
                    price: "CHF 2'000 - 10'000+",
                    volume: "Variabel",
                    duration: "Variabel",
                    features: ["Spezialteam", "IT-Equipment", "Wochenende möglich"]
                  }
                ].map((item, index) => (
                  <Card key={index} className={`${item.popular ? "border-primary border-2 relative" : ""} hover:shadow-lg transition-shadow`}>
                    {item.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                          Beliebteste Grösse
                        </span>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg sm:text-xl">{item.title}</CardTitle>
                      <CardDescription>
                        <span className="text-2xl sm:text-3xl font-bold text-foreground block mt-2">{item.price}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Volumen:</span>
                          <span className="font-medium">{item.volume}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dauer:</span>
                          <span className="font-medium">{item.duration}</span>
                        </div>
                      </div>
                      <ul className="space-y-2 pt-4 border-t">
                        {item.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Cost Factors */}
          <ScrollReveal delay={0.2}>
            <section className="mb-12 sm:mb-16 bg-muted/30 rounded-2xl p-6 sm:p-8 md:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
                Diese Faktoren beeinflussen den Umzugspreis
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    title: "Umzugsvolumen",
                    description: "Die Menge an Möbeln und Gegenständen bestimmt massgeblich die Kosten. Mehr Volumen = grösserer Transporter und mehr Helfer notwendig."
                  },
                  {
                    title: "Distanz",
                    description: "Lokale Umzüge (innerhalb derselben Stadt) sind günstiger. Distanzen über 50 km erhöhen die Kosten durch längere Fahrzeiten."
                  },
                  {
                    title: "Etage & Lift",
                    description: "Umzüge in höhere Stockwerke ohne Lift kosten 20-40% mehr. Ein Lift in beiden Gebäuden spart erheblich Zeit und Geld."
                  },
                  {
                    title: "Zusatzleistungen",
                    description: "Packservice (CHF 300-800), Endreinigung (CHF 200-600), Entsorgung (CHF 150-500) und Möbelmontage (CHF 200-600) erhöhen die Gesamtkosten."
                  },
                  {
                    title: "Zeitpunkt",
                    description: "Monatsende, Wochenenden und Sommermonate sind Hochsaison (10-30% Aufpreis). Wochentags und im Winter ist es günstiger."
                  },
                  {
                    title: "Kurzfristige Buchung",
                    description: "Umzüge mit weniger als 2 Wochen Vorlauf können 15-25% teurer sein. Frühzeitige Planung spart Geld."
                  }
                ].map((factor, index) => (
                  <div key={index} className="bg-background p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-base sm:text-lg mb-2">{factor.title}</h3>
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Calculator Highlight */}
          <ScrollReveal delay={0.3}>
            <section className="mb-12 sm:mb-16">
              <div className="max-w-4xl mx-auto">
                <Card className="overflow-hidden shadow-strong border-primary/20">
                  <div className="grid md:grid-cols-2">
                    <div className="bg-primary text-primary-foreground p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                      <Calculator className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                        Umzugskosten-Rechner
                      </h3>
                      <p className="text-primary-foreground/90 mb-6 text-sm sm:text-base">
                        Berechnen Sie Ihre individuellen Umzugskosten mit unserem kostenlosen Rechner. 
                        Ergebnis in 2 Minuten – präzise und transparent.
                      </p>
                    </div>
                    
                    <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-background">
                      <h4 className="text-lg sm:text-xl font-bold mb-4">Kostenlos berechnen</h4>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">100% kostenlos & unverbindlich</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Sofortiges Ergebnis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Alle Kostenfaktoren berücksichtigt</span>
                        </li>
                      </ul>
                      <Button size="lg" asChild className="w-full">
                        <Link to="/rechner/umzugskosten">
                          <Calculator className="mr-2 w-5 h-5" />
                          Jetzt berechnen
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          </ScrollReveal>

          {/* City-Specific Hints */}
          <ScrollReveal delay={0.4}>
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
                Regionale Preisunterschiede
              </h2>
              <p className="text-center text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-4">
                Umzugskosten variieren je nach Region. Grossstädte wie Zürich und Basel sind tendenziell 10-20% teurer, 
                während ländliche Regionen oft günstigere Preise bieten.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
                {[
                  { 
                    city: "Zürich", 
                    slug: "zuerich",
                    priceLevel: "Hoch",
                    avgPrice: "CHF 2'200",
                    note: "Höchste Preise schweizweit. Enge Parkplätze, hohe Nachfrage."
                  },
                  { 
                    city: "Bern", 
                    slug: "bern",
                    priceLevel: "Mittel",
                    avgPrice: "CHF 1'900",
                    note: "Ausgeglichenes Niveau. Gute Firmenauswahl, Altstadt-Expertise."
                  },
                  { 
                    city: "Basel", 
                    slug: "basel",
                    priceLevel: "Mittel-Hoch",
                    avgPrice: "CHF 2'000",
                    note: "Grenzregion. Spezialisten für internationale Umzüge verfügbar."
                  }
                ].map((city, index) => (
                  <Card key={index} className="hover:shadow-md transition-all">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <CardTitle className="text-lg sm:text-xl">{city.city}</CardTitle>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                          city.priceLevel === "Hoch" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100" :
                          city.priceLevel === "Mittel-Hoch" ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100" :
                          "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                        }`}>
                          {city.priceLevel}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Ø 3-Zi-Wohnung: <strong>{city.avgPrice}</strong></p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4">{city.note}</p>
                      <Button variant="ghost" size="sm" asChild className="w-full text-xs sm:text-sm">
                        <Link to={`/umzugsfirmen/${city.slug}`}>
                          <MapPin className="w-4 h-4 mr-2" />
                          Firmen in {city.city}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* FAQ */}
          <ScrollReveal delay={0.5}>
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
                Häufige Fragen zu Umzugspreisen
              </h2>
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="space-y-4">
                  {[
                    {
                      question: "Was kostet ein Umzug durchschnittlich in der Schweiz?",
                      answer: "Die Kosten variieren stark je nach Grösse und Distanz. Eine 3-Zimmer-Wohnung kostet durchschnittlich CHF 1'500-3'000. Nutzen Sie unseren kostenlosen Rechner für eine präzise Schätzung basierend auf Ihren individuellen Anforderungen."
                    },
                    {
                      question: "Gibt es versteckte Kosten bei Umzügen?",
                      answer: "Bei seriösen Anbietern nicht. Achten Sie auf eine detaillierte Offerte mit Aufschlüsselung: Transportkosten, Arbeitsstunden, Treppenzuschläge, Parkgebühren, Versicherung und Zusatzleistungen. Unser Vergleich zeigt nur transparente Anbieter."
                    },
                    {
                      question: "Wann sind Umzüge am günstigsten?",
                      answer: "Unter der Woche (Mo-Do), in Wintermonaten (Nov-Feb) und Monatsmitte. Monatsende, Sommermonate und Wochenenden sind Hochsaison mit 10-30% höheren Preisen. Frühzeitige Buchung (4+ Wochen) spart zusätzlich 10-20%."
                    },
                    {
                      question: "Kann ich beim Umzug Geld sparen?",
                      answer: "Ja! Tipps zum Sparen: (1) Ausmisten vor dem Umzug reduziert Volumen, (2) Selbst packen spart CHF 300-800, (3) Flexible Terminwahl in Nebensaison, (4) Mehrere Offerten vergleichen, (5) Lift nutzen spart 20-40%, (6) Auf unnötige Zusatzleistungen verzichten."
                    },
                    {
                      question: "Sind Umzugskosten steuerlich absetzbar?",
                      answer: "Bei beruflich bedingten Umzügen (neue Stelle, deutlich kürzerer Arbeitsweg) können Kosten als Berufsauslagen abgesetzt werden. Private Umzüge sind nicht abzugsfähig. Bewahren Sie alle Belege auf und konsultieren Sie einen Steuerberater."
                    },
                    {
                      question: "Was passiert bei Schäden während des Umzugs?",
                      answer: "Seriöse Umzugsfirmen haben eine Transportversicherung (Standard: CHF 1'200/m³). Prüfen Sie Versicherungsbedingungen in der Offerte. Dokumentieren Sie wertvolle Gegenstände vorher mit Fotos. Schäden müssen sofort gemeldet werden."
                    }
                  ].map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-background border rounded-xl px-6">
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="font-bold text-sm sm:text-base pr-4">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          </ScrollReveal>

          {/* CTA Section */}
          <ScrollReveal delay={0.6}>
            <section className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8 md:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Bereit für Ihren kostenlosen Preisvergleich?
              </h2>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-primary-foreground/90">
                Berechnen Sie jetzt in 2 Minuten Ihren individuellen Umzugspreis
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
                  <Link to="/rechner">
                    <Calculator className="w-5 h-5 mr-2" />
                    Jetzt Preis berechnen
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link to="/offerte">
                    Offerte anfordern
                  </Link>
                </Button>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Preise;
