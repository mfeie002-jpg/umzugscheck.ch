import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Truck, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";

const TransporterGroesse = () => {
  const [rooms, setRooms] = useState<string>("");

  const transporterSizes = [
    {
      name: "Sprinter / Kastenwagen",
      volume: "bis 15m³",
      suitable: "1-2 Zimmer Wohnung",
      description: "Ideal für kleine Wohnungen und Studentenzimmer",
      rooms: ["1", "2"]
    },
    {
      name: "7.5-Tonner",
      volume: "15-30m³",
      suitable: "3-4 Zimmer Wohnung",
      description: "Standard für mittelgrosse Haushalte",
      rooms: ["3", "4"]
    },
    {
      name: "LKW 12-18 Tonnen",
      volume: "30-45m³",
      suitable: "Einfamilienhaus",
      description: "Für grosse Haushalte und Häuser",
      rooms: ["5+"]
    }
  ];

  const recommendedTransporter = transporterSizes.find(t => 
    t.rooms.includes(rooms)
  );

  return (
    <>
      <SEOHead
        title="Transporter-Grössen-Rechner | Umzugscheck.ch"
        description="Finden Sie die richtige Transportergrösse für Ihren Umzug. Kostenloser Rechner für Sprinter, 7.5-Tonner oder LKW."
        canonical="https://umzugscheck.ch/rechner/transporter-groesse"
      />
      
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          {/* Hero */}
          <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Kostenloser Rechner</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Transporter-Grössen-Rechner
                </h1>
                <p className="text-xl text-muted-foreground">
                  Finden Sie heraus, welche Transportergrösse Sie für Ihren Umzug benötigen.
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
                    <CardTitle>Wohnungsgrösse angeben</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={rooms} onValueChange={setRooms}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer">
                          <RadioGroupItem value="1" id="r1" />
                          <Label htmlFor="r1" className="flex-1 cursor-pointer">
                            1 Zimmer
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer">
                          <RadioGroupItem value="2" id="r2" />
                          <Label htmlFor="r2" className="flex-1 cursor-pointer">
                            2 Zimmer
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer">
                          <RadioGroupItem value="3" id="r3" />
                          <Label htmlFor="r3" className="flex-1 cursor-pointer">
                            3 Zimmer
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer">
                          <RadioGroupItem value="4" id="r4" />
                          <Label htmlFor="r4" className="flex-1 cursor-pointer">
                            4 Zimmer
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer">
                          <RadioGroupItem value="5+" id="r5" />
                          <Label htmlFor="r5" className="flex-1 cursor-pointer">
                            5+ Zimmer / Haus
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Result */}
                {recommendedTransporter && (
                  <Card className="mt-8 border-primary/20 bg-primary/5">
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <Truck className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Empfohlene Transportergrösse</h3>
                        <div className="text-3xl font-bold text-primary mb-2">
                          {recommendedTransporter.name}
                        </div>
                        <p className="text-muted-foreground">
                          {recommendedTransporter.volume} • {recommendedTransporter.description}
                        </p>
                      </div>
                      
                      <div className="bg-background rounded-lg p-6 mb-6">
                        <h4 className="font-semibold mb-3">Das passt in diesen Transporter:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5" />
                            <span>{recommendedTransporter.suitable}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5" />
                            <span>Standard-Möbel und Hausrat</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5" />
                            <span>Umzugskartons</span>
                          </li>
                        </ul>
                      </div>

                      <Link to="/offerte">
                        <Button size="lg" className="w-full">
                          Offerte mit diesen Daten anfordern
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* All Sizes */}
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Alle Transportergrössen im Überblick</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {transporterSizes.map((transporter, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{transporter.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div>
                              <strong>Volumen:</strong> {transporter.volume}
                            </div>
                            <div>
                              <strong>Geeignet für:</strong> {transporter.suitable}
                            </div>
                            <p className="text-muted-foreground">
                              {transporter.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Wichtige Hinweise</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <p>
                      • Die Empfehlung basiert auf Durchschnittswerten für Standard-Haushalte.
                    </p>
                    <p>
                      • Bei vielen Möbeln oder sperrigen Gegenständen kann eine Nummer grösser nötig sein.
                    </p>
                    <p>
                      • Professionelle Umzugsfirmen können die benötigte Grösse bei einer Besichtigung exakt bestimmen.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TransporterGroesse;
