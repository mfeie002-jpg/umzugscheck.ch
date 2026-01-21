import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, MessageSquare, TrendingUp, CheckCircle2, Clock,
  Send, Star, AlertTriangle, Bug, Lightbulb, ThumbsUp,
  ChevronRight, Mail, UserPlus, BarChart3, Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  BETA_PHASES,
  BETA_CHECKLIST,
  CURRENT_BETA_METRICS,
  FEEDBACK_CATEGORIES,
  NPS_SURVEY,
  getNPSCategory,
} from '@/lib/beta-program';
import { toast } from 'sonner';

const PHASE_ICONS = {
  completed: CheckCircle2,
  active: Rocket,
  upcoming: Clock,
};

const FEEDBACK_TYPE_ICONS = {
  bug: Bug,
  feature: Lightbulb,
  ux: Users,
  general: MessageSquare,
  praise: ThumbsUp,
};

export const BetaProgramDashboard = memo(function BetaProgramDashboard() {
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = () => {
    if (!inviteEmail) return;
    toast.success(`Einladung an ${inviteEmail} gesendet!`);
    setInviteEmail('');
  };

  const completedChecks = [
    ...BETA_CHECKLIST.technical,
    ...BETA_CHECKLIST.product,
    ...BETA_CHECKLIST.business,
  ].filter(c => c.done).length;

  const totalChecks = [
    ...BETA_CHECKLIST.technical,
    ...BETA_CHECKLIST.product,
    ...BETA_CHECKLIST.business,
  ].length;

  const checklistProgress = (completedChecks / totalChecks) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary" />
            Beta Program Dashboard
          </h2>
          <p className="text-muted-foreground">
            Soft Launch Management & Feedback-Tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="E-Mail für Beta-Einladung"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleInvite} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Einladen
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard
          icon={Users}
          label="Beta-Nutzer"
          value={CURRENT_BETA_METRICS.totalActivated}
          subtext={`von ${CURRENT_BETA_METRICS.totalInvited} eingeladen`}
        />
        <MetricCard
          icon={TrendingUp}
          label="Aktivierungsrate"
          value={`${CURRENT_BETA_METRICS.activationRate}%`}
          subtext="Ziel: 60%"
          highlight={CURRENT_BETA_METRICS.activationRate >= 60}
        />
        <MetricCard
          icon={Star}
          label="NPS Score"
          value={CURRENT_BETA_METRICS.npsScore}
          subtext={CURRENT_BETA_METRICS.npsScore >= 50 ? 'Excellent' : 'Good'}
          highlight={CURRENT_BETA_METRICS.npsScore >= 40}
        />
        <MetricCard
          icon={MessageSquare}
          label="Feedback/User"
          value={CURRENT_BETA_METRICS.avgFeedbackPerUser.toFixed(1)}
          subtext="Durchschnitt"
        />
        <MetricCard
          icon={BarChart3}
          label="7-Tage Retention"
          value={`${CURRENT_BETA_METRICS.retentionDay7}%`}
          subtext="30d: 42%"
        />
      </div>

      {/* Launch Phases */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Launch-Phasen</h3>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />
          
          <div className="space-y-4">
            {BETA_PHASES.map((phase, idx) => {
              const Icon = PHASE_ICONS[phase.status];
              const isActive = phase.status === 'active';
              
              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "flex gap-4 p-4 rounded-lg relative",
                    isActive && "bg-primary/5 border border-primary/20"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center z-10",
                    phase.status === 'completed' && "bg-success text-white",
                    phase.status === 'active' && "bg-primary text-primary-foreground",
                    phase.status === 'upcoming' && "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{phase.name}</h4>
                      {isActive && (
                        <Badge className="bg-primary text-primary-foreground">
                          Aktiv
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {phase.targetUsers} Nutzer
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {phase.duration}
                      </span>
                    </div>
                    
                    {isActive && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {phase.criteria.map((c, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <Tabs defaultValue="checklist" className="space-y-4">
        <TabsList>
          <TabsTrigger value="checklist">Launch-Checklist</TabsTrigger>
          <TabsTrigger value="feedback">Top Feedback</TabsTrigger>
          <TabsTrigger value="nps">NPS Details</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Launch-Bereitschaft</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {completedChecks}/{totalChecks} erledigt
                </span>
                <Progress value={checklistProgress} className="w-32 h-2" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <ChecklistSection title="Technisch" items={BETA_CHECKLIST.technical} />
              <ChecklistSection title="Produkt" items={BETA_CHECKLIST.product} />
              <ChecklistSection title="Business" items={BETA_CHECKLIST.business} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Top Feature-Requests</h3>
            <div className="space-y-3 mb-6">
              {CURRENT_BETA_METRICS.topFeatureRequests.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-primary" />
                  </div>
                  <span className="flex-1">{req}</span>
                  <Badge variant="outline">{4 - idx} Stimmen</Badge>
                </div>
              ))}
            </div>

            <h3 className="font-semibold mb-4">Bekannte Bugs</h3>
            <div className="space-y-3">
              {CURRENT_BETA_METRICS.topBugs.map((bug, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                >
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Bug className="w-4 h-4 text-destructive" />
                  </div>
                  <span className="flex-1">{bug}</span>
                  <Badge variant="destructive">In Arbeit</Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="nps">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Net Promoter Score</h3>
                <p className="text-sm text-muted-foreground">{NPS_SURVEY.question}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {CURRENT_BETA_METRICS.npsScore}
                </div>
                <div className="text-sm text-muted-foreground">NPS Score</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <NPSCategoryCard
                label="Promoters (9-10)"
                percentage={55}
                color="success"
                description="Begeisterte Empfehler"
              />
              <NPSCategoryCard
                label="Passives (7-8)"
                percentage={37}
                color="warning"
                description="Zufrieden, aber neutral"
              />
              <NPSCategoryCard
                label="Detractors (0-6)"
                percentage={8}
                color="destructive"
                description="Kritische Stimmen"
              />
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">Feedback-Kategorien</h4>
              <div className="flex flex-wrap gap-2">
                {FEEDBACK_CATEGORIES.map(cat => (
                  <Badge key={cat.id} variant="outline" className="gap-1">
                    <span>{cat.icon}</span>
                    {cat.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext: string;
  highlight?: boolean;
}

const MetricCard = memo(function MetricCard({
  icon: Icon,
  label,
  value,
  subtext,
  highlight,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card border rounded-xl p-4",
        highlight ? "border-success/50 bg-success/5" : "border-border"
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className={cn(
        "text-xs",
        highlight ? "text-success" : "text-muted-foreground"
      )}>
        {subtext}
      </div>
    </motion.div>
  );
});

interface ChecklistSectionProps {
  title: string;
  items: { id: string; task: string; done: boolean }[];
}

const ChecklistSection = memo(function ChecklistSection({
  title,
  items,
}: ChecklistSectionProps) {
  const completed = items.filter(i => i.done).length;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">{title}</h4>
        <span className="text-sm text-muted-foreground">
          {completed}/{items.length}
        </span>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg text-sm",
              item.done ? "bg-success/10" : "bg-muted/50"
            )}
          >
            {item.done ? (
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
            ) : (
              <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            )}
            <span className={item.done ? "" : "text-muted-foreground"}>
              {item.task}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

interface NPSCategoryCardProps {
  label: string;
  percentage: number;
  color: 'success' | 'warning' | 'destructive';
  description: string;
}

const NPSCategoryCard = memo(function NPSCategoryCard({
  label,
  percentage,
  color,
  description,
}: NPSCategoryCardProps) {
  const colorClasses = {
    success: 'bg-success/10 border-success/20 text-success',
    warning: 'bg-warning/10 border-warning/20 text-warning',
    destructive: 'bg-destructive/10 border-destructive/20 text-destructive',
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      colorClasses[color]
    )}>
      <div className="text-2xl font-bold mb-1">{percentage}%</div>
      <div className="font-medium text-foreground">{label}</div>
      <div className="text-xs text-muted-foreground mt-1">{description}</div>
    </div>
  );
});
