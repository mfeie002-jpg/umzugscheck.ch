import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { useGamepad } from '@/hooks/useGamepad';
import { cn } from '@/lib/utils';

interface GamepadIndicatorProps {
  className?: string;
  showDetails?: boolean;
  onButtonPress?: (gamepadIndex: number, buttonIndex: number) => void;
  onButtonRelease?: (gamepadIndex: number, buttonIndex: number) => void;
}

export function GamepadIndicator({
  className,
  showDetails = false,
  onButtonPress,
  onButtonRelease
}: GamepadIndicatorProps) {
  const { gamepads, isSupported } = useGamepad({
    onButtonPress,
    onButtonRelease
  });

  if (!isSupported) return null;

  const connectedCount = gamepads.length;

  if (connectedCount === 0 && !showDetails) return null;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Gamepad2 className={cn(
        'w-4 h-4 transition-colors',
        connectedCount > 0 ? 'text-green-500' : 'text-muted-foreground'
      )} />
      {showDetails && (
        <div className="text-sm">
          {connectedCount > 0 ? (
            <span className="text-green-500">
              {connectedCount} Controller verbunden
            </span>
          ) : (
            <span className="text-muted-foreground">
              Kein Controller
            </span>
          )}
        </div>
      )}
      {showDetails && gamepads.map((gamepad, index) => (
        <div key={index} className="text-xs text-muted-foreground">
          {gamepad.id?.slice(0, 20)}
        </div>
      ))}
    </div>
  );
}
