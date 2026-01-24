import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BehaviorSignal,
  ArchetypeType,
  calculateArchetypeScore,
  calculateArchetypeConfidence,
} from "@/lib/archetype-signals";

interface DetectionState {
  scrollSpeeds: number[];
  clicks: number[];
  focusOrder: string[];
  startedAt: number;
}

const STORAGE_KEY = "detected_archetype";

const buildInitialState = (): DetectionState => ({
  scrollSpeeds: [],
  clicks: [],
  focusOrder: [],
  startedAt: Date.now(),
});

const buildBehaviorSignal = (state: DetectionState): BehaviorSignal => {
  const averageScrollSpeed =
    state.scrollSpeeds.reduce((sum, value) => sum + value, 0) /
      Math.max(1, state.scrollSpeeds.length);
  const clickPattern =
    state.clicks.filter((timestamp) => Date.now() - timestamp <= 1000).length;
  const dwellTime = Date.now() - state.startedAt;

  return {
    scrollSpeed: Math.min(averageScrollSpeed, 2),
    clickPattern,
    fieldFocusOrder: state.focusOrder,
    dwellTime,
  };
};

const readStoredArchetype = (): { archetype: ArchetypeType; confidence: number } | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.archetype === "string" &&
      typeof parsed.confidence === "number"
    ) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
};

const writeStoredArchetype = (archetype: ArchetypeType, confidence: number) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ archetype, confidence, updatedAt: new Date().toISOString() })
    );
  } catch {
    // ignore
  }
};

export const useArchetypeDetection = () => {
  const stateRef = useRef<DetectionState>(buildInitialState());
  const [archetype, setArchetype] = useState<ArchetypeType | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [isDetecting, setIsDetecting] = useState(true);
  const evaluate = useCallback(() => {
    const signal = buildBehaviorSignal(stateRef.current);
    const score = calculateArchetypeScore(signal);
    const currentConfidence = calculateArchetypeConfidence(signal, score);
    setArchetype(score);
    setConfidence(currentConfidence);
    setIsDetecting(false);
    writeStoredArchetype(score, currentConfidence);
  }, []);

  useEffect(() => {
    const stored = readStoredArchetype();
    if (stored) {
      setArchetype(stored.archetype);
      setConfidence(stored.confidence);
      setIsDetecting(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let lastScrollY = window.scrollY;
    let lastScrollTs = performance.now();

    const handleScroll = () => {
      const now = performance.now();
      const deltaT = now - lastScrollTs;
      const deltaY = Math.abs(window.scrollY - lastScrollY);
      lastScrollTs = now;
      lastScrollY = window.scrollY;
      const speed = deltaT > 0 ? deltaY / deltaT : 0;
      stateRef.current.scrollSpeeds.push(Math.min(speed, 2));
      if (stateRef.current.scrollSpeeds.length > 30) {
        stateRef.current.scrollSpeeds.shift();
      }
      evaluate();
    };

    const handleClick = () => {
      const now = Date.now();
      stateRef.current.clicks.push(now);
      if (stateRef.current.clicks.length > 5) {
        stateRef.current.clicks.shift();
      }
      evaluate();
    };

    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }
      const identifier =
        target.getAttribute("name") ||
        target.getAttribute("id") ||
        target.getAttribute("aria-label") ||
        target.getAttribute("placeholder") ||
        target.textContent ||
        "";
      if (!identifier) {
        return;
      }
      const cleaned = identifier.toLowerCase().trim();
      if (stateRef.current.focusOrder.includes(cleaned)) {
        return;
      }
      stateRef.current.focusOrder.push(cleaned);
      evaluate();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("focusin", handleFocus, true);

    const dwellTimer = window.setTimeout(() => {
      evaluate();
    }, 10000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("focusin", handleFocus, true);
      window.clearTimeout(dwellTimer);
    };
  }, [evaluate]);

  return useMemo(
    () => ({
      archetype,
      confidence,
      isDetecting,
    }),
    [archetype, confidence, isDetecting]
  );
};
