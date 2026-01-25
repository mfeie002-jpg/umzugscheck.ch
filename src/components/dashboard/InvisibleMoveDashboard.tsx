/**
 * Invisible Move Dashboard
 * 
 * Central hub for users to track their entire moving journey.
 * Shows current phase, next actions, and timeline.
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Video, 
  FileText, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  Truck,
  Home,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useMoveProject } from '@/hooks/useMoveProject';
import { MoveJourneyProgress, MoveJourneyBar } from '@/components/journey';
import { 
  MoveProjectStatus, 
  getStatusLabel, 
  getPhaseForStatus 
} from '@/lib/move-project';

interface NextAction {
  label: string;
  description: string;
  icon: typeof Video;
  href: string;
  variant: 'default' | 'secondary';
  urgent?: boolean;
}

const STATUS_ACTIONS: Record<MoveProjectStatus, NextAction[]> = {
  'draft': [
    {
      label: 'Video-Scan starten',
      description: 'KI erkennt Ihr Inventar automatisch',
      icon: Video,
      href: '/video-offerte',
      variant: 'default',
      urgent: true
    },
    {
      label: 'Formular ausfüllen',
      description: 'Manuell Inventar erfassen',
      icon: FileText,
      href: '/umzugsofferten',
      variant: 'secondary'
    }
  ],
  'inventory_scan': [
    {
      label: 'Scan fortsetzen',
      description: 'Räume hinzufügen',
      icon: Video,
      href: '/video-offerte',
      variant: 'default'
    }
  ],
  'quote_ready': [
    {
      label: 'Offerte ansehen',
      description: 'Ihr garantierter Festpreis',
      icon: FileText,
      href: '/offerte',
      variant: 'default',
      urgent: true
    }
  ],
  'booking_pending': [
    {
      label: 'Jetzt buchen',
      description: 'Treuhand-Zahlung',
      icon: Shield,
      href: '/buchung',
      variant: 'default',
      urgent: true
    }
  ],
  'booked': [
    {
      label: 'Buchung ansehen',
      description: 'Details und Kontakt',
      icon: FileText,
      href: '/buchung',
      variant: 'default'
    }
  ],
  'scheduled': [
    {
      label: 'Checkliste',
      description: 'Vor dem Umzugstag',
      icon: CheckCircle2,
      href: '/checkliste',
      variant: 'default'
    }
  ],
  'in_transit': [
    {
      label: 'Live-Tracking',
      description: 'Wo ist der Truck?',
      icon: Truck,
      href: '/tracking',
      variant: 'default',
      urgent: true
    }
  ],
  'completed': [
    {
      label: 'Umzug bestätigen',
      description: 'Bewertung abgeben',
      icon: CheckCircle2,
      href: '/bestaetigung',
      variant: 'default',
      urgent: true
    }
  ],
  'closed': [
    {
      label: 'Willkommen zuhause',
      description: 'Nachbar-Tipps entdecken',
      icon: Home,
      href: '/willkommen',
      variant: 'default'
    }
  ]
};

export function InvisibleMoveDashboard() {
  const { 
    project, 
    isLoading, 
    phaseProgress,
    statusLabel,
    hasDigitalTwin,
    hasGuaranteedPrice
  } = useMoveProject();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-8 bg-muted rounded mb-4" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!project) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <Home className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Noch kein Umzug geplant
          </h3>
          <p className="text-muted-foreground mb-6">
            Starten Sie Ihren stressfreien Umzug in nur 2 Minuten.
          </p>
          <Button asChild size="lg">
            <Link to="/umzugsofferten">
              Jetzt starten
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentPhase = getPhaseForStatus(project.status);
  const actions = STATUS_ACTIONS[project.status] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Main Status Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">
                Phase {currentPhase} von 6
              </Badge>
              <h2 className="text-2xl font-bold mb-1">
                {statusLabel}
              </h2>
              <p className="text-muted-foreground">
                {project.origin.city || 'Start'} → {project.destination.city || 'Ziel'}
                {project.moveDate && ` • ${new Date(project.moveDate).toLocaleDateString('de-CH')}`}
              </p>
            </div>
            
            {/* Progress Circle */}
            <div className="text-center">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-muted"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={`${phaseProgress * 1.76} 176`}
                    className="text-primary"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                  {phaseProgress}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Journey Progress */}
          <MoveJourneyProgress 
            currentStatus={project.status}
            variant="compact"
            className="mb-6"
          />

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">
                {project.totalVolume ? `${project.totalVolume}m³` : '—'}
              </p>
              <p className="text-xs text-muted-foreground">Volumen</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">
                {hasGuaranteedPrice 
                  ? `CHF ${project.guaranteedPrice.toLocaleString('de-CH')}` 
                  : '—'}
              </p>
              <p className="text-xs text-muted-foreground">
                {hasGuaranteedPrice ? 'Festpreis' : 'Offerte'}
              </p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">
                {hasDigitalTwin ? '✓' : '—'}
              </p>
              <p className="text-xs text-muted-foreground">Digital Twin</p>
            </div>
          </div>

          {/* Next Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Nächste Schritte
            </h4>
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant}
                  className={cn(
                    'w-full justify-start h-auto py-3',
                    action.urgent && 'ring-2 ring-primary ring-offset-2'
                  )}
                  asChild
                >
                  <Link to={action.href}>
                    <Icon className="w-5 h-5 mr-3 shrink-0" />
                    <div className="text-left">
                      <p className="font-medium">{action.label}</p>
                      <p className="text-xs opacity-70">{action.description}</p>
                    </div>
                    {action.urgent && (
                      <Badge variant="destructive" className="ml-auto">
                        Jetzt
                      </Badge>
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {project.status !== 'draft' && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Erledigt</p>
                <p className="font-semibold">
                  {project.movingDayChecklist.filter(c => c.completed).length} / {project.movingDayChecklist.length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Noch</p>
                <p className="font-semibold">
                  {project.moveDate 
                    ? `${Math.max(0, Math.ceil((new Date(project.moveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} Tage`
                    : 'Datum wählen'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </motion.div>
  );
}

export default InvisibleMoveDashboard;
