import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

interface FlowConfig {
  flowId: string;
  flowName: string;
  stepCount: number;
  flowPath: string;
}

interface BackgroundJobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  progressMessage: string;
  error?: string;
}

interface StartBulkJobParams {
  flows: FlowConfig[];
  baseUrl: string;
  captureDesktop: boolean;
  captureMobile: boolean;
}

export function useBulkScreenshotJob() {
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
          toast.success('Bulk Screenshot-Erfassung abgeschlossen!');
          clearInterval(interval);
          setIsPolling(false);
        } else if (status.status === 'failed') {
          toast.error(`Erfassung fehlgeschlagen: ${status.error || 'Unbekannter Fehler'}`);
          clearInterval(interval);
          setIsPolling(false);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeJob, pollJobStatus]);

  // Start a new bulk job
  const startJob = async (params: StartBulkJobParams): Promise<string | null> => {
    try {
      const configData = {
        type: 'bulk_screenshot_capture',
        flowCount: params.flows.length,
        captureDesktop: params.captureDesktop,
        captureMobile: params.captureMobile,
      } as Json;

      const { data: jobData, error: jobError } = await supabase
        .from('export_jobs')
        .insert({
          job_type: 'bulk_screenshot_capture',
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
      supabase.functions.invoke('bulk-screenshot-capture', {
        body: {
          jobId,
          flows: params.flows,
          baseUrl: params.baseUrl,
          captureDesktop: params.captureDesktop,
          captureMobile: params.captureMobile,
        },
      }).catch(err => {
        console.error('Edge function error:', err);
      });

      toast.success('Background-Job gestartet. Du kannst die Seite schliessen.');
      return jobId;
    } catch (err) {
      console.error('Failed to start bulk job:', err);
      toast.error('Job konnte nicht gestartet werden');
      return null;
    }
  };

  // Cancel/clear the current job
  const clearJob = () => {
    setActiveJob(null);
    setIsPolling(false);
  };

  // Check for any pending bulk jobs
  const checkPendingJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('export_jobs')
        .select('id, status, progress, progress_message, error_message, config, created_at')
        .eq('job_type', 'bulk_screenshot_capture')
        .in('status', ['pending', 'processing'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const job = data[0];
        setActiveJob({
          id: job.id,
          status: job.status as BackgroundJobStatus['status'],
          progress: job.progress || 0,
          progressMessage: job.progress_message || '',
          error: job.error_message || undefined,
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
