/**
 * Partner Network Manager Types
 */

export interface Partner {
  id: string;
  name: string;
  canton: string;
  capacityStatus: 'open' | 'limited' | 'full';
  services: ('moving' | 'packing' | 'cleaning' | 'storage')[];
  priceTier: 'budget' | 'standard' | 'premium';
  acceptanceRate: number;
  avgResponseMinutes: number;
  closeRateEstimate: number | null;
  disputeRate: number;
  avgRevenuePerLead: number;
  partnerROI: number | null;
  contractModel: 'cpl' | 'commission' | 'hybrid';
  cplPrice: number | null;
  commissionPercent: number | null;
  maxLeadsPerWeek: number;
  minRoomRequirement: number;
  status: 'active' | 'probation' | 'paused' | 'banned';
  notes: string;
  createdAt: Date;
}

export interface MarketplaceKPIs {
  period: '7d' | '30d';
  totalLeadsGenerated: number;
  leadsSold: number;
  fillRate: number;
  avgResaleRate: number;
  avgRevenuePerLead: number;
  avgMarginPerLead: number;
  disputeRate: number;
  activePartners: number;
  partnerChurn: number;
}

export interface Dispute {
  id: string;
  leadId: string;
  partnerId: string;
  partnerName: string;
  issueType: 
    | 'bad_phone'
    | 'fake_lead'
    | 'customer_unreachable'
    | 'not_moving'
    | 'pricing_complaint'
    | 'quality_complaint'
    | 'disintermediation';
  refundRequested: boolean;
  outcome: 'pending' | 'refund_approved' | 'refund_denied' | 'partner_warned' | 'partner_paused' | 'partner_banned';
  notes: string;
  createdAt: Date;
}

export interface MysteryShopResult {
  id: string;
  date: Date;
  partnerId: string;
  partnerName: string;
  result: 'clean' | 'leakage' | 'unprofessional' | 'hidden_fees';
  notes: string;
}

export interface CantonCoverage {
  canton: string;
  cantonCode: string;
  targetMin: number;
  targetMax: number;
  currentActive: number;
  isOverLimit: boolean;
}

export type DistributionMode = 'round_robin' | 'highest_acceptance' | 'fastest_response' | 'premium_auction';

export interface DistributionSettings {
  tier2MaxPartners: number;
  tier3FlatPrice: number;
  distributionMode: DistributionMode;
}

export type MarketplaceStatus = 'healthy' | 'warning' | 'critical';
