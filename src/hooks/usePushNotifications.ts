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
    const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    setState(prev => ({
      ...prev,
      isSupported,
      permission: isSupported ? Notification.permission : 'denied',
    }));
  }, []);

  const requestPermission = useCallback(async () => {
    if (!state.isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));
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
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
      return true;
    } catch (error) {
      // Fallback to basic notification
      return new Notification(title, options);
    }
  }, [state.permission, requestPermission]);

  const scheduleNotification = useCallback((title: string, options: NotificationOptions, delayMs: number) => {
    return setTimeout(() => {
      showNotification(title, options);
    }, delayMs);
  }, [showNotification]);

  return {
    ...state,
    requestPermission,
    showNotification,
    scheduleNotification,
  };
};
