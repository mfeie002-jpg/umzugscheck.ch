import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Star, Shield, Clock, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";

interface CityMovingPageProps {
  city: string;
  canton: string;
  description: string;
  companies?: Array<{
    name: string;
    rating: number;
    reviews: number;
    priceLevel: string;
  }>;
}

export const CityMovingPage = ({ city, canton, description, companies = [] }: CityMovingPageProps) => {
  const metaTitle = `Umzug ${city} – Umzugsfirmen vergleichen | umzugscheck.ch`;
  const metaDescription = `Umzug in ${city} planen? Vergleichen Sie geprüfte Umzugsfirmen in ${city} kostenlos. Bis zu 5 Offerten erhalten und bis zu 40% sparen.`;

  const faqs = [
    {
      question: `Was kostet ein Umzug in ${city}?`,
      answer: `Die Kosten für einen Umzug in ${city} hängen von Wohnungsgrösse, Stockwerk und Distanz ab. Ein 3-Zimmer-Umzug innerhalb von ${city} kostet durchschnittlich CHF 1'200–1'800. Nutzen Sie unseren Preisrechner für eine genaue Schätzung.`
    },
    {
      question: `Wie finde ich die beste Umzugsfirma in ${city}?`,
      answer: `Mit umzugscheck.ch vergleichen Sie geprüfte Umzugsfirmen in ${city}. Sie erhalten bis zu 5 kostenlose Offerten, können Bewertungen lesen und Preise vergleichen – alles an einem Ort.`
    },
    {
      question: `Sind Umzugsfirmen in ${city} versichert?`,
      answer: `Alle Umzugsfirmen auf umzugscheck.ch sind versichert und zertifiziert. Sie können sicher sein, dass Ihr Umzug in ${city} professionell abgewickelt wird.`
    },
    {
      question: `Wie lange dauert die Offertenerstellung?`,
      answer: `Nach der Eingabe Ihrer Umzugsdetails erhalten Sie innerhalb von 24 Stunden bis zu 5 unverbindliche Offerten von Umzugsfirmen in ${city}.`
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Geprüfte Firmen",
      description: `Alle Umzugsfirmen in ${city} sind versichert und zertifiziert`
    },
    {
      icon: TrendingUp,
      title: "Bis zu 40% sparen",
      description: "Durch den direkten Vergleich finden Sie die besten Preise"
    },
    {
      icon: Clock,
      title: "Schnell & einfach",
      description: "In 2 Minuten bis zu 5 Offerten erhalten"
    },
    {
      icon: CheckCircle,
      title: "100% kostenlos",
      description: "Unser Service ist für Sie komplett kostenlos"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title={metaTitle}
        description={metaDescription}
        canonicalUrl={`https://umzugscheck.ch/${city.toLowerCase()}/umzug`}
        keywords={`Umzug ${city}, Umzugsfirmen ${city}, ${city} Umzug, Umzug ${canton}, Umzugsofferten ${city}`}
      />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 gradient-hero overflow-hidden">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Umzug in {city}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/umzug-offerte">
                  <Button size="lg" className="h-14 px-8 text-lg gradient-cta hover-lift">
                    Jetzt Offerten vergleichen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/umzugsrechner">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                    Kosten berechnen
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 justify-center mt-8 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.8/5 Bewertung</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>25'000+ erfolgreiche Umzüge</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>100% geprüfte Partner</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Warum umzugscheck.ch in {city} nutzen?
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <ScrollReveal key={index} delay={index * 100}>
                  <Card className="h-full hover-lift" variant="elevated">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services in City */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Umzugsservices in {city}
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <ScrollReveal delay={100}>
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Privatumzug</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Kompletter Service für Ihren privaten Umzug in {city}
                  </p>
                  <Link to="/umzug-schweiz">
                    <Button variant="outline" size="sm" className="w-full">
                      Mehr erfahren
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Umzugsreinigung</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Professionelle End- und Umzugsreinigung in {city}
                  </p>
                  <Link to="/umzugsreinigung-schweiz">
                    <Button variant="outline" size="sm" className="w-full">
                      Mehr erfahren
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Firmenumzug</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Professionelle Büroumzüge in {city}
                  </p>
                  <Link to="/firmenumzug-schweiz">
                    <Button variant="outline" size="sm" className="w-full">
                      Mehr erfahren
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Häufige Fragen zu Umzügen in {city}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <FAQAccordion items={faqs} variant="compact" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 gradient-cta text-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bereit für Ihren Umzug in {city}?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Erhalten Sie jetzt kostenlose Offerten von geprüften Umzugsfirmen in {city}
            </p>
            <Link to="/umzug-offerte">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg hover-lift">
                Jetzt Offerten vergleichen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};