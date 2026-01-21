import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  provider_id: string | null;
  company_id: string | null;
  rating: number | null;
  title: string | null;
  comment: string | null;
  verified: boolean | null;
  helpful_count: number | null;
  created_at: string;
}

export function useReviews(providerId?: string, limit: number = 10) {
  return useQuery({
    queryKey: ["reviews", providerId, limit],
    queryFn: async () => {
      let query = supabase
        .from("reviews")
        .select("id, provider_id, company_id, rating, title, comment, verified, helpful_count, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (providerId) {
        query = query.eq("provider_id", providerId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }

      return data;
    },
  });
}

export function useProviderReviewStats(providerId: string) {
  return useQuery({
    queryKey: ["provider-review-stats", providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("provider_id", providerId);

      if (error) {
        console.error("Error fetching review stats:", error);
        throw error;
      }

      const count = data?.length || 0;
      const avgRating = count > 0 
        ? data.reduce((sum, r) => sum + (r.rating || 0), 0) / count 
        : 0;

      return {
        count,
        averageRating: Math.round(avgRating * 10) / 10,
      };
    },
    enabled: !!providerId,
  });
}

export function useFeaturedReviews(limit: number = 6) {
  return useQuery({
    queryKey: ["featured-reviews", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id, 
          provider_id, 
          company_id, 
          rating, 
          title, 
          comment, 
          verified, 
          helpful_count, 
          created_at
        `)
        .eq("verified", true)
        .gte("rating", 4)
        .not("provider_id", "is", null)
        .order("helpful_count", { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching featured reviews:", error);
        throw error;
      }

      return data;
    },
  });
}

// Get reviews with provider info joined
export function useReviewsWithProviders(limit: number = 10) {
  return useQuery({
    queryKey: ["reviews-with-providers", limit],
    queryFn: async () => {
      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("id, provider_id, rating, title, comment, verified, helpful_count, created_at")
        .eq("verified", true)
        .gte("rating", 4)
        .not("provider_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }

      // Get provider names for these reviews
      const providerIds = [...new Set(reviews?.map(r => r.provider_id).filter(Boolean))];
      
      if (providerIds.length > 0) {
        const { data: providers } = await supabase
          .from("service_providers")
          .select("id, company_name, city")
          .in("id", providerIds);

        const providerMap = new Map(providers?.map(p => [p.id, p]));
        
        return reviews?.map(review => ({
          ...review,
          provider: providerMap.get(review.provider_id || "") || null,
        }));
      }

      return reviews;
    },
  });
}
