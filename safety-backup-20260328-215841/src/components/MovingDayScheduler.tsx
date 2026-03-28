import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, Clock, Plus, Trash2, ChevronUp, ChevronDown,
  Coffee, Truck, Key, Package, Users, CheckCircle
} from "lucide-react";

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  duration: number;
  icon: React.ReactNode;
  completed: boolean;
  people?: string[];
}

const defaultSchedule: ScheduleItem[] = [
  { id: "1", time: "06:30", title: "Aufstehen & Frühstück", description: "Letzte Mahlzeit in der alten Wohnung", duration: 30, icon: <Coffee className="h-4 w-4" />, completed: false },
  { id: "2", time: "07:00", title: "Letzte Kontrolle", description: "Zählerstände notieren, Fenster schliessen", duration: 30, icon: <CheckCircle className="h-4 w-4" />, completed: false },
  { id: "3", time: "07:30", title: "Umzugsfirma Ankunft", description: "Team begrüssen, Ablauf besprechen", duration: 30, icon: <Truck className="h-4 w-4" />, completed: false, people: ["Umzugsteam"] },
  { id: "4", time: "08:00", title: "Beladung Start", description: "Grosse Möbel zuerst, dann Kartons", duration: 180, icon: <Package className="h-4 w-4" />, completed: false, people: ["Umzugsteam", "Sie"] },
  { id: "5", time: "11:00", title: "Transport zur neuen Wohnung", description: "Fahrt und Pause einplanen", duration: 60, icon: <Truck className="h-4 w-4" />, completed: false },
  { id: "6", time: "12:00", title: "Schlüsselübergabe neue Wohnung", description: "Protokoll unterschreiben, Zähler ablesen", duration: 30, icon: <Key className="h-4 w-4" />, completed: false },
  { id: "7", time: "12:30", title: "Mittagspause", description: "Stärkung für alle Helfer", duration: 30, icon: <Coffee className="h-4 w-4" />, completed: false, people: ["Alle"] },
  { id: "8", time: "13:00", title: "Entladung & Einrichten", description: "Möbel platzieren, Kartons verteilen", duration: 180, icon: <Package className="h-4 w-4" />, completed: false, people: ["Umzugsteam", "Sie"] },
  { id: "9", time: "16:00", title: "Verabschiedung Umzugsteam", description: "Protokoll unterschreiben, Trinkgeld", duration: 30, icon: <Users className="h-4 w-4" />, completed: false },
  { id: "10", time: "16:30", title: "Schlüsselrückgabe alte Wohnung", description: "Übergabeprotokoll, Reinigungsabnahme", duration: 60, icon: <Key className="h-4 w-4" />, completed: false },
  { id: "11", time: "18:00", title: "Erste Kartons auspacken", description: "Wichtiges zuerst: Bett, Küche, Bad", duration: 120, icon: <Package className="h-4 w-4" />, completed: false },
];

export const MovingDayScheduler = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(defaultSchedule);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemTime, setNewItemTime] = useState("");

  const toggleComplete = (id: string) => {
    setSchedule(schedule.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addItem = () => {
    if (!newItemTitle || !newItemTime) return;
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      time: newItemTime,
      title: newItemTitle,
      description: "",
      duration: 30,
      icon: <CheckCircle className="h-4 w-4" />,
      completed: false
    };
    setSchedule([...schedule, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    setNewItemTitle("");
    setNewItemTime("");
  };

  const removeItem = (id: string) => {
    setSchedule(schedule.filter(item => item.id !== id));
  };

  const completedCount = schedule.filter(s => s.completed).length;
  const progress = Math.round((completedCount / schedule.length) * 100);

  const getCurrentItem = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return schedule.find(item => !item.completed && item.time <= currentTime);
  };

  const currentItem = getCurrentItem();

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Umzugstag Zeitplan
          </CardTitle>
          <Badge variant="secondary">
            {completedCount}/{schedule.length} erledigt
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Add New Item */}
        <div className="flex gap-2">
          <Input
            type="time"
            value={newItemTime}
            onChange={(e) => setNewItemTime(e.target.value)}
            className="w-24"
          />
          <Input
            placeholder="Neue Aufgabe..."
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addItem} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Schedule Timeline */}
        <ScrollArea className="h-[450px]">
          <div className="space-y-1">
            {schedule.map((item, index) => {
              const isCurrent = currentItem?.id === item.id;
              
              return (
                <div
                  key={item.id}
                  className={`relative pl-8 pb-4 ${
                    index !== schedule.length - 1 ? 'border-l-2 border-border ml-4' : 'ml-4'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                    item.completed 
                      ? 'bg-green-500 border-green-500' 
                      : isCurrent
                      ? 'bg-primary border-primary animate-pulse'
                      : 'bg-background border-border'
                  }`} />

                  {/* Content */}
                  <div className={`p-4 rounded-lg transition-colors ${
                    item.completed 
                      ? 'bg-green-50/50 dark:bg-green-950/30' 
                      : isCurrent
                      ? 'bg-primary/5 border border-primary/30'
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleComplete(item.id)}
                          className="mt-1"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.time}
                            </Badge>
                            {isCurrent && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                Jetzt
                              </Badge>
                            )}
                          </div>
                          <h4 className={`font-medium ${
                            item.completed ? 'line-through text-muted-foreground' : ''
                          }`}>
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          )}
                          {item.people && item.people.length > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {item.people.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Quick Tips */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm">
          <p className="text-blue-700 dark:text-blue-400">
            💡 Tipp: Halten Sie wichtige Telefonnummern griffbereit und packen Sie 
            eine "Notfall-Tasche" mit dem Nötigsten für die erste Nacht.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovingDayScheduler;
