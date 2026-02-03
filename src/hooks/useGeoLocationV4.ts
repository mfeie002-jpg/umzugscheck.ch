/**
 * useGeoLocation - IP-based location detection for personalization
 * 
 * Features:
 * - Server-side geo lookup via edge function (no CORS issues)
 * - Guards to skip in iframes or internal routes (A/B Comparison Lab)
 * - LocalStorage caching with 1-hour TTL
 * - Request deduplication via singleton promise
 */
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface GeoLocation {
  city: string;
  region: string;
  country: string;
  isLoading: boolean;
}

const CACHE_KEY = 'geo_location_v4';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const SWISS_CITIES = ['Zürich', 'Bern', 'Basel', 'Genf', 'Lausanne', 'Luzern', 'St. Gallen', 'Winterthur'];

// Singleton promise to dedupe concurrent requests
let fetchPromise: Promise<GeoLocation> | null = null;

/**
 * Check if geo lookup should be skipped
 * - Inside iframe (A/B Comparison Lab loads multiple iframes)
 * - On internal routes
 */
function shouldSkipGeoLookup(): boolean {
  if (typeof window === 'undefined') return true;
  
  // Skip if inside iframe (prevents multi-frame spam in A/B Comparison Lab)
  try {
    if (window.self !== window.top) {
      return true;
    }
  } catch {
    // Cross-origin iframe - definitely skip
    return true;
  }
  
  // Skip on internal routes
  if (window.location.pathname.startsWith('/internal')) {
    return true;
  }
  
  return false;
}

/**
 * Get cached location from localStorage
 */
function getCachedLocation(): GeoLocation | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, expires } = JSON.parse(cached);
      if (Date.now() < expires) {
        return data;
      }
      localStorage.removeItem(CACHE_KEY);
    }
  } catch {
    // localStorage not available or corrupted
  }
  return null;
}

/**
 * Save location to localStorage cache
 */
function setCachedLocation(data: GeoLocation): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      expires: Date.now() + CACHE_TTL_MS,
    }));
  } catch {
    // localStorage not available
  }
}

/**
 * Fetch geo location from edge function
 */
async function fetchGeoLocation(): Promise<GeoLocation> {
  try {
    const { data, error } = await supabase.functions.invoke('geo');
    
    if (error) throw error;
    
    // Map English city names to German
    let city = data?.city || '';
    if (city === 'Zurich') city = 'Zürich';
    if (city === 'Geneva') city = 'Genf';
    if (city === 'Lucerne') city = 'Luzern';
    
    return {
      city: SWISS_CITIES.includes(city) ? city : '',
      region: data?.region || '',
      country: data?.country || '',
      isLoading: false,
    };
  } catch (error) {
    console.warn('Geo lookup failed (graceful degradation):', error);
    return { city: '', region: '', country: '', isLoading: false };
  }
}

/**
 * Hook to get user's geographic location
 * Used for personalized headlines (e.g., "Der beste Deal in Zürich")
 */
export function useGeoLocation(): GeoLocation {
  const [location, setLocation] = useState<GeoLocation>(() => {
    // Initialize from cache if available (prevents flash)
    if (typeof window !== 'undefined') {
      const cached = getCachedLocation();
      if (cached) return { ...cached, isLoading: false };
    }
    return { city: '', region: '', country: '', isLoading: true };
  });

  useEffect(() => {
    // Guard: Skip in iframes or internal routes
    if (shouldSkipGeoLookup()) {
      setLocation(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Check cache first
    const cached = getCachedLocation();
    if (cached) {
      setLocation({ ...cached, isLoading: false });
      return;
    }

    // Dedupe concurrent requests (multiple components using this hook)
    if (!fetchPromise) {
      fetchPromise = fetchGeoLocation();
    }

    fetchPromise
      .then(data => {
        setLocation(data);
        setCachedLocation(data);
      })
      .finally(() => {
        fetchPromise = null;
      });
  }, []);

  return location;
}
