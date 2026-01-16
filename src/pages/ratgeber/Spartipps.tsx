import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PiggyBank, TrendingDown, Calendar, Package, Users,
  ArrowRight, CheckCircle, Lightbulb, AlertTriangle, Clock
} from "lucide-react";
import { Link } from "react-router-dom";

interface SavingTip {
  category: string;
  savings: string;
  icon: React.ElementType;
  tips: {
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
  }[];
}

const savingTips: SavingTip[] = [
  {
    category: "Zeitpunkt wählen",
    savings: "15-25%",
    icon: Calendar,
    tips: [
      {
        title: "Unter der Woche umziehen",
        description: "Montag bis Donnerstag sind deutlich günstiger als Freitag und Wochenende.",
        impact: "high",
      },
      {
        title: "Monatsmitte bevorzugen",
        description: "Monatsanfang und -ende sind Hochsaison. Mitte des Monats ist günstiger.",
        impact: "high",
      },
      {
        title: "Nebensaison nutzen",
        description: "November bis Februar sind die günstigsten Monate. Sommer ist teurer.",
        impact: "medium",
      },
    ],
  },
  {
    category: "Selbst aktiv werden",
    savings: "20-40%",
    icon: Package,
    tips: [
      {
        title: "Selber packen",
        description: "Das Einpacken selbst übernehmen spart den grössten Einzelposten.",
        impact: "high",
      },
      {
        title: "Möbel abbauen",
        description: "Schränke, Betten und Tische selbst demontieren spart Arbeitsstunden.",
        impact: "high",
      },
      {
        title: "Kartons selbst besorgen",
        description: "Kostenlose Kartons bei Supermärkten oder online kaufen statt mieten.",
        impact: "medium",
      },
      {
        title: "Ausmisten vor dem Umzug",
        description: "Weniger Sachen = weniger Volumen = niedrigere Kosten.",
        impact: "high",
      },
    ],
  },
  {
    category: "Offerten vergleichen",
    savings: "10-30%",
    icon: TrendingDown,
    tips: [
      {
        title: "Mindestens 3 Offerten",
        description: "Preise können stark variieren. Vergleichen lohnt sich immer.",
        impact: "high",
      },
      {
        title: "Festpreis verlangen",
        description: "Ein Festpreis schützt vor bösen Überraschungen bei der Abrechnung.",
        impact: "medium",
      },
      {
        title: "Leistungen genau prüfen",
        description: "Nicht nur Preis vergleichen, sondern auch was inkludiert ist.",
        impact: "medium",
      },
    ],
  },
  {
    category: "Helfer organisieren",
    savings: "10-20%",
    icon: Users,
    tips: [
      {
        title: "Freunde und Familie",
        description: "Beim Tragen und Packen helfen lassen spart Arbeitsstunden.",
        impact: "medium",
      },
      {
        title: "Nur Transporter mieten",
        description: "Statt Komplettservice nur den Transport buchen und selbst ein-/ausladen.",
        impact: "high",
      },
      {
        title: "Beiladung prüfen",
        description: "Bei wenig Möbeln kann eine Beiladung deutlich günstiger sein.",
        impact: "medium",
      },
    ],
  },
];

const quickWins = [
  { tip: "3+ Offerten einholen und vergleichen", icon: TrendingDown },
  { tip: "Wochentag statt Wochenende wählen", icon: Calendar },
  { tip: "Vor dem Umzug entrümpeln", icon: Package },
  { tip: "Selbst packen und Möbel abbauen", icon: Users },
  { tip: "Monatsmitte statt Monatsende", icon: Clock },
];

const getImpactBadge = (impact: "high" | "medium" | "low") => {
  switch (impact) {
    case "high":
      return <Badge className="bg-green-500 text-xs">Hohe Ersparnis</Badge>;
    case "medium":
      return <Badge className="bg-amber-500 text-xs">Mittlere Ersparnis</Badge>;
    default:
      return <Badge variant="secondary" className="text-xs">Kleine Ersparnis</Badge>;
  }
};

export default function Spartipps() {
  return (
    <>
      <OptimizedSEO
        title="Umzug Spartipps | Bis zu 40% sparen | Umzugscheck.ch"
        description="Die besten Spartipps für Ihren Umzug: So sparen Sie bis zu 40% bei den Umzugskosten. Praktische Tipps von Experten für günstigeres Umziehen in der Schweiz."
        canonicalUrl="https://www.umzugscheck.ch/ratgeber/spartipps"
        keywords="umzug spartipps, günstig umziehen, umzugskosten sparen, umzug schweiz günstig"
      />
      
      <div className="min-h-screen bg-gradient-elegant">
        {/* Hero */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-95" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <Badge className="mb-4 bg-green-500/20 text-white border-green-300/50">
                <PiggyBank className="w-3 h-3 mr-1" />
                Bis zu 40% sparen
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Spartipps für Ihren Umzug
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Mit diesen bewährten Tipps reduzieren Sie Ihre Umzugskosten erheblich – 
                ohne Kompromisse bei der Qualität.
              </p>
              <Link to="/umzugsofferten">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Günstige Offerten erhalten
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Wins */}
        <section className="py-12 bg-green-50 dark:bg-green-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold mb-6 text-center flex items-center justify-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Die 5 wichtigsten Spartipps auf einen Blick
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {quickWins.map((win, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border"
                  >
                    <win.icon className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">{win.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Tips */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Detaillierte Spartipps nach Kategorie
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Jede Kategorie enthält konkrete Massnahmen mit geschätztem Sparpotenzial.
              </p>
              
              <div className="space-y-8">
                {savingTips.map((category, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                            <category.icon className="w-6 h-6 text-green-600" />
                          </div>
                          <span>{category.category}</span>
                        </CardTitle>
                        <Badge className="bg-green-600 text-lg px-4 py-1">
                          {category.savings} sparen
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        {category.tips.map((tip, tipIdx) => (
                          <div 
                            key={tipIdx}
                            className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="font-semibold text-sm">{tip.title}</span>
                              </div>
                              {getImpactBadge(tip.impact)}
                            </div>
                            <p className="text-sm text-muted-foreground ml-6">
                              {tip.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Warning */}
        <section className="py-12 bg-amber-50 dark:bg-amber-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="border-amber-300">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Vorsicht bei Billig-Anbietern!</h3>
                      <p className="text-muted-foreground">
                        Extrem günstige Angebote können versteckte Kosten enthalten oder 
                        auf mangelnde Versicherung hindeuten. Achten Sie immer auf:
                      </p>
                      <ul className="mt-3 space-y-1">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Vollständige Transportversicherung
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Transparente Preisaufstellung
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Gute Bewertungen und Referenzen
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Schriftlicher Vertrag mit Festpreis
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Jetzt günstige Offerten vergleichen
              </h2>
              <p className="text-muted-foreground mb-6">
                Erhalten Sie kostenlos bis zu 5 Offerten von geprüften Umzugsfirmen 
                und sparen Sie mit unserem Vergleich.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/umzugsofferten">
                  <Button size="lg">
                    <PiggyBank className="w-4 h-4 mr-2" />
                    Kostenlos Offerten erhalten
                  </Button>
                </Link>
                <Link to="/guenstige-umzugsfirma">
                  <Button size="lg" variant="outline">
                    Günstige Firmen ansehen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
