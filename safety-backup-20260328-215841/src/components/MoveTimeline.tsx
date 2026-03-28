import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Circle, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  category: "planning" | "packing" | "moving" | "settling";
}

const DEFAULT_TIMELINE: TimelineItem[] = [
  { id: "1", title: "Umzugstermin festlegen", description: "Datum und Uhrzeit mit der Umzugsfirma vereinbaren", dueDate: "4 Wochen vorher", completed: false, category: "planning" },
  { id: "2", title: "Umzugskartons besorgen", description: "Kartons, Packpapier und Klebeband kaufen", dueDate: "3 Wochen vorher", completed: false, category: "packing" },
  { id: "3", title: "Keller & Estrich entrümpeln", description: "Nicht benötigte Gegenstände entsorgen oder verkaufen", dueDate: "3 Wochen vorher", completed: false, category: "packing" },
  { id: "4", title: "Adressänderungen melden", description: "Post, Versicherungen, Bank informieren", dueDate: "2 Wochen vorher", completed: false, category: "planning" },
  { id: "5", title: "Zimmer einpacken", description: "Systematisch Raum für Raum einpacken", dueDate: "1 Woche vorher", completed: false, category: "packing" },
  { id: "6", title: "Kühlschrank abtauen", description: "Mindestens 24h vor dem Umzug", dueDate: "1 Tag vorher", completed: false, category: "packing" },
  { id: "7", title: "Umzugstag", description: "Möbel und Kartons transportieren", dueDate: "Umzugstag", completed: false, category: "moving" },
  { id: "8", title: "Alte Wohnung reinigen", description: "Professionelle Endreinigung durchführen", dueDate: "Nach Umzug", completed: false, category: "settling" },
];

const categoryColors = {
  planning: "bg-blue-500",
  packing: "bg-amber-500",
  moving: "bg-green-500",
  settling: "bg-purple-500",
};

const categoryLabels = {
  planning: "Planung",
  packing: "Packen",
  moving: "Umzug",
  settling: "Einrichten",
};

export const MoveTimeline = () => {
  const [items, setItems] = useState<TimelineItem[]>(DEFAULT_TIMELINE);
  
  const completedCount = items.filter(item => item.completed).length;
  const progress = (completedCount / items.length) * 100;

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Umzugs-Timeline
          </CardTitle>
          <Badge variant="outline">
            {completedCount}/{items.length} erledigt
          </Badge>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer
              ${item.completed ? "bg-muted/50 border-muted" : "bg-background border-border/50 hover:border-primary/30"}`}
            onClick={() => toggleItem(item.id)}
          >
            <div className="mt-0.5">
              {item.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${categoryColors[item.category]}`} />
                <span className="text-xs text-muted-foreground">
                  {categoryLabels[item.category]}
                </span>
              </div>
              <p className={`font-medium text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {item.dueDate}
            </div>
          </motion.div>
        ))}
        
        <Button variant="outline" className="w-full mt-4" size="sm">
          Vollständige Checkliste
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default MoveTimeline;
