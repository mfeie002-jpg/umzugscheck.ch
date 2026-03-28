import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Download, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import checklistImage from "@/assets/checklist-new.jpg";

const Checklist = () => {
  const phases = [
    {
      title: "8 Wochen vor dem Umzug",
      icon: "📋",
      tasks: [
        "Umzugstermin festlegen",
        "Umzugsfirma kontaktieren und Offerten einholen",
        "Budget für den Umzug erstellen",
        "Mietvertrag für neue Wohnung unterschreiben",
        "Kündigungsfrist für alte Wohnung prüfen",
        "Inventarliste erstellen (für Versicherung)",
        "Entrümpeln: Nicht mehr Benötigtes aussortieren"
      ]
    },
    {
      title: "6 Wochen vor dem Umzug",
      icon: "📦",
      tasks: [
        "Umzugskartons und Verpackungsmaterial besorgen",
        "Nachsendeauftrag bei der Post einrichten",
        "Adressänderungen vorbereiten (Liste erstellen)",
        "Sondermüllentsorgung planen",
        "Kinderhüte oder Tierbetreuung organisieren",
        "Parkplatzbewilligung für Umzugswagen beantragen",
        "Inventar fotografieren (für Versicherung)"
      ]
    },
    {
      title: "4 Wochen vor dem Umzug",
      icon: "🏠",
      tasks: [
        "Strom-, Gas- und Wasseranbieter informieren",
        "Internet und Telefon ummelden",
        "Abos und Mitgliedschaften ummelden",
        "Bank, Versicherungen und Arbeitgeber informieren",
        "Schulen und Ärzte informieren",
        "Haushaltsauflösung planen (falls nötig)",
        "Renovierung der alten Wohnung planen"
      ]
    },
    {
      title: "2 Wochen vor dem Umzug",
      icon: "📍",
      tasks: [
        "Mit dem Packen beginnen (nicht Essenzielles)",
        "Kartons beschriften (Inhalt + Zielraum)",
        "Zerbrechliches sicher verpacken",
        "Wichtige Dokumente separat aufbewahren",
        "Schlüsselübergabe koordinieren",
        "Kühlschrank und Tiefkühler abtauen lassen",
        "Letzte Details mit Umzugsfirma klären"
      ]
    },
    {
      title: "1 Woche vor dem Umzug",
      icon: "✅",
      tasks: [
        "Restliche Gegenstände einpacken",
        "Umzugshelfer nochmals bestätigen",
        "Verpflegung für Umzugstag organisieren",
        "Wertgegenstände separat transportieren",
        "Notfall-Koffer für ersten Tag packen",
        "Letzte Endreinigung der alten Wohnung planen",
        "Neue Wohnung vermessen und Möbelstellung planen"
      ]
    },
    {
      title: "Umzugstag",
      icon: "🚚",
      tasks: [
        "Früh aufstehen und letzte Vorbereitungen treffen",
        "Umzugsteam empfangen und einweisen",
        "Zählerstände in alter Wohnung notieren",
        "Wohnungsübergabe alte Wohnung",
        "Transport begleiten (bei Bedarf)",
        "Zählerstände in neuer Wohnung notieren",
        "Möbel gemäss Plan aufstellen lassen",
        "Wohnung auf Transportschäden prüfen"
      ]
    },
    {
      title: "Nach dem Umzug",
      icon: "🎉",
      tasks: [
        "Kartons auspacken und einräumen",
        "Verpackungsmaterial entsorgen",
        "Adressänderung durchführen (Behörden, Post, etc.)",
        "Neue Nachbarn kennenlernen",
        "Letzte Endreinigung alte Wohnung",
        "Schlüssel alte Wohnung zurückgeben",
        "Kaution-Rückzahlung überwachen",
        "Einweihungsparty planen"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-alpine mx-auto" />
            <h1 className="text-balance">Ihre Umzugscheckliste</h1>
            <p className="text-xl text-muted-foreground">
              Die komplette Checkliste für einen stressfreien Umzug. 
              Von der Planung bis zum Einzug – nichts vergessen!
            </p>
            <Button variant="outline" size="lg" className="gap-2">
              <Download className="h-5 w-5" />
              Checkliste als PDF herunterladen
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {phases.map((phase, index) => (
                <AccordionItem key={index} value={`phase-${index}`}>
                  <Card className="overflow-hidden">
                    <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-muted/30 transition-colors">
                      <div className="flex items-center space-x-4 text-left">
                        <span className="text-4xl">{phase.icon}</span>
                        <div>
                          <h3 className="text-xl font-semibold">{phase.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {phase.tasks.length} Aufgaben
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-8 pb-6 pt-2">
                        <ul className="space-y-3">
                          {phase.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-start space-x-3 group">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-alpine/50 mt-0.5 group-hover:bg-alpine/10 transition-colors"></div>
                              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                                {task}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-8 text-center">Wichtige Tipps für Ihren Umzug</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Calendar className="h-5 w-5 text-alpine mr-2" />
                  Zeitplanung
                </h3>
                <p className="text-sm text-muted-foreground">
                  Planen Sie Ihren Umzug möglichst frühzeitig. 2-3 Monate Vorlaufzeit sind ideal, 
                  um Stress zu vermeiden und bessere Konditionen zu erhalten.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-alpine mr-2" />
                  Systematisch packen
                </h3>
                <p className="text-sm text-muted-foreground">
                  Packen Sie raumweise und beschriften Sie alle Kartons deutlich. 
                  Das erleichtert das Auspacken enorm und spart Zeit.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Download className="h-5 w-5 text-alpine mr-2" />
                  Dokumentation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fotografieren Sie Ihre Möbel vor dem Umzug und notieren Sie Zählerstände. 
                  Das schützt Sie bei eventuellen Unstimmigkeiten.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <ArrowRight className="h-5 w-5 text-alpine mr-2" />
                  Profis beauftragen
                </h3>
                <p className="text-sm text-muted-foreground">
                  Eine professionelle Umzugsfirma spart Zeit, Nerven und oft auch Geld. 
                  Lassen Sie sich beraten und ein Angebot erstellen.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-balance mb-6">Lassen Sie uns Ihnen helfen!</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Mit unserer Erfahrung machen wir Ihren Umzug zum Kinderspiel. 
            Kontaktieren Sie uns für eine kostenlose Beratung.
          </p>
          <Link to="/contact">
            <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-opacity-90 transition-opacity">
              Jetzt Offerte anfragen
              <ArrowRight className="ml-2 inline h-5 w-5" />
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checklist;
