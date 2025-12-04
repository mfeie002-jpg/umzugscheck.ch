import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";

const checklistItems = [
  { id: 1, category: "4 Wochen vorher", items: [
    { text: "Parkbewilligung beim Tiefbauamt Zürich beantragen", priority: "high" },
    { text: "Umzugsfirmen vergleichen und buchen", priority: "high" },
    { text: "Kündigungsfrist Wohnung prüfen", priority: "medium" },
    { text: "Versicherungen informieren", priority: "medium" },
  ]},
  { id: 2, category: "2 Wochen vorher", items: [
    { text: "Adressänderung beim Kreisbüro vorbereiten", priority: "high" },
    { text: "Post-Nachsendung einrichten", priority: "medium" },
    { text: "Kartons und Verpackungsmaterial besorgen", priority: "medium" },
    { text: "Nicht benötigte Gegenstände entsorgen (ERZ)", priority: "low" },
  ]},
  { id: 3, category: "1 Woche vorher", items: [
    { text: "Schlüsselübergabe planen", priority: "high" },
    { text: "Zählerstände notieren", priority: "medium" },
    { text: "Nachbarn informieren", priority: "low" },
    { text: "Wichtige Dokumente griffbereit packen", priority: "medium" },
  ]},
];

export const ZuerichChecklist = () => {
  const [checked, setChecked] = useState<string[]>([]);

  const totalItems = checklistItems.flatMap(c => c.items).length;
  const progress = (checked.length / totalItems) * 100;

  const toggleItem = (text: string) => {
    setChecked(prev => prev.includes(text) ? prev.filter(i => i !== text) : [...prev, text]);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "medium": return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Umzugs-Checkliste Zürich</h2>
            <p className="text-muted-foreground mb-4">Interaktive Checkliste für Ihren Umzug in Zürich</p>
            <div className="flex items-center justify-center gap-4">
              <Progress value={progress} className="w-48 h-2" />
              <span className="text-sm font-medium">{Math.round(progress)}% erledigt</span>
            </div>
          </div>

          <div className="space-y-6">
            {checklistItems.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm text-primary">
                      {category.id}
                    </span>
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.items.map((item) => {
                      const isChecked = checked.includes(item.text);
                      return (
                        <motion.label
                          key={item.text}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isChecked ? "bg-success/10" : "hover:bg-muted/50"}`}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleItem(item.text)}
                          />
                          <span className={`flex-1 text-sm ${isChecked ? "line-through text-muted-foreground" : ""}`}>
                            {item.text}
                          </span>
                          {!isChecked && getPriorityIcon(item.priority)}
                          {isChecked && <CheckCircle className="h-4 w-4 text-success" />}
                        </motion.label>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
