import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertTriangle, 
  ChevronDown,
  ExternalLink,
  FileText,
  Zap,
  Shield,
  CreditCard,
  RefreshCw,
  Home,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  POST_MOVE_CHECKLIST,
  CHECKLIST_CATEGORIES,
  ChecklistCategory,
  ChecklistItem,
  UserChecklistState,
  calculateProgress,
  saveChecklistState,
  loadChecklistState,
} from "@/lib/post-move-checklist";

interface PostMoveChecklistProps {
  moveDate: Date;
  onProgressChange?: (progress: number) => void;
}

const CategoryIcon = ({ category }: { category: ChecklistCategory }) => {
  const icons: Record<ChecklistCategory, React.ReactNode> = {
    registration: <FileText className="h-4 w-4" />,
    utilities: <Zap className="h-4 w-4" />,
    insurance: <Shield className="h-4 w-4" />,
    banking: <CreditCard className="h-4 w-4" />,
    subscriptions: <RefreshCw className="h-4 w-4" />,
    home: <Home className="h-4 w-4" />,
    social: <Users className="h-4 w-4" />,
  };
  return icons[category];
};

export const PostMoveChecklist = ({ moveDate, onProgressChange }: PostMoveChecklistProps) => {
  const [state, setState] = useState<UserChecklistState>(() => {
    const saved = loadChecklistState();
    return saved || {
      moveDate,
      completedItems: [],
      skippedItems: [],
      notes: {},
      lastUpdated: new Date(),
    };
  });

  const [openCategories, setOpenCategories] = useState<ChecklistCategory[]>(['registration', 'utilities']);

  const progress = calculateProgress(state);

  useEffect(() => {
    saveChecklistState(state);
    onProgressChange?.(progress.percentage);
  }, [state, progress.percentage, onProgressChange]);

  const toggleItem = (itemId: string) => {
    setState(prev => {
      const isCompleted = prev.completedItems.includes(itemId);
      return {
        ...prev,
        completedItems: isCompleted
          ? prev.completedItems.filter(id => id !== itemId)
          : [...prev.completedItems, itemId],
        lastUpdated: new Date(),
      };
    });
  };

  const toggleCategory = (category: ChecklistCategory) => {
    setOpenCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const daysSinceMove = Math.floor(
    (new Date().getTime() - state.moveDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const categories = Object.keys(CHECKLIST_CATEGORIES) as ChecklistCategory[];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Nach dem Umzug Checkliste
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            Tag {daysSinceMove > 0 ? `+${daysSinceMove}` : daysSinceMove}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {progress.completed}/{progress.total} erledigt
            </span>
            <span className="font-medium">{progress.percentage}%</span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
          
          {progress.overdue > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertTriangle className="h-3 w-3" />
              <span>{progress.overdue} überfällige Aufgaben</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        {categories.map(category => {
          const categoryInfo = CHECKLIST_CATEGORIES[category];
          const items = POST_MOVE_CHECKLIST.filter(i => i.category === category);
          const completedCount = items.filter(i => state.completedItems.includes(i.id)).length;
          const isOpen = openCategories.includes(category);

          return (
            <Collapsible
              key={category}
              open={isOpen}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between h-auto py-2 px-3"
                >
                  <div className="flex items-center gap-2">
                    <span className={categoryInfo.color}>
                      <CategoryIcon category={category} />
                    </span>
                    <span className="font-medium">{categoryInfo.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {completedCount}/{items.length}
                    </Badge>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-180"
                  )} />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-1 pl-4 pr-2 pb-2">
                {items.map(item => (
                  <ChecklistItemRow
                    key={item.id}
                    item={item}
                    isCompleted={state.completedItems.includes(item.id)}
                    daysSinceMove={daysSinceMove}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
};

interface ChecklistItemRowProps {
  item: ChecklistItem;
  isCompleted: boolean;
  daysSinceMove: number;
  onToggle: () => void;
}

const ChecklistItemRow = ({ item, isCompleted, daysSinceMove, onToggle }: ChecklistItemRowProps) => {
  const isOverdue = !isCompleted && item.dueOffset < daysSinceMove;
  const isDueSoon = !isCompleted && item.dueOffset <= daysSinceMove + 3 && item.dueOffset >= daysSinceMove;

  return (
    <div className={cn(
      "flex items-start gap-3 p-2 rounded-lg transition-colors",
      isCompleted && "opacity-60",
      isOverdue && "bg-destructive/5",
      isDueSoon && !isOverdue && "bg-yellow-50"
    )}>
      <Checkbox
        checked={isCompleted}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium",
            isCompleted && "line-through"
          )}>
            {item.title}
          </span>
          {item.isOptional && (
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              Optional
            </Badge>
          )}
          {isOverdue && (
            <Badge variant="destructive" className="text-[10px] px-1 py-0">
              Überfällig
            </Badge>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mt-0.5">
          {item.description}
        </p>
        
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            ~{item.estimatedMinutes} Min
          </span>
          
          {item.links?.map(link => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-primary hover:underline"
              onClick={e => e.stopPropagation()}
            >
              {link.label}
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostMoveChecklist;
