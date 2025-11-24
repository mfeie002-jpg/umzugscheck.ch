import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportParams {
  reportType: 'leads' | 'revenue' | 'providers' | 'platform';
  startDate: string;
  endDate: string;
  format: 'json' | 'csv';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const params: ReportParams = await req.json();
    const { reportType, startDate, endDate, format } = params;

    let data: any[] = [];
    let filename = '';

    switch (reportType) {
      case 'leads':
        const { data: leads } = await supabase
          .from('leads')
          .select(`
            *,
            lead_transactions(*)
          `)
          .gte('created_at', startDate)
          .lte('created_at', endDate)
          .order('created_at', { ascending: false });
        
        data = leads || [];
        filename = `leads_report_${startDate}_${endDate}`;
        break;

      case 'revenue':
        const { data: transactions } = await supabase
          .from('lead_transactions')
          .select(`
            *,
            leads(*),
            service_providers(company_name)
          `)
          .gte('purchased_at', startDate)
          .lte('purchased_at', endDate)
          .order('purchased_at', { ascending: false });
        
        data = transactions || [];
        filename = `revenue_report_${startDate}_${endDate}`;
        break;

      case 'providers':
        const { data: providers } = await supabase
          .from('provider_performance_metrics')
          .select(`
            *,
            service_providers(company_name, email)
          `)
          .gte('metric_date', startDate)
          .lte('metric_date', endDate)
          .order('metric_date', { ascending: false });
        
        data = providers || [];
        filename = `providers_report_${startDate}_${endDate}`;
        break;

      case 'platform':
        const { data: analytics } = await supabase
          .from('platform_analytics')
          .select('*')
          .gte('metric_date', startDate)
          .lte('metric_date', endDate)
          .order('metric_date', { ascending: false });
        
        data = analytics || [];
        filename = `platform_report_${startDate}_${endDate}`;
        break;
    }

    if (format === 'csv') {
      const csv = convertToCSV(data);
      return new Response(csv, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      });
    }

    return new Response(
      JSON.stringify({ data, filename }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'object') return JSON.stringify(value);
        if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
        return value;
      }).join(',')
    )
  ].join('\n');

  return csv;
}
