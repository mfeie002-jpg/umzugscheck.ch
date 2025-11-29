import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, TrendingUp, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function ProviderPricingPage() {
  const pricingModels = [
    {
      icon: TrendingUp,
      title: "Pay per Lead",
      description: "Bezahlen Sie nur für qualifizierte Anfragen",
      features: [
        "Keine monatlichen Fixkosten",
        "Transparente Preise pro Lead",
        "Sie entscheiden, welche Leads Sie kaufen",
        "Flexible Budgetkontrolle"
      ]
    },
    {
      icon: Users,
      title: "Abonnement",
      description: "Monatliches Paket mit fixer Lead-Anzahl",
      features: [
        "Planbare monatliche Kosten",
        "Garantierte Lead-Anzahl",
        "Priority-Support",
        "Reduzierte Kosten pro Lead"
      ]
    },
    {
      icon: Zap,
      title: "Premium",
      description: "Top-Platzierung in Rankings und maximale Sichtbarkeit",
      features: [
        "Featured-Badge in allen Rankings",
        "Top-3-Positionierung garantiert",
        "Unbegrenzte Leads",
        "Erweiterte Analytics"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Preise & Konditionen für Umzugsfirmen | umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Faire Preismodelle für Umzugsfirmen. Pay per Lead, Abonnement oder Premium. Transparent, flexibel und ROI-optimiert." 
        />
        <link rel="canonical" href="https://umzugscheck.ch/anbieter/preise" />
      </Helmet>

      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Preise & <span className="text-primary">Konditionen</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Transparente Preismodelle für Ihre Umzugsfirma. Wählen Sie das Modell, das zu Ihnen passt.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Models */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingModels.map((model, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <model.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{model.title}</h3>
                    <p className="text-muted-foreground mb-6">{model.description}</p>
                    <ul className="space-y-3">
                      {model.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-16 md:py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Warum umzugscheck.ch für Ihre Firma?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Qualifizierte Leads",
                  description: "Nur echte Anfragen von Personen, die wirklich umziehen möchten"
                },
                {
                  title: "Transparente Kosten",
                  description: "Sie sehen genau, was jeder Lead kostet und welcher ROI zu erwarten ist"
                },
                {
                  title: "Keine Vertragsbindung",
                  description: "Pay per Lead ohne monatliche Fixkosten oder lange Vertragslaufzeiten"
                },
                {
                  title: "Sofort starten",
                  description: "Anmelden, Profil erstellen und innerhalb 24h erste Leads erhalten"
                }
              ].map((item, index) => (
                <Card key={index}>
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

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit, mehr Aufträge zu erhalten?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Werden Sie jetzt Partner und erhalten Sie qualifizierte Umzugsanfragen
          </p>
          <Link to="/anbieter">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg">
              Jetzt Partner werden
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}