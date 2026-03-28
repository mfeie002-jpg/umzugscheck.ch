import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NeighborhoodProfile {
  id: string;
  city_name: string;
  postal_code: string | null;
  canton_code: string;
  
  // Lifestyle scores
  family_score: number | null;
  expat_score: number | null;
  commuter_score: number | null;
  quiet_score: number | null;
  nightlife_score: number | null;
  nature_score: number | null;
  
  // Financial
  tax_rate_single: number | null;
  tax_rate_family: number | null;
  avg_rent_3room: number | null;
  avg_rent_4room: number | null;
  property_price_sqm: number | null;
  
  // Demographics
  population: number | null;
  population_growth_percent: number | null;
  foreigner_percent: number | null;
  avg_age: number | null;
  
  // Infrastructure
  train_station_distance_km: number | null;
  highway_distance_km: number | null;
  zurich_commute_minutes: number | null;
  
  // Meta
  description: string | null;
  highlights: string[] | null;
}

export interface POI {
  id: string;
  neighborhood_id: string | null;
  city_name: string;
  canton_code: string;
  poi_type: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  review_count: number | null;
  phone: string | null;
  website: string | null;
  distance_from_center_km: number | null;
}

// Fetch all neighborhoods for a canton
export function useNeighborhoodsByCanton(cantonCode: string) {
  return useQuery({
    queryKey: ["neighborhoods", cantonCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("neighborhood_profiles")
        .select("*")
        .eq("canton_code", cantonCode)
        .order("population", { ascending: false, nullsFirst: false });

      if (error) {
        console.error("Error fetching neighborhoods:", error);
        throw error;
      }

      return data as NeighborhoodProfile[];
    },
    enabled: !!cantonCode,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Fetch single neighborhood by city name
export function useNeighborhoodByCity(cityName: string, cantonCode: string) {
  return useQuery({
    queryKey: ["neighborhood", cityName, cantonCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("neighborhood_profiles")
        .select("*")
        .eq("city_name", cityName)
        .eq("canton_code", cantonCode)
        .single();

      if (error) {
        console.error("Error fetching neighborhood:", error);
        throw error;
      }

      return data as NeighborhoodProfile;
    },
    enabled: !!cityName && !!cantonCode,
  });
}

// Fetch POIs for a city
export function usePOIsByCity(cityName: string, poiType?: string) {
  return useQuery({
    queryKey: ["pois", cityName, poiType],
    queryFn: async () => {
      let query = supabase
        .from("pois")
        .select("*")
        .eq("city_name", cityName)
        .order("rating", { ascending: false, nullsFirst: false });

      if (poiType) {
        query = query.eq("poi_type", poiType);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching POIs:", error);
        throw error;
      }

      return data as POI[];
    },
    enabled: !!cityName,
  });
}

// Fetch POIs by type for a canton
export function usePOIsByCantonAndType(cantonCode: string, poiType: string) {
  return useQuery({
    queryKey: ["pois-canton", cantonCode, poiType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pois")
        .select("*")
        .eq("canton_code", cantonCode)
        .eq("poi_type", poiType)
        .order("rating", { ascending: false, nullsFirst: false })
        .limit(50);

      if (error) {
        console.error("Error fetching POIs:", error);
        throw error;
      }

      return data as POI[];
    },
    enabled: !!cantonCode && !!poiType,
  });
}

// Compare neighborhoods for relocation decision
export function useNeighborhoodComparison(cityNames: string[], cantonCode: string) {
  return useQuery({
    queryKey: ["neighborhood-comparison", cityNames, cantonCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("neighborhood_profiles")
        .select("*")
        .eq("canton_code", cantonCode)
        .in("city_name", cityNames);

      if (error) {
        console.error("Error fetching neighborhoods for comparison:", error);
        throw error;
      }

      return data as NeighborhoodProfile[];
    },
    enabled: cityNames.length > 0 && !!cantonCode,
  });
}

// Helper: Calculate Total Cost of Relocation (TCR)
export function calculateTCR(
  neighborhood: NeighborhoodProfile,
  income: number,
  isFamily: boolean
): number {
  const taxRate = isFamily 
    ? (neighborhood.tax_rate_family || 10) 
    : (neighborhood.tax_rate_single || 12);
  
  const annualTax = income * (taxRate / 100);
  const annualRent = (isFamily 
    ? (neighborhood.avg_rent_4room || 3000) 
    : (neighborhood.avg_rent_3room || 2500)) * 12;
  
  return annualTax + annualRent;
}

// Helper: Get lifestyle match score
export function getLifestyleMatch(
  neighborhood: NeighborhoodProfile,
  preferences: {
    family?: boolean;
    expat?: boolean;
    commuter?: boolean;
    quiet?: boolean;
    nature?: boolean;
  }
): number {
  let totalScore = 0;
  let count = 0;

  if (preferences.family && neighborhood.family_score) {
    totalScore += neighborhood.family_score;
    count++;
  }
  if (preferences.expat && neighborhood.expat_score) {
    totalScore += neighborhood.expat_score;
    count++;
  }
  if (preferences.commuter && neighborhood.commuter_score) {
    totalScore += neighborhood.commuter_score;
    count++;
  }
  if (preferences.quiet && neighborhood.quiet_score) {
    totalScore += neighborhood.quiet_score;
    count++;
  }
  if (preferences.nature && neighborhood.nature_score) {
    totalScore += neighborhood.nature_score;
    count++;
  }

  return count > 0 ? Math.round(totalScore / count) : 50;
}
