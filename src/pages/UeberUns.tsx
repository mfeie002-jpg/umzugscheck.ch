import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Users, TrendingUp, Shield, Heart, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function UeberUns() {
  const values = [
    {
      icon: Shield,
      title: "Transparenz",
      description: "Faire Preise, echte Bewertungen, keine versteckten Kosten"
    },
    {
      icon: Users,
      title: "Kundenorientierung",
      description: "Ihre Zufriedenheit ist unser oberstes Ziel"
    },
    {
      icon: TrendingUp,
      title: "Qualität",
      description: "Nur geprüfte und zuverlässige Umzugsfirmen"
    },
    {
      icon: Heart,
      title: "Engagement",
      description: "Persönliche Betreuung und schnelle Hilfe"
    }
  ];

  const stats = [
    { value: "15'000+", label: "Zufriedene Kunden" },
    { value: "200+", label: "Partnerf irmen" },
    { value: "4.8/5", label: "Durchschnittsbewertung" },
    { value: "26", label: "Kantone abgedeckt" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title="Über uns – Die Nr. 1 Umzugsplattform der Schweiz"
        description="Erfahren Sie mehr über Umzugscheck.ch, die führende Vergleichsplattform für Umzüge in der Schweiz. Unsere Mission, Werte und was uns auszeichnet."
        canonicalUrl="https://www.umzugscheck.ch/ueber-uns"
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Über Umzugscheck.ch
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Die führende Vergleichsplattform für Umzüge in der Schweiz
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission */}
      <ScrollReveal>
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Unsere Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Wir machen Umzüge einfacher, transparenter und günstiger. Mit unserer Plattform 
                helfen wir Privatpersonen und Unternehmen, die beste Umzugsfirma für ihre 
                Bedürfnisse zu finden – kostenlos, unverbindlich und in nur wenigen Minuten.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Stats */}
      <ScrollReveal>
        <section className="py-16 gradient-light">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Story */}
      <ScrollReveal>
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Unsere Geschichte</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Umzugscheck.ch wurde 2020 mit der Vision gegründet, den Schweizer Umzugsmarkt 
                  zu revolutionieren. Wir haben gesehen, dass viele Menschen Schwierigkeiten haben, 
                  verlässliche Umzugsfirmen zu finden und faire Preise zu vergleichen.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Heute sind wir die Nr. 1 Umzugsplattform der Schweiz und haben bereits über 
                  15'000 erfolgreiche Umzüge vermittelt. Unser Netzwerk umfasst über 200 geprüfte 
                  Umzugsfirmen in allen 26 Kantonen.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Was uns antreibt: Wir wollen, dass jeder Umzug – egal ob klein oder gross – 
                  stressfrei und zu einem fairen Preis über die Bühne geht.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Werte */}
      <ScrollReveal>
        <section className="py-16 md:py-20 gradient-light">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Unsere Werte
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <Card variant="elevated" className="h-full hover-lift">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <value.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Was uns auszeichnet */}
      <ScrollReveal>
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Was uns auszeichnet
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card variant="elevated">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Schnell & einfach</h3>
                        <p className="text-sm text-muted-foreground">
                          Angebote in 2 Minuten erhalten – ohne Papierkram
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card variant="elevated">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">100% kostenlos</h3>
                        <p className="text-sm text-muted-foreground">
                          Keine versteckten Gebühren, komplett gratis
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card variant="elevated">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Nur geprüfte Firmen</h3>
                        <p className="text-sm text-muted-foreground">
                          Alle Partner sind verifiziert und versichert
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card variant="elevated">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Bis zu 40% sparen</h3>
                        <p className="text-sm text-muted-foreground">
                          Durch Vergleich die besten Preise finden
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <section className="py-16 md:py-20 gradient-cta text-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bereit für Ihren Umzug?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Erhalten Sie jetzt kostenlose Offerten von geprüften Umzugsfirmen
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
