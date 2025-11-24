import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
      setIsSubscribed(!!sub);
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const subscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Notification permission denied");
      }

      // Subscribe to push notifications
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY || ""
        ),
      });

      setSubscription(sub);
      setIsSubscribed(true);

      // Save subscription to backend
      await saveSubscription(sub);

      return sub;
    } catch (error) {
      console.error("Error subscribing to push:", error);
      throw error;
    }
  };

  const unsubscribe = async () => {
    try {
      if (!subscription) return;

      await subscription.unsubscribe();
      setSubscription(null);
      setIsSubscribed(false);

      // Remove subscription from backend
      await removeSubscription(subscription);
    } catch (error) {
      console.error("Error unsubscribing from push:", error);
      throw error;
    }
  };

  const saveSubscription = async (sub: PushSubscription) => {
    const { error } = await supabase.functions.invoke("save-push-subscription", {
      body: { subscription: sub.toJSON() },
    });

    if (error) {
      console.error("Error saving subscription:", error);
    }
  };

  const removeSubscription = async (sub: PushSubscription) => {
    const { error } = await supabase.functions.invoke("remove-push-subscription", {
      body: { subscription: sub.toJSON() },
    });

    if (error) {
      console.error("Error removing subscription:", error);
    }
  };

  return {
    isSupported,
    isSubscribed,
    subscription,
    subscribe,
    unsubscribe,
  };
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
