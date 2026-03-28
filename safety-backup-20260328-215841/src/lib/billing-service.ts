/**
 * Billing Service
 * Tracks and manages billing events for providers
 */

export type BillingEventType = "CPC_CLICK" | "CPL_LEAD" | "CPCALL_CALL";

export interface BillingEvent {
  id: string;
  companyId: string;
  eventType: BillingEventType;
  eventTime: Date;
  costCHF: number;
  relatedLeadId?: string;
  relatedRankingPage?: string;
  metadata?: Record<string, any>;
}

// In-memory storage for demo (would use database in production)
let billingEvents: BillingEvent[] = [];

/**
 * Log a billing event
 */
export const logBillingEvent = (event: Omit<BillingEvent, 'id' | 'eventTime'>): BillingEvent => {
  const newEvent: BillingEvent = {
    ...event,
    id: `billing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    eventTime: new Date(),
  };
  
  billingEvents.push(newEvent);
  
  console.log(`[Billing] ${event.eventType} - Company ${event.companyId} - CHF ${event.costCHF}`);
  
  return newEvent;
};

/**
 * Get billing events for a company
 */
export const getCompanyBillingEvents = (
  companyId: string,
  startDate?: Date,
  endDate?: Date
): BillingEvent[] => {
  return billingEvents.filter(event => {
    if (event.companyId !== companyId) return false;
    if (startDate && event.eventTime < startDate) return false;
    if (endDate && event.eventTime > endDate) return false;
    return true;
  });
};

/**
 * Calculate total billing for a company
 */
export const calculateTotalBilling = (
  companyId: string,
  startDate?: Date,
  endDate?: Date
): number => {
  const events = getCompanyBillingEvents(companyId, startDate, endDate);
  return events.reduce((total, event) => total + event.costCHF, 0);
};

/**
 * Get billing summary by event type
 */
export const getBillingSummary = (
  companyId: string,
  startDate?: Date,
  endDate?: Date
) => {
  const events = getCompanyBillingEvents(companyId, startDate, endDate);
  
  const summary = {
    totalCost: 0,
    cpcClicks: 0,
    cpcCost: 0,
    cplLeads: 0,
    cplCost: 0,
    cpcallCalls: 0,
    cpcallCost: 0,
  };

  events.forEach(event => {
    summary.totalCost += event.costCHF;
    
    switch (event.eventType) {
      case 'CPC_CLICK':
        summary.cpcClicks++;
        summary.cpcCost += event.costCHF;
        break;
      case 'CPL_LEAD':
        summary.cplLeads++;
        summary.cplCost += event.costCHF;
        break;
      case 'CPCALL_CALL':
        summary.cpcallCalls++;
        summary.cpcallCost += event.costCHF;
        break;
    }
  });

  return summary;
};

/**
 * Reset billing events (for demo purposes)
 */
export const resetBillingEvents = () => {
  billingEvents = [];
};

/**
 * Deduct from daily budget and log billing event
 */
export const deductFromBudget = (
  company: any,
  eventType: BillingEventType,
  relatedLeadId?: string,
  relatedRankingPage?: string
): { success: boolean; event?: BillingEvent; error?: string } => {
  const bidAmount = 
    eventType === 'CPC_CLICK' ? company.maxBidPerClickCHF :
    eventType === 'CPL_LEAD' ? company.maxBidPerLeadCHF :
    company.maxBidPerCallCHF || 0;

  if (company.remainingDailyBudgetCHF < bidAmount) {
    return {
      success: false,
      error: 'Insufficient daily budget remaining'
    };
  }

  // Deduct from budget (would update database in production)
  company.remainingDailyBudgetCHF -= bidAmount;

  // Log billing event
  const event = logBillingEvent({
    companyId: company.id,
    eventType,
    costCHF: bidAmount,
    relatedLeadId,
    relatedRankingPage,
  });

  return { success: true, event };
};
