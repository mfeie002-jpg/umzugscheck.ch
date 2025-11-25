import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEOHead } from "@/components/SEOHead";
import { BookOpen, Download, FileText, CheckCircle2, TrendingUp, Users, Calculator, Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";

const Ratgeber = () => {
  const categories = [
    {
      title: "Umzugstipps",
      icon: TrendingUp,
      description: "Praktische Tipps für einen stressfreien Umzug",
      articles: [
        { title: "10 Tipps für einen stressfreien Umzug", slug: "stressfreier-umzug" },
        { title: "Umzug richtig planen: Der ultimative Guide", slug: "umzug-planen" },
        { title: "Die häufigsten Umzugsfehler und wie Sie diese vermeiden", slug: "umzugsfehler-vermeiden" },
        { title: "Selber zügeln oder Profis beauftragen?", slug: "selber-zuegeln-oder-profis" },
      ]
    },
    {
      title: "Checklisten",
      icon: CheckCircle2,
      description: "Schritt-für-Schritt-Anleitungen für Ihren Umzug",
      articles: [
        { title: "Umzugscheckliste: 4 Wochen bis zum Umzug", slug: "umzugscheckliste-4-wochen" },
        { title: "Was muss ich vor dem Umzug erledigen?", slug: "vor-dem-umzug" },
        { title: "Umzugscheckliste als PDF herunterladen", slug: "umzugscheckliste-pdf" },
        { title: "Nach dem Umzug: Diese Aufgaben nicht vergessen", slug: "nach-dem-umzug" },
      ]
    },
    {
      title: "Kosten & Planung",
      icon: Calculator,
      description: "Alles über Umzugskosten und Budget",
      articles: [
        { title: "Was kostet ein Umzug in der Schweiz?", slug: "was-kostet-ein-umzug" },
        { title: "Umzugskosten steuerlich absetzen", slug: "umzugskosten-steuerlich-absetzen" },
        { title: "Wie kann ich beim Umzug Geld sparen?", slug: "umzug-geld-sparen" },
        { title: "Umzugsbudget richtig planen", slug: "umzugsbudget-planen" },
      ]
    },
    {
      title: "Spezielle Umzüge",
      icon: Home,
      description: "Ratgeber für besondere Umzugssituationen",
      articles: [
        { title: "Umzug mit Kindern: Tipps für Familien", slug: "umzug-mit-kindern" },
        { title: "Umzug mit Haustieren", slug: "umzug-mit-haustieren" },
        { title: "Seniorenumzug: Was ist zu beachten?", slug: "seniorenumzug" },
        { title: "Firmenumzug planen und durchführen", slug: "firmenumzug" },
      ]
    }
  ];

  const breadcrumbItems = [{ label: "Ratgeber" }];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Umzugs-Ratgeber: Tipps, Checklisten & Kosteninfos | Umzugscheck.ch"
        description="Ihr kostenloser Ratgeber rund um den Umzug: Praktische Tipps, Checklisten zum Download, Kostenrechner und Expertenrat für einen stressfreien Umzug in der Schweiz."
        keywords="Umzugsratgeber, Umzugstipps Schweiz, Umzugscheckliste, Umzugskosten berechnen, Umzug planen"
        canonical="https://umzugscheck.ch/ratgeber"
      />

      <Navigation />
      
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={breadcrumbItems} showHome />
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-secondary/30 to-background border-b border-border py-16 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <Badge variant="secondary" className="mb-4">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Kostenloser Expertenrat
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  Ratgeber rund um den Umzug
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Praktische Tipps, hilfreiche Checklisten und Kosteninfos für Ihren perfekten Umzug
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/rechner/umzugskosten">
                    <Button size="lg" className="shadow-accent">
                      <Calculator className="mr-2 w-5 h-5" />
                      Umzugskosten berechnen
                    </Button>
                  </Link>
                  <Link to="#checkliste">
                    <Button size="lg" variant="outline">
                      <Download className="mr-2 w-5 h-5" />
                      Checkliste herunterladen
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 sm:py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    Themenbereiche
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                    Finden Sie hilfreiche Artikel und Anleitungen zu allen Aspekten Ihres Umzugs
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                {categories.map((category, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <Card className="h-full hover:shadow-strong transition-all hover:border-primary/40">
                      <CardHeader className="pb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                          <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl sm:text-2xl">{category.title}</CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {category.articles.map((article, articleIndex) => (
                            <li key={articleIndex}>
                              <Link
                                to={`/ratgeber/${article.slug}`}
                                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
                              >
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium">{article.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Download Teaser */}
        <section id="checkliste" className="py-16 md:py-24 bg-gradient-to-b from-secondary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal>
                <Card className="overflow-hidden border-primary/20 shadow-strong">
                  <div className="grid md:grid-cols-2">
                    <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-12 flex flex-col justify-center">
                      <FileText className="w-12 h-12 mb-4" />
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        Umzugscheckliste als PDF
                      </h3>
                      <p className="text-primary-foreground/90 mb-6">
                        Laden Sie unsere umfassende Umzugscheckliste herunter und vergessen Sie nichts mehr!
                      </p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>4 Wochen Zeitplan</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Alle wichtigen Aufgaben</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Zum Ausdrucken & Abhaken</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-8 md:p-12 flex flex-col justify-center bg-background">
                      <h4 className="text-xl font-bold text-foreground mb-4">
                        Kostenlos herunterladen
                      </h4>
                      <p className="text-muted-foreground mb-6">
                        Geben Sie Ihre E-Mail-Adresse ein und erhalten Sie die Checkliste sofort als PDF.
                      </p>
                      <div className="space-y-4">
                        <input
                          type="email"
                          placeholder="ihre@email.ch"
                          className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Link to="/ratgeber/umzugscheckliste-pdf">
                          <Button className="w-full shadow-accent" size="lg">
                            <Download className="mr-2 w-5 h-5" />
                            Jetzt herunterladen
                          </Button>
                        </Link>
                        <p className="text-xs text-muted-foreground text-center">
                          100% kostenlos, keine Verpflichtung, jederzeit abmeldbar
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <Badge variant="secondary" className="mb-4">
                    <Users className="w-3 h-3 mr-1" />
                    Beliebteste Artikel
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Meist gelesen
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Diese Ratgeber helfen den meisten Umziehenden
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Was kostet ein Umzug?",
                    description: "Detaillierte Kostenübersicht für alle Umzugsarten",
                    slug: "was-kostet-ein-umzug",
                    badge: "Kosten"
                  },
                  {
                    title: "Umzugscheckliste PDF",
                    description: "Komplette Checkliste zum Ausdrucken",
                    slug: "umzugscheckliste-pdf",
                    badge: "Download"
                  },
                  {
                    title: "Selber zügeln oder Profis?",
                    description: "Vor- und Nachteile beider Varianten im Vergleich",
                    slug: "selber-zuegeln-oder-profis",
                    badge: "Entscheidung"
                  }
                ].map((article, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <Link to={`/ratgeber/${article.slug}`}>
                      <Card className="h-full hover:shadow-strong transition-all hover:border-primary/40 group">
                        <CardHeader>
                          <Badge variant="secondary" className="w-fit mb-2">
                            {article.badge}
                          </Badge>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {article.title}
                          </CardTitle>
                          <CardDescription>
                            {article.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="ghost" size="sm" className="gap-2 group-hover:gap-3 transition-all">
                            Artikel lesen
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-24 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <ScrollReveal>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                  Bereit für Ihren Umzug?
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">
                  Berechnen Sie jetzt Ihre Umzugskosten oder holen Sie sich kostenlose Offerten ein.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
                  <Link to="/rechner">
                    <Button size="lg" className="w-full sm:w-auto shadow-accent">
                      <Calculator className="mr-2 w-5 h-5" />
                      Kosten berechnen
                    </Button>
                  </Link>
                  <Link to="/offerte">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Offerte anfordern
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Ratgeber;
