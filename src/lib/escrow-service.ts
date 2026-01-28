import { supabase } from "@/integrations/supabase/client";
import { createCheckoutSession } from "./stripe-service";

export interface EscrowTransaction {
  id: string;
  lead_id: string | null;
  customer_email: string;
  customer_name: string;
  provider_id: string | null;
  total_amount: number;
  platform_fee: number;
  provider_payout: number;
  currency: string;
  status: 'pending' | 'funded' | 'released' | 'disputed' | 'refunded' | 'cancelled';
  created_at: string;
  funded_at: string | null;
  service_completed_at: string | null;
  released_at: string | null;
  disputed_at: string | null;
  service_type: string | null;
  service_date: string | null;
  service_description: string | null;
  customer_confirmed: boolean;
  provider_confirmed: boolean;
  dispute_reason: string | null;
}

export interface EscrowEvent {
  id: string;
  escrow_id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
}

export interface CreateEscrowParams {
  leadId?: string;
  customerEmail: string;
  customerName: string;
  providerId: string;
  totalAmount: number;
  platformFeePercent?: number;
  serviceType: string;
  serviceDate: string;
  serviceDescription?: string;
}

// Platform fee percentage (e.g., 5%)
const DEFAULT_PLATFORM_FEE_PERCENT = 5;

/**
 * Create escrow and initiate Stripe checkout
 */
export async function createEscrowWithStripe(params: CreateEscrowParams): Promise<{
  escrow: EscrowTransaction | null;
  checkoutUrl: string | null;
  error?: string;
}> {
  const escrow = await createEscrowTransaction(params);
  
  if (!escrow) {
    return { escrow: null, checkoutUrl: null, error: 'Failed to create escrow' };
  }
  
  // Create Stripe checkout
  const { url, error } = await createCheckoutSession({
    providerId: params.providerId,
    leadId: params.leadId,
    amount: params.totalAmount,
    description: params.serviceDescription || `Escrow: ${params.customerName}`,
    paymentType: 'lead_purchase',
    successUrl: `${window.location.origin}/escrow/success?id=${escrow.id}`,
    cancelUrl: `${window.location.origin}/escrow/cancel?id=${escrow.id}`,
  });
  
  if (error) {
    console.warn('Stripe checkout failed (using demo mode):', error);
  }
  
  return { escrow, checkoutUrl: url };
}

/**
 * Get escrow status label for display
 */
export function getEscrowStatusDisplay(status: EscrowTransaction['status']): {
  label: string;
  color: string;
  icon: 'clock' | 'check' | 'shield' | 'alert' | 'x';
} {
  const map: Record<EscrowTransaction['status'], { label: string; color: string; icon: 'clock' | 'check' | 'shield' | 'alert' | 'x' }> = {
    pending: { label: 'Ausstehend', color: 'text-yellow-600 bg-yellow-100', icon: 'clock' },
    funded: { label: 'Finanziert', color: 'text-blue-600 bg-blue-100', icon: 'shield' },
    released: { label: 'Freigegeben', color: 'text-emerald-600 bg-emerald-100', icon: 'check' },
    disputed: { label: 'Streitfall', color: 'text-red-600 bg-red-100', icon: 'alert' },
    refunded: { label: 'Erstattet', color: 'text-gray-600 bg-gray-100', icon: 'x' },
    cancelled: { label: 'Storniert', color: 'text-gray-500 bg-gray-50', icon: 'x' },
  };
  return map[status] || map.pending;
}

/**
 * Calculate escrow amounts helper
 */
export function calculateEscrowAmounts(totalAmount: number, feePercent = DEFAULT_PLATFORM_FEE_PERCENT) {
  const platformFee = Math.round(totalAmount * (feePercent / 100));
  return {
    totalAmount,
    platformFee,
    providerPayout: totalAmount - platformFee,
  };
}

/**
 * Create a new escrow transaction
 */
export async function createEscrowTransaction(params: CreateEscrowParams): Promise<EscrowTransaction | null> {
  const platformFeePercent = params.platformFeePercent ?? DEFAULT_PLATFORM_FEE_PERCENT;
  const platformFee = params.totalAmount * (platformFeePercent / 100);
  const providerPayout = params.totalAmount - platformFee;

  const { data, error } = await supabase
    .from('escrow_transactions')
    .insert({
      lead_id: params.leadId || null,
      customer_email: params.customerEmail,
      customer_name: params.customerName,
      provider_id: params.providerId,
      total_amount: params.totalAmount,
      platform_fee: platformFee,
      provider_payout: providerPayout,
      service_type: params.serviceType,
      service_date: params.serviceDate,
      service_description: params.serviceDescription || null,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating escrow transaction:', error);
    return null;
  }

  return data as EscrowTransaction;
}

/**
 * Get escrow transaction by ID
 */
export async function getEscrowTransaction(escrowId: string): Promise<EscrowTransaction | null> {
  const { data, error } = await supabase
    .from('escrow_transactions')
    .select('*')
    .eq('id', escrowId)
    .single();

  if (error) {
    console.error('Error fetching escrow transaction:', error);
    return null;
  }

  return data as EscrowTransaction;
}

/**
 * Get all escrow transactions for a customer
 */
export async function getCustomerEscrowTransactions(customerEmail: string): Promise<EscrowTransaction[]> {
  const { data, error } = await supabase
    .from('escrow_transactions')
    .select('*')
    .eq('customer_email', customerEmail)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customer escrow transactions:', error);
    return [];
  }

  return (data || []) as EscrowTransaction[];
}

