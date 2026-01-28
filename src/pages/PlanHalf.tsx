import { Link } from "react-router-dom";
import { ArrowRight, Package, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PlanHalf = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 text-alpine mb-4">
              <Package className="h-6 w-6" />
              <span className="text-lg font-medium">Halb-Paket</span>
            </div>
            <h1 className="text-balance">Halb-Paket</h1>
            <p className="text-xl text-muted-foreground">
              Basis-Paket plus professionelle Verpackung. Die perfekte Balance 
              zwischen Komfort und Preis.
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
                  <CheckCircle className="h-6 w-6 text-alpine flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Zeitsparend</h3>
                    <p className="text-sm text-muted-foreground">Profis übernehmen das Packen</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="h-6 w-6 text-alpine flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Stressfrei</h3>
                    <p className="text-sm text-muted-foreground">Keine Sorge um Verpackung</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-alpine flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Flexibel</h3>
                    <p className="text-sm text-muted-foreground">Auspacken in eigenem Tempo</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Was ist inbegriffen?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-2 border-alpine">
                  <h3 className="font-semibold mb-4 text-alpine">✓ Alle Basis-Leistungen</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Professioneller Transport</li>
                    <li>• Möbeldemontage und -montage</li>
                    <li>• Sicherer Transport</li>
                    <li>• Positionierung am Zielort</li>
                    <li>• Transportversicherung</li>
                  </ul>
                </Card>

                <Card className="p-6 border-2 border-alpine bg-alpine/5">
                  <h3 className="font-semibold mb-4 text-alpine">+ Verpackungsservice</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• <strong>Professionelles Einpacken</strong> aller Gegenstände</li>
                    <li>• Hochwertiges Verpackungsmaterial inklusive</li>
                    <li>• Spezialverpackung für Fragiles</li>
                    <li>• Systematische Beschriftung</li>
                    <li>• Schutz für Möbel und Böden</li>
                  </ul>
                </Card>

                <Card className="p-6 col-span-2">
                  <h3 className="font-semibold mb-4 text-primary">○ Ihre Aufgaben</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Auspacken der Kartons am Zielort</li>
                    <li>• Einräumen Ihrer Gegenstände</li>
                    <li>• Entsorgung der Verpackungsmaterialien (auf Wunsch übernehmen wir das gegen Aufpreis)</li>
                  </ul>
                </Card>
              </div>
            </div>

            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-6">Unser Verpackungsservice im Detail</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-alpine/20 flex items-center justify-center mr-3">
                      <Package className="h-5 w-5 text-alpine" />
                    </div>
                    Materialien
                  </h3>
                  <ul className="space-y-2 text-muted-foreground ml-11">
                    <li>• Stabile Umzugskartons in verschiedenen Grössen</li>
                    <li>• Luftpolsterfolie und Seidenpapier</li>
                    <li>• Möbeldecken und Kantenschutz</li>
                    <li>• Spezialkartons für Gläser und Geschirr</li>
                    <li>• Kleiderstangen-Boxen</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-alpine/20 flex items-center justify-center mr-3">
                      <CheckCircle className="h-5 w-5 text-alpine" />
                    </div>
                    Vorgehen
                  </h3>
                  <ul className="space-y-2 text-muted-foreground ml-11">
                    <li>• Raum-für-Raum Verpackung</li>
                    <li>• Sorgfältige Handhabung aller Gegenstände</li>
                    <li>• Klare Beschriftung jedes Kartons</li>
                    <li>• Inventarliste auf Wunsch</li>
                    <li>• Spezialbehandlung für Wertgegenstände</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-6">Ablauf Ihres Umzugs</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">1-2 Tage vor dem Umzug</h3>
                    <p className="text-muted-foreground">
                      Unser Verpackungsteam kommt und packt alle Ihre Gegenstände 
                      professionell und sicher ein.
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
                      Transport-Team lädt alles ein, demontiert Möbel und transportiert 
                      sicher zur neuen Adresse.
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
                      Wir montieren Möbel, stellen alles auf. Sie packen in Ruhe aus, 
                      wann es Ihnen passt.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-alpine/5">
              <h2 className="text-2xl font-semibold mb-4">Upgrade zum Voll-Paket?</h2>
              <p className="text-muted-foreground mb-6">
                Möchten Sie auch das Auspacken unseren Profis überlassen? 
                Entdecken Sie unser Rundum-Sorglos-Paket:
              </p>
              <Link to="/plan/full">
                <Button variant="outline" className="border-alpine text-alpine hover:bg-alpine hover:text-white">
                  Zum Voll-Paket
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-balance mb-6">Perfekte Balance aus Komfort und Preis</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Lassen Sie die Profis packen und entspannen Sie sich beim Umzug.
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

export default PlanHalf;
