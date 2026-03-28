/**
 * Shared Components for Calculator Variants
 * 
 * All flows should use these components for consistent UX:
 * - ProgressHeader: Sticky header with step indicator
 * - TrustBar: Trust signals (Unverbindlich, Geprüfte Firmen, Datenschutz)
 * - StickyFooterCTA: Fixed bottom CTA with primary/secondary buttons
 * - FormField: Consistent input field with icon support
 * 
 * Enhanced V1f/V1g Components:
 * - StepTrustPills: Context-aware trust signals per step
 * - WhyThis: Collapsible "Why we ask this" for transparency
 * - EnhancedStickyCTA: CTA with micro-feedback + summary
 * - EnhancedFormField: Inline validation on blur
 */

export { ProgressHeader } from './ProgressHeader';
export { TrustBar } from './TrustBar';
export { StickyFooterCTA } from './StickyFooterCTA';
export { FormField } from './FormField';
export { SuccessState } from './SuccessState';

// Enhanced components for V1f/V1g
export { StepTrustPills } from './StepTrustPills';
export { WhyThis } from './WhyThis';
export { EnhancedStickyCTA } from './EnhancedStickyCTA';
export { EnhancedFormField } from './EnhancedFormField';

// Capture automation
export { CaptureSentinel } from './CaptureSentinel';
