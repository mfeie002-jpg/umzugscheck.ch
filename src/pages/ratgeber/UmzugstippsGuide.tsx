import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useFlowPath } from "@/hooks/useUnifiedAB";
import { 
  Lightbulb, CheckCircle, Clock, Calendar, Package, 
  Truck, Home, FileText, ArrowRight, Star, Shield,
  AlertTriangle, DollarSign, Users, MapPin
} from "lucide-react";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FAQAccordion } from "@/components/FAQAccordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

const tips = [
  {
    icon: Calendar,
    title: "Früh planen",
    description: "Beginnen Sie mindestens 8 Wochen vor dem Umzug mit der Planung. In der Hochsaison (Frühling/Sommer) sind gute Umzugsfirmen schnell ausgebucht.",
    priority: "high"
  },
  {
    icon: Package,
    title: "Systematisch ausmisten",
    description: "Sortieren Sie Raum für Raum aus. Verkaufen, spenden oder entsorgen Sie, was Sie nicht mehr brauchen – das spart Umzugskosten.",
    priority: "high"
  },
  {
    icon: FileText,
    title: "Mehrere Offerten einholen",
    description: "Vergleichen Sie mindestens 3-5 Angebote. Achten Sie auf versteckte Kosten und prüfen Sie Versicherungsschutz.",
    priority: "high"
  },
  {
    icon: Clock,
    title: "Zeitpunkt clever wählen",
    description: "Umzüge unter der Woche und Monatsanfang sind oft günstiger. Vermeiden Sie Monatsende – da ziehen die meisten um.",
    priority: "medium"
  },
  {
    icon: Shield,
    title: "Wertsachen selbst transportieren",
    description: "Schmuck, wichtige Dokumente, Bargeld und elektronische Datenträger sollten Sie persönlich zum neuen Zuhause bringen.",
    priority: "high"
  },
  {
    icon: Home,
    title: "Neue Wohnung vorbereiten",
    description: "Messen Sie vorher aus: Passen Möbel durch Türen und Treppenhaus? Brauchen Sie einen Möbellift?",
    priority: "medium"
  },
  {
    icon: Users,
    title: "Helfer organisieren",
    description: "Auch mit Umzugsfirma: Ein paar Freunde als Unterstützung machen vieles einfacher. Verpflegung nicht vergessen!",
    priority: "low"
  },
  {
    icon: AlertTriangle,
    title: "Parkplatz sichern",
    description: "Beantragen Sie rechtzeitig eine Halteverbotszone. In Städten wie Zürich ist das Pflicht und braucht Vorlauf.",
    priority: "high"
  }
];

const mistakes = [
  {
    title: "Zu spät buchen",
    description: "In der Hochsaison 2-3 Monate vorher buchen",
    solution: "Frühzeitig Offerten einholen"
  },
  {
    title: "Keine Versicherung prüfen",
    description: "Transportschäden können teuer werden",
    solution: "Versicherungsschutz im Angebot klären"
  },
  {
    title: "Falsch einschätzen",
    description: "Umzüge dauern meist länger als gedacht",
    solution: "Puffer einplanen, früh anfangen"
  },
  {
    title: "Wichtiges nicht griffbereit",
    description: "Schlüssel, Dokumente, Medikamente verschollen",
    solution: "Notfallkoffer separat packen"
  },
  {
    title: "Zählerstände vergessen",
    description: "Führt zu Streit mit dem Vermieter",
    solution: "Am Umzugstag dokumentieren und fotografieren"
  },
  {
    title: "Adressänderung vergessen",
    description: "Post kommt an alte Adresse",
    solution: "Checkliste mit allen Stellen nutzen"
  }
];

const packingTips = [
  "Schwere Sachen in kleine Kartons",
  "Kartons eindeutig beschriften (Raum + Inhalt)",
  "Zerbrechliches gut polstern",
  "Bücher hochkant stellen",
  "Kleider im Schrank hängend transportieren",
  "Schrauben von Möbeln in beschriftete Tüten",
  "Elektrokabel fotografieren vor dem Abstecken",
  "Pro Raum einen 'Zuerst öffnen'-Karton packen"
];

const faqs = [
  {
    question: "Wann ist die beste Zeit für einen Umzug?",
    answer: "Nebensaison (Oktober-Februar) ist günstiger. Unter der Woche und Monatsanfang sind Umzugsfirmen weniger ausgelastet und oft preiswerter."
  },
  {
    question: "Wie viele Kartons brauche ich?",
    answer: "Faustregel: Pro Zimmer ca. 10-15 Umzugskartons. Eine 3-Zimmer-Wohnung benötigt etwa 30-50 Kartons."
  },
  {
    question: "Was kostet ein Umzug in der Schweiz?",
    answer: "Je nach Wohnungsgrösse CHF 600-4'000. Eine 3-Zimmer-Wohnung kostet im Durchschnitt CHF 1'200-2'000 mit professioneller Firma."
  },
  {
    question: "Muss ich eine Umzugsversicherung haben?",
    answer: "Seriöse Firmen sind versichert. Prüfen Sie den Umfang im Angebot. Für Wertgegenstände lohnt sich Zusatzversicherung."
  },
  {
    question: "Wie früh sollte ich eine Umzugsfirma buchen?",
    answer: "Mindestens 4-6 Wochen vorher, in der Hochsaison (März-September) besser 2-3 Monate."
  },
  {
    question: "Was gehört in den Notfallkoffer?",
    answer: "Dokumente, Medikamente, Wertsachen, Ladegeräte, Toilettenartikel, Wechselkleidung, Snacks, Werkzeug für einfache Montagen."
  }
];

