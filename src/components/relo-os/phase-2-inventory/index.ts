/**
 * Phase 2: INVENTORY - AI Video Scan + LiDAR Digital Twin
 * 
 * Goal: Capture household inventory without typing
 * 
 * Methods:
 * - Smartphone video walkthrough (works for everyone)
 * - LiDAR-enhanced scan for iPhone/iPad Pro
 * 
 * Outputs:
 * - Volume estimate (m³)
 * - Item categories + special items
 * - Access constraints (stairs, narrow hallways)
 * - Packing complexity score
 */

export { EnhancedLiDARScanner } from '../EnhancedLiDARScanner';
export { LiDARDepthScanner } from '../LiDARDepthScanner';
export { DigitalTwinDisplay } from '../DigitalTwinDisplay';
export { InventoryOrchestrator } from '../InventoryOrchestrator';
