/**
 * FlowScreenshotViewer - Shows flow screenshots with mobile/desktop toggle
 */
import { useState, useEffect } from 'react';
import { Smartphone, Monitor, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface Screenshot {
  step_number: number;
  mobile_screenshot_url: string | null;
  desktop_screenshot_url: string | null;
}

interface FlowScreenshotViewerProps {
  flowId: string;
  viewMode: 'mobile' | 'desktop';
  className?: string;
}

export function FlowScreenshotViewer({ flowId, viewMode, className }: FlowScreenshotViewerProps) {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchScreenshots = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Find latest completed run for this flow
        const { data: latestRun } = await supabase
          .from('flow_analysis_runs')
          .select('id')
          .eq('flow_id', flowId)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        let data: any[] = [];
        
        // Try to fetch by run_id first (ensures consistency)
        if (latestRun?.id) {
          const { data: runData, error: runError } = await supabase
            .from('flow_step_metrics')
            .select('step_number, mobile_screenshot_url, desktop_screenshot_url, created_at')
            .eq('run_id', latestRun.id)
            .order('step_number');
          if (!runError && runData && runData.length > 0) {
            data = runData;
          }
        }
        
        // Fallback to flow_id (deduplicate by keeping newest per step)
        if (data.length === 0) {
          const { data: flowData, error: flowError } = await supabase
            .from('flow_step_metrics')
            .select('step_number, mobile_screenshot_url, desktop_screenshot_url, created_at')
            .eq('flow_id', flowId)
            .or('mobile_screenshot_url.not.is.null,desktop_screenshot_url.not.is.null')
            .order('created_at', { ascending: false });
          
          if (flowError) throw flowError;
          
          // Deduplicate
          const sorted = (flowData || []).sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          const deduped = new Map<number, any>();
          for (const row of sorted) {
            if (!deduped.has(row.step_number)) {
              deduped.set(row.step_number, row);
            }
          }
          data = Array.from(deduped.values()).sort((a, b) => a.step_number - b.step_number);
        }
        
        setScreenshots(data);
      } catch (err) {
        console.error('Failed to fetch screenshots:', err);
        setError('Screenshots konnten nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };
    
    fetchScreenshots();
  }, [flowId]);
  
  if (loading) {
    return (
      <div className={cn("animate-pulse space-y-4", className)}>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }
  
  if (error || screenshots.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 text-muted-foreground", className)}>
        <ImageOff className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-sm">{error || 'Keine Screenshots verfügbar'}</p>
        <Badge variant="outline" className="mt-2">{flowId}</Badge>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {screenshots.map((screenshot) => {
        const url = viewMode === 'mobile' 
          ? screenshot.mobile_screenshot_url 
          : screenshot.desktop_screenshot_url;
        
        return (
          <div key={screenshot.step_number} className="relative">
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2 z-10 shadow-sm"
            >
              Step {screenshot.step_number}
            </Badge>
            
            {url ? (
              <img
                src={url}
                alt={`${flowId} Step ${screenshot.step_number} ${viewMode}`}
                className={cn(
                  "w-full rounded-lg border shadow-sm bg-background",
                  viewMode === 'mobile' && "max-w-[375px] mx-auto"
                )}
                loading="lazy"
              />
            ) : (
              <div className="h-48 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Kein {viewMode} Screenshot</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface ViewModeToggleProps {
  value: 'mobile' | 'desktop';
  onChange: (mode: 'mobile' | 'desktop') => void;
  className?: string;
}

export function ViewModeToggle({ value, onChange, className }: ViewModeToggleProps) {
  return (
    <div className={cn("inline-flex items-center rounded-lg border p-1 bg-muted/50", className)}>
      <Button
        variant={value === 'mobile' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('mobile')}
        className="gap-2"
      >
        <Smartphone className="h-4 w-4" />
        <span className="hidden sm:inline">Mobile</span>
      </Button>
      <Button
        variant={value === 'desktop' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('desktop')}
        className="gap-2"
      >
        <Monitor className="h-4 w-4" />
        <span className="hidden sm:inline">Desktop</span>
      </Button>
    </div>
  );
}

interface GlobalViewModeToggleProps {
  value: 'mobile' | 'desktop';
  onChange: (mode: 'mobile' | 'desktop') => void;
  flowCount?: number;
  className?: string;
}

export function GlobalViewModeToggle({ value, onChange, flowCount, className }: GlobalViewModeToggleProps) {
  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-xl border bg-background shadow-sm", className)}>
      <span className="text-sm font-medium text-muted-foreground">
        Alle {flowCount ? `${flowCount} ` : ''}Flows:
      </span>
      <ViewModeToggle value={value} onChange={onChange} />
    </div>
  );
}
