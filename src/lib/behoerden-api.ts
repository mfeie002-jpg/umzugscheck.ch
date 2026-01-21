/**
 * Behörden-API Service (Government API Layer)
 * Automates address changes, utility transfers, and bureaucratic tasks
 * One of the key Moat features - direct integrations with Swiss authorities
 */

export interface AddressChangeRequest {
  userId: string;
  oldAddress: {
    street: string;
    postalCode: string;
    city: string;
    canton: string;
  };
  newAddress: {
    street: string;
    postalCode: string;
    city: string;
    canton: string;
  };
  moveDate: string;
  residents: ResidentInfo[];
  services: BureaucracyService[];
}

export interface ResidentInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  ahvNumber?: string;
  isMainPerson: boolean;
}

export interface BureaucracyService {
  id: string;
  type: BureaucracyServiceType;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider?: string;
  referenceNumber?: string;
  completedAt?: string;
  errorMessage?: string;
}

export type BureaucracyServiceType = 
  | 'municipality_registration'  // Gemeinde Anmeldung
  | 'municipality_deregistration' // Gemeinde Abmeldung
  | 'post_redirect'              // Post-Umleitung
  | 'electricity_transfer'       // Strom Übertragung
  | 'gas_transfer'              // Gas Übertragung
  | 'internet_transfer'         // Internet Übertragung
  | 'tv_license'                // Serafe/Billag
  | 'car_registration'          // Fahrzeug Ummeldung
  | 'health_insurance_update'   // Krankenkasse Update
  | 'bank_address_update'       // Bank Adressänderung
  | 'employer_notification';    // Arbeitgeber Benachrichtigung

export interface BureaucracyStatus {
  requestId: string;
  overallStatus: 'pending' | 'in_progress' | 'completed' | 'partially_completed';
  services: BureaucracyService[];
  completedCount: number;
  totalCount: number;
  estimatedCompletionDate: string;
  timeline: BureaucracyEvent[];
}

export interface BureaucracyEvent {
  id: string;
  timestamp: string;
  serviceType: BureaucracyServiceType;
  event: 'submitted' | 'processing' | 'approved' | 'rejected' | 'completed';
  message: string;
  details?: Record<string, unknown>;
}

// Service configuration with Swiss-specific details
export const BUREAUCRACY_SERVICES: Record<BureaucracyServiceType, {
  name: string;
  description: string;
  estimatedDays: number;
  fee: number;
  automated: boolean;
  requiredDocs: string[];
}> = {
  municipality_registration: {
    name: 'Gemeinde Anmeldung',
    description: 'Automatische Anmeldung bei der neuen Gemeinde',
    estimatedDays: 3,
    fee: 0,
    automated: true,
    requiredDocs: ['Ausweis/Pass', 'Mietvertrag']
  },
  municipality_deregistration: {
    name: 'Gemeinde Abmeldung',
    description: 'Automatische Abmeldung bei der alten Gemeinde',
    estimatedDays: 2,
    fee: 0,
    automated: true,
    requiredDocs: ['Bestätigung neue Adresse']
  },
  post_redirect: {
    name: 'Post-Umleitung',
    description: 'Automatische Briefumleitung für 12 Monate',
    estimatedDays: 1,
    fee: 35,
    automated: true,
    requiredDocs: []
  },
  electricity_transfer: {
    name: 'Strom Übertragung',
    description: 'Kündigung alt & Anmeldung neu beim Stromanbieter',
    estimatedDays: 5,
    fee: 0,
    automated: true,
    requiredDocs: ['Zählerstand']
  },
  gas_transfer: {
    name: 'Gas Übertragung',
    description: 'Kündigung alt & Anmeldung neu beim Gasanbieter',
    estimatedDays: 5,
    fee: 0,
    automated: true,
    requiredDocs: ['Zählerstand']
  },
  internet_transfer: {
    name: 'Internet Übertragung',
    description: 'Umzug des Internetanschlusses oder Neuvertrag',
    estimatedDays: 7,
    fee: 0,
    automated: true,
    requiredDocs: []
  },
  tv_license: {
    name: 'Serafe Ummeldung',
    description: 'Adressänderung bei der Serafe (TV-Gebühren)',
    estimatedDays: 1,
    fee: 0,
    automated: true,
    requiredDocs: []
  },
  car_registration: {
    name: 'Fahrzeug Ummeldung',
    description: 'Ummeldung beim kantonalen Strassenverkehrsamt',
    estimatedDays: 10,
    fee: 50,
    automated: false,
    requiredDocs: ['Fahrzeugausweis', 'Versicherungsnachweis']
  },
  health_insurance_update: {
    name: 'Krankenkasse Update',
    description: 'Adressänderung bei der Krankenkasse',
    estimatedDays: 2,
    fee: 0,
    automated: true,
    requiredDocs: []
  },
  bank_address_update: {
    name: 'Bank Adressänderung',
    description: 'Adressänderung bei Ihrer Bank',
    estimatedDays: 3,
    fee: 0,
    automated: true,
    requiredDocs: []
  },
  employer_notification: {
    name: 'Arbeitgeber Benachrichtigung',
    description: 'Automatische Email an Ihren Arbeitgeber',
    estimatedDays: 1,
    fee: 0,
    automated: true,
    requiredDocs: []
  }
};

