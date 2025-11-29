import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Shield, FileCheck, Truck, Clock, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { FAQAccordion } from "@/components/FAQAccordion";

export default function InternationalMoving() {
  const benefits = [
    { icon: Globe, title: "Weltweiter Service", description: "Umzüge in alle Länder weltweit" },
    { icon: Shield, title: "Vollversichert", description: "Kompletter Versicherungsschutz" },
    { icon: FileCheck, title: "Zollabwicklung", description: "Komplette Dokumentenabwicklung" },
    { icon: Truck, title: "See- oder Luftfracht", description: "Je nach Zielland und Dringlichkeit" },
    { icon: Clock, title: "Erfahrene Partner", description: "Spezialisierte Umzugsfirmen" },
    { icon: Package, title: "Professionelle Verpackung", description: "Sichere Transportverpackung" },
  ];

  const faqs = [
    {
      question: "Was kostet ein internationaler Umzug ab Schweiz?",
      answer: "Die Kosten variieren stark je nach Zielland und Volumen. Ein Umzug innerhalb Europas kostet durchschnittlich CHF 3'000–8'000. Interkontinentale Umzüge ab CHF 8'000."
    },
    {
      question: "Welche Dokumente benötige ich?",
      answer: "Visum/Arbeitserlaubnis für Zielland, Inventarliste, Zolldokumente, Versicherungsnachweis. Die Umzugsfirma unterstützt Sie bei der Dokumentenvorbereitung."
    },
    {
      question: "Wie lange dauert ein internationaler Umzug?",
      answer: "Innerhalb Europas 1-2 Wochen, nach Übersee 6-12 Wochen je nach Zielland und Transportweg (Seefracht oder Luftfracht)."
    },
    {
      question: "Sind internationale Umzüge versichert?",
      answer: "Ja, alle Partner-Firmen bieten Transportversicherung an. Wir empfehlen eine Vollkaskoversicherung für internationale Umzüge."
    }
  ];

  return (
    <>
      <OptimizedSEO
        title="Internationale Umzüge - Weltweit umziehen"
        description="Internationale Umzüge in die ganze Welt. Professionelle Planung, Zollabwicklung und sichere Verpackung für Ihren Auslandsumzug."
        keywords="internationaler umzug, auslandsumzug, umzug ins ausland, weltweit umziehen"
        canonicalUrl="https://umzugscheck.ch/internationale-umzuege"
      />

      <div className="min-h-screen flex flex-col">
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="gradient-hero text-white py-16 md:py-24">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    Internationale Umzüge
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-white/90">
                    Ihr Umzug ins Ausland - professionell geplant und durchgeführt
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="default" asChild className="bg-white text-primary hover:bg-white/90 shadow-premium">
                      <Link to="/rechner">Jetzt Offerte anfragen</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                      <Link to="/umzugsfirmen">Umzugsfirmen vergleichen</Link>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-16 gradient-light">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                  Warum internationale Umzüge mit uns?
                </h2>
              </ScrollReveal>
              <div className="grid md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <Card variant="elevated" className="h-full hover-lift">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                          <benefit.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle>{benefit.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-secondary/5">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                    Häufige Fragen
                  </h2>
                  <FAQAccordion items={faqs} variant="compact" />
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 gradient-cta text-white">
            <div className="container mx-auto px-4 text-center">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Bereit für Ihren internationalen Umzug?
                </h2>
                <p className="text-xl mb-8 text-white/90">
                  Holen Sie sich jetzt kostenlose Offerten von erfahrenen Umzugsfirmen
                </p>
                <Button size="lg" variant="default" asChild className="bg-white text-primary hover:bg-white/90 shadow-premium">
                  <Link to="/rechner">Jetzt Offerte anfragen</Link>
                </Button>
              </ScrollReveal>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
