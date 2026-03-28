export interface ReportData {
  leads?: any[];
  transactions?: any[];
  providers?: any[];
  analytics?: any[];
}

export interface ReportMetrics {
  totalLeads: number;
  totalRevenue: number;
  conversionRate: number;
  avgLeadValue: number;
  topProviders: Array<{ name: string; leadsCount: number; revenue: number }>;
  leadsBySource: Record<string, number>;
  leadsByStatus: Record<string, number>;
}

export const calculateReportMetrics = (data: ReportData): ReportMetrics => {
  const leads = data.leads || [];
  const transactions = data.transactions || [];

  const totalLeads = leads.length;
  const convertedLeads = transactions.filter(t => t.conversion_status === 'converted').length;
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  return {
    totalLeads,
    totalRevenue,
    conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0,
    avgLeadValue: totalLeads > 0 ? totalRevenue / totalLeads : 0,
    topProviders: [],
    leadsBySource: {},
    leadsByStatus: {}
  };
};

export const formatReportCSV = (data: any[]): string => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      if (typeof value === 'object') return JSON.stringify(value);
      if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
      return value ?? '';
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
};
