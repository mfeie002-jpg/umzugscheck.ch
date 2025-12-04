import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Package, Box, Home, Archive, CheckCircle, 
  Clock, AlertCircle, PackageOpen
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  icon: string;
  totalItems: number;
  packedItems: number;
  boxes: number;
}

export const PackingProgressTracker = () => {
  const [rooms, setRooms] = useState<Room[]>([
    { id: "living", name: "Wohnzimmer", icon: "🛋️", totalItems: 25, packedItems: 0, boxes: 0 },
    { id: "bedroom", name: "Schlafzimmer", icon: "🛏️", totalItems: 20, packedItems: 0, boxes: 0 },
    { id: "kitchen", name: "Küche", icon: "🍳", totalItems: 40, packedItems: 0, boxes: 0 },
    { id: "bathroom", name: "Badezimmer", icon: "🚿", totalItems: 15, packedItems: 0, boxes: 0 },
    { id: "office", name: "Büro/Arbeitszimmer", icon: "💼", totalItems: 20, packedItems: 0, boxes: 0 },
    { id: "storage", name: "Abstellraum/Keller", icon: "📦", totalItems: 30, packedItems: 0, boxes: 0 },
  ]);

  const updateRoom = (id: string, packedItems: number, boxes: number) => {
    setRooms(rooms.map(room =>
      room.id === id ? { ...room, packedItems, boxes } : room
    ));
  };

  const incrementPacked = (id: string, amount: number) => {
    const room = rooms.find(r => r.id === id);
    if (!room) return;
    const newPacked = Math.min(room.totalItems, Math.max(0, room.packedItems + amount));
    updateRoom(id, newPacked, room.boxes);
  };

  const incrementBoxes = (id: string, amount: number) => {
    const room = rooms.find(r => r.id === id);
    if (!room) return;
    const newBoxes = Math.max(0, room.boxes + amount);
    updateRoom(id, room.packedItems, newBoxes);
  };

  const totalItems = rooms.reduce((sum, r) => sum + r.totalItems, 0);
  const totalPacked = rooms.reduce((sum, r) => sum + r.packedItems, 0);
  const totalBoxes = rooms.reduce((sum, r) => sum + r.boxes, 0);
  const overallProgress = Math.round((totalPacked / totalItems) * 100);

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'text-green-600';
    if (progress >= 50) return 'text-blue-600';
    if (progress >= 25) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Pack-Fortschritt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="p-4 bg-primary/5 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Gesamtfortschritt</span>
            <span className={`text-2xl font-bold ${getProgressColor(overallProgress)}`}>
              {overallProgress}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
            <span>{totalPacked} von {totalItems} Gegenständen</span>
            <span>{totalBoxes} Kartons gepackt</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {overallProgress === 100 ? (
            <Badge className="bg-green-100 text-green-700 gap-1">
              <CheckCircle className="h-3 w-3" />
              Alles gepackt!
            </Badge>
          ) : overallProgress >= 75 ? (
            <Badge className="bg-blue-100 text-blue-700 gap-1">
              <PackageOpen className="h-3 w-3" />
              Fast fertig!
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              In Arbeit
            </Badge>
          )}
        </div>

        {/* Room List */}
        <div className="space-y-4">
          {rooms.map(room => {
            const progress = Math.round((room.packedItems / room.totalItems) * 100);
            const isComplete = progress === 100;
            
            return (
              <div
                key={room.id}
                className={`p-4 rounded-lg border transition-colors ${
                  isComplete 
                    ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30' 
                    : 'border-border/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{room.icon}</span>
                    <span className="font-medium">{room.name}</span>
                  </div>
                  <span className={`font-medium ${getProgressColor(progress)}`}>
                    {progress}%
                  </span>
                </div>

                <Progress value={progress} className="h-2 mb-3" />

                <div className="grid grid-cols-2 gap-4">
                  {/* Items Packed */}
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Gegenstände gepackt</div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => incrementPacked(room.id, -1)}
                        disabled={room.packedItems === 0}
                      >
                        -
                      </Button>
                      <span className="w-16 text-center font-medium">
                        {room.packedItems}/{room.totalItems}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => incrementPacked(room.id, 1)}
                        disabled={room.packedItems === room.totalItems}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Boxes Used */}
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Kartons verwendet</div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => incrementBoxes(room.id, -1)}
                        disabled={room.boxes === 0}
                      >
                        -
                      </Button>
                      <span className="w-16 text-center font-medium flex items-center justify-center gap-1">
                        <Box className="h-4 w-4" />
                        {room.boxes}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => incrementBoxes(room.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm text-amber-700 dark:text-amber-400">
                Pack-Tipps
              </h4>
              <ul className="text-xs text-amber-600 dark:text-amber-500 mt-1 space-y-1">
                <li>• Schwere Sachen in kleine Kartons</li>
                <li>• Jeden Karton beschriften (Raum + Inhalt)</li>
                <li>• Zerbrechliches mit Papier polstern</li>
                <li>• Eine "Erster-Tag-Box" packen</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackingProgressTracker;
