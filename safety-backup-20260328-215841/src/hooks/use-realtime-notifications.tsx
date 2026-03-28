import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Notification {
  type: string;
  recipientId: string;
  title: string;
  message: string;
  data?: any;
  timestamp: string;
}

export const useRealtimeNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('notifications')
      .on('broadcast', { event: '*' }, (payload) => {
        const notification = payload.payload as Notification;
        
        if (notification.recipientId === userId) {
          setNotifications(prev => [notification, ...prev]);
          
          // Show toast notification
          toast(notification.title, {
            description: notification.message,
            duration: 5000,
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return { notifications, clearNotifications };
};
