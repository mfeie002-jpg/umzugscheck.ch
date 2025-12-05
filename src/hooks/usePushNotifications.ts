import { useState, useEffect, useCallback } from 'react';

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: 'default',
    isSubscribed: false,
  });

  useEffect(() => {
    const isSupported = 'Notification' in window;
    setState(prev => ({
      ...prev,
      isSupported,
      permission: isSupported ? Notification.permission : 'denied',
      isSubscribed: isSupported && Notification.permission === 'granted',
    }));
  }, []);

  const requestPermission = useCallback(async () => {
    if (!state.isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ 
        ...prev, 
        permission,
        isSubscribed: permission === 'granted',
      }));
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [state.isSupported]);

  const showNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (state.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    try {
      // Try service worker notification first
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });
        return true;
      }
    } catch (error) {
      // Fallback to basic notification
    }
    
    // Fallback to basic Notification API
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      ...options,
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    return notification;
  }, [state.permission, requestPermission]);

  const showLeadNotification = useCallback((lead: {
    fromCity: string;
    toCity: string;
    leadId: string;
  }) => {
    return showNotification('🚚 Neue Umzugsanfrage!', {
      body: `Umzug von ${lead.fromCity} nach ${lead.toCity}`,
      tag: `lead-${lead.leadId}`,
      requireInteraction: true,
    });
  }, [showNotification]);

  const showReviewNotification = useCallback((review: {
    rating: number;
    title: string;
    reviewId: string;
  }) => {
    return showNotification('⭐ Neue Bewertung erhalten!', {
      body: `${review.rating}/5 Sterne - "${review.title}"`,
      tag: `review-${review.reviewId}`,
    });
  }, [showNotification]);

  const showBidNotification = useCallback((bid: {
    amount: number;
    leadId: string;
  }) => {
    return showNotification('💰 Neues Gebot auf Lead!', {
      body: `CHF ${bid.amount.toFixed(2)} auf Ihre Anfrage`,
      tag: `bid-${bid.leadId}`,
    });
  }, [showNotification]);

  const scheduleNotification = useCallback((title: string, options: NotificationOptions, delayMs: number) => {
    return setTimeout(() => {
      showNotification(title, options);
    }, delayMs);
  }, [showNotification]);

  return {
    ...state,
    requestPermission,
    showNotification,
    showLeadNotification,
    showReviewNotification,
    showBidNotification,
    scheduleNotification,
  };
};
