import { useState, useEffect, useCallback } from 'react';

type OrientationType = 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary';
type OrientationLockType = 'any' | 'natural' | 'landscape' | 'portrait' | 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary';

interface UseScreenOrientationReturn {
  orientation: OrientationType | null;
  angle: number;
  isPortrait: boolean;
  isLandscape: boolean;
  isSupported: boolean;
  lockSupported: boolean;
  lock: (orientation: OrientationLockType) => Promise<boolean>;
  unlock: () => void;
}

export function useScreenOrientation(): UseScreenOrientationReturn {
  const [orientation, setOrientation] = useState<OrientationType | null>(null);
  const [angle, setAngle] = useState(0);

  const isSupported = typeof window !== 'undefined' && 'screen' in window && 'orientation' in screen;
  const lockSupported = isSupported && 'lock' in screen.orientation;

  const updateOrientation = useCallback(() => {
    if (!isSupported) return;
    
    setOrientation(screen.orientation.type as OrientationType);
    setAngle(screen.orientation.angle);
  }, [isSupported]);

  const lock = useCallback(async (lockType: OrientationLockType): Promise<boolean> => {
    if (!lockSupported) return false;

    try {
      await (screen.orientation as any).lock(lockType);
      return true;
    } catch (err) {
      console.warn('Failed to lock orientation:', err);
      return false;
    }
  }, [lockSupported]);

  const unlock = useCallback(() => {
    if (!lockSupported) return;

    try {
      screen.orientation.unlock();
    } catch (err) {
      console.warn('Failed to unlock orientation:', err);
    }
  }, [lockSupported]);

  useEffect(() => {
    if (!isSupported) return;

    updateOrientation();
    screen.orientation.addEventListener('change', updateOrientation);

    return () => {
      screen.orientation.removeEventListener('change', updateOrientation);
    };
  }, [isSupported, updateOrientation]);

  return {
    orientation,
    angle,
    isPortrait: orientation?.startsWith('portrait') || false,
    isLandscape: orientation?.startsWith('landscape') || false,
    isSupported,
    lockSupported,
    lock,
    unlock
  };
}