// Calculate total fee for selected services
export function calculateBureaucracyFee(services: BureaucracyServiceType[]): {
  serviceFees: number;
  platformFee: number;
  total: number;
} {
  const serviceFees = services.reduce((sum, type) => {
    return sum + (BUREAUCRACY_SERVICES[type]?.fee || 0);
  }, 0);
  
  // Platform fee: 49 CHF base + 5 CHF per additional service after the first 3
  const additionalServices = Math.max(0, services.length - 3);
  const platformFee = 49 + (additionalServices * 5);
  
  return {
    serviceFees,
    platformFee,
    total: serviceFees + platformFee
  };
}

// Estimate completion time
export function estimateCompletionDays(services: BureaucracyServiceType[]): number {
  if (services.length === 0) return 0;
  
  // Return the maximum estimated days (services run in parallel)
  return Math.max(...services.map(type => 
    BUREAUCRACY_SERVICES[type]?.estimatedDays || 0
  ));
}

// Get recommended services based on move type
export function getRecommendedServices(params: {
  sameCanton: boolean;
  hasVehicle: boolean;
  isRenting: boolean;
}): BureaucracyServiceType[] {
  const base: BureaucracyServiceType[] = [
    'municipality_registration',
    'municipality_deregistration',
    'post_redirect',
    'electricity_transfer',
    'tv_license',
    'health_insurance_update',
    'bank_address_update',
    'employer_notification'
  ];
  
  // Add internet for renters (usually need new contract)
  if (params.isRenting) {
    base.push('internet_transfer');
  }
  
  // Add vehicle registration for cross-canton moves
  if (params.hasVehicle && !params.sameCanton) {
    base.push('car_registration');
  }
  
  return base;
}

// Format service status for display
export function formatServiceStatus(status: BureaucracyService['status']): {
  label: string;
  color: string;
  icon: string;
} {
  switch (status) {
    case 'pending':
      return { label: 'Ausstehend', color: 'text-muted-foreground', icon: '⏳' };
    case 'processing':
      return { label: 'In Bearbeitung', color: 'text-amber-600', icon: '⚙️' };
    case 'completed':
      return { label: 'Erledigt', color: 'text-emerald-600', icon: '✅' };
    case 'failed':
      return { label: 'Fehlgeschlagen', color: 'text-destructive', icon: '❌' };
  }
}

// Generate checklist items for manual steps
export function generateManualChecklist(services: BureaucracyServiceType[]): Array<{
  service: string;
  action: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}> {
  const checklist: Array<{
    service: string;
    action: string;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
  }> = [];
  
  services.forEach(type => {
    const config = BUREAUCRACY_SERVICES[type];
    if (!config.automated) {
      checklist.push({
        service: config.name,
        action: `${config.name}: ${config.requiredDocs.join(', ')} bereithalten`,
        deadline: 'Vor dem Umzug',
        priority: 'high'
      });
    }
  });
  
  return checklist;
}

// Track affiliate revenue from utility transfers
export interface UtilityAffiliateRevenue {
  serviceType: BureaucracyServiceType;
  provider: string;
  commissionCHF: number;
  isRecurring: boolean;
}

export const AFFILIATE_COMMISSIONS: Partial<Record<BureaucracyServiceType, number>> = {
  electricity_transfer: 50,   // One-time commission
  gas_transfer: 30,           // One-time commission
  internet_transfer: 100,     // High commission for telco
  health_insurance_update: 80 // If switching provider
};

export function calculateAffiliateRevenue(
  services: BureaucracyServiceType[],
  switchedProviders: BureaucracyServiceType[]
): number {
  return switchedProviders.reduce((sum, type) => {
    if (services.includes(type)) {
      return sum + (AFFILIATE_COMMISSIONS[type] || 0);
    }
    return sum;
  }, 0);
}
