import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calculator, Check, Star, MapPin, TrendingDown, Shield, Award, Users, Clock } from "lucide-react";
import { QuickCalculator } from "@/components/QuickCalculator";
import { motion } from "framer-motion";

const topCities = [
  { name: "Zürich", slug: "zuerich", description: "Die grösste Stadt der Schweiz mit höchster Umzugsnachfrage" },
  { name: "Bern", slug: "bern", description: "Hauptstadt mit historischer Altstadt" },
  { name: "Basel", slug: "basel", description: "Kulturzentrum an der Grenze zu Deutschland und Frankreich" },
  { name: "Luzern", slug: "luzern", description: "Touristische Destination am Vierwaldstättersee" },
  { name: "Winterthur", slug: "winterthur", description: "Zweitgrösste Stadt im Kanton Zürich" }
];

const priceRanges = [
  { type: "1-2 Zimmer Wohnung", price: "CHF 800 - 1'500", volume: "15-25 m³" },
  { type: "3-4 Zimmer Wohnung", price: "CHF 1'500 - 3'000", volume: "30-45 m³" },
  { type: "Haus (5+ Zimmer)", price: "CHF 3'000 - 6'000+", volume: "50-80+ m³" },
  { type: "Firmenumzug (klein)", price: "CHF 2'000 - 5'000", volume: "Individuell" }
];

const featuredCompanies = [
  { name: "Zürich Umzüge AG", city: "Zürich", rating: 4.8, usp: "Spezialist für Altbauten" },
  { name: "Berner Zügelfirma", city: "Bern", rating: 4.7, usp: "Familienunternehmen seit 1985" },
  { name: "Basel Express Moving", city: "Basel", rating: 4.9, usp: "Grenzüberschreitende Umzüge" },
  { name: "Luzern Transport AG", city: "Luzern", rating: 4.6, usp: "Komplettservice mit Lagerung" },
  { name: "Winterthur Movers", city: "Winterthur", rating: 4.8, usp: "Faire Preise, Top Service" },
  { name: "St. Gallen Umzüge", city: "St. Gallen", rating: 4.7, usp: "Ostschweiz-Spezialist" }
];

