import { supabase } from "@/integrations/supabase/client";

export interface NotificationPayload {
  type: 'new_lead' | 'bid_update' | 'review_submitted' | 'performance_milestone';
  recipientId: string;
  title: string;
  message: string;
  data?: any;
}

export const sendRealtimeNotification = async (payload: NotificationPayload) => {
  try {
    const { error } = await supabase.functions.invoke('send-realtime-notification', {
      body: payload
    });

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error };
  }
};

export const subscribeToNotifications = (
  userId: string,
  onNotification: (notification: any) => void
) => {
  const channel = supabase
    .channel('notifications')
    .on('broadcast', { event: '*' }, (payload) => {
      if (payload.payload.recipientId === userId) {
        onNotification(payload.payload);
      }
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
