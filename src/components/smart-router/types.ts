/**
 * Smart Router Types
 * Based on Gemini UX Audit recommendations
 */

export type SmartRouterStep = 
  | 'plz'           // Step 1: Single PLZ input (minimal cognitive load)
  | 'qualification' // Step 2: Room count + destination
  | 'routing'       // Step 3: Video vs Form recommendation
  | 'video'         // Path A: Video analysis flow
  | 'form'          // Path B: Express form flow
  | 'contact'       // Step 4: Contact details
  | 'loading'       // Labor illusion
  | 'success';      // Confirmation

export interface SmartRouterData {
  // Step 1: PLZ Entry
  fromPLZ: string;
  fromCity: string;
  
  // Step 2: Qualification
  toPLZ: string;
  toCity: string;
  rooms: number;
  moveDate: string;
  flexibleDate: boolean;
  
  // Step 3: Method selection
  selectedMethod: 'video' | 'form' | null;
  
  // Step 4: Contact
  name: string;
  email: string;
  phone: string;
  comments: string;
  agbAccepted: boolean;
  
  // Services (default: umzug)
  selectedServices: string[];
}

export interface SmartRouterPriceEstimate {
  min: number;
  max: number;
  savings: number;
  isHighValue: boolean; // >2.5 rooms = high value = push video
}

// Routing logic thresholds
export const SMART_ROUTER_CONFIG = {
  // Rooms threshold for video recommendation
  VIDEO_THRESHOLD_ROOMS: 2.5,
  
  // Video incentive (CHF discount on cleaning)
  VIDEO_INCENTIVE_CHF: 50,
  
  // Storage key for localStorage
  STORAGE_KEY: 'smart-router-flow-data',
} as const;
