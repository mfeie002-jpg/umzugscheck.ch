/**
 * Phase 1: ROUTE - Intent Capture & Address Entry
 * 
 * Goal: Start the relocation process in under 30 seconds
 * 
 * Inputs (minimum viable truth):
 * - From/To (address or PLZ)
 * - Date window (not single date)
 * - Size signal (rooms OR quick scan)
 * - Special constraints (lift? piano? fragile?)
 */

export { RouteInitializer } from '../RouteInitializer';

// Re-export SmartRouter components for backward compatibility
export { SmartRouterWizard } from '@/components/smart-router/SmartRouterWizard';
