import { useState, useEffect } from 'react';

type Orientation = 'portrait' | 'landscape';

export const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    if (typeof window === 'undefined') return 'portrait';
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      if (screen.orientation) {
        setOrientation(
          screen.orientation.type.includes('portrait') ? 'portrait' : 'landscape'
        );
      } else {
        setOrientation(
          window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        );
      }
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return { orientation, isPortrait: orientation === 'portrait', isLandscape: orientation === 'landscape' };
};
