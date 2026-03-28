import { useState, useEffect, useRef, useCallback } from 'react';

interface FrameRateConfig {
  sampleSize?: number;        // Number of frames to average
  lowFpsThreshold?: number;   // FPS below this = poor performance
  criticalFpsThreshold?: number; // FPS below this = disable all animations
  checkInterval?: number;     // How often to update state (ms)
}

interface FrameRateState {
  fps: number;
  isLowPerformance: boolean;
  isCriticalPerformance: boolean;
  shouldReduceAnimations: boolean;
  shouldDisableAnimations: boolean;
  performanceLevel: 'high' | 'medium' | 'low' | 'critical';
}

const DEFAULT_CONFIG: Required<FrameRateConfig> = {
  sampleSize: 60,
  lowFpsThreshold: 30,
  criticalFpsThreshold: 15,
  checkInterval: 1000,
};

export function useFrameRateMonitor(config: FrameRateConfig = {}): FrameRateState {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [state, setState] = useState<FrameRateState>({
    fps: 60,
    isLowPerformance: false,
    isCriticalPerformance: false,
    shouldReduceAnimations: false,
    shouldDisableAnimations: false,
    performanceLevel: 'high',
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const rafIdRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const calculateFps = useCallback(() => {
    const frameTimes = frameTimesRef.current;
    if (frameTimes.length < 2) return 60;

    const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    return Math.round(1000 / avgFrameTime);
  }, []);

  const getPerformanceLevel = useCallback((fps: number): 'high' | 'medium' | 'low' | 'critical' => {
    if (fps < mergedConfig.criticalFpsThreshold) return 'critical';
    if (fps < mergedConfig.lowFpsThreshold) return 'low';
    if (fps < 50) return 'medium';
    return 'high';
  }, [mergedConfig.criticalFpsThreshold, mergedConfig.lowFpsThreshold]);

  useEffect(() => {
    // Don't run on server or if requestAnimationFrame is not available
    if (typeof window === 'undefined' || !window.requestAnimationFrame) {
      return;
    }

    const measureFrame = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      // Only add valid frame times (ignore very long frames from tab switching)
      if (deltaTime > 0 && deltaTime < 500) {
        frameTimesRef.current.push(deltaTime);
        
        // Keep only the last N samples
        if (frameTimesRef.current.length > mergedConfig.sampleSize) {
          frameTimesRef.current.shift();
        }
      }

      // Update state at specified interval
      if (currentTime - lastUpdateRef.current >= mergedConfig.checkInterval) {
        lastUpdateRef.current = currentTime;
        
        const fps = calculateFps();
        const performanceLevel = getPerformanceLevel(fps);
        const isLowPerformance = performanceLevel === 'low' || performanceLevel === 'critical';
        const isCriticalPerformance = performanceLevel === 'critical';

        setState({
          fps,
          isLowPerformance,
          isCriticalPerformance,
          shouldReduceAnimations: isLowPerformance,
          shouldDisableAnimations: isCriticalPerformance,
          performanceLevel,
        });

        // Log performance warnings in development
        if (import.meta.env.DEV && isLowPerformance) {
          console.warn(
            `[Performance] Low FPS detected: ${fps} FPS (${performanceLevel})`
          );
        }
      }

      rafIdRef.current = requestAnimationFrame(measureFrame);
    };

    // Start measuring
    rafIdRef.current = requestAnimationFrame(measureFrame);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [
    mergedConfig.sampleSize,
    mergedConfig.checkInterval,
    calculateFps,
    getPerformanceLevel,
  ]);

  return state;
}

// Lightweight version that only checks occasionally
export function useLightweightPerformanceCheck(): boolean {
  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);
  const checksRef = useRef(0);
  const lowFpsCountRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastTime = performance.now();
    let rafId: number;

    const check = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      // Only check every 10 frames to reduce overhead
      checksRef.current++;
      if (checksRef.current % 10 === 0) {
        const fps = 1000 / delta;
        
        if (fps < 25) {
          lowFpsCountRef.current++;
        } else {
          lowFpsCountRef.current = Math.max(0, lowFpsCountRef.current - 1);
        }

        // If we've had 3+ low FPS readings, reduce animations
        if (lowFpsCountRef.current >= 3 && !shouldReduceAnimations) {
          setShouldReduceAnimations(true);
        }
        
        // If performance recovers, re-enable (with hysteresis)
        if (lowFpsCountRef.current === 0 && shouldReduceAnimations && checksRef.current > 100) {
          setShouldReduceAnimations(false);
        }
      }

      rafId = requestAnimationFrame(check);
    };

    rafId = requestAnimationFrame(check);

    return () => cancelAnimationFrame(rafId);
  }, [shouldReduceAnimations]);

  return shouldReduceAnimations;
}
