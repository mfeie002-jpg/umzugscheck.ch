import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cat, Dog, Bird, Fish, Heart, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function UmzugMitHaustieren() {
  return (
    <>
      <SEOHead 
        title="Umzug mit Haustieren: Tipps für Katzen, Hunde & Co | Umzugscheck.ch"
        description="Stressfreier Umzug mit Haustieren. Praktische Tipps für Hunde, Katzen, Vögel und andere Tiere. So bereiten Sie Ihre Haustiere optimal vor."
        canonical="/ratgeber/umzug-mit-haustieren"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "Ratgeber", href: "/ratgeber" },
              { label: "Umzug mit Haustieren" }
            ]}
          />

          <article className="max-w-4xl mx-auto mt-8">
            {/* Hero Section */}
            <header className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
                Umzug mit Haustieren meistern
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                So wird der Umzug für Ihre vierbeinigen Familienmitglieder stressfrei
              </p>
            </header>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Ein Umzug bedeutet Stress – nicht nur für Menschen, sondern auch für Haustiere. 
                Hunde, Katzen, Vögel und andere Tiere sind sensibel auf Veränderungen in ihrer 
                Umgebung. Mit der richtigen Vorbereitung und Rücksichtnahme machen Sie den Umzug 
                für alle Beteiligten angenehmer.
              </p>
            </div>

            {/* Pet-Specific Tips */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Tipps nach Tierart
              </h2>
              
              <div className="grid gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <Dog className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl mb-3">Hunde</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• <strong>Vor dem Umzug:</strong> Neue Umgebung im Voraus erkunden lassen</li>
                        <li>• <strong>Am Umzugstag:</strong> Hund zu Freunden/Familie oder in Pension geben</li>
                        <li>• <strong>Nach dem Umzug:</strong> Feste Routinen beibehalten (Fütterung, Gassi-Zeiten)</li>
                        <li>• <strong>Wichtig:</strong> Adresse auf Hundemarke und bei Gemeinde ändern</li>
                        <li>• Bekannte Gegenstände (Körbchen, Spielzeug) zuerst auspacken</li>
                        <li>• Neue Gassirouten langsam einführen</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <Cat className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl mb-3">Katzen</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• <strong>Vorbereitung:</strong> Transportbox mehrere Wochen vorher aufstellen</li>
                        <li>• <strong>Am Umzugstag:</strong> Katze in ruhigem Raum mit Tür zu lassen</li>
                        <li>• <strong>Eingewöhnung:</strong> Erst ein Zimmer zugänglich machen, dann erweitern</li>
                        <li>• <strong>Wichtig:</strong> Chip-Registrierung aktualisieren</li>
                        <li>• Vertraute Gerüche (Decken, Kissen) im neuen Zuhause platzieren</li>
                        <li>• Freigänger: 2-3 Wochen nur drinnen halten</li>
                        <li>• Katzenklo sofort am gewohnten Platz aufstellen</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <Bird className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl mb-3">Vögel</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Transport in gewohntem Käfig mit Tuch abgedeckt</li>
                        <li>• Zugluft und extreme Temperaturen vermeiden</li>
                        <li>• Käfig im neuen Zuhause an ruhigem Ort aufstellen</li>
                        <li>• Erst nach 1-2 Tagen Freiflug ermöglichen</li>
                        <li>• Gewohnte Sitzstangen und Spielzeuge mitnehmen</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <Fish className="w-8 h-8 text-cyan-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl mb-3">Fische & Aquarium</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Fische in Transportbeutel mit Aquariumwasser umziehen</li>
                        <li>• Aquarium am Vortag teilweise entleeren</li>
                        <li>• Filter und Dekoration in Aquariumwasser transportieren</li>
                        <li>• Aquarium sofort im neuen Zuhause wieder aufbauen</li>
                        <li>• Fische langsam an neues Wasser gewöhnen</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section className="mb-12 bg-muted/50 p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Zeitplan für den Umzug mit Haustieren
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="font-semibold text-lg mb-2">4-6 Wochen vorher</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Tierarzt-Termin für Gesundheitscheck</li>
                    <li>• Transportboxen anschaffen und gewöhnen lassen</li>
                    <li>• Neue Adresse bei Chip-Register anmelden</li>
                    <li>• Bei Auslandsumzug: Impfungen und Papiere prüfen</li>
                  </ul>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="font-semibold text-lg mb-2">1-2 Wochen vorher</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Neuen Tierarzt in der Umgebung finden</li>
                    <li>• Haustier-Betreuung für Umzugstag organisieren</li>
                    <li>• Lieblingsdecken und Spielzeuge markieren</li>
                  </ul>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="font-semibold text-lg mb-2">Am Umzugstag</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Haustier in ruhigem Raum oder bei Betreuung</li>
                    <li>• Gewohnte Futter- und Gassi-Zeiten einhalten</li>
                    <li>• Als letztes abholen, als erstes im neuen Zuhause</li>
                  </ul>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="font-semibold text-lg mb-2">Nach dem Umzug</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Vertraute Gegenstände sofort aufstellen</li>
                    <li>• Routinen beibehalten (Fütterung, Schlafplatz)</li>
                    <li>• Viel Zeit und Aufmerksamkeit geben</li>
                    <li>• Schrittweise neue Umgebung erkunden lassen</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Warning Box */}
            <section className="mb-12">
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 p-6 rounded-lg">
                <div className="flex gap-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-orange-900 dark:text-orange-100">
                      Wichtige Sicherheitshinweise
                    </h3>
                    <ul className="space-y-2 text-orange-800 dark:text-orange-200">
                      <li>• <strong>Niemals</strong> Haustiere alleine im Auto bei Hitze lassen</li>
                      <li>• Bei Medikation: Tierarzt nach Stress-Beruhigung fragen</li>
                      <li>• Fluchtgefahr: Fenster und Türen sichern während Umzug</li>
                      <li>• ID-Marke und Chip-Daten VOR dem Umzug aktualisieren</li>
                      <li>• Giftige Pflanzen in neuer Wohnung entfernen</li>
                      <li>• Notfall-Tierarzt in neuer Umgebung recherchieren</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Checklist */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Umzugs-Checkliste für Haustiere
              </h2>
              
              <div className="bg-card p-6 rounded-lg border">
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <span>Transportbox besorgt und Tier daran gewöhnt</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <span>Tierarzt-Check durchgeführt</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <span>Chip-Registrierung aktualisiert</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <span>Neuen Tierarzt gefunden</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <span>Betreuung für Umzugstag organisiert</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <span>Futter, Näpfe, Spielzeug separat verpackt</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <span>Notfall-Tierarzt-Nummer gespeichert</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <span>Ruhigen Raum im neuen Zuhause vorbereitet</span>
                  </label>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary/10 p-8 rounded-lg text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">
                Umzug mit Haustieren planen?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Finden Sie tierfreundliche Umzugsfirmen, die Rücksicht auf Ihre Haustiere nehmen 
                und flexible Zeitpläne anbieten.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/rechner/umzugskosten">
                  <Button size="lg" className="w-full sm:w-auto">
                    Umzugskosten berechnen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/offerte">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Offerte anfordern
                  </Button>
                </Link>
              </div>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}