import { motion } from 'framer-motion';
import { Battery, BatteryCharging, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';
import { useBatteryStatus } from '@/hooks/useBatteryStatus';

export const BatteryIndicator = () => {
  const { level, charging, isSupported } = useBatteryStatus();

  if (!isSupported || level === null) return null;

  const percentage = Math.round(level * 100);

  const getBatteryIcon = () => {
    if (charging) return BatteryCharging;
    if (percentage <= 20) return BatteryLow;
    if (percentage <= 50) return BatteryMedium;
    if (percentage <= 80) return Battery;
    return BatteryFull;
  };

  const getColor = () => {
    if (charging) return 'text-green-500';
    if (percentage <= 20) return 'text-red-500';
    if (percentage <= 50) return 'text-amber-500';
    return 'text-green-500';
  };

  const Icon = getBatteryIcon();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-1 text-xs ${getColor()}`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{percentage}%</span>
    </motion.div>
  );
};
