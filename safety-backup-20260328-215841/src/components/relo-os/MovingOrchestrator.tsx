/**
 * Moving Orchestrator Component
 * 
 * Phase 5: Complete moving day experience with:
 * - Live GPS Tracking
 * - ETA Updates
 * - Crew Communication
 * - Status Timeline
 * - Customer Notifications
 */

import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Camera,
  CheckCircle2,
  Navigation,
  RefreshCw,
  Share2,
  Bell,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { GPSTrackingMap } from './GPSTrackingMap';
import { LiveTrackingPanel, TrackingUpdate, CrewMember } from './LiveTrackingPanel';
import {
  TrackingSession,
  ETAUpdate,
  CrewUpdate,
  getTrackingSession,
  generateDemoTrackingData,
  calculateETA,
  addCrewUpdate,
  getCrewUpdates,
  updateTrackingStatus,
} from '@/lib/gps-tracking';
import { MoveProject } from '@/lib/move-project';

interface MovingOrchestratorProps {
  project: MoveProject;
  providerId: string;
  providerName: string;
  onComplete?: () => void;
  className?: string;
}

const STATUS_LABELS: Record<TrackingSession['status'], string> = {
  scheduled: 'Termin bestätigt',
  en_route_pickup: 'Team unterwegs',
  loading: 'Beladung läuft',
  in_transit: 'Auf dem Weg',
  unloading: 'Entladung läuft',
  completed: 'Abgeschlossen',
};

const STATUS_ICONS: Record<TrackingSession['status'], typeof Truck> = {
  scheduled: Clock,
  en_route_pickup: Truck,
  loading: MapPin,
  in_transit: Navigation,
  unloading: MapPin,
  completed: CheckCircle2,
};

const STATUS_ORDER: TrackingSession['status'][] = [
  'scheduled',
  'en_route_pickup',
  'loading',
  'in_transit',
  'unloading',
  'completed',
];

