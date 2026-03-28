import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MapPin, Mail, Building, Users, Heart, Briefcase,
  CreditCard, Car, Newspaper, Package, CheckCircle, Copy
} from "lucide-react";
import { toast } from "sonner";

interface AddressChange {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  notes?: string;
  link?: string;
}

const addressChanges: AddressChange[] = [
  { id: "1", name: "Einwohnerkontrolle", icon: <Building className="h-4 w-4" />, category: "Behörden", priority: "high", completed: false, notes: "Innerhalb 14 Tagen nach Umzug" },
  { id: "2", name: "Strassenverkehrsamt", icon: <Car className="h-4 w-4" />, category: "Behörden", priority: "high", completed: false, notes: "Fahrzeugschein anpassen" },
  { id: "3", name: "Post Nachsendeauftrag", icon: <Mail className="h-4 w-4" />, category: "Post", priority: "high", completed: false },
  { id: "4", name: "Arbeitgeber", icon: <Briefcase className="h-4 w-4" />, category: "Arbeit", priority: "high", completed: false },
  { id: "5", name: "Krankenkasse", icon: <Heart className="h-4 w-4" />, category: "Versicherungen", priority: "high", completed: false },
  { id: "6", name: "Hausratversicherung", icon: <Package className="h-4 w-4" />, category: "Versicherungen", priority: "high", completed: false },
  { id: "7", name: "Bank(en)", icon: <CreditCard className="h-4 w-4" />, category: "Finanzen", priority: "high", completed: false },
  { id: "8", name: "Steuerverwaltung", icon: <Building className="h-4 w-4" />, category: "Behörden", priority: "medium", completed: false },
  { id: "9", name: "AHV/IV Stelle", icon: <Users className="h-4 w-4" />, category: "Behörden", priority: "medium", completed: false },
  { id: "10", name: "Zeitungsabos", icon: <Newspaper className="h-4 w-4" />, category: "Abos", priority: "low", completed: false },
  { id: "11", name: "Online-Shops", icon: <Package className="h-4 w-4" />, category: "Online", priority: "low", completed: false },
  { id: "12", name: "Vereine/Mitgliedschaften", icon: <Users className="h-4 w-4" />, category: "Sonstiges", priority: "low", completed: false },
];

export const AddressChangeHelper = () => {
  const [changes, setChanges] = useState<AddressChange[]>(addressChanges);
  const [newAddress, setNewAddress] = useState({
    street: "",
    zip: "",
    city: ""
  });

  const toggleChange = (id: string) => {
    setChanges(changes.map(c =>
      c.id === id ? { ...c, completed: !c.completed } : c
    ));
  };

  const copyAddress = () => {
    const address = `${newAddress.street}\n${newAddress.zip} ${newAddress.city}`;
    navigator.clipboard.writeText(address);
    toast.success("Adresse kopiert!");
  };

  const completedCount = changes.filter(c => c.completed).length;
  const highPriorityCompleted = changes.filter(c => c.priority === 'high' && c.completed).length;
  const highPriorityTotal = changes.filter(c => c.priority === 'high').length;
  const progress = Math.round((completedCount / changes.length) * 100);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const categories = [...new Set(changes.map(c => c.category))];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Adressänderungs-Helfer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New Address Input */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <h4 className="font-medium text-sm">Neue Adresse</h4>
          <Input
            placeholder="Strasse und Hausnummer"
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
          />
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="PLZ"
              value={newAddress.zip}
              onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
            />
            <Input
              placeholder="Ort"
              className="col-span-2"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={copyAddress}
            disabled={!newAddress.street || !newAddress.zip || !newAddress.city}
          >
            <Copy className="h-4 w-4" />
            Adresse kopieren
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Fortschritt</span>
            <span className="font-medium">{completedCount}/{changes.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Wichtig: {highPriorityCompleted}/{highPriorityTotal} erledigt
          </p>
        </div>

        {/* Changes List */}
        <ScrollArea className="h-[350px]">
          <div className="space-y-4">
            {categories.map(category => {
              const categoryChanges = changes.filter(c => c.category === category);
              
              return (
                <div key={category}>
                  <h4 className="font-medium text-sm mb-2">{category}</h4>
                  <div className="space-y-2">
                    {categoryChanges.map(change => (
                      <div
                        key={change.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          change.completed 
                            ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30' 
                            : 'border-border/50 hover:bg-muted/50'
                        }`}
                      >
                        <Checkbox
                          checked={change.completed}
                          onCheckedChange={() => toggleChange(change.id)}
                        />
                        <div className={`p-2 rounded-lg ${
                          change.completed ? 'bg-green-100 text-green-600' : 'bg-muted'
                        }`}>
                          {change.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium text-sm ${
                              change.completed ? 'line-through text-muted-foreground' : ''
                            }`}>
                              {change.name}
                            </span>
                            <Badge className={`text-xs ${getPriorityColor(change.priority)}`}>
                              {change.priority === 'high' ? 'Wichtig' : 
                               change.priority === 'medium' ? 'Mittel' : 'Optional'}
                            </Badge>
                          </div>
                          {change.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {change.notes}
                            </p>
                          )}
                        </div>
                        {change.completed && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AddressChangeHelper;
