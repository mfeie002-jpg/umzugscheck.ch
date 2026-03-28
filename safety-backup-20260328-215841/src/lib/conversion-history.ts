// Utility to fetch provider conversion history for quality scoring
import { supabase } from "@/integrations/supabase/client";

export interface ConversionHistory {
  total_leads: number;
  converted_leads: number;
  avg_conversion_time_days: number;
  by_calculator_type: Record<string, { total: number; converted: number }>;
  by_canton: Record<string, { total: number; converted: number }>;
  by_value_range: Record<string, { total: number; converted: number }>;
}

export type { ConversionHistory as ConversionHistoryType };

export const fetchProviderConversionHistory = async (
  providerId: string
): Promise<ConversionHistory | null> => {
  try {
    const { data, error } = await supabase.rpc('get_provider_conversion_history', {
      p_provider_id: providerId
    });

    if (error) {
      console.error('Error fetching conversion history:', error);
      return null;
    }

    if (!data) return null;

    // Type cast the JSONB response
    const historyData = data as any;

    return {
      total_leads: historyData.total_leads || 0,
      converted_leads: historyData.converted_leads || 0,
      avg_conversion_time_days: historyData.avg_conversion_time_days || 0,
      by_calculator_type: historyData.by_calculator_type || {},
      by_canton: historyData.by_canton || {},
      by_value_range: {}
    };
  } catch (err) {
    console.error('Error in fetchProviderConversionHistory:', err);
    return null;
  }
};
