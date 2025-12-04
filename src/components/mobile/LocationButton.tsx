import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useHaptic } from '@/hooks/use-haptic';

interface LocationButtonProps {
  onLocation: (lat: number, lng: number) => void;
  className?: string;
}

export const LocationButton = ({ onLocation, className = '' }: LocationButtonProps) => {
  const { latitude, longitude, isLoading, error, getCurrentPosition } = useGeolocation();
  const { trigger } = useHaptic();
  const [hasRequested, setHasRequested] = useState(false);

  const handleClick = () => {
    trigger('light');
    setHasRequested(true);
    getCurrentPosition();
  };

  // Notify parent when location is available
  if (hasRequested && latitude && longitude) {
    onLocation(latitude, longitude);
    setHasRequested(false);
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <motion.div
            animate={hasRequested ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <MapPin className="w-4 h-4" />
          </motion.div>
        )}
        <span className="hidden sm:inline">Standort verwenden</span>
        <span className="sm:hidden">Standort</span>
      </Button>
      
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};
