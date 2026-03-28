/**
 * Lead Bidding Service
 * Client-side utilities for the bidding marketplace
 */

import { supabase } from '@/integrations/supabase/client';

export interface BiddableLead {
  id: string;
  from_city: string;
  to_city: string;
  move_date: string;
  starting_bid: number;
  current_highest_bid: number | null;
  bid_count: number;
  bidding_closes_at: string;
  calculator_output?: Record<string, unknown>;
  quality_score?: number;
}

export interface LeadBid {
  id: string;
  lead_id: string;
  provider_id: string;
  bid_amount: number;
  status: 'active' | 'won' | 'lost' | 'expired' | 'withdrawn';
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all currently biddable leads
 */
export async function fetchBiddableLeads(): Promise<BiddableLead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('id, from_city, to_city, move_date, starting_bid, current_highest_bid, bid_count, bidding_closes_at, calculator_output')
    .eq('bidding_enabled', true)
    .gt('bidding_closes_at', new Date().toISOString())
    .order('bidding_closes_at', { ascending: true });

  if (error) throw error;
  return (data as unknown as BiddableLead[]) || [];
}

/**
 * Fetch bids for a specific provider
 */
export async function fetchProviderBids(providerId: string): Promise<LeadBid[]> {
  const { data, error } = await supabase
    .from('lead_bids')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as LeadBid[]) || [];
}

/**
 * Place a bid on a lead
 */
export async function placeBid(
  providerId: string,
  leadId: string,
  bidAmount: number
): Promise<{ success: boolean; bid?: LeadBid; error?: string }> {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.access_token) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data, error } = await supabase.functions.invoke('place-bid', {
    body: { providerId, leadId, bidAmount },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return data;
}

/**
 * Withdraw a bid
 */
export async function withdrawBid(bidId: string): Promise<boolean> {
  const { error } = await supabase
    .from('lead_bids')
    .update({ status: 'withdrawn', updated_at: new Date().toISOString() })
    .eq('id', bidId);

  return !error;
}

/**
 * Subscribe to real-time bid updates for a lead
 */
export function subscribeToBidUpdates(
  leadId: string,
  callback: (bid: LeadBid) => void
) {
  const channel = supabase
    .channel(`lead-bids-${leadId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'lead_bids',
        filter: `lead_id=eq.${leadId}`,
      },
      (payload) => {
        callback(payload.new as LeadBid);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Calculate minimum bid for a lead
 */
export function calculateMinBid(lead: BiddableLead): number {
  return (lead.current_highest_bid || lead.starting_bid || 10) + 1;
}

/**
 * Format time remaining until bidding closes
 */
export function formatTimeRemaining(closesAt: string): {
  text: string;
  urgent: boolean;
  expired: boolean;
} {
  const now = new Date();
  const closes = new Date(closesAt);
  const diff = closes.getTime() - now.getTime();

  if (diff <= 0) {
    return { text: 'Abgelaufen', urgent: true, expired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours < 1) {
    return { text: `${minutes} Min`, urgent: true, expired: false };
  }
  if (hours < 6) {
    return { text: `${hours}h ${minutes}m`, urgent: true, expired: false };
  }
  if (hours < 24) {
    return { text: `${hours} Stunden`, urgent: false, expired: false };
  }
  
  const days = Math.floor(hours / 24);
  return { text: `${days} Tage`, urgent: false, expired: false };
}

/**
 * Get quality tier for a lead based on score
 */
export function getLeadQualityTier(score?: number): {
  label: string;
  color: string;
} | null {
  if (!score) return null;
  
  if (score >= 80) return { label: 'Premium', color: 'bg-emerald-500' };
  if (score >= 60) return { label: 'Gut', color: 'bg-blue-500' };
  if (score >= 40) return { label: 'Standard', color: 'bg-amber-500' };
  return { label: 'Basis', color: 'bg-gray-500' };
}
