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
export { EnhancedLiDARScanner } from './EnhancedLiDARScanner';
export { DigitalTwinDisplay } from './DigitalTwinDisplay';
export { InventoryOrchestrator } from './InventoryOrchestrator';

// Phase 3: Quote (Dynamic Pricing + Guaranteed Fixed Price)
export { ServiceTierSelector } from './ServiceTierSelector';
export { DynamicPriceDisplay } from './DynamicPriceDisplay';
export { GuaranteedPriceCard } from './GuaranteedPriceCard';
export { QuoteOrchestrator } from './QuoteOrchestrator';

// Phase 4: Matching (Quality-Weighted Bidding) + Booking (Smart Escrow)
export { ProviderMatchCard } from './ProviderMatchCard';
export { BookingOrchestrator } from './BookingOrchestrator';

// Phase 5: Moving (GPS Tracking + Notifications)
export { SmartEscrowBooking } from './SmartEscrowBooking';
export type { EscrowBookingData, SmartEscrowBookingProps } from './SmartEscrowBooking';
export { LiveTrackingPanel } from './LiveTrackingPanel';
export type { TrackingUpdate, CrewMember, LiveTrackingPanelProps } from './LiveTrackingPanel';
export { GPSTrackingMap } from './GPSTrackingMap';
export { MovingOrchestrator } from './MovingOrchestrator';

// Phase 6: Complete (Swiss Handover Protocol + Digital Signatures)
export { HandoverProtocol } from './HandoverProtocol';
export type { HandoverRoom, HandoverCategory, HandoverProtocolProps } from './HandoverProtocol';
export { DigitalSignaturePad } from './DigitalSignaturePad';
