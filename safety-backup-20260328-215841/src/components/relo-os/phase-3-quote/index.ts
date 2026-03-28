/**
 * Phase 3: QUOTE - Instant Fixed-Price + Dynamic Pricing Engine
 * 
 * Goal: Provide credible fixed price FAST
 * 
 * Price Progression:
 * 1. Show price range first (anchoring, reduces fear)
 * 2. Fixed price once inventory confidence is high enough
 * 3. If confidence low: offer video scan or specialist call
 * 
 * No PDFs, no negotiation anxiety, no 7-way comparison hell
 */

export { GuaranteedPriceCard } from '../GuaranteedPriceCard';
export { DynamicPriceDisplay } from '../DynamicPriceDisplay';
export { ServiceTierSelector } from '../ServiceTierSelector';
export { QuoteOrchestrator } from '../QuoteOrchestrator';
