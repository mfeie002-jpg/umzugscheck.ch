import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Warehouse, Shield, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { motion } from "framer-motion";

export default function FurnitureLift() {
  const faqs = [
    {
      question: "Was kostet ein Möbellift in der Schweiz?",
      answer: "Ein Möbellift kostet je nach Dauer und Höhe CHF 300–800. Die Kosten hängen von Einsatzdauer, Stockwerkhöhe und Zugänglichkeit ab."
    },
    {
      question: "Wann macht ein Möbellift Sinn?",
      answer: "Bei engen Treppenhäusern, schweren Möbeln (Klaviere, Safes), hohen Stockwerken ohne Lift oder wenn das Treppenhaus geschont werden soll."
    },
    {
      question: "Brauche ich eine Bewilligung für einen Möbellift?",
      answer: "Ja, in den meisten Gemeinden benötigen Sie eine temporäre Parkplatzbewilligung für den Lift-Standplatz auf der Strasse."
    },
    {
      question: "Wie lange dauert ein Möbellift-Einsatz?",
      answer: "Durchschnittlich 2-4 Stunden, abhängig von der Anzahl der zu transportierenden Gegenstände und der Höhe."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Möbellift Schweiz – Spezialtransporte für schwere Möbel | umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Möbellift für schwere und sperrige Möbel in der Schweiz. Professionelle Spezialtransporte. Jetzt Offerten vergleichen und bis zu 40% sparen." 
        />
        <meta name="keywords" content="Möbellift Schweiz, Spezialtransport, Klaviertransport, schwere Möbel" />
        <link rel="canonical" href="https://umzugscheck.ch/moebellift-schweiz" />
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
              <Warehouse className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Möbellift & <span className="text-primary">Spezialtransporte</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Sicherer Transport schwerer Möbel über den Möbellift. Perfekt bei engen Treppenhäusern oder hohen Stockwerken.
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

      {/* Wann braucht man einen Möbellift */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Wann braucht man einen Möbellift?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Enge Treppenhäuser", description: "Wenn Möbel nicht durch Treppenhaus passen" },
                { title: "Schwere Gegenstände", description: "Klaviere, Tresore, grosse Schränke" },
                { title: "Hohe Stockwerke", description: "Ab 3. Stock ohne Lift empfehlenswert" },
                { title: "Zeitersparnis", description: "Schneller als Tragen über Treppe" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <CheckCircle className="h-6 w-6 text-green-600 mb-3" />
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Häufige Fragen zum Möbellift
            </h2>
            <FAQAccordion items={faqs} variant="compact" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Benötigen Sie einen Möbellift?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Vergleichen Sie jetzt Angebote für Möbellift und Spezialtransporte
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