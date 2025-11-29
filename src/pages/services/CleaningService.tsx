import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Shield, Clock, Users, CheckCircle, Home } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { motion } from "framer-motion";

export default function CleaningService() {
  const faqs = [
    {
      question: "Was kostet eine Umzugsreinigung in der Schweiz?",
      answer: "Eine professionelle Umzugsreinigung kostet je nach Wohnungsgrösse CHF 300–800. Eine 3-Zimmer-Wohnung kostet durchschnittlich CHF 450–600."
    },
    {
      question: "Was ist in der Umzugsreinigung enthalten?",
      answer: "Standard-Umzugsreinigung umfasst alle Räume, Küche, Bad, Fenster innen, Böden und Oberflächen gemäss Wohnungsabgabeprotokoll."
    },
    {
      question: "Gibt es eine Abgabegarantie?",
      answer: "Ja, viele Reinigungsfirmen bieten eine Abgabegarantie. Falls der Vermieter die Reinigung nicht akzeptiert, wird kostenlos nachgeputzt."
    },
    {
      question: "Wie lange dauert eine Umzugsreinigung?",
      answer: "Eine 3-Zimmer-Wohnung benötigt ca. 4-6 Stunden. Grössere Wohnungen oder Häuser entsprechend länger."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzugsreinigung Schweiz mit Abgabegarantie | umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Professionelle Umzugsreinigung in der Schweiz mit Abgabegarantie. Vergleichen Sie Angebote und sparen Sie bis zu 40%. End- und Endreinigung für stressfreie Wohnungsabgabe." 
        />
        <meta name="keywords" content="Umzugsreinigung Schweiz, Endreinigung, Abgabegarantie, Wohnungsreinigung" />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsreinigung-schweiz" />
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
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Umzugsreinigung mit <span className="text-primary">Abgabegarantie</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Professionelle End- und Endreinigung für eine stressfreie Wohnungsabgabe. Vergleichen Sie Angebote und sparen Sie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzug-offerte">
                <Button size="lg" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                </Button>
              </Link>
              <Link to="/rechner/reinigung">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leistungen */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Was ist enthalten?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Alle Räume gründlich reinigen",
                "Küche inkl. Backofen, Kühlschrank",
                "Badezimmer inkl. WC, Dusche, Armaturen",
                "Fenster innen putzen",
                "Böden wischen und saugen",
                "Oberflächen und Schränke"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-16 md:py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Vorteile einer professionellen Umzugsreinigung
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Abgabegarantie",
                description: "Nachputzen kostenlos, falls Vermieter nicht akzeptiert"
              },
              {
                icon: Clock,
                title: "Zeitersparnis",
                description: "Sie sparen wertvolle Zeit am Umzugstag"
              },
              {
                icon: Users,
                title: "Professionell",
                description: "Erfahrene Reinigungskräfte mit Profi-Equipment"
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
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Häufige Fragen zur Umzugsreinigung
            </h2>
            <FAQAccordion items={faqs} variant="compact" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für eine professionelle Umzugsreinigung?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Vergleichen Sie jetzt Angebote und erhalten Sie die beste Reinigung zum besten Preis
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