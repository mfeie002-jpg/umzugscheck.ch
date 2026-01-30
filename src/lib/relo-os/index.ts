/**
 * Relo-OS Business Logic Layer
 * 
 * The "Invisible Move" Relocation Operating System
 * 
 * @see docs/VISION_COMPLETE.md
 */

// Phase logic
export * from './types';

// GCA - General Contractor Agent (skeleton)
// export * from './gca';

// Pricing - re-export from guaranteed-price-engine
export type { GuaranteedQuote } from '@/lib/guaranteed-price-engine';

// Swiss Integration
export * from './swiss-integration';

// Sustainability & Eco-Score
export * from './sustainability';
