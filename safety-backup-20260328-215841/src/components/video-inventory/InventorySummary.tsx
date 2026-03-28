import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Truck, 
  Users, 
  Clock, 
  Scale,
  Box,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { 
  VideoInventorySession, 
  ROOM_TYPE_CONFIG,
  ITEM_CATEGORY_CONFIG,
  getConfidenceLevel,
  getConfidenceColor
} from '@/lib/video-inventory';

interface InventorySummaryProps {
  session: VideoInventorySession;
  showDetails?: boolean;
}

export function InventorySummary({ session, showDetails = true }: InventorySummaryProps) {
  const truckLabels: Record<VideoInventorySession['estimatedTruckSize'], string> = {
    transporter: 'Transporter (bis 10m³)',
    small: 'Kleiner LKW (bis 20m³)',
    medium: 'Mittlerer LKW (bis 35m³)',
    large: 'Grosser LKW (bis 50m³)',
    xl: 'XL LKW (über 50m³)'
  };

  const allItems = session.roomScans.flatMap(scan => scan.detectedItems);
  const categoryBreakdown = allItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgConfidence = session.roomScans.length > 0
    ? session.roomScans.reduce((sum, scan) => sum + scan.confidence, 0) / session.roomScans.length
    : 0;

  const confidenceLevel = getConfidenceLevel(avgConfidence);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Inventar-Zusammenfassung
          </span>
          <Badge className={getConfidenceColor(confidenceLevel)}>
            {Math.round(avgConfidence * 100)}% Genauigkeit
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted rounded-lg p-4 text-center">
            <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{session.totalItems}</p>
            <p className="text-sm text-muted-foreground">Objekte erkannt</p>
          </div>
          
          <div className="bg-muted rounded-lg p-4 text-center">
            <Box className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{session.totalVolume.toFixed(1)} m³</p>
            <p className="text-sm text-muted-foreground">Gesamtvolumen</p>
          </div>
          
          <div className="bg-muted rounded-lg p-4 text-center">
            <Scale className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{Math.round(session.totalWeight)} kg</p>
            <p className="text-sm text-muted-foreground">Geschätztes Gewicht</p>
          </div>
          
          <div className="bg-muted rounded-lg p-4 text-center">
            <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">~{session.estimatedBoxCount}</p>
            <p className="text-sm text-muted-foreground">Umzugskartons</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Unsere Empfehlung
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Fahrzeug</p>
                <p className="font-medium">{truckLabels[session.estimatedTruckSize]}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Team</p>
                <p className="font-medium">{session.estimatedCrewSize} Mitarbeiter</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Dauer</p>
                <p className="font-medium">~{session.estimatedDuration} Stunden</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Estimate */}
        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Geschätzter Preis</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                CHF {session.priceEstimate.min.toLocaleString()} - {session.priceEstimate.max.toLocaleString()}
              </p>
            </div>
            <Badge variant="secondary" className="text-green-700">
              Basierend auf AI-Analyse
            </Badge>
          </div>
        </div>

        {/* Room Breakdown */}
        {showDetails && session.roomScans.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Gescannte Räume ({session.roomScans.length})</h4>
            <div className="space-y-2">
              {session.roomScans.map(scan => {
                const roomConfig = ROOM_TYPE_CONFIG[scan.roomType];
                return (
                  <div 
                    key={scan.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{roomConfig.icon}</span>
                      <div>
                        <p className="font-medium">{scan.roomName}</p>
                        <p className="text-sm text-muted-foreground">
                          {scan.detectedItems.length} Objekte · {scan.totalVolume.toFixed(1)} m³
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {Math.round(scan.confidence * 100)}%
                      </Badge>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {showDetails && Object.keys(categoryBreakdown).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Kategorien</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([category, count]) => {
                  const config = ITEM_CATEGORY_CONFIG[category as keyof typeof ITEM_CATEGORY_CONFIG];
                  return (
                    <div 
                      key={category}
                      className="flex items-center gap-2 p-2 bg-muted/50 rounded-md"
                    >
                      <span>{config?.icon || '📦'}</span>
                      <span className="text-sm flex-1 truncate">{config?.labelDe || category}</span>
                      <Badge variant="secondary" className="text-xs">{count}</Badge>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InventorySummary;
