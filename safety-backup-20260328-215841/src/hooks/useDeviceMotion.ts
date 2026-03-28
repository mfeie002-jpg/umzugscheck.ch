import { useState, useEffect, useCallback } from 'react';

interface MotionData {
  acceleration: { x: number | null; y: number | null; z: number | null };
  rotationRate: { alpha: number | null; beta: number | null; gamma: number | null };
  interval: number | null;
}

export const useDeviceMotion = () => {
  const [motion, setMotion] = useState<MotionData>({
    acceleration: { x: null, y: null, z: null },
    rotationRate: { alpha: null, beta: null, gamma: null },
    interval: null,
  });
  const [isShaking, setIsShaking] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermission = useCallback(async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        setPermissionGranted(permission === 'granted');
        return permission === 'granted';
      } catch {
        return false;
      }
    }
    // Permission not required
    setPermissionGranted(true);
    return true;
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    let lastShakeTime = 0;
    const SHAKE_THRESHOLD = 15;
    const SHAKE_INTERVAL = 1000;

    const handleMotion = (event: DeviceMotionEvent) => {
      const { acceleration, rotationRate, interval } = event;

      setMotion({
        acceleration: {
          x: acceleration?.x || null,
          y: acceleration?.y || null,
          z: acceleration?.z || null,
        },
        rotationRate: {
          alpha: rotationRate?.alpha || null,
          beta: rotationRate?.beta || null,
          gamma: rotationRate?.gamma || null,
        },
        interval,
      });

      // Shake detection
      const accX = Math.abs(acceleration?.x || 0);
      const accY = Math.abs(acceleration?.y || 0);
      const accZ = Math.abs(acceleration?.z || 0);
      const totalAcc = accX + accY + accZ;

      if (totalAcc > SHAKE_THRESHOLD) {
        const now = Date.now();
        if (now - lastShakeTime > SHAKE_INTERVAL) {
          lastShakeTime = now;
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [permissionGranted]);

  return {
    ...motion,
    isShaking,
    permissionGranted,
    requestPermission,
  };
};
