/**
 * Go-Live Dashboard
 * Final launch checklist and celebration system
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rocket, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Shield,
  Briefcase,
  Scale,
  Megaphone,
  Settings,
  PartyPopper,
  Play,
  Target,
  Calendar,
  Zap
} from "lucide-react";
import {
  GO_LIVE_CHECKLIST,
  LAUNCH_MILESTONES,
  LAUNCH_DAY_PROTOCOL,
  LAUNCH_SUCCESS_METRICS,
  CELEBRATION_MESSAGES,
  getChecklistProgress,
  isReadyForLaunch,
  getNextMilestone,
  type ChecklistItem
} from "@/lib/go-live-checklist";

const categoryConfig = {
  technical: { icon: Settings, label: 'Technisch', color: 'text-primary' },
  business: { icon: Briefcase, label: 'Business', color: 'text-success' },
  legal: { icon: Scale, label: 'Rechtlich', color: 'text-warning' },
  marketing: { icon: Megaphone, label: 'Marketing', color: 'text-accent' },
  operations: { icon: Shield, label: 'Operations', color: 'text-info' }
};

const priorityConfig = {
  critical: { label: 'Kritisch', color: 'bg-destructive text-destructive-foreground' },
  high: { label: 'Hoch', color: 'bg-warning text-warning-foreground' },
  medium: { label: 'Mittel', color: 'bg-muted text-muted-foreground' }
};

const ChecklistItemCard = memo(function ChecklistItemCard({ 
  item 
}: { 
  item: ChecklistItem 
}) {
  const { icon: CategoryIcon, color } = categoryConfig[item.category];
  const priorityStyle = priorityConfig[item.priority];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-lg border ${
        item.completed 
          ? 'bg-success/5 border-success/20' 
          : 'bg-card border-border'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${item.completed ? 'text-success' : 'text-muted-foreground'}`}>
          {item.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Clock className="w-5 h-5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{item.title}</span>
            <Badge variant="outline" className={priorityStyle.color}>
              {priorityStyle.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {item.description}
          </p>
          {item.completed && item.completedAt && (
            <p className="text-xs text-success mt-2">
              ✓ Erledigt am {item.completedAt}
            </p>
          )}
        </div>

        <CategoryIcon className={`w-4 h-4 ${color} flex-shrink-0`} />
      </div>
    </motion.div>
  );
});

export const GoLiveDashboard = memo(function GoLiveDashboard() {
  const [showCelebration, setShowCelebration] = useState(false);
  const progress = getChecklistProgress();
  const readyForLaunch = isReadyForLaunch();
  const nextMilestone = getNextMilestone();

  const handleLaunch = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center p-12 bg-card rounded-2xl border shadow-2xl"
            >
              <PartyPopper className="w-24 h-24 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                {CELEBRATION_MESSAGES.launchSuccess}
              </h2>
              <p className="text-muted-foreground text-lg">
                Die Schweizer Umzugsbranche wird nie mehr dieselbe sein!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary" />
            Go-Live Dashboard
          </h2>
          <p className="text-muted-foreground">
            Finale Launch-Checkliste und Protokoll
          </p>
        </div>

        <Button 
          size="lg"
          disabled={!readyForLaunch}
          onClick={handleLaunch}
          className="gap-2"
        >
          <Zap className="w-5 h-5" />
          {readyForLaunch ? 'Launch starten!' : 'Noch nicht bereit'}
        </Button>
      </div>

      {/* Overall Progress */}
      <Card className={readyForLaunch ? 'border-success' : ''}>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-3xl font-bold text-primary">
                {progress.percentage}%
              </div>
              <p className="text-muted-foreground">
                {progress.completed} von {progress.total} Punkten erledigt
              </p>
            </div>

            {readyForLaunch ? (
              <Badge className="bg-success text-success-foreground text-lg px-4 py-2">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Bereit für Launch!
              </Badge>
            ) : (
              <Badge variant="outline" className="text-warning border-warning">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {progress.criticalRemaining.length} kritische Punkte offen
              </Badge>
            )}
          </div>

          <Progress value={progress.percentage} className="h-3" />

          {/* Category Progress */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            {Object.entries(progress.byCategory).map(([category, stats]) => {
              const config = categoryConfig[category as keyof typeof categoryConfig];
              const Icon = config.icon;
              const pct = Math.round((stats.completed / stats.total) * 100);
              
              return (
                <div key={category} className="text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${config.color}`} />
                  <div className="text-sm font-medium">{config.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.completed}/{stats.total} ({pct}%)
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Next Milestone */}
      {nextMilestone && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Nächster Meilenstein</div>
                <div className="text-xl font-bold">{nextMilestone.name}</div>
                <div className="text-sm text-primary">
                  Ziel: {nextMilestone.targetDate}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="checklist">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checklist">Checkliste</TabsTrigger>
          <TabsTrigger value="milestones">Meilensteine</TabsTrigger>
          <TabsTrigger value="protocol">Launch-Tag</TabsTrigger>
          <TabsTrigger value="metrics">Erfolgsmetriken</TabsTrigger>
        </TabsList>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="space-y-4 mt-4">
          {Object.entries(categoryConfig).map(([category, config]) => {
            const items = GO_LIVE_CHECKLIST.filter(item => item.category === category);
            const Icon = config.icon;
            
            return (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    {config.label}
                    <Badge variant="outline" className="ml-auto">
                      {items.filter(i => i.completed).length}/{items.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map(item => (
                    <ChecklistItemCard key={item.id} item={item} />
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-4 mt-4">
          {LAUNCH_MILESTONES.map((milestone, index) => (
            <Card 
              key={milestone.id}
              className={
                milestone.status === 'completed' 
                  ? 'border-success/50' 
                  : milestone.status === 'in_progress'
                    ? 'border-primary'
                    : ''
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    milestone.status === 'completed'
                      ? 'bg-success text-success-foreground'
                      : milestone.status === 'in_progress'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {milestone.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="font-bold">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-bold">{milestone.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {milestone.targetDate}
                    </div>
                  </div>

                  <Badge variant={
                    milestone.status === 'completed' ? 'default' :
                    milestone.status === 'in_progress' ? 'secondary' : 'outline'
                  }>
                    {milestone.status === 'completed' ? 'Erledigt' :
                     milestone.status === 'in_progress' ? 'In Arbeit' : 'Ausstehend'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Launch Day Protocol Tab */}
        <TabsContent value="protocol" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                Launch-Tag Protokoll
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {LAUNCH_DAY_PROTOCOL.map((step, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                  >
                    <div className="w-16 text-center">
                      <div className="font-mono font-bold text-lg text-primary">
                        {step.time}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{step.action}</div>
                      <div className="text-sm text-muted-foreground">
                        Verantwortlich: {step.responsible}
                      </div>
                      {step.notes && (
                        <div className="text-xs text-muted-foreground mt-1 italic">
                          {step.notes}
                        </div>
                      )}
                    </div>

                    <Badge variant="outline">
                      {step.status === 'completed' ? '✓ Erledigt' :
                       step.status === 'in_progress' ? '⏳ Läuft' : '○ Ausstehend'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Success Metrics Tab */}
        <TabsContent value="metrics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Erfolgsmetriken Tag 1
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {LAUNCH_SUCCESS_METRICS.map((metric, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{metric.name}</span>
                      <Badge variant={
                        metric.status === 'exceeded' ? 'default' :
                        metric.status === 'on_track' ? 'secondary' : 'destructive'
                      }>
                        {metric.status === 'exceeded' ? 'Übertroffen' :
                         metric.status === 'on_track' ? 'Im Plan' : 'Gefährdet'}
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {metric.current}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / Ziel: {metric.target}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});
