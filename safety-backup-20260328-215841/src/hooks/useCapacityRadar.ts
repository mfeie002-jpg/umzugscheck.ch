import { useState, useEffect, useMemo } from 'react';
import {
  ProviderCapacity,
  CapacityAlert,
  calculateUrgencyLevel,
  generateCapacityAlert,
  generateWeeklyAvailability,
  calculateCapacityScore,
} from '@/lib/capacity-radar';

interface UseCapacityRadarOptions {
  providerId: string;
  moveDate?: Date;
  refreshInterval?: number; // in milliseconds
}

interface UseCapacityRadarResult {
  capacity: ProviderCapacity | null;
  alert: CapacityAlert | null;
  capacityScore: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to manage provider capacity data and urgency signals
 */
export function useCapacityRadar({
  providerId,
  moveDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default: 2 weeks out
  refreshInterval = 60000, // Default: 1 minute
}: UseCapacityRadarOptions): UseCapacityRadarResult {
  const [capacity, setCapacity] = useState<ProviderCapacity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCapacity = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual Supabase query when capacity table is created
      // For now, simulate capacity data based on provider ID
      await new Promise(resolve => setTimeout(resolve, 300));

      const mockCapacity = generateMockCapacity(providerId, moveDate);
      setCapacity(mockCapacity);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch capacity');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCapacity();

    // Set up refresh interval
    if (refreshInterval > 0) {
      const interval = setInterval(fetchCapacity, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [providerId, moveDate.toISOString()]);

  const alert = useMemo(() => {
    if (!capacity) return null;
    return generateCapacityAlert(capacity, moveDate);
  }, [capacity, moveDate]);

  const capacityScore = useMemo(() => {
    if (!capacity) return 0;
    return calculateCapacityScore(capacity, moveDate);
  }, [capacity, moveDate]);

  return {
    capacity,
    alert,
    capacityScore,
    isLoading,
    error,
    refresh: fetchCapacity,
  };
}

/**
 * Generate mock capacity data for demo purposes
 * This will be replaced with actual DB queries
 */
function generateMockCapacity(providerId: string, moveDate: Date): ProviderCapacity {
  // Use provider ID hash to generate consistent but varied data
  const hash = providerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const maxCapacity = 3 + (hash % 3); // 3-5 jobs per day
  const currentJobs = Math.floor(Math.random() * maxCapacity);
  const availableSlots = maxCapacity - currentJobs;
  
  const daysUntilMove = Math.ceil(
    (moveDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  
  const weeklyAvailability = generateWeeklyAvailability(
    new Date(),
    maxCapacity,
    0.4 + (hash % 40) / 100 // 40-80% booked
  );
  
  const nextAvailableSlot = weeklyAvailability.find(s => !s.isFullyBooked);
  const nextAvailableDate = nextAvailableSlot?.date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  return {
    providerId,
    currentJobs,
    maxCapacity,
    availableSlots,
    nextAvailableDate,
    weeklyAvailability,
    urgencyLevel: calculateUrgencyLevel(availableSlots, maxCapacity, daysUntilMove),
    lastUpdated: new Date(),
  };
}

export default useCapacityRadar;
