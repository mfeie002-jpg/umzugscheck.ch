/**
 * Phase 5b: Live Tracking Panel
 * 
 * Real-time GPS tracking and status updates during the move.
 * Shows truck location, crew status, and timeline updates.
 */

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  MapPin,
  Clock,
  Camera,
  MessageSquare,
  CheckCircle2,
  Circle,
  Phone,
  Navigation,
  RefreshCw,
  Package,
  Home,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface TrackingUpdate {
  id: string;
  timestamp: string;
  type: 'status' | 'location' | 'photo' | 'message';
  title: string;
  description?: string;
  photoUrl?: string;
  coordinates?: { lat: number; lng: number };
}

export interface CrewMember {
  id: string;
  name: string;
  role: 'driver' | 'mover' | 'lead';
  avatarUrl?: string;
  phone?: string;
}

export interface LiveTrackingPanelProps {
  moveProjectId: string;
  providerName: string;
  crew: CrewMember[];
  updates: TrackingUpdate[];
  currentStatus: 'preparing' | 'loading' | 'in_transit' | 'unloading' | 'completed';
  estimatedArrival?: string;
  origin: { city: string; street: string };
  destination: { city: string; street: string };
  onRefresh?: () => void;
  onContactCrew?: (memberId: string) => void;
  className?: string;
}

const STATUS_STEPS = [
  { id: 'preparing', label: 'Vorbereitung', icon: Package },
  { id: 'loading', label: 'Beladung', icon: Home },
  { id: 'in_transit', label: 'Unterwegs', icon: Truck },
  { id: 'unloading', label: 'Entladung', icon: Package },
  { id: 'completed', label: 'Abgeschlossen', icon: CheckCircle2 },
];

export const LiveTrackingPanel = memo(function LiveTrackingPanel({
  moveProjectId,
  providerName,
  crew,
  updates,
  currentStatus,
  estimatedArrival,
  origin,
  destination,
  onRefresh,
  onContactCrew,
  className,
}: LiveTrackingPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === currentStatus);
  const progressPercent = ((currentStepIndex + 1) / STATUS_STEPS.length) * 100;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('de-CH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Live Tracking
            </CardTitle>
            <div className="flex items-center gap-2">
              {currentStatus === 'in_transit' && (
                <Badge className="bg-blue-500 animate-pulse">
                  <Navigation className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Route Summary */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{origin.city}</span>
                <span className="text-muted-foreground truncate">{origin.street}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center gap-2 justify-end text-sm">
                <span className="text-muted-foreground truncate">{destination.street}</span>
                <span className="font-medium">{destination.city}</span>
                <MapPin className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div>
            <div className="flex justify-between mb-2">
              {STATUS_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStatus;
                const isCompleted = index < currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      'flex flex-col items-center',
                      isCompleted && 'text-emerald-600',
                      isActive && 'text-primary',
                      !isActive && !isCompleted && 'text-muted-foreground'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center',
                        isCompleted && 'bg-emerald-500 text-white',
                        isActive && 'bg-primary text-white',
                        !isActive && !isCompleted && 'bg-muted'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs mt-1 hidden sm:block">{step.label}</span>
                  </div>
                );
              })}
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* ETA */}
          {estimatedArrival && currentStatus === 'in_transit' && (
            <div className="flex items-center justify-center gap-2 p-3 bg-blue-500/10 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Geschätzte Ankunft: {formatTime(estimatedArrival)}
              </span>
            </div>
          )}

          {/* Crew Section */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <span>Team</span>
              <Badge variant="outline" className="text-xs">{providerName}</Badge>
            </h4>
            <div className="flex gap-2">
              {crew.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col items-center p-2 bg-muted/50 rounded-lg flex-1"
                >
                  <Avatar className="h-10 w-10 mb-1">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium truncate max-w-full">
                    {member.name.split(' ')[0]}
                  </span>
                  <Badge variant="outline" className="text-xs mt-1">
                    {member.role === 'lead' ? 'Leiter' : member.role === 'driver' ? 'Fahrer' : 'Helfer'}
                  </Badge>
                  {member.phone && onContactCrew && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 h-6 px-2"
                      onClick={() => onContactCrew(member.id)}
                    >
                      <Phone className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Updates */}
          <div>
            <h4 className="text-sm font-medium mb-3">Aktualisierungen</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {updates.slice().reverse().map((update, index) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3"
                  >
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-3 h-3 rounded-full',
                          index === 0 ? 'bg-primary' : 'bg-muted-foreground/30'
                        )}
                      />
                      {index < updates.length - 1 && (
                        <div className="w-0.5 h-full bg-muted-foreground/20 mt-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(update.timestamp)}
                        </span>
                        {update.type === 'photo' && (
                          <Camera className="h-3 w-3 text-blue-500" />
                        )}
                        {update.type === 'message' && (
                          <MessageSquare className="h-3 w-3 text-purple-500" />
                        )}
                        {update.type === 'location' && (
                          <Navigation className="h-3 w-3 text-emerald-500" />
                        )}
                      </div>
                      <p className="text-sm font-medium">{update.title}</p>
                      {update.description && (
                        <p className="text-xs text-muted-foreground">{update.description}</p>
                      )}
                      {update.photoUrl && (
                        <img
                          src={update.photoUrl}
                          alt={update.title}
                          className="mt-2 rounded-lg max-h-32 object-cover"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default LiveTrackingPanel;
