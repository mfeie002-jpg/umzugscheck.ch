/**
 * Golden Flow Types
 */

export interface GoldenFlowData {
  // Step 1: Addresses
  fromPLZ: string;
  fromCity: string;
  toPLZ: string;
  toCity: string;
  
  // Step 2: Details
  rooms: number;
  floor: number;
  hasElevator: boolean;
  moveDate: string;
  flexibleDate: boolean;
  
  // Step 3: Services
  selectedServices: string[];
  
  // Step 4: Contact
  name: string;
  email: string;
  phone: string;
  comments: string;
  agbAccepted: boolean;
}

export interface GoldenFlowService {
  id: string;
  label: string;
  description: string;
  details: string;
  benefits: string[];
  priceRange: string;
  priceAdd: number;
  icon: string;
  popular?: boolean;
  highlight?: boolean;
  included?: boolean;
  bookingPercent?: number;
}

export interface GoldenFlowPriceEstimate {
  min: number;
  max: number;
  savings: number;
  breakdown?: {
    transport: number;
    labor: number;
    services: number;
  };
}

export type GoldenFlowStep = 1 | 2 | 3 | 4 | 'success';

export interface GoldenFlowContextValue {
  currentStep: GoldenFlowStep;
  formData: GoldenFlowData;
  priceEstimate: GoldenFlowPriceEstimate | null;
  isSubmitting: boolean;
  setCurrentStep: (step: GoldenFlowStep) => void;
  updateFormData: (updates: Partial<GoldenFlowData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  submit: () => Promise<void>;
}
