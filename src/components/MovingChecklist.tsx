import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList, ChevronDown, ChevronUp, Sparkles, Download, Calendar } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const STORAGE_KEY = "umzugscheck_checklist";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  daysBeforeMove: number;
}

interface ChecklistCategory {
  id: string;
  title: string;
  icon: string;
  items: ChecklistItem[];
}

const defaultChecklist: ChecklistCategory[] = [
  {
    id: "8-weeks",
    title: "8 Wochen vorher",
    icon: "📋",
    items: [
      { id: "1", label: "Umzugsfirmen vergleichen und buchen", checked: false, daysBeforeMove: 56 },
      { id: "2", label: "Mietvertrag kündigen", checked: false, daysBeforeMove: 56 },
      { id: "3", label: "Inventar erstellen", checked: false, daysBeforeMove: 56 },
      { id: "4", label: "Entrümpelung planen", checked: false, daysBeforeMove: 56 },
    ],
  },
  {
    id: "4-weeks",
    title: "4 Wochen vorher",
    icon: "📦",
    items: [
      { id: "5", label: "Umzugskartons besorgen", checked: false, daysBeforeMove: 28 },
      { id: "6", label: "Adressänderungen vorbereiten", checked: false, daysBeforeMove: 28 },
      { id: "7", label: "Versicherungen prüfen", checked: false, daysBeforeMove: 28 },
      { id: "8", label: "Nachsendeauftrag bei der Post", checked: false, daysBeforeMove: 28 },
    ],
  },
  {
    id: "2-weeks",
    title: "2 Wochen vorher",
    icon: "🏠",
    items: [
      { id: "9", label: "Mit Packen beginnen", checked: false, daysBeforeMove: 14 },
      { id: "10", label: "Wohnungsübergabe planen", checked: false, daysBeforeMove: 14 },
      { id: "11", label: "Reinigung organisieren", checked: false, daysBeforeMove: 14 },
      { id: "12", label: "Schlüsselübergabe koordinieren", checked: false, daysBeforeMove: 14 },
    ],
  },
  {
    id: "1-week",
    title: "1 Woche vorher",
    icon: "✅",
    items: [
      { id: "13", label: "Umzugsdetails mit Firma bestätigen", checked: false, daysBeforeMove: 7 },
      { id: "14", label: "Wertgegenstände separat verpacken", checked: false, daysBeforeMove: 7 },
      { id: "15", label: "Kühlschrank abtauen", checked: false, daysBeforeMove: 7 },
      { id: "16", label: "Notfallkoffer packen", checked: false, daysBeforeMove: 7 },
    ],
  },
];

const MovingChecklist = () => {
  const [checklist, setChecklist] = useState<ChecklistCategory[]>(defaultChecklist);
  const [openCategories, setOpenCategories] = useState<string[]>(["8-weeks"]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setChecklist(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing checklist:", e);
      }
    }
  }, []);

  const saveChecklist = (updated: ChecklistCategory[]) => {
    setChecklist(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const toggleItem = (categoryId: string, itemId: string) => {
    const updated = checklist.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item => 
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      }
      return cat;
    });
    saveChecklist(updated);
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const totalItems = checklist.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedItems = checklist.reduce(
    (acc, cat) => acc + cat.items.filter(item => item.checked).length, 
    0
  );
  const progress = (completedItems / totalItems) * 100;

  const exportChecklist = () => {
    const text = checklist.map(cat => {
      const items = cat.items.map(item => 
        `  ${item.checked ? "✅" : "⬜"} ${item.label}`
      ).join("\n");
      return `${cat.icon} ${cat.title}\n${items}`;
    }).join("\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "umzugs-checkliste.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-2 bg-white shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="w-5 h-5 text-primary" />
            Umzugs-Checkliste
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={exportChecklist}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fortschritt</span>
            <Badge variant="secondary">
              {completedItems} / {totalItems} erledigt
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {checklist.map(category => {
          const categoryCompleted = category.items.filter(i => i.checked).length;
          const isOpen = openCategories.includes(category.id);
          
          return (
            <Collapsible 
              key={category.id} 
              open={isOpen} 
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span className="font-medium">{category.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {categoryCompleted}/{category.items.length}
                    </Badge>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="space-y-2 pl-4">
                  {category.items.map(item => (
                    <label 
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-muted/30 cursor-pointer"
                    >
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(category.id, item.id)}
                      />
                      <span className={item.checked ? "line-through text-muted-foreground" : ""}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {progress === 100 && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
            <Sparkles className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="font-medium text-green-800">Alles erledigt!</p>
            <p className="text-sm text-green-600">Sie sind bereit für Ihren Umzug</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MovingChecklist;
