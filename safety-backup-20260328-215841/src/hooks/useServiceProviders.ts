import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Use the actual database type
type ServiceProviderRow = Database["public"]["Tables"]["service_providers"]["Row"];

export interface ServiceProvider extends ServiceProviderRow {}

interface UseServiceProvidersOptions {
  region?: string;
  service?: string;
  priceLevel?: "günstig" | "fair" | "premium";
  minRating?: number;
  verified?: boolean;
  featured?: boolean;
  limit?: number;
}

export function useServiceProviders(options: UseServiceProvidersOptions = {}) {
  const { region, service, priceLevel, minRating, verified, featured, limit = 50 } = options;

  return useQuery({
    queryKey: ["service-providers", options],
    queryFn: async () => {
      let query = supabase
        .from("service_providers")
        .select("*")
        .eq("account_status", "active")
        .order("quality_score", { ascending: false, nullsFirst: false })
        .limit(limit);

      if (region) {
        query = query.contains("cantons_served", [region]);
      }

      if (service) {
        query = query.contains("services_offered", [service]);
      }

      if (priceLevel) {
        query = query.eq("price_level", priceLevel);
      }

      if (verified) {
        query = query.eq("verification_status", "approved");
      }

      if (featured) {
        query = query.eq("is_featured", true);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching service providers:", error);
        throw error;
      }

      return data;
    },
  });
}

export function useServiceProviderBySlug(slug: string) {
  return useQuery({
    queryKey: ["service-provider", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching service provider:", error);
        throw error;
      }

      return data;
    },
    enabled: !!slug,
  });
}

export function useFeaturedProviders(limit = 6) {
  return useServiceProviders({ featured: true, limit });
}

export function useProvidersByRegion(region: string, limit = 20) {
  return useServiceProviders({ region, limit });
}
