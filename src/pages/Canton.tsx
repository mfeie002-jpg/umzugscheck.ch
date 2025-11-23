import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Star, MapPin, ArrowRight, Calculator, CheckCircle2, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FAQAccordion } from "@/components/FAQAccordion";
import { LoadingSkeletonCompany } from "@/components/LoadingSkeletonCompany";

const CANTON_INFO: Record<string, {
  name: string;
  description: string;
  cities: string[];
  priceRange: { studio: string; twoRooms: string; threeRooms: string; house: string };
}> = {
  zuerich: {
    name: "Zürich",
    description: "Als grösster Kanton und Wirtschaftszentrum der Schweiz bietet Zürich eine breite Auswahl an Umzugsfirmen. Die Preise variieren je nach Stadtlage und Erreichbarkeit.",
    cities: ["Zürich", "Winterthur", "Uster", "Dietikon", "Wetzikon"],
    priceRange: {
      studio: "CHF 800-1'200",
      twoRooms: "CHF 1'200-1'800",
      threeRooms: "CHF 1'800-2'800",
      house: "CHF 3'500-6'000",
    },
  },
  bern: {
    name: "Bern",
    description: "Die Bundesstadt und ihr Umland bieten solide Umzugsdienstleistungen mit fairen Preisen. Viele Familienbetriebe mit langjähriger Erfahrung.",
    cities: ["Bern", "Köniz", "Ostermundigen", "Burgdorf", "Steffisburg"],
    priceRange: {
      studio: "CHF 700-1'000",
      twoRooms: "CHF 1'000-1'500",
      threeRooms: "CHF 1'500-2'400",
      house: "CHF 3'000-5'500",
    },
  },
  basel: {
    name: "Basel",
    description: "Basel-Stadt bietet qualitativ hochwertige Umzugsservices mit internationalem Standard. Perfekt für grenzüberschreitende Umzüge.",
    cities: ["Basel", "Riehen", "Bettingen"],
    priceRange: {
      studio: "CHF 750-1'100",
      twoRooms: "CHF 1'100-1'700",
      threeRooms: "CHF 1'700-2'600",
      house: "CHF 3'200-5'800",
    },
  },
};

