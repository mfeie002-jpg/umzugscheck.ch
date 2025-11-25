import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Download, FileText } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

const UmzugschecklistePDF = () => {
  return (
    <>
      <SEOHead
        title="Umzugscheckliste PDF - Kostenlos herunterladen | Umzugscheck.ch"
        description="Laden Sie unsere kostenlose Umzugscheckliste als PDF herunter. Schritt-für-Schritt Anleitung für einen stressfreien Umzug."
        canonical="https://umzugscheck.ch/ratgeber/umzugscheckliste-pdf"
      />
      
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Umzugscheckliste PDF
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8">
                    Ihre komplette Checkliste für einen organisierten Umzug – 
                    kostenlos als PDF zum Ausdrucken.
                  </p>
                  
                  <Card className="inline-block border-primary/20 bg-primary/5">
                    <CardContent className="p-6">
                      <Button size="lg" className="gap-2">
                        <Download className="w-5 h-5" />
                        Checkliste herunterladen (PDF)
                      </Button>
                      <p className="text-sm text-muted-foreground mt-3">
                        Kostenlos • Keine Anmeldung erforderlich
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto space-y-12">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Was enthält die Checkliste?</h2>
                  <p className="text-muted-foreground mb-6">
                    Unsere umfassende Umzugscheckliste begleitet Sie durch alle Phasen Ihres Umzugs – 
                    vom ersten Tag der Planung bis zum Einleben in der neuen Wohnung.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>3 Monate vor dem Umzug</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Kündigungsfrist prüfen und Wohnung kündigen</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Umzugsfirmen vergleichen und Offerten einholen</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Ausmisten: Nicht mehr benötigte Gegenstände verkaufen oder entsorgen</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Umzugskartons und Verpackungsmaterial besorgen</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>1 Monat vor dem Umzug</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Adressänderungen bei Post, Behörden und Ämtern melden</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Strom, Gas, Internet und Telefon um- bzw. anmelden</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Parkplatz oder Halteverbot für Umzugswagen beantragen</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Helfer organisieren (falls Eigenregie)</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>1 Woche vor dem Umzug</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Alle Kartons beschriften und packen</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Kühlschrank abtauen</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Wichtige Dokumente separat verpacken</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Endreinigung organisieren</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Am Umzugstag</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Zählerstände ablesen und dokumentieren</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Wohnungsübergabe alte Wohnung</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Schlüssel übergeben</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Einrichtung in neuer Wohnung koordinieren</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nach dem Umzug</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Ummeldung beim Einwohnermeldeamt innerhalb von 14 Tagen</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Nachsendeauftrag bei der Post aktivieren</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Abos, Versicherungen und Verträge aktualisieren</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                      <span>Bei Nachbarn vorstellen</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center pt-8">
                  <Card className="inline-block border-primary/20 bg-primary/5">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold mb-4">
                        Jetzt kostenlos herunterladen
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Holen Sie sich die komplette Checkliste als praktisches PDF
                      </p>
                      <Button size="lg" className="gap-2">
                        <Download className="w-5 h-5" />
                        PDF herunterladen
                      </Button>
                    </CardContent>
                  </Card>
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

export default UmzugschecklistePDF;
