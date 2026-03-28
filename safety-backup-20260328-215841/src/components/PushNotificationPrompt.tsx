import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, X } from "lucide-react";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useToast } from "@/hooks/use-toast";

export const PushNotificationPrompt = () => {
  const { isSupported, isSubscribed, subscribe } = usePushNotifications();
  const { toast } = useToast();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("push-prompt-dismissed");
    if (dismissed) {
      setIsDismissed(true);
    }

    // Show prompt after 10 seconds if not dismissed and notifications supported
    const timer = setTimeout(() => {
      if (!dismissed && isSupported && !isSubscribed) {
        setIsVisible(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isSupported, isSubscribed]);

  const handleSubscribe = async () => {
    try {
      await subscribe();
      toast({
        title: "Benachrichtigungen aktiviert",
        description: "Sie erhalten ab sofort Updates zu Ihren Anfragen",
      });
      setIsVisible(false);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Benachrichtigungen konnten nicht aktiviert werden",
        variant: "destructive",
      });
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("push-prompt-dismissed", "true");
  };

  if (!isVisible || isDismissed || !isSupported || isSubscribed) {
    return null;
  }

  return (
    <Card className="fixed bottom-24 right-6 w-96 shadow-2xl z-50 border-primary animate-in slide-in-from-bottom-5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Bell className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold">Benachrichtigungen aktivieren</h3>
            <p className="text-sm text-muted-foreground">
              Erhalten Sie Updates zu neuen Angeboten, Preisänderungen und wichtigen Nachrichten
            </p>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSubscribe} size="sm" className="flex-1">
                Aktivieren
              </Button>
              <Button onClick={handleDismiss} size="sm" variant="ghost">
                Später
              </Button>
            </div>
          </div>
          <Button
            onClick={handleDismiss}
            size="icon"
            variant="ghost"
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
