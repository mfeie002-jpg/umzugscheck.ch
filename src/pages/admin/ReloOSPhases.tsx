/**
 * Relo-OS Phases Dashboard
 * 
 * Admin overview page showing all 6 technical phases of the "Invisible Move" platform.
 */

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
      { name: 'Project Persistence (LocalStorage)', implemented: true, file: 'src/hooks/useMoveProject.ts' },
      { name: 'Journey Progress Indicator', implemented: true, file: 'src/components/journey/MoveJourneyProgress.tsx' },
    ],
    keyFiles: [
      'src/lib/move-project.ts',
      'src/hooks/useMoveProject.ts',
      'src/components/journey/MoveJourneyProgress.tsx',
    ],
  },
  {
    id: 2,
    name: 'Inventory',
    label: 'AI Video Scan',
    icon: ScanLine,
    status: 'in_progress',
    progress: 75,
    description: 'Zero-UI Inventarerfassung – AI Video Scan mit LiDAR-Tiefenerkennung für digitale Zwillinge.',
    features: [
      { name: 'Video Upload Interface', implemented: true, file: 'src/pages/VideoEstimator.tsx' },
      { name: 'AI Video Analysis (Edge Function)', implemented: true, file: 'supabase/functions/analyze-video/index.ts' },
      { name: 'Digital Twin Data Model', implemented: true, file: 'src/lib/move-project.ts' },
      { name: 'LiDAR Depth Detection', implemented: false },
      { name: 'Room-by-Room Capture Flow', implemented: false },
    ],
    keyFiles: [
      'src/pages/VideoEstimator.tsx',
      'supabase/functions/analyze-video/index.ts',
      'src/components/ai/VideoAnalysisResult.tsx',
    ],
  },
  {
    id: 3,
    name: 'Quote',
    label: 'Instant Pricing',
    icon: Calculator,
    status: 'in_progress',
    progress: 60,
    description: 'Dynamic Pricing Engine – Volumen, Komplexität, Saisonalität für garantierte Festpreise.',
    features: [
      { name: 'Dynamic Pricing Engine', implemented: true, file: 'src/lib/move-pricing-engine.ts' },
      { name: 'Service Tier Selection (Essential/Comfort/Premium)', implemented: true },
      { name: 'Price Breakdown Display', implemented: true, file: 'src/components/journey/PriceBreakdown.tsx' },
      { name: 'Seasonality Factors', implemented: true },
      { name: 'Floor Access Complexity', implemented: true },
      { name: 'Guaranteed Fixed Price', implemented: false },
    ],
    keyFiles: [
      'src/lib/move-pricing-engine.ts',
      'src/components/journey/PriceBreakdown.tsx',
    ],
  },
  {
    id: 4,
    name: 'Booking',
    label: 'Smart Escrow',
    icon: CreditCard,
    status: 'in_progress',
    progress: 45,
    description: 'Quality-Weighted Bidding & Escrow – Anbieter-Matching mit Rating-gewichteter Auswahl.',
    features: [
      { name: 'Provider Matching Algorithm', implemented: true, file: 'src/lib/provider-matching.ts' },
      { name: 'Quality-Weighted Bidding', implemented: true },
      { name: 'Escrow Transaction Model', implemented: true, file: 'supabase/migrations/*escrow*' },
      { name: 'Stripe Payment Integration', implemented: false },
      { name: 'Booking Confirmation Flow', implemented: false },
    ],
    keyFiles: [
      'src/lib/provider-matching.ts',
      'src/pages/ProviderDashboard.tsx',
    ],
  },
  {
    id: 5,
    name: 'Moving',
    label: 'Live Tracking',
    icon: Truck,
    status: 'planned',
    progress: 20,
    description: 'Echtzeit GPS-Tracking – Umzugsstatus live verfolgen mit ETA-Berechnung.',
    features: [
      { name: 'Move Status State Machine', implemented: true, file: 'src/lib/move-project.ts' },
      { name: 'Provider Location Tracking', implemented: false },
      { name: 'Real-time ETA Updates', implemented: false },
      { name: 'Customer Notification System', implemented: false },
      { name: 'In-Transit Dashboard', implemented: false },
    ],
    keyFiles: [
      'src/lib/move-project.ts',
    ],
  },
  {
    id: 6,
    name: 'Complete',
    label: 'Swiss Handover',
    icon: Home,
    status: 'planned',
    progress: 15,
    description: 'Swiss Standard Handover Protocol – Raum-spezifische Fotodoku mit digitalen Signaturen.',
    features: [
      { name: 'Handover Checklist Component', implemented: true, file: 'src/components/journey/HandoverChecklist.tsx' },
      { name: 'Room Photo Documentation', implemented: false },
      { name: 'Digital Signatures', implemented: false },
      { name: 'Damage Claim System', implemented: false },
      { name: 'Escrow Release Trigger', implemented: false },
    ],
    keyFiles: [
      'src/components/journey/HandoverChecklist.tsx',
    ],
  },
];

const getStatusBadge = (status: ReloPhase['status']) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Implementiert</Badge>;
    case 'in_progress':
      return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">In Arbeit</Badge>;
    case 'planned':
      return <Badge className="bg-muted text-muted-foreground border-border">Geplant</Badge>;
  }
};

function PhaseCard({ phase }: { phase: ReloPhase }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = phase.icon;
  
  const implementedCount = phase.features.filter(f => f.implemented).length;
  const totalFeatures = phase.features.length;
  
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      phase.status === 'completed' && "border-green-500/30 bg-green-500/5",
      phase.status === 'in_progress' && "border-orange-500/30 bg-orange-500/5"
    )}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2.5 rounded-xl",
                phase.status === 'completed' && "bg-green-500/20 text-green-600",
                phase.status === 'in_progress' && "bg-orange-500/20 text-orange-600",
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
            {getStatusBadge(phase.status)}
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
                      <Check className="h-3.5 w-3.5 text-green-500" />
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
  const completedPhases = RELO_PHASES.filter(p => p.status === 'completed').length;
  const inProgressPhases = RELO_PHASES.filter(p => p.status === 'in_progress').length;
  const overallProgress = Math.round(RELO_PHASES.reduce((acc, p) => acc + p.progress, 0) / RELO_PHASES.length);
  
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
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="pt-4 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-green-500/20">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{completedPhases}</p>
                <p className="text-sm text-muted-foreground">Implementiert</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-500/5 border-orange-500/20">
            <CardContent className="pt-4 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-orange-500/20">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{inProgressPhases}</p>
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
            <PhaseCard key={phase.id} phase={phase} />
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
