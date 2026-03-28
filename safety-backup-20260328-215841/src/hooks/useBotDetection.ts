import { useState, useEffect, useCallback, useRef } from "react";

interface BotDetectionResult {
  honeypotValue: string;
  setHoneypotValue: (value: string) => void;
  isBot: boolean;
  formStartTime: number;
  checkSubmission: () => { isValid: boolean; reason?: string };
}

/**
 * Hook for basic bot detection using honeypot field and timing analysis
 * 
 * Detection methods:
 * 1. Honeypot field - if filled, likely a bot
 * 2. Timing analysis - if form submitted too quickly (<3 seconds), likely a bot
 * 3. JavaScript check - bots often don't execute JavaScript properly
 */
export const useBotDetection = (minSubmitTimeMs: number = 3000): BotDetectionResult => {
  const [honeypotValue, setHoneypotValue] = useState("");
  const [isBot, setIsBot] = useState(false);
  const formStartTime = useRef(Date.now());
  const jsCheckPassed = useRef(false);

  // JavaScript execution check - bots often fail this
  useEffect(() => {
    jsCheckPassed.current = true;
    formStartTime.current = Date.now();
  }, []);

  // Detect if honeypot was filled
  useEffect(() => {
    if (honeypotValue.length > 0) {
      setIsBot(true);
      console.log("Bot detected: honeypot field filled");
    }
  }, [honeypotValue]);

  const checkSubmission = useCallback((): { isValid: boolean; reason?: string } => {
    // Check honeypot
    if (honeypotValue.length > 0) {
      return { isValid: false, reason: "honeypot" };
    }

    // Check JavaScript execution
    if (!jsCheckPassed.current) {
      return { isValid: false, reason: "js_check" };
    }

    // Check timing (form submitted too quickly)
    const timeSinceStart = Date.now() - formStartTime.current;
    if (timeSinceStart < minSubmitTimeMs) {
      return { isValid: false, reason: "timing" };
    }

    return { isValid: true };
  }, [honeypotValue, minSubmitTimeMs]);

  return {
    honeypotValue,
    setHoneypotValue,
    isBot,
    formStartTime: formStartTime.current,
    checkSubmission
  };
};

export default useBotDetection;
