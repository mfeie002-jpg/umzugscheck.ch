import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Truck, Shield, Clock, CheckCircle, Package } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function MovingWithCleaning() {
  const faqs = [
    {
      question: "Was kostet Umzug mit Reinigung in der Schweiz?",
      answer: "Ein Umzug mit Endreinigung für eine 3-Zimmer-Wohnung kostet durchschnittlich CHF 1'800–2'500. Das Komplettpaket ist günstiger als separate Buchungen."
    },
    {
      question: "Welche Leistungen sind im Komplettpaket enthalten?",
      answer: "Transport aller Möbel und Gegenstände, Ein- und Ausladen, Montage/Demontage, plus professionelle Endreinigung der alten Wohnung mit Abgabegarantie."
    },
    {
      question: "Kann ich nur die Reinigung oder nur den Umzug buchen?",
      answer: "Ja, Sie können beide Services auch separat buchen. Das Komplettpaket ist jedoch oft günstiger und bequemer."
    },
    {
      question: "Wann wird die Reinigung durchgeführt?",
      answer: "Die Reinigung erfolgt direkt nach dem Umzug, sobald alle Möbel und Gegenstände abtransportiert sind. So ist die Wohnung abgabebereit."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Umzug mit Reinigung Schweiz – Komplettpaket"
        description="Umzug und Endreinigung aus einer Hand. Vergleichen Sie Komplettangebote und sparen Sie bis zu 40%. Mit Abgabegarantie für stressfreien Wohnungswechsel."
        keywords="umzug mit reinigung, umzug endreinigung, komplettpaket umzug"
        canonicalUrl="https://www.umzugscheck.ch/umzug-mit-reinigung"
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
              <div className="relative">
                <Truck className="h-8 w-8 text-white" />
                <Sparkles className="h-4 w-4 text-white absolute -top-1 -right-1" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Umzug mit Reinigung – Alles aus einer Hand
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Komplettpaket für Ihren stressfreien Umzug: Transport + professionelle Endreinigung mit Abgabegarantie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzugsofferten">
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                </Button>
              </Link>
              <Link to="/rechner">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Leistungen */}
      <ScrollReveal>
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                Was ist im Komplettpaket enthalten?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card variant="elevated">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <Truck className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Umzugsservice</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Transport aller Möbel und Gegenstände</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Ein- und Ausladen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Montage und Demontage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Versicherungsschutz</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <Sparkles className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Endreinigung</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Alle Räume gründlich reinigen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Küche, Bad, WC perfekt sauber</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Fenster innen putzen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Abgabegarantie inklusive</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Vorteile */}
      <ScrollReveal>
        <section className="py-16 md:py-20 gradient-light">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Vorteile des Komplettpakets
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { icon: Clock, title: "Zeitersparnis", description: "Alles an einem Tag – kein zweiter Termin nötig" },
                { icon: Shield, title: "Abgabegarantie", description: "Wohnung garantiert abnahmebereit" },
                { icon: Package, title: "Preisvorteile", description: "Günstiger als separate Buchungen" },
                { icon: CheckCircle, title: "Ein Ansprechpartner", description: "Koordination aus einer Hand" },
              ].map((item, index) => (
                <Card key={index} variant="elevated" className="h-full hover-lift">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Ablauf */}
      <ScrollReveal>
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              So läuft's ab
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { step: "1", title: "Umzug durchführen", description: "Professioneller Transport Ihrer Möbel" },
                { step: "2", title: "Wohnung reinigen", description: "Direkt nach Umzug folgt die Endreinigung" },
                { step: "3", title: "Wohnung abgeben", description: "Schlüssel übergeben – fertig!" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ */}
      <ScrollReveal>
        <section className="py-16 md:py-20 gradient-light">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Häufige Fragen
              </h2>
              <FAQAccordion items={faqs} variant="compact" />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <section className="py-16 md:py-20 gradient-cta text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für Ihr Komplettpaket?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Vergleichen Sie jetzt Angebote für Umzug mit Reinigung und sparen Sie bis zu 40%
          </p>
          <Link to="/umzugsofferten">
            <Button size="lg" variant="cta" className="h-14 px-8 text-lg bg-white text-primary hover:bg-white/90">
              Jetzt Offerten erhalten
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
