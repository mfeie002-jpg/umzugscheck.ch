import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Plus, Minus, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Volumenrechner = () => {
  const [items, setItems] = useState({
    boxes: 0,
    wardrobes: 0,
    beds: 0,
    sofas: 0,
    tables: 0,
    chairs: 0,
  });

  const itemVolumes = {
    boxes: 0.15, // m³ per box
    wardrobes: 1.5,
    beds: 2.0,
    sofas: 3.0,
    tables: 1.2,
    chairs: 0.5,
  };

  const itemNames = {
    boxes: "Umzugskartons",
    wardrobes: "Schränke",
    beds: "Betten",
    sofas: "Sofas",
    tables: "Tische",
    chairs: "Stühle",
  };

  const updateItem = (key: keyof typeof items, delta: number) => {
    setItems(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta)
    }));
  };

  const totalVolume = Object.entries(items).reduce(
    (sum, [key, count]) => sum + count * itemVolumes[key as keyof typeof items],
    0
  );

  return (
    <>
      <SEOHead
        title="Volumenrechner - Umzugsvolumen berechnen | Umzugscheck.ch"
        description="Berechnen Sie das Volumen Ihres Hausrats in Kubikmetern. Kostenloser Volumenrechner für präzise Umzugskostenschätzung."
        canonical="https://umzugscheck.ch/rechner/volumenrechner"
      />
      
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          {/* Hero */}
          <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Kostenloser Rechner</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Volumenrechner
                </h1>
                <p className="text-xl text-muted-foreground">
                  Ermitteln Sie das Volumen Ihres Hausrats in Kubikmetern für eine präzise Kostenkalkulation.
                </p>
              </div>
            </div>
          </section>

          {/* Calculator */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventar erfassen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {(Object.keys(items) as Array<keyof typeof items>).map((key) => (
                      <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                        <Label className="text-base">{itemNames[key]}</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => updateItem(key, -1)}
                            disabled={items[key] === 0}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">
                            {items[key]}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => updateItem(key, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Result */}
                {totalVolume > 0 && (
                  <Card className="mt-8 border-primary/20 bg-primary/5">
                    <CardContent className="p-8 text-center">
                      <Package className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Geschätztes Volumen</h3>
                      <div className="text-5xl font-bold text-primary mb-6">
                        {totalVolume.toFixed(1)} m³
                      </div>
                      <p className="text-muted-foreground mb-6">
                        Basierend auf Ihrer Angabe werden ca. <strong>{Math.ceil(totalVolume / 10)} Kubikmeter-Transporter</strong> benötigt.
                      </p>
                      <Link to="/offerte">
                        <Button size="lg" className="w-full md:w-auto">
                          Offerte mit diesen Daten anfordern
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* Info */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Info zum Volumenrechner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Dieser Rechner gibt Ihnen eine erste Schätzung des Volumens Ihres Hausrats. 
                      Für eine exakte Offerte sollten Sie eine detaillierte Anfrage stellen.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Die angegebenen Werte sind Durchschnittswerte. Tatsächliche Masse können variieren.
                    </p>
                  </CardContent>
                </Card>

                {/* FAQ */}
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Häufige Fragen zum Volumen</h2>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Wie genau ist die Volumenberechnung?</AccordionTrigger>
                      <AccordionContent>
                        Die Berechnung basiert auf Durchschnittswerten und gibt eine gute Orientierung. 
                        Für eine exakte Kalkulation empfehlen wir eine Besichtigung durch die Umzugsfirma.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Welchen Transporter brauche ich?</AccordionTrigger>
                      <AccordionContent>
                        Als Faustregel gilt: Bis 15m³ reicht meist ein Sprinter, bis 30m³ ein 7.5-Tönner, 
                        darüber hinaus sind grössere LKW notwendig.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Muss ich alles einzeln zählen?</AccordionTrigger>
                      <AccordionContent>
                        Für eine erste Schätzung reichen ungefähre Angaben. Für die finale Offerte 
                        werden Umzugsfirmen eine detailliertere Aufstellung benötigen.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Volumenrechner;
