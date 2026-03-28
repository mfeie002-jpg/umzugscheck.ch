import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PublicProvider {
  id: string;
  company_name: string;
  city: string | null;
  cantons_served: string[] | null;
  services_offered: string[] | null;
  price_level: "günstig" | "fair" | "premium" | null;
  quality_score: number | null;
  response_time_minutes: number | null;
  is_featured: boolean | null;
  sponsored_tier: number | null;
  verification_status: string | null;
  short_description: string | null;
  logo_url: string | null;
  certifications: string[] | null;
}

export function usePublicProviders(limit: number = 6) {
  return useQuery({
    queryKey: ["public-providers", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_providers_public")
        .select(`
          id,
          company_name,
          city,
          cantons_served,
          services_offered,
          price_level,
          quality_score,
          response_time_minutes,
          is_featured,
          sponsored_tier,
          verification_status,
          short_description,
          logo_url,
          certifications
        `)
        .eq("account_status", "active")
        .eq("verification_status", "approved")
        .order("sponsored_tier", { ascending: false, nullsFirst: false })
        .order("quality_score", { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;
      return data as PublicProvider[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFeaturedProviders(limit: number = 6) {
  return useQuery({
    queryKey: ["featured-providers", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_providers_public")
        .select(`
          id,
          company_name,
          city,
          cantons_served,
          services_offered,
          price_level,
          quality_score,
          response_time_minutes,
          is_featured,
          sponsored_tier,
          verification_status,
          short_description,
          logo_url,
          certifications
        `)
        .eq("account_status", "active")
        .eq("verification_status", "approved")
        .eq("is_featured", true)
        .order("quality_score", { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;
      return data as PublicProvider[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProvidersByRegion(canton: string, limit: number = 10) {
  return useQuery({
    queryKey: ["providers-by-region", canton, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_providers_public")
        .select(`
          id,
          company_name,
          city,
          cantons_served,
          services_offered,
          price_level,
          quality_score,
          response_time_minutes,
          is_featured,
          sponsored_tier,
          verification_status,
          short_description,
          logo_url,
          certifications
        `)
        .eq("account_status", "active")
        .eq("verification_status", "approved")
        .contains("cantons_served", [canton])
        .order("sponsored_tier", { ascending: false, nullsFirst: false })
        .order("quality_score", { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;
      return data as PublicProvider[];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!canton,
  });
}

// Helper function to estimate price range based on price_level
export function getPriceRange(priceLevel: string | null): string {
  switch (priceLevel) {
    case "günstig":
      return "CHF 800 – 1'200";
    case "fair":
      return "CHF 1'200 – 1'800";
    case "premium":
      return "CHF 1'800 – 2'500";
    default:
      return "CHF 1'000 – 1'600";
  }
}

// Helper function to get response time string
export function getResponseTimeString(minutes: number | null): string {
  if (!minutes) return "< 24 Std.";
  if (minutes < 60) return `< ${minutes} Min.`;
  if (minutes < 120) return "< 2 Std.";
  if (minutes < 240) return "< 4 Std.";
  if (minutes < 480) return "< 8 Std.";
  return "< 24 Std.";
}

// Helper to generate a rating from quality score (0-1 or 0-100 -> 4.0-5.0)
export function getDisplayRating(qualityScore: number | null): number {
  if (!qualityScore) return 4.5;
  // Handle both 0-1 and 0-100 scales
  const normalizedScore = qualityScore > 1 ? qualityScore / 100 : qualityScore;
  return Math.round((4.0 + normalizedScore * 1.0) * 10) / 10;
}

// Helper to get review count estimate based on quality score
export function getEstimatedReviewCount(qualityScore: number | null): number {
  if (!qualityScore) return 50;
  // Handle both 0-1 and 0-100 scales
  const normalizedScore = qualityScore > 1 ? qualityScore / 100 : qualityScore;
  // Higher quality score = more reviews (50-500 range)
  return Math.round(50 + normalizedScore * 450);
}
