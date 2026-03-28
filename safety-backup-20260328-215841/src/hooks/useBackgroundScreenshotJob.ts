import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

interface StepConfig {
  step: number;
  name: string;
  description?: string;
}

interface BackgroundJobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  progressMessage: string;
  error?: string;
}

interface StartJobParams {
  versionId: string;
  flowId: string;
  steps: StepConfig[];
  baseUrl: string;
  captureDesktop?: boolean;
  captureMobile?: boolean;
}

export function useBackgroundScreenshotJob() {
  const [activeJob, setActiveJob] = useState<BackgroundJobStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Poll for job status
  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('export_jobs')
        .select('id, status, progress, progress_message, error_message')
        .eq('id', jobId)
        .single();

      if (error) {
        console.error('Error polling job status:', error);
        return null;
      }

      return {
        id: data.id,
        status: data.status as BackgroundJobStatus['status'],
        progress: data.progress || 0,
        progressMessage: data.progress_message || '',
        error: data.error_message || undefined,
      };
    } catch (err) {
      console.error('Poll error:', err);
      return null;
    }
  }, []);

  // Start polling when there's an active job
  useEffect(() => {
    if (!activeJob || activeJob.status === 'completed' || activeJob.status === 'failed') {
      setIsPolling(false);
      return;
    }

    setIsPolling(true);
    const interval = setInterval(async () => {
      const status = await pollJobStatus(activeJob.id);
      if (status) {
        setActiveJob(status);
        
        if (status.status === 'completed') {
          toast.success('Screenshot-Erfassung abgeschlossen!');
          clearInterval(interval);
          setIsPolling(false);
        } else if (status.status === 'failed') {
          toast.error(`Screenshot-Erfassung fehlgeschlagen: ${status.error || 'Unbekannter Fehler'}`);
          clearInterval(interval);
          setIsPolling(false);
        }
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [activeJob, pollJobStatus]);

  // Start a new background job
  const startJob = async (params: StartJobParams): Promise<string | null> => {
    try {
      // Create job record first
      // NOTE: We set job_type explicitly so the UI can reliably find/resume jobs after reload.
      const configData = {
        type: 'screenshot_capture',
        versionId: params.versionId,
        flowId: params.flowId,
        steps: params.steps.map(s => ({ step: s.step, name: s.name, description: s.description })),
        baseUrl: params.baseUrl,
      } as Json;

      const { data: jobData, error: jobError } = await supabase
        .from('export_jobs')
        .insert({
          job_type: 'screenshot_capture',
          status: 'pending',
          progress: 0,
          progress_message: 'Job wird gestartet...',
          config: configData,
        })
        .select()
        .single();

      if (jobError) throw jobError;

      const jobId = jobData.id;

      setActiveJob({
        id: jobId,
        status: 'pending',
        progress: 0,
        progressMessage: 'Job wird gestartet...',
      });

      // Trigger the edge function (fire and forget)
      supabase.functions.invoke('capture-flow-screenshots-background', {
        body: {
          jobId,
          versionId: params.versionId,
          flowId: params.flowId,
          steps: params.steps,
          baseUrl: params.baseUrl,
          captureDesktop: params.captureDesktop ?? true,
          captureMobile: params.captureMobile ?? true,
        },
      }).catch(err => {
        console.error('Edge function error:', err);
      });

      toast.success('Background-Screenshot-Job gestartet. Du kannst die Seite schliessen.');
      return jobId;
    } catch (err) {
      console.error('Failed to start background job:', err);
      toast.error('Job konnte nicht gestartet werden');
      return null;
    }
  };

  // Cancel/clear the current job
  const clearJob = () => {
    setActiveJob(null);
    setIsPolling(false);
  };

  // Check for any pending jobs (e.g. after reload)
  const checkPendingJobs = async (versionId: string) => {
    try {
      const { data, error } = await supabase
        .from('export_jobs')
        .select('id, status, progress, progress_message, error_message, config, created_at')
        .in('status', ['pending', 'processing'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const match = (data || []).find((job) => {
        const config = job.config as { versionId?: string; type?: string } | null;
        return config?.type === 'screenshot_capture' && config?.versionId === versionId;
      });

      if (match) {
        setActiveJob({
          id: match.id,
          status: match.status as BackgroundJobStatus['status'],
          progress: match.progress || 0,
          progressMessage: match.progress_message || '',
          error: match.error_message || undefined,
        });
      }
    } catch (err) {
      console.error('Failed to check pending jobs:', err);
    }
  };

  return {
    activeJob,
    isPolling,
    startJob,
    clearJob,
    checkPendingJobs,
  };
}
