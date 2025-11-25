import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEOHead } from "@/components/SEOHead";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Calendar, Heart, Users, Home, ArrowRight, Clock, Baby, School } from "lucide-react";

const UmzugMitKindern = () => {
  return (
    <>
      <SEOHead
        title="Umzug mit Kindern: Tipps für Familien | Umzugscheck.ch"
        description="So machen Sie den Umzug für Ihre Kinder stressfrei. Praktische Tipps für Familien, um Kindern den Wohnungswechsel zu erleichtern."
        keywords="Umzug mit Kindern, Familienumzug Schweiz, Umzug Familie, Kinder Umzug vorbereiten"
      />
      <Navigation />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumbs
            items={[
              { label: "Startseite", href: "/" },
              { label: "Ratgeber", href: "/ratgeber" },
              { label: "Umzug mit Kindern", href: "/ratgeber/umzug-mit-kindern" }
            ]}
          />

          <ScrollReveal>
            <article className="mt-8">
              {/* Hero */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-primary">Familie</Badge>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    25. Februar 2025
                  </span>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    6 Min Lesezeit
                  </span>
                </div>

                <h1 className="mb-4">Umzug mit Kindern: Tipps für Familien</h1>
                <p className="text-xl text-muted-foreground">
                  Ein Umzug bedeutet für Kinder eine grosse Veränderung. Mit der richtigen Vorbereitung und viel Einfühlungsvermögen wird der Wohnungswechsel für die ganze Familie zu einem positiven Erlebnis.
                </p>
              </div>

              <div className="aspect-video rounded-xl overflow-hidden mb-8">
                <img
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&h=600&fit=crop"
                  alt="Familie beim Umzug"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Vorbereitung nach Alter */}
              <ScrollReveal delay={0.1}>
                <div className="mb-8">
                  <h2 className="mb-4">Umzug nach Kindesalter vorbereiten</h2>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <Baby className="w-5 h-5 text-primary" />
                          Kleinkinder (0-3 Jahre)
                        </h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Tagesablauf möglichst beibehalten (Schlaf-, Essenszeiten)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Lieblingsspielzeug griffbereit halten</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Kinderzimmer zuerst einrichten</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Bekannte Umgebung (Decken, Kuscheltiere) mitnehmen</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <School className="w-5 h-5 text-primary" />
                          Kindergarten- & Schulkinder (4-12 Jahre)
                        </h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Frühzeitig und ehrlich über den Umzug sprechen</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Neue Schule/Kindergarten gemeinsam besichtigen</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Kinder bei Entscheidungen einbeziehen (Zimmergestaltung)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Abschiedsrituale mit Freunden ermöglichen</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Teenager (13+ Jahre)
                        </h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Gefühle und Ängste ernst nehmen</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Kontakt zu alten Freunden ermöglichen (Social Media, Besuche)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Bei Zimmergestaltung freie Hand lassen</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Neue Freizeitmöglichkeiten in der Umgebung vorstellen</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ScrollReveal>

              {/* Praktische Tipps */}
              <ScrollReveal delay={0.2}>
                <div className="mb-8">
                  <h2 className="mb-4">10 praktische Tipps für den Umzugstag</h2>
                  <div className="grid gap-4">
                    {[
                      {
                        title: "Kinderbetreuung organisieren",
                        content: "Am Umzugstag die Kinder wenn möglich bei Grosseltern oder Freunden unterbringen."
                      },
                      {
                        title: "Umzugskiste für jedes Kind",
                        content: "Packen Sie eine Kiste mit Lieblingssachen, Snacks und Beschäftigung für die ersten Tage."
                      },
                      {
                        title: "Neues Zuhause vorab zeigen",
                        content: "Besuchen Sie die neue Wohnung mehrmals vorher, machen Sie Fotos."
                      },
                      {
                        title: "Abschied bewusst gestalten",
                        content: "Verabschiedungsparty organisieren, Fotos vom alten Zuhause machen."
                      },
                      {
                        title: "Kinderzimmer zuerst",
                        content: "Richten Sie das Kinderzimmer als Erstes ein – vertraute Umgebung beruhigt."
                      },
                      {
                        title: "Umgebung erkunden",
                        content: "Spielplätze, Parks und interessante Orte in der Nähe gemeinsam entdecken."
                      },
                      {
                        title: "Schulweg üben",
                        content: "Mehrmals den neuen Schulweg ablaufen, sichere Route festlegen."
                      },
                      {
                        title: "Rituale beibehalten",
                        content: "Gute-Nacht-Geschichten und gewohnte Abläufe weiterführen."
                      },
                      {
                        title: "Geduld haben",
                        content: "Eingewöhnung braucht Zeit. Seien Sie verständnisvoll bei Heimweh."
                      },
                      {
                        title: "Positive Aspekte betonen",
                        content: "Neues Zimmer, neue Spielkameraden, spannende Umgebung hervorheben."
                      }
                    ].map((tip, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h3 className="font-bold mb-2">{index + 1}. {tip.title}</h3>
                          <p className="text-muted-foreground">{tip.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Warnsignale */}
              <ScrollReveal delay={0.3}>
                <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 mb-8">
                  <CardContent className="p-6">
                    <h2 className="mb-4 flex items-center gap-2">
                      <Heart className="w-6 h-6 text-amber-600" />
                      Warnsignale beachten
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Beobachten Sie Ihr Kind in den ersten Wochen nach dem Umzug. Diese Anzeichen können auf Anpassungsschwierigkeiten hindeuten:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">⚠</span>
                        <span>Anhaltende Schlafstörungen oder Albträume</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">⚠</span>
                        <span>Rückzug, keine Freude an Aktivitäten</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">⚠</span>
                        <span>Schulprobleme oder starke Leistungsabfälle</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">⚠</span>
                        <span>Körperliche Beschwerden (Bauchweh, Kopfschmerzen)</span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Bei anhaltenden Problemen zögern Sie nicht, professionelle Hilfe (Kinderpsychologe, Schulberatung) in Anspruch zu nehmen.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal delay={0.4}>
                <Card>
                  <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Familienfreundliche Umzugsfirmen finden</h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                      Viele Umzugsfirmen bieten spezielle Services für Familien mit Kindern. Vergleichen Sie jetzt kostenlos!
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

export default UmzugMitKindern;
