import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VideoAnalysisStats {
  pending: number;
  reviewing: number;
  analyzed: number;
  total: number;
}

export function useVideoAnalysisNotifications() {
  const [lastCount, setLastCount] = useState<number | null>(null);

  // Fetch pending video analyses count
  const { data: stats, refetch } = useQuery({
    queryKey: ['video-analysis-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_analyses')
        .select('status');
      
      if (error) throw error;
      
      const pending = data?.filter(v => v.status === 'pending').length || 0;
      const reviewing = data?.filter(v => v.status === 'reviewing').length || 0;
      const analyzed = data?.filter(v => v.status === 'analyzed').length || 0;
      
      return {
        pending,
        reviewing,
        analyzed,
        total: data?.length || 0
      } as VideoAnalysisStats;
    },
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('video-analyses-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'video_analyses'
        },
        (payload) => {
          // New video uploaded - show notification
          const newAnalysis = payload.new as { user_email: string; from_city?: string; to_city?: string };
          toast.info('Neues Video hochgeladen!', {
            description: `${newAnalysis.user_email} - ${newAnalysis.from_city || 'Unbekannt'} → ${newAnalysis.to_city || 'Unbekannt'}`,
            action: {
              label: 'Anzeigen',
              onClick: () => window.location.href = '/admin/video-analyses'
            },
            duration: 10000
          });
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Notify when new pending videos appear
  useEffect(() => {
    if (stats && lastCount !== null && stats.pending > lastCount) {
      toast.info(`${stats.pending - lastCount} neue Video(s) warten auf Analyse`, {
        action: {
          label: 'Jetzt prüfen',
          onClick: () => window.location.href = '/admin/video-analyses'
        }
      });
    }
    if (stats) {
      setLastCount(stats.pending);
    }
  }, [stats?.pending, lastCount]);

  return {
    stats,
    refetch,
    pendingCount: stats?.pending || 0,
    hasNewVideos: (stats?.pending || 0) > 0
  };
}
