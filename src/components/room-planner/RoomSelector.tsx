import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Room } from './types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface RoomSelectorProps {
  rooms: Room[];
  currentRoom: string;
  onRoomChange: (roomId: string) => void;
  productCounts: Record<string, number>;
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({
  rooms,
  currentRoom,
  onRoomChange,
  productCounts,
}) => {
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 pb-2">
        {rooms.map((room) => {
          const isActive = room.id === currentRoom;
          const count = productCounts[room.id] || 0;

          return (
            <motion.button
              key={room.id}
              onClick={() => onRoomChange(room.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all whitespace-nowrap",
                isActive 
                  ? "bg-primary text-primary-foreground border-primary shadow-md" 
                  : "bg-card hover:bg-muted border-border hover:border-primary/50"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl">{room.icon}</span>
              <span className="font-medium text-sm">{room.name}</span>
              
              {/* Product count badge */}
              <span className={cn(
                "absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full",
                isActive 
                  ? "bg-background text-primary" 
                  : "bg-primary text-primary-foreground"
              )}>
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
