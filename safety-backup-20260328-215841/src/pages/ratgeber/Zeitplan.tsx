import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Clock, CheckCircle, AlertTriangle, ArrowRight,
  Home, Truck, FileText, Phone, Key, Package, ClipboardList
} from "lucide-react";
import { Link } from "react-router-dom";

interface TimelinePhase {
  weeks: string;
  title: string;
  icon: React.ElementType;
  priority: "critical" | "important" | "normal";
  tasks: {
    task: string;
    tip?: string;
  }[];
}

const timelinePhases: TimelinePhase[] = [
  {
    weeks: "8–6 Wochen vorher",
    title: "Planung starten",
    icon: Calendar,
    priority: "important",
    tasks: [
      { task: "Umzugstermin festlegen", tip: "Unter der Woche ist oft günstiger" },
      { task: "Umzugsfirmen vergleichen und Offerten einholen" },
      { task: "Kündigung der alten Wohnung einreichen" },
      { task: "Urlaub für Umzugstage beantragen" },
      { task: "Budget für den Umzug festlegen" },
      { task: "Inventarliste der Möbel erstellen" },
    ]
  },
  {
    weeks: "6–4 Wochen vorher",
    title: "Vorbereitungen",
    icon: ClipboardList,
    priority: "important",
    tasks: [
      { task: "Umzugsfirma verbindlich buchen" },
      { task: "Entrümpeln und Ausmisten beginnen" },
      { task: "Sperrmüll-Termin vereinbaren" },
      { task: "Verpackungsmaterial besorgen (Kartons, Klebeband, Polsterfolie)" },
      { task: "Adressänderungen vorbereiten (Liste erstellen)" },
      { task: "Handwerker für neue Wohnung buchen" },
    ]
  },
  {
    weeks: "4–2 Wochen vorher",
    title: "Organisation",
    icon: FileText,
    priority: "normal",
    tasks: [
      { task: "Nachsendeauftrag bei der Post einrichten" },
      { task: "Adressänderungen durchführen (Bank, Versicherungen, Arbeitgeber)" },
      { task: "Parkverbotszone für Umzugswagen beantragen" },
      { task: "Kinderbetreuung / Haustierbetreuung organisieren" },
      { task: "Nicht-alltägliche Gegenstände einpacken" },
      { task: "Möbelabbau planen und Werkzeug bereitlegen" },
    ]
  },
  {
    weeks: "2–1 Woche vorher",
    title: "Endspurt",
    icon: Package,
    priority: "important",
    tasks: [
      { task: "Restliche Sachen einpacken" },
      { task: "Kartons beschriften (Raum + Inhalt)" },
      { task: "Kühlschrank abtauen und reinigen" },
      { task: "Wertsachen separat und sicher verpacken" },
      { task: "Notfallkoffer packen (Dokumente, Medikamente, Wechselkleidung)" },
      { task: "Schlüsselübergabe-Termin mit Vermieter vereinbaren" },
    ]
  },
  {
    weeks: "1–2 Tage vorher",
    title: "Letzte Vorbereitungen",
    icon: Home,
    priority: "critical",
    tasks: [
      { task: "Möbel abbauen" },
      { task: "Elektrogeräte abklemmen und sichern" },
      { task: "Letzte Reinigung der alten Wohnung organisieren" },
      { task: "Verpflegung für Umzugshelfer besorgen" },
      { task: "Zählerstände in alter Wohnung ablesen und dokumentieren" },
      { task: "Bargeld für Trinkgeld/Kleinigkeiten bereitlegen" },
    ]
  },
  {
    weeks: "Am Umzugstag",
    title: "Der grosse Tag",
    icon: Truck,
    priority: "critical",
    tasks: [
      { task: "Früh aufstehen und bereit sein" },
      { task: "Umzugsfirma empfangen und einweisen" },
      { task: "Wohnung vor Auszug auf Schäden kontrollieren" },
      { task: "Übergabeprotokoll erstellen und unterschreiben" },
      { task: "Alle Schlüssel übergeben" },
      { task: "Zählerstände in neuer Wohnung ablesen" },
    ]
  },
  {
    weeks: "Nach dem Umzug",
    title: "Einleben",
    icon: Key,
    priority: "normal",
    tasks: [
      { task: "Möbel aufbauen und einrichten" },
      { task: "Umzugskartons auspacken (systematisch Raum für Raum)" },
      { task: "Ummeldung bei der Gemeinde (innerhalb 14 Tagen!)", tip: "In der Schweiz Pflicht!" },
      { task: "Neue Nachbarn begrüssen" },
      { task: "Restliche Adressänderungen abschliessen" },
      { task: "Kaution der alten Wohnung prüfen und einfordern" },
    ]
  },
];

