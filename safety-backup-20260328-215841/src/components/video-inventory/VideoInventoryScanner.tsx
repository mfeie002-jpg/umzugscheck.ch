import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Camera, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { 
  RoomType, 
  ROOM_TYPE_CONFIG, 
  RoomScan,
  generateRoomId,
  mockDetectItems,
  calculateTotalVolume,
  calculateTotalWeight
} from '@/lib/video-inventory';

interface VideoInventoryScannerProps {
  onScanComplete?: (scan: RoomScan) => void;
  roomType?: RoomType;
}

export function VideoInventoryScanner({ 
  onScanComplete,
  roomType = 'living_room'
}: VideoInventoryScannerProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomType>(roomType);
  const [scanStatus, setScanStatus] = useState<'idle' | 'recording' | 'processing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentScan, setCurrentScan] = useState<RoomScan | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const roomConfig = ROOM_TYPE_CONFIG[selectedRoom];

  const startRecording = async () => {
    setScanStatus('recording');
    setRecordingTime(0);
    setProgress(0);
    
    // Simulate recording timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        // Auto-stop after 60 seconds
        if (newTime >= 60) {
          stopRecording();
        }
        return newTime;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    processVideo();
  };

  const processVideo = async () => {
    setScanStatus('processing');
    
    // Simulate AI processing
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setProgress(i);
    }

    // Generate mock detected items
    const detectedItems = mockDetectItems(selectedRoom);
    const totalVolume = calculateTotalVolume(detectedItems);
    const totalWeight = calculateTotalWeight(detectedItems);

    const scan: RoomScan = {
      id: generateRoomId(),
      roomName: roomConfig.labelDe,
      roomType: selectedRoom,
      duration: recordingTime,
      detectedItems,
      totalVolume,
      totalWeight,
      scanStatus: 'completed',
      confidence: 0.85 + Math.random() * 0.1,
      createdAt: new Date(),
      completedAt: new Date()
    };

    setCurrentScan(scan);
    setScanStatus('completed');
    onScanComplete?.(scan);
  };

  const resetScanner = () => {
    setScanStatus('idle');
    setProgress(0);
    setRecordingTime(0);
    setCurrentScan(null);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Video Inventar-Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Room Selection */}
        {scanStatus === 'idle' && (
          <div className="space-y-4">
            <label className="text-sm font-medium">Raum auswählen:</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Object.entries(ROOM_TYPE_CONFIG).map(([type, config]) => (
                <Button
                  key={type}
                  variant={selectedRoom === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRoom(type as RoomType)}
                  className="flex flex-col h-auto py-3"
                >
                  <span className="text-lg mb-1">{config.icon}</span>
                  <span className="text-xs">{config.labelDe}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Video Preview Area */}
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          {scanStatus === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <Camera className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-sm">Video aufnehmen oder hochladen</p>
              <p className="text-xs mt-1">Gehen Sie langsam durch den Raum</p>
            </div>
          )}

          {scanStatus === 'recording' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-2xl font-mono">{formatTime(recordingTime)}</span>
              </div>
              <Video className="h-12 w-12 animate-pulse" />
              <p className="mt-4 text-sm opacity-75">
                Schwenken Sie langsam durch {roomConfig.labelDe}...
              </p>
            </div>
          )}

          {scanStatus === 'processing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="font-medium mb-2">KI analysiert Video...</p>
              <div className="w-48">
                <Progress value={progress} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
            </div>
          )}

          {scanStatus === 'completed' && currentScan && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
              <p className="font-medium text-green-700 dark:text-green-400 mb-2">
                Scan abgeschlossen!
              </p>
              <div className="flex gap-4 text-sm">
                <Badge variant="secondary">
                  {currentScan.detectedItems.length} Objekte
                </Badge>
                <Badge variant="secondary">
                  {currentScan.totalVolume.toFixed(1)} m³
                </Badge>
                <Badge variant="secondary">
                  {Math.round(currentScan.confidence * 100)}% Genauigkeit
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          {scanStatus === 'idle' && (
            <>
              <Button onClick={startRecording} size="lg">
                <Video className="mr-2 h-4 w-4" />
                Video aufnehmen
              </Button>
              <Button variant="outline" size="lg">
                <Upload className="mr-2 h-4 w-4" />
                Hochladen
              </Button>
            </>
          )}

          {scanStatus === 'recording' && (
            <Button onClick={stopRecording} variant="destructive" size="lg">
              <Pause className="mr-2 h-4 w-4" />
              Aufnahme beenden
            </Button>
          )}

          {scanStatus === 'completed' && (
            <>
              <Button onClick={resetScanner} variant="outline" size="lg">
                <RotateCcw className="mr-2 h-4 w-4" />
                Nochmal scannen
              </Button>
              <Button size="lg">
                <CheckCircle className="mr-2 h-4 w-4" />
                Weiter
              </Button>
            </>
          )}
        </div>

        {/* Tips */}
        {scanStatus === 'idle' && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              Tipps für beste Ergebnisse:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Gehen Sie langsam und gleichmässig durch den Raum</li>
              <li>• Halten Sie die Kamera stabil (Querformat empfohlen)</li>
              <li>• Sorgen Sie für gute Beleuchtung</li>
              <li>• Scannen Sie alle Ecken und Schränke</li>
            </ul>
          </div>
        )}

        {/* Detected Items Preview */}
        {scanStatus === 'completed' && currentScan && (
          <div className="space-y-3">
            <h4 className="font-medium">Erkannte Objekte ({currentScan.detectedItems.length}):</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {currentScan.detectedItems.slice(0, 12).map(item => (
                <div 
                  key={item.id}
                  className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm"
                >
                  <span>{ROOM_TYPE_CONFIG[selectedRoom].icon}</span>
                  <span className="truncate">{item.name}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {Math.round(item.confidence * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
            {currentScan.detectedItems.length > 12 && (
              <p className="text-sm text-muted-foreground text-center">
                +{currentScan.detectedItems.length - 12} weitere Objekte
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default VideoInventoryScanner;
