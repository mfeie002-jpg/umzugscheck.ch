/**
 * React hook for SBB Journey API
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface JourneyLeg {
  mode: string;
  lineName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
}

export interface JourneyResult {
  durationMinutes: number;
  transfers: number;
  departureTime: string;
  arrivalTime: string;
  connectionsPerHour: number;
  transportModes: string[];
  estimatedMonthlyPassCHF: number;
  journeyLegs: JourneyLeg[];
}

export interface JourneyResponse {
  success: boolean;
  mock?: boolean;
  message?: string;
  originCity?: string;
  destinationCity?: string;
  queryDate?: string;
  queryTime?: string;
  fastestJourney?: JourneyResult;
  alternatives?: JourneyResult[];
  summary?: {
    averageDurationMinutes: number;
    minDurationMinutes: number;
    estimatedMonthlyPassCHF: number;
    connectionsPerHour: number;
  };
  journeys?: JourneyResult[]; // For mock data
  error?: string;
}

export interface UseSBBJourneyOptions {
  date?: string;
  departureTime?: string;
}

export function useSBBJourney() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [journey, setJourney] = useState<JourneyResponse | null>(null);

  const fetchJourney = useCallback(async (
    originCity: string,
    destinationCity: string,
    options?: UseSBBJourneyOptions
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('sbb-journey', {
        body: {
          originCity,
          destinationCity,
          date: options?.date,
          departureTime: options?.departureTime,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setJourney(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch journey';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearJourney = useCallback(() => {
    setJourney(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    journey,
    fetchJourney,
    clearJourney,
  };
}

/**
 * Get commute duration between two Swiss cities
 * Falls back to estimated data if API is unavailable
 */
export const ESTIMATED_COMMUTE_TIMES: Record<string, Record<string, number>> = {
  'zuerich': {
    'bern': 56,
    'basel': 53,
    'genf': 167,
    'lausanne': 134,
    'luzern': 45,
    'winterthur': 22,
    'st-gallen': 63,
    'lugano': 129,
    'chur': 75,
    'zug': 25,
    'aarau': 28,
    'baden': 16,
    'olten': 33,
    'schaffhausen': 40,
  },
  'bern': {
    'zuerich': 56,
    'basel': 55,
    'genf': 107,
    'lausanne': 66,
    'luzern': 60,
    'thun': 20,
    'biel': 24,
    'fribourg': 22,
    'neuchatel': 38,
    'solothurn': 32,
    'olten': 35,
  },
  'basel': {
    'zuerich': 53,
    'bern': 55,
    'luzern': 62,
    'aarau': 35,
    'olten': 24,
    'solothurn': 45,
    'baden': 42,
  },
  'genf': {
    'lausanne': 40,
    'bern': 107,
    'zuerich': 167,
    'sion': 95,
    'neuchatel': 70,
  },
  'lausanne': {
    'genf': 40,
    'bern': 66,
    'zuerich': 134,
    'fribourg': 50,
    'neuchatel': 45,
    'sion': 55,
  },
};

export function getEstimatedCommuteTime(from: string, to: string): number | null {
  const normalizedFrom = from.toLowerCase().replace(/ü/g, 'u').replace(/\s+/g, '-');
  const normalizedTo = to.toLowerCase().replace(/ü/g, 'u').replace(/\s+/g, '-');
  
  if (normalizedFrom === normalizedTo) return 0;
  
  const fromData = ESTIMATED_COMMUTE_TIMES[normalizedFrom];
  if (fromData && fromData[normalizedTo]) {
    return fromData[normalizedTo];
  }
  
  // Try reverse lookup
  const toData = ESTIMATED_COMMUTE_TIMES[normalizedTo];
  if (toData && toData[normalizedFrom]) {
    return toData[normalizedFrom];
  }
  
  return null;
}

/**
 * Get estimated monthly pass cost based on route distance
 */
export function getEstimatedMonthlyPass(commuteMinutes: number): number {
  if (commuteMinutes <= 15) return 90;
  if (commuteMinutes <= 30) return 140;
  if (commuteMinutes <= 45) return 200;
  if (commuteMinutes <= 60) return 280;
  if (commuteMinutes <= 90) return 380;
  return 440;
}
