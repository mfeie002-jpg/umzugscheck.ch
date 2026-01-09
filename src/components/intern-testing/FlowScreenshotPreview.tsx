/**
 * Collapsible Screenshot Preview for Intern Testing
 * Fetches screenshots from flow_step_metrics for a given flow
 * With lightbox for zooming
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Image, Monitor, Smartphone, Loader2, AlertCircle, RefreshCw, X, ZoomIn } from 'lucide-react';
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
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxStep, setLightboxStep] = useState<number>(0);

  const fetchScreenshots = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the latest completed run for this flow
      const { data: latestRun } = await supabase
        .from('flow_analysis_runs')
        .select('id')
        .eq('flow_id', flowId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!latestRun) {
        setError('Keine Screenshots verfügbar');
        setScreenshots([]);
        return;
      }
      
      // Fetch step metrics for this specific run
      const { data, error: queryError } = await supabase
        .from('flow_step_metrics')
        .select('step_number, desktop_screenshot_url, mobile_screenshot_url')
        .eq('run_id', latestRun.id)
        .order('step_number', { ascending: true });
      
      if (queryError) throw queryError;
      
      if (!data || data.length === 0) {
        setError('Keine Screenshots verfügbar');
        setScreenshots([]);
        return;
      }
      
      const steps: StepScreenshot[] = data.map(row => ({
        stepNumber: row.step_number,
        desktopUrl: row.desktop_screenshot_url,
        mobileUrl: row.mobile_screenshot_url,
      }));
      
      setScreenshots(steps);
    } catch (err) {
      console.error('Failed to fetch screenshots:', err);
      setError('Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, [flowId]);

  // Fetch on open
  useEffect(() => {
    if (isOpen && screenshots.length === 0 && !loading && !error) {
      fetchScreenshots();
    }
  }, [isOpen, screenshots.length, loading, error, fetchScreenshots]);

  const hasScreenshots = screenshots.some(s => s.desktopUrl || s.mobileUrl);

  const openLightbox = (url: string, step: number) => {
    setLightboxUrl(url);
    setLightboxStep(step);
  };

  const closeLightbox = () => {
    setLightboxUrl(null);
    setLightboxStep(0);
  };

  return (
    <>
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
                          <button 
                            onClick={() => url && openLightbox(url, step.stepNumber)}
                            disabled={!url}
                            className={`relative bg-white/5 rounded-lg overflow-hidden border border-white/10 group transition-all ${
                              viewMode === 'mobile' ? 'w-20 h-36' : 'w-32 h-20'
                            } ${url ? 'cursor-pointer hover:border-blue-400/50' : 'cursor-default'}`}
                          >
                            {url ? (
                              <>
                                <img
                                  src={url}
                                  alt={`Step ${step.stepNumber}`}
                                  className="w-full h-full object-cover object-top"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                  <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/20">
                                <Image size={16} />
                              </div>
                            )}
                          </button>
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className="text-white/60 absolute top-4 left-4 text-sm">
              Step {lightboxStep} • {flowName}
            </div>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={lightboxUrl}
              alt={`Step ${lightboxStep}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
