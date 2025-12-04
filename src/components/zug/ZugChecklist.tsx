/**
 * Zug Checklist Component
 * #69-78: Interactive moving checklist with progress
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, ChevronDown, ChevronUp,
  Calendar, Clock, AlertTriangle, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

interface ChecklistCategory {
  title: string;
  timing: string;
  icon: React.ElementType;
  items: ChecklistItem[];
}

const initialChecklist: ChecklistCategory[] = [
  {
    title: "8-4 Wochen vorher",
    timing: "Frühzeitig planen",
    icon: Calendar,
    items: [
      { id: "1", text: "Umzugsfirmen vergleichen", completed: false, priority: "high" },
      { id: "2", text: "Wohnung kündigen / neue Wohnung bestätigen", completed: false, priority: "high" },
      { id: "3", text: "Urlaub für Umzugstag beantragen", completed: false, priority: "medium" },
      { id: "4", text: "Parkbewilligung bei Gemeinde beantragen", completed: false, priority: "high" },
      { id: "5", text: "Schule/Kindergarten informieren", completed: false, priority: "medium" },
    ],
  },
  {
    title: "3-2 Wochen vorher",
    timing: "Vorbereitung",
    icon: Clock,
    items: [
      { id: "6", text: "Umzugskartons besorgen", completed: false, priority: "high" },
      { id: "7", text: "Aussortieren und entrümpeln", completed: false, priority: "medium" },
      { id: "8", text: "Adressänderung bei Post melden", completed: false, priority: "high" },
      { id: "9", text: "Versicherungen informieren", completed: false, priority: "medium" },
      { id: "10", text: "Internet/Telefon ummelden", completed: false, priority: "high" },
    ],
  },
  {
    title: "1 Woche vorher",
    timing: "Letzte Details",
    icon: AlertTriangle,
    items: [
      { id: "11", text: "Wertgegenstände separat packen", completed: false, priority: "high" },
      { id: "12", text: "Kühlschrank abtauen", completed: false, priority: "medium" },
      { id: "13", text: "Nachbarn informieren", completed: false, priority: "low" },
      { id: "14", text: "Reinigungsfirma bestätigen", completed: false, priority: "high" },
      { id: "15", text: "Umzugshelfer Snacks organisieren", completed: false, priority: "low" },
    ],
  },
];

export const ZugChecklist = () => {
  const [checklist, setChecklist] = useState(initialChecklist);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);

  const toggleItem = (categoryIndex: number, itemId: string) => {
    setChecklist(prev => 
      prev.map((cat, i) => 
        i === categoryIndex
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : cat
      )
    );
  };

  const totalItems = checklist.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedItems = checklist.reduce(
    (acc, cat) => acc + cat.items.filter(item => item.completed).length,
    0
  );
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-amber-500";
      case "low": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge variant="outline" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Interaktiv
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Deine Umzugs-Checkliste
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Behalte den Überblick – nichts vergessen bei deinem Umzug im Kanton Zug
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Fortschritt</span>
            <span className="text-sm text-muted-foreground">
              {completedItems} von {totalItems} erledigt
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <p className="text-center mt-2 text-sm text-muted-foreground">
            {progressPercent === 100 
              ? "🎉 Alles erledigt! Du bist bereit für den Umzug!"
              : `${progressPercent}% geschafft`
            }
          </p>
        </motion.div>

        {/* Checklist Categories */}
        <div className="max-w-2xl mx-auto space-y-4">
          {checklist.map((category, categoryIndex) => {
            const categoryCompleted = category.items.filter(i => i.completed).length;
            const isExpanded = expandedCategory === categoryIndex;

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="bg-background rounded-xl border border-border/50 overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : categoryIndex)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">{category.title}</h3>
                      <p className="text-xs text-muted-foreground">{category.timing}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">
                      {categoryCompleted}/{category.items.length}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Category Items */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2">
                        {category.items.map((item) => (
                          <motion.button
                            key={item.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleItem(categoryIndex, item.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              item.completed 
                                ? "bg-green-50 dark:bg-green-950/20" 
                                : "bg-muted/30 hover:bg-muted/50"
                            }`}
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <Circle className={`w-5 h-5 flex-shrink-0 ${getPriorityColor(item.priority)}`} />
                            )}
                            <span className={`text-sm text-left ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                              {item.text}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Download CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Button variant="outline">
            Checkliste als PDF herunterladen
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
