import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, Scale, CheckCircle, Phone, TruckIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function SoFunktionierts() {
  const steps = [
    {
      number: "1",
      icon: FileText,
      title: "Umzugsdetails angeben",
      description: "Füllen Sie unser kurzes Formular aus (dauert nur 2 Minuten). Geben Sie Ihre Umzugsdetails an: Von wo nach wo, Wohnungsgrösse und gewünschte Services.",
      time: "2 Minuten"
    },
    {
      number: "2",
      icon: Search,
      title: "Passende Firmen finden",
      description: "Wir durchsuchen unser Netzwerk von über 200 geprüften Umzugsfirmen und finden die besten Matches für Ihren spezifischen Umzug.",
      time: "Automatisch"
    },
    {
      number: "3",
      icon: Scale,
      title: "Bis zu 5 Offerten erhalten",
      description: "Erhalten Sie kostenlose und unverbindliche Offerten von bis zu 5 qualifizierten Umzugsfirmen direkt per E-Mail oder Telefon.",
      time: "24-48 Stunden"
    },
    {
      number: "4",
      icon: CheckCircle,
      title: "Offerten vergleichen",
      description: "Vergleichen Sie die erhaltenen Angebote nach Preis, Leistungen, Bewertungen und wählen Sie die Umzugsfirma, die am besten zu Ihnen passt.",
      time: "In Ruhe entscheiden"
    },
    {
      number: "5",
      icon: Phone,
      title: "Firma direkt kontaktieren",
      description: "Kontaktieren Sie Ihre Wunschfirma direkt für weitere Details, Terminvereinbarung oder Fragen. Wir helfen gerne bei Unklarheiten.",
      time: "Jederzeit"
    },
    {
      number: "6",
      icon: TruckIcon,
      title: "Entspannt umziehen",
      description: "Lehnen Sie sich zurück, während die Profis Ihren Umzug durchführen. Alle unsere Partnerfirmen sind versichert und zertifiziert.",
      time: "Am Umzugstag"
    }
  ];

  const benefits = [
    "100% kostenlos und unverbindlich",
    "Keine versteckten Gebühren",
    "Nur geprüfte und versicherte Firmen",
    "Durchschnittlich 40% Ersparnis",
    "Keine Verpflichtung zur Auftragserteilung",
    "Persönliche Beratung bei Bedarf"
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="So funktioniert's – In 6 einfachen Schritten zum Umzug"
        description="Erfahren Sie, wie Umzugscheck.ch funktioniert. In nur 6 Schritten von der Offertanfrage bis zum erfolgreichen Umzug. Kostenlos und unverbindlich."
        canonicalUrl="https://www.umzugscheck.ch/so-funktionierts"
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              So funktioniert's
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              In nur 6 einfachen Schritten zu Ihrem erfolgreichen Umzug
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {steps.map((step, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <Card variant="elevated" className="hover-lift">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                          {step.number}
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <step.icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                          <h3 className="text-2xl font-bold mb-2 md:mb-0">{step.title}</h3>
                          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full self-start">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <ScrollReveal>
        <section className="py-16 md:py-20 gradient-light">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Ihre Vorteile auf einen Blick
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <ScrollReveal key={index} delay={index * 0.05}>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-soft">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                      <span className="font-medium">{benefit}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ Preview */}
      <ScrollReveal>
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Noch Fragen?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Wir haben die häufigsten Fragen für Sie beantwortet
              </p>
              <Link to="/faq">
                <Button variant="outline" size="lg">
                  Zu den FAQ
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <section className="py-16 md:py-20 gradient-cta text-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bereit loszulegen?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Starten Sie jetzt und erhalten Sie kostenlose Offerten von geprüften Umzugsfirmen
            </p>
            <Link to="/umzugsofferten">
              <Button size="lg" variant="cta" className="h-14 px-8 text-lg bg-white text-primary hover:bg-white/90">
                Jetzt Offerten erhalten
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
