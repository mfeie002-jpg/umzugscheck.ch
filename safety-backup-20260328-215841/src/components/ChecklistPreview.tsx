import { Link } from "react-router-dom";
import { ArrowRight, CheckSquare, Download, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import AnimatedSection from "./AnimatedSection";

const checklistItems = [
  { week: "8 Wochen vorher", tasks: ["Mietvertrag unterschreiben", "Umzugsfirma buchen", "Kündigung versenden"] },
  { week: "4 Wochen vorher", tasks: ["Mit Packen beginnen", "Adressänderungen", "Nachsendeauftrag"] },
  { week: "1 Woche vorher", tasks: ["Letzte Kartons packen", "Kühlschrank abtauen", "Schlüssel bereit"] },
  { week: "Umzugstag", tasks: ["Zählerstände notieren", "Wohnungsübergabe", "Einziehen!"] }
];

export default function ChecklistPreview() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full mb-4">
              Kostenlos
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
              Die ultimative <span className="text-gradient">Umzugscheckliste</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Vergessen Sie nichts! Unsere Experten haben eine umfassende Checkliste 
              zusammengestellt, die Sie Schritt für Schritt durch Ihren Umzug führt.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <CheckSquare className="h-5 w-5 text-alpine" />
                <span>50+ Aufgaben</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-5 w-5 text-alpine" />
                <span>8-Wochen-Plan</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Download className="h-5 w-5 text-alpine" />
                <span>PDF Download</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/checklist">
                <Button size="lg" className="min-h-[52px]">
                  Zur Checkliste
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/guide/umzugscheckliste-schweiz">
                <Button size="lg" variant="outline" className="min-h-[52px]">
                  Im Blog lesen
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-alpine" />
                Vorschau
              </h3>
              <div className="space-y-6">
                {checklistItems.map((item, index) => (
                  <div key={index} className="relative pl-8 pb-6 border-l-2 border-alpine/20 last:border-0 last:pb-0">
                    <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-alpine -translate-x-[9px]" />
                    <p className="font-semibold text-sm text-alpine mb-2">{item.week}</p>
                    <ul className="space-y-1">
                      {item.tasks.map((task, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckSquare className="h-3 w-3" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
