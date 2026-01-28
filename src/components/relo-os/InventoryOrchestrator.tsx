/**
 * Inventory Orchestrator Component
 * 
 * Unified interface for Phase 2 (Inventory) that combines:
 * - Video Upload (existing)
 * - AI Analysis (existing)
 * - LiDAR 3D Scanning (new)
 * - Digital Twin Generation (existing)
 * 
 * Provides a step-by-step wizard for complete inventory capture.
 */

import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Scan,
  Box,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Home,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { EnhancedLiDARScanner } from './EnhancedLiDARScanner';
import { DigitalTwinDisplay } from './DigitalTwinDisplay';
import { VideoInventoryScanner } from '@/components/video-inventory/VideoInventoryScanner';
import { ScanResult3D, mergeRoomScans, calculateVolumeFromScan, detectRoomType } from '@/lib/lidar-depth-api';
import { DigitalTwin, RoomInventory } from '@/lib/move-project';
import { ROOM_TYPE_CONFIG, RoomType, RoomScan } from '@/lib/video-inventory';

interface InventoryOrchestratorProps {
  onComplete?: (digitalTwin: DigitalTwin) => void;
  className?: string;
}

interface ScannedRoom {
  id: string;
  name: string;
  type: string;
  method: 'video' | 'lidar';
  volume: number;
  items: number;
  confidence: number;
  scanData?: ScanResult3D | RoomScan;
}

type OrchestratorStep = 'intro' | 'scanning' | 'review' | 'complete';

