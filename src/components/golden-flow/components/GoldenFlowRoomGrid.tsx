/**
 * GoldenFlowRoomGrid - Visual Inventory Gamification
 * 
 * Phase 2.4: Grid of clickable SVG icons for room-based inventory
 * - Click to increment, long-press to decrement
 * - Smart defaults based on room count
 * - Visual feedback (bounce animation, count badge)
 */

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Sofa, 
  Bed, 
  UtensilsCrossed, 
  Bath, 
  Briefcase, 
  Baby,
  DoorOpen,
  Warehouse,
  Home,
  Minus,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultCount: number;
  maxCount: number;
  color: string;
}

const ROOM_TYPES: RoomType[] = [
  { id: 'living', label: 'Wohnzimmer', icon: Sofa, defaultCount: 1, maxCount: 3, color: 'text-amber-600' },
  { id: 'bedroom', label: 'Schlafzimmer', icon: Bed, defaultCount: 1, maxCount: 5, color: 'text-blue-600' },
  { id: 'kitchen', label: 'Küche', icon: UtensilsCrossed, defaultCount: 1, maxCount: 2, color: 'text-orange-600' },
  { id: 'bathroom', label: 'Badezimmer', icon: Bath, defaultCount: 1, maxCount: 3, color: 'text-cyan-600' },
  { id: 'office', label: 'Büro', icon: Briefcase, defaultCount: 0, maxCount: 2, color: 'text-slate-600' },
  { id: 'kids', label: 'Kinderzimmer', icon: Baby, defaultCount: 0, maxCount: 4, color: 'text-pink-600' },
  { id: 'hallway', label: 'Flur/Eingang', icon: DoorOpen, defaultCount: 1, maxCount: 2, color: 'text-gray-600' },
  { id: 'storage', label: 'Keller/Estrich', icon: Warehouse, defaultCount: 0, maxCount: 2, color: 'text-stone-600' },
];

interface GoldenFlowRoomGridProps {
  totalRooms: number;
  onRoomCountChange?: (rooms: Record<string, number>) => void;
  className?: string;
}

export function GoldenFlowRoomGrid({ totalRooms, onRoomCountChange, className }: GoldenFlowRoomGridProps) {
  // Initialize room counts based on total rooms
  const getSmartDefaults = useCallback((total: number): Record<string, number> => {
    const defaults: Record<string, number> = {};
    ROOM_TYPES.forEach(room => {
      if (room.id === 'bedroom') {
        defaults[room.id] = Math.min(Math.max(1, Math.floor(total / 2)), room.maxCount);
      } else if (room.id === 'kids' && total > 3) {
        defaults[room.id] = Math.min(Math.floor((total - 3) / 1.5), room.maxCount);
      } else {
        defaults[room.id] = room.defaultCount;
      }
    });
    return defaults;
  }, []);

  const [roomCounts, setRoomCounts] = useState<Record<string, number>>(() => 
    getSmartDefaults(totalRooms)
  );
  const [animatingRoom, setAnimatingRoom] = useState<string | null>(null);
  const longPressRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const updateCount = useCallback((roomId: string, delta: number) => {
    setRoomCounts(prev => {
      const room = ROOM_TYPES.find(r => r.id === roomId);
      if (!room) return prev;
      
      const newCount = Math.max(0, Math.min(room.maxCount, (prev[roomId] || 0) + delta));
      const updated = { ...prev, [roomId]: newCount };
      onRoomCountChange?.(updated);
      return updated;
    });
    
    // Trigger bounce animation
    setAnimatingRoom(roomId);
    setTimeout(() => setAnimatingRoom(null), 300);
  }, [onRoomCountChange]);

  const handleTouchStart = useCallback((roomId: string) => {
    isLongPress.current = false;
    longPressRef.current = setTimeout(() => {
      isLongPress.current = true;
      updateCount(roomId, -1);
    }, 500);
  }, [updateCount]);

  const handleTouchEnd = useCallback((roomId: string) => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
    }
    if (!isLongPress.current) {
      updateCount(roomId, 1);
    }
  }, [updateCount]);

  const totalSelected = Object.values(roomCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with total count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Räume auswählen</span>
        </div>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
          {totalSelected} Räume gewählt
        </span>
      </div>

      {/* Room grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {ROOM_TYPES.map((room) => {
          const count = roomCounts[room.id] || 0;
          const isActive = count > 0;
          const IconComponent = room.icon;
          
          return (
            <motion.button
              key={room.id}
              type="button"
              animate={animatingRoom === room.id ? { 
                scale: [1, 1.15, 1],
              } : {}}
              transition={{ duration: 0.3 }}
              onTouchStart={() => handleTouchStart(room.id)}
              onTouchEnd={() => handleTouchEnd(room.id)}
              onMouseDown={() => handleTouchStart(room.id)}
              onMouseUp={() => handleTouchEnd(room.id)}
              onMouseLeave={() => {
                if (longPressRef.current) clearTimeout(longPressRef.current);
              }}
              className={cn(
                "relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all touch-manipulation select-none",
                isActive
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-muted/30 hover:border-primary/30"
              )}
            >
              {/* Count badge */}
              {count > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md"
                >
                  {count}
                </motion.div>
              )}
              
              {/* Icon */}
              <IconComponent className={cn(
                "w-6 h-6 sm:w-8 sm:h-8 mb-1",
                isActive ? room.color : "text-muted-foreground"
              )} />
              
              {/* Label */}
              <span className={cn(
                "text-[10px] sm:text-xs font-medium text-center leading-tight",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {room.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Hint */}
      <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
        💡 Tippen = hinzufügen • Lang drücken = entfernen
      </p>

      {/* Quick adjust buttons (alternative for desktop) */}
      <div className="hidden sm:flex items-center justify-center gap-2 pt-2">
        <span className="text-xs text-muted-foreground">Schnellanpassung:</span>
        <button
          type="button"
          onClick={() => setRoomCounts(getSmartDefaults(2))}
          className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
        >
          1-2 Zi
        </button>
        <button
          type="button"
          onClick={() => setRoomCounts(getSmartDefaults(3.5))}
          className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
        >
          3-4 Zi
        </button>
        <button
          type="button"
          onClick={() => setRoomCounts(getSmartDefaults(5))}
          className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
        >
          5+ Zi
        </button>
      </div>
    </div>
  );
}
