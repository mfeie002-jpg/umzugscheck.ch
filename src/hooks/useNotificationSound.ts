import { useCallback, useRef } from 'react';

export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNotificationSound = useCallback((type: 'lead' | 'review' | 'message' | 'bid' = 'lead') => {
    // Create audio context for notification sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different sounds for different notification types
    const soundConfigs = {
      lead: { frequency: 880, duration: 0.15, type: 'sine' as OscillatorType },
      review: { frequency: 660, duration: 0.2, type: 'triangle' as OscillatorType },
      message: { frequency: 523, duration: 0.1, type: 'sine' as OscillatorType },
      bid: { frequency: 740, duration: 0.25, type: 'square' as OscillatorType },
    };

    const config = soundConfigs[type];
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + config.duration);

    // Play second tone for lead notifications (more urgent)
    if (type === 'lead') {
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046, audioContext.currentTime);
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.15);
      }, 200);
    }
  }, []);

  return { playNotificationSound };
};