export default function UmzugstippsGuide() {
  const flowPath = useFlowPath();
  const { ref: tipsRef, isVisible: tipsVisible } = useScrollAnimation();
  const { ref: mistakesRef, isVisible: mistakesVisible } = useScrollAnimation();
  const { ref: packingRef, isVisible: packingVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Umzugstipps – 20 Profi-Tipps für den perfekten Umzug | Umzugscheck.ch"
        description="Die besten Umzugstipps von Profis: Planung, Packen, häufige Fehler vermeiden. Mit unseren Tipps gelingt Ihr Umzug stressfrei und günstig."
        canonicalUrl="https://umzugscheck.ch/ratgeber/tipps"
        keywords="Umzugstipps, Umzug planen, Umzug Checkliste, Packtipps, Umzugsfehler vermeiden"
      />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 gradient-hero text-white overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm font-medium">Profi-Ratgeber</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Die besten Umzugstipps
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Von der Planung bis zum Einzug: Mit diesen Tipps vermeiden Sie Stress und sparen Geld bei Ihrem Umzug.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={flowPath}>
                <Button size="lg" variant="cta" className="h-14 px-8 text-lg">
                  Umzug planen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/ratgeber/checklisten">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white">
                  Zur Checkliste
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tips */}
      <PageSection variant="default">
        <motion.div
          ref={tipsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={tipsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="8 wichtigste Umzugstipps"
            subtitle="Diese Tipps machen den Unterschied zwischen Chaos und entspanntem Umzug"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {tips.map((tip, index) => (
              <Card key={index} className={`h-full hover:shadow-lg transition-shadow ${tip.priority === 'high' ? 'border-primary/30' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tip.priority === 'high' ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <tip.icon className={`h-6 w-6 ${tip.priority === 'high' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{tip.title}</h3>
                        {tip.priority === 'high' && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Wichtig</span>
                        )}
                      </div>
                      <p className="text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </PageSection>

      {/* Common Mistakes */}
      <PageSection variant="muted">
        <motion.div
          ref={mistakesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={mistakesVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="6 häufige Fehler vermeiden"
            subtitle="Diese Fehler kosten Zeit, Geld und Nerven"
            className="mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {mistakes.map((mistake, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h3 className="font-bold">{mistake.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{mistake.description}</p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">{mistake.solution}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </PageSection>

      {/* Packing Tips */}
      <PageSection variant="default">
        <motion.div
          ref={packingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={packingVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            title="Richtig packen – 8 Profi-Tipps"
            subtitle="So kommen Ihre Sachen sicher an"
            className="mb-12"
          />
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-4">
                  {packingTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </PageSection>

      {/* Quick Stats */}
      <PageSection variant="muted">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Clock, value: "8 Wochen", label: "Vorlaufzeit empfohlen" },
              { icon: Package, value: "10-15", label: "Kartons pro Zimmer" },
              { icon: DollarSign, value: "bis 40%", label: "Ersparnis möglich" },
              { icon: Star, value: "3-5", label: "Offerten vergleichen" }
            ].map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Related Guides */}
      <PageSection variant="default">
        <SectionHeading
          title="Weitere Ratgeber"
          subtitle="Mehr hilfreiche Informationen für Ihren Umzug"
          className="mb-12"
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link to="/ratgeber/checklisten">
            <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Umzugscheckliste</h3>
                <p className="text-sm text-muted-foreground">PDF-Download mit allen Aufgaben</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/ratgeber/kosten">
            <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Umzugskosten</h3>
                <p className="text-sm text-muted-foreground">Was kostet ein Umzug wirklich?</p>
              </CardContent>
            </Card>
          </Link>
          <Link to={flowPath}>
            <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Truck className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Offerten vergleichen</h3>
                <p className="text-sm text-muted-foreground">Kostenlos Angebote einholen</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </PageSection>

      {/* FAQ */}
      <PageSection variant="muted">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Häufige Fragen zum Umzug"
            subtitle="Antworten auf die wichtigsten Fragen"
            className="mb-12"
          />
          <FAQAccordion items={faqs} />
        </div>
      </PageSection>

      {/* CTA */}
      <PageSection variant="default">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bereit für Ihren Umzug?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Vergleichen Sie jetzt kostenlos Angebote von geprüften Umzugsfirmen und sparen Sie bis zu 40%.
          </p>
          <Link to={flowPath}>
            <Button size="lg" variant="cta" className="h-14 px-10 text-lg">
              Jetzt Offerten erhalten
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </PageSection>
    </div>
  );
}
