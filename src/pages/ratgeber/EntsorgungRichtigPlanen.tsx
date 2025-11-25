import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trash2, RecycleIcon, TruckIcon, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function EntsorgungRichtigPlanen() {
  return (
    <>
      <SEOHead 
        title="Entsorgung beim Umzug richtig planen | Umzugscheck.ch"
        description="Professionelle Tipps zur Entsorgung beim Umzug. Erfahren Sie, wie Sie Möbel, Sperrmüll und Elektronik korrekt entsorgen und Kosten sparen."
        canonical="/ratgeber/entsorgung-richtig-planen"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8 md:py-12">
          <Breadcrumbs 
            items={[
              { label: "Startseite", href: "/" },
              { label: "Ratgeber", href: "/ratgeber" },
              { label: "Entsorgung richtig planen" }
            ]}
          />

          <article className="max-w-4xl mx-auto mt-8">
            {/* Hero Section */}
            <header className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10">
                <Trash2 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
                Entsorgung beim Umzug richtig planen
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Tipps und Tricks für eine umweltgerechte und kosteneffiziente Entsorgung
              </p>
            </header>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Ein Umzug ist die perfekte Gelegenheit, sich von unnötigem Ballast zu trennen. 
                Doch wohin mit alten Möbeln, Elektrogeräten und anderem Hausrat? In der Schweiz 
                gelten strenge Entsorgungsvorschriften, und eine falsche Entsorgung kann teuer werden. 
                Mit der richtigen Planung sparen Sie nicht nur Geld, sondern schonen auch die Umwelt.
              </p>
            </div>

            {/* Main Categories */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Was kann wie entsorgt werden?
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <RecycleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Recycling & Wertstoffe</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Papier, Karton → Altpapiersammlung</li>
                        <li>• Glas → Glascontainer (nach Farben getrennt)</li>
                        <li>• PET-Flaschen → Rückgabe im Supermarkt</li>
                        <li>• Aluminium, Weissblech → Recycling-Sammelstellen</li>
                        <li>• Textilien → Altkleidersammlung</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <TruckIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Sperrgut & Möbel</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Möbel → Sperrgutabfuhr oder Entsorgungshof</li>
                        <li>• Matratzen → Entsorgungshof (gegen Gebühr)</li>
                        <li>• Teppiche → Entsorgungshof</li>
                        <li>• Große Gegenstände → Voranmeldung nötig</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Elektrogeräte</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Kühlschrank, Waschmaschine → Rücknahme beim Händler</li>
                        <li>• Fernseher, Computer → Elektroschrott-Sammelstellen</li>
                        <li>• Kleingeräte → Rückgabe im Fachgeschäft</li>
                        <li>• Batterien → Batterie-Sammelstellen</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <Trash2 className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Sondermüll</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Farben, Lacke → Sondermüllsammlung</li>
                        <li>• Chemikalien → Entsorgungshof</li>
                        <li>• Medikamente → Apotheke</li>
                        <li>• Öle → Rückgabe beim Händler</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cost Overview */}
            <section className="mb-12 bg-muted/50 p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Entsorgungskosten in der Schweiz
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-medium">Sperrgutabfuhr (pro m³)</span>
                  <span className="font-semibold text-primary">CHF 50-120</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-medium">Entsorgung Kühlschrank</span>
                  <span className="font-semibold text-primary">CHF 50-80</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-medium">Matratzenentsorgung</span>
                  <span className="font-semibold text-primary">CHF 30-50</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-medium">Vollentsorgung Wohnung (3 Zimmer)</span>
                  <span className="font-semibold text-primary">CHF 500-1500</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                * Preise variieren je nach Gemeinde und Menge. Viele Umzugsfirmen bieten 
                Entsorgungsservices an und können Kosten sparen.
              </p>
            </section>

            {/* Tips Section */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Geld sparen bei der Entsorgung
              </h2>
              
              <div className="grid gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">1. Früh aussortieren</h3>
                  <p className="text-muted-foreground">
                    Beginnen Sie 6-8 Wochen vor dem Umzug mit dem Aussortieren. 
                    Je früher Sie starten, desto mehr Zeit haben Sie, Dinge zu verkaufen 
                    oder zu verschenken statt teuer zu entsorgen.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">2. Verkaufen statt entsorgen</h3>
                  <p className="text-muted-foreground">
                    Nutzen Sie Plattformen wie Ricardo, Tutti oder Facebook Marketplace. 
                    Was Sie nicht mehr brauchen, freut vielleicht jemand anderen – und 
                    bringt Ihnen noch etwas Geld ein.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">3. Verschenken oder spenden</h3>
                  <p className="text-muted-foreground">
                    Heilsarmee, Caritas oder lokale Brockenhäuser nehmen gut erhaltene 
                    Möbel und Haushaltsartikel gerne entgegen. Kostenlose Abholung ist oft möglich.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">4. Umzugsfirma mit Entsorgung</h3>
                  <p className="text-muted-foreground">
                    Viele Umzugsfirmen bieten Komplettpakete an. Die Entsorgung direkt 
                    über die Umzugsfirma zu buchen ist oft günstiger als separate Entsorgungsdienste.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3">5. Gemeinde-Sammlungen nutzen</h3>
                  <p className="text-muted-foreground">
                    Prüfen Sie die Sammlungstermine Ihrer Gemeinde. Viele bieten kostenlose 
                    oder vergünstigte Sperrgutabholungen zu bestimmten Terminen an.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary/10 p-8 rounded-lg text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">
                Entsorgung gleich mitplanen?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Berechnen Sie jetzt die Kosten für Ihren Umzug inklusive Entsorgung. 
                Viele Umzugsfirmen bieten Komplettlösungen an.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/rechner/entsorgung">
                  <Button size="lg" className="w-full sm:w-auto">
                    Entsorgungskosten berechnen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/offerte">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Offerte mit Entsorgung anfordern
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