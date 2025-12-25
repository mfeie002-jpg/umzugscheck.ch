import { useLocation } from "react-router-dom";
import { getUcCaptureParams, getTomorrowISODate, getDefaultCaptureContact, type UcCaptureParams } from "@/lib/uc-capture";

/**
 * Hook to check if the current page is in capture mode for screenshot automation.
 * When uc_capture=1 is in the URL, flows should:
 * 1. Jump to the specified step (uc_step=N)
 * 2. Pre-fill with demo data for consistent screenshots
 * 
 * Usage in any flow component:
 * const { isCaptureMode, captureStep, demoData } = useCaptureMode();
 * 
 * Then use captureStep to set initial step and demoData for form fields.
 */
export interface DemoFormData {
  // Location
  fromLocation: string;
  toLocation: string;
  fromPostal: string;
  toPostal: string;
  fromCity: string;
  toCity: string;
  
  // Apartment
  apartmentSize: string;
  rooms: number;
  floor: number;
  hasElevator: boolean;
  
  // Date & Time
  moveDate: string;
  preferredTime: string;
  
  // Services
  selectedServices: string[];
  serviceLevel: number; // 0-100 for slider-based flows
  
  // Contact
  name: string;
  email: string;
  phone: string;
  
  // Flags
  privacyAccepted: boolean;
  selectedCompanies: string[];
}

export interface CaptureMode {
  isCaptureMode: boolean;
  captureStep: number | null;
  captureFocus: "options" | "contact" | null;
  demoData: DemoFormData;
  params: UcCaptureParams;
}

export function useCaptureMode(): CaptureMode {
  const location = useLocation();
  const params = getUcCaptureParams(location.search);
  const contact = getDefaultCaptureContact();
  
  const demoData: DemoFormData = {
    // Location
    fromLocation: "8048 Zürich",
    toLocation: "3011 Bern",
    fromPostal: "8048",
    toPostal: "3011",
    fromCity: "Zürich",
    toCity: "Bern",
    
    // Apartment
    apartmentSize: "3-3.5",
    rooms: 3.5,
    floor: 2,
    hasElevator: true,
    
    // Date & Time
    moveDate: getTomorrowISODate(),
    preferredTime: "08:00-12:00",
    
    // Services
    selectedServices: ["umzug", "einpacken", "reinigung"],
    serviceLevel: 65, // Mid-high for slider-based flows
    
    // Contact
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    
    // Flags
    privacyAccepted: true,
    selectedCompanies: ["demo-1", "demo-2", "demo-3"],
  };
  
  return {
    isCaptureMode: params.enabled,
    captureStep: params.step,
    captureFocus: params.focus,
    demoData,
    params,
  };
}
