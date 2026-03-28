import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  ScanLine, 
  Plus, 
  Minus, 
  Check, 
  Package,
  Loader2,
  Smartphone,
  Hand,
  Box,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  STANDARD_ITEMS,
  getRoomTypeName,
  calculateSummary,
  getTruckSizeInfo,
  createManualScan,
  simulateARDetection,
  type RoomScan,
  type RoomType,
  type InventoryItem,
  type InventorySummary,
} from '@/lib/ar-inventory';

interface ARInventoryScannerProps {
  onComplete?: (summary: InventorySummary, scans: RoomScan[]) => void;
  className?: string;
}

export const ARInventoryScanner = memo(function ARInventoryScanner({
  onComplete,
  className = '',
}: ARInventoryScannerProps) {
  const [scans, setScans] = useState<RoomScan[]>([]);
  const [currentRoom, setCurrentRoom] = useState<RoomType>('living_room');
  const [isScanning, setIsScanning] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualItems, setManualItems] = useState<Record<string, number>>({});
  const [expandedScan, setExpandedScan] = useState<string | null>(null);

  const summary = calculateSummary(scans);
  const truckInfo = getTruckSizeInfo(summary.estimatedTruckSize);

  const handleARScan = useCallback(async () => {
    setIsScanning(true);
    try {
      const detectedItems = await simulateARDetection(currentRoom);
      const newScan: RoomScan = {
        id: `scan_${Date.now()}`,
        roomType: currentRoom,
        roomName: getRoomTypeName(currentRoom),
        items: detectedItems,
        totalVolume: detectedItems.reduce((sum, i) => sum + i.volume * i.quantity, 0),
        scanDate: new Date(),
      };
      setScans(prev => [...prev, newScan]);
    } finally {
      setIsScanning(false);
    }
  }, [currentRoom]);

  const handleManualAdd = useCallback(() => {
    const items = Object.entries(manualItems)
      .filter(([_, qty]) => qty > 0)
      .map(([key, qty]) => ({ itemKey: key, quantity: qty }));
    
    if (items.length === 0) return;
    
    const newScan = createManualScan(currentRoom, getRoomTypeName(currentRoom), items);
    setScans(prev => [...prev, newScan]);
    setManualItems({});
    setShowManualInput(false);
  }, [currentRoom, manualItems]);

  const handleRemoveScan = useCallback((scanId: string) => {
    setScans(prev => prev.filter(s => s.id !== scanId));
  }, []);

  const handleComplete = useCallback(() => {
    if (onComplete && scans.length > 0) {
      onComplete(summary, scans);
    }
  }, [onComplete, summary, scans]);

  const roomTypes: RoomType[] = [
    'living_room', 'bedroom', 'kitchen', 'bathroom', 
    'office', 'storage', 'garage', 'balcony', 'other'
  ];

  const itemsByCategory = Object.entries(STANDARD_ITEMS).reduce((acc, [key, item]) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push({ key, ...item });
    return acc;
  }, {} as Record<string, Array<{ key: string } & typeof STANDARD_ITEMS[string]>>);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ScanLine className="h-5 w-5 text-primary" />
          Inventar-Scanner
          <Badge variant="secondary" className="ml-auto text-xs">
            {summary.totalItems} Gegenstände
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Room Selector */}
        <div className="flex gap-2">
          <Select value={currentRoom} onValueChange={(v) => setCurrentRoom(v as RoomType)}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {getRoomTypeName(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Scan Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleARScan}
            disabled={isScanning}
            className="h-20 flex-col gap-2"
          >
            {isScanning ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Camera className="h-6 w-6" />
            )}
            <span className="text-xs">
              {isScanning ? 'Scanne...' : 'AR Scan starten'}
            </span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowManualInput(!showManualInput)}
            className="h-20 flex-col gap-2"
          >
            <Hand className="h-6 w-6" />
            <span className="text-xs">Manuell eingeben</span>
          </Button>
        </div>

        {/* Manual Input */}
        <AnimatePresence>
          {showManualInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border rounded-lg p-3 space-y-3"
            >
              {Object.entries(itemsByCategory).slice(0, 3).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">
                    {category}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {items.slice(0, 4).map((item) => (
                      <div key={item.key} className="flex items-center justify-between text-sm">
                        <span className="truncate">{item.name}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setManualItems(prev => ({
                              ...prev,
                              [item.key]: Math.max(0, (prev[item.key] || 0) - 1)
                            }))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center">
                            {manualItems[item.key] || 0}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setManualItems(prev => ({
                              ...prev,
                              [item.key]: (prev[item.key] || 0) + 1
                            }))}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <Button 
                onClick={handleManualAdd} 
                className="w-full" 
                size="sm"
                disabled={Object.values(manualItems).every(v => v === 0)}
              >
                <Check className="h-4 w-4 mr-2" />
                Hinzufügen
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanned Rooms */}
        {scans.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Erfasste Räume</h4>
            {scans.map((scan) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{scan.roomName}</span>
                    <Badge variant="outline" className="text-xs">
                      {scan.items.reduce((sum, i) => sum + i.quantity, 0)} Stück
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setExpandedScan(expandedScan === scan.id ? null : scan.id)}
                    >
                      {expandedScan === scan.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => handleRemoveScan(scan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedScan === scan.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 pt-2 border-t text-xs space-y-1"
                    >
                      {scan.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-muted-foreground">
                          <span>{item.quantity}x {item.name}</span>
                          <span>{(item.volume * item.quantity).toFixed(1)} m³</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Summary */}
        {scans.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Gesamtvolumen</span>
              <span className="text-lg font-bold text-primary">
                {summary.totalVolume} m³
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Gewicht</span>
                <p className="font-medium">~{summary.totalWeight} kg</p>
              </div>
              <div>
                <span className="text-muted-foreground">Kartons</span>
                <p className="font-medium">~{summary.estimatedBoxes} Stück</p>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{truckInfo.icon}</span>
                <div>
                  <p className="font-medium text-sm">{truckInfo.name}</p>
                  <p className="text-xs text-muted-foreground">{truckInfo.capacity}</p>
                </div>
              </div>
            </div>

            <Button onClick={handleComplete} className="w-full">
              <Package className="h-4 w-4 mr-2" />
              Inventar abschliessen
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default ARInventoryScanner;
