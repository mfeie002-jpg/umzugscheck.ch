/**
 * Address Change Types
 * 
 * Institution notification and address change management
 */

export interface Institution {
  id: string;
  name: string;
  category: InstitutionCategory;
  priority: 'critical' | 'important' | 'optional';
  icon: string;
  website?: string;
  notes?: string;
  emailTemplate?: string;
}

export type InstitutionCategory = 
  | 'government'      // Gemeinde, Kanton
  | 'finance'         // Banken, Steuern
  | 'insurance'       // Krankenkasse, Versicherungen
  | 'utilities'       // Strom, Internet, TV
  | 'subscriptions'   // SBB, Zeitungen, Streaming
  | 'personal'        // Arbeitgeber, Vereine, Freunde
  | 'postal';         // Post, Pakete

export interface AddressChangeTask {
  institution: Institution;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: Date;
  notes?: string;
}

export interface AddressChangeProgress {
  tasks: AddressChangeTask[];
  completedCount: number;
  totalCount: number;
  percentComplete: number;
}

export interface EmailTemplate {
  subject: string;
  body: string;
  recipientPlaceholder?: string;
}
