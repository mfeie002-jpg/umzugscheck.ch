/**
 * GPS Tracking Map Component
 * 
 * Phase 5: Real-time moving truck location display
 * with ETA and status updates.
 */

import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Truck,
  Clock,
  Phone,
  Users,
  Navigation,
  RefreshCw,
  CheckCircle2,
  Package,
  Home,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  TrackingSession,
  ETAUpdate,
  calculateETA,
  getCrewUpdates,
  CrewUpdate,
} from '@/lib/gps-tracking';

interface GPSTrackingMapProps {
  session: TrackingSession;
  destinationCoords?: { lat: number; lng: number };
  onRefresh?: () => void;
  onCallCrew?: () => void;
  className?: string;
}

const statusConfig: Record<TrackingSession['status'], { label: string; color: string; icon: React.ReactNode }> = {
  scheduled: {
    label: 'Geplant',
    color: 'bg-muted text-muted-foreground',
    icon: <Clock className="h-4 w-4" />,
  },
  en_route_pickup: {
    label: 'Unterwegs zur Abholung',
    color: 'bg-blue-500 text-white',
    icon: <Navigation className="h-4 w-4" />,
  },
  loading: {
    label: 'Wird eingeladen',
    color: 'bg-amber-500 text-white',
    icon: <Package className="h-4 w-4" />,
  },
  in_transit: {
    label: 'Auf dem Weg',
    color: 'bg-primary text-primary-foreground',
    icon: <Truck className="h-4 w-4" />,
  },
  unloading: {
    label: 'Wird ausgeladen',
    color: 'bg-purple-500 text-white',
    icon: <Home className="h-4 w-4" />,
  },
  completed: {
    label: 'Abgeschlossen',
    color: 'bg-emerald-500 text-white',
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
};

const statusProgress: Record<TrackingSession['status'], number> = {
  scheduled: 0,
  en_route_pickup: 15,
  loading: 35,
  in_transit: 60,
  unloading: 85,
  completed: 100,
};

export const GPSTrackingMap = memo(function GPSTrackingMap({
  session,
  destinationCoords,
  onRefresh,
  onCallCrew,
  className,
}: GPSTrackingMapProps) {
  const [eta, setEta] = useState<ETAUpdate | null>(null);
  const [updates, setUpdates] = useState<CrewUpdate[]>([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  const status = statusConfig[session.status];
  const progress = statusProgress[session.status];
  
  // Calculate ETA when position changes
  useEffect(() => {
    if (session.currentPosition && destinationCoords) {
      const newEta = calculateETA(
        session.currentPosition,
        destinationCoords.lat,
        destinationCoords.lng
      );
      setEta(newEta);
    }
  }, [session.currentPosition, destinationCoords]);
  
  // Load crew updates
  useEffect(() => {
    const crewUpdates = getCrewUpdates(session.id);
    setUpdates(crewUpdates);
  }, [session.id]);
  
  const handleRefresh = () => {
    setLastRefresh(new Date());
    onRefresh?.();
  };
  
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('de-CH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-blue-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Truck className="h-5 w-5 text-primary" />
            Live-Tracking
          </CardTitle>
          <Badge className={status.color}>
            {status.icon}
            <span className="ml-1">{status.label}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fortschritt</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Abholung</span>
            <span>Unterwegs</span>
            <span>Ankunft</span>
          </div>
        </div>
        
        {/* Map Placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-lg overflow-hidden">
          {/* Animated truck */}
          <motion.div
            className="absolute"
            initial={{ left: '20%', top: '60%' }}
            animate={{
              left: session.status === 'completed' ? '75%' : `${20 + progress * 0.55}%`,
              top: `${60 - progress * 0.3}%`,
            }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
              <div className="relative bg-primary text-white p-2 rounded-full">
                <Truck className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
          
          {/* Origin marker */}
          <div className="absolute left-[15%] top-[65%]">
            <MapPin className="h-6 w-6 text-emerald-500" />
          </div>
          
          {/* Destination marker */}
          <div className="absolute right-[15%] top-[25%]">
            <MapPin className="h-6 w-6 text-red-500" />
          </div>
          
          {/* Route line */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <path
              d="M 15% 65% Q 50% 45% 85% 25%"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="8 4"
              className="text-primary/30"
            />
          </svg>
          
          {/* Current position */}
          {session.currentPosition && (
            <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-black/80 rounded-lg px-2 py-1 text-xs">
              <span className="text-muted-foreground">Position aktualisiert: </span>
              <span>{formatTime(session.currentPosition.timestamp)}</span>
            </div>
          )}
        </div>
        
        {/* ETA Display */}
        {eta && session.status !== 'completed' && (
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Geschätzte Ankunft</p>
                <p className="text-2xl font-bold">{formatTime(eta.estimatedArrival)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Verbleibend</p>
                <p className="text-lg font-medium">{eta.distanceRemaining} km</p>
              </div>
            </div>
            
            {eta.trafficConditions !== 'normal' && (
              <div className="flex items-center gap-2 mt-2 text-sm">
                <AlertCircle className={cn(
                  'h-4 w-4',
                  eta.trafficConditions === 'heavy' ? 'text-amber-500' : 'text-yellow-500'
                )} />
                <span>
                  {eta.trafficConditions === 'heavy' 
                    ? 'Starker Verkehr' 
                    : 'Mässiger Verkehr'}
                  {eta.delayMinutes > 0 && ` (+${eta.delayMinutes} Min)`}
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* Crew Info */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{session.crewLeadName}</p>
                <p className="text-sm text-muted-foreground">
                  {session.crewSize} Personen • {session.vehiclePlate}
                </p>
              </div>
            </div>
            
            {onCallCrew && (
              <Button variant="outline" size="sm" onClick={onCallCrew}>
                <Phone className="h-4 w-4 mr-1" />
                Anrufen
              </Button>
            )}
          </div>
        </div>
        
        {/* Recent Updates */}
        {updates.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Letzte Updates</h4>
            <AnimatePresence>
              {updates.slice(-3).reverse().map((update, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 text-sm bg-muted/30 rounded-lg p-2"
                >
                  <span className="text-muted-foreground">
                    {formatTime(update.timestamp)}
                  </span>
                  <span>{update.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {/* Addresses */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Von</p>
            <p className="font-medium">{session.originAddress}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Nach</p>
            <p className="font-medium">{session.destinationAddress}</p>
          </div>
        </div>
        
        {/* Refresh Button */}
        <Button variant="outline" className="w-full" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Position aktualisieren
          <span className="ml-auto text-xs text-muted-foreground">
            {formatTime(lastRefresh.toISOString())}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
});

export default GPSTrackingMap;
