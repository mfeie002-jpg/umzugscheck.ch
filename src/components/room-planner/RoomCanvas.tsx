import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Product, Phase, PHASE_TRANSFORMS } from './types';
import { DraggableProduct } from './DraggableProduct';

interface RoomCanvasProps {
  roomName: string;
  roomIcon: string;
  products: Product[];
  currentPhase: Phase;
  selectedProduct: string | null;
  onSelectProduct: (productId: string | null) => void;
  onUpdateProduct: (productId: string, position: { x: number; y: number }) => void;
}

export const RoomCanvas: React.FC<RoomCanvasProps> = ({
  roomName,
  roomIcon,
  products,
  currentPhase,
  selectedProduct,
  onSelectProduct,
  onUpdateProduct,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const phaseConfig = PHASE_TRANSFORMS[currentPhase.id] || PHASE_TRANSFORMS.inventory;

  // Generate floor pattern
  const floorPattern = (
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="floor" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#floor)"/>
    </svg>
  );

  // Room perspective walls
  const walls = (
    <div className="absolute inset-0 pointer-events-none">
      {/* Back wall */}
      <div className="absolute top-0 left-[10%] right-[10%] h-[30%] bg-gradient-to-b from-muted-foreground/10 to-transparent border-b border-muted-foreground/20" />
      {/* Left wall */}
      <div 
        className="absolute top-0 left-0 w-[10%] h-full bg-gradient-to-r from-muted-foreground/15 to-transparent"
        style={{ clipPath: 'polygon(0 0, 100% 30%, 100% 100%, 0 100%)' }}
      />
      {/* Right wall */}
      <div 
        className="absolute top-0 right-0 w-[10%] h-full bg-gradient-to-l from-muted-foreground/15 to-transparent"
        style={{ clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 100%)' }}
      />
    </div>
  );

  return (
    <div className="relative">
      {/* Room label */}
      <div className="absolute -top-3 left-4 z-20 flex items-center gap-2 px-3 py-1 bg-background border rounded-full shadow-sm">
        <span className="text-lg">{roomIcon}</span>
        <span className="font-medium text-sm">{roomName}</span>
        <span className="text-xs text-muted-foreground">• {currentPhase.name}</span>
      </div>

      {/* Canvas container */}
      <motion.div
        ref={containerRef}
        className={cn(
          "relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-border bg-gradient-to-b from-muted/50 to-muted",
          phaseConfig.blur && "blur-sm"
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onSelectProduct(null);
          }
        }}
        animate={{
          filter: phaseConfig.blur ? 'blur(2px)' : 'blur(0px)',
        }}
      >
        {/* Floor pattern */}
        {floorPattern}
        
        {/* Walls */}
        {walls}

        {/* Phase overlay effect */}
        <AnimatePresence>
          {currentPhase.id === 'transport' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 z-30 pointer-events-none"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </AnimatePresence>

        {/* Packing boxes (shown during packing/unpacking phases) */}
        {phaseConfig.showBoxes && phaseConfig.boxPositions?.map((pos, i) => (
          <motion.div
            key={`box-${i}`}
            className="absolute"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-12 h-12 bg-orange-200 dark:bg-orange-800/50 border-2 border-orange-400 rounded flex items-center justify-center text-2xl shadow-md">
              📦
            </div>
          </motion.div>
        ))}

        {/* Products */}
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <DraggableProduct
              key={product.id}
              product={product}
              isSelected={selectedProduct === product.id}
              phaseOpacity={phaseConfig.opacity}
              isBoxed={phaseConfig.showBoxes && currentPhase.id === 'transport'}
              onSelect={onSelectProduct}
              onPositionChange={onUpdateProduct}
              containerRef={containerRef}
            />
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <span className="text-4xl mb-2 block">🪑</span>
              <p className="text-sm">Keine Produkte in diesem Raum</p>
              <p className="text-xs mt-1">Füge Produkte hinzu um loszulegen</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Phase indicator overlay */}
      <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-lg border shadow-sm flex items-center gap-2">
        <span className="text-xl">{currentPhase.icon}</span>
        <div>
          <p className="text-xs font-medium">{currentPhase.name}</p>
          <p className="text-xs text-muted-foreground">{currentPhase.description}</p>
        </div>
      </div>
    </div>
  );
};
