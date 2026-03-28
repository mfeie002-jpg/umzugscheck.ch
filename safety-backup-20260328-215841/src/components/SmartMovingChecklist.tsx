import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ChecklistItem {
  id: string;
  task: string;
  daysBeforeMove: number;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
  costImpact?: string;
}

const checklistItems: ChecklistItem[] = [
  { id: "1", task: "Umzugsfirmen vergleichen und buchen", daysBeforeMove: 60, priority: "high", estimatedTime: "2h", costImpact: "Frühe Buchung spart 15-20%" },
  { id: "2", task: "Kündigungsfrist Wohnung prüfen", daysBeforeMove: 90, priority: "high", estimatedTime: "30min" },
  { id: "3", task: "Nachsendeauftrag bei Post einrichten", daysBeforeMove: 30, priority: "high", estimatedTime: "15min" },
  { id: "4", task: "Versorgungsunternehmen informieren", daysBeforeMove: 45, priority: "high", estimatedTime: "1h" },
  { id: "5", task: "Umzugskartons organisieren", daysBeforeMove: 21, priority: "medium", estimatedTime: "1h", costImpact: "Eigene Kartons sparen CHF 200" },
  { id: "6", task: "Möbel ausmessen", daysBeforeMove: 30, priority: "medium", estimatedTime: "45min" },
  { id: "7", task: "Endreinigung buchen", daysBeforeMove: 14, priority: "high", estimatedTime: "30min" },
  { id: "8", task: "Parkbewilligung beantragen", daysBeforeMove: 21, priority: "medium", estimatedTime: "30min", costImpact: "Verhindert Verzögerungen" },
  { id: "9", task: "Wertgegenstände separat verpacken", daysBeforeMove: 7, priority: "high", estimatedTime: "2h" },
  { id: "10", task: "Wichtige Dokumente sichern", daysBeforeMove: 7, priority: "high", estimatedTime: "1h" },
];

export const SmartMovingChecklist = () => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleTask = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const completionRate = (completed.size / checklistItems.length) * 100;
  const highPriorityRemaining = checklistItems.filter(
    (item) => item.priority === "high" && !completed.has(item.id)
  ).length;

  const sortedItems = [...checklistItems].sort((a, b) => b.daysBeforeMove - a.daysBeforeMove);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Intelligente Umzugs-Checkliste
        </CardTitle>
        <CardDescription>
          Zeitoptimierte Aufgaben mit Kostenauswirkungen
        </CardDescription>

        {/* Progress */}
        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Fortschritt</span>
            <span className="font-bold">{completed.size}/{checklistItems.length}</span>
          </div>
          <Progress value={completionRate} />
          {highPriorityRemaining > 0 && (
            <div className="flex items-center gap-2 text-xs text-orange-600">
              <AlertTriangle className="w-3 h-3" />
              <span>{highPriorityRemaining} wichtige Aufgaben offen</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border ${
              completed.has(item.id) ? "bg-muted/50 opacity-60" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={completed.has(item.id)}
                onCheckedChange={() => toggleTask(item.id)}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className={`font-medium ${completed.has(item.id) ? "line-through" : ""}`}>
                    {item.task}
                  </span>
                  <Badge
                    variant={
                      item.priority === "high" ? "destructive" :
                      item.priority === "medium" ? "default" :
                      "secondary"
                    }
                    className="text-xs flex-shrink-0"
                  >
                    {item.priority === "high" ? "Wichtig" : item.priority === "medium" ? "Mittel" : "Niedrig"}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.daysBeforeMove} Tage vorher
                  </span>
                  <span>⏱ {item.estimatedTime}</span>
                </div>

                {item.costImpact && (
                  <div className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    💰 {item.costImpact}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
