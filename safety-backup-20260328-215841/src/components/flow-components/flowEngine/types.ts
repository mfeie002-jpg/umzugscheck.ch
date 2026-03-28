/**
 * Flow Engine Type Definitions
 * 
 * Centralized schema for defining flows declaratively.
 * All flows can be defined as configuration objects.
 */

import { LucideIcon } from 'lucide-react';
import { z } from 'zod';

// Field Types
export type FlowFieldType = 
  | 'text' 
  | 'email' 
  | 'tel' 
  | 'number' 
  | 'plz' 
  | 'date' 
  | 'select' 
  | 'multi-select' 
  | 'card-select'
  | 'toggle'
  | 'slider'
  | 'rooms';

export interface FlowFieldOption {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  recommended?: boolean;
}

export interface FlowField {
  name: string;
  type: FlowFieldType;
  label: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  trustPill?: string; // e.g., "🔒 Wird nicht veröffentlicht"
  icon?: LucideIcon;
  inputMode?: 'text' | 'numeric' | 'email' | 'tel' | 'decimal';
  autoComplete?: string;
  validation?: z.ZodType<unknown>;
  options?: FlowFieldOption[];
  defaultValue?: unknown;
  min?: number;
  max?: number;
  step?: number;
  columns?: number; // Grid columns for card-select
  autoAdvance?: boolean; // Auto-advance on selection
}

export interface FlowStep {
  id: string;
  title: string;
  subtitle?: string;
  fields: FlowField[];
  showTrustBar?: boolean;
  showReview?: boolean; // Show review receipt on this step
  reviewEditable?: boolean; // Allow editing from review
}

export interface FlowDefinition {
  id: string;
  name: string;
  description?: string;
  steps: FlowStep[];
  
  // Success/Submit config
  successMessage?: string;
  submitButtonText?: string;
  submitEndpoint?: string;
  
  // UX Config
  showProgressBar?: boolean;
  showStepCount?: boolean;
  laborIllusion?: {
    enabled: boolean;
    duration?: number;
    messages?: string[];
  };
  
  // Tracking
  trackingPrefix?: string;
}

// Runtime state types
export interface FlowFieldState {
  value: unknown;
  touched: boolean;
  error: string | null;
  isValid: boolean;
}

export interface FlowRuntimeState {
  currentStep: number;
  fields: Record<string, FlowFieldState>;
  isSubmitting: boolean;
  submitError: string | null;
  isComplete: boolean;
  startedAt: number;
  lastUpdatedAt: number;
}

// Review Item for auto-generation
export interface ReviewItem {
  field: string;
  label: string;
  value: string;
  icon?: LucideIcon;
  editStep?: number;
}
