/**
 * Move Readiness Types
 * 
 * Types for the Swiss Move Readiness Checker system
 */

export type HouseholdType = 'single' | 'couple' | 'family' | 'shared';
export type MoveType = 'within_city' | 'within_canton' | 'cross_canton' | 'international';
export type PropertyType = 'rental' | 'owned' | 'sublet';

export interface MoveReadinessInput {
  fromPostalCode: string;
  fromCanton: string;
  toPostalCode: string;
  toCanton: string;
  moveDate: string; // ISO date
  householdType: HouseholdType;
  propertyType: PropertyType;
  needsCleaning: boolean;
  hasChildren: boolean;
  hasPets: boolean;
  hasVehicles: boolean;
  specialItems?: string[]; // piano, antiques, etc.
}

export interface TimelineItem {
  id: string;
  day: number; // relative to move day (negative = before, positive = after)
  dayLabel: string; // "T-30", "T-7", "Move Day", "T+14"
  title: string;
  description: string;
  category: TimelineCategory;
  priority: 'critical' | 'high' | 'medium' | 'low';
  isCompleted?: boolean;
  completedAt?: Date;
  externalLink?: string;
  externalLinkLabel?: string;
  estimatedDuration?: string; // "30 min", "2 Stunden"
  tips?: string[];
}

export type TimelineCategory = 
  | 'administrative' 
  | 'logistics' 
  | 'cleaning' 
  | 'utilities' 
  | 'personal'
  | 'legal'
  | 'financial';

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: TimelineCategory;
  isRequired: boolean;
  isCompleted: boolean;
  dueDay: number; // relative to move day
  linkedTimelineItemId?: string;
  subtasks?: ChecklistSubtask[];
}

export interface ChecklistSubtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface MoveReadinessResult {
  readinessScore: number; // 0-100
  timeline: TimelineItem[];
  checklist: ChecklistItem[];
  warnings: MoveWarning[];
  recommendations: string[];
  estimatedAdminHours: number;
  cantonSpecificNotes: string[];
}

export interface MoveWarning {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actionRequired?: string;
  deadline?: string;
}

export interface CantonRegulation {
  cantonCode: string;
  cantonName: string;
  eumzugSupported: boolean;
  eumzugUrl?: string;
  registrationDeadlineDays: number;
  deregistrationRequired: boolean;
  specialRules: Record<string, unknown>;
  utilityProviders: UtilityProvider[];
  localHolidays: string[];
  language: 'de' | 'fr' | 'it' | 'rm';
}

export interface UtilityProvider {
  type: 'electricity' | 'gas' | 'water' | 'internet' | 'tv';
  name: string;
  website?: string;
  phone?: string;
  leadTimeDays?: number;
}
