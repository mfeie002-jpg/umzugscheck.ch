/**
 * AI Fix Suggestions - Generate code fixes for issues
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, Copy, CheckCircle, Code } from 'lucide-react';
import { toast } from 'sonner';

interface AIFixSuggestionsProps {
  flowId: string;
  className?: string;
}

interface FixSuggestion {
  issueTitle: string;
  severity: string;
  fixDescription: string;
  codeSnippet?: string;
}

export const AIFixSuggestions: React.FC<AIFixSuggestionsProps> = ({ flowId, className }) => {
  const [suggestions, setSuggestions] = useState<FixSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateFixes = async () => {
    setLoading(true);
    try {
      const normalizedId = flowId.startsWith('umzugsofferten-')
        ? flowId.replace('umzugsofferten-', '')
        : flowId;
      const flowIds = [flowId, normalizedId, `umzugsofferten-${normalizedId}`];

      // Get critical and warning issues
      const { data: issues } = await supabase
        .from('flow_ux_issues')
        .select('*')
        .in('flow_id', flowIds)
        .eq('is_resolved', false)
        .in('severity', ['critical', 'warning'])
        .limit(5);

      if (!issues || issues.length === 0) {
        toast.info('Keine kritischen Issues gefunden');
        setLoading(false);
        return;
      }

      // Generate fix suggestions (mock for now, could call AI)
      const fixes: FixSuggestion[] = issues.map(issue => ({
        issueTitle: issue.title,
        severity: issue.severity,
        fixDescription: issue.recommendation || `Fix für: ${issue.title}`,
        codeSnippet: generateCodeSnippet(issue),
      }));

      setSuggestions(fixes);
      setGenerated(true);
      toast.success(`${fixes.length} Fix-Vorschläge generiert`);
    } catch (err) {
      console.error('Failed to generate fixes:', err);
      toast.error('Fehler beim Generieren');
    } finally {
      setLoading(false);
    }
  };

  const copyFix = async (fix: FixSuggestion) => {
    const text = `// Fix: ${fix.issueTitle}\n// ${fix.fixDescription}\n\n${fix.codeSnippet || '// TODO: Implement fix'}`;
    await navigator.clipboard.writeText(text);
    toast.success('Fix kopiert!');
  };

  const copyAllFixes = async () => {
    const text = suggestions.map(fix => 
      `// === ${fix.severity.toUpperCase()}: ${fix.issueTitle} ===\n// ${fix.fixDescription}\n\n${fix.codeSnippet || '// TODO: Implement fix'}\n`
    ).join('\n---\n\n');
    await navigator.clipboard.writeText(text);
    toast.success('Alle Fixes kopiert!');
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              AI Fix Suggestions
            </CardTitle>
            <CardDescription className="text-xs">
              Automatisch generierte Code-Fixes
            </CardDescription>
          </div>
          {generated && (
            <Button variant="ghost" size="sm" onClick={copyAllFixes}>
              <Copy className="h-3 w-3 mr-1" />
              Alle
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!generated ? (
          <Button
            onClick={generateFixes}
            disabled={loading}
            className="w-full"
            variant="secondary"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generiere...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Fixes generieren
              </>
            )}
          </Button>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {suggestions.map((fix, idx) => (
                <div key={idx} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={fix.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {fix.severity}
                      </Badge>
                      <span className="text-sm font-medium">{fix.issueTitle}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyFix(fix)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{fix.fixDescription}</p>
                  {fix.codeSnippet && (
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      <code>{fix.codeSnippet}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {generated && (
          <Button
            onClick={() => { setGenerated(false); setSuggestions([]); }}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Neu generieren
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Helper to generate code snippets based on issue type
function generateCodeSnippet(issue: any): string {
  const category = issue.category?.toLowerCase() || '';
  const title = issue.title?.toLowerCase() || '';

  if (category === 'mobile' || title.includes('mobile')) {
    return `// Mobile-Optimierung
<div className="min-h-[44px] p-4 touch-action-manipulation">
  {/* Touch-friendly content */}
</div>`;
  }

  if (category === 'conversion' || title.includes('cta')) {
    return `// CTA-Verbesserung
<Button 
  className="w-full h-14 text-lg font-semibold sticky bottom-4"
  onClick={handleSubmit}
>
  Kostenlos Offerten erhalten
</Button>`;
  }

  if (category === 'ux' || title.includes('loading')) {
    return `// Loading State
{isLoading ? (
  <div className="flex items-center justify-center p-4">
    <Loader2 className="h-6 w-6 animate-spin" />
  </div>
) : (
  <Content />
)}`;
  }

  if (title.includes('trust') || title.includes('vertrauen')) {
    return `// Trust-Signale
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <Shield className="h-4 w-4 text-green-500" />
  <span>100% kostenlos & unverbindlich</span>
</div>`;
  }

  return `// ${issue.title}
// TODO: Implement fix based on recommendation:
// ${issue.recommendation || 'Review and fix manually'}`;
}

export default AIFixSuggestions;
