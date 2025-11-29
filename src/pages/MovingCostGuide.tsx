import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Breadcrumbs, BreadcrumbItem } from "@/components/Breadcrumbs";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingDown, 
  Home, 
  Building2, 
  Warehouse, 
  Package, 
  Truck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calculator,
  DollarSign
} from "lucide-react";
import { Link } from "react-router-dom";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ScrollReveal } from "@/components/ScrollReveal";

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Umzugskosten-Guide 2025" }
];

const MovingCostGuide = () => {
  const priceRanges = [
    {
      icon: Home,
      size: "1-2 Zimmer",
      volume: "15-25 m³",
      priceMin: 800,
      priceMax: 1500,
      hours: "4-6 Std.",
      crew: "2 Personen",
      color: "text-success"
    },
    {
      icon: Building2,
      size: "3-4 Zimmer",
      volume: "25-40 m³",
      priceMin: 1500,
      priceMax: 3000,
      hours: "6-10 Std.",
      crew: "3 Personen",
      color: "text-primary"
    },
    {
      icon: Warehouse,
      size: "5+ Zimmer / Haus",
      volume: "40-70 m³",
      priceMin: 3000,
      priceMax: 6000,
      hours: "10-16 Std.",
      crew: "4+ Personen",
      color: "text-accent"
    }
  ];

  const costFactors = [
    {
      icon: Package,
      title: "Umzugsvolumen",
      description: "Je mehr Möbel und Kartons, desto höher die Kosten",
      impact: "Sehr hoch",
      color: "text-primary"
    },
    {
      icon: MapPin,
      title: "Distanz",
      description: "Entfernung zwischen alter und neuer Wohnung",
      impact: "Hoch",
      color: "text-accent"
    },
    {
      icon: Building2,
      title: "Stockwerke",
      description: "Ohne Lift steigen die Kosten pro Stockwerk",
      impact: "Mittel",
      color: "text-warning"
    },
    {
      icon: Clock,
      title: "Zeitpunkt",
      description: "Wochenende und Monatsende sind teurer",
      impact: "Mittel",
      color: "text-info"
    }
  ];

  const savingTips = [
    "Umzug unter der Woche statt am Wochenende planen",
    "Kartons selbst packen statt Packservice buchen",
    "Alte Möbel vorab aussortieren und entsorgen",
    "Mehrere Offerten vergleichen (bis zu 40% Ersparnis)",
    "Umzug in der Nebensaison (November-März) durchführen",
    "Selbst Malerarbeiten und Endreinigung übernehmen"
  ];

  const faqs = [
    {
      question: "Wie berechnen sich die Umzugskosten genau?",
      answer: "Die Kosten setzen sich zusammen aus: Basispreis (abhängig vom Volumen), Distanzgebühr (pro km), Stockwerkgebühr (ohne Lift), Zusatzleistungen (Packservice, Montage, etc.) und MwSt. Die genauen Kosten erfahren Sie über unseren Kostenrechner."
    },
    {
      question: "Sind die angegebenen Preise verbindlich?",
      answer: "Die Preise sind Richtwerte basierend auf Durchschnittswerten. Die finale Offerte hängt von Ihren spezifischen Anforderungen ab. Nach Eingabe Ihrer Daten im Rechner erhalten Sie konkrete Angebote von geprüften Umzugsfirmen."
    },
    {
      question: "Wann ist die günstigste Zeit für einen Umzug?",
      answer: "Am günstigsten sind Umzüge unter der Woche (Di-Do) in den Wintermonaten (November-März). Zu vermeiden sind Monatsende, Wochenenden und Sommermonate, da hier die Nachfrage am höchsten ist."
    },
    {
      question: "Welche Zusatzkosten können anfallen?",
      answer: "Mögliche Zusatzkosten: Parkbewilligung (CHF 50-150), Aussenlift bei hohen Stockwerken (CHF 300-800), Spezialverpackung für empfindliche Güter, Zwischenlagerung, Endreinigung oder Entsorgung von Altmöbeln."
    },
    {
      question: "Wie kann ich Umzugskosten von den Steuern absetzen?",
      answer: "Berufsbedingte Umzüge sind in der ganzen Schweiz steuerlich absetzbar. Private Umzüge können in einigen Kantonen teilweise abgezogen werden. Bewahren Sie alle Belege auf und konsultieren Sie Ihr Steueramt für kantonsspezifische Regelungen."
    }
  ];

  return (
    <>
      <OptimizedSEO
        title="Umzugskosten Schweiz 2025 - Der komplette Preis-Guide"
        description="Der ultimative Kosten-Guide: Was ein Umzug in der Schweiz wirklich kostet und wie Sie bis zu 40% sparen können. Alle Preise, Tipps und Spartricks."
        keywords="umzugskosten schweiz, umzug kosten, umzugspreise, umzug sparen"
        canonicalUrl="https://umzugscheck.ch/umzugskosten-guide"
      />
      
      <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 text-white overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="max-w-4xl mx-auto text-center mt-8">
            <Badge className="mb-4 bg-accent text-accent-foreground">
              Aktualisiert für 2025
            </Badge>
            <h1 className="mb-6">
              Umzugskosten Schweiz 2025
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Der ultimative Kosten-Guide: Was ein Umzug in der Schweiz wirklich kostet 
              und wie Sie bis zu 40% sparen können.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/rechner">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong group">
                  <Calculator className="mr-2 w-5 h-5" />
                  Kosten berechnen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/firmen">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                >
                  Offerten vergleichen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 bg-gradient-light">
        {/* Quick Overview */}
        <ScrollReveal>
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <TrendingDown className="w-12 h-12 text-success mx-auto mb-4" />
                  <h2>Preisübersicht nach Wohnungsgrösse</h2>
                  <p className="text-lg text-muted-foreground mt-2">
                    Durchschnittliche Kosten für Umzüge in der Schweiz
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {priceRanges.map((range, index) => (
                    <Card key={index} className="shadow-medium hover:shadow-strong transition-shadow">
                      <CardHeader>
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-light to-primary/5 flex items-center justify-center mb-4`}>
                          <range.icon className={`w-7 h-7 ${range.color}`} />
                        </div>
                        <CardTitle>{range.size}</CardTitle>
                        <Badge variant="outline" className="w-fit">{range.volume}</Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-3xl font-bold text-primary">
                              CHF {range.priceMin.toLocaleString()} - {range.priceMax.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Durchschnittliche Gesamtkosten
                            </div>
                          </div>

                          <div className="pt-4 border-t space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Dauer:</span>
                              <span className="font-semibold">{range.hours}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Personal:</span>
                              <span className="font-semibold">{range.crew}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    * Alle Preise inkl. MwSt., basierend auf Durchschnittswerten für 30 km Distanz, 
                    mit Lift an beiden Standorten
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Cost Factors */}
        <ScrollReveal delay={100}>
          <section className="py-12 md:py-16 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <DollarSign className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h2>Kostenfaktoren im Detail</h2>
                  <p className="text-lg text-muted-foreground mt-2">
                    Diese Faktoren beeinflussen den Umzugspreis
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {costFactors.map((factor, index) => (
                    <Card key={index} className="shadow-soft">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center flex-shrink-0">
                            <factor.icon className={`w-6 h-6 ${factor.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold">{factor.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {factor.impact}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{factor.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Saving Tips */}
        <ScrollReveal delay={150}>
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Card className="shadow-strong border-success/20">
                  <CardHeader className="bg-gradient-to-r from-success/10 to-success/5">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="w-6 h-6 text-success" />
                      Spartipps: So senken Sie Ihre Umzugskosten
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Mit diesen Tipps können Sie bis zu 40% der Umzugskosten einsparen
                    </p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {savingTips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{tip}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 rounded-lg bg-success/5 border border-success/20">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <strong>Unser Tipp:</strong> Nutzen Sie unseren kostenlosen Kostenrechner 
                          und vergleichen Sie mindestens 3 Angebote. So sparen Sie im Durchschnitt 
                          CHF 800-1'500!
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal delay={200}>
          <section className="py-12 md:py-16 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <FAQAccordion 
                  items={faqs}
                  title="Häufige Fragen zu Umzugskosten"
                  variant="default"
                />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={250}>
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Card className="shadow-strong bg-gradient-hero text-white border-0">
                  <CardContent className="p-8 md:p-12 text-center">
                    <Truck className="w-16 h-16 mx-auto mb-6 opacity-90" />
                    <h2 className="text-white mb-4">
                      Bereit für Ihren stressfreien Umzug?
                    </h2>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                      Berechnen Sie jetzt Ihre individuellen Umzugskosten und erhalten Sie 
                      kostenlose Offerten von geprüften Schweizer Umzugsfirmen.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Link to="/rechner">
                        <Button 
                          size="lg" 
                          className="bg-white text-primary hover:bg-white/90 shadow-strong group"
                        >
                          <Calculator className="mr-2 w-5 h-5" />
                          Jetzt Kosten berechnen
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

        <Footer />
      </div>
    </>
  );
};

export default MovingCostGuide;
