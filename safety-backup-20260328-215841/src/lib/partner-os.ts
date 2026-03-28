/**
 * Partner Operating System (Partner OS)
 * SaaS platform for moving companies - creates vendor lock-in
 * Key Moat Feature: Dispatch, CRM, Analytics, and Lead Management
 */

export interface PartnerSubscription {
  id: string;
  providerId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'trial' | 'cancelled' | 'past_due';
  startedAt: string;
  currentPeriodEnd: string;
  monthlyPriceCHF: number;
  features: PartnerFeature[];
}

export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';

export type PartnerFeature = 
  | 'lead_management'
  | 'dispatch_calendar'
  | 'crew_management'
  | 'vehicle_tracking'
  | 'customer_crm'
  | 'invoicing'
  | 'analytics_basic'
  | 'analytics_advanced'
  | 'api_access'
  | 'white_label'
  | 'priority_leads'
  | 'dedicated_support';

export interface DispatchJob {
  id: string;
  leadId: string;
  status: JobStatus;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number; // hours
  crew: CrewMember[];
  vehicles: Vehicle[];
  fromAddress: Address;
  toAddress: Address;
  customerName: string;
  customerPhone: string;
  notes: string;
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export type JobStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'in_transit_to_pickup'
  | 'loading'
  | 'in_transit_to_delivery'
  | 'unloading'
  | 'completed'
  | 'cancelled';

export interface CrewMember {
  id: string;
  name: string;
  role: 'driver' | 'helper' | 'supervisor';
  phone: string;
  available: boolean;
  currentJobId?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'van' | 'truck_small' | 'truck_large' | 'trailer';
  licensePlate: string;
  capacityM3: number;
  available: boolean;
  currentJobId?: string;
}

export interface Address {
  street: string;
  postalCode: string;
  city: string;
  floor?: number;
  hasElevator?: boolean;
  parkingDistance?: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
}

export interface PartnerAnalytics {
  periodStart: string;
  periodEnd: string;
  metrics: {
    totalJobs: number;
    completedJobs: number;
    cancelledJobs: number;
    totalRevenue: number;
    avgJobValue: number;
    avgRating: number;
    reviewCount: number;
    leadConversionRate: number;
    avgResponseTimeHours: number;
    crewUtilization: number;
    vehicleUtilization: number;
  };
  trends: {
    revenueChange: number;
    jobsChange: number;
    ratingChange: number;
  };
}

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, {
  name: string;
  monthlyPriceCHF: number;
  features: PartnerFeature[];
  description: string;
  highlights: string[];
}> = {
  starter: {
    name: 'Starter',
    monthlyPriceCHF: 49,
    features: ['lead_management', 'dispatch_calendar', 'analytics_basic'],
    description: 'Perfekt für kleine Umzugsfirmen',
    highlights: [
      'Bis zu 20 Leads/Monat',
      'Einfacher Kalender',
      'Basis-Statistiken'
    ]
  },
  professional: {
    name: 'Professional',
    monthlyPriceCHF: 99,
    features: [
      'lead_management', 
      'dispatch_calendar', 
      'crew_management',
      'vehicle_tracking',
      'customer_crm',
      'analytics_basic',
      'analytics_advanced',
      'priority_leads'
    ],
    description: 'Für wachsende Unternehmen',
    highlights: [
      'Unbegrenzte Leads',
      'Team & Fahrzeug-Management',
      'Kunden-CRM',
      'Erweiterte Analytics',
      'Prioritäts-Leads'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPriceCHF: 249,
    features: [
      'lead_management', 
      'dispatch_calendar', 
      'crew_management',
      'vehicle_tracking',
      'customer_crm',
      'invoicing',
      'analytics_basic',
      'analytics_advanced',
      'api_access',
      'white_label',
      'priority_leads',
      'dedicated_support'
    ],
    description: 'Für Marktführer',
    highlights: [
      'Alles in Professional',
      'Rechnungsstellung',
      'API-Zugang',
      'White-Label Option',
      'Persönlicher Support',
      'Custom Integrationen'
    ]
  }
};

// Default job checklist
export const DEFAULT_JOB_CHECKLIST: Omit<ChecklistItem, 'id' | 'completed'>[] = [
  { label: 'Kunde telefonisch bestätigt' },
  { label: 'Fahrzeug gecheckt & getankt' },
  { label: 'Umzugsmaterial geladen' },
  { label: 'Inventarliste geprüft' },
  { label: 'Foto-Dokumentation Start' },
  { label: 'Alle Räume geräumt' },
  { label: 'Foto-Dokumentation Ende' },
  { label: 'Übergabeprotokoll unterschrieben' },
  { label: 'Zahlung erhalten/bestätigt' }
];

// Job status configuration
export const JOB_STATUS_CONFIG: Record<JobStatus, {
  label: string;
  color: string;
  icon: string;
  nextStatuses: JobStatus[];
}> = {
  scheduled: {
    label: 'Geplant',
    color: 'bg-muted text-muted-foreground',
    icon: '📅',
    nextStatuses: ['confirmed', 'cancelled']
  },
  confirmed: {
    label: 'Bestätigt',
    color: 'bg-primary/10 text-primary',
    icon: '✅',
    nextStatuses: ['in_transit_to_pickup', 'cancelled']
  },
  in_transit_to_pickup: {
    label: 'Unterwegs zur Abholung',
    color: 'bg-amber-100 text-amber-700',
    icon: '🚚',
    nextStatuses: ['loading']
  },
  loading: {
    label: 'Wird geladen',
    color: 'bg-amber-100 text-amber-700',
    icon: '📦',
    nextStatuses: ['in_transit_to_delivery']
  },
  in_transit_to_delivery: {
    label: 'Unterwegs zur Lieferung',
    color: 'bg-blue-100 text-blue-700',
    icon: '🚛',
    nextStatuses: ['unloading']
  },
  unloading: {
    label: 'Wird entladen',
    color: 'bg-blue-100 text-blue-700',
    icon: '📤',
    nextStatuses: ['completed']
  },
  completed: {
    label: 'Abgeschlossen',
    color: 'bg-emerald-100 text-emerald-700',
    icon: '🎉',
    nextStatuses: []
  },
  cancelled: {
    label: 'Storniert',
    color: 'bg-destructive/10 text-destructive',
    icon: '❌',
    nextStatuses: []
  }
};

// Calculate subscription value
export function calculateSubscriptionValue(plan: SubscriptionPlan): {
  monthly: number;
  annual: number;
  savings: number;
} {
  const config = SUBSCRIPTION_PLANS[plan];
  const monthly = config.monthlyPriceCHF;
  const annual = monthly * 10; // 2 months free
  const savings = monthly * 12 - annual;
  
  return { monthly, annual, savings };
}

// Check if feature is available for plan
export function hasFeature(plan: SubscriptionPlan, feature: PartnerFeature): boolean {
  return SUBSCRIPTION_PLANS[plan].features.includes(feature);
}

// Calculate crew utilization
export function calculateCrewUtilization(
  crew: CrewMember[],
  jobs: DispatchJob[],
  periodDays: number
): number {
  const totalAvailableHours = crew.length * 8 * periodDays; // 8h workday
  const totalWorkedHours = jobs
    .filter(j => j.status === 'completed')
    .reduce((sum, j) => sum + (j.estimatedDuration * j.crew.length), 0);
  
  return Math.min(100, Math.round((totalWorkedHours / totalAvailableHours) * 100));
}

// Calculate vehicle utilization
export function calculateVehicleUtilization(
  vehicles: Vehicle[],
  jobs: DispatchJob[],
  periodDays: number
): number {
  const totalAvailableHours = vehicles.length * 10 * periodDays; // 10h availability
  const totalUsedHours = jobs
    .filter(j => j.status === 'completed')
    .reduce((sum, j) => sum + (j.estimatedDuration * j.vehicles.length), 0);
  
  return Math.min(100, Math.round((totalUsedHours / totalAvailableHours) * 100));
}

// Generate job timeline
export function generateJobTimeline(job: DispatchJob): Array<{
  time: string;
  event: string;
  status: JobStatus;
}> {
  const baseTime = new Date(`${job.scheduledDate}T${job.scheduledTime}`);
  
  return [
    { time: job.scheduledTime, event: 'Start', status: 'confirmed' },
    { 
      time: new Date(baseTime.getTime() + 30 * 60000).toTimeString().slice(0, 5), 
      event: 'Ankunft beim Kunden', 
      status: 'in_transit_to_pickup' 
    },
    { 
      time: new Date(baseTime.getTime() + 45 * 60000).toTimeString().slice(0, 5), 
      event: 'Laden beginnt', 
      status: 'loading' 
    },
    { 
      time: new Date(baseTime.getTime() + (job.estimatedDuration / 2) * 3600000).toTimeString().slice(0, 5), 
      event: 'Transport', 
      status: 'in_transit_to_delivery' 
    },
    { 
      time: new Date(baseTime.getTime() + (job.estimatedDuration * 0.75) * 3600000).toTimeString().slice(0, 5), 
      event: 'Entladen beginnt', 
      status: 'unloading' 
    },
    { 
      time: new Date(baseTime.getTime() + job.estimatedDuration * 3600000).toTimeString().slice(0, 5), 
      event: 'Abschluss', 
      status: 'completed' 
    }
  ];
}

// Format job duration
export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} Min`;
  if (hours === 1) return '1 Stunde';
  return `${hours} Stunden`;
}

// Get available crew for date
export function getAvailableCrew(
  allCrew: CrewMember[],
  jobs: DispatchJob[],
  date: string
): CrewMember[] {
  const assignedCrewIds = jobs
    .filter(j => j.scheduledDate === date && j.status !== 'cancelled' && j.status !== 'completed')
    .flatMap(j => j.crew.map(c => c.id));
  
  return allCrew.filter(c => c.available && !assignedCrewIds.includes(c.id));
}

// Get available vehicles for date
export function getAvailableVehicles(
  allVehicles: Vehicle[],
  jobs: DispatchJob[],
  date: string
): Vehicle[] {
  const assignedVehicleIds = jobs
    .filter(j => j.scheduledDate === date && j.status !== 'cancelled' && j.status !== 'completed')
    .flatMap(j => j.vehicles.map(v => v.id));
  
  return allVehicles.filter(v => v.available && !assignedVehicleIds.includes(v.id));
}
