/**
 * Cherries & Chaff - Lead Data Schema
 * Swiss Moving Market 2026
 */

export interface Lead {
  lead_id: string;
  timestamp: Date;
  channel: LeadChannel;
  
  // User Input
  rooms: number;
  distance_km: number;
  move_date: Date;
  from_plz: string;
  to_plz: string;
  
  // Calculated
  lead_score: number;
  routing_tier: RoutingTier;
  status: LeadStatus;
  revenue_est: number;
  
  // Attribution
  ad_spend: number;
  sold_price: number | null;
  
  // Metadata
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export type LeadChannel = 'google_ads' | 'meta' | 'seo' | 'direct' | 'referral';

export type RoutingTier = 'feierabend' | 'marketplace_premium' | 'marketplace_standard' | 'reject';

export type LeadStatus = 
  | 'new'
  | 'called'
  | 'quoted'
  | 'booked'
  | 'sold'
  | 'completed'
  | 'dead';

export interface FeierabendJob {
  lead_id: string;
  job_revenue: number;
  labor_hours: number;
  distance_km: number;
  vehicle_day_rate: number;
  cogs_actual: number;
  marketing_spend_share: number;
  sales_hours: number;
  cm2_actual: number;
  margin_percent: number;
}

export interface MarketplaceSale {
  lead_id: string;
  partners_offered: number;
  partners_accepted: number;
  lead_price: number;
  cpl: number;
  margin: number;
}

export interface ScenarioConfig {
  name: string;
  cpc: number;
  lead_conv_rate: number;
  cpl: number;
  feierabend_close_rate: number;
  partner_demand: number; // bids per lead
  recommendation: string;
}

export interface AlertConfig {
  type: AlertType;
  threshold: number;
  message: string;
  action: string;
  severity: 'info' | 'warning' | 'critical';
}

export type AlertType = 
  | 'high_burn'
  | 'margin_compression'
  | 'partner_fatigue'
  | 'pricing_power'
  | 'low_utilization'
  | 'capacity_overflow';
