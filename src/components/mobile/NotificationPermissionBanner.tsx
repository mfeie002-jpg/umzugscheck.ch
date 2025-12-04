import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useHaptic } from '@/hooks/use-haptic';
import { Button } from '@/components/ui/button';

export const NotificationPermissionBanner = () => {
  const { isSupported, permission, requestPermission } = usePushNotifications();
  const { trigger } = useHaptic();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show banner if notifications supported but not granted/denied
    const dismissed = localStorage.getItem('notification-banner-dismissed');
    if (isSupported && permission === 'default' && !dismissed) {
      // Delay showing the banner
      const timer = setTimeout(() => setShowBanner(true), 60000); // After 1 minute
      return () => clearTimeout(timer);
    }
  }, [isSupported, permission]);

  const handleEnable = async () => {
    trigger('medium');
    const granted = await requestPermission();
    if (granted) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    trigger('light');
    setShowBanner(false);
    localStorage.setItem('notification-banner-dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-16 left-4 right-4 z-50 lg:hidden"
      >
        <div className="bg-background rounded-2xl shadow-2xl border border-border p-4">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Bell className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1 pr-6">
              <h4 className="font-semibold text-sm">Benachrichtigungen aktivieren</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Erhalten Sie Updates zu Ihren Umzugsanfragen
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              onClick={handleDismiss}
              variant="outline"
              size="sm"
              className="flex-1 h-9"
            >
              Später
            </Button>
            <Button
              onClick={handleEnable}
              size="sm"
              className="flex-1 h-9"
            >
              Aktivieren
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
