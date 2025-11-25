import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Calculator, Search, CheckCircle, TrendingUp, Star, DollarSign, Shield, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Umzugsfirmen Vergleich Schweiz",
  "description": "Vergleichen Sie Schweizer Umzugsfirmen nach Preis, Service und Bewertungen. Finden Sie die perfekte Umzugsfirma für Ihren Umzug.",
  "url": "https://umzugscheck.ch/vergleich"
};

const Vergleich = () => {
  return (
    <>
      <SEOHead
        title="Umzugsfirmen Vergleich Schweiz - Beste Anbieter finden | Umzugscheck.ch"
        description="Vergleichen Sie über 200 geprüfte Schweizer Umzugsfirmen nach Preis, Service und Bewertungen. Unabhängig, transparent und kostenlos. Jetzt beste Umzugsfirma finden."
        keywords="umzugsfirmen vergleich, umzugsunternehmen schweiz, beste umzugsfirma, umzugsfirma bewertung"
        canonical="/vergleich"
        structuredData={structuredData}
      />

      <Navigation />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "Vergleich", href: "/vergleich" }
            ]}
          />

          {/* Hero Section */}
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 md:mb-16 mt-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                Umzugsfirmen vergleichen und sparen
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">
                Vergleichen Sie über 200 geprüfte Umzugsfirmen in der ganzen Schweiz – transparent, unabhängig und 100% kostenlos. 
                Sparen Sie bis zu 40% durch unseren intelligenten Vergleich.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link to="/offerte">
                    Jetzt Offerte anfordern
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link to="/firmen">
                    <Search className="w-5 h-5 mr-2" />
                    Firmen durchsuchen
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Why Compare Section */}
          <ScrollReveal delay={0.1}>
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
                Warum Umzugsfirmen vergleichen?
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    icon: DollarSign,
                    title: "Preise",
                    description: "Preise zwischen Anbietern variieren um 30-50%. Durch Vergleich finden Sie das beste Preis-Leistungs-Verhältnis und sparen hunderte Franken."
                  },
                  {
                    icon: Shield,
                    title: "Services",
                    description: "Nicht alle Firmen bieten die gleichen Leistungen. Vergleichen Sie Versicherungsschutz, Zusatzservices und Verfügbarkeit für Ihre Bedürfnisse."
                  },
                  {
                    icon: Star,
                    title: "Bewertungen",
                    description: "Echte Kundenbewertungen zeigen die Zuverlässigkeit. Nur durch Vergleich finden Sie Firmen mit nachweislich hoher Qualität und Kundenzufriedenheit."
                  }
                ].map((item, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg sm:text-xl mb-3">{item.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Comparison Table */}
          <ScrollReveal delay={0.2}>
            <section className="mb-12 sm:mb-16 bg-muted/30 rounded-2xl p-6 sm:p-8 md:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
                Umzugsfirmen im direkten Vergleich
              </h2>
              
              {/* Mobile-optimized table */}
              <div className="overflow-x-auto -mx-6 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-6 sm:px-0">
                  <table className="min-w-full bg-background rounded-xl border shadow-medium">
                    <thead>
                      <tr className="border-b bg-secondary/20">
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Firma</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base hidden md:table-cell">Region</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Preis</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base">Rating</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base hidden sm:table-cell">Services</th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Züri Umzüge AG", region: "Zürich", price: "CHF CHF", rating: 4.8, reviewCount: 156, services: ["Transport", "Montage", "Reinigung"] },
                        { name: "Bern Umzüge Pro", region: "Bern", price: "CHF", rating: 4.7, reviewCount: 178, services: ["Transport", "Entsorgung"] },
                        { name: "Swiss Move Basel", region: "Basel", price: "CHF CHF CHF", rating: 4.9, reviewCount: 145, services: ["Transport", "Montage", "Lagerung"] },
                        { name: "Luzern Transport AG", region: "Luzern", price: "CHF CHF", rating: 4.6, reviewCount: 134, services: ["Transport", "Reinigung"] }
                      ].map((company, index) => (
                        <tr key={index} className="border-b last:border-0 hover:bg-secondary/5 transition-colors">
                          <td className="p-3 sm:p-4">
                            <div className="font-medium text-sm sm:text-base">{company.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{company.region}</div>
                          </td>
                          <td className="p-3 sm:p-4 text-sm text-muted-foreground hidden md:table-cell">{company.region}</td>
                          <td className="p-3 sm:p-4">
                            <span className="text-primary font-semibold text-sm sm:text-base">{company.price}</span>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              <span className="font-medium text-sm sm:text-base">{company.rating}</span>
                              <span className="text-xs text-muted-foreground hidden sm:inline">({company.reviewCount})</span>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4 hidden sm:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {company.services.slice(0, 2).map((service, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-secondary rounded-full whitespace-nowrap">
                                  {service}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <Button size="sm" variant="outline" asChild className="text-xs whitespace-nowrap">
                              <Link to="/firmen">Details</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4">
                Beispieldaten zur Illustration. Ihre tatsächlichen Offerten basieren auf Ihren individuellen Anforderungen.
              </p>
            </section>
          </ScrollReveal>

          {/* Regional Links */}
          <ScrollReveal delay={0.3}>
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
                Vergleich nach Regionen
              </h2>
              <p className="text-center text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base px-4">
                Finden Sie die besten Umzugsfirmen in Ihrer Stadt und vergleichen Sie lokale Anbieter
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {[
                  { name: "Zürich", slug: "zuerich" },
                  { name: "Bern", slug: "bern" },
                  { name: "Basel", slug: "basel" },
                  { name: "Luzern", slug: "luzern" },
                  { name: "Winterthur", slug: "winterthur" },
                  { name: "St. Gallen", slug: "st-gallen" }
                ].map((city, index) => (
                  <Button key={index} variant="outline" asChild className="h-auto py-3 sm:py-4 text-xs sm:text-sm">
                    <Link to={`/umzugsfirmen/${city.slug}`} className="flex flex-col items-center gap-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-medium">{city.name}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Why Umzugscheck */}
          <ScrollReveal delay={0.4}>
            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
                Warum über Umzugscheck.ch vergleichen?
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    icon: CheckCircle,
                    title: "Unabhängig & neutral",
                    description: "Wir sind keine Umzugsfirma, sondern eine unabhängige Vergleichsplattform. Ihre Zufriedenheit steht im Mittelpunkt, nicht Provisionen."
                  },
                  {
                    icon: TrendingUp,
                    title: "Geprüfte Qualität",
                    description: "Alle Firmen werden von uns verifiziert. Nur seriöse Anbieter mit Versicherung, guten Bewertungen und nachweislicher Qualität sind gelistet."
                  },
                  {
                    icon: Calculator,
                    title: "Intelligenter Algorithmus",
                    description: "Unser System findet automatisch die besten Firmen für Ihre spezifischen Anforderungen basierend auf Grösse, Distanz und gewünschten Services."
                  }
                ].map((benefit, index) => (
                  <div key={index} className="text-center p-4 sm:p-6 bg-background rounded-xl border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg sm:text-xl mb-2">{benefit.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* CTA Section */}
          <ScrollReveal delay={0.5}>
            <section className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8 md:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Jetzt Offerte anfordern und vergleichen
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-primary-foreground/90">
                Erhalten Sie kostenlose Offerten von geprüften Umzugsfirmen und vergleichen Sie transparent
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
                  <Link to="/offerte">
                    Jetzt Offerte anfordern
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link to="/rechner">
                    <Calculator className="w-5 h-5 mr-2" />
                    Kosten berechnen
                  </Link>
                </Button>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Vergleich;
