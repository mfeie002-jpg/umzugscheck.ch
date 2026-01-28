/**
 * LiDAR Depth Scanner Component
 * 
 * Simulates LiDAR depth sensing for accurate volume estimation.
 * In production, this would integrate with device LiDAR APIs.
 */

import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scan, 
  Box, 
  Ruler, 
  Camera, 
  CheckCircle2, 
  Loader2,
  RefreshCw,
  Maximize2,
  Cuboid,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LiDARDepthScannerProps {
  onScanComplete?: (result: LiDARScanResult) => void;
  className?: string;
}

export interface LiDARScanResult {
  roomVolume: number;       // Total room volume in m³
  usableVolume: number;     // Volume occupied by items
  depthPoints: number;      // Number of depth points captured
  accuracy: number;         // 0-1 confidence
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  detectedObjects: DetectedObject[];
  scanDuration: number;     // Seconds
}

interface DetectedObject {
  id: string;
  type: string;
  volume: number;
  position: { x: number; y: number; z: number };
  confidence: number;
}

type ScanPhase = 'idle' | 'calibrating' | 'scanning' | 'processing' | 'complete';

export const LiDARDepthScanner = memo(function LiDARDepthScanner({
  onScanComplete,
  className,
}: LiDARDepthScannerProps) {
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<LiDARScanResult | null>(null);
  const [scanPoints, setScanPoints] = useState(0);
  
  const startScan = useCallback(async () => {
    setPhase('calibrating');
    setProgress(0);
    setScanPoints(0);
    
    // Phase 1: Calibrating (1.5s)
    await simulatePhase(1500, (p) => setProgress(p * 0.15));
    
    // Phase 2: Scanning (3s)
    setPhase('scanning');
    let points = 0;
    const scanInterval = setInterval(() => {
      points += Math.floor(Math.random() * 5000) + 3000;
      setScanPoints(points);
    }, 200);
    
    await simulatePhase(3000, (p) => setProgress(0.15 + p * 0.6));
    clearInterval(scanInterval);
    
    // Phase 3: Processing (2s)
    setPhase('processing');
    await simulatePhase(2000, (p) => setProgress(0.75 + p * 0.25));
    
    // Generate result
    const scanResult = generateScanResult(points);
    setResult(scanResult);
    setPhase('complete');
    
    onScanComplete?.(scanResult);
  }, [onScanComplete]);
  
  const resetScan = useCallback(() => {
    setPhase('idle');
    setProgress(0);
    setScanPoints(0);
    setResult(null);
  }, []);
  
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cuboid className="h-5 w-5 text-primary" />
          LiDAR Tiefenscan
          <Badge variant="outline" className="ml-auto text-xs">
            3D-Erfassung
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Scanner Visualization */}
        <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-blue-500/10 rounded-lg overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              >
                <div className="p-4 rounded-full bg-primary/10">
                  <Scan className="h-10 w-10 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground text-center px-4">
                  Richten Sie die Kamera auf den Raum für einen präzisen 3D-Scan
                </p>
              </motion.div>
            )}
            
            {(phase === 'calibrating' || phase === 'scanning') && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {/* Scan Grid Overlay */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-px opacity-30">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="bg-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: Math.random() }}
                      transition={{ 
                        delay: i * 0.02, 
                        repeat: Infinity, 
                        repeatType: 'reverse',
                        duration: 0.5 
                      }}
                    />
                  ))}
                </div>
                
                {/* Scanning Line */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                  initial={{ top: 0 }}
                  animate={{ top: '100%' }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: 'linear' 
                  }}
                />
                
                {/* Center Info */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                  <p className="text-sm font-medium">
                    {phase === 'calibrating' ? 'Kalibriere Sensoren...' : 'Erfasse Tiefendaten...'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {scanPoints.toLocaleString()} Punkte erfasst
                  </p>
                </div>
              </motion.div>
            )}
            
            {phase === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <div className="relative">
                  <Box className="h-12 w-12 text-primary" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Maximize2 className="h-12 w-12 text-primary/50" />
                  </motion.div>
                </div>
                <p className="text-sm font-medium mt-3">
                  Erstelle 3D-Modell...
                </p>
              </motion.div>
            )}
            
            {phase === 'complete' && result && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-50/50 dark:bg-emerald-950/20"
              >
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3" />
                <p className="font-medium text-emerald-700 dark:text-emerald-400">
                  Scan abgeschlossen
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span>{result.depthPoints.toLocaleString()} Punkte</span>
                  <span>•</span>
                  <span>{Math.round(result.accuracy * 100)}% Genauigkeit</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Progress Bar */}
        {phase !== 'idle' && phase !== 'complete' && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {phase === 'calibrating' && 'Kalibrierung...'}
                {phase === 'scanning' && 'Tiefenscan...'}
                {phase === 'processing' && 'Verarbeitung...'}
              </span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <Progress value={progress * 100} className="h-2" />
          </div>
        )}
        
        {/* Results Display */}
        {result && phase === 'complete' && (
          <div className="grid grid-cols-2 gap-3">
            <ResultMetric
              icon={<Box className="h-4 w-4" />}
              label="Raumvolumen"
              value={`${result.roomVolume.toFixed(1)} m³`}
            />
            <ResultMetric
              icon={<Cuboid className="h-4 w-4" />}
              label="Nutzvolumen"
              value={`${result.usableVolume.toFixed(1)} m³`}
            />
            <ResultMetric
              icon={<Ruler className="h-4 w-4" />}
              label="Dimensionen"
              value={`${result.dimensions.width}×${result.dimensions.length}×${result.dimensions.height}m`}
            />
            <ResultMetric
              icon={<Camera className="h-4 w-4" />}
              label="Objekte"
              value={`${result.detectedObjects.length} erkannt`}
            />
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {phase === 'idle' && (
            <Button onClick={startScan} className="flex-1">
              <Scan className="h-4 w-4 mr-2" />
              3D-Scan starten
            </Button>
          )}
          
          {phase === 'complete' && (
            <>
              <Button onClick={resetScan} variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Erneut scannen
              </Button>
              <Button className="flex-1">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Übernehmen
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

// Helper Components

interface ResultMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const ResultMetric = memo(function ResultMetric({ icon, label, value }: ResultMetricProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-3 text-center">
      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-bold text-sm">{value}</p>
    </div>
  );
});

// Utility Functions

function simulatePhase(duration: number, onProgress: (p: number) => void): Promise<void> {
  return new Promise((resolve) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(1, elapsed / duration);
      onProgress(progress);
      
      if (progress >= 1) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

function generateScanResult(points: number): LiDARScanResult {
  // Simulate realistic scan results
  const width = 3 + Math.random() * 3;
  const length = 4 + Math.random() * 4;
  const height = 2.4 + Math.random() * 0.4;
  const roomVolume = width * length * height;
  
  // Usable volume is typically 30-60% of room volume
  const fillRatio = 0.3 + Math.random() * 0.3;
  const usableVolume = roomVolume * fillRatio;
  
  // Generate some detected objects
  const objectTypes = ['Sofa', 'Tisch', 'Schrank', 'Bett', 'Regal', 'Stuhl', 'Kommode'];
  const numObjects = 3 + Math.floor(Math.random() * 5);
  const detectedObjects: DetectedObject[] = Array.from({ length: numObjects }, (_, i) => ({
    id: `obj_${i}`,
    type: objectTypes[Math.floor(Math.random() * objectTypes.length)],
    volume: 0.2 + Math.random() * 1.5,
    position: { 
      x: Math.random() * width, 
      y: Math.random() * length, 
      z: Math.random() * 1.5 
    },
    confidence: 0.75 + Math.random() * 0.2,
  }));
  
  return {
    roomVolume: Math.round(roomVolume * 10) / 10,
    usableVolume: Math.round(usableVolume * 10) / 10,
    depthPoints: points,
    accuracy: 0.85 + Math.random() * 0.12,
    dimensions: {
      width: Math.round(width * 10) / 10,
      length: Math.round(length * 10) / 10,
      height: Math.round(height * 10) / 10,
    },
    detectedObjects,
    scanDuration: 6.5,
  };
}

export default LiDARDepthScanner;