export const InventoryOrchestrator = memo(function InventoryOrchestrator({
  onComplete,
  className,
}: InventoryOrchestratorProps) {
  const [step, setStep] = useState<OrchestratorStep>('intro');
  const [scanMethod, setScanMethod] = useState<'video' | 'lidar'>('lidar');
  const [scannedRooms, setScannedRooms] = useState<ScannedRoom[]>([]);
  const [currentRoomType, setCurrentRoomType] = useState<RoomType>('living_room');
  const [digitalTwin, setDigitalTwin] = useState<DigitalTwin | null>(null);

  // Calculate totals from scanned rooms
  const totalVolume = scannedRooms.reduce((sum, room) => sum + room.volume, 0);
  const totalItems = scannedRooms.reduce((sum, room) => sum + room.items, 0);
  const avgConfidence = scannedRooms.length > 0
    ? scannedRooms.reduce((sum, room) => sum + room.confidence, 0) / scannedRooms.length
    : 0;

  // Handle LiDAR scan completion
  const handleLiDARComplete = useCallback((result: ScanResult3D) => {
    const volumeData = calculateVolumeFromScan(result);
    const roomType = detectRoomType(result.detectedObjects);

    const newRoom: ScannedRoom = {
      id: `room_${Date.now()}`,
      name: roomType.typeDe,
      type: roomType.type,
      method: 'lidar',
      volume: volumeData.usableVolume,
      items: result.detectedObjects.length,
      confidence: result.accuracy,
      scanData: result,
    };

    setScannedRooms(prev => [...prev, newRoom]);
  }, []);

  // Handle Video scan completion
  const handleVideoComplete = useCallback((scan: RoomScan) => {
    const newRoom: ScannedRoom = {
      id: scan.id,
      name: scan.roomName,
      type: scan.roomType,
      method: 'video',
      volume: scan.totalVolume,
      items: scan.detectedItems.length,
      confidence: scan.confidence,
      scanData: scan,
    };

    setScannedRooms(prev => [...prev, newRoom]);
  }, []);

  // Remove a scanned room
  const removeRoom = useCallback((roomId: string) => {
    setScannedRooms(prev => prev.filter(r => r.id !== roomId));
  }, []);

  // Generate Digital Twin from all scanned rooms
  const generateDigitalTwin = useCallback(() => {
    // Calculate all metrics
    const specialItems: string[] = [];
    let fragilityScore = 0;
    
    scannedRooms.forEach(room => {
      if (room.scanData && 'detectedObjects' in room.scanData) {
        room.scanData.detectedObjects.forEach(obj => {
          if (obj.category === 'electronics' || obj.category === 'decoration') {
            fragilityScore += 10;
          }
        });
      }
    });

    // Map to RoomInventory format
    const rooms: RoomInventory[] = scannedRooms.map(room => ({
      id: room.id,
      name: room.name,
      type: room.type,
      items: [],
      volume: room.volume,
      weight: room.volume * 150, // Rough estimate: 150kg per m³
      scanConfidence: room.confidence,
    }));

    // Determine truck size
    let truckSize: DigitalTwin['recommendedTruckSize'] = 'transporter';
    if (totalVolume > 50) truckSize = 'xl';
    else if (totalVolume > 35) truckSize = 'large';
    else if (totalVolume > 20) truckSize = 'medium';
    else if (totalVolume > 10) truckSize = 'small';

    // Crew size based on volume
    const crewSize = totalVolume <= 20 ? 2 : totalVolume <= 40 ? 3 : 4;

    // Duration estimate (1h per 5m³)
    const duration = Math.max(2, Math.ceil(totalVolume / 5));

    const twin: DigitalTwin = {
      rooms,
      totalVolume: Math.round(totalVolume * 10) / 10,
      totalWeight: Math.round(totalVolume * 150),
      totalItems,
      estimatedBoxes: Math.ceil(totalVolume * 0.6 / 0.06),
      recommendedTruckSize: truckSize,
      recommendedCrewSize: crewSize,
      estimatedDuration: duration,
      fragilityScore: Math.min(100, fragilityScore),
      specialHandling: specialItems,
      confidence: avgConfidence,
      scannedAt: new Date().toISOString(),
    };

    setDigitalTwin(twin);
    setStep('complete');
    onComplete?.(twin);
  }, [scannedRooms, totalVolume, totalItems, avgConfidence, onComplete]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-blue-500/5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Inventar erfassen
          </div>
          <Badge variant="outline">
            Phase 2: Inventory
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {(['intro', 'scanning', 'review', 'complete'] as const).map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : scannedRooms.length > 0 && idx <= (['intro', 'scanning', 'review', 'complete'] as const).indexOf(step)
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {idx + 1}
              </div>
              {idx < 3 && (
                <div
                  className={cn(
                    'w-12 h-0.5 mx-1',
                    idx < (['intro', 'scanning', 'review', 'complete'] as const).indexOf(step)
                      ? 'bg-primary'
                      : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Introduction */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Box className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Digitaler Zwilling Ihrer Wohnung</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Scannen Sie alle Räume, um ein präzises 3D-Inventar zu erstellen.
                  Dies ermöglicht uns einen garantierten Festpreis.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={scanMethod === 'lidar' ? 'default' : 'outline'}
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setScanMethod('lidar')}
                >
                  <Scan className="h-6 w-6" />
                  <span className="font-medium">3D-Scan (LiDAR)</span>
                  <span className="text-xs opacity-75">Präzise Volumenmessung</span>
                </Button>
                <Button
                  variant={scanMethod === 'video' ? 'default' : 'outline'}
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setScanMethod('video')}
                >
                  <Video className="h-6 w-6" />
                  <span className="font-medium">Video-Scan</span>
                  <span className="text-xs opacity-75">KI-Objekterkennung</span>
                </Button>
              </div>

              <Button onClick={() => setStep('scanning')} className="w-full">
                Scannen starten
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Scanning */}
          {step === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Room type selector */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Object.entries(ROOM_TYPE_CONFIG).slice(0, 8).map(([type, config]) => (
                  <Button
                    key={type}
                    variant={currentRoomType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentRoomType(type as RoomType)}
                    className="flex-shrink-0"
                  >
                    <span className="mr-1">{config.icon}</span>
                    {config.labelDe}
                  </Button>
                ))}
              </div>

              {/* Scanner */}
              <Tabs value={scanMethod} onValueChange={(v) => setScanMethod(v as 'video' | 'lidar')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="lidar">
                    <Scan className="h-4 w-4 mr-2" />
                    3D-Scan
                  </TabsTrigger>
                  <TabsTrigger value="video">
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="lidar" className="mt-4">
                  <EnhancedLiDARScanner
                    onScanComplete={handleLiDARComplete}
                    initialRoomType={currentRoomType}
                  />
                </TabsContent>
                <TabsContent value="video" className="mt-4">
                  <VideoInventoryScanner
                    onScanComplete={handleVideoComplete}
                    roomType={currentRoomType}
                  />
                </TabsContent>
              </Tabs>

              {/* Scanned rooms summary */}
              {scannedRooms.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Gescannte Räume ({scannedRooms.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {scannedRooms.map((room) => (
                      <div
                        key={room.id}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {room.method === 'lidar' ? '3D' : '📹'}
                          </Badge>
                          <span className="text-sm">{room.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {room.volume.toFixed(1)} m³
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeRoom(room.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('intro')}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
                {scannedRooms.length > 0 && (
                  <Button onClick={() => setStep('review')} className="flex-1">
                    Weiter zur Übersicht
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{scannedRooms.length}</p>
                  <p className="text-xs text-muted-foreground">Räume</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{totalVolume.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">m³ Volumen</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{totalItems}</p>
                  <p className="text-xs text-muted-foreground">Objekte</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Räume im Detail</h4>
                {scannedRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{room.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {room.items} Objekte • {room.volume.toFixed(1)} m³
                      </p>
                    </div>
                    <Badge variant={room.confidence > 0.8 ? 'default' : 'secondary'}>
                      {Math.round(room.confidence * 100)}%
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('scanning')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Raum hinzufügen
                </Button>
                <Button onClick={generateDigitalTwin} className="flex-1">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Digital Twin erstellen
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && digitalTwin && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-emerald-700">
                  Digital Twin erstellt!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ihr Umzugsvolumen wurde präzise erfasst
                </p>
              </div>

              <DigitalTwinDisplay digitalTwin={digitalTwin} />

              <Button onClick={() => setStep('intro')} variant="outline" className="w-full">
                Neuen Scan starten
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
});

export default InventoryOrchestrator;
