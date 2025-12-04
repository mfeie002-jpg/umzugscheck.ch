import { useState, useEffect, useCallback } from 'react';

interface AmbientLightState {
  illuminance: number | null;
  isSupported: boolean;
  isDark: boolean;
  isBright: boolean;
  lightLevel: 'dark' | 'dim' | 'normal' | 'bright' | 'unknown';
  error: string | null;
}

interface UseAmbientLightOptions {
  darkThreshold?: number;
  brightThreshold?: number;
  onLightChange?: (illuminance: number) => void;
  onDarkMode?: () => void;
  onBrightMode?: () => void;
}

export function useAmbientLight(options: UseAmbientLightOptions = {}): AmbientLightState & {
  requestPermission: () => Promise<boolean>;
} {
  const {
    darkThreshold = 50,
    brightThreshold = 10000,
    onLightChange,
    onDarkMode,
    onBrightMode
  } = options;

  const [state, setState] = useState<AmbientLightState>({
    illuminance: null,
    isSupported: false,
    isDark: false,
    isBright: false,
    lightLevel: 'unknown',
    error: null
  });

  const getLightLevel = useCallback((lux: number): 'dark' | 'dim' | 'normal' | 'bright' => {
    if (lux < darkThreshold) return 'dark';
    if (lux < 200) return 'dim';
    if (lux < brightThreshold) return 'normal';
    return 'bright';
  }, [darkThreshold, brightThreshold]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      // Check if the API is available
      if (!('AmbientLightSensor' in window)) {
        setState(prev => ({
          ...prev,
          isSupported: false,
          error: 'Ambient Light Sensor not supported'
        }));
        return false;
      }

      // Request permission if needed
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'ambient-light-sensor' as PermissionName });
        if (result.state === 'denied') {
          setState(prev => ({
            ...prev,
            error: 'Permission denied for ambient light sensor'
          }));
          return false;
        }
      }

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to request permission'
      }));
      return false;
    }
  }, []);

  useEffect(() => {
    // Check for support
    const isSupported = 'AmbientLightSensor' in window;
    
    if (!isSupported) {
      setState(prev => ({
        ...prev,
        isSupported: false,
        error: 'Ambient Light Sensor not supported in this browser'
      }));
      return;
    }

    setState(prev => ({ ...prev, isSupported: true }));

    let sensor: any = null;
    let previousLevel: string | null = null;

    try {
      // @ts-ignore - AmbientLightSensor is not in TypeScript types
      sensor = new window.AmbientLightSensor();
      
      sensor.addEventListener('reading', () => {
        const illuminance = sensor.illuminance;
        const isDark = illuminance < darkThreshold;
        const isBright = illuminance > brightThreshold;
        const lightLevel = getLightLevel(illuminance);

        setState(prev => ({
          ...prev,
          illuminance,
          isDark,
          isBright,
          lightLevel,
          error: null
        }));

        onLightChange?.(illuminance);

        // Trigger callbacks on threshold changes
        if (lightLevel !== previousLevel) {
          if (lightLevel === 'dark') {
            onDarkMode?.();
          } else if (lightLevel === 'bright') {
            onBrightMode?.();
          }
          previousLevel = lightLevel;
        }
      });

      sensor.addEventListener('error', (event: any) => {
        setState(prev => ({
          ...prev,
          error: event.error?.message || 'Sensor error'
        }));
      });

      sensor.start();
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to initialize sensor'
      }));
    }

    return () => {
      if (sensor) {
        try {
          sensor.stop();
        } catch (e) {
          // Sensor already stopped
        }
      }
    };
  }, [darkThreshold, brightThreshold, getLightLevel, onLightChange, onDarkMode, onBrightMode]);

  return {
    ...state,
    requestPermission
  };
}
