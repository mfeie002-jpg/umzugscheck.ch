import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface SessionTimeoutWarningProps {
  warningTime?: number; // Seconds before timeout to show warning
  timeoutTime?: number; // Total session timeout in seconds
}

export default function SessionTimeoutWarning({
  warningTime = 300, // 5 minutes warning
  timeoutTime = 1800, // 30 minutes total
}: SessionTimeoutWarningProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(warningTime);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
    setCountdown(warningTime);
  }, [warningTime]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    toast.info("Sitzung abgelaufen - Bitte erneut anmelden");
  }, []);

  const extendSession = useCallback(() => {
    resetTimer();
    toast.success("Sitzung verlängert");
  }, [resetTimer]);

  // Track user activity
  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    
    const handleActivity = () => {
      if (!showWarning) {
        setLastActivity(Date.now());
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [showWarning]);

  // Check for timeout
  useEffect(() => {
    const checkTimeout = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastActivity) / 1000;
      const remaining = timeoutTime - elapsed;

      if (remaining <= 0) {
        handleLogout();
      } else if (remaining <= warningTime && !showWarning) {
        setShowWarning(true);
        setCountdown(Math.floor(remaining));
      }
    }, 1000);

    return () => clearInterval(checkTimeout);
  }, [lastActivity, timeoutTime, warningTime, showWarning, handleLogout]);

  // Countdown timer
  useEffect(() => {
    if (!showWarning) return;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [showWarning, handleLogout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sitzung läuft ab</AlertDialogTitle>
          <AlertDialogDescription>
            Ihre Sitzung läuft in {formatTime(countdown)} ab. Möchten Sie angemeldet bleiben?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLogout}>Abmelden</AlertDialogCancel>
          <AlertDialogAction onClick={extendSession}>
            Angemeldet bleiben
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
