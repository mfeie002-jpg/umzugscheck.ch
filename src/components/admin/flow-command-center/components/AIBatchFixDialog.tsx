/**
 * AI Batch Fix Dialog
 * Shows AI-generated fixes for review before applying
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Sparkles, 
  Loader2, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  Code,
  Wand2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import type { UxIssue } from '../types';

interface FixSuggestion {
  issueId: string;
  issueTitle: string;
  severity: string;
  category: string;
  analysis: string;
  codeChanges: string;
  tailwindClasses?: string;
  priority: 'high' | 'medium' | 'low';
}

interface AIBatchFixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flowId: string;
  issues: UxIssue[];
  onFixesApplied?: (fixedIssueIds: string[]) => void;
}

export const AIBatchFixDialog: React.FC<AIBatchFixDialogProps> = ({
  open,
  onOpenChange,
  flowId,
  issues,
  onFixesApplied,
}) => {
  const [loading, setLoading] = useState(false);
  const [fixes, setFixes] = useState<FixSuggestion[]>([]);
  const [selectedFixes, setSelectedFixes] = useState<Set<string>>(new Set());
  const [generated, setGenerated] = useState(false);

  const generateFixes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-batch-fix', {
        body: {
          flowId,
          issues: issues.map(i => ({
            id: i.id,
            title: i.title,
            description: i.description,
            recommendation: i.recommendation,
            category: i.category,
            severity: i.severity,
            stepNumber: i.stepNumber,
          })),
        },
      });

      if (error) {
        console.error('AI batch fix error:', error);
        toast.error('Fehler beim Generieren der Fixes');
        return;
      }

      if (data?.fixes && data.fixes.length > 0) {
        setFixes(data.fixes);
        // Select all by default
        setSelectedFixes(new Set(data.fixes.map((f: FixSuggestion) => f.issueId)));
        setGenerated(true);
        toast.success(`${data.fixes.length} Fixes generiert`);
      } else {
        toast.info('Keine Fixes generiert');
      }
    } catch (err) {
      console.error('Failed to generate fixes:', err);
      toast.error('Fehler beim Generieren');
    } finally {
      setLoading(false);
    }
  };

  const toggleFix = (issueId: string) => {
    const newSelected = new Set(selectedFixes);
    if (newSelected.has(issueId)) {
      newSelected.delete(issueId);
    } else {
      newSelected.add(issueId);
    }
    setSelectedFixes(newSelected);
  };

  const toggleAll = () => {
    if (selectedFixes.size === fixes.length) {
      setSelectedFixes(new Set());
    } else {
      setSelectedFixes(new Set(fixes.map(f => f.issueId)));
    }
  };

  const copySelectedFixes = async () => {
    const selectedFixList = fixes.filter(f => selectedFixes.has(f.issueId));
    const text = selectedFixList.map(fix => 
      `// === ${fix.priority.toUpperCase()} | ${fix.category}: ${fix.issueTitle} ===
// Analyse: ${fix.analysis}
${fix.tailwindClasses ? `// Tailwind: ${fix.tailwindClasses}` : ''}

${fix.codeChanges}
`
    ).join('\n---\n\n');
    
    await navigator.clipboard.writeText(text);
    toast.success(`${selectedFixList.length} Fixes in Zwischenablage kopiert!`);
  };

  const applyFixes = async () => {
    const selectedIds = Array.from(selectedFixes);
    
    // Mark issues as resolved
    for (const issueId of selectedIds) {
      await supabase
        .from('flow_ux_issues')
        .update({ 
          is_resolved: true, 
          resolved_at: new Date().toISOString(),
        })
        .eq('id', issueId);
    }

    toast.success(`${selectedIds.length} Issues als gelöst markiert`);
    onFixesApplied?.(selectedIds);
    onOpenChange(false);
    
    // Reset state
    setGenerated(false);
    setFixes([]);
    setSelectedFixes(new Set());
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after close animation
    setTimeout(() => {
      setGenerated(false);
      setFixes([]);
      setSelectedFixes(new Set());
    }, 200);
  };

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedFixes = [...fixes].sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Auto-Fix für {flowId}
          </DialogTitle>
          <DialogDescription>
            {generated 
              ? `${fixes.length} Fixes generiert • ${selectedFixes.size} ausgewählt`
              : `${issues.length} Issues werden analysiert`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {!generated ? (
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-purple-500/10">
                  <Wand2 className="h-12 w-12 text-purple-500" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">KI-Analyse starten</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {issues.length} Issues werden analysiert und Fixes generiert
                </p>
              </div>
              <Button
                onClick={generateFixes}
                disabled={loading}
                size="lg"
                className="mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generiere Fixes...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Fixes mit KI generieren
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              {/* Select all toggle */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedFixes.size === fixes.length}
                    onCheckedChange={toggleAll}
                  />
                  <span className="text-sm font-medium">
                    Alle auswählen ({fixes.length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">
                    {fixes.filter(f => f.priority === 'high').length} High
                  </Badge>
                  <Badge variant="secondary">
                    {fixes.filter(f => f.priority === 'medium').length} Medium
                  </Badge>
                </div>
              </div>

              {/* Fixes list */}
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {sortedFixes.map(fix => (
                    <FixCard
                      key={fix.issueId}
                      fix={fix}
                      selected={selectedFixes.has(fix.issueId)}
                      onToggle={() => toggleFix(fix.issueId)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>

        {generated && (
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleClose}>
              Abbrechen
            </Button>
            <Button 
              variant="secondary" 
              onClick={copySelectedFixes}
              disabled={selectedFixes.size === 0}
            >
              <Copy className="h-4 w-4 mr-2" />
              Kopieren ({selectedFixes.size})
            </Button>
            <Button 
              onClick={applyFixes}
              disabled={selectedFixes.size === 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Als gelöst markieren ({selectedFixes.size})
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Individual fix card
interface FixCardProps {
  fix: FixSuggestion;
  selected: boolean;
  onToggle: () => void;
}

const FixCard: React.FC<FixCardProps> = ({ fix, selected, onToggle }) => {
  const [showCode, setShowCode] = useState(false);

  const priorityColors = {
    high: 'border-red-500/50 bg-red-500/5',
    medium: 'border-yellow-500/50 bg-yellow-500/5',
    low: 'border-blue-500/50 bg-blue-500/5',
  };

  const copyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(fix.codeChanges);
    toast.success('Code kopiert!');
  };

  return (
    <div 
      className={cn(
        'border rounded-lg p-4 transition-all cursor-pointer',
        priorityColors[fix.priority],
        selected && 'ring-2 ring-primary'
      )}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={selected} 
          onCheckedChange={onToggle}
          onClick={e => e.stopPropagation()}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge 
              variant={fix.severity === 'critical' ? 'destructive' : 'secondary'}
            >
              {fix.severity}
            </Badge>
            <Badge variant="outline">{fix.category}</Badge>
            <Badge 
              variant="outline"
              className={cn(
                fix.priority === 'high' && 'border-red-500 text-red-500',
                fix.priority === 'medium' && 'border-yellow-500 text-yellow-500',
                fix.priority === 'low' && 'border-blue-500 text-blue-500',
              )}
            >
              {fix.priority}
            </Badge>
          </div>
          
          <h4 className="font-medium text-sm">{fix.issueTitle}</h4>
          <p className="text-sm text-muted-foreground mt-1">{fix.analysis}</p>
          
          {fix.tailwindClasses && (
            <div className="mt-2 flex items-center gap-1 flex-wrap">
              <Code className="h-3 w-3 text-muted-foreground" />
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                {fix.tailwindClasses}
              </code>
            </div>
          )}
          
          {/* Code preview toggle */}
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowCode(!showCode);
              }}
            >
              <Code className="h-3 w-3 mr-1" />
              {showCode ? 'Code ausblenden' : 'Code anzeigen'}
            </Button>
            
            {showCode && (
              <div className="mt-2 relative">
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto max-h-[200px]">
                  <code>{fix.codeChanges}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1"
                  onClick={copyCode}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBatchFixDialog;
