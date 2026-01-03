/**
 * Issues Panel Component
 * Displays UX issues with auto-fix functionality
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Wand2, 
  CheckCircle, 
  Loader2, 
  Copy,
  AlertTriangle,
  Filter,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { SeverityBadge, EffortBadge } from './ScoreDisplay';
import { AIBatchFixDialog } from './AIBatchFixDialog';
import type { UxIssue } from '../types';
import { generateFixPrompt, generateCombinedFixPrompt } from '../utils';

interface IssuesPanelProps {
  issues: UxIssue[];
  flowId?: string;
  onResolve: (issueId: string) => Promise<void>;
  onAutoFix?: (issue: UxIssue) => Promise<void>;
  maxHeight?: string;
  showFlowId?: boolean;
}

// Helper to deduplicate issues by title similarity
const deduplicateIssues = (issues: UxIssue[]): (UxIssue & { duplicateCount: number })[] => {
  const normalizeTitle = (title: string) => 
    title.toLowerCase()
      .replace(/[^a-zäöü\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  
  const grouped = new Map<string, UxIssue[]>();
  
  issues.forEach(issue => {
    const normalized = normalizeTitle(issue.title);
    // Create a key from normalized title and category
    const key = `${normalized}::${issue.category}::${issue.severity}`;
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(issue);
  });
  
  // Return one representative issue per group with count
  return Array.from(grouped.values()).map(group => ({
    ...group[0],
    duplicateCount: group.length
  }));
};

export const IssuesPanel: React.FC<IssuesPanelProps> = ({
  issues,
  flowId,
  onResolve,
  onAutoFix,
  maxHeight = '500px',
  showFlowId = false,
}) => {
  const [sortBy, setSortBy] = useState<'severity' | 'category'>('severity');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [fixingAll, setFixingAll] = useState(false);
  const [showDeduplicated, setShowDeduplicated] = useState(true);
  const [showAIFixDialog, setShowAIFixDialog] = useState(false);

  // Deduplicate issues
  const deduplicatedIssues = deduplicateIssues(issues);
  const displayIssues = showDeduplicated ? deduplicatedIssues : issues.map(i => ({ ...i, duplicateCount: 1 }));

  // Get unique categories
  const categories = [...new Set(displayIssues.map(i => i.category))];

  // Filter and sort issues
  const filteredIssues = displayIssues
    .filter(i => !filterCategory || i.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'severity') {
        const order = { critical: 0, warning: 1, info: 2 };
        return order[a.severity] - order[b.severity];
      }
      return a.category.localeCompare(b.category);
    });

  // Count based on deduplicated view
  const criticalCount = deduplicatedIssues.filter(i => i.severity === 'critical').length;
  const warningCount = deduplicatedIssues.filter(i => i.severity === 'warning').length;

  const handleFixAll = async () => {
    if (issues.length === 0) return;
    setFixingAll(true);
    
    try {
      const prompt = generateCombinedFixPrompt(
        flowId || 'unknown',
        issues.map(i => ({
          title: i.title,
          description: i.description,
          recommendation: i.recommendation,
          severity: i.severity,
          category: i.category,
        }))
      );
      
      await navigator.clipboard.writeText(prompt);
      toast.success('Fix-Prompt in Zwischenablage kopiert!');
    } catch (err) {
      toast.error('Fehler beim Kopieren');
    }
    
    setFixingAll(false);
  };

  if (issues.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <p className="text-muted-foreground">Keine offenen Issues</p>
        </CardContent>
      </Card>
    );
  }

  const uniqueCount = deduplicatedIssues.length;
  const totalCount = issues.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Issues ({showDeduplicated ? `${uniqueCount} unique` : totalCount})
            {showDeduplicated && totalCount !== uniqueCount && (
              <span className="text-xs font-normal text-muted-foreground">
                ({totalCount} total)
              </span>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{criticalCount} kritisch</Badge>
            <Badge variant="secondary">{warningCount} Warnungen</Badge>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Button
            variant={showDeduplicated ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowDeduplicated(!showDeduplicated)}
          >
            <Filter className="h-3 w-3 mr-1" />
            {showDeduplicated ? 'Dedupliziert' : 'Alle zeigen'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy(sortBy === 'severity' ? 'category' : 'severity')}
          >
            <ArrowUpDown className="h-3 w-3 mr-1" />
            {sortBy === 'severity' ? 'Nach Severity' : 'Nach Kategorie'}
          </Button>
          
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              variant={filterCategory === null ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilterCategory(null)}
            >
              Alle
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={filterCategory === cat ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowAIFixDialog(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Mit KI fixen
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleFixAll}
              disabled={fixingAll}
            >
              {fixingAll ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Copy className="h-4 w-4 mr-1" />
              )}
              Prompt kopieren
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <ScrollArea className="pr-4" style={{ maxHeight }}>
          <div className="space-y-3">
            {filteredIssues.map(issue => (
              <IssueCard
                key={issue.id}
                issue={issue}
                showFlowId={showFlowId}
                onResolve={() => onResolve(issue.id)}
                onAutoFix={onAutoFix ? () => onAutoFix(issue) : undefined}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      
      {/* AI Batch Fix Dialog */}
      <AIBatchFixDialog
        open={showAIFixDialog}
        onOpenChange={setShowAIFixDialog}
        flowId={flowId || 'unknown'}
        issues={issues}
        onFixesApplied={(fixedIds) => {
          // Optionally trigger reload
          toast.success(`${fixedIds.length} Issues wurden bearbeitet`);
        }}
      />
    </Card>
  );
};

// Individual issue card
interface IssueCardProps {
  issue: UxIssue & { duplicateCount?: number };
  showFlowId?: boolean;
  onResolve: () => void;
  onAutoFix?: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  showFlowId = false,
  onResolve,
  onAutoFix,
}) => {
  const [fixing, setFixing] = useState(false);

  const handleAutoFix = async () => {
    if (onAutoFix) {
      setFixing(true);
      try {
        await onAutoFix();
      } finally {
        setFixing(false);
      }
    } else {
      // Fallback: copy prompt to clipboard
      const prompt = generateFixPrompt({
        flowId: issue.flowId,
        stepNumber: issue.stepNumber,
        category: issue.category,
        severity: issue.severity,
        title: issue.title,
        description: issue.description,
        recommendation: issue.recommendation,
      });
      
      await navigator.clipboard.writeText(prompt);
      toast.success('Fix-Prompt kopiert!');
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <SeverityBadge severity={issue.severity} />
            <Badge variant="secondary">{issue.category}</Badge>
            {issue.duplicateCount && issue.duplicateCount > 1 && (
              <Badge variant="outline" className="text-xs">
                ×{issue.duplicateCount}
              </Badge>
            )}
            {showFlowId && (
              <span className="text-sm text-muted-foreground">
                {issue.flowId}
              </span>
            )}
            {issue.stepNumber && (
              <span className="text-sm text-muted-foreground">
                Step {issue.stepNumber}
              </span>
            )}
          </div>
          
          <h4 className="font-medium">{issue.title}</h4>
          
          {issue.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {issue.description}
            </p>
          )}
          
          {issue.recommendation && (
            <p className="text-sm text-primary mt-2">
              <strong>Empfehlung:</strong> {issue.recommendation}
            </p>
          )}
        </div>
        
        <div className="flex flex-col gap-2 flex-shrink-0">
          <Button
            variant="default"
            size="sm"
            onClick={handleAutoFix}
            disabled={fixing}
          >
            {fixing ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-1" />
            )}
            Fix
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onResolve}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Erledigt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IssuesPanel;
