export interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }
  
  return Notification.permission;
};

export const sendNotification = async (config: NotificationConfig): Promise<void> => {
  const permission = await requestNotificationPermission();
  
  if (permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Send through service worker for better reliability
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(config.title, {
          body: config.body,
          icon: config.icon || '/icon-192.png',
          badge: config.badge || '/icon-192.png',
          tag: config.tag,
          data: config.data,
        });
      });
    } else {
      // Fallback to regular notification
      new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/icon-192.png',
        badge: config.badge || '/icon-192.png',
        tag: config.tag,
        data: config.data,
      });
    }
  }
};

export const checkNotificationSupport = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
};
