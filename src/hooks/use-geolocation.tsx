import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationResult extends GeolocationState {
  requestLocation: () => void;
  nearestCanton: string | null;
}

// Approximate coordinates for Swiss canton capitals
const cantonCoordinates: Record<string, { lat: number; lng: number; name: string }> = {
  ZH: { lat: 47.3769, lng: 8.5417, name: "Zürich" },
  BE: { lat: 46.9480, lng: 7.4474, name: "Bern" },
  LU: { lat: 47.0502, lng: 8.3093, name: "Luzern" },
  UR: { lat: 46.8806, lng: 8.6280, name: "Uri" },
  SZ: { lat: 47.0212, lng: 8.6534, name: "Schwyz" },
  OW: { lat: 46.8979, lng: 8.2519, name: "Obwalden" },
  NW: { lat: 46.9575, lng: 8.3858, name: "Nidwalden" },
  GL: { lat: 47.0404, lng: 9.0681, name: "Glarus" },
  ZG: { lat: 47.1724, lng: 8.5153, name: "Zug" },
  FR: { lat: 46.8063, lng: 7.1619, name: "Fribourg" },
  SO: { lat: 47.2080, lng: 7.5385, name: "Solothurn" },
  BS: { lat: 47.5596, lng: 7.5886, name: "Basel-Stadt" },
  BL: { lat: 47.4833, lng: 7.7333, name: "Basel-Landschaft" },
  SH: { lat: 47.6970, lng: 8.6340, name: "Schaffhausen" },
  AR: { lat: 47.3660, lng: 9.3004, name: "Appenzell Ausserrhoden" },
  AI: { lat: 47.3319, lng: 9.4165, name: "Appenzell Innerrhoden" },
  SG: { lat: 47.4245, lng: 9.3767, name: "St. Gallen" },
  GR: { lat: 46.8493, lng: 9.5333, name: "Graubünden" },
  AG: { lat: 47.3914, lng: 8.0461, name: "Aargau" },
  TG: { lat: 47.5538, lng: 8.8987, name: "Thurgau" },
  TI: { lat: 46.0037, lng: 8.9511, name: "Ticino" },
  VD: { lat: 46.5197, lng: 6.6323, name: "Vaud" },
  VS: { lat: 46.2283, lng: 7.3595, name: "Valais" },
  NE: { lat: 46.9895, lng: 6.9297, name: "Neuchâtel" },
  GE: { lat: 46.2044, lng: 6.1432, name: "Genève" },
  JU: { lat: 47.3667, lng: 7.3333, name: "Jura" }
};

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest canton to given coordinates
function findNearestCanton(lat: number, lng: number): string | null {
  let nearestCanton: string | null = null;
  let minDistance = Infinity;

  Object.entries(cantonCoordinates).forEach(([code, coords]) => {
    const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCanton = code;
    }
  });

  return nearestCanton;
}

export const useGeolocation = (): GeolocationResult => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false
  });

  const [nearestCanton, setNearestCanton] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation wird von Ihrem Browser nicht unterstützt"
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setState({
          latitude,
          longitude,
          error: null,
          loading: false
        });

        // Find nearest canton
        const canton = findNearestCanton(latitude, longitude);
        setNearestCanton(canton);
      },
      (error) => {
        let errorMessage = "Standort konnte nicht ermittelt werden";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Standortzugriff wurde verweigert";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Standortinformationen nicht verfügbar";
            break;
          case error.TIMEOUT:
            errorMessage = "Standortabfrage hat zu lange gedauert";
            break;
        }

        setState({
          latitude: null,
          longitude: null,
          error: errorMessage,
          loading: false
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  return {
    ...state,
    nearestCanton,
    requestLocation
  };
};
