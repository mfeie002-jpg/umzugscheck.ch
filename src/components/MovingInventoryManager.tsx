import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Package, Plus, Minus, Sofa, Bed, Monitor, Archive, 
  Armchair, Lamp, BookOpen, Utensils, Trash2, Edit2, Save
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  volume: number;
  icon: React.ReactNode;
  notes?: string;
}

const defaultItems: InventoryItem[] = [
  { id: "sofa", name: "Sofa", category: "Wohnzimmer", quantity: 0, volume: 1.5, icon: <Sofa className="h-4 w-4" /> },
  { id: "armchair", name: "Sessel", category: "Wohnzimmer", quantity: 0, volume: 0.8, icon: <Armchair className="h-4 w-4" /> },
  { id: "bed", name: "Bett", category: "Schlafzimmer", quantity: 0, volume: 2.0, icon: <Bed className="h-4 w-4" /> },
  { id: "wardrobe", name: "Kleiderschrank", category: "Schlafzimmer", quantity: 0, volume: 2.5, icon: <Archive className="h-4 w-4" /> },
  { id: "desk", name: "Schreibtisch", category: "Büro", quantity: 0, volume: 1.0, icon: <Monitor className="h-4 w-4" /> },
  { id: "bookshelf", name: "Bücherregal", category: "Wohnzimmer", quantity: 0, volume: 0.8, icon: <BookOpen className="h-4 w-4" /> },
  { id: "lamp", name: "Stehlampe", category: "Wohnzimmer", quantity: 0, volume: 0.2, icon: <Lamp className="h-4 w-4" /> },
  { id: "diningtable", name: "Esstisch", category: "Esszimmer", quantity: 0, volume: 1.2, icon: <Utensils className="h-4 w-4" /> },
  { id: "boxes", name: "Umzugskartons", category: "Verpackung", quantity: 0, volume: 0.06, icon: <Package className="h-4 w-4" /> },
];

export const MovingInventoryManager = () => {
  const [items, setItems] = useState<InventoryItem[]>(defaultItems);
  const [customItemName, setCustomItemName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ));
  };

  const addCustomItem = () => {
    if (!customItemName.trim()) return;
    const newItem: InventoryItem = {
      id: `custom-${Date.now()}`,
      name: customItemName,
      category: "Sonstiges",
      quantity: 1,
      volume: 0.5,
      icon: <Package className="h-4 w-4" />
    };
    setItems([...items, newItem]);
    setCustomItemName("");
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalVolume = items.reduce((sum, item) => sum + (item.quantity * item.volume), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [...new Set(items.map(item => item.category))];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Inventar Manager
          </CardTitle>
          <Badge variant="secondary">
            {totalItems} Artikel • ~{totalVolume.toFixed(1)} m³
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Custom Item */}
        <div className="flex gap-2">
          <Input
            placeholder="Eigenen Artikel hinzufügen..."
            value={customItemName}
            onChange={(e) => setCustomItemName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
          />
          <Button onClick={addCustomItem} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Inventory by Category */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-6">
            {categories.map(category => {
              const categoryItems = items.filter(item => item.category === category);
              const hasItems = categoryItems.some(item => item.quantity > 0);
              
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-medium text-sm">{category}</h4>
                    {hasItems && (
                      <Badge variant="outline" className="text-xs">
                        {categoryItems.reduce((sum, item) => sum + item.quantity, 0)} Artikel
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    {categoryItems.map(item => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          item.quantity > 0 
                            ? 'border-primary/30 bg-primary/5' 
                            : 'border-border/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            item.quantity > 0 ? 'bg-primary/10 text-primary' : 'bg-muted'
                          }`}>
                            {item.icon}
                          </div>
                          <div>
                            <span className="font-medium text-sm">{item.name}</span>
                            <div className="text-xs text-muted-foreground">
                              ~{item.volume} m³ pro Stück
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity === 0}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          {item.id.startsWith('custom-') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Summary */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{totalItems}</div>
              <div className="text-xs text-muted-foreground">Artikel</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{totalVolume.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">m³ Volumen</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {totalVolume < 10 ? 'Klein' : totalVolume < 25 ? 'Mittel' : 'Gross'}
              </div>
              <div className="text-xs text-muted-foreground">LKW-Grösse</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovingInventoryManager;
