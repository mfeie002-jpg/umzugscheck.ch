import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Globe, Shield, FileCheck, Truck, CheckCircle } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { motion } from "framer-motion";

export default function InternationalMoving() {
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
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Internationaler Umzug Schweiz – Weltweit umziehen | umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Internationaler Umzug ab der Schweiz? Vergleichen Sie spezialisierte Umzugsfirmen für weltweite Umzüge. Professionell, versichert und günstig." 
        />
        <meta name="keywords" content="Internationaler Umzug Schweiz, Auslandsumzug, Überseeumzug, Umzug ins Ausland" />
        <link rel="canonical" href="https://umzugscheck.ch/internationaler-umzug" />
      </Helmet>

      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Internationaler <span className="text-primary">Umzug</span> ab der Schweiz
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Professioneller Auslandsumzug mit spezialisierten Umzugsfirmen. Weltweit versichert und zuverlässig.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzug-offerte">
                <Button size="lg" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Was beachten */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Das müssen Sie beachten
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: FileCheck, title: "Zolldokumente", description: "Inventarliste und Formulare vorbereiten" },
              { icon: Shield, title: "Versicherung", description: "Vollkasko für internationale Transporte" },
              { icon: Truck, title: "Transportweg", description: "See- oder Luftfracht je nach Zielland" },
              { icon: Globe, title: "Planung", description: "6-12 Wochen Vorlauf empfohlen" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Häufige Fragen zum internationalen Umzug
            </h2>
            <FAQAccordion items={faqs} variant="compact" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Planen Sie Ihren internationalen Umzug
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Erhalten Sie kostenlose Offerten von spezialisierten Umzugsfirmen
          </p>
          <Link to="/umzug-offerte">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg">
              Jetzt Offerten erhalten
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}