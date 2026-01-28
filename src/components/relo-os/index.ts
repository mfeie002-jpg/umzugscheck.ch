/**
 * Relo-OS Components
 * 
 * UI components for the "Invisible Move" relocation operating system.
 * These implement the complete 6-phase customer journey.
 */

// Phase 1: Route (Initialization)
export { RouteInitializer } from './RouteInitializer';
export type { RouteInitializerProps } from './RouteInitializer';

// Phase 2: Inventory (AI Video Scan / LiDAR)
export { LiDARDepthScanner } from './LiDARDepthScanner';
export type { LiDARScanResult } from './LiDARDepthScanner';
export { DigitalTwinDisplay } from './DigitalTwinDisplay';

// Phase 3: Quote (Dynamic Pricing + Guaranteed Fixed Price)
export { ServiceTierSelector } from './ServiceTierSelector';
export { DynamicPriceDisplay } from './DynamicPriceDisplay';
export { GuaranteedPriceCard } from './GuaranteedPriceCard';

// Phase 4: Matching (Quality-Weighted Bidding)
export { ProviderMatchCard } from './ProviderMatchCard';

// Phase 5: Booking (Smart Escrow) + Moving (GPS Tracking)
export { SmartEscrowBooking } from './SmartEscrowBooking';
export type { EscrowBookingData, SmartEscrowBookingProps } from './SmartEscrowBooking';
export { LiveTrackingPanel } from './LiveTrackingPanel';
export type { TrackingUpdate, CrewMember, LiveTrackingPanelProps } from './LiveTrackingPanel';
export { GPSTrackingMap } from './GPSTrackingMap';

// Phase 6: Complete (Swiss Handover Protocol + Digital Signatures)
export { HandoverProtocol } from './HandoverProtocol';
export type { HandoverRoom, HandoverCategory, HandoverProtocolProps } from './HandoverProtocol';
export { DigitalSignaturePad } from './DigitalSignaturePad';
