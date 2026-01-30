/**
 * Phase 4: BOOKING - Quality-Weighted Bidding + Smart Escrow
 * 
 * Goal: Make booking a single-tap decision, not a beauty contest
 * 
 * System Recommends:
 * - 1 default ("Best overall")
 * - 2 alternatives: Cheapest acceptable, Premium "no-supervision"
 * 
 * Under the hood:
 * - Quality-weighted bidding
 * - Escrow/Treuhand to de-risk transaction
 */

export { SmartEscrowBooking } from '../SmartEscrowBooking';
export { ProviderMatchCard } from '../ProviderMatchCard';
export { BookingOrchestrator } from '../BookingOrchestrator';
