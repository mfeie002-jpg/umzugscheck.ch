/**
 * Parking Permit Types
 * 
 * Types for the Swiss Parking Permit Planner system
 */

export interface ParkingPermitRule {
  id: string;
  citySlug: string;
  cityName: string;
  cantonCode: string;
  requiresPermit: boolean;
  leadTimeDays: number;
  costChf: number | null;
  maxDurationHours: number;
  contactUrl: string | null;
  applicationUrl: string | null;
  phone: string | null;
  email: string | null;
  instructions: ParkingInstructions;
  requirements: string[];
  tips: string[];
}

export interface ParkingInstructions {
  howToApply: string;
  whereToApply: string;
  whatToBring: string[];
  paymentMethods: string[];
  specialNotes?: string;
}

export interface ParkingPermitRequest {
  citySlug: string;
  moveDate: string; // ISO date
  streetAddress: string;
  duration: number; // hours needed
  vehicleType: 'van' | 'truck_small' | 'truck_large';
}

export interface ParkingPermitResult {
  city: ParkingPermitRule;
  isRequired: boolean;
  deadline: Date;
  isUrgent: boolean;
  daysUntilDeadline: number;
  estimatedCost: number | null;
  steps: ParkingPermitStep[];
  downloadables: PermitDownloadable[];
}

export interface ParkingPermitStep {
  stepNumber: number;
  title: string;
  description: string;
  actionUrl?: string;
  actionLabel?: string;
  estimatedTime?: string;
}

export interface PermitDownloadable {
  type: 'form' | 'guide' | 'sign_template';
  title: string;
  url: string;
  format: 'pdf' | 'docx' | 'png';
}
