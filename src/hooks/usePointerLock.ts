import { useState, useEffect, useCallback, useRef } from 'react';

interface PointerMovement {
  movementX: number;
  movementY: number;
  totalX: number;
  totalY: number;
}

interface UsePointerLockOptions {
  onLock?: () => void;
  onUnlock?: () => void;
  onMove?: (movement: PointerMovement) => void;
  onError?: (error: string) => void;
}

interface UsePointerLockReturn {
  isLocked: boolean;
  isSupported: boolean;
  movement: PointerMovement;
  requestLock: (element?: HTMLElement) => Promise<void>;
  exitLock: () => void;
  elementRef: React.RefObject<HTMLElement>;
}

export function usePointerLock(options: UsePointerLockOptions = {}): UsePointerLockReturn {
  const { onLock, onUnlock, onMove, onError } = options;

  const [isLocked, setIsLocked] = useState(false);
  const [movement, setMovement] = useState<PointerMovement>({
    movementX: 0,
    movementY: 0,
    totalX: 0,
    totalY: 0
  });
  const elementRef = useRef<HTMLElement>(null);
  const totalMovement = useRef({ x: 0, y: 0 });

  const isSupported = typeof document !== 'undefined' && 'pointerLockElement' in document;

  const requestLock = useCallback(async (element?: HTMLElement) => {
    const targetElement = element || elementRef.current;
    if (!targetElement || !isSupported) {
      onError?.('Pointer lock not supported or no element provided');
      return;
    }

    try {
      await targetElement.requestPointerLock();
    } catch (err: any) {
      onError?.(err.message || 'Failed to request pointer lock');
    }
  }, [isSupported, onError]);

  const exitLock = useCallback(() => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const handleLockChange = () => {
      const locked = document.pointerLockElement !== null;
      setIsLocked(locked);
      
      if (locked) {
        totalMovement.current = { x: 0, y: 0 };
        onLock?.();
      } else {
        onUnlock?.();
      }
    };

    const handleLockError = () => {
      onError?.('Pointer lock error');
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!document.pointerLockElement) return;

      totalMovement.current.x += event.movementX;
      totalMovement.current.y += event.movementY;

      const newMovement: PointerMovement = {
        movementX: event.movementX,
        movementY: event.movementY,
        totalX: totalMovement.current.x,
        totalY: totalMovement.current.y
      };

      setMovement(newMovement);
      onMove?.(newMovement);
    };

    document.addEventListener('pointerlockchange', handleLockChange);
    document.addEventListener('pointerlockerror', handleLockError);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('pointerlockchange', handleLockChange);
      document.removeEventListener('pointerlockerror', handleLockError);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isSupported, onLock, onUnlock, onMove, onError]);

  return {
    isLocked,
    isSupported,
    movement,
    requestLock,
    exitLock,
    elementRef
  };
}
