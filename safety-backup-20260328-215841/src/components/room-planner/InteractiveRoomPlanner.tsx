/**
 * Interactive Room Planner
 * 
 * A visual, drag-and-drop room planner that shows:
 * - Multiple rooms with positioned products
 * - Moving phases (Inventory → Packing → Transport → Unpacking → Done)
 * - Click products to see details, drag to reposition
 * - Products transform visually based on phase
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RotateCcw, Download, Eye, EyeOff } from 'lucide-react';
import { DEFAULT_PHASES, DEFAULT_ROOMS, Phase, Room, Product } from './types';
import { PhaseSelector } from './PhaseSelector';
import { RoomSelector } from './RoomSelector';
import { RoomCanvas } from './RoomCanvas';
import { ProductPanel } from './ProductPanel';

interface InteractiveRoomPlannerProps {
  initialRooms?: Room[];
  initialPhase?: string;
  onSave?: (rooms: Room[]) => void;
}

export const InteractiveRoomPlanner: React.FC<InteractiveRoomPlannerProps> = ({
  initialRooms = DEFAULT_ROOMS,
  initialPhase = 'inventory',
  onSave,
}) => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [currentRoomId, setCurrentRoomId] = useState(initialRooms[0]?.id || 'living');
  const [currentPhaseId, setCurrentPhaseId] = useState(initialPhase);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Current room and phase
  const currentRoom = useMemo(() => 
    rooms.find(r => r.id === currentRoomId) || rooms[0],
    [rooms, currentRoomId]
  );
  
  const currentPhase = useMemo(() => 
    DEFAULT_PHASES.find(p => p.id === currentPhaseId) || DEFAULT_PHASES[0],
    [currentPhaseId]
  );

  // Product counts per room
  const productCounts = useMemo(() => {
    return rooms.reduce((acc, room) => {
      acc[room.id] = room.products.length;
      return acc;
    }, {} as Record<string, number>);
  }, [rooms]);

  // Total products
  const totalProducts = useMemo(() => 
    rooms.reduce((sum, room) => sum + room.products.length, 0),
    [rooms]
  );

  // Selected product
  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    for (const room of rooms) {
      const product = room.products.find(p => p.id === selectedProductId);
      if (product) return product;
    }
    return null;
  }, [rooms, selectedProductId]);

  // Update product position
  const handleUpdateProductPosition = useCallback((productId: string, position: { x: number; y: number }) => {
    setRooms(prev => prev.map(room => ({
      ...room,
      products: room.products.map(p => 
        p.id === productId ? { ...p, position } : p
      )
    })));
  }, []);

  // Move product to different room
  const handleMoveToRoom = useCallback((productId: string, targetRoomId: string) => {
    setRooms(prev => {
      let productToMove: Product | null = null;
      
      // Remove from current room
      const updatedRooms = prev.map(room => {
        const product = room.products.find(p => p.id === productId);
        if (product) {
          productToMove = { ...product, position: { x: 50, y: 50 } }; // Reset position
          return { ...room, products: room.products.filter(p => p.id !== productId) };
        }
        return room;
      });

      // Add to target room
      if (productToMove) {
        return updatedRooms.map(room => 
          room.id === targetRoomId 
            ? { ...room, products: [...room.products, productToMove!] }
            : room
        );
      }

      return updatedRooms;
    });
    
    setCurrentRoomId(targetRoomId);
    setSelectedProductId(productId);
  }, []);

  // Delete product
  const handleDeleteProduct = useCallback((productId: string) => {
    setRooms(prev => prev.map(room => ({
      ...room,
      products: room.products.filter(p => p.id !== productId)
    })));
    setSelectedProductId(null);
  }, []);

  // Reset to defaults
  const handleReset = () => {
    setRooms(DEFAULT_ROOMS);
    setCurrentPhaseId('inventory');
    setSelectedProductId(null);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            Interaktiver Raumplaner
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAllProducts(!showAllProducts)}
            >
              {showAllProducts ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {showAllProducts ? 'Weniger' : 'Alle'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <span>{rooms.length} Räume</span>
          <span>•</span>
          <span>{totalProducts} Produkte</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span>{currentPhase.icon}</span>
            Phase: {currentPhase.name}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Phase Selector */}
        <div className="px-4">
          <PhaseSelector
            phases={DEFAULT_PHASES}
            currentPhase={currentPhaseId}
            onPhaseChange={setCurrentPhaseId}
          />
        </div>

        {/* Room Selector */}
        <RoomSelector
          rooms={rooms}
          currentRoom={currentRoomId}
          onRoomChange={(roomId) => {
            setCurrentRoomId(roomId);
            setSelectedProductId(null);
          }}
          productCounts={productCounts}
        />

        {/* Room Canvas */}
        <div className="relative">
          <RoomCanvas
            roomName={currentRoom.name}
            roomIcon={currentRoom.icon}
            products={currentRoom.products}
            currentPhase={currentPhase}
            selectedProduct={selectedProductId}
            onSelectProduct={setSelectedProductId}
            onUpdateProduct={handleUpdateProductPosition}
          />

          {/* Product Detail Panel */}
          <ProductPanel
            product={selectedProduct}
            onClose={() => setSelectedProductId(null)}
            onMoveToRoom={handleMoveToRoom}
            onDelete={handleDeleteProduct}
            availableRooms={rooms.map(r => ({ id: r.id, name: r.name, icon: r.icon }))}
            currentRoomId={currentRoomId}
          />
        </div>

        {/* Product Overview (when "Show All" is active) */}
        {showAllProducts && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border rounded-xl p-4 bg-muted/30"
          >
            <h4 className="font-medium mb-3">Alle Produkte nach Raum</h4>
            <div className="space-y-3">
              {rooms.map(room => (
                <div key={room.id} className="flex items-start gap-3">
                  <span className="text-xl">{room.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{room.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {room.products.map(product => (
                        <button
                          key={product.id}
                          onClick={() => {
                            setCurrentRoomId(room.id);
                            setSelectedProductId(product.id);
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-background border rounded-full hover:bg-accent transition-colors"
                        >
                          <span>{product.icon}</span>
                          {product.name}
                        </button>
                      ))}
                      {room.products.length === 0 && (
                        <span className="text-xs text-muted-foreground">Keine Produkte</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
          <span>👆 Klicken = Details</span>
          <span>✋ Ziehen = Verschieben</span>
          <span>📋 Phasen = Visualisierung</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveRoomPlanner;
