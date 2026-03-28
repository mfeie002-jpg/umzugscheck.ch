import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle, Calendar, FileText, Key, Truck, Phone, Package } from "lucide-react";

const checklistItems = [
  { icon: Calendar, text: "Umzugstermin festlegen", done: true, tip: "3+ Monate vorher" },
  { icon: FileText, text: "Parkbewilligung Stadt Bern beantragen", done: false, tip: "2 Wochen vorher" },
  { icon: Key, text: "Alte Wohnung kündigen", done: true, tip: "3 Monate Frist" },
  { icon: Package, text: "Umzugskartons besorgen", done: false, tip: "Ca. 30 pro Zimmer" },
  { icon: Phone, text: "Adressänderungen melden", done: false, tip: "Post, Versicherungen" },
  { icon: Truck, text: "Umzugsfirma buchen", done: false, tip: "Früh reservieren!" },
];

export const BernChecklist = () => (
  <Card className="border-2 border-accent/20">
    <CardContent className="p-6">
      <h3 className="font-semibold text-lg mb-4">Umzugscheckliste Bern</h3>
      <div className="space-y-3">
        {checklistItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`flex items-start gap-3 p-2 rounded-lg ${item.done ? 'bg-success/5' : 'bg-muted/30'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-success/20' : 'bg-muted'}`}>
                {item.done ? <CheckCircle className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-sm font-medium ${item.done ? 'line-through text-muted-foreground' : ''}`}>{item.text}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.tip}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">Spezielle Tipps für Umzüge in der Bundesstadt</p>
    </CardContent>
  </Card>
);
