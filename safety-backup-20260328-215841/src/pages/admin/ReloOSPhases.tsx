/**
 * Relo-OS Phases Dashboard
 * 
 * Admin overview page showing all 6 technical phases of the "Invisible Move" platform.
 * Includes live statistics from the database.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MapPin, 
  ScanLine, 
  Calculator, 
  CreditCard, 
  Truck, 
  Home,
  ChevronDown,
  Check,
  Clock,
  FileCode,
  ExternalLink,
  Layers,
  Database,
  Activity,
  TrendingUp,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import type { LucideIcon } from 'lucide-react';

interface PhaseFeature {
  name: string;
  implemented: boolean;
  file?: string;
}

interface ReloPhase {
  id: number;
  name: string;
  label: string;
  icon: LucideIcon;
  status: 'completed' | 'in_progress' | 'planned';
  progress: number;
  description: string;
  features: PhaseFeature[];
  keyFiles: string[];
  dbStatuses?: string[]; // Status values from move_projects that belong to this phase
}

interface LiveStats {
  total_projects: number;
  by_status: Record<string, number>;
  completed_this_month: number;
  avg_progress: number;
}

const RELO_PHASES: ReloPhase[] = [
  {
    id: 1,
    name: 'Route',
    label: 'Initialization',
    icon: MapPin,
    status: 'completed',
    progress: 100,
    description: 'State Machine Foundation – Projekt erstellen, Adressen erfassen, Move-Projekt initialisieren.',
    features: [
      { name: 'Move Project State Machine', implemented: true, file: 'src/lib/move-project.ts' },
      { name: 'Address Autocomplete (Swiss)', implemented: true, file: 'src/components/journey/AddressInput.tsx' },
      { name: 'Project Persistence (Supabase + LocalStorage)', implemented: true, file: 'src/hooks/useMoveProject.ts' },
      { name: 'Journey Progress Indicator', implemented: true, file: 'src/components/journey/MoveJourneyProgress.tsx' },
      { name: 'Route Initializer Component', implemented: true, file: 'src/components/relo-os/RouteInitializer.tsx' },
    ],
    keyFiles: [
      'src/lib/move-project.ts',
      'src/hooks/useMoveProject.ts',
      'src/components/relo-os/RouteInitializer.tsx',
    ],
    dbStatuses: ['route', 'draft'],
  },
  {
    id: 2,
    name: 'Inventory',
    label: 'AI Video Scan + LiDAR',
    icon: ScanLine,
    status: 'completed',
    progress: 100,
    description: 'Zero-UI Inventarerfassung – AI Video Scan mit LiDAR-Tiefenerkennung für digitale Zwillinge.',
    features: [
      { name: 'Video Upload Interface', implemented: true, file: 'src/pages/VideoEstimator.tsx' },
      { name: 'AI Video Analysis (Edge Function)', implemented: true, file: 'supabase/functions/analyze-video/index.ts' },
      { name: 'AI Photo Analysis', implemented: true, file: 'supabase/functions/analyze-moving-photos/index.ts' },
      { name: 'Digital Twin Data Model', implemented: true, file: 'src/lib/move-project.ts' },
      { name: 'LiDAR Depth Scanner Component', implemented: true, file: 'src/components/relo-os/LiDARDepthScanner.tsx' },
      { name: 'Enhanced LiDAR Scanner (Device API)', implemented: true, file: 'src/components/relo-os/EnhancedLiDARScanner.tsx' },
      { name: 'LiDAR Depth API Integration', implemented: true, file: 'src/lib/lidar-depth-api.ts' },
      { name: 'Digital Twin Display', implemented: true, file: 'src/components/relo-os/DigitalTwinDisplay.tsx' },
      { name: 'Room-by-Room Capture Flow', implemented: true, file: 'src/components/relo-os/InventoryOrchestrator.tsx' },
      { name: 'Automatic Room Type Detection', implemented: true, file: 'src/lib/lidar-depth-api.ts' },
      { name: 'Precise Volume Calculation from 3D', implemented: true, file: 'src/lib/lidar-depth-api.ts' },
      { name: 'Device LiDAR Capability Detection', implemented: true, file: 'src/lib/lidar-depth-api.ts' },
    ],
    keyFiles: [
      'src/pages/VideoEstimator.tsx',
      'supabase/functions/analyze-moving-photos/index.ts',
      'src/components/relo-os/EnhancedLiDARScanner.tsx',
      'src/lib/lidar-depth-api.ts',
      'src/components/relo-os/InventoryOrchestrator.tsx',
    ],
    dbStatuses: ['inventory'],
  },
  {
    id: 3,
    name: 'Quote',
    label: 'Garantierter Festpreis',
    icon: Calculator,
    status: 'completed',
    progress: 100,
    description: 'Dynamic Pricing Engine – Volumen, Komplexität, Saisonalität für garantierte Festpreise mit Abgabegarantie.',
    features: [
      { name: 'Dynamic Pricing Engine', implemented: true, file: 'src/lib/move-pricing-engine.ts' },
      { name: 'Guaranteed Price Engine', implemented: true, file: 'src/lib/guaranteed-price-engine.ts' },
      { name: 'Service Tier Selection (3 Tiers)', implemented: true, file: 'src/components/relo-os/ServiceTierSelector.tsx' },
      { name: 'Price Breakdown Display', implemented: true, file: 'src/components/relo-os/DynamicPriceDisplay.tsx' },
      { name: 'Guaranteed Price Card (Abgabegarantie)', implemented: true, file: 'src/components/relo-os/GuaranteedPriceCard.tsx' },
      { name: 'Quote Orchestrator (Full Flow)', implemented: true, file: 'src/components/relo-os/QuoteOrchestrator.tsx' },
      { name: 'Seasonality & Floor Factors', implemented: true, file: 'src/lib/move-pricing-engine.ts' },
      { name: 'Alternative Date Suggestions', implemented: true, file: 'src/lib/move-pricing-engine.ts' },
      { name: 'Swiss Holidays Integration', implemented: true, file: 'src/lib/move-pricing-engine.ts' },
      { name: 'Insurance Tier Levels (20k-100k)', implemented: true, file: 'src/lib/guaranteed-price-engine.ts' },
    ],
    keyFiles: [
      'src/lib/move-pricing-engine.ts',
      'src/lib/guaranteed-price-engine.ts',
      'src/components/relo-os/QuoteOrchestrator.tsx',
      'src/components/relo-os/GuaranteedPriceCard.tsx',
    ],
    dbStatuses: ['quote'],
  },
  {
    id: 4,
    name: 'Booking',
    label: 'Smart Escrow + Stripe',
    icon: CreditCard,
    status: 'completed',
    progress: 100,
    description: 'Quality-Weighted Bidding & Escrow – Anbieter-Matching mit Rating-gewichteter Auswahl und Stripe-Zahlung.',
    features: [
      { name: 'Provider Matching Algorithm (QWB)', implemented: true, file: 'src/lib/provider-matching.ts' },
      { name: 'Quality-Weighted Bidding Weights', implemented: true, file: 'src/lib/provider-matching.ts' },
      { name: 'Provider Match Card', implemented: true, file: 'src/components/relo-os/ProviderMatchCard.tsx' },
      { name: 'Smart Escrow Booking', implemented: true, file: 'src/components/relo-os/SmartEscrowBooking.tsx' },
      { name: 'Booking Orchestrator', implemented: true, file: 'src/components/relo-os/BookingOrchestrator.tsx' },
      { name: 'Escrow Service (CRUD)', implemented: true, file: 'src/lib/escrow-service.ts' },
      { name: 'Escrow Webhook (fund/release/dispute/refund)', implemented: true, file: 'supabase/functions/escrow-webhook' },
      { name: 'Stripe Checkout Integration', implemented: true, file: 'src/lib/stripe-service.ts' },
      { name: 'Escrow Transaction DB Model', implemented: true, file: 'supabase schema' },
      { name: 'Customer/Provider Confirmation', implemented: true },
    ],
    keyFiles: [
      'src/lib/provider-matching.ts',
      'src/lib/escrow-service.ts',
      'src/components/relo-os/BookingOrchestrator.tsx',
      'supabase/functions/escrow-webhook/index.ts',
    ],
    dbStatuses: ['booking'],
  },
  {
    id: 5,
    name: 'Moving',
    label: 'Live Tracking + Notifications',
    icon: Truck,
    status: 'completed',
    progress: 100,
    description: 'Echtzeit GPS-Tracking – Umzugsstatus live verfolgen mit ETA-Berechnung und Multi-Channel-Benachrichtigungen.',
    features: [
      { name: 'GPS Tracking System', implemented: true, file: 'src/lib/gps-tracking.ts' },
      { name: 'GPS Tracking Map Component', implemented: true, file: 'src/components/relo-os/GPSTrackingMap.tsx' },
      { name: 'Live Tracking Panel', implemented: true, file: 'src/components/relo-os/LiveTrackingPanel.tsx' },
      { name: 'Moving Orchestrator (Full UX)', implemented: true, file: 'src/components/relo-os/MovingOrchestrator.tsx' },
      { name: 'ETA Calculation (Haversine + Traffic)', implemented: true, file: 'src/lib/gps-tracking.ts' },
      { name: 'Crew Updates & Communication', implemented: true },
      { name: 'Notification Service (SMS/Push/Email)', implemented: true, file: 'src/lib/notification-service.ts' },
      { name: 'Status-based Auto-Notifications', implemented: true },
      { name: 'Quiet Hours Logic', implemented: true },
      { name: 'WhatsApp Integration', implemented: true },
    ],
    keyFiles: [
      'src/lib/gps-tracking.ts',
      'src/lib/notification-service.ts',
      'src/components/relo-os/MovingOrchestrator.tsx',
      'src/components/relo-os/GPSTrackingMap.tsx',
    ],
    dbStatuses: ['moving'],
  },
  {
    id: 6,
    name: 'Complete',
    label: 'Swiss Handover + Escrow Release',
    icon: Home,
    status: 'completed',
    progress: 100,
    description: 'Swiss Standard Handover Protocol – Raum-spezifische Fotodoku mit digitalen Signaturen und Escrow-Freigabe.',
    features: [
      { name: 'Complete Orchestrator (Full Flow)', implemented: true, file: 'src/components/relo-os/CompleteOrchestrator.tsx' },
      { name: 'Handover Protocol Component', implemented: true, file: 'src/components/relo-os/HandoverProtocol.tsx' },
      { name: 'Digital Signature System', implemented: true, file: 'src/lib/digital-signature.ts' },
      { name: 'Digital Signature Pad (Touch/Canvas)', implemented: true, file: 'src/components/relo-os/DigitalSignaturePad.tsx' },
      { name: 'Swiss Standard Room Checklist', implemented: true },
      { name: 'Photo Documentation per Room', implemented: true },
      { name: 'Signature Verification (OR Art. 14)', implemented: true },
      { name: 'Escrow Release Trigger', implemented: true, file: 'src/lib/escrow-service.ts' },
      { name: 'PDF Protocol Export', implemented: true },
      { name: 'Completion Sharing', implemented: true },
    ],
    keyFiles: [
      'src/components/relo-os/CompleteOrchestrator.tsx',
      'src/lib/digital-signature.ts',
      'src/components/relo-os/HandoverProtocol.tsx',
      'src/components/relo-os/DigitalSignaturePad.tsx',
    ],
    dbStatuses: ['complete'],
  },
];

const getStatusBadge = (status: ReloPhase['status']) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Implementiert</Badge>;
    case 'in_progress':
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">In Arbeit</Badge>;
    case 'planned':
      return <Badge className="bg-muted text-muted-foreground border-border">Geplant</Badge>;
  }
};

function PhaseCard({ phase, liveCount }: { phase: ReloPhase; liveCount?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = phase.icon;
  
  const implementedCount = phase.features.filter(f => f.implemented).length;
  const totalFeatures = phase.features.length;
  
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      phase.status === 'completed' && "border-emerald-500/30 bg-emerald-500/5",
      phase.status === 'in_progress' && "border-amber-500/30 bg-amber-500/5"
    )}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2.5 rounded-xl",
                phase.status === 'completed' && "bg-emerald-500/20 text-emerald-600",
                phase.status === 'in_progress' && "bg-amber-500/20 text-amber-600",
                phase.status === 'planned' && "bg-muted text-muted-foreground"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-muted-foreground font-normal">Phase {phase.id}:</span>
                  {phase.name}
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">{phase.label}</CardDescription>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {getStatusBadge(phase.status)}
              {liveCount !== undefined && liveCount > 0 && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Activity className="h-3 w-3" />
                  {liveCount} aktiv
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{phase.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fortschritt</span>
              <span className="font-medium">{phase.progress}%</span>
            </div>
            <Progress value={phase.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {implementedCount} von {totalFeatures} Features implementiert
            </p>
          </div>
          
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              Details anzeigen
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4">
            {/* Features */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Features
              </h4>
              <ul className="space-y-1.5">
                {phase.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    {feature.implemented ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className={cn(
                      feature.implemented ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {feature.name}
                    </span>
                    {feature.file && (
                      <code className="text-[10px] text-muted-foreground bg-muted px-1 py-0.5 rounded">
                        {feature.file.split('/').pop()}
                      </code>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Key Files */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                Relevante Dateien
              </h4>
              <ul className="space-y-1">
                {phase.keyFiles.map((file, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                    {file}
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
}

export default function ReloOSPhases() {
  // Fetch live statistics from move_projects table
  const { data: liveStats, isLoading: statsLoading } = useQuery({
    queryKey: ['move-projects-stats'],
    queryFn: async (): Promise<LiveStats> => {
      // Get total count and status breakdown
      const { data: projects, error } = await supabase
        .from('move_projects')
        .select('status, progress_percentage, completed_at');
      
      if (error) throw error;
      
      const byStatus: Record<string, number> = {};
      let totalProgress = 0;
      let completedThisMonth = 0;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      (projects || []).forEach(p => {
        byStatus[p.status] = (byStatus[p.status] || 0) + 1;
        totalProgress += p.progress_percentage || 0;
        
        if (p.completed_at && new Date(p.completed_at) >= startOfMonth) {
          completedThisMonth++;
        }
      });
      
      return {
        total_projects: projects?.length || 0,
        by_status: byStatus,
        completed_this_month: completedThisMonth,
        avg_progress: projects?.length ? Math.round(totalProgress / projects.length) : 0,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const completedPhases = RELO_PHASES.filter(p => p.status === 'completed').length;
  const inProgressPhases = RELO_PHASES.filter(p => p.status === 'in_progress').length;
  const overallProgress = Math.round(RELO_PHASES.reduce((acc, p) => acc + p.progress, 0) / RELO_PHASES.length);
  
  // Calculate live count per phase
  const getPhaseCount = (phase: ReloPhase): number => {
    if (!liveStats?.by_status || !phase.dbStatuses) return 0;
    return phase.dbStatuses.reduce((sum, status) => sum + (liveStats.by_status[status] || 0), 0);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              Relo-OS Entwicklungsphasen
            </h1>
            <p className="text-muted-foreground mt-1">
              "Invisible Move" – Technische Implementierung des 6-Phasen-Systems
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{overallProgress}%</div>
            <p className="text-xs text-muted-foreground">Gesamtfortschritt</p>
          </div>
        </div>
        
        {/* Live Stats from Database */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              Live Daten aus move_projects
            </CardTitle>
            <CardDescription>Echtzeitstatistiken aus der Datenbank</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{liveStats?.total_projects || 0}</p>
                  <p className="text-xs text-muted-foreground">Gesamt Projekte</p>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{liveStats?.avg_progress || 0}%</p>
                  <p className="text-xs text-muted-foreground">Ø Fortschritt</p>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Check className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold">{liveStats?.completed_this_month || 0}</p>
                  <p className="text-xs text-muted-foreground">Abgeschlossen (Monat)</p>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">
                    {Object.keys(liveStats?.by_status || {}).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Aktive Status</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="pt-4 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/20">
                <Check className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{completedPhases}</p>
                <p className="text-sm text-muted-foreground">Implementiert</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="pt-4 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-amber-500/20">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{inProgressPhases}</p>
                <p className="text-sm text-muted-foreground">In Arbeit</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-muted">
                <Truck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-sm text-muted-foreground">Phasen gesamt</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Phase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RELO_PHASES.map(phase => (
            <PhaseCard 
              key={phase.id} 
              phase={phase} 
              liveCount={getPhaseCount(phase)}
            />
          ))}
        </div>
        
        {/* Documentation Link */}
        <Card className="bg-muted/30">
          <CardContent className="pt-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Dokumentation</h3>
              <p className="text-sm text-muted-foreground">
                Vollständige technische Dokumentation im Repository
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              docs/strategy/RELO_OS_BLUEPRINT.md
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
