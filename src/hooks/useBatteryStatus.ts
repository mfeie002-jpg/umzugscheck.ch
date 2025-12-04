import { useState, useEffect } from 'react';

interface BatteryState {
  level: number | null;
  charging: boolean | null;
  chargingTime: number | null;
  dischargingTime: number | null;
  isSupported: boolean;
}

export const useBatteryStatus = () => {
  const [battery, setBattery] = useState<BatteryState>({
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null,
    isSupported: false,
  });

  useEffect(() => {
    const updateBattery = (batteryManager: any) => {
      setBattery({
        level: batteryManager.level,
        charging: batteryManager.charging,
        chargingTime: batteryManager.chargingTime,
        dischargingTime: batteryManager.dischargingTime,
        isSupported: true,
      });
    };

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batteryManager: any) => {
        updateBattery(batteryManager);

        batteryManager.addEventListener('levelchange', () => updateBattery(batteryManager));
        batteryManager.addEventListener('chargingchange', () => updateBattery(batteryManager));
        batteryManager.addEventListener('chargingtimechange', () => updateBattery(batteryManager));
        batteryManager.addEventListener('dischargingtimechange', () => updateBattery(batteryManager));
      });
    }
  }, []);

  return battery;
};
