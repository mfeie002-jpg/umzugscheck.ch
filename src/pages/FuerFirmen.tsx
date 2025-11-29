import { Navigation } from "@/components/Navigation";
import { EnhancedFooter } from "@/components/home/EnhancedFooter";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle2, TrendingUp, Users, Shield } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const FuerFirmen = () => {
  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Für Umzugsfirmen & Partner – Mehr Aufträge generieren"
        description="Werden Sie Partner von umzugscheck.ch und erhalten Sie qualifizierte Umzugsanfragen. Transparente Preise, geprüfte Leads und einfache Verwaltung."
        canonicalUrl="https://umzugscheck.ch/fuer-firmen"
        keywords="Umzugsfirmen Partner, Umzugsaufträge, Leads für Umzugsfirmen, B2B Umzug"
      />

      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background via-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Für Umzugsfirmen & Partner
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Werden Sie Partner von umzugscheck.ch und erhalten Sie qualifizierte Umzugsanfragen 
                  von Kunden in Ihrer Region. Transparente Abrechnung, geprüfte Leads und einfache Verwaltung.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/anbieter">
                    <Button size="lg" className="w-full sm:w-auto">
                      Jetzt Partner werden
                    </Button>
                  </Link>
                  <Link to="/anbieter/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Zum Login
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-16">
              <ScrollReveal delay={0.1}>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">
                      Qualifizierte Leads
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Erhalten Sie nur Anfragen aus Ihrer Region mit vollständigen Kundendaten
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">
                      Mehr Aufträge
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Steigern Sie Ihre Auslastung mit kontinuierlichen neuen Anfragen
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">
                      Geprüfte Plattform
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Profitieren Sie von unserem Qualitätssiegel und Vertrauen der Kunden
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">
                      Einfache Verwaltung
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Dashboard für Lead-Management, Statistiken und Abrechnung
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  So funktioniert's
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  In wenigen Schritten zum erfolgreichen Partner
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Registrieren",
                  description: "Füllen Sie das Anmeldeformular aus und werden Sie Partner"
                },
                {
                  step: "2",
                  title: "Leads erhalten",
                  description: "Bekommen Sie qualifizierte Umzugsanfragen aus Ihrer Region"
                },
                {
                  step: "3",
                  title: "Aufträge gewinnen",
                  description: "Kontaktieren Sie Kunden und gewinnen Sie neue Aufträge"
                }
              ].map((item, index) => (
                <ScrollReveal key={item.step} delay={0.1 * (index + 1)}>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/anbieter">
                <Button size="lg">
                  Jetzt Partner werden
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <EnhancedFooter />
    </div>
  );
};

export default FuerFirmen;
