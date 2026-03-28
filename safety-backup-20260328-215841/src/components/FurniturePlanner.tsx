import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sofa, 
  BedDouble, 
  UtensilsCrossed, 
  Armchair,
  Tv,
  Lamp,
  BookOpen,
  Shirt,
  RotateCcw,
  Trash2,
  Download,
  Grid3X3,
  Move
} from 'lucide-react';

interface FurnitureItem {
  id: string;
  type: string;
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

const furnitureCatalog = [
  { type: 'sofa', name: 'Sofa', width: 80, height: 35, icon: Sofa, color: 'hsl(var(--primary))' },
  { type: 'bed', name: 'Doppelbett', width: 70, height: 80, icon: BedDouble, color: 'hsl(var(--secondary))' },
  { type: 'table', name: 'Esstisch', width: 60, height: 40, icon: UtensilsCrossed, color: 'hsl(var(--accent))' },
  { type: 'armchair', name: 'Sessel', width: 30, height: 30, icon: Armchair, color: 'hsl(var(--primary))' },
  { type: 'tv', name: 'TV-Möbel', width: 60, height: 20, icon: Tv, color: 'hsl(var(--muted))' },
  { type: 'lamp', name: 'Stehlampe', width: 15, height: 15, icon: Lamp, color: 'hsl(var(--warning))' },
  { type: 'bookshelf', name: 'Bücherregal', width: 40, height: 15, icon: BookOpen, color: 'hsl(var(--secondary))' },
  { type: 'wardrobe', name: 'Kleiderschrank', width: 50, height: 25, icon: Shirt, color: 'hsl(var(--muted))' },
];

const FurniturePlanner = () => {
  const [roomWidth, setRoomWidth] = useState(400);
  const [roomHeight, setRoomHeight] = useState(300);
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const scale = Math.min(1, 350 / Math.max(roomWidth, roomHeight));

  const addFurniture = (catalogItem: typeof furnitureCatalog[0]) => {
    const newItem: FurnitureItem = {
      id: Date.now().toString(),
      type: catalogItem.type,
      name: catalogItem.name,
      width: catalogItem.width * scale,
      height: catalogItem.height * scale,
      x: 20,
      y: 20,
      rotation: 0,
      color: catalogItem.color
    };
    setFurniture([...furniture, newItem]);
    setSelectedItem(newItem.id);
  };

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedItem(id);
    setDraggedItem(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedItem || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setFurniture(furniture.map(item => 
      item.id === draggedItem 
        ? { ...item, x: Math.max(0, Math.min(x - item.width / 2, roomWidth * scale - item.width)), 
                     y: Math.max(0, Math.min(y - item.height / 2, roomHeight * scale - item.height)) }
        : item
    ));
  };

  const handleMouseUp = () => {
    setDraggedItem(null);
  };

  const rotateItem = (id: string) => {
    setFurniture(furniture.map(item => 
      item.id === id 
        ? { ...item, rotation: (item.rotation + 90) % 360, width: item.height, height: item.width }
        : item
    ));
  };

  const deleteItem = (id: string) => {
    setFurniture(furniture.filter(item => item.id !== id));
    if (selectedItem === id) setSelectedItem(null);
  };

  const clearAll = () => {
    setFurniture([]);
    setSelectedItem(null);
  };

  const exportPlan = () => {
    const plan = {
      room: { width: roomWidth, height: roomHeight },
      furniture: furniture.map(f => ({
        name: f.name,
        position: { x: Math.round(f.x / scale), y: Math.round(f.y / scale) },
        rotation: f.rotation
      }))
    };
    
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'raumplan.json';
    a.click();
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Move className="w-5 h-5 text-primary" />
            Möbelplaner
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowGrid(!showGrid)}>
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={clearAll}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={exportPlan}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Room Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Raumbreite (cm)</Label>
            <Input
              type="number"
              value={roomWidth}
              onChange={(e) => setRoomWidth(Number(e.target.value))}
              min={200}
              max={1000}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Raumtiefe (cm)</Label>
            <Input
              type="number"
              value={roomHeight}
              onChange={(e) => setRoomHeight(Number(e.target.value))}
              min={200}
              max={1000}
            />
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="relative border-2 border-dashed border-border rounded-lg overflow-hidden bg-background"
          style={{ 
            width: roomWidth * scale, 
            height: roomHeight * scale,
            backgroundImage: showGrid ? 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)' : 'none',
            backgroundSize: '20px 20px'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Door indicator */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-2 bg-primary/30 rounded-t" />
          
          {/* Furniture items */}
          {furniture.map((item) => (
            <motion.div
              key={item.id}
              className={`absolute cursor-move rounded-sm flex items-center justify-center text-xs font-medium
                ${selectedItem === item.id ? 'ring-2 ring-primary ring-offset-1' : ''}`}
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height,
                backgroundColor: item.color,
                opacity: 0.8,
                transform: `rotate(${item.rotation}deg)`
              }}
              onMouseDown={(e) => handleMouseDown(item.id, e)}
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-primary-foreground text-[10px] truncate px-1">
                {item.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Selected Item Controls */}
        {selectedItem && (
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <span className="text-sm flex-1">
              {furniture.find(f => f.id === selectedItem)?.name}
            </span>
            <Button size="sm" variant="outline" onClick={() => rotateItem(selectedItem)}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => deleteItem(selectedItem)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Furniture Catalog */}
        <Tabs defaultValue="living" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="living">Wohnzimmer</TabsTrigger>
            <TabsTrigger value="bedroom">Schlafzimmer</TabsTrigger>
            <TabsTrigger value="other">Sonstiges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="living" className="mt-2">
            <div className="grid grid-cols-4 gap-2">
              {furnitureCatalog.filter(f => ['sofa', 'armchair', 'tv', 'lamp'].includes(f.type)).map((item) => (
                <Button
                  key={item.type}
                  variant="outline"
                  className="flex flex-col h-auto py-2 px-2"
                  onClick={() => addFurniture(item)}
                >
                  <item.icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px]">{item.name}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="bedroom" className="mt-2">
            <div className="grid grid-cols-4 gap-2">
              {furnitureCatalog.filter(f => ['bed', 'wardrobe', 'lamp'].includes(f.type)).map((item) => (
                <Button
                  key={item.type}
                  variant="outline"
                  className="flex flex-col h-auto py-2 px-2"
                  onClick={() => addFurniture(item)}
                >
                  <item.icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px]">{item.name}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="other" className="mt-2">
            <div className="grid grid-cols-4 gap-2">
              {furnitureCatalog.filter(f => ['table', 'bookshelf'].includes(f.type)).map((item) => (
                <Button
                  key={item.type}
                  variant="outline"
                  className="flex flex-col h-auto py-2 px-2"
                  onClick={() => addFurniture(item)}
                >
                  <item.icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px]">{item.name}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Item Count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Möbelstücke platziert:</span>
          <Badge variant="secondary">{furniture.length}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default FurniturePlanner;
