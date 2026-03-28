import type { Tables } from "@/integrations/supabase/types";

/**
 * Public provider data from the service_providers_public view.
 * This excludes sensitive fields like password_hash, email, phone, and billing data.
 */
export type PublicProvider = Tables<"service_providers_public">;

/**
 * Full provider data from the service_providers table.
 * Only use this for authenticated provider dashboard or admin contexts.
 */
export type ServiceProvider = Tables<"service_providers">;

/**
 * Helper type for provider with computed display fields
 */
export type ProviderWithDisplay = PublicProvider & {
  displayRating?: number;
  displayLocation?: string;
};
