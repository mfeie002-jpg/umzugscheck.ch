import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Building2, Shield, Clock, Users, CheckCircle, Package } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function BusinessMoving() {
  const faqs = [
    {
      question: "Was kostet ein Firmenumzug in der Schweiz?",
      answer: "Die Kosten für einen Firmenumzug variieren je nach Bürogrösse, Anzahl Arbeitsplätze und Distanz. Ein mittleres Büro (10-20 Arbeitsplätze) kostet durchschnittlich CHF 3'000–6'000. Nutzen Sie unseren Rechner für eine genaue Schätzung."
    },
    {
      question: "Können Firmenumzüge am Wochenende durchgeführt werden?",
      answer: "Ja, die meisten Umzugsfirmen bieten Wochenend- und Nachtumzüge an, damit Ihr Geschäftsbetrieb nicht unterbrochen wird."
    },
    {
      question: "Was ist im Firmenumzug-Service enthalten?",
      answer: "Professioneller Transport, Montage/Demontage von Büromöbeln, sichere Verpackung sensibler IT-Geräte, Projektmanagement und Koordination. Zusätzlich buchbar: IT-Umzug, Archivumzug, Lagerung."
    },
    {
      question: "Wie lange dauert ein Firmenumzug?",
      answer: "Je nach Bürogrösse 1-3 Tage. Kleinere Büros können oft an einem Tag umziehen. Grosse Unternehmen planen mehrere Tage oder Wochenenden ein."
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Firmenumzug Schweiz – Büroumzug professionell planen"
        description="Firmenumzug in der Schweiz planen? Vergleichen Sie geprüfte Umzugsfirmen für Büro- und Geschäftsumzüge. Kostenlose Offerten und bis zu 40% sparen."
        canonicalUrl="https://umzugscheck.ch/firmenumzug-schweiz"
        keywords="Firmenumzug Schweiz, Büroumzug, Geschäftsumzug, Firmenumzug Offerten"
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Firmenumzug in der Schweiz planen
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Professionelle Büro- und Geschäftsumzüge mit minimierten Ausfallzeiten. Vergleichen Sie spezialisierte Umzugsfirmen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzug-offerte">
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                </Button>
              </Link>
              <Link to="/umzugsrechner">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Besonderheiten */}
      <ScrollReveal>
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Besonderheiten beim Firmenumzug</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Minimale Ausfallzeit",
                    description: "Umzug an Wochenenden oder nachts möglich"
                  },
                  {
                    title: "IT-Spezialtransport",
                    description: "Sicherer Transport von Servern und Hardware"
                  },
                  {
                    title: "Projektmanagement",
                    description: "Dedizierter Ansprechpartner koordiniert alles"
                  },
                  {
                    title: "Archivumzug",
                    description: "Sichere Handhabung vertraulicher Dokumente"
                  }
                ].map((item, index) => (
                  <Card key={index} variant="elevated">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                Häufige Fragen zum Firmenumzug
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
            Planen Sie jetzt Ihren Firmenumzug
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Erhalten Sie kostenlose Offerten von spezialisierten Umzugsfirmen
          </p>
          <Link to="/umzug-offerte">
            <Button size="lg" variant="cta" className="h-14 px-8 text-lg bg-white text-primary hover:bg-white/90">
              Jetzt Offerten erhalten
            </Button>
          </Link>
        </div>
      </section>
      </div>
      <Footer />
    </>
  );
}