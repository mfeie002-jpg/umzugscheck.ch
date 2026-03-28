/**
 * Smart Notifications System
 * Browser push notifications with smart timing
 * Reminder notifications for abandoned forms
 */

import { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X, Check, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationPermissionState {
  permission: NotificationPermission | 'unsupported';
  isSupported: boolean;
}

// Hook for managing notification permissions
export function useNotificationPermission(): NotificationPermissionState & {
  requestPermission: () => Promise<boolean>;
} {
  const [state, setState] = useState<NotificationPermissionState>({
    permission: 'default',
    isSupported: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setState({
        permission: Notification.permission,
        isSupported: true
      });
    } else {
      setState({
        permission: 'unsupported',
        isSupported: false
      });
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }, [state.isSupported]);

  return { ...state, requestPermission };
}

// Send a notification
export function sendNotification(
  title: string,
  options?: NotificationOptions & { onClick?: () => void }
): Notification | null {
  if (typeof window === 'undefined' || !('Notification' in window)) return null;
  if (Notification.permission !== 'granted') return null;

  try {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    if (options?.onClick) {
      notification.onclick = () => {
        window.focus();
        options.onClick?.();
        notification.close();
      };
    }

    return notification;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return null;
  }
}

// Smart notification scheduler
class NotificationScheduler {
  private scheduled: Map<string, NodeJS.Timeout> = new Map();

  schedule(
    id: string,
    title: string,
    options: NotificationOptions & { delayMs: number; onClick?: () => void }
  ) {
    // Clear existing scheduled notification with same ID
    this.cancel(id);

    const { delayMs, ...notificationOptions } = options;

    const timeout = setTimeout(() => {
      sendNotification(title, notificationOptions);
      this.scheduled.delete(id);
    }, delayMs);

    this.scheduled.set(id, timeout);
  }

  cancel(id: string) {
    const existing = this.scheduled.get(id);
    if (existing) {
      clearTimeout(existing);
      this.scheduled.delete(id);
    }
  }

  cancelAll() {
    this.scheduled.forEach(timeout => clearTimeout(timeout));
    this.scheduled.clear();
  }
}

export const notificationScheduler = new NotificationScheduler();

// Notification permission prompt component
interface NotificationPromptProps {
  className?: string;
  variant?: 'banner' | 'card' | 'minimal';
  onPermissionChange?: (granted: boolean) => void;
}

export const NotificationPrompt = memo(function NotificationPrompt({
  className,
  variant = 'card',
  onPermissionChange
}: NotificationPromptProps) {
  const { permission, isSupported, requestPermission } = useNotificationPermission();
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if already dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('umzugscheck_notification_dismissed');
    if (dismissed) setIsDismissed(true);
  }, []);

  const handleRequest = async () => {
    const granted = await requestPermission();
    onPermissionChange?.(granted);
    
    if (granted) {
      // Send welcome notification
      sendNotification('Benachrichtigungen aktiviert! 🎉', {
        body: 'Sie erhalten jetzt Updates zu Ihren Offerten.',
        tag: 'welcome'
      });
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('umzugscheck_notification_dismissed', 'true');
  };

  // Don't show if not supported, already granted, or dismissed
  if (!isSupported || permission === 'granted' || permission === 'denied' || isDismissed) {
    return null;
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleRequest}
        className={cn(
          'inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors',
          className
        )}
      >
        <Bell className="w-4 h-4" />
        <span>Benachrichtigungen aktivieren</span>
      </button>
    );
  }

  if (variant === 'banner') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            'bg-primary/10 border-b border-primary/20 px-4 py-3',
            className
          )}
        >
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <p className="text-sm">
                <strong>Verpassen Sie keine Offerte!</strong>{' '}
                Aktivieren Sie Benachrichtigungen für Updates.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleRequest}>
                Aktivieren
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismiss}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Card variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'bg-card rounded-xl border shadow-lg p-6 max-w-sm',
        className
      )}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Bell className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Benachrichtigungen</h3>
          <p className="text-sm text-muted-foreground">Bleiben Sie informiert</p>
        </div>
      </div>

      <ul className="space-y-2 mb-6">
        <li className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-500" />
          <span>Neue Offerten sofort erhalten</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-500" />
          <span>Preisalarme bei günstigen Angeboten</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-500" />
          <span>Erinnerungen an wichtige Termine</span>
        </li>
      </ul>

      <div className="flex gap-2">
        <Button onClick={handleRequest} className="flex-1">
          <Bell className="w-4 h-4 mr-2" />
          Aktivieren
        </Button>
        <Button variant="outline" onClick={handleDismiss}>
          Später
        </Button>
      </div>
    </motion.div>
  );
});

// Abandoned form reminder hook
export function useAbandonedFormReminder(formName: string, reminderDelayMs = 30 * 60 * 1000) {
  const { permission } = useNotificationPermission();

  useEffect(() => {
    if (permission !== 'granted') return;

    // Schedule reminder when user leaves the page with incomplete form
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User left the page - schedule reminder
        notificationScheduler.schedule(
          `reminder_${formName}`,
          'Formular nicht abgeschlossen? 📝',
          {
            body: 'Vervollständigen Sie Ihre Anfrage und erhalten Sie kostenlose Offerten.',
            delayMs: reminderDelayMs,
            tag: 'form-reminder',
            onClick: () => {
              window.location.href = window.location.href;
            }
          }
        );
      } else {
        // User returned - cancel reminder
        notificationScheduler.cancel(`reminder_${formName}`);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      notificationScheduler.cancel(`reminder_${formName}`);
    };
  }, [formName, permission, reminderDelayMs]);
}

// Notification types for different events
export const notificationTemplates = {
  newOffer: (companyName: string) => ({
    title: 'Neue Offerte erhalten! 🎉',
    body: `${companyName} hat Ihnen eine Offerte gesendet.`,
    tag: 'new-offer'
  }),

  priceAlert: (price: number) => ({
    title: 'Preisalarm! 💰',
    body: `Ein Anbieter bietet Umzug ab CHF ${price}`,
    tag: 'price-alert'
  }),

  reminder: (daysUntilMove: number) => ({
    title: `Noch ${daysUntilMove} Tage bis zum Umzug! 📦`,
    body: 'Haben Sie alle Vorbereitungen getroffen?',
    tag: 'move-reminder'
  }),

  offerExpiring: (hoursLeft: number) => ({
    title: 'Offerte läuft bald ab ⏰',
    body: `Noch ${hoursLeft} Stunden bis zum Ablauf. Jetzt prüfen!`,
    tag: 'offer-expiring'
  })
};

export default NotificationPrompt;
