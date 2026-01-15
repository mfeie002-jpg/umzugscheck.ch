import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Company {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
  description: string | null;
  short_description: string | null;
  long_description: string | null;
  rating: number | null;
  review_count: number | null;
  price_level: string | null;
  services: string[] | null;
  service_areas: string[] | null;
  cities_served: string[] | null;
  certifications: string[] | null;
  verified: boolean | null;
  featured: boolean | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  gallery_images: string[] | null;
  response_time_hours: number | null;
  success_rate: number | null;
}

export const useCompanies = (limit?: number) => {
  return useQuery({
    queryKey: ["companies", limit],
    queryFn: async () => {
      let query = supabase
        .from("companies")
        .select("*")
        .order("rating", { ascending: false, nullsFirst: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Company[];
    }
  });
};

export const useFeaturedCompanies = () => {
  return useQuery({
    queryKey: ["featured-companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("featured", true)
        .order("rating", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data as Company[];
    }
  });
};

export const useCompanyById = (id: string) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Company;
    },
    enabled: !!id
  });
};

export const useCompanyBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["company-slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data as Company;
    },
    enabled: !!slug
  });
};

export const useCompanyReviews = (companyId: string) => {
  return useQuery({
    queryKey: ["company-reviews", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!companyId
  });
};
