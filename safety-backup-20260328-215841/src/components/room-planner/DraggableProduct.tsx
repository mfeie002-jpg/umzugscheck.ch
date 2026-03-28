import React, { useState } from 'react';
import { motion, useDragControls, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Product } from './types';

interface DraggableProductProps {
  product: Product;
  isSelected: boolean;
  phaseOpacity: number;
  isBoxed?: boolean;
  onSelect: (productId: string) => void;
  onPositionChange: (productId: string, position: { x: number; y: number }) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const SIZE_CLASSES = {
  small: 'w-10 h-10 text-xl',
  medium: 'w-14 h-14 text-2xl',
  large: 'w-20 h-20 text-3xl',
};

const CATEGORY_COLORS = {
  furniture: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300',
  electronics: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300',
  boxes: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300',
  fragile: 'bg-red-100 dark:bg-red-900/30 border-red-300',
  plants: 'bg-green-100 dark:bg-green-900/30 border-green-300',
  other: 'bg-gray-100 dark:bg-gray-900/30 border-gray-300',
};

export const DraggableProduct: React.FC<DraggableProductProps> = ({
  product,
  isSelected,
  phaseOpacity,
  isBoxed,
  onSelect,
  onPositionChange,
  containerRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate new position as percentage
    const newX = Math.max(5, Math.min(95, product.position.x + (info.offset.x / rect.width) * 100));
    const newY = Math.max(5, Math.min(95, product.position.y + (info.offset.y / rect.height) * 100));
    
    onPositionChange(product.id, { x: newX, y: newY });
    setIsDragging(false);
  };

  // If boxed (during packing/transport), show as a box icon
  if (isBoxed) {
    return (
      <motion.div
        className="absolute"
        style={{
          left: `${product.position.x}%`,
          top: `${product.position.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1, opacity: phaseOpacity }}
      >
        <div className={cn(
          "w-8 h-8 flex items-center justify-center text-lg rounded bg-orange-200 dark:bg-orange-800/50 border border-orange-400",
          "opacity-60"
        )}>
          📦
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        left: `${product.position.x}%`,
        top: `${product.position.y}%`,
        zIndex: isSelected || isDragging ? 50 : 10,
      }}
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onClick={() => onSelect(product.id)}
      animate={{
        opacity: phaseOpacity,
        scale: isSelected ? 1.15 : 1,
        x: '-50%',
        y: '-50%',
      }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Selection ring */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.3, opacity: 1 }}
          style={{ transform: 'translate(-15%, -15%)' }}
        />
      )}
      
      {/* Pulsing indicator when selected */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transform: 'translate(-15%, -15%)' }}
        />
      )}

      {/* Product icon */}
      <div className={cn(
        "flex items-center justify-center rounded-full border-2 shadow-md transition-all",
        SIZE_CLASSES[product.size],
        CATEGORY_COLORS[product.category],
        isSelected && "ring-2 ring-primary ring-offset-2 shadow-xl",
        isDragging && "shadow-2xl scale-110"
      )}>
        {product.icon}
      </div>

      {/* Label on hover/select */}
      {isSelected && (
        <motion.div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-popover text-popover-foreground text-xs font-medium rounded shadow-lg whitespace-nowrap border"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {product.name}
        </motion.div>
      )}
    </motion.div>
  );
};