const testimonials = [
  { name: "Martin S.", city: "Zürich", rating: 5, text: "Schnell, professionell und faire Preise. Sehr empfehlenswert!" },
  { name: "Sandra M.", city: "Bern", rating: 5, text: "Drei Offerten erhalten und 30% gespart. Danke umzugscheck.ch!" },
  { name: "Thomas K.", city: "Basel", rating: 5, text: "Unkompliziert und transparent. Genau das, was ich gesucht habe." }
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Umzugscheck.ch",
  "url": "https://umzugscheck.ch",
  "description": "Vergleichen Sie Umzugsofferten von geprüften Schweizer Umzugsfirmen",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://umzugscheck.ch/umzugsfirmen?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const Index = () => {
  return (
    <>
      <SEOHead
        title="Umzugscheck.ch - Umzugsfirmen vergleichen & bis zu 40% sparen"
        description="Vergleichen Sie Umzugsofferten von geprüften Schweizer Umzugsfirmen. Kostenlos, unverbindlich und transparent. Sparen Sie bis zu 40% bei Ihrem Umzug."
        keywords="umzug schweiz, umzugsfirma vergleichen, umzugsofferte, umzugskosten schweiz, umzugsfirmen zürich, umzug bern"
        canonical="/"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Umzugsfirmen in der Schweiz vergleichen – in wenigen Klicks zur besten Offerte
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                  Erhalten Sie mehrere Offerten von geprüften Umzugsfirmen, vergleichen Sie transparent und sparen Sie bis zu 40%. 
                  Kostenlos und unverbindlich.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link to="/offerte">
                    Jetzt Offerte vergleichen
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link to="/rechner">
                    <Calculator className="mr-2 h-5 w-5" />
                    Umzugskosten berechnen
                  </Link>
                </Button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Schweizer Plattform</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Geprüfte Firmen</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>5'000+ zufriedene Kunden</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* AI Calculator Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Umzugskosten sofort berechnen
                </h2>
                <p className="text-xl text-muted-foreground">
                  Nutzen Sie unseren KI-Preisrechner für eine präzise Kostenschätzung in Sekunden
                </p>
              </div>
              <QuickCalculator />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                So funktioniert umzugscheck.ch
              </h2>
              <p className="text-xl text-muted-foreground">
                In nur 3 Schritten zur besten Umzugsfirma
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Anfrage ausfüllen",
                  description: "Beschreiben Sie Ihren Umzug in nur 2 Minuten mit unserem einfachen Formular",
                  icon: Calculator
                },
                {
                  step: "2",
                  title: "Offerten von geprüften Umzugsfirmen erhalten",
                  description: "Erhalten Sie mehrere Offerten von verifizierten Firmen in Ihrer Region",
                  icon: Clock
                },
                {
                  step: "3",
                  title: "Vergleichen & den besten Partner wählen",
                  description: "Vergleichen Sie Preise, Bewertungen und Services – und wählen Sie optimal",
                  icon: Check
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center h-full">
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                        {item.step}
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Cities */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Beliebte Umzugsregionen
              </h2>
              <p className="text-xl text-muted-foreground">
                Finden Sie die besten Umzugsfirmen in Ihrer Stadt
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {topCities.map((city, index) => (
                <motion.div
                  key={city.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl">{city.name}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">{city.description}</p>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="outline" className="w-full">
                        <Link to={`/umzugsfirmen/${city.slug}`}>
                          Umzugsfirmen in {city.name} ansehen
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Price Overview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Was kostet ein Umzug in der Schweiz?
              </h2>
              <p className="text-xl text-muted-foreground">
                Typische Preisspannen für verschiedene Umzugsarten
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="grid gap-4">
                {priceRanges.map((range, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card>
                      <CardContent className="flex items-center justify-between p-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{range.type}</h3>
                          <p className="text-sm text-muted-foreground">{range.volume}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{range.price}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button asChild size="lg" variant="outline">
                  <Link to="/preise">
                    <TrendingDown className="mr-2 h-5 w-5" />
                    Alle Preise ansehen
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Companies */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Beliebte Umzugsfirmen auf umzugscheck.ch
              </h2>
              <p className="text-xl text-muted-foreground">
                Geprüfte und bewertete Partner in der ganzen Schweiz
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {featuredCompanies.map((company, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{company.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{company.city}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(company.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-semibold">{company.rating}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{company.usp}</p>
                      <Button asChild className="w-full">
                        <Link to="/umzugsfirmen">Details & Offerte</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg" variant="outline">
                <Link to="/umzugsfirmen">Alle Umzugsfirmen ansehen</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Praktische Umzugstools
              </h2>
              <p className="text-xl text-muted-foreground">
                Kostenlose Rechner zur Planung Ihres Umzugs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  title: "Umzugskosten-Rechner",
                  description: "Berechnen Sie die voraussichtlichen Kosten Ihres Umzugs basierend auf Zimmerzahl und Distanz",
                  link: "/rechner/umzugskosten"
                },
                {
                  title: "Volumenrechner",
                  description: "Ermitteln Sie das Volumen Ihres Hausrats für eine präzise Kosteneinschätzung",
                  link: "/rechner/volumenrechner"
                },
                {
                  title: "Transporter-Grössen-Rechner",
                  description: "Finden Sie die richtige Transportergrösse für Ihren Umzug",
                  link: "/rechner/transporter-groesse"
                }
              ].map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Calculator className="h-8 w-8 text-primary mb-3" />
                      <CardTitle>{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                      <Button asChild variant="outline" className="w-full">
                        <Link to={tool.link}>Tool öffnen</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Erfahrungen unserer Nutzer
              </h2>
              <p className="text-xl text-muted-foreground">
                Tausende zufriedene Kunden vertrauen auf umzugscheck.ch
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{testimonial.city}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm italic">"{testimonial.text}"</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8 space-y-4">
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Schweizer Plattform</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>5'000+ Offerten pro Jahr</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Text Block */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <h2 className="text-3xl font-bold mb-6">
                Warum Umzugsfirmen in der Schweiz vergleichen?
              </h2>
              
              <p className="text-muted-foreground mb-4">
                Ein Umzug in der Schweiz kann eine kostspielige Angelegenheit sein. Die Preise variieren stark zwischen verschiedenen 
                Umzugsfirmen und Regionen. Genau hier setzt <strong>umzugscheck.ch</strong> an: Wir ermöglichen es Ihnen, mehrere 
                <strong>Umzugsofferten</strong> kostenlos und unverbindlich zu vergleichen und so die beste Umzugsfirma für Ihre 
                Bedürfnisse zu finden.
              </p>

              <p className="text-muted-foreground mb-4">
                Durch den direkten Vergleich verschiedener Anbieter sparen Sie nicht nur Geld, sondern auch Zeit und Nerven. Statt 
                mühsam einzelne <strong>Umzugsfirmen</strong> zu kontaktieren, erhalten Sie mit einer einzigen Anfrage mehrere 
                Angebote – und das völlig kostenlos. So können Sie in Ruhe Preise, Leistungen und Kundenbewertungen vergleichen 
                und eine fundierte Entscheidung treffen.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Regionale Unterschiede bei Umzugskosten</h3>
              <p className="text-muted-foreground mb-4">
                Die <strong>Umzugskosten in der Schweiz</strong> unterscheiden sich je nach Region erheblich. In Grossstädten wie 
                Zürich, Basel oder Genf sind die Preise tendenziell höher als in ländlichen Gebieten. Dies liegt an höheren 
                Betriebskosten, schwierigeren Parksituationen und der grösseren Nachfrage. Eine <strong>Umzugsfirma in Zürich</strong> 
                berechnet oft 20-30% mehr als ein Anbieter in einem kleineren Ort im Emmental oder Appenzellerland.
              </p>

              <p className="text-muted-foreground mb-4">
                Auch innerhalb eines Kantons können die Preise variieren. Ein Umzug innerhalb der Stadt ist oft günstiger als ein 
                Umzug vom Land in die Stadt oder umgekehrt, da längere Anfahrtswege zusätzliche Kosten verursachen. Durch den 
                Vergleich mehrerer Anbieter auf <strong>umzugscheck.ch</strong> können Sie jedoch auch in teuren Regionen deutlich 
                sparen – oft bis zu 40%.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">So funktioniert umzugscheck.ch</h3>
              <p className="text-muted-foreground mb-4">
                Unser Service ist denkbar einfach: Sie beschreiben Ihren Umzug in unserem Online-Formular – Wohnungsgrösse, Start- und 
                Zieladresse, gewünschte Zusatzleistungen wie Montage, Reinigung oder Entsorgung. Basierend auf Ihren Angaben leiten 
                wir Ihre Anfrage an passende, geprüfte <strong>Umzugsfirmen in der Schweiz</strong> weiter.
              </p>

              <p className="text-muted-foreground mb-4">
                Innerhalb von 24 Stunden erhalten Sie mehrere individuelle <strong>Umzugsofferten</strong> per E-Mail. Diese können 
                Sie in Ruhe vergleichen – nicht nur nach Preis, sondern auch nach Leistungsumfang, Verfügbarkeit und Kundenbewertungen. 
                So finden Sie garantiert die Umzugsfirma, die am besten zu Ihren Anforderungen und Ihrem Budget passt.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Vorteile des Offerten-Vergleichs</h3>
              <p className="text-muted-foreground mb-4">
                Wenn Sie <strong>Umzugsofferten vergleichen</strong>, profitieren Sie mehrfach: Sie erhalten Transparenz über die 
                Marktpreise, können Leistungen und Konditionen direkt gegenüberstellen und vermeiden überhöhte Preise. Zudem sparen 
                Sie Zeit, da Sie nicht selbst mehrere Firmen einzeln kontaktieren müssen. Alle Offerten kommen bequem zu Ihnen – 
                kostenlos und unverbindlich.
              </p>

              <p className="text-muted-foreground mb-4">
                Ein weiterer Vorteil: Durch den Wettbewerb der Anbieter erhalten Sie oft bessere Konditionen als bei einer direkten 
                Anfrage. Die <strong>Umzugsfirmen</strong> wissen, dass Sie Angebote vergleichen, und kalkulieren deshalb schärfer. 
                Das bedeutet für Sie: bessere Preise bei gleicher Qualität.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Geprüfte Umzugsfirmen</h3>
              <p className="text-muted-foreground mb-4">
                Alle <strong>Umzugsfirmen auf umzugscheck.ch</strong> werden von uns sorgfältig geprüft. Wir arbeiten nur mit 
                seriösen, erfahrenen Anbietern zusammen, die über die notwendigen Versicherungen und Qualifikationen verfügen. 
                Kundenbewertungen und Transparenz stehen dabei im Mittelpunkt. So können Sie sicher sein, dass Sie qualitativ 
                hochwertige Angebote erhalten.
              </p>

              <p className="text-muted-foreground mb-4">
                Unsere Partner müssen strenge Qualitätskriterien erfüllen: Nachweis von Betriebshaftpflicht und Transportversicherung, 
                nachweisliche Erfahrung im Umzugsgeschäft, positive Kundenbewertungen und faire Geschäftspraktiken. Nur Firmen, die 
                diese Standards erfüllen, werden auf unserer Plattform gelistet.
              </p>

              <h3 className="text-2xl font-semibold mt-8 mb-4">Kostenlos und stressfrei umziehen</h3>
              <p className="text-muted-foreground">
                Ein Umzug muss nicht stressig und teuer sein. Mit <strong>umzugscheck.ch</strong> finden Sie die passende 
                <strong>Umzugsfirma in der Schweiz</strong>, vergleichen Preise transparent und sparen bares Geld. Ob Privatumzug, 
                Firmenumzug oder internationaler Umzug – starten Sie jetzt Ihren kostenlosen Vergleich und profitieren Sie von unserem 
                schweizweiten Netzwerk geprüfter Umzugspartner. Fordern Sie noch heute Ihre ersten <strong>Umzugsofferten</strong> an 
                und erleben Sie, wie einfach ein professioneller Umzug sein kann.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bereit für Ihren stressfreien Umzug?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Fordern Sie jetzt kostenlos mehrere Umzugsofferten an und vergleichen Sie die besten Anbieter
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/offerte">
                  Jetzt Offerte anfordern
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/umzugsfirmen">
                  Umzugsfirmen durchsuchen
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
