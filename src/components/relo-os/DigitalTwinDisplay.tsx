/**
 * Digital Twin Display Component
 * 
 * Visualizes the scanned inventory as a "Digital Twin" with
 * volume, weight, truck size, and room breakdown.
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Package, 
  Truck, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Boxes,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { DigitalTwin, RoomInventory } from '@/lib/move-project';

interface DigitalTwinDisplayProps {
  digitalTwin: DigitalTwin;
  className?: string;
}

const truckSizeLabels: Record<string, { name: string; icon: string; capacity: string }> = {
  transporter: { name: 'Kleinbus', icon: '🚐', capacity: '5-10 m³' },
  small: { name: 'Transporter', icon: '🚚', capacity: '10-15 m³' },
  medium: { name: 'LKW 7.5t', icon: '🚛', capacity: '20-30 m³' },
  large: { name: 'LKW 12t', icon: '🚛', capacity: '35-50 m³' },
  xl: { name: 'Sattelzug', icon: '🚛', capacity: '60+ m³' },
};

export const DigitalTwinDisplay = memo(function DigitalTwinDisplay({
  digitalTwin,
  className,
}: DigitalTwinDisplayProps) {
  const truckInfo = truckSizeLabels[digitalTwin.recommendedTruckSize] || truckSizeLabels.medium;
  const confidencePercent = Math.round(digitalTwin.confidence * 100);
  
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-blue-500/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Box className="h-5 w-5 text-primary" />
            Ihr Digitaler Zwilling
          </CardTitle>
          <Badge 
            variant={confidencePercent >= 80 ? 'default' : 'secondary'}
            className={cn(
              confidencePercent >= 80 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-amber-100 text-amber-700'
            )}
          >
            {confidencePercent}% Genauigkeit
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-5">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<Boxes className="h-5 w-5" />}
            label="Volumen"
            value={`${digitalTwin.totalVolume} m³`}
            color="text-blue-600"
          />
          <MetricCard
            icon={<Package className="h-5 w-5" />}
            label="Gewicht"
            value={`${Math.round(digitalTwin.totalWeight / 100) * 100} kg`}
            color="text-purple-600"
          />
          <MetricCard
            icon={<Box className="h-5 w-5" />}
            label="Kartons"
            value={`~${digitalTwin.estimatedBoxes}`}
            color="text-amber-600"
          />
          <MetricCard
            icon={<Clock className="h-5 w-5" />}
            label="Dauer"
            value={`~${digitalTwin.estimatedDuration}h`}
            color="text-emerald-600"
          />
        </div>
        
        {/* Truck Recommendation */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{truckInfo.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Empfohlenes Fahrzeug</span>
              </div>
              <p className="text-lg font-bold">{truckInfo.name}</p>
              <p className="text-sm text-muted-foreground">{truckInfo.capacity}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{digitalTwin.recommendedCrewSize} Personen</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Room Breakdown */}
        {digitalTwin.rooms.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Raumübersicht
            </h4>
            <div className="space-y-2">
              {digitalTwin.rooms.map((room) => (
                <RoomRow key={room.id} room={room} totalVolume={digitalTwin.totalVolume} />
              ))}
            </div>
          </div>
        )}
        
        {/* Special Handling Alerts */}
        {digitalTwin.specialHandling.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium text-sm">Spezielle Behandlung erforderlich</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {digitalTwin.specialHandling.map((item, idx) => (
                <Badge key={idx} variant="outline" className="border-amber-300 text-amber-700">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Fragility Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Empfindlichkeits-Index</span>
            <span className={cn(
              'font-medium',
              digitalTwin.fragilityScore > 70 ? 'text-red-600' :
              digitalTwin.fragilityScore > 40 ? 'text-amber-600' : 'text-emerald-600'
            )}>
              {digitalTwin.fragilityScore}/100
            </span>
          </div>
          <Progress 
            value={digitalTwin.fragilityScore} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground">
            {digitalTwin.fragilityScore > 70 
              ? 'Viele empfindliche Gegenstände - wir empfehlen Premium-Schutz'
              : digitalTwin.fragilityScore > 40
              ? 'Einige empfindliche Gegenstände erkannt'
              : 'Standard-Verpackung ausreichend'}
          </p>
        </div>
        
        {/* Scan Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span>{digitalTwin.totalItems} Gegenstände erfasst</span>
          </div>
          <span>
            Scan: {new Date(digitalTwin.scannedAt).toLocaleDateString('de-CH')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
});

// Helper Components

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const MetricCard = memo(function MetricCard({ icon, label, value, color }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-muted/30 rounded-lg p-3 text-center"
    >
      <div className={cn('mx-auto mb-1', color)}>{icon}</div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </motion.div>
  );
});

interface RoomRowProps {
  room: RoomInventory;
  totalVolume: number;
}

const RoomRow = memo(function RoomRow({ room, totalVolume }: RoomRowProps) {
  const volumePercent = Math.round((room.volume / totalVolume) * 100);
  
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-24 truncate font-medium">{room.name}</div>
      <div className="flex-1">
        <Progress value={volumePercent} className="h-2" />
      </div>
      <div className="w-16 text-right text-muted-foreground">
        {room.volume.toFixed(1)} m³
      </div>
    </div>
  );
});

export default DigitalTwinDisplay;
