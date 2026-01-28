import { Link } from "react-router-dom";
import { ArrowRight, Crown, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PlanFull = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 text-alpine mb-4">
              <Crown className="h-6 w-6" />
              <span className="text-lg font-medium">Voll-Paket</span>
            </div>
            <h1 className="text-balance">Voll-Paket – Rundum-Sorglos</h1>
            <p className="text-xl text-muted-foreground">
              Maximaler Komfort: Wir übernehmen alles vom Packen bis zum Auspacken. 
              Sie lehnen sich zurück und geniessen Ihr neues Zuhause.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                  Jetzt anfragen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 mb-12 bg-gradient-hero text-primary-foreground">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 mr-3" />
                <h2 className="text-2xl font-semibold">Maximaler Komfort</h2>
              </div>
              <p className="text-center text-lg opacity-90">
                Unser Premium-Service für alle, die einen stressfreien Umzug ohne eigenen 
                Aufwand wünschen. Perfekt für Berufstätige, Familien und Senioren.
              </p>
            </Card>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Ihr Rundum-Sorglos-Paket</h2>
              <div className="grid gap-6">
                <Card className="p-6 border-2 border-alpine">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-alpine/20 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-alpine" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Verpackungsservice</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Komplettes Einpacken aller Gegenstände</li>
                        <li>• Hochwertiges Verpackungsmaterial inklusive</li>
                        <li>• Spezialverpackung für Kunstwerke und Fragiles</li>
                        <li>• Systematische Beschriftung und Inventarliste</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 border-alpine">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-alpine/20 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-alpine" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Transport-Service</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Professionelle Möbeldemontage</li>
                        <li>• Sicherer Transport mit Vollversicherung</li>
                        <li>• Moderne Fahrzeuge und Equipment</li>
                        <li>• Erfahrenes Umzugsteam</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 border-alpine bg-alpine/5">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-alpine/20 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-alpine" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Auspack- & Einrichtungsservice</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• <strong>Komplettes Auspacken</strong> aller Kartons</li>
                        <li>• <strong>Einräumen</strong> in Schränke und Regale</li>
                        <li>• Möbelmontage und Positionierung</li>
                        <li>• Entsorgung aller Verpackungsmaterialien</li>
                        <li>• Basisreinigung der alten Wohnung (optional)</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-6">So läuft Ihr Rundum-Sorglos-Umzug</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Besichtigung & Planung</h3>
                    <p className="text-muted-foreground">
                      Detaillierte Besichtigung vor Ort. Wir planen jeden Schritt und 
                      erstellen eine massgeschneiderte Umzugsstrategie.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Verpackung (1-2 Tage vorher)</h3>
                    <p className="text-muted-foreground">
                      Unser Team kommt und verpackt alles professionell. Sie können in 
                      Ruhe Abschied nehmen oder bereits am neuen Ort sein.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Umzugstag</h3>
                    <p className="text-muted-foreground">
                      Wir kümmern uns um alles: Demontage, Transport, Aufbau. Sie müssen 
                      nicht vor Ort sein (auf Wunsch).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Einrichtung & Auspacken</h3>
                    <p className="text-muted-foreground">
                      Wir packen aus, räumen ein und richten alles nach Ihren Wünschen ein. 
                      Verpackungsmaterial wird entsorgt. Sie ziehen in Ihr fertiges Zuhause ein!
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="p-6 bg-muted/30">
                <h3 className="font-semibold mb-4">Perfekt für:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Berufstätige mit wenig Zeit</li>
                  <li>• Familien mit Kindern</li>
                  <li>• Senioren</li>
                  <li>• Langstreckenumzüge</li>
                  <li>• Stressfreie Umzüge</li>
                </ul>
              </Card>

              <Card className="p-6 bg-alpine/5">
                <h3 className="font-semibold mb-4">Zusätzliche Premium-Optionen:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Endreinigung alte Wohnung</li>
                  <li>• Handwerkerservice</li>
                  <li>• Malerarbeiten</li>
                  <li>• Gartenmöbel-Montage</li>
                  <li>• Haustierbetreuung während Umzug</li>
                </ul>
              </Card>
            </div>

            <Card className="p-8 bg-gradient-hero text-primary-foreground">
              <div className="text-center">
                <Crown className="h-12 w-12 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-4">Premium-Garantie</h2>
                <p className="opacity-90 mb-6">
                  Vollständige Versicherung, persönlicher Umzugskoordinator und 
                  Zufriedenheitsgarantie inklusive.
                </p>
                <div className="inline-block bg-white/20 rounded-lg p-4">
                  <p className="text-sm">
                    Wenn Sie mit unserem Service nicht zu 100% zufrieden sind, 
                    machen wir es nochmal – kostenlos!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-6">Kundenstimmen zum Voll-Paket</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-current text-alpine" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "Absolut stressfrei! Ich bin abends nach der Arbeit in mein komplett 
                  eingerichtetes neues Zuhause eingezogen. Einfach perfekt!"
                </p>
                <p className="font-semibold">Lisa M., Zürich</p>
              </Card>

              <Card className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-current text-alpine" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "Für unsere Familie mit 3 Kindern war das Voll-Paket die beste Entscheidung. 
                  Das Team war unglaublich professionell und sorgfältig."
                </p>
                <p className="font-semibold">Familie Weber, Bern</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-balance mb-6">Bereit für Ihren stressfreien Umzug?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Geniessen Sie maximalen Komfort mit unserem Voll-Paket. 
            Wir kümmern uns um alles!
          </p>
          <Link to="/contact">
            <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
              Jetzt Offerte anfragen
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlanFull;