/**
 * Get all escrow transactions for a provider
 */
export async function getProviderEscrowTransactions(providerId: string): Promise<EscrowTransaction[]> {
  const { data, error } = await supabase
    .from('escrow_transactions')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching provider escrow transactions:', error);
    return [];
  }

  return (data || []) as EscrowTransaction[];
}

/**
 * Mark escrow as funded (after payment received)
 */
export async function markEscrowFunded(escrowId: string, paymentIntentId: string): Promise<boolean> {
  const { error } = await supabase
    .from('escrow_transactions')
    .update({
      status: 'funded',
      funded_at: new Date().toISOString(),
      stripe_payment_intent_id: paymentIntentId
    })
    .eq('id', escrowId);

  if (error) {
    console.error('Error marking escrow as funded:', error);
    return false;
  }

  return true;
}

/**
 * Customer confirms service completion
 */
export async function customerConfirmService(escrowId: string): Promise<boolean> {
  const { error } = await supabase
    .from('escrow_transactions')
    .update({
      customer_confirmed: true
    })
    .eq('id', escrowId);

  if (error) {
    console.error('Error confirming service (customer):', error);
    return false;
  }

  return true;
}

/**
 * Provider confirms service completion
 */
export async function providerConfirmService(escrowId: string): Promise<boolean> {
  const { error } = await supabase
    .from('escrow_transactions')
    .update({
      provider_confirmed: true
    })
    .eq('id', escrowId);

  if (error) {
    console.error('Error confirming service (provider):', error);
    return false;
  }

  return true;
}

/**
 * Open a dispute on an escrow transaction
 */
export async function openDispute(escrowId: string, reason: string): Promise<boolean> {
  const { error } = await supabase
    .from('escrow_transactions')
    .update({
      status: 'disputed',
      disputed_at: new Date().toISOString(),
      dispute_reason: reason
    })
    .eq('id', escrowId);

  if (error) {
    console.error('Error opening dispute:', error);
    return false;
  }

  return true;
}

/**
 * Resolve a dispute
 */
export async function resolveDispute(
  escrowId: string, 
  resolution: 'release' | 'refund',
  resolutionNotes: string,
  resolvedBy: string
): Promise<boolean> {
  const newStatus = resolution === 'release' ? 'released' : 'refunded';
  
  const { error } = await supabase
    .from('escrow_transactions')
    .update({
      status: newStatus,
      dispute_resolution: resolutionNotes,
      resolved_by: resolvedBy,
      resolved_at: new Date().toISOString(),
      ...(resolution === 'release' ? { released_at: new Date().toISOString() } : {})
    })
    .eq('id', escrowId);

  if (error) {
    console.error('Error resolving dispute:', error);
    return false;
  }

  return true;
}

/**
 * Get escrow event history
 */
export async function getEscrowEvents(escrowId: string): Promise<EscrowEvent[]> {
  const { data, error } = await supabase
    .from('escrow_events')
    .select('*')
    .eq('escrow_id', escrowId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching escrow events:', error);
    return [];
  }

  return (data || []) as EscrowEvent[];
}

/**
 * Cancel an escrow transaction (only if still pending)
 */
export async function cancelEscrow(escrowId: string): Promise<boolean> {
  const { error } = await supabase
    .from('escrow_transactions')
    .update({
      status: 'cancelled'
    })
    .eq('id', escrowId)
    .eq('status', 'pending'); // Can only cancel if pending

  if (error) {
    console.error('Error cancelling escrow:', error);
    return false;
  }

  return true;
}

/**
 * Get escrow statistics for a provider
 */
export async function getProviderEscrowStats(providerId: string) {
  const { data, error } = await supabase
    .from('escrow_transactions')
    .select('status, provider_payout')
    .eq('provider_id', providerId);

  if (error) {
    console.error('Error fetching escrow stats:', error);
    return null;
  }

  const stats = {
    totalTransactions: data?.length || 0,
    pendingAmount: 0,
    fundedAmount: 0,
    releasedAmount: 0,
    disputedCount: 0
  };

  data?.forEach(tx => {
    const payout = Number(tx.provider_payout) || 0;
    switch (tx.status) {
      case 'pending':
        stats.pendingAmount += payout;
        break;
      case 'funded':
        stats.fundedAmount += payout;
        break;
      case 'released':
        stats.releasedAmount += payout;
        break;
      case 'disputed':
        stats.disputedCount++;
        break;
    }
  });

  return stats;
}

/**
 * Subscribe to escrow transaction updates
 */
export function subscribeToEscrowUpdates(
  escrowId: string,
  callback: (payload: { new: EscrowTransaction; old: EscrowTransaction }) => void
) {
  const channel = supabase
    .channel(`escrow-${escrowId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'escrow_transactions',
        filter: `id=eq.${escrowId}`
      },
      (payload) => callback(payload as unknown as { new: EscrowTransaction; old: EscrowTransaction })
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
