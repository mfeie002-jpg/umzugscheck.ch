import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home, Shield, Clock, TrendingUp, CheckCircle, Package } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { motion } from "framer-motion";

export default function PrivateMoving() {
  const faqs = [
    {
      question: "Was kostet ein Privatumzug in der Schweiz?",
      answer: "Die Kosten hängen von Wohnungsgrösse, Distanz und Stockwerk ab. Ein 3-Zimmer-Umzug kostet durchschnittlich CHF 1'200–1'800. Mit unserem Preisrechner erhalten Sie eine genaue Schätzung."
    },
    {
      question: "Was ist im Privatumzug-Service enthalten?",
      answer: "Der Standard-Service umfasst Transport, Ein- und Ausladen sowie Montage/Demontage einfacher Möbel. Zusatzleistungen wie Packservice, Reinigung oder Entsorgung können optional gebucht werden."
    },
    {
      question: "Wie lange im Voraus sollte ich einen Umzug buchen?",
      answer: "Wir empfehlen 2-4 Wochen Vorlauf. In der Hauptsaison (Sommer) kann es sinnvoll sein, noch früher zu buchen. Kurzfristige Umzüge sind oft auch möglich."
    },
    {
      question: "Sind die Umzugsfirmen versichert?",
      answer: "Ja, alle Umzugsfirmen auf umzugscheck.ch sind versichert und zertifiziert. Ihre Möbel und Gegenstände sind während des Transports geschützt."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privatumzug Schweiz – Umzugsfirmen vergleichen | umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Privatumzug in der Schweiz planen? Vergleichen Sie geprüfte Umzugsfirmen kostenlos. Bis zu 5 Offerten erhalten und bis zu 40% sparen." 
        />
        <meta name="keywords" content="Privatumzug Schweiz, Umzug Privatpersonen, Umzugsfirma privat, Umzugsofferten privat" />
        <link rel="canonical" href="https://umzugscheck.ch/umzug-schweiz" />
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
              <Home className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Privatumzug in der <span className="text-primary">Schweiz</span> vergleichen
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Finden Sie die beste Umzugsfirma für Ihren privaten Umzug. Kostenlose Offerten vergleichen und bis zu 40% sparen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umzug-offerte">
                <Button size="lg" className="h-14 px-8 text-lg">
                  Jetzt Offerten vergleichen
                </Button>
              </Link>
              <Link to="/umzugsrechner">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Was ist ein Privatumzug */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Was ist ein Privatumzug?</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Ein Privatumzug bezeichnet den Wohnungswechsel von Privatpersonen oder Familien. 
                Professionelle Umzugsfirmen übernehmen dabei den Transport Ihrer Möbel und persönlichen Gegenstände 
                von der alten zur neuen Wohnung.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Je nach Bedarf können Sie zwischen verschiedenen Service-Leveln wählen: vom einfachen Transport 
                bis zum Rundum-sorglos-Paket mit Packservice, Montage und Reinigung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-16 md:py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Vorteile eines professionellen Privatumzugs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Zeitersparnis",
                description: "Profis erledigen Ihren Umzug schnell und effizient"
              },
              {
                icon: Shield,
                title: "Versicherungsschutz",
                description: "Ihre Möbel sind während des Transports versichert"
              },
              {
                icon: TrendingUp,
                title: "Kosteneffizienz",
                description: "Durch Vergleich finden Sie die besten Preise"
              },
              {
                icon: CheckCircle,
                title: "Stressfrei",
                description: "Entspannt umziehen ohne körperliche Belastung"
              },
              {
                icon: Package,
                title: "Komplettservice",
                description: "Alle Services aus einer Hand verfügbar"
              },
              {
                icon: Home,
                title: "Erfahrung",
                description: "Professionelle Umzugsexperten mit Know-how"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
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

      {/* Ablauf */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            So funktioniert's
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Offerten anfragen",
                description: "Füllen Sie unser Formular aus (2 Minuten)"
              },
              {
                step: "2",
                title: "Offerten vergleichen",
                description: "Erhalten Sie bis zu 5 kostenlose Offerten"
              },
              {
                step: "3",
                title: "Firma wählen",
                description: "Wählen Sie die beste Umzugsfirma für Ihre Bedürfnisse"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
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
              Häufige Fragen zum Privatumzug
            </h2>
            <FAQAccordion items={faqs} variant="compact" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für Ihren Privatumzug?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Vergleichen Sie jetzt kostenlos Umzugsfirmen und sparen Sie bis zu 40%
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