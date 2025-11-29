import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home, Shield, Clock, TrendingUp, CheckCircle, Package, ArrowRight } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ScrollReveal } from "@/components/ScrollReveal";

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
    <div className="min-h-screen bg-gradient-elegant">
      <OptimizedSEO
        title="Privatumzug Schweiz – Umzugsfirmen vergleichen"
        description="Privatumzug in der Schweiz planen? Vergleichen Sie geprüfte Umzugsfirmen kostenlos. Bis zu 5 Offerten erhalten und bis zu 40% sparen."
        canonicalUrl="https://www.umzugscheck.ch/privatumzug/"
      />

      {/* Hero */}
      <ScrollReveal>
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-95" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm mb-8 shadow-lift">
                <Home className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Privatumzug in der <span className="text-white">Schweiz</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
                Finden Sie die beste Umzugsfirma für Ihren privaten Umzug. Kostenlose Offerten vergleichen und bis zu 40% sparen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/umzugsofferten">
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg shadow-strong group">
                    Jetzt Offerten vergleichen
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-base" />
                  </Button>
                </Link>
                <Link to="/rechner">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm">
                    Kosten berechnen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

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
      <ScrollReveal delay={100}>
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Vorteile eines professionellen Privatumzugs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { icon: Clock, title: "Zeitersparnis", description: "Profis erledigen Ihren Umzug schnell und effizient" },
                { icon: Shield, title: "Versicherungsschutz", description: "Ihre Möbel sind während des Transports versichert" },
                { icon: TrendingUp, title: "Kosteneffizienz", description: "Durch Vergleich finden Sie die besten Preise" },
                { icon: CheckCircle, title: "Stressfrei", description: "Entspannt umziehen ohne körperliche Belastung" },
                { icon: Package, title: "Komplettservice", description: "Alle Services aus einer Hand verfügbar" },
                { icon: Home, title: "Erfahrung", description: "Professionelle Umzugsexperten mit Know-how" }
              ].map((item, index) => (
                <Card key={index} variant="elevated" className="hover-lift transition-base">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Ablauf */}
      <ScrollReveal delay={150}>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              So funktioniert's
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { step: "1", title: "Offerten anfragen", description: "Füllen Sie unser Formular aus (2 Minuten)" },
                { step: "2", title: "Offerten vergleichen", description: "Erhalten Sie bis zu 5 kostenlose Offerten" },
                { step: "3", title: "Firma wählen", description: "Wählen Sie die beste Umzugsfirma für Ihre Bedürfnisse" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-cta text-white flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-accent">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ */}
      <ScrollReveal delay={200}>
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Häufige Fragen zum Privatumzug
              </h2>
              <FAQAccordion items={faqs} variant="compact" />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal delay={250}>
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 gradient-cta opacity-95" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Bereit für Ihren Privatumzug?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
              Vergleichen Sie jetzt kostenlos Umzugsfirmen und sparen Sie bis zu 40%
            </p>
            <Link to="/umzugsofferten">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-lg shadow-strong group">
                Jetzt Offerten erhalten
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-base" />
              </Button>
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}