/**
 * GoldenFlowStep2 - Details (Rooms, Floor, Date)
 * Phase 2.4: Visual Inventory Gamification
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Building, Calendar, ArrowRight, ArrowLeft, CheckCircle, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { GoldenFlowData, GoldenFlowPriceEstimate } from '../types';
import { ROOM_OPTIONS, FLOOR_OPTIONS } from '../constants';
import { GoldenFlowPricePreview } from '../components/GoldenFlowPricePreview';
import { GoldenFlowRoomGrid } from '../components/GoldenFlowRoomGrid';

interface GoldenFlowStep2Props {
  formData: GoldenFlowData;
  priceEstimate: GoldenFlowPriceEstimate | null;
  onUpdate: (data: Partial<GoldenFlowData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function GoldenFlowStep2({ formData, priceEstimate, onUpdate, onNext, onBack }: GoldenFlowStep2Props) {
  const [showDetailedInventory, setShowDetailedInventory] = useState(false);
  const selectedRoom = ROOM_OPTIONS.find(r => r.value === (formData.rooms?.toString() || '3-3.5'));
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Wohnungsgrösse & Termin
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {formData.fromCity} → {formData.toCity}
        </p>
      </div>
      
      {/* Room selector toggle */}
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" />
          Anzahl Zimmer
        </Label>
        <button
          type="button"
          onClick={() => setShowDetailedInventory(!showDetailedInventory)}
          className="text-xs text-primary flex items-center gap-1 hover:underline"
        >
          <Grid3X3 className="h-3 w-3" />
          {showDetailedInventory ? 'Einfache Ansicht' : 'Detailliert'}
        </button>
      </div>

      {/* Simple room count OR detailed inventory */}
      {!showDetailedInventory ? (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ROOM_OPTIONS.map((room) => (
            <button
              key={room.value}
              type="button"
              onClick={() => onUpdate({ rooms: room.rooms })}
              className={cn(
                "p-3 rounded-xl border-2 transition-all text-center",
                formData.rooms === room.rooms
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50"
              )}
            >
              <span className="text-lg font-semibold">{room.label.split(' ')[0]}</span>
              {formData.rooms === room.rooms && (
                <CheckCircle className="h-4 w-4 text-primary mx-auto mt-1" />
              )}
            </button>
          ))}
        </div>
      ) : (
        <GoldenFlowRoomGrid 
          totalRooms={formData.rooms} 
          onRoomCountChange={(rooms) => {
            // Calculate total from detailed inventory
            const total = Object.values(rooms).reduce((sum, count) => sum + count, 0);
            // Map to closest room option
            const closestOption = ROOM_OPTIONS.reduce((prev, curr) => 
              Math.abs(curr.rooms - total) < Math.abs(prev.rooms - total) ? curr : prev
            );
            onUpdate({ rooms: closestOption.rooms });
          }}
        />
      )}
      
      {/* Floor & Elevator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Building className="h-4 w-4 text-primary" />
            Stockwerk
          </Label>
          <select
            value={formData.floor}
            onChange={(e) => onUpdate({ floor: parseInt(e.target.value) })}
            className="w-full h-12 px-3 rounded-lg border border-input bg-background text-foreground"
          >
            {FLOOR_OPTIONS.map((floor) => (
              <option key={floor.value} value={floor.value}>
                {floor.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
          <Label htmlFor="elevator" className="text-sm font-medium cursor-pointer">
            Lift vorhanden?
          </Label>
          <Switch
            id="elevator"
            checked={formData.hasElevator}
            onCheckedChange={(checked) => onUpdate({ hasElevator: checked })}
          />
        </div>
      </div>
      
      {/* Move Date */}
      <div>
        <Label className="text-sm font-medium flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-primary" />
          Umzugsdatum
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="date"
            value={formData.moveDate}
            onChange={(e) => onUpdate({ moveDate: e.target.value })}
            className="h-12"
            min={new Date().toISOString().split('T')[0]}
          />
          <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
            <Label htmlFor="flexible" className="text-sm cursor-pointer">
              Termin flexibel
            </Label>
            <Switch
              id="flexible"
              checked={formData.flexibleDate}
              onCheckedChange={(checked) => onUpdate({ flexibleDate: checked })}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Flexible Termine = oft günstigere Angebote
        </p>
      </div>
      
      {/* Price preview */}
      {priceEstimate && (
        <GoldenFlowPricePreview estimate={priceEstimate} variant="compact" />
      )}
      
      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="flex-1 h-12"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        <Button
          onClick={onNext}
          size="lg"
          className="flex-[2] h-12 bg-gradient-to-r from-secondary to-secondary/90"
        >
          Weiter zu Services
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
