import { useState } from "react";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Download, CheckCircle, Calendar, Clock, FileText, 
  Home, Truck, ClipboardList, ArrowRight, Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const checklistSections = [
  {
    title: "8 Wochen vorher",
    icon: Calendar,
    tasks: [
      "Umzugstermin festlegen",
      "Umzugsfirmen vergleichen & buchen",
      "Kündigung alte Wohnung einreichen",
      "Urlaub für Umzugstag beantragen",
      "Entrümpeln & Ausmisten beginnen",
    ]
  },
  {
    title: "4 Wochen vorher",
    icon: ClipboardList,
    tasks: [
      "Nachsendeauftrag bei der Post",
      "Adressänderungen vorbereiten",
      "Verpackungsmaterial besorgen",
      "Sperrmüll anmelden",
      "Handwerker für neue Wohnung buchen",
    ]
  },
  {
    title: "2 Wochen vorher",
    icon: Home,
    tasks: [
      "Nicht-Alltags-Gegenstände einpacken",
      "Möbel-Abbau planen",
      "Reinigung alte Wohnung organisieren",
      "Parkverbotszone beantragen",
      "Schlüsselübergabe vereinbaren",
    ]
  },
  {
    title: "1 Woche vorher",
    icon: Truck,
    tasks: [
      "Restliche Sachen einpacken",
      "Kühlschrank abtauen",
      "Umzugskartons beschriften",
      "Wertsachen separat verpacken",
      "Notfallkoffer packen",
    ]
  },
  {
    title: "Am Umzugstag",
    icon: CheckCircle,
    tasks: [
      "Zählerstände ablesen",
      "Wohnung auf Schäden prüfen",
      "Übergabeprotokoll erstellen",
      "Schlüssel übergeben",
      "Neue Wohnung inspizieren",
    ]
  },
];

export default function UmzugschecklisteDownload() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Bitte E-Mail eingeben");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate download
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Checkliste wird heruntergeladen!", {
      description: "Sie erhalten die PDF auch per E-Mail."
    });
    setIsSubmitting(false);
  };

  return (
    <>
      <OptimizedSEO
        title="Umzugscheckliste PDF Download | Kostenlos | Umzugscheck.ch"
        description="Kostenlose Umzugscheckliste als PDF herunterladen. Alles, was Sie vor, während und nach dem Umzug erledigen müssen – übersichtlich und zum Abhaken."
        canonicalUrl="https://www.umzugscheck.ch/ratgeber/umzugscheckliste-download/"
      />
      
      <div className="min-h-screen bg-gradient-elegant">
        {/* Hero */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-95" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                <Download className="w-3 h-3 mr-1" />
                Kostenloser Download
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Die ultimative Umzugscheckliste
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Vergessen Sie nichts mehr! Unsere detaillierte Checkliste führt Sie Schritt für Schritt durch Ihren Umzug.
              </p>
              
              {/* Download Form */}
              <Card className="max-w-md mx-auto bg-white/95 backdrop-blur">
                <CardContent className="p-6">
                  <form onSubmit={handleDownload} className="space-y-4">
                    <div className="flex items-center gap-2 text-left text-sm text-muted-foreground mb-2">
                      <FileText className="w-4 h-4" />
                      PDF-Checkliste mit 50+ Aufgaben
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Ihre E-Mail-Adresse"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "..." : <Download className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Kein Spam. Wir senden nur die Checkliste.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Preview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Was ist in der Checkliste enthalten?
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Unsere Umzugscheckliste deckt alle wichtigen Phasen ab – von 8 Wochen vor dem Umzug bis zum Einzug in Ihr neues Zuhause.
              </p>
              
              <div className="space-y-6">
                {checklistSections.map((section, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-3">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <section.icon className="w-5 h-5 text-primary" />
                        </div>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {section.tasks.map((task, taskIdx) => (
                          <li key={taskIdx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Umzug planen lassen?
              </h2>
              <p className="text-muted-foreground mb-6">
                Sparen Sie Zeit und Stress. Vergleichen Sie jetzt kostenlos Umzugsofferten von geprüften Firmen.
              </p>
              <Link to="/umzugsofferten">
                <Button size="lg">
                  Offerten vergleichen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
