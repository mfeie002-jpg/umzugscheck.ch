import { Link } from "react-router-dom";
import { ArrowRight, Package, Clock, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PlanBasic = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 text-alpine mb-4">
              <Package className="h-6 w-6" />
              <span className="text-lg font-medium">Basis-Paket</span>
            </div>
            <h1 className="text-balance">Basis-Paket</h1>
            <p className="text-xl text-muted-foreground">
              Das kostengünstige Paket für selbständige Kunden. Ideal für alle, 
              die Zeit haben und Kosten sparen möchten.
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
            <Card className="p-8 mb-12 bg-muted/30">
              <h2 className="text-2xl font-semibold mb-6">Ideal für:</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <Euro className="h-6 w-6 text-alpine flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Kostenersparnis</h3>
                    <p className="text-sm text-muted-foreground">Budget schonen durch Eigenleistung</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-alpine flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Zeitreserven</h3>
                    <p className="text-sm text-muted-foreground">Genug Zeit für Vorbereitung</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="h-6 w-6 text-alpine flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Selbstpacker</h3>
                    <p className="text-sm text-muted-foreground">Eigenständige Verpackung bevorzugt</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Was ist inbegriffen?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 text-alpine">✓ Unsere Leistungen</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Professioneller Transport Ihrer Möbel</li>
                    <li>• Demontage grosser Möbelstücke</li>
                    <li>• Sicherer Transport mit modernen Fahrzeugen</li>
                    <li>• Montage am Zielort</li>
                    <li>• Positionierung nach Ihren Wünschen</li>
                    <li>• Transportversicherung</li>
                    <li>• Erfahrenes Umzugsteam</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 text-primary">○ Ihre Aufgaben</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Verpackung kleinerer Gegenstände</li>
                    <li>• Kartons packen und beschriften</li>
                    <li>• Auspacken am Zielort</li>
                    <li>• Entsorgung der Verpackungsmaterialien</li>
                  </ul>
                  <div className="mt-6 p-4 bg-alpine/10 rounded-lg">
                    <p className="text-sm">
                      <strong>Tipp:</strong> Wir stellen Ihnen gerne Umzugskartons 
                      und Verpackungsmaterial zur Verfügung!
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-6">So läuft Ihr Umzug ab</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Vor dem Umzug</h3>
                    <p className="text-muted-foreground">
                      Sie packen Ihre Kartons und bereiten alles vor. Wir beraten Sie 
                      gerne zur optimalen Vorbereitung.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Am Umzugstag</h3>
                    <p className="text-muted-foreground">
                      Unser Team demontiert Möbel, lädt alles professionell und 
                      transportiert sicher zu Ihrer neuen Adresse.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Am Zielort</h3>
                    <p className="text-muted-foreground">
                      Wir montieren die Möbel, stellen alles nach Ihren Wünschen auf 
                      und Sie packen in Ruhe aus.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-alpine/5">
              <h2 className="text-2xl font-semibold mb-4">Zusatzoptionen</h2>
              <p className="text-muted-foreground mb-6">
                Ergänzen Sie Ihr Basis-Paket mit unseren beliebten Zusatzleistungen:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/plan/packing" className="p-4 border rounded-lg hover:border-alpine transition-colors">
                  <h3 className="font-semibold mb-2">+ Verpackungsservice</h3>
                  <p className="text-sm text-muted-foreground">Profis übernehmen das Packen</p>
                </Link>
                <Link to="/plan/storage" className="p-4 border rounded-lg hover:border-alpine transition-colors">
                  <h3 className="font-semibold mb-2">+ Zwischenlagerung</h3>
                  <p className="text-sm text-muted-foreground">Sichere Aufbewahrung</p>
                </Link>
                <Link to="/plan/assembly" className="p-4 border rounded-lg hover:border-alpine transition-colors">
                  <h3 className="font-semibold mb-2">+ Küchenmontage</h3>
                  <p className="text-sm text-muted-foreground">Fachgerechter Ein- und Ausbau</p>
                </Link>
                <Link to="/option/pricing" className="p-4 border rounded-lg hover:border-alpine transition-colors">
                  <h3 className="font-semibold mb-2">Alle Optionen</h3>
                  <p className="text-sm text-muted-foreground">Komplette Übersicht</p>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-balance mb-6">Bereit für Ihr Basis-Paket?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Erhalten Sie jetzt Ihr persönliches Angebot für einen kostengünstigen Umzug.
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

export default PlanBasic;
