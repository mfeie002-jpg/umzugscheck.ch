import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Product } from './types';
import { X, Move, Trash2, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductPanelProps {
  product: Product | null;
  onClose: () => void;
  onMoveToRoom: (productId: string, roomId: string) => void;
  onDelete: (productId: string) => void;
  availableRooms: { id: string; name: string; icon: string }[];
  currentRoomId: string;
}

const CATEGORY_LABELS = {
  furniture: 'Möbel',
  electronics: 'Elektronik',
  boxes: 'Kartons',
  fragile: 'Zerbrechlich',
  plants: 'Pflanzen',
  other: 'Sonstiges',
};

const CATEGORY_COLORS = {
  furniture: 'text-amber-600',
  electronics: 'text-blue-600',
  boxes: 'text-orange-600',
  fragile: 'text-red-600',
  plants: 'text-green-600',
  other: 'text-gray-600',
};

export const ProductPanel: React.FC<ProductPanelProps> = ({
  product,
  onClose,
  onMoveToRoom,
  onDelete,
  availableRooms,
  currentRoomId,
}) => {
  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 md:absolute md:bottom-auto md:top-4 md:right-4 md:left-auto md:w-72 z-50"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="bg-card border-t md:border md:rounded-xl shadow-xl p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-3xl">
                  {product.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className={cn("text-sm", CATEGORY_COLORS[product.category])}>
                    {CATEGORY_LABELS[product.category]}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Position info */}
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Position im Raum</p>
              <div className="flex items-center gap-2 text-sm">
                <Move className="h-4 w-4 text-muted-foreground" />
                <span>X: {Math.round(product.position.x)}% | Y: {Math.round(product.position.y)}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Ziehe das Objekt um es zu verschieben
              </p>
            </div>

            {/* Move to room */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">In anderen Raum verschieben</p>
              <div className="flex flex-wrap gap-1">
                {availableRooms
                  .filter(room => room.id !== currentRoomId)
                  .map(room => (
                    <Button
                      key={room.id}
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1"
                      onClick={() => onMoveToRoom(product.id, room.id)}
                    >
                      <span>{room.icon}</span>
                      {room.name}
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Entfernen
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
