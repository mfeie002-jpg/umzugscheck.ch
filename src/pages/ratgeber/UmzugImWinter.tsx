import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEOHead } from "@/components/SEOHead";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Calendar, Snowflake, CheckCircle2, XCircle, ThermometerSnowflake, ArrowRight, TrendingDown, Clock } from "lucide-react";

const UmzugImWinter = () => {
  return (
    <>
      <SEOHead
        title="Umzug im Winter: Vor- und Nachteile | Umzugscheck.ch"
        description="Lohnt sich ein Winterumzug? Erfahren Sie alle Vor- und Nachteile sowie praktische Tipps für Umzüge in den kalten Monaten."
        keywords="Umzug im Winter, Winterumzug Schweiz, Umzug Dezember, Umzug Januar, günstig umziehen Winter"
      />
      <Navigation />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumbs
            items={[
              { label: "Startseite", href: "/" },
              { label: "Ratgeber", href: "/ratgeber" },
              { label: "Umzug im Winter", href: "/ratgeber/umzug-im-winter" }
            ]}
          />

          <ScrollReveal>
            <article className="mt-8">
              {/* Hero Section */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-primary">Saisonal</Badge>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    20. Februar 2025
                  </span>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    5 Min Lesezeit
                  </span>
                </div>

                <h1 className="mb-4">Umzug im Winter: Vor- und Nachteile</h1>
                <p className="text-xl text-muted-foreground">
                  Ein Winterumzug hat sowohl Vorteile als auch Herausforderungen. Erfahren Sie, worauf Sie achten sollten und wie Sie mit den richtigen Strategien auch in der kalten Jahreszeit erfolgreich umziehen können.
                </p>
              </div>

              <div className="aspect-video rounded-xl overflow-hidden mb-8">
                <img
                  src="https://images.unsplash.com/photo-1483691278019-cb7253bee49f?w=1200&h=600&fit=crop"
                  alt="Umzug im Winter mit Schnee"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Vorteile */}
              <ScrollReveal delay={0.1}>
                <div className="mb-8">
                  <h2 className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                    Vorteile eines Winterumzugs
                  </h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold mb-2 flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-primary" />
                            Günstigere Preise
                          </h3>
                          <p className="text-muted-foreground">
                            In den Wintermonaten (Dezember bis Februar) sind Umzugsfirmen weniger ausgelastet. Das bedeutet:
                          </p>
                          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                            <li>Bis zu 30% niedrigere Preise als in der Hochsaison</li>
                            <li>Bessere Verhandlungsmöglichkeiten</li>
                            <li>Spezielle Winterrabatte vieler Anbieter</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Höhere Verfügbarkeit
                          </h3>
                          <p className="text-muted-foreground">
                            Flexiblere Terminwahl durch geringere Nachfrage:
                          </p>
                          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                            <li>Wunschtermin oft kurzfristig verfügbar</li>
                            <li>Mehr Zeit für die Beratung</li>
                            <li>Weniger Hektik bei den Umzugsfirmen</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-bold mb-2">Weniger Konkurrenzdruck</h3>
                          <p className="text-muted-foreground">
                            Weniger Umzüge bedeuten auch:
                          </p>
                          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                            <li>Einfacherer Zugang zu Mietwagen</li>
                            <li>Weniger Konkurrenz um Parkplätze</li>
                            <li>Kürzere Lieferzeiten bei Möbelbestellungen</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              {/* Nachteile */}
              <ScrollReveal delay={0.2}>
                <div className="mb-8">
                  <h2 className="flex items-center gap-2 mb-4">
                    <XCircle className="w-6 h-6 text-destructive" />
                    Herausforderungen beim Winterumzug
                  </h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Snowflake className="w-5 h-5 text-primary" />
                            Wetterbedingungen
                          </h3>
                          <p className="text-muted-foreground mb-2">
                            Schnee, Eis und Kälte können den Umzug erschweren:
                          </p>
                          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                            <li>Rutschgefahr auf vereisten Wegen</li>
                            <li>Schneeräumung notwendig</li>
                            <li>Längere Transportzeiten bei Schneefall</li>
                            <li>Möbel vor Nässe schützen</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-bold mb-2 flex items-center gap-2">
                            <ThermometerSnowflake className="w-5 h-5 text-primary" />
                            Kürzere Tage
                          </h3>
                          <p className="text-muted-foreground">
                            Weniger Tageslicht bedeutet:
                          </p>
                          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                            <li>Früher Sonnenuntergang (ca. 17 Uhr)</li>
                            <li>Schlechtere Sichtverhältnisse</li>
                            <li>Mehr künstliche Beleuchtung nötig</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-bold mb-2">Kälteempfindliche Gegenstände</h3>
                          <p className="text-muted-foreground">
                            Einige Gegenstände reagieren empfindlich auf Kälte:
                          </p>
                          <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                            <li>Elektronik (Kondensation vermeiden)</li>
                            <li>Pflanzen (Frostschutz erforderlich)</li>
                            <li>Flüssigkeiten (Gefriergefahr)</li>
                            <li>Kunstwerke (Temperaturschäden)</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              {/* Tipps */}
              <ScrollReveal delay={0.3}>
                <div className="mb-8">
                  <h2 className="mb-4">7 Tipps für einen erfolgreichen Winterumzug</h2>
                  <div className="grid gap-4">
                    {[
                      {
                        title: "1. Wettervorhersage im Auge behalten",
                        content: "Planen Sie einen Ausweichtermin ein und verfolgen Sie die Wetterprognosen 7 Tage im Voraus."
                      },
                      {
                        title: "2. Wege freiräumen",
                        content: "Sorgen Sie rechtzeitig für geräumte und gestreute Wege zwischen Wohnung und Transporter."
                      },
                      {
                        title: "3. Schutz vor Nässe und Kälte",
                        content: "Nutzen Sie wasserdichte Planen und Decken. Empfindliche Gegenstände extra verpacken."
                      },
                      {
                        title: "4. Früher starten",
                        content: "Beginnen Sie früh am Morgen, um das Tageslicht optimal zu nutzen."
                      },
                      {
                        title: "5. Heizung in beiden Wohnungen",
                        content: "Halten Sie beide Wohnungen warm. Das erleichtert den Umzug und verhindert Schäden."
                      },
                      {
                        title: "6. Warme Getränke bereithalten",
                        content: "Sorgen Sie für ausreichend Thermoskannen mit heissen Getränken für alle Helfer."
                      },
                      {
                        title: "7. Versicherung prüfen",
                        content: "Klären Sie ab, ob Ihre Umzugsversicherung auch Wetterschäden abdeckt."
                      }
                    ].map((tip, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h3 className="font-bold mb-2">{tip.title}</h3>
                          <p className="text-muted-foreground">{tip.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Fazit */}
              <ScrollReveal delay={0.4}>
                <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 mb-8">
                  <CardContent className="p-6">
                    <h2 className="mb-4">Fazit: Lohnt sich ein Winterumzug?</h2>
                    <p className="text-muted-foreground mb-4">
                      Ein Winterumzug kann sich durchaus lohnen, besonders wenn Sie von den niedrigeren Preisen und der höheren Verfügbarkeit profitieren möchten. Mit guter Vorbereitung und den richtigen Vorkehrungen lassen sich die Herausforderungen der kalten Jahreszeit gut meistern.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Empfehlung:</strong> Ideal für flexible Personen, die Kosten sparen möchten. Weniger geeignet für Personen mit vielen kälteempfindlichen Gegenständen oder gesundheitlichen Einschränkungen.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal delay={0.5}>
                <Card>
                  <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Jetzt Winterumzug planen</h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                      Nutzen Sie unseren kostenlosen Rechner für eine erste Kostenschätzung und profitieren Sie von Winterrabatten
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/rechner">
                        <Button size="lg" className="w-full sm:w-auto">
                          Kostenlos Preis berechnen
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                      <Link to="/firmen">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                          Umzugsfirmen vergleichen
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </article>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default UmzugImWinter;
