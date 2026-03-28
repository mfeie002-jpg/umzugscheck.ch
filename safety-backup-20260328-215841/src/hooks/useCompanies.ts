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

const DEMO_FEIERABEND_COMPANY: Company = {
  id: "fsg-1",
  name: "Feierabend Services GmbH",
  slug: "feierabend-services-gmbh",
  logo: null,
  description: "Demo-Partnerprofil für QA und lokale Funnel-Tests.",
  short_description: "Premium-Umzugsservice mit Endreinigung, Entsorgung und Lagerung.",
  long_description: "Dieses Profil ist ein Demo-Modell, um Partner-/Firmen-Flows lokal und offline durchzutesten.",
  rating: 4.9,
  review_count: 312,
  price_level: "premium",
  services: ["Umzug", "Firmenumzug", "Reinigung", "Entsorgung", "Lagerung", "Packservice", "Möbelmontage"],
  service_areas: ["Zürich", "Bern", "Basel-Stadt", "Zug", "Luzern", "Aargau", "Schweizweit"],
  cities_served: ["Zürich", "Bern", "Basel", "Luzern", "Zug"],
  certifications: ["ASTAG", "UID-geprüft", "Versichert"],
  verified: true,
  featured: true,
  phone: "+41 44 555 12 34",
  email: "demo@feierabendservices.ch",
  website: "https://feierabendservices.ch",
  gallery_images: [],
  response_time_hours: 1,
  success_rate: 98,
};

const isDemoCompany = (company: Company) =>
  company.id === DEMO_FEIERABEND_COMPANY.id ||
  company.slug === DEMO_FEIERABEND_COMPANY.slug ||
  company.name.toLowerCase() === DEMO_FEIERABEND_COMPANY.name.toLowerCase();

const withDemoCompany = (companies: Company[] | null | undefined): Company[] => {
  const list = companies ?? [];
  return list.some(isDemoCompany) ? list : [DEMO_FEIERABEND_COMPANY, ...list];
};

const isUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

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
      if (error) {
        console.warn("[useCompanies] Falling back to demo company:", error.message);
        return [DEMO_FEIERABEND_COMPANY];
      }
      return withDemoCompany(data as Company[]);
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
      
      if (error) {
        console.warn("[useFeaturedCompanies] Falling back to demo company:", error.message);
        return [DEMO_FEIERABEND_COMPANY];
      }
      return withDemoCompany(data as Company[])
        .filter((company) => company.featured)
        .slice(0, 6);
    }
  });
};

export const useCompanyById = (id: string) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      if (!id) throw new Error("Missing company id");
      if (id === DEMO_FEIERABEND_COMPANY.id || id === DEMO_FEIERABEND_COMPANY.slug) {
        return DEMO_FEIERABEND_COMPANY;
      }

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        throw error;
      }
      return data as Company;
    },
    enabled: !!id
  });
};

export const useCompanyBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["company-slug", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Missing company slug");
      if (slug === DEMO_FEIERABEND_COMPANY.slug || slug === DEMO_FEIERABEND_COMPANY.id) {
        return DEMO_FEIERABEND_COMPANY;
      }

      const field = isUuid(slug) ? "id" : "slug";
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq(field, slug)
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
