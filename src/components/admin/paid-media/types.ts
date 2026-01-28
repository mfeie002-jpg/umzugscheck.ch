export interface PaidMediaCampaign {
  id: string;
  platform: 'google_ads' | 'meta_ads' | 'microsoft_ads' | 'tiktok_ads' | 'linkedin_ads';
  campaign_id: string;
  campaign_name: string;
  campaign_type?: string;
  status: string;
  daily_budget_chf?: number;
  created_at: string;
  updated_at: string;
}

export interface PaidMediaDailyMetrics {
  id: string;
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  cost_chf: number;
  conversions: number;
  conversion_value_chf: number;
  ctr: number;
  cpc_chf: number;
  cpl_chf: number;
  roas: number;
}

export interface PaidMediaAlert {
  id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  metric_value?: number;
  threshold_value?: number;
  is_acknowledged: boolean;
  acknowledged_at?: string;
  created_at: string;
}

export interface PaidMediaSyncLog {
  id: string;
  platform: string;
  sync_type: string;
  status: string;
  records_synced: number;
  error_message?: string;
  started_at: string;
  completed_at?: string;
}

export interface AggregatedMetrics {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalConversionValue: number;
  avgCTR: number;
  avgCPC: number;
  avgCPL: number;
  avgROAS: number;
}

export interface KillSwitchStatus {
  cplStatus: 'ok' | 'warning' | 'critical';
  currentCPL: number;
  threshold: number;
  message?: string;
}
