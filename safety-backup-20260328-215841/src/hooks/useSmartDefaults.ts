/**
 * Smart Default Values Hook
 * Pre-fills form fields based on context, location, and user behavior
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

interface SmartDefaultsConfig {
  enableGeolocation?: boolean;
  enableTimeBasedSuggestions?: boolean;
  enableDeviceDetection?: boolean;
}

interface LocationData {
  city?: string;
  postalCode?: string;
  canton?: string;
  latitude?: number;
  longitude?: number;
}

interface SmartDefaults {
  fromLocation: LocationData;
  suggestedMoveDate: Date;
  suggestedTimeSlot: 'morning' | 'afternoon' | 'flexible';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  isWeekend: boolean;
  isEndOfMonth: boolean;
  suggestedRooms: number;
  suggestedServices: string[];
}

// Swiss postal code to city mapping (subset for common areas)
const plzToCityMap: Record<string, { city: string; canton: string }> = {
  '8000': { city: 'Zürich', canton: 'ZH' },
  '8001': { city: 'Zürich', canton: 'ZH' },
  '8002': { city: 'Zürich', canton: 'ZH' },
  '8003': { city: 'Zürich', canton: 'ZH' },
  '8004': { city: 'Zürich', canton: 'ZH' },
  '8005': { city: 'Zürich', canton: 'ZH' },
  '8006': { city: 'Zürich', canton: 'ZH' },
  '8037': { city: 'Zürich', canton: 'ZH' },
  '8038': { city: 'Zürich', canton: 'ZH' },
  '8044': { city: 'Zürich', canton: 'ZH' },
  '8045': { city: 'Zürich', canton: 'ZH' },
  '8046': { city: 'Zürich', canton: 'ZH' },
  '8047': { city: 'Zürich', canton: 'ZH' },
  '8048': { city: 'Zürich', canton: 'ZH' },
  '8049': { city: 'Zürich', canton: 'ZH' },
  '8050': { city: 'Zürich', canton: 'ZH' },
  '8051': { city: 'Zürich', canton: 'ZH' },
  '8052': { city: 'Zürich', canton: 'ZH' },
  '8053': { city: 'Zürich', canton: 'ZH' },
  '8055': { city: 'Zürich', canton: 'ZH' },
  '8057': { city: 'Zürich', canton: 'ZH' },
  '3000': { city: 'Bern', canton: 'BE' },
  '3001': { city: 'Bern', canton: 'BE' },
  '3004': { city: 'Bern', canton: 'BE' },
  '3005': { city: 'Bern', canton: 'BE' },
  '3006': { city: 'Bern', canton: 'BE' },
  '3007': { city: 'Bern', canton: 'BE' },
  '3008': { city: 'Bern', canton: 'BE' },
  '3010': { city: 'Bern', canton: 'BE' },
  '3011': { city: 'Bern', canton: 'BE' },
  '3012': { city: 'Bern', canton: 'BE' },
  '3013': { city: 'Bern', canton: 'BE' },
  '3014': { city: 'Bern', canton: 'BE' },
  '3018': { city: 'Bern', canton: 'BE' },
  '4000': { city: 'Basel', canton: 'BS' },
  '4001': { city: 'Basel', canton: 'BS' },
  '4051': { city: 'Basel', canton: 'BS' },
  '4052': { city: 'Basel', canton: 'BS' },
  '4053': { city: 'Basel', canton: 'BS' },
  '4054': { city: 'Basel', canton: 'BS' },
  '4055': { city: 'Basel', canton: 'BS' },
  '4056': { city: 'Basel', canton: 'BS' },
  '4057': { city: 'Basel', canton: 'BS' },
  '4058': { city: 'Basel', canton: 'BS' },
  '1200': { city: 'Genève', canton: 'GE' },
  '1201': { city: 'Genève', canton: 'GE' },
  '1202': { city: 'Genève', canton: 'GE' },
  '1203': { city: 'Genève', canton: 'GE' },
  '1204': { city: 'Genève', canton: 'GE' },
  '1205': { city: 'Genève', canton: 'GE' },
  '1206': { city: 'Genève', canton: 'GE' },
  '1000': { city: 'Lausanne', canton: 'VD' },
  '1003': { city: 'Lausanne', canton: 'VD' },
  '1004': { city: 'Lausanne', canton: 'VD' },
  '1005': { city: 'Lausanne', canton: 'VD' },
  '1006': { city: 'Lausanne', canton: 'VD' },
  '1007': { city: 'Lausanne', canton: 'VD' },
  '6000': { city: 'Luzern', canton: 'LU' },
  '6003': { city: 'Luzern', canton: 'LU' },
  '6004': { city: 'Luzern', canton: 'LU' },
  '6005': { city: 'Luzern', canton: 'LU' },
  '6006': { city: 'Luzern', canton: 'LU' },
  '9000': { city: 'St. Gallen', canton: 'SG' },
  '9008': { city: 'St. Gallen', canton: 'SG' },
  '9010': { city: 'St. Gallen', canton: 'SG' },
  '9011': { city: 'St. Gallen', canton: 'SG' },
  '9012': { city: 'St. Gallen', canton: 'SG' },
  '8400': { city: 'Winterthur', canton: 'ZH' },
  '8401': { city: 'Winterthur', canton: 'ZH' },
  '8404': { city: 'Winterthur', canton: 'ZH' },
  '8405': { city: 'Winterthur', canton: 'ZH' },
  '8406': { city: 'Winterthur', canton: 'ZH' },
  '5000': { city: 'Aarau', canton: 'AG' },
  '5001': { city: 'Aarau', canton: 'AG' },
  '5004': { city: 'Aarau', canton: 'AG' },
  '5400': { city: 'Baden', canton: 'AG' },
  '5401': { city: 'Baden', canton: 'AG' },
};

export function useSmartDefaults(config: SmartDefaultsConfig = {}): SmartDefaults & {
  isLoading: boolean;
  refreshDefaults: () => void;
  getCityFromPLZ: (plz: string) => { city: string; canton: string } | null;
} {
  const { 
    enableGeolocation = true, 
    enableTimeBasedSuggestions = true,
    enableDeviceDetection = true 
  } = config;

  const [isLoading, setIsLoading] = useState(true);
  const [locationData, setLocationData] = useState<LocationData>({});

  // Device detection
  const deviceType = useMemo(() => {
    if (!enableDeviceDetection || typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }, [enableDeviceDetection]);

  // Time-based suggestions
  const timeBasedData = useMemo(() => {
    if (!enableTimeBasedSuggestions) {
      return {
        suggestedTimeSlot: 'flexible' as const,
        isWeekend: false,
        isEndOfMonth: false,
        suggestedMoveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };
    }

    const now = new Date();
    const dayOfWeek = now.getDay();
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    const hour = now.getHours();
    let suggestedTimeSlot: 'morning' | 'afternoon' | 'flexible' = 'flexible';
    if (hour < 12) suggestedTimeSlot = 'morning';
    else if (hour < 18) suggestedTimeSlot = 'afternoon';

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isEndOfMonth = dayOfMonth > daysInMonth - 5;

    // Suggest move date: next month end if we're past the 15th, otherwise end of current month
    let suggestedMoveDate: Date;
    if (dayOfMonth > 15) {
      // Next month end
      suggestedMoveDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    } else {
      // This month end
      suggestedMoveDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // If suggested date is too soon (< 2 weeks), push to next month
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    if (suggestedMoveDate < twoWeeksFromNow) {
      suggestedMoveDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    }

    return {
      suggestedTimeSlot,
      isWeekend,
      isEndOfMonth,
      suggestedMoveDate
    };
  }, [enableTimeBasedSuggestions]);

  // Geolocation
  useEffect(() => {
    if (!enableGeolocation || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    // First try to get from localStorage cache
    const cached = localStorage.getItem('umzugscheck_user_location');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const cacheAge = Date.now() - parsed.timestamp;
        // Use cache if less than 1 hour old
        if (cacheAge < 60 * 60 * 1000) {
          setLocationData(parsed.data);
          setIsLoading(false);
          return;
        }
      } catch {
        // Ignore cache errors
      }
    }

    // Try geolocation API
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // In production, would call reverse geocoding API
          // For now, use approximation based on coordinates
          const approximateLocation = getApproximateSwissLocation(latitude, longitude);
          
          const newLocationData: LocationData = {
            latitude,
            longitude,
            ...approximateLocation
          };
          
          setLocationData(newLocationData);
          
          // Cache the result
          localStorage.setItem('umzugscheck_user_location', JSON.stringify({
            data: newLocationData,
            timestamp: Date.now()
          }));
          
          setIsLoading(false);
        },
        () => {
          // Geolocation denied or failed - use default
          setIsLoading(false);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    } else {
      setIsLoading(false);
    }
  }, [enableGeolocation]);

  // Suggested rooms based on device/time
  const suggestedRooms = useMemo(() => {
    // During evening/weekend, suggest slightly larger apartments (families browsing)
    if (timeBasedData.isWeekend || new Date().getHours() >= 18) {
      return 3.5;
    }
    // During work hours, suggest smaller (professionals/singles)
    return 2.5;
  }, [timeBasedData.isWeekend]);

  // Suggested services based on context
  const suggestedServices = useMemo(() => {
    const services: string[] = [];
    
    // Always suggest basic moving
    services.push('transport');
    
    // If end of month, suggest cleaning (typical Zügeltermine)
    if (timeBasedData.isEndOfMonth) {
      services.push('cleaning');
    }
    
    // If larger apartment, suggest packing
    if (suggestedRooms >= 4) {
      services.push('packing');
    }
    
    return services;
  }, [timeBasedData.isEndOfMonth, suggestedRooms]);

  const refreshDefaults = useCallback(() => {
    localStorage.removeItem('umzugscheck_user_location');
    setIsLoading(true);
    // Re-trigger useEffect
    setLocationData({});
  }, []);

  const getCityFromPLZ = useCallback((plz: string): { city: string; canton: string } | null => {
    return plzToCityMap[plz] || null;
  }, []);

  return {
    fromLocation: locationData,
    suggestedMoveDate: timeBasedData.suggestedMoveDate,
    suggestedTimeSlot: timeBasedData.suggestedTimeSlot,
    deviceType,
    isWeekend: timeBasedData.isWeekend,
    isEndOfMonth: timeBasedData.isEndOfMonth,
    suggestedRooms,
    suggestedServices,
    isLoading,
    refreshDefaults,
    getCityFromPLZ
  };
}

// Approximate Swiss location based on coordinates
function getApproximateSwissLocation(lat: number, lng: number): Partial<LocationData> {
  // Rough bounds for major Swiss cities
  const cities = [
    { city: 'Zürich', canton: 'ZH', postalCode: '8000', lat: 47.3769, lng: 8.5417, radius: 0.1 },
    { city: 'Bern', canton: 'BE', postalCode: '3000', lat: 46.9480, lng: 7.4474, radius: 0.1 },
    { city: 'Basel', canton: 'BS', postalCode: '4000', lat: 47.5596, lng: 7.5886, radius: 0.08 },
    { city: 'Genève', canton: 'GE', postalCode: '1200', lat: 46.2044, lng: 6.1432, radius: 0.08 },
    { city: 'Lausanne', canton: 'VD', postalCode: '1000', lat: 46.5197, lng: 6.6323, radius: 0.08 },
    { city: 'Luzern', canton: 'LU', postalCode: '6000', lat: 47.0502, lng: 8.3093, radius: 0.06 },
    { city: 'St. Gallen', canton: 'SG', postalCode: '9000', lat: 47.4245, lng: 9.3767, radius: 0.06 },
    { city: 'Winterthur', canton: 'ZH', postalCode: '8400', lat: 47.5001, lng: 8.7240, radius: 0.05 },
  ];

  for (const cityData of cities) {
    const distance = Math.sqrt(
      Math.pow(lat - cityData.lat, 2) + Math.pow(lng - cityData.lng, 2)
    );
    if (distance <= cityData.radius) {
      return {
        city: cityData.city,
        canton: cityData.canton,
        postalCode: cityData.postalCode
      };
    }
  }

  // Check if in Switzerland bounds
  if (lat >= 45.8 && lat <= 47.8 && lng >= 5.9 && lng <= 10.5) {
    return { canton: 'CH' };
  }

  return {};
}

export default useSmartDefaults;
