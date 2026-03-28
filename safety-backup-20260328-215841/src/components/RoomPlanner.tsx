import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { 
  Sofa, Bed, UtensilsCrossed, Tv, Shirt, BookOpen, 
  Trash2, RotateCw, ZoomIn, ZoomOut, Grid3X3, Move
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlacedItem {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
}

const furnitureTypes = [
  { type: "sofa", label: "Sofa", icon: Sofa, width: 80, height: 40, color: "bg-amber-500" },
  { type: "bed", label: "Bett", icon: Bed, width: 60, height: 80, color: "bg-blue-500" },
  { type: "wardrobe", label: "Schrank", icon: Shirt, width: 40, height: 60, color: "bg-purple-500" },
  { type: "table", label: "Tisch", icon: UtensilsCrossed, width: 50, height: 50, color: "bg-green-500" },
  { type: "tv", label: "TV", icon: Tv, width: 60, height: 15, color: "bg-slate-600" },
  { type: "bookshelf", label: "Regal", icon: BookOpen, width: 30, height: 80, color: "bg-orange-500" },
];

const DraggableFurniture = ({ 
  item, 
  onMove, 
  onRotate, 
  onDelete,
  isSelected,
  onSelect,
  scale
}: { 
  item: PlacedItem; 
  onMove: (id: string, x: number, y: number) => void;
  onRotate: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: () => void;
  scale: number;
}) => {
  const furniture = furnitureTypes.find(f => f.type === item.type);
  const Icon = furniture?.icon || Sofa;
  const isRotated = item.rotation % 180 !== 0;
  
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(_, info) => {
        onMove(item.id, item.x + info.offset.x / scale, item.y + info.offset.y / scale);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "absolute cursor-grab active:cursor-grabbing rounded-md flex items-center justify-center shadow-lg transition-all",
        furniture?.color,
        isSelected && "ring-2 ring-alpine ring-offset-2"
      )}
      style={{
        left: item.x,
        top: item.y,
        width: isRotated ? item.height : item.width,
        height: isRotated ? item.width : item.height,
        transform: `rotate(${item.rotation}deg)`,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="h-4 w-4 text-white" />
      
      <AnimatePresence>
        {isSelected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1"
          >
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onRotate(item.id);
              }}
            >
              <RotateCw className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface RoomPlannerProps {
  onItemsChange?: (items: PlacedItem[]) => void;
}

const RoomPlanner = ({ onItemsChange }: RoomPlannerProps) => {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addFurniture = useCallback((type: string) => {
    const furniture = furnitureTypes.find(f => f.type === type);
    if (!furniture) return;
    
    const newItem: PlacedItem = {
      id: `${type}-${Date.now()}`,
      type,
      x: 100 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      rotation: 0,
      width: furniture.width,
      height: furniture.height,
    };
    
    const updated = [...placedItems, newItem];
    setPlacedItems(updated);
    setSelectedId(newItem.id);
    onItemsChange?.(updated);
  }, [placedItems, onItemsChange]);

  const moveItem = useCallback((id: string, x: number, y: number) => {
    const updated = placedItems.map(item => 
      item.id === id ? { ...item, x: Math.max(0, x), y: Math.max(0, y) } : item
    );
    setPlacedItems(updated);
    onItemsChange?.(updated);
  }, [placedItems, onItemsChange]);

  const rotateItem = useCallback((id: string) => {
    const updated = placedItems.map(item => 
      item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
    );
    setPlacedItems(updated);
    onItemsChange?.(updated);
  }, [placedItems, onItemsChange]);

  const deleteItem = useCallback((id: string) => {
    const updated = placedItems.filter(item => item.id !== id);
    setPlacedItems(updated);
    setSelectedId(null);
    onItemsChange?.(updated);
  }, [placedItems, onItemsChange]);

  const clearAll = useCallback(() => {
    setPlacedItems([]);
    setSelectedId(null);
    onItemsChange?.([]);
  }, [onItemsChange]);

  return (
    <div className="space-y-4">
      {/* Furniture Palette */}
      <div className="flex flex-wrap gap-2">
        {furnitureTypes.map(furniture => {
          const Icon = furniture.icon;
          return (
            <motion.button
              key={furniture.type}
              onClick={() => addFurniture(furniture.type)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-border",
                "hover:border-alpine hover:bg-alpine/5 transition-all"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={cn("p-1.5 rounded", furniture.color)}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">{furniture.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-16 text-center">{Math.round(scale * 100)}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(Math.min(1.5, scale + 0.1))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant={showGrid ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {placedItems.length} Möbel platziert
          </span>
          {placedItems.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-1" />
              Alle entfernen
            </Button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className={cn(
          "relative h-[350px] md:h-[400px] rounded-xl border-2 border-dashed border-border overflow-hidden",
          "bg-background transition-colors",
          showGrid && "bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:20px_20px]"
        )}
        onClick={() => setSelectedId(null)}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {/* Room outline */}
        <div className="absolute inset-4 border-2 border-alpine/30 rounded-lg bg-alpine/5">
          <div className="absolute top-2 left-2 text-xs text-muted-foreground">Grundriss</div>
          {/* Door indicator */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-2 bg-alpine/50 rounded-t-full" />
        </div>

        {/* Placed furniture */}
        {placedItems.map(item => (
          <DraggableFurniture
            key={item.id}
            item={item}
            onMove={moveItem}
            onRotate={rotateItem}
            onDelete={deleteItem}
            isSelected={selectedId === item.id}
            onSelect={() => setSelectedId(item.id)}
            scale={scale}
          />
        ))}

        {/* Empty state */}
        {placedItems.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <Move className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">Klicken Sie oben auf Möbel um sie hinzuzufügen</p>
            <p className="text-xs">Ziehen Sie platzierte Möbel zum Verschieben</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPlanner;