export const MovingOrchestrator = memo(function MovingOrchestrator({
  project,
  providerId,
  providerName,
  onComplete,
  className,
}: MovingOrchestratorProps) {
  const [session, setSession] = useState<TrackingSession | null>(null);
  const [eta, setEta] = useState<ETAUpdate | null>(null);
  const [updates, setUpdates] = useState<CrewUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tracking' | 'timeline' | 'crew'>('tracking');
  const [newMessage, setNewMessage] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Demo crew members
  const crew: CrewMember[] = [
    { id: '1', name: 'Marco Müller', role: 'lead', phone: '+41 79 123 45 67' },
    { id: '2', name: 'Stefan Brunner', role: 'driver', phone: '+41 79 234 56 78' },
    { id: '3', name: 'Thomas Weber', role: 'mover' },
  ];
  
  // Load or create tracking session
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      
      // Try to get existing session
      let trackingSession = getTrackingSession(project.id);
      
      // If no session, create demo data
      if (!trackingSession) {
        trackingSession = generateDemoTrackingData(project.id);
      }
      
      setSession(trackingSession);
      
      // Calculate ETA if in transit
      if (trackingSession.currentPosition && trackingSession.status === 'in_transit') {
        // Use Zurich coordinates as demo destination
        const newEta = calculateETA(
          trackingSession.currentPosition,
          47.3769,
          8.5417
        );
        setEta(newEta);
      }
      
      // Load updates
      const crewUpdates = getCrewUpdates(trackingSession.id);
      setUpdates(crewUpdates.length > 0 ? crewUpdates : getDemoUpdates());
      
      setIsLoading(false);
    };
    
    loadSession();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      if (session?.status !== 'completed') {
        handleRefresh();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [project.id]);
  
  // Refresh tracking data
  const handleRefresh = useCallback(() => {
    if (!session) return;
    
    // Simulate position update
    const newSession = {
      ...session,
      currentPosition: {
        lat: (session.currentPosition?.lat || 47.3769) + (Math.random() - 0.5) * 0.01,
        lng: (session.currentPosition?.lng || 8.5417) + (Math.random() - 0.5) * 0.01,
        accuracy: 10,
        timestamp: new Date().toISOString(),
        speed: 25 + Math.random() * 20,
        heading: Math.random() * 360,
      },
      distanceRemaining: Math.max(0, (session.distanceRemaining || 5) - Math.random() * 0.5),
      lastUpdate: new Date().toISOString(),
    };
    
    setSession(newSession);
    
    if (newSession.currentPosition) {
      const newEta = calculateETA(
        newSession.currentPosition,
        47.3769,
        8.5417
      );
      setEta(newEta);
    }
  }, [session]);
  
  // Send message to crew
  const handleSendMessage = useCallback(async () => {
    if (!session || !newMessage.trim()) return;
    
    const update: CrewUpdate = {
      type: 'message',
      timestamp: new Date().toISOString(),
      message: newMessage,
    };
    
    await addCrewUpdate(session.id, update);
    setUpdates(prev => [...prev, update]);
    setNewMessage('');
  }, [session, newMessage]);
  
  // Call crew lead
  const handleCallCrew = useCallback(() => {
    if (session?.crewLeadPhone) {
      window.location.href = `tel:${session.crewLeadPhone}`;
    }
  }, [session]);
  
  // Share tracking link
  const handleShare = useCallback(async () => {
    if (!session) return;
    
    const shareUrl = `${window.location.origin}/tracking/${session.id}`;
    
    if (navigator.share) {
      await navigator.share({
        title: 'Umzug Live-Tracking',
        text: `Verfolgen Sie Ihren Umzug live: ${providerName}`,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
    }
  }, [session, providerName]);
  
  // Advance to next status (demo)
  const handleAdvanceStatus = useCallback(() => {
    if (!session) return;
    
    const currentIndex = STATUS_ORDER.indexOf(session.status);
    if (currentIndex < STATUS_ORDER.length - 1) {
      const newStatus = STATUS_ORDER[currentIndex + 1];
      const updated = updateTrackingStatus(session.id, newStatus);
      if (updated) {
        setSession(updated);
        
        // Add status update
        const update: CrewUpdate = {
          type: 'status',
          timestamp: new Date().toISOString(),
          message: `Status: ${STATUS_LABELS[newStatus]}`,
        };
        setUpdates(prev => [...prev, update]);
        
        if (newStatus === 'completed') {
          onComplete?.();
        }
      }
    }
  }, [session, onComplete]);
  
  const currentStatusIndex = session ? STATUS_ORDER.indexOf(session.status) : 0;
  const progressPercent = ((currentStatusIndex + 1) / STATUS_ORDER.length) * 100;
  
  if (isLoading || !session) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Tracking wird geladen...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-blue-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Umzugstag
          </CardTitle>
          <div className="flex items-center gap-2">
            {session.status === 'in_transit' && (
              <Badge className="bg-blue-500 animate-pulse gap-1">
                <Navigation className="h-3 w-3" />
                Live
              </Badge>
            )}
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <Bell className={cn('h-4 w-4', notificationsEnabled && 'text-primary')} />
            </Button>
          </div>
        </div>
        
        {/* Provider & Status */}
        <div className="flex items-center justify-between mt-2">
          <Badge variant="outline">{providerName}</Badge>
          <Badge className={cn(
            session.status === 'completed' ? 'bg-emerald-500' :
            session.status === 'in_transit' ? 'bg-primary' :
            'bg-amber-500'
          )}>
            {STATUS_LABELS[session.status]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            {STATUS_ORDER.map((status, idx) => {
              const Icon = STATUS_ICONS[status];
              const isActive = status === session.status;
              const isComplete = idx < currentStatusIndex;
              
              return (
                <div
                  key={status}
                  className={cn(
                    'flex flex-col items-center transition-colors',
                    isActive && 'text-primary font-medium',
                    isComplete && 'text-emerald-600'
                  )}
                >
                  <Icon className={cn('h-4 w-4 mb-1', isActive && 'animate-pulse')} />
                  <span className="hidden sm:block">{STATUS_LABELS[status].split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        
        {/* ETA Alert */}
        {eta && session.status === 'in_transit' && (
          <Alert className="border-primary/20 bg-primary/5">
            <Clock className="h-4 w-4 text-primary" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                <strong>Ankunft:</strong> {new Date(eta.estimatedArrival).toLocaleTimeString('de-CH', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="text-sm">
                {eta.distanceRemaining} km · {eta.trafficConditions !== 'normal' && (
                  <span className="text-amber-600">
                    {eta.trafficConditions === 'heavy' ? 'Stau' : 'Verkehr'}
                  </span>
                )}
              </span>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracking">
              <Navigation className="h-4 w-4 mr-1" />
              Karte
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Clock className="h-4 w-4 mr-1" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="crew">
              <Phone className="h-4 w-4 mr-1" />
              Team
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracking" className="mt-4">
            <GPSTrackingMap
              session={session}
              destinationCoords={{ lat: 47.3769, lng: 8.5417 }}
              onRefresh={handleRefresh}
              onCallCrew={handleCallCrew}
            />
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-4">
            <ScrollArea className="h-[350px]">
              <div className="space-y-3">
                <AnimatePresence>
                  {updates.slice().reverse().map((update, idx) => (
                    <motion.div
                      key={`${update.timestamp}-${idx}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      {/* Dot */}
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'w-3 h-3 rounded-full',
                          idx === 0 ? 'bg-primary' : 'bg-muted-foreground/30'
                        )} />
                        {idx < updates.length - 1 && (
                          <div className="w-0.5 h-full bg-muted-foreground/20 mt-1" />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            {new Date(update.timestamp).toLocaleTimeString('de-CH', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {update.type === 'photo' && <Camera className="h-3 w-3" />}
                          {update.type === 'message' && <MessageSquare className="h-3 w-3" />}
                          {update.type === 'status' && <CheckCircle2 className="h-3 w-3" />}
                        </div>
                        <p className="text-sm font-medium">{update.message}</p>
                        {update.photoUrl && (
                          <img
                            src={update.photoUrl}
                            alt="Update"
                            className="mt-2 rounded-lg max-h-24 object-cover"
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="flex gap-2 mt-4">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nachricht ans Team..."
                className="min-h-[60px]"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="crew" className="mt-4">
            <div className="space-y-3">
              {crew.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {member.role === 'lead' ? 'Teamleiter' :
                         member.role === 'driver' ? 'Fahrer' : 'Helfer'}
                      </Badge>
                    </div>
                  </div>
                  
                  {member.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `tel:${member.phone}`}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Anrufen
                    </Button>
                  )}
                </div>
              ))}
              
              {/* Provider Contact */}
              <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm font-medium mb-2">{providerName}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={handleCallCrew}>
                    <Phone className="h-4 w-4 mr-1" />
                    Hotline
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Demo: Advance Status */}
        {session.status !== 'completed' && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleAdvanceStatus}
          >
            Demo: Nächster Status
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
});

// Demo updates for testing
function getDemoUpdates(): CrewUpdate[] {
  const now = Date.now();
  return [
    {
      type: 'status',
      timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      message: 'Team ist losgefahren',
    },
    {
      type: 'status',
      timestamp: new Date(now - 90 * 60 * 1000).toISOString(),
      message: 'Beladung abgeschlossen',
    },
    {
      type: 'photo',
      timestamp: new Date(now - 80 * 60 * 1000).toISOString(),
      message: 'Möbel sicher verpackt',
    },
    {
      type: 'checkpoint',
      timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
      message: 'Unterwegs - A1 Richtung Zürich',
    },
    {
      type: 'message',
      timestamp: new Date(now - 20 * 60 * 1000).toISOString(),
      message: 'Leichter Stau, ETA +10 Min',
    },
  ];
}

export default MovingOrchestrator;
