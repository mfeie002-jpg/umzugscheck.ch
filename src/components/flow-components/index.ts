/**
 * Flow Components - Unified UX Components for All Umzugsofferten Flows
 * 
 * UX Compliance Checklist (Global Standards):
 * ✅ Mobile-first + Touch: All tappable elements MIN 48x48dp
 * ✅ Form Layout: Single-column, clear labels, Required/Optional marked
 * ✅ Inline Validation: After blur, not aggressive
 * ✅ Sticky CTA: On mobile with microcopy
 * ✅ Trust Bar: At least 1 trust cluster per flow
 * ✅ Review Step Pattern: Compact summary with edit links
 * ✅ Progressive Disclosure: Optional fields collapsible
 * ✅ Performance: Loading states, skeletons, error states
 * 
 * @module flow-components
 */

// Core Layout Components
export { FlowStepShell } from './FlowStepShell';
export type { FlowStepShellProps } from './FlowStepShell';

// Trust & Credibility
export { TrustBar, TrustBarMini } from './TrustBar';
export type { TrustBarProps } from './TrustBar';

// CTA Components
export { StickyCtaBar } from './StickyCtaBar';
export type { StickyCtaBarProps } from './StickyCtaBar';

// Form Components
export { InlineField, validators } from './InlineField';
export type { InlineFieldProps } from './InlineField';

// Review & Summary
export { ReviewReceipt, createReviewItems } from './ReviewReceipt';
export type { ReviewReceiptProps, ReviewItem } from './ReviewReceipt';

// Progress Indicators
export { ProgressIndicator } from './ProgressIndicator';
export type { ProgressIndicatorProps } from './ProgressIndicator';

// Utility hooks for flow state management
export { useFlowState } from './useFlowState';
export type { FlowState, FlowActions } from './useFlowState';

// Flow Completion Feedback
export { 
  FlowCompleteFeedback, 
  loadFlowRatings, 
  getFlowAverageRating 
} from './FlowCompleteFeedback';
export type { FlowRating } from './FlowCompleteFeedback';
