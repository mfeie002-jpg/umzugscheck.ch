import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, FileCheck, Award, Star, MapPin, CheckCircle2, ArrowRight, TrendingUp, Package, Truck, Home, Clock, Shield, Users, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SEOHead } from "@/components/SEOHead";
import { QuickCalculator } from "@/components/QuickCalculator";

const Index = () => {
  const topCities = [
    { name: "Zürich", slug: "zuerich", description: "Grösste Stadt mit hoher Umzugsnachfrage und professionellen Anbietern" },
    { name: "Bern", slug: "bern", description: "Hauptstadt mit historischer Altstadt" },
    { name: "Basel", slug: "basel", description: "Kulturzentrum am Dreiländereck" },
    { name: "Luzern", slug: "luzern", description: "Zentral gelegen am Vierwaldstättersee" },
    { name: "Winterthur", slug: "winterthur", description: "Grösste Stadt im Kanton Zürich nach der Hauptstadt" }
  ];

  const priceRanges = [
    { type: "1-2 Zimmer Wohnung", price: "CHF 800 - 1'500", note: "Kleinere Wohnungen" },
    { type: "3-4 Zimmer Wohnung", price: "CHF 1'500 - 3'000", note: "Familienwohnungen" },
    { type: "Haus", price: "CHF 3'000 - 6'000+", note: "Einfamilienhäuser" },
    { type: "Firmenumzug", price: "CHF 2'000 - 5'000+", note: "Klein- bis Mittelbetriebe" }
  ];

  const featuredCompanies = [
    { name: "Zürich Umzüge AG", city: "Zürich", rating: 4.8, usp: "Spezialist für Altbauten" },
    { name: "Berner Zügelfirma", city: "Bern", rating: 4.7, usp: "Familienunternehmen seit 1985" },
    { name: "Basel Express Moving", city: "Basel", rating: 4.9, usp: "Grenzüberschreitende Umzüge" },
    { name: "Luzern Transport AG", city: "Luzern", rating: 4.6, usp: "Komplettservice mit Lagerung" },
    { name: "Winterthur Movers", city: "Winterthur", rating: 4.8, usp: "Faire Preise, Top Service" },
    { name: "St. Gallen Umzüge", city: "St. Gallen", rating: 4.7, usp: "Ostschweiz-Spezialist" }
  ];

  const calculatorTools = [
    { 
      title: "Umzugskosten-Rechner", 
      slug: "umzugskosten", 
      description: "Berechnen Sie Ihre Umzugskosten in wenigen Klicks",
      icon: Calculator 
    },
    { 
      title: "Volumenrechner", 
      slug: "volumenrechner", 
      description: "Ermitteln Sie das Volumen Ihres Hausrats",
      icon: Package 
    },
    { 
      title: "Transporter-Grössen-Rechner", 
      slug: "transporter-groesse", 
      description: "Finden Sie die passende Transportergrösse",
      icon: Truck 
    }
  ];

  const testimonials = [
    { name: "Martin S.", city: "Zürich", rating: 5, text: "Schnell, professionell und faire Preise. Sehr empfehlenswert!" },
    { name: "Sandra M.", city: "Bern", rating: 5, text: "Drei Offerten erhalten und 30% gespart. Danke!" },
    { name: "Thomas K.", city: "Basel", rating: 5, text: "Unkompliziert und transparent. Genau das, was ich gesucht habe." },
    { name: "Julia R.", city: "Luzern", rating: 5, text: "Top Service und sehr hilfsbereites Team. Immer wieder gerne!" }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Umzugscheck.ch",
    "url": "https://umzugscheck.ch",
    "description": "Vergleichen Sie Umzugsofferten von geprüften Schweizer Umzugsfirmen. Kostenlos, unverbindlich und transparent."
  };

  return (
    <>
      <SEOHead
        title="Umzugsfirmen vergleichen Schweiz - Bis zu 40% sparen | Umzugscheck.ch"
        description="Vergleichen Sie Umzugsofferten von geprüften Schweizer Umzugsfirmen. Kostenlos, unverbindlich und transparent. Sparen Sie bis zu 40% bei Ihrem Umzug."
        keywords="umzug schweiz, umzugsfirma vergleichen, umzugsofferte, umzugskosten, umzugsfirmen zürich"
        canonical="https://umzugscheck.ch"
        structuredData={structuredData}
      />

      <Navigation />

      <main className="min-h-screen bg-background">
        {/* HERO SECTION */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Umzugsfirmen in der Schweiz vergleichen – in wenigen Klicks zur besten Offerte
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  Erhalten Sie mehrere Offerten von geprüften Umzugsfirmen, vergleichen Sie transparent und sparen Sie bis zu 40%. 
                  Kostenlos und unverbindlich.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link to="/offerte">
                    <Button size="lg" className="text-lg px-8 py-6 shadow-accent w-full sm:w-auto">
                      Jetzt Offerte vergleichen
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/rechner">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">
                      <Calculator className="mr-2 h-5 w-5" />
                      Umzugskosten berechnen
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Calculator Highlight */}
            <ScrollReveal delay={0.2}>
              <div className="max-w-3xl mx-auto mt-16">
                <Card className="shadow-strong border-primary/20">
                  <CardHeader className="text-center pb-4">
                    <Badge variant="secondary" className="w-fit mx-auto mb-3">
                      <Calculator className="w-3 h-3 mr-1" />
                      Ihr persönlicher Preisrechner
                    </Badge>
                    <CardTitle className="text-2xl">Berechnen Sie Ihre Umzugskosten jetzt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QuickCalculator />
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 md:py-24 bg-secondary/5">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  So funktioniert umzugscheck.ch
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  In nur drei einfachen Schritten zu Ihrem perfekten Umzugsangebot
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: FileCheck, title: "Anfrage ausfüllen", description: "Beschreiben Sie Ihren Umzug in wenigen Minuten – kostenlos und unverbindlich" },
                { icon: MessageSquare, title: "Offerten von geprüften Umzugsfirmen erhalten", description: "Erhalten Sie bis zu 5 Angebote von verifizierten Anbietern in Ihrer Region" },
                { icon: Award, title: "Vergleichen & den besten Partner wählen", description: "Vergleichen Sie Preise und Leistungen, und wählen Sie das beste Angebot aus" }
              ].map((step, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <Card className="text-center h-full hover:shadow-medium transition-all">
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-primary font-bold text-lg mb-2">Schritt {index + 1}</div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* TOP CITIES */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Beliebte Umzugsregionen
                </h2>
                <p className="text-lg text-muted-foreground">
                  Finden Sie geprüfte Umzugsfirmen in den grössten Städten der Schweiz
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {topCities.map((city, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <Link to={`/umzugsfirmen/${city.slug}`}>
                    <Card className="h-full hover:shadow-strong hover:border-primary/40 transition-all group">
                      <CardHeader>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {city.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{city.description}</p>
                        <Button variant="ghost" size="sm" className="group-hover:gap-2 transition-all">
                          Umzugsfirmen in {city.name} ansehen
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* PRICE OVERVIEW */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/10 to-background">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Was kostet ein Umzug in der Schweiz?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Typische Preisspannen für verschiedene Umzugsarten
                </p>
              </div>
            </ScrollReveal>

            <div className="max-w-4xl mx-auto">
              <ScrollReveal>
                <div className="bg-background rounded-xl border shadow-medium overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-secondary/20">
                          <th className="text-left p-4 font-semibold">Umzugsart</th>
                          <th className="text-left p-4 font-semibold">Preisspanne</th>
                          <th className="text-left p-4 font-semibold">Hinweis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {priceRanges.map((range, index) => (
                          <tr key={index} className="border-b last:border-0 hover:bg-secondary/5 transition-colors">
                            <td className="p-4 font-medium">{range.type}</td>
                            <td className="p-4 text-primary font-semibold">{range.price}</td>
                            <td className="p-4 text-sm text-muted-foreground">{range.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </ScrollReveal>

              <div className="text-center mt-8">
                <Link to="/preise">
                  <Button size="lg" variant="outline">
                    Alle Preise ansehen
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED COMPANIES */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Beliebte Umzugsfirmen auf umzugscheck.ch
                </h2>
                <p className="text-lg text-muted-foreground">
                  Geprüfte und verifizierte Partner aus der ganzen Schweiz
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {featuredCompanies.map((company, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <Card className="h-full hover:shadow-strong hover:border-primary/40 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                          <Home className="w-6 h-6 text-primary" />
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-yellow-500" />
                          {company.rating}
                        </Badge>
                      </div>
                      <CardTitle>{company.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {company.city}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{company.usp}</p>
                      <Link to="/umzugsfirmen">
                        <Button variant="outline" className="w-full" size="sm">
                          Details & Offerte
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/umzugsfirmen">
                <Button size="lg">
                  Alle Umzugsfirmen ansehen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* TOOLS & CALCULATORS */}
        <section className="py-16 md:py-24 bg-secondary/5">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">
                  <Calculator className="w-3 h-3 mr-1" />
                  Kostenlose Tools
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Praktische Umzugstools
                </h2>
                <p className="text-lg text-muted-foreground">
                  Planen und berechnen Sie Ihren Umzug mit unseren kostenlosen Rechnern
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {calculatorTools.map((tool, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <Link to={`/rechner/${tool.slug}`}>
                    <Card className="h-full hover:shadow-strong hover:border-primary/40 transition-all group">
                      <CardHeader>
                        <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <tool.icon className="w-7 h-7 text-primary" />
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {tool.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{tool.description}</p>
                        <Button variant="ghost" size="sm" className="group-hover:gap-2 transition-all">
                          Tool öffnen
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS & TRUST */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Erfahrungen unserer Nutzer
                </h2>
                <p className="text-lg text-muted-foreground">
                  Tausende zufriedene Kunden vertrauen auf umzugscheck.ch
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
              {testimonials.map((testimonial, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <div className="text-sm text-muted-foreground">{testimonial.city}</div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                <Badge variant="secondary" className="px-6 py-3 text-base">
                  <Shield className="w-4 h-4 mr-2" />
                  Schweizer Plattform
                </Badge>
                <Badge variant="secondary" className="px-6 py-3 text-base">
                  <Users className="w-4 h-4 mr-2" />
                  Mehrere tausend Offerten pro Jahr
                </Badge>
                <Badge variant="secondary" className="px-6 py-3 text-base">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Nur geprüfte Firmen
                </Badge>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* SEO TEXT BLOCK */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/5 to-background border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <ScrollReveal>
                <div className="space-y-6 text-foreground">
                  <h2 className="text-3xl font-bold mb-6">Warum Umzugsfirmen in der Schweiz vergleichen?</h2>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    Ein Umzug ist eine der stressigsten Lebenssituationen – und oft auch eine der kostspieligsten. In der Schweiz variieren die 
                    Preise von Umzugsfirmen stark, abhängig von Region, Umfang und Zusatzleistungen. Genau deshalb lohnt es sich, Umzugsofferten 
                    zu vergleichen: Sie können bis zu 40% der Kosten sparen, indem Sie mehrere Angebote einholen und das beste Preis-Leistungs-Verhältnis 
                    auswählen.
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    Umzugscheck.ch ist die führende Vergleichsplattform für Umzugsfirmen in der Schweiz. Wir helfen Ihnen, schnell und unkompliziert 
                    mehrere Offerten von geprüften Anbietern zu erhalten – kostenlos, unverbindlich und transparent. Egal ob Sie in Zürich, Bern, Basel 
                    oder einer anderen Stadt umziehen: Mit unserem Service finden Sie die passende Umzugsfirma für Ihre Bedürfnisse.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4">Regionale Unterschiede bei Umzugskosten</h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    Die Kosten für einen Umzug unterscheiden sich je nach Region deutlich. In Grossstädten wie Zürich oder Genf sind Umzüge tendenziell 
                    teurer als in ländlichen Gebieten. Das liegt an höheren Lebenshaltungskosten, Parkplatzproblemen und der grösseren Nachfrage nach 
                    Umzugsdienstleistungen. Dennoch gibt es auch in teureren Regionen preiswerte Anbieter – vorausgesetzt, Sie vergleichen mehrere 
                    Umzugsofferten.
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    Beim Vergleich von Umzugsfirmen sollten Sie nicht nur auf den Preis achten, sondern auch auf Bewertungen, Versicherungsschutz und 
                    angebotene Services. Viele Umzugsfirmen bieten heute Komplettlösungen an, die neben dem Transport auch Reinigung, Entsorgung, 
                    Möbelmontage und Zwischenlagerung umfassen.
                  </p>

                  <h3 className="text-2xl font-bold mt-8 mb-4">So funktioniert umzugscheck.ch</h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    Unser Service ist denkbar einfach: Sie füllen einmal ein kurzes Formular aus, in dem Sie Ihren Umzug beschreiben. Wir leiten Ihre 
                    Anfrage an bis zu fünf passende Umzugsfirmen in Ihrer Region weiter. Diese erstellen Ihnen individuelle Offerten, die Sie bequem 
                    vergleichen können. Sie wählen dann das Angebot aus, das am besten zu Ihnen passt – ohne versteckte Kosten, ohne Verpflichtung.
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    Alle Umzugsfirmen auf unserer Plattform sind geprüft und verfügen über die notwendigen Versicherungen. Sie profitieren von echten 
                    Kundenbewertungen, die Ihnen bei der Auswahl helfen. Zusätzlich bieten wir Ihnen kostenlose Rechner, mit denen Sie Ihre Umzugskosten 
                    vorab schätzen können.
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    Mit umzugscheck.ch sparen Sie nicht nur Geld, sondern auch Zeit und Nerven. Statt stundenlang im Internet nach Umzugsfirmen zu suchen 
                    und einzeln Offerten einzuholen, erhalten Sie bei uns alle Angebote zentral an einem Ort. So können Sie sich auf das Wesentliche 
                    konzentrieren: Ihren Neuanfang in Ihrem neuen Zuhause.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 md:py-28 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold">
                  Bereit für Ihren Umzug?
                </h2>
                <p className="text-xl text-primary-foreground/90">
                  Holen Sie sich jetzt kostenlose Offerten von geprüften Umzugsfirmen und sparen Sie bis zu 40%
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/offerte">
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                      Jetzt Offerte anfordern
                      <ArrowRight className="ml-2 h-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/umzugsfirmen">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                      Firmen durchstöbern
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Index;