const Canton = () => {
  const { canton } = useParams<{ canton: string }>();
  const cantonKey = canton?.toLowerCase() || "";
  const info = CANTON_INFO[cantonKey];
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (info) {
      fetchCompanies();
    }
  }, [info]);

  const fetchCompanies = async () => {
    if (!info) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .contains("service_areas", [info.name])
        .order("rating", { ascending: false })
        .limit(6);

      if (!error && data) {
        setCompanies(data);
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!info) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Kanton nicht gefunden</h2>
            <p className="text-muted-foreground mb-6">Diese Seite ist noch nicht verfügbar.</p>
            <Link to="/">
              <Button>Zurück zur Startseite</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs
            items={[
              { label: "Kantone", href: "/" },
              { label: `Kanton ${info.name}` },
            ]}
          />
        </div>

        {/* Hero */}
        <section className="py-16 md:py-24 gradient-hero text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
                <MapPin className="w-3 h-3 mr-1" />
                Kanton {info.name}
              </Badge>
              <h1 className="mb-6">Umzug im Kanton {info.name}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">{info.description}</p>
              <Link to="/rechner">
                <Button size="lg" className="bg-accent hover:bg-accent/90 shadow-accent group">
                  Jetzt Offerten vergleichen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Price Guide */}
        <section className="py-12 md:py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Typische Umzugskosten in {info.name}</h2>
                <p className="text-muted-foreground">
                  Durchschnittliche Preise für lokale Umzüge (ca. 20-30 km)
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingDown className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Studio / 1 Zimmer</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{info.priceRange.studio}</div>
                    <p className="text-sm text-muted-foreground">≈ 20 m³</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingDown className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">2 Zimmer</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{info.priceRange.twoRooms}</div>
                    <p className="text-sm text-muted-foreground">≈ 35 m³</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingDown className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">3-4 Zimmer</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{info.priceRange.threeRooms}</div>
                    <p className="text-sm text-muted-foreground">≈ 50-65 m³</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingDown className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Haus / 5+ Zimmer</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{info.priceRange.house}</div>
                    <p className="text-sm text-muted-foreground">≈ 80-120 m³</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  *Preise sind Richtwerte und können je nach Umzugsdetails variieren.
                </p>
                <Link to="/rechner">
                  <Button variant="outline" size="lg">
                    Genaue Berechnung starten
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Teaser */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="shadow-strong bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                        <Calculator className="w-4 h-4" />
                        <span>Kostenloses Tool</span>
                      </div>
                      <h2 className="text-3xl font-bold mb-4">Umzugskosten in {info.name} berechnen</h2>
                      <p className="text-muted-foreground mb-6">
                        Erhalten Sie in nur 60 Sekunden eine präzise Kostenschätzung für Ihren Umzug in {info.name}. 
                        Vergleichen Sie anschliessend bis zu 5 Offerten von geprüften Umzugsfirmen.
                      </p>
                      <Link to="/rechner">
                        <Button size="lg" className="w-full md:w-auto">
                          Jetzt kostenlos berechnen
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-medium">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        Was Sie erhalten:
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Sofortige Kostenschätzung basierend auf Ihren Angaben</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Detaillierte Aufschlüsselung aller Kostenpunkte</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Bis zu 5 kostenlose Offerten von lokalen Firmen</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">100% unverbindlich und kostenlos</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Companies */}
        <section className="py-12 md:py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Empfohlene Umzugsfirmen in {info.name}</h2>
                <p className="text-lg text-muted-foreground">
                  Geprüfte und bewertete Umzugsfirmen für Ihren Umzug in {info.name}
                </p>
              </div>
              
              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <LoadingSkeletonCompany key={index} />
                  ))}
                </div>
              ) : companies.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {companies.map((company) => (
                      <Card key={company.id} className="hover-lift border-2 hover:border-primary/20 transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-light to-primary/5 flex items-center justify-center text-3xl shadow-soft flex-shrink-0">
                              {company.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-bold text-lg">{company.name}</h3>
                                {company.verified && (
                                  <Badge className="bg-success text-white border-0 flex-shrink-0">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Geprüft
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(company.rating)
                                          ? "fill-accent text-accent"
                                          : "fill-muted text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="font-bold">{company.rating}</span>
                                <span className="text-sm text-muted-foreground">
                                  ({company.review_count})
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {company.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-4 text-sm">
                            {company.phone && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {company.email && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {company.price_level && (
                              <Badge variant="secondary" className="ml-auto">
                                {company.price_level}
                              </Badge>
                            )}
                          </div>
                          
                          <Link to={`/firmen/${company.id}`}>
                            <Button className="w-full bg-primary hover:bg-primary-dark">
                              Profil ansehen
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-center">
                    <Link to={`/firmen?canton=${info.name}`}>
                      <Button size="lg" variant="outline">
                        Alle {companies.length}+ Firmen in {info.name} anzeigen
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Aktuell sind keine Firmen für {info.name} verfügbar.
                    </p>
                    <Link to="/firmen">
                      <Button variant="outline">Alle Firmen durchsuchen</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Häufige Fragen zu Umzügen in {info.name}</h2>
              <FAQAccordion 
                items={[
                  {
                    question: `Wie viel kostet ein Umzug im Kanton ${info.name}?`,
                    answer: `Die Kosten für einen Umzug im Kanton ${info.name} variieren je nach Wohnungsgrösse, Distanz und zusätzlichen Services. Ein 3-Zimmer-Umzug kostet durchschnittlich ${info.priceRange.threeRooms}. Nutzen Sie unseren kostenlosen Umzugsrechner für eine genaue Schätzung.`
                  },
                  {
                    question: "Wie lange dauert ein Umzug?",
                    answer: "Ein Standardumzug (3 Zimmer, 30 km) dauert mit einem professionellen Team etwa 6-8 Stunden inklusive Be- und Entladen. Die Dauer hängt von der Menge des Umzugsguts, der Entfernung und den örtlichen Gegebenheiten (Stockwerk, Lift, Parkplatz) ab."
                  },
                  {
                    question: "Sind die Umzugsfirmen versichert?",
                    answer: "Alle auf Umzugscheck.ch gelisteten Firmen sind versichert und zertifiziert. Die genauen Versicherungsdetails und -deckungen finden Sie im jeweiligen Firmenprofil. Wir empfehlen, dies vor der Buchung zu überprüfen."
                  },
                  {
                    question: "Wie weit im Voraus sollte ich einen Umzug planen?",
                    answer: "Wir empfehlen, Ihren Umzug mindestens 4-6 Wochen im Voraus zu planen. Während der Hochsaison (Mai-September) kann eine frühere Buchung sinnvoll sein. Mit unserem Service können Sie schnell mehrere Offerten einholen und vergleichen."
                  },
                  {
                    question: `Was sollte ich bei einem Umzug in ${info.name} beachten?`,
                    answer: `Bei einem Umzug in ${info.name} sollten Sie frühzeitig eine Parkbewilligung für das Umzugsfahrzeug beantragen, die Zugänglichkeit Ihrer Wohnung prüfen (Lift, Treppen) und klären, ob zusätzliche Services wie Endreinigung oder Entsorgung benötigt werden.`
                  }
                ]}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Canton;
