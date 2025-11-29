import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Recycle, Shield, Clock, Leaf, CheckCircle, Home } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { motion } from "framer-motion";

export default function DisposalService() {
  const faqs = [
    {
      question: "Was kostet eine Entsorgung in der Schweiz?",
      answer: "Die Kosten hängen von Menge und Art der Gegenstände ab. Kleine Entsorgungen starten bei CHF 200, grössere Wohnungsräumungen bei CHF 800–2'000."
    },
    {
      question: "Welche Gegenstände können entsorgt werden?",
      answer: "Möbel, Elektrogeräte, Hausrat, Sperrmüll. Sonderfall: Sondermüll wie Chemikalien oder Asbest benötigen Spezialentsorgung."
    },
    {
      question: "Ist die Entsorgung umweltfreundlich?",
      answer: "Ja, alle Partner-Firmen entsorgen fachgerecht und trennen recycelbare Materialien. Viele bieten CO₂-Kompensation an."
    },
    {
      question: "Kann die Entsorgung mit dem Umzug kombiniert werden?",
      answer: "Ja, Sie können Umzug und Entsorgung als Paket buchen – oft günstiger als getrennte Services."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Entsorgung & Räumung Schweiz – Fachgerecht entsorgen | umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Professionelle Entsorgung und Wohnungsräumung in der Schweiz. Umweltfreundlich, fachgerecht und günstig. Jetzt Offerten vergleichen." 
        />
        <meta name="keywords" content="Entsorgung Schweiz, Räumung, Sperrmüll, Möbelentsorgung, Haushaltsauflösung" />
        <link rel="canonical" href="https://umzugscheck.ch/entsorgung-schweiz" />
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
              <Recycle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Entsorgung & Räumung in der <span className="text-primary">Schweiz</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Fachgerechte und umweltfreundliche Entsorgung von Möbeln, Hausrat und Sperrmüll. Jetzt Angebote vergleichen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzug-offerte">
                <Button size="lg" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                </Button>
              </Link>
              <Link to="/rechner/entsorgung">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Unsere Entsorgungsservices
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Home,
                title: "Wohnungsräumung",
                description: "Komplette Räumung von Wohnungen und Häusern"
              },
              {
                icon: Recycle,
                title: "Sperrmüll",
                description: "Fachgerechte Entsorgung von Sperrmüll und Altmöbeln"
              },
              {
                icon: Leaf,
                title: "Umweltfreundlich",
                description: "Recycling und nachhaltige Entsorgung"
              }
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
              Häufige Fragen zur Entsorgung
            </h2>
            <FAQAccordion items={faqs} variant="compact" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Benötigen Sie eine professionelle Entsorgung?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Erhalten Sie kostenlose Offerten von geprüften Entsorgungsfirmen
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