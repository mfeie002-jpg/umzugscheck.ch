import React from 'react';
import { Smartphone, Monitor, Lock, Unlock } from 'lucide-react';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrientationLockProps {
  className?: string;
  showControls?: boolean;
  preferredOrientation?: 'portrait' | 'landscape';
}

export function OrientationLock({
  className,
  showControls = true,
  preferredOrientation
}: OrientationLockProps) {
  const {
    orientation,
    isPortrait,
    isLandscape,
    isSupported,
    lockSupported,
    lock,
    unlock
  } = useScreenOrientation();

  const [isLocked, setIsLocked] = React.useState(false);

  if (!isSupported) return null;

  const handleLockPortrait = async () => {
    const success = await lock('portrait');
    setIsLocked(success);
  };

  const handleLockLandscape = async () => {
    const success = await lock('landscape');
    setIsLocked(success);
  };

  const handleUnlock = () => {
    unlock();
    setIsLocked(false);
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Current orientation indicator */}
      <div className="flex items-center gap-2">
        {isPortrait ? (
          <Smartphone className="w-4 h-4" />
        ) : (
          <Monitor className="w-4 h-4" />
        )}
        <span className="text-sm text-muted-foreground">
          {isPortrait ? 'Hochformat' : 'Querformat'}
        </span>
      </div>

      {/* Lock controls */}
      {showControls && lockSupported && (
        <div className="flex items-center gap-2">
          {isLocked ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleUnlock}
              className="gap-1"
            >
              <Unlock className="w-3 h-3" />
              Entsperren
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLockPortrait}
                className={cn(
                  'gap-1',
                  isPortrait && 'bg-primary/10'
                )}
              >
                <Smartphone className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLockLandscape}
                className={cn(
                  'gap-1',
                  isLandscape && 'bg-primary/10'
                )}
              >
                <Monitor className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
