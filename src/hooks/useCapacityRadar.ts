import { useState, useEffect, useMemo } from 'react';
import {
  ProviderCapacity,
  CapacityAlert,
  calculateUrgencyLevel,
  generateCapacityAlert,
  generateWeeklyAvailability,
  calculateCapacityScore,
} from '@/lib/capacity-radar';
import { supabase } from '@/integrations/supabase/client';

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

      const dbCapacity = await fetchCapacityFromDatabase(providerId, moveDate);
      if (dbCapacity) {
        setCapacity(dbCapacity);
      } else {
        const mockCapacity = generateMockCapacity(providerId, moveDate);
        setCapacity(mockCapacity);
      }
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

async function fetchCapacityFromDatabase(providerId: string, moveDate: Date): Promise<ProviderCapacity | null> {
  const fromDate = new Date();
  const toDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('provider_capacity')
    .select('date,max_jobs,booked_jobs')
    .eq('provider_id', providerId)
    .gte('date', fromDate.toISOString().split('T')[0])
    .lte('date', toDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error || !data || data.length === 0) {
    return null;
  }

  const weeklyAvailability = data.map((slot) => ({
    date: new Date(slot.date),
    totalSlots: slot.max_jobs,
    bookedSlots: slot.booked_jobs,
    availableSlots: Math.max(0, slot.max_jobs - slot.booked_jobs),
    isFullyBooked: slot.booked_jobs >= slot.max_jobs,
  }));

  const capacityForMoveDate = weeklyAvailability.find(
    (slot) => slot.date.toISOString().split('T')[0] === moveDate.toISOString().split('T')[0],
  );

  const maxCapacity = capacityForMoveDate?.totalSlots ?? Math.max(...weeklyAvailability.map((slot) => slot.totalSlots));
  const currentJobs = capacityForMoveDate?.bookedSlots ?? 0;
  const availableSlots = Math.max(0, maxCapacity - currentJobs);
  const nextAvailableDate = weeklyAvailability.find((slot) => !slot.isFullyBooked)?.date ?? moveDate;

  const daysUntilMove = Math.ceil((moveDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

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
