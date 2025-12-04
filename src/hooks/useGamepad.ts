import { useState, useEffect, useCallback, useRef } from 'react';

interface GamepadState {
  id: string;
  index: number;
  connected: boolean;
  buttons: { pressed: boolean; value: number }[];
  axes: number[];
  timestamp: number;
}

interface UseGamepadOptions {
  pollInterval?: number;
  deadzone?: number;
  onConnect?: (gamepad: GamepadState) => void;
  onDisconnect?: (gamepad: GamepadState) => void;
  onButtonPress?: (gamepadIndex: number, buttonIndex: number) => void;
  onButtonRelease?: (gamepadIndex: number, buttonIndex: number) => void;
}

interface UseGamepadReturn {
  gamepads: GamepadState[];
  isSupported: boolean;
  getGamepad: (index: number) => GamepadState | null;
}

export function useGamepad(options: UseGamepadOptions = {}): UseGamepadReturn {
  const {
    pollInterval = 16, // ~60fps
    deadzone = 0.1,
    onConnect,
    onDisconnect,
    onButtonPress,
    onButtonRelease
  } = options;

  const [gamepads, setGamepads] = useState<GamepadState[]>([]);
  const previousButtonStates = useRef<Map<number, boolean[]>>(new Map());
  const animationFrameRef = useRef<number>();

  const isSupported = typeof navigator !== 'undefined' && 'getGamepads' in navigator;

  const mapGamepad = useCallback((gamepad: Gamepad): GamepadState => ({
    id: gamepad.id,
    index: gamepad.index,
    connected: gamepad.connected,
    buttons: gamepad.buttons.map(b => ({ pressed: b.pressed, value: b.value })),
    axes: gamepad.axes.map(a => Math.abs(a) < deadzone ? 0 : a),
    timestamp: gamepad.timestamp
  }), [deadzone]);

  const pollGamepads = useCallback(() => {
    if (!isSupported) return;

    const rawGamepads = navigator.getGamepads();
    const activeGamepads: GamepadState[] = [];

    for (const gamepad of rawGamepads) {
      if (gamepad) {
        const state = mapGamepad(gamepad);
        activeGamepads.push(state);

        // Check for button changes
        const prevButtons = previousButtonStates.current.get(gamepad.index) || [];
        state.buttons.forEach((button, index) => {
          const wasPressed = prevButtons[index] || false;
          if (button.pressed && !wasPressed) {
            onButtonPress?.(gamepad.index, index);
          } else if (!button.pressed && wasPressed) {
            onButtonRelease?.(gamepad.index, index);
          }
        });
        previousButtonStates.current.set(gamepad.index, state.buttons.map(b => b.pressed));
      }
    }

    setGamepads(activeGamepads);
  }, [isSupported, mapGamepad, onButtonPress, onButtonRelease]);

  useEffect(() => {
    if (!isSupported) return;

    const handleConnect = (event: GamepadEvent) => {
      const state = mapGamepad(event.gamepad);
      onConnect?.(state);
    };

    const handleDisconnect = (event: GamepadEvent) => {
      const state = mapGamepad(event.gamepad);
      previousButtonStates.current.delete(event.gamepad.index);
      onDisconnect?.(state);
    };

    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);

    // Polling loop
    let lastPoll = 0;
    const poll = (timestamp: number) => {
      if (timestamp - lastPoll >= pollInterval) {
        pollGamepads();
        lastPoll = timestamp;
      }
      animationFrameRef.current = requestAnimationFrame(poll);
    };
    animationFrameRef.current = requestAnimationFrame(poll);

    return () => {
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSupported, pollInterval, pollGamepads, mapGamepad, onConnect, onDisconnect]);

  const getGamepad = useCallback((index: number): GamepadState | null => {
    return gamepads.find(g => g.index === index) || null;
  }, [gamepads]);

  return {
    gamepads,
    isSupported,
    getGamepad
  };
}