const getPriorityStyles = (priority: TimelinePhase["priority"]) => {
  switch (priority) {
    case "critical":
      return "border-l-red-500 bg-red-50/50 dark:bg-red-950/20";
    case "important":
      return "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20";
    default:
      return "border-l-primary bg-primary/5";
  }
};

const getPriorityBadge = (priority: TimelinePhase["priority"]) => {
  switch (priority) {
    case "critical":
      return <Badge variant="destructive" className="text-xs">Kritisch</Badge>;
    case "important":
      return <Badge className="bg-amber-500 text-xs">Wichtig</Badge>;
    default:
      return null;
  }
};

export default function Zeitplan() {
  return (
    <>
      <OptimizedSEO
        title="Umzug Zeitplan & Ablauf | Was wann erledigen | Umzugscheck.ch"
        description="Der perfekte Umzugs-Zeitplan: Was 8 Wochen, 4 Wochen, 1 Woche vorher zu tun ist. Schritt-für-Schritt Anleitung für einen stressfreien Umzug in der Schweiz."
        canonicalUrl="https://www.umzugscheck.ch/ratgeber/zeitplan"
        keywords="umzug zeitplan, umzug ablauf, umzug checkliste, umzug schweiz, wann was erledigen"
      />
      
      <div className="min-h-screen bg-gradient-elegant">
        {/* Hero */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-95" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                <Clock className="w-3 h-3 mr-1" />
                Zeitplan & Ablauf
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Der perfekte Umzugs-Zeitplan
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Was wann erledigt werden muss – von 8 Wochen vorher bis nach dem Einzug. 
                So behalten Sie den Überblick.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/umzugsofferten">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
                    Jetzt Offerten erhalten
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/ratgeber/umzugscheckliste-download">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                    Checkliste herunterladen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Ihr Umzug Schritt für Schritt
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Folgen Sie diesem bewährten Zeitplan und vergessen Sie nichts Wichtiges.
              </p>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />
                
                <div className="space-y-6">
                  {timelinePhases.map((phase, idx) => (
                    <Card 
                      key={idx} 
                      className={`relative border-l-4 ${getPriorityStyles(phase.priority)} overflow-hidden`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-[2.35rem] top-6 w-4 h-4 rounded-full bg-primary border-4 border-background hidden sm:block" />
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <CardTitle className="flex items-center gap-3 text-lg">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <phase.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-primary block">{phase.weeks}</span>
                              <span>{phase.title}</span>
                            </div>
                          </CardTitle>
                          {getPriorityBadge(phase.priority)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="grid sm:grid-cols-2 gap-3">
                          {phase.tasks.map((item, taskIdx) => (
                            <li key={taskIdx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="text-sm">{item.task}</span>
                                {item.tip && (
                                  <span className="block text-xs text-muted-foreground mt-0.5">
                                    💡 {item.tip}
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pro Tips */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">
                Profi-Tipps für Ihren Umzug
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="font-bold mb-2">Früh buchen</h3>
                    <p className="text-sm text-muted-foreground">
                      Buchen Sie Ihre Umzugsfirma mindestens 4-6 Wochen im Voraus. 
                      Zu Monatsende sind gute Firmen schnell ausgebucht.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-bold mb-2">Systematisch packen</h3>
                    <p className="text-sm text-muted-foreground">
                      Beschriften Sie jeden Karton mit Zimmer und Inhalt. 
                      Das erleichtert das Auspacken enorm.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold mb-2">Mehrere Offerten</h3>
                    <p className="text-sm text-muted-foreground">
                      Holen Sie mindestens 3 Offerten ein und vergleichen Sie 
                      nicht nur Preise, sondern auch Leistungen.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Bereit für Ihren Umzug?
              </h2>
              <p className="text-muted-foreground mb-6">
                Lassen Sie sich von geprüften Umzugsfirmen unverbindliche Offerten erstellen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/umzugsofferten">
                  <Button size="lg">
                    Gratis Offerten erhalten
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/ratgeber/umzugscheckliste-download">
                  <Button size="lg" variant="outline">
                    Checkliste PDF
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
