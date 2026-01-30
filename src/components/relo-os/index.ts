/**
 * Relo-OS Components
 * 
 * UI components for the "Invisible Move" relocation operating system.
 * These implement the complete 6-phase customer journey.
 * 
 * @see docs/VISION_COMPLETE.md
 * 
 * Phase Structure:
 * - Phase 1: ROUTE (Intent Capture)
 * - Phase 2: INVENTORY (AI Video Scan + Digital Twin)
 * - Phase 3: QUOTE (Instant Fixed-Price)
 * - Phase 4: BOOKING (Quality-Weighted Bidding + Escrow)
 * - Phase 5: MOVING (Live GPS Tracking)
 * - Phase 6: COMPLETE (Swiss Handover Protocol)
 */

// ============================================================================
// PHASE 1: ROUTE (Initialization)
// ============================================================================
export { RouteInitializer } from './RouteInitializer';
export type { RouteInitializerProps } from './RouteInitializer';

// Phase 1 sub-components
export * from './phase-1-route';

// ============================================================================
// PHASE 2: INVENTORY (AI Video Scan / LiDAR)
// ============================================================================
export { LiDARDepthScanner } from './LiDARDepthScanner';
export type { LiDARScanResult } from './LiDARDepthScanner';
export { EnhancedLiDARScanner } from './EnhancedLiDARScanner';
export { DigitalTwinDisplay } from './DigitalTwinDisplay';
export { InventoryOrchestrator } from './InventoryOrchestrator';

// Phase 2 sub-components
export * from './phase-2-inventory';

// ============================================================================
// PHASE 3: QUOTE (Dynamic Pricing + Guaranteed Fixed Price)
// ============================================================================
export { ServiceTierSelector } from './ServiceTierSelector';
export { DynamicPriceDisplay } from './DynamicPriceDisplay';
export { GuaranteedPriceCard } from './GuaranteedPriceCard';
export { QuoteOrchestrator } from './QuoteOrchestrator';

// Phase 3 sub-components
export * from './phase-3-quote';

// ============================================================================
// PHASE 4: BOOKING (Quality-Weighted Bidding + Smart Escrow)
// ============================================================================
export { ProviderMatchCard } from './ProviderMatchCard';
export { BookingOrchestrator } from './BookingOrchestrator';

// Phase 4 sub-components
export * from './phase-4-booking';

// ============================================================================
// PHASE 5: MOVING (GPS Tracking + Notifications)
// ============================================================================
export { SmartEscrowBooking } from './SmartEscrowBooking';
export type { EscrowBookingData, SmartEscrowBookingProps } from './SmartEscrowBooking';
export { LiveTrackingPanel } from './LiveTrackingPanel';
export type { TrackingUpdate, CrewMember, LiveTrackingPanelProps } from './LiveTrackingPanel';
export { GPSTrackingMap } from './GPSTrackingMap';
export { MovingOrchestrator } from './MovingOrchestrator';

// Phase 5 sub-components
export * from './phase-5-moving';

// ============================================================================
// PHASE 6: COMPLETE (Swiss Handover Protocol + Digital Signatures)
// ============================================================================
export { HandoverProtocol } from './HandoverProtocol';
export type { HandoverRoom, HandoverCategory, HandoverProtocolProps } from './HandoverProtocol';
export { DigitalSignaturePad } from './DigitalSignaturePad';
export { CompleteOrchestrator } from './CompleteOrchestrator';

// Phase 6 sub-components
export * from './phase-6-complete';
