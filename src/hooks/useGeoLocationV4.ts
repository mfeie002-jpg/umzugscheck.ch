/**
 * useGeoLocation - IP-based location detection for personalization
 * Addresses gap: "Keine personalisierte Begrüssung basierend auf Location"
 */
import { useState, useEffect } from 'react';

interface GeoLocation {
  city: string;
  region: string;
  country: string;
  isLoading: boolean;
}

const SWISS_CITIES = ['Zürich', 'Bern', 'Basel', 'Genf', 'Lausanne', 'Luzern', 'St. Gallen', 'Winterthur'];

export function useGeoLocation(): GeoLocation {
  const [location, setLocation] = useState<GeoLocation>({
    city: '',
    region: '',
    country: '',
    isLoading: true,
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Use free IP geolocation API
        const response = await fetch('https://ipapi.co/json/', {
          signal: AbortSignal.timeout(3000), // 3s timeout
        });
        const data = await response.json();
        
        // Map to Swiss city names if applicable
        let city = data.city || '';
        if (city === 'Zurich') city = 'Zürich';
        if (city === 'Geneva') city = 'Genf';
        if (city === 'Lucerne') city = 'Luzern';
        
        setLocation({
          city: SWISS_CITIES.includes(city) ? city : '',
          region: data.region || '',
          country: data.country_name || '',
          isLoading: false,
        });
      } catch {
        // Fallback: no personalization
        setLocation(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchLocation();
  }, []);

  return location;
}
