import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Recycle, 
  Trash2, 
  Heart, 
  DollarSign,
  Leaf,
  Plus,
  ChevronRight,
  Package,
  Sparkles
} from 'lucide-react';
import { 
  CircularItem,
  ItemCategory,
  ItemCondition,
  ITEM_CATEGORY_CONFIG,
  CONDITION_CONFIG,
  DISPOSAL_METHOD_CONFIG,
  createCircularItem,
  calculateCircularEstimate,
  CircularEconomyEstimate
} from '@/lib/circular-economy';

interface CircularEconomyWidgetProps {
  onComplete?: (estimate: CircularEconomyEstimate) => void;
}

export function CircularEconomyWidget({ onComplete }: CircularEconomyWidgetProps) {
  const [items, setItems] = useState<CircularItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'furniture' as ItemCategory,
    condition: 'good' as ItemCondition,
    originalPrice: 500
  });

  const estimate = calculateCircularEstimate(items);

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;
    
    const item = createCircularItem(
      newItem.name,
      newItem.category,
      newItem.condition,
      newItem.originalPrice
    );
    
    setItems(prev => [...prev, item]);
    setNewItem({ name: '', category: 'furniture', condition: 'good', originalPrice: 500 });
    setShowAddForm(false);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'sell': return <DollarSign className="h-4 w-4" />;
      case 'donate': return <Heart className="h-4 w-4" />;
      case 'recycle': return <Recycle className="h-4 w-4" />;
      default: return <Trash2 className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Recycle className="h-5 w-5 text-primary" />
          Kreislaufwirtschaft
          <Badge variant="secondary" className="ml-auto">
            <Leaf className="h-3 w-3 mr-1" />
            Nachhaltig
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Alte Sachen loswerden und dabei Geld verdienen oder Gutes tun
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        {items.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <DollarSign className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">CHF {estimate.customerPayout}</p>
              <p className="text-xs text-muted-foreground">Ihr Erlös</p>
            </div>
            <div className="bg-green-100 dark:bg-green-950/30 rounded-lg p-3 text-center">
              <Leaf className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <p className="text-lg font-bold">{estimate.co2Saved} kg</p>
              <p className="text-xs text-muted-foreground">CO₂ gespart</p>
            </div>
            <div className="bg-secondary rounded-lg p-3 text-center">
              <Package className="h-5 w-5 mx-auto mb-1" />
              <p className="text-lg font-bold">{items.length}</p>
              <p className="text-xs text-muted-foreground">Artikel</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <Recycle className="h-5 w-5 mx-auto mb-1" />
              <p className="text-lg font-bold">{estimate.breakdown.recycle.count + estimate.breakdown.donate.count}</p>
              <p className="text-xs text-muted-foreground">Recycelt/Gespendet</p>
            </div>
          </div>
        )}

        {/* Item List */}
        {items.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Ihre Artikel ({items.length})</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {items.map(item => {
                const categoryConfig = ITEM_CATEGORY_CONFIG[item.category];
                const methodConfig = DISPOSAL_METHOD_CONFIG[item.recommendedMethod];
                
                return (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{categoryConfig.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {CONDITION_CONFIG[item.condition].labelDe}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getMethodIcon(item.recommendedMethod)}
                        <span className="ml-1">{methodConfig.labelDe}</span>
                      </Badge>
                      {item.estimatedValue > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          CHF {item.estimatedValue}
                        </Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Item Form */}
        {showAddForm ? (
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Artikel hinzufügen</h4>
            
            <Input
              placeholder="Artikelname (z.B. Ikea Billy Regal)"
              value={newItem.name}
              onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Kategorie</label>
                <div className="grid grid-cols-4 gap-1">
                  {Object.entries(ITEM_CATEGORY_CONFIG).slice(0, 8).map(([key, config]) => (
                    <Button
                      key={key}
                      variant={newItem.category === key ? "default" : "outline"}
                      size="sm"
                      className="p-2 h-auto"
                      onClick={() => setNewItem(prev => ({ ...prev, category: key as ItemCategory }))}
                    >
                      <span className="text-lg">{config.icon}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Zustand</label>
                <div className="space-y-1">
                  {Object.entries(CONDITION_CONFIG).map(([key, config]) => (
                    <Button
                      key={key}
                      variant={newItem.condition === key ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => setNewItem(prev => ({ ...prev, condition: key as ItemCondition }))}
                    >
                      {config.labelDe}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Ursprünglicher Preis (CHF)
              </label>
              <Input
                type="number"
                value={newItem.originalPrice}
                onChange={e => setNewItem(prev => ({ ...prev, originalPrice: parseInt(e.target.value) || 0 }))}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddItem} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Hinzufügen
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Abbrechen
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Artikel hinzufügen
          </Button>
        )}

        {/* Summary & CTA */}
        {items.length > 0 && (
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Geschätzter Erlös</p>
                <p className="text-sm text-muted-foreground">
                  Nach Abzug von Abholung & Gebühren
                </p>
              </div>
              <p className="text-2xl font-bold text-primary">
                CHF {estimate.customerPayout}
              </p>
            </div>
            
            <div className="flex gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">
                {estimate.breakdown.sell.count} verkaufen
              </Badge>
              <Badge variant="secondary">
                {estimate.breakdown.donate.count} spenden
              </Badge>
              <Badge variant="secondary">
                {estimate.breakdown.recycle.count} recyceln
              </Badge>
            </div>
            
            <Button className="w-full" onClick={() => onComplete?.(estimate)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Zum Umzug hinzufügen
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && !showAddForm && (
          <div className="text-center py-8 text-muted-foreground">
            <Recycle className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">Keine Artikel hinzugefügt</p>
            <p className="text-sm">
              Fügen Sie Gegenstände hinzu, die Sie loswerden möchten
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CircularEconomyWidget;
