/**
 * Lead Distribution & Auction Engine Types
 */

export type DistributionMode = 'round_robin' | 'weighted' | 'premium_auction' | 'manual';

export type LeadChannel = 'google' | 'meta' | 'organic' | 'referral';

export type LeadTier = 1 | 2 | 3;

export type LeadStatus = 
  | 'new' 
  | 'offered' 
  | 'pending' 
  | 'accepted' 
  | 'sold' 
  | 'routed_feierabend' 
  | 'rejected'
  | 'unsold';

export interface IncomingLead {
  id: string;
  timestamp: Date;
  channel: LeadChannel;
  rooms: number;
  distanceKm: number;
  services: ('packing' | 'montage' | 'cleaning')[];
  moveDate: Date;
  score: number;
  tier: LeadTier;
  estimatedValueCHF: number;
  status: LeadStatus;
  fromPLZ?: string;
  toPLZ?: string;
  canton?: string;
}

export interface PartnerBid {
  partnerId: string;
  partnerName: string;
  bidAmountCHF: number;
  responseMinutes: number;
  acceptanceProbability: number;
  disputeRiskScore: number;
  finalScore: number;
}

export interface AuctionConfig {
  reservePriceCHF: number;
  durationMinutes: number;
  eligiblePartnerIds: string[];
  qualityMinimum: boolean;
}

export interface OfferConfig {
  leadId: string;
  maxPartners: number;
  selectionLogic: 'same_canton' | 'neighboring_canton' | 'national';
  slaMinutes: number;
}

export type RouteResult = 
  | 'feierabend' 
  | 'sold_to_partner' 
  | 'budget_partner' 
  | 'rejected' 
  | 'unsold';

export interface OutcomeRecord {
  id: string;
  leadId: string;
  tier: LeadTier;
  routeResult: RouteResult;
  partnersOffered: string[];
  winningPartner: string | null;
  winningPrice: number | null;
  timestamp: Date;
  notes: string;
}

export type ContractType = 'cpl' | 'commission' | 'hybrid';

export interface PricingRule {
  partnerId: string;
  partnerName: string;
  contractType: ContractType;
  cplPrice: number | null;
  commissionPercent: number | null;
}
