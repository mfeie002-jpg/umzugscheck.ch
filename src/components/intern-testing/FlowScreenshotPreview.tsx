/**
 * Collapsible Screenshot Preview for Intern Testing
 * Fetches screenshots from flow_step_metrics for a given flow
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Image, Monitor, Smartphone, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FlowScreenshotPreviewProps {
  flowId: string;
  flowName: string;
  totalSteps: number;
  className?: string;
}

interface StepScreenshot {
  stepNumber: number;
  desktopUrl: string | null;
  mobileUrl: string | null;
}

export function FlowScreenshotPreview({ flowId, flowName, totalSteps, className = '' }: FlowScreenshotPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenshots, setScreenshots] = useState<StepScreenshot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('mobile');

  // Normalize flow ID to check multiple variants
  const getFlowIdCandidates = useCallback((id: string) => {
    const normalized = id.startsWith('umzugsofferten-') 
      ? id.replace('umzugsofferten-', '') 
      : id;
    return Array.from(new Set([id, normalized, `umzugsofferten-${normalized}`]));
  }, []);

  const fetchScreenshots = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const flowIds = getFlowIdCandidates(flowId);
      
      // Get completed runs first
      const { data: runs } = await supabase
        .from('flow_analysis_runs')
        .select('id')
        .in('flow_id', flowIds)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(3);
      
      const runIds = runs?.map(r => r.id) || [];
      
      // Fetch step metrics
      let query = supabase
        .from('flow_step_metrics')
        .select('step_number, desktop_screenshot_url, mobile_screenshot_url')
        .in('flow_id', flowIds)
        .order('step_number', { ascending: true });
      
      if (runIds.length > 0) {
        query = query.in('run_id', runIds);
      }
      
      const { data, error: queryError } = await query;
      
      if (queryError) throw queryError;
      
      if (!data || data.length === 0) {
        setError('Keine Screenshots verfügbar');
        setScreenshots([]);
        return;
      }
      
      // Deduplicate by step number, keeping the one with most data
      const byStep = new Map<number, StepScreenshot>();
      for (const row of data) {
        const existing = byStep.get(row.step_number);
        if (!existing) {
          byStep.set(row.step_number, {
            stepNumber: row.step_number,
            desktopUrl: row.desktop_screenshot_url,
            mobileUrl: row.mobile_screenshot_url,
          });
        } else {
          // Merge: fill in missing URLs
          byStep.set(row.step_number, {
            stepNumber: row.step_number,
            desktopUrl: existing.desktopUrl || row.desktop_screenshot_url,
            mobileUrl: existing.mobileUrl || row.mobile_screenshot_url,
          });
        }
      }
      
      const steps = Array.from(byStep.values())
        .sort((a, b) => a.stepNumber - b.stepNumber)
        .slice(0, totalSteps || 10); // Limit to expected steps
      
      setScreenshots(steps);
    } catch (err) {
      console.error('Failed to fetch screenshots:', err);
      setError('Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, [flowId, totalSteps, getFlowIdCandidates]);

  // Fetch on open
  useEffect(() => {
    if (isOpen && screenshots.length === 0 && !loading && !error) {
      fetchScreenshots();
    }
  }, [isOpen, screenshots.length, loading, error, fetchScreenshots]);

  const hasScreenshots = screenshots.some(s => s.desktopUrl || s.mobileUrl);

  return (
    <div className={`${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 text-sm transition-all touch-manipulation w-full"
      >
        <Image size={16} className="text-blue-400" />
        <span className="flex-1 text-left">Screenshots</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    viewMode === 'mobile' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Smartphone size={14} />
                  Mobile
                </button>
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    viewMode === 'desktop' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Monitor size={14} />
                  Desktop
                </button>
                
                {screenshots.length > 0 && (
                  <button
                    onClick={fetchScreenshots}
                    disabled={loading}
                    className="ml-auto p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white/70 transition-colors"
                    title="Neu laden"
                  >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  </button>
                )}
              </div>

              {/* Content */}
              {loading ? (
                <div className="flex items-center justify-center py-8 text-white/40">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center gap-2 py-6 text-white/40 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              ) : !hasScreenshots ? (
                <div className="text-center py-6 text-white/40 text-sm">
                  Noch keine Screenshots vorhanden
                </div>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
                  {screenshots.map((step) => {
                    const url = viewMode === 'mobile' ? step.mobileUrl : step.desktopUrl;
                    return (
                      <div
                        key={step.stepNumber}
                        className="flex-shrink-0 space-y-1"
                      >
                        <div className="text-[10px] text-white/40 text-center">
                          Step {step.stepNumber}
                        </div>
                        <div 
                          className={`bg-white/5 rounded-lg overflow-hidden border border-white/10 ${
                            viewMode === 'mobile' ? 'w-20 h-36' : 'w-32 h-20'
                          }`}
                        >
                          {url ? (
                            <img
                              src={url}
                              alt={`Step ${step.stepNumber}`}
                              className="w-full h-full object-cover object-top"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <Image size={16} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
