import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ChevronDown, Car, FileText, Clock, Trash2, Shield, MapPin } from "lucide-react";

const tips = [
  { icon: Car, title: "Parkbewilligung beantragen", content: "In Zürich ist eine Parkbewilligung beim Tiefbauamt erforderlich. Beantragen Sie diese mindestens 1 Woche im Voraus. Kosten: ca. CHF 50-100.", category: "Administrativ" },
  { icon: FileText, title: "An-/Abmeldung Einwohnerkontrolle", content: "Melden Sie sich innerhalb von 14 Tagen beim Kreisbüro Ihrer neuen Adresse an. Online-Voranmeldung möglich.", category: "Administrativ" },
  { icon: Clock, title: "Beste Umzugszeiten", content: "Vermeiden Sie Monatsenden und Wochenenden. In Zürich sind Dienstag bis Donnerstag am günstigsten.", category: "Timing" },
  { icon: Trash2, title: "Entsorgung Zürich", content: "ERZ (Entsorgung + Recycling Zürich) bietet Sperrmüllabholung. Cargo-Tram und Ökihöfe für grosse Mengen nutzen.", category: "Praktisch" },
  { icon: Shield, title: "Versicherung prüfen", content: "Prüfen Sie Ihre Hausrat- und Transportversicherung. Die meisten Umzugsfirmen sind zusätzlich versichert.", category: "Sicherheit" },
  { icon: MapPin, title: "Quartier kennenlernen", content: "Informieren Sie sich über Parkzonen (blaue/weisse Zone), öffentliche Verkehrsmittel und lokale Geschäfte.", category: "Praktisch" },
];

export const ZuerichMovingTips = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl md:text-3xl font-bold">Umzugstipps für Zürich</h2>
          </div>
          <p className="text-muted-foreground">Lokale Insider-Tipps für Ihren Umzug</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {tips.map((tip, i) => {
            const Icon = tip.icon;
            const isExpanded = expanded === i;

            return (
              <motion.div key={i} layout>
                <Card
                  className={`cursor-pointer transition-all ${isExpanded ? "border-primary shadow-lg" : "hover:border-primary/30"}`}
                  onClick={() => setExpanded(isExpanded ? null : i)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">{tip.category}</span>
                          <h3 className="font-semibold text-sm">{tip.title}</h3>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-muted-foreground pt-2 border-t">{tip.content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
