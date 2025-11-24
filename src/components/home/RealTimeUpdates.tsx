import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

interface Update {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export const RealTimeUpdates = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to real-time updates for leads and reviews
    const leadsChannel = supabase
      .channel('public:leads')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads'
        },
        () => {
          const newUpdate: Update = {
            id: Date.now().toString(),
            type: 'lead',
            message: 'Neue Offerteanfrage eingegangen',
            timestamp: new Date().toISOString()
          };
          setUpdates(prev => [newUpdate, ...prev].slice(0, 5));
        }
      )
      .subscribe();

    const reviewsChannel = supabase
      .channel('public:reviews')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews'
        },
        () => {
          const newUpdate: Update = {
            id: Date.now().toString(),
            type: 'review',
            message: 'Neue Kundenbewertung veröffentlicht',
            timestamp: new Date().toISOString()
          };
          setUpdates(prev => [newUpdate, ...prev].slice(0, 5));
          
          toast({
            title: "Neue Bewertung",
            description: "Eine neue Kundenbewertung wurde gerade hinzugefügt.",
            duration: 3000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(reviewsChannel);
    };
  }, [toast]);

  if (updates.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 hidden lg:block">
      <div className="bg-card border-2 border-primary/20 rounded-xl shadow-xl p-4 max-w-sm">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">Live Updates</h4>
        </div>
        <div className="space-y-2">
          {updates.slice(0, 3).map((update) => (
            <div
              key={update.id}
              className="text-xs text-muted-foreground p-2 bg-secondary/20 rounded-lg"
            >
              <p className="font-medium text-foreground">{update.message}</p>
              <p className="text-[10px] mt-1">
                {new Date(update.timestamp).toLocaleTimeString('de-CH')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
