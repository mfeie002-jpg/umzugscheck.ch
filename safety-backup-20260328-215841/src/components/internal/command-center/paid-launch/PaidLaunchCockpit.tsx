/**
 * Paid Launch Cockpit
 * Main dashboard for tracking launch readiness
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Rocket, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Send, 
  ChevronDown, 
  ChevronUp,
  Target,
  Search,
  BarChart3,
} from 'lucide-react';
import { usePaidLaunchTasks, usePaidLaunchStats, useUpdateTaskStatus, useCopyTaskToAIQueue, type PaidLaunchTask } from '@/hooks/usePaidLaunchChecklist';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const PRIORITY_CONFIG = {
  p0: { label: 'P0 Blocker', color: 'bg-destructive text-destructive-foreground', icon: AlertTriangle },
  p1: { label: 'P1 Optimize', color: 'bg-warning text-warning-foreground', icon: Target },
  p2: { label: 'P2 Enhance', color: 'bg-muted text-muted-foreground', icon: BarChart3 },
};

const CATEGORY_CONFIG = {
  tracking: { label: 'Tracking', color: 'bg-blue-500/20 text-blue-700' },
  landing: { label: 'Landing', color: 'bg-green-500/20 text-green-700' },
  copy: { label: 'Copy', color: 'bg-purple-500/20 text-purple-700' },
  dev: { label: 'Dev', color: 'bg-orange-500/20 text-orange-700' },
  ops: { label: 'Ops', color: 'bg-pink-500/20 text-pink-700' },
};

const SITE_CONFIG = {
  feierabend: { label: 'FE', color: 'bg-primary/20 text-primary' },
  umzugscheck: { label: 'UC', color: 'bg-secondary/50 text-secondary-foreground' },
  both: { label: 'BOTH', color: 'bg-muted text-muted-foreground' },
};

export function PaidLaunchCockpit() {
  const [activeTab, setActiveTab] = useState('p0');
  const { data: tasks, isLoading } = usePaidLaunchTasks();
  const { data: stats } = usePaidLaunchStats();
  const updateStatus = useUpdateTaskStatus();
  const copyToQueue = useCopyTaskToAIQueue();

  const filteredTasks = tasks?.filter(t => {
    if (activeTab === 'all') return true;
    return t.priority === activeTab;
  }) || [];

  const canLaunch = stats ? stats.p0Done === stats.p0Total && stats.p0Total > 0 : false;
  const progressPercent = stats ? (stats.done / stats.total) * 100 : 0;
  const p0Progress = stats ? (stats.p0Done / stats.p0Total) * 100 : 0;

  const handleToggleStatus = (task: PaidLaunchTask) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    updateStatus.mutate({ taskId: task.id, status: newStatus });
  };

  const handleCopyToAI = (task: PaidLaunchTask) => {
    copyToQueue.mutate(task);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <Card className={cn(
        "border-2",
        canLaunch ? "border-green-500 bg-green-500/5" : "border-yellow-500 bg-yellow-500/5"
      )}>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {canLaunch ? (
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Rocket className="h-6 w-6 text-green-600" />
                </div>
              ) : (
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">
                    {canLaunch ? 'READY TO LAUNCH' : 'PRE-LAUNCH'}
                  </h3>
                  <Badge variant={canLaunch ? "default" : "secondary"}>
                    {stats?.done}/{stats?.total} tasks
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {canLaunch 
                    ? 'All P0 blockers resolved. Ads can be launched.' 
                    : `${stats?.p0Total ? stats.p0Total - stats.p0Done : 0} P0 blockers remaining`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {canLaunch && (
                <Button asChild variant="default" className="gap-2">
                  <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Open Google Ads
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            
            {!canLaunch && (
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-destructive font-medium">P0 Blockers</span>
                <span className="font-medium text-destructive">{stats?.p0Done}/{stats?.p0Total}</span>
              </div>
            )}
            {!canLaunch && <Progress value={p0Progress} className="h-2 [&>div]:bg-destructive" />}
          </div>
        </CardContent>
      </Card>

      {/* Budget & Campaign Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Test Budget</p>
            <p className="text-lg font-bold">CHF 1'000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Daily Budget</p>
            <p className="text-lg font-bold">CHF ~33</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Est. Clicks</p>
            <p className="text-lg font-bold">125-200</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Est. CPC</p>
            <p className="text-lg font-bold">CHF 5-8</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Structure Mini-Preview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Campaign Structure</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <span className="w-2 h-2 bg-primary rounded-full" />
              Zürich Premium (CHF 600)
            </Badge>
            <Badge variant="outline" className="gap-1">
              <span className="w-2 h-2 bg-secondary rounded-full" />
              Zug Premium (CHF 300)
            </Badge>
            <Badge variant="outline" className="gap-1">
              <span className="w-2 h-2 bg-muted-foreground rounded-full" />
              Specialist (CHF 100)
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Task Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="p0" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span className="hidden sm:inline">P0</span>
            <Badge variant="destructive" className="h-5 w-5 p-0 justify-center text-xs">
              {stats?.p0Total ? stats.p0Total - stats.p0Done : 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="p1" className="gap-1">
            <Target className="h-3 w-3" />
            <span className="hidden sm:inline">P1</span>
            <Badge variant="secondary" className="h-5 w-5 p-0 justify-center text-xs">
              {stats?.p1Total ? stats.p1Total - stats.p1Done : 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="p2" className="gap-1">
            <BarChart3 className="h-3 w-3" />
            <span className="hidden sm:inline">P2</span>
            <Badge variant="outline" className="h-5 w-5 p-0 justify-center text-xs">
              {stats?.p2Total ? stats.p2Total - stats.p2Done : 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all">
            All
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-2">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                {activeTab === 'all' ? 'No tasks found' : `All ${activeTab.toUpperCase()} tasks complete!`}
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={handleToggleStatus}
                onCopyToAI={handleCopyToAI}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TaskCard({ 
  task, 
  onToggle, 
  onCopyToAI 
}: { 
  task: PaidLaunchTask; 
  onToggle: (task: PaidLaunchTask) => void;
  onCopyToAI: (task: PaidLaunchTask) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isDone = task.status === 'done';
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const categoryConfig = CATEGORY_CONFIG[task.category];
  const siteConfig = SITE_CONFIG[task.site];

  return (
    <Card className={cn(
      "transition-all",
      isDone && "opacity-60 bg-muted/30"
    )}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-3">
          <div className="flex items-start gap-3">
            <Checkbox 
              checked={isDone}
              onCheckedChange={() => onToggle(task)}
              className="mt-1 h-5 w-5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge className={cn("text-xs", priorityConfig.color)}>
                  {task.priority.toUpperCase()}
                </Badge>
                <Badge className={cn("text-xs", categoryConfig.color)}>
                  {categoryConfig.label}
                </Badge>
                <Badge className={cn("text-xs", siteConfig.color)}>
                  {siteConfig.label}
                </Badge>
                {task.complexity && (
                  <Badge variant="outline" className="text-xs">
                    {task.complexity.toUpperCase()}
                  </Badge>
                )}
              </div>
              <p className={cn(
                "font-medium text-sm",
                isDone && "line-through text-muted-foreground"
              )}>
                {task.title}
              </p>
              {task.goal && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {task.goal}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => onCopyToAI(task)}
                title="Copy to AI Queue"
              >
                <Send className="h-4 w-4" />
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
        
        <CollapsibleContent>
          <CardContent className="pt-0 pb-3 px-3 border-t">
            <div className="pl-8 space-y-3 pt-3">
              {task.change_description && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Change:</p>
                  <p className="text-sm">{task.change_description}</p>
                </div>
              )}
              {task.acceptance_criteria && task.acceptance_criteria.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Acceptance Criteria:</p>
                  <ul className="space-y-1">
                    {task.acceptance_criteria.map((criterion, i) => (
                      <li key={i} className="text-xs flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {task.owner && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Owner:</span>
                  <Badge variant="outline" className="text-xs">{task.owner.toUpperCase()}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
