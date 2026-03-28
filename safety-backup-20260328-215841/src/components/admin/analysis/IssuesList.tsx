/**
 * IssuesList - Deduplicated issues grouped by severity
 * Displays critical issues first, with affected elements listed together
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertOctagon, AlertTriangle, Info, ChevronDown, ChevronRight,
  CheckCircle2, Clock, TrendingUp, Code, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Issue {
  id?: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  title: string;
  description?: string;
  affectedElements?: string[];
  recommendation?: string;
  effort?: 'low' | 'medium' | 'high';
  impact?: 'low' | 'medium' | 'high';
  isResolved?: boolean;
}

interface IssuesListProps {
  issues: Issue[];
  onResolve?: (issueId: string, resolved: boolean) => void;
  showResolved?: boolean;
  maxHeight?: string;
}

const SEVERITY_CONFIG = {
  critical: {
    icon: AlertOctagon,
    label: 'Kritisch',
    color: 'text-red-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    badgeVariant: 'destructive' as const,
    weight: -10,
  },
  warning: {
    icon: AlertTriangle,
    label: 'Warnung',
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    badgeVariant: 'secondary' as const,
    weight: -3,
  },
  info: {
    icon: Info,
    label: 'Info',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badgeVariant: 'outline' as const,
    weight: -1,
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  mobile: 'Mobile',
  conversion: 'Conversion',
  ux: 'UX',
  accessibility: 'Accessibility',
  trust: 'Trust',
  performance: 'Performance',
};

const EFFORT_LABELS: Record<string, string> = {
  low: '~2h',
  medium: '~1 Tag',
  high: '~1 Woche',
};

export function IssuesList({ issues, onResolve, showResolved = false, maxHeight = '500px' }: IssuesListProps) {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  // Group and sort issues by severity
  const groupedIssues = {
    critical: issues.filter(i => i.severity === 'critical' && (!i.isResolved || showResolved)),
    warning: issues.filter(i => i.severity === 'warning' && (!i.isResolved || showResolved)),
    info: issues.filter(i => i.severity === 'info' && (!i.isResolved || showResolved)),
  };

  const totalUnresolved = issues.filter(i => !i.isResolved).length;
  const totalResolved = issues.filter(i => i.isResolved).length;

  // Calculate total score impact
  const scoreImpact = issues.reduce((acc, issue) => {
    if (issue.isResolved) return acc;
    return acc + (SEVERITY_CONFIG[issue.severity]?.weight || 0);
  }, 0);

  const toggleExpanded = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  if (issues.length === 0) {
    return (
      <Card className="border-green-500/30">
        <CardContent className="py-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <p className="font-medium text-green-600">Keine Issues gefunden!</p>
          <p className="text-sm text-muted-foreground">Der Flow entspricht allen Qualitätskriterien.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              UX Issues
            </CardTitle>
            <CardDescription>
              Deduplizierte Probleme, gruppiert nach Schweregrad
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{groupedIssues.critical.length} Kritisch</Badge>
            <Badge variant="secondary">{groupedIssues.warning.length} Warnungen</Badge>
            <Badge variant="outline">{groupedIssues.info.length} Info</Badge>
          </div>
        </div>
        
        {/* Score impact summary */}
        <div className="mt-3 p-2 rounded-lg bg-muted/50 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Score-Auswirkung:</span>
          <span className={`font-mono font-bold ${scoreImpact < -20 ? 'text-red-600' : scoreImpact < -10 ? 'text-amber-600' : 'text-green-600'}`}>
            {scoreImpact} Punkte
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <ScrollArea style={{ maxHeight }} className="pr-4">
          <div className="space-y-4">
            {(['critical', 'warning', 'info'] as const).map((severity) => {
              const issuesOfSeverity = groupedIssues[severity];
              if (issuesOfSeverity.length === 0) return null;

              const config = SEVERITY_CONFIG[severity];
              const Icon = config.icon;

              return (
                <div key={severity} className="space-y-2">
                  {/* Severity Header */}
                  <div className={`flex items-center gap-2 p-2 rounded-lg ${config.bgColor}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    <span className={`font-medium text-sm ${config.color}`}>
                      {config.label} ({issuesOfSeverity.length})
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {config.weight} Punkte pro Issue
                    </span>
                  </div>

                  {/* Issues */}
                  <div className="space-y-2 pl-2">
                    {issuesOfSeverity.map((issue, index) => {
                      const issueId = issue.id || `${severity}-${index}`;
                      const isExpanded = expandedIssues.has(issueId);

                      return (
                        <motion.div
                          key={issueId}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border rounded-lg ${config.borderColor} ${issue.isResolved ? 'opacity-50' : ''}`}
                        >
                          <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(issueId)}>
                            <CollapsibleTrigger asChild>
                              <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                                {onResolve && (
                                  <Checkbox
                                    checked={issue.isResolved}
                                    onCheckedChange={(checked) => {
                                      onResolve(issueId, checked as boolean);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                )}
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className={`font-medium text-sm ${issue.isResolved ? 'line-through text-muted-foreground' : ''}`}>
                                      {issue.title}
                                    </p>
                                    <Badge variant="outline" className="text-xs">
                                      {CATEGORY_LABELS[issue.category] || issue.category}
                                    </Badge>
                                    {issue.affectedElements && issue.affectedElements.length > 1 && (
                                      <Badge variant="secondary" className="text-xs">
                                        {issue.affectedElements.length} Elemente
                                      </Badge>
                                    )}
                                  </div>
                                  {issue.description && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                      {issue.description}
                                    </p>
                                  )}
                                </div>

                                {/* Effort/Impact indicators */}
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  {issue.effort && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {EFFORT_LABELS[issue.effort]}
                                    </span>
                                  )}
                                  {issue.impact && (
                                    <span className="flex items-center gap-1">
                                      <TrendingUp className="h-3 w-3" />
                                      {issue.impact}
                                    </span>
                                  )}
                                </div>

                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <div className="px-3 pb-3 pt-0 space-y-3 border-t mt-2">
                                {/* Affected Elements */}
                                {issue.affectedElements && issue.affectedElements.length > 0 && (
                                  <div className="mt-3">
                                    <p className="text-xs font-medium mb-1 flex items-center gap-1">
                                      <Code className="h-3 w-3" />
                                      Betroffene Elemente:
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {issue.affectedElements.map((el, i) => (
                                        <code key={i} className="text-xs px-1.5 py-0.5 bg-muted rounded">
                                          {el}
                                        </code>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Recommendation */}
                                {issue.recommendation && (
                                  <div className="p-2 rounded-lg bg-primary/5 border border-primary/20">
                                    <p className="text-xs font-medium text-primary mb-1">Empfehlung:</p>
                                    <p className="text-xs">{issue.recommendation}</p>
                                  </div>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Summary footer */}
        <div className="mt-4 pt-3 border-t flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {totalUnresolved} offene Issues
            {totalResolved > 0 && ` • ${totalResolved} behoben`}
          </span>
          {totalUnresolved === 0 && (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Alle behoben!
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default IssuesList;
