/**
 * Phase 6: COMPLETE - Swiss Handover Protocol + After Move Care
 * 
 * Goal: Perfect finish with zero admin burden
 * 
 * Features:
 * - Digital handover checklist (damage photos, signatures)
 * - Automatic escrow release when both sides confirm
 * - Swiss Admin Autopilot:
 *   - eUmzugCH integration (eCH-0221 standard)
 *   - Swiss Post address forwarding
 *   - Serafe/Billag notification
 * - After Move Care:
 *   - Interactive neighborhood map
 *   - Local services discovery
 */

// Core handover components
export { HandoverProtocol } from '../HandoverProtocol';
export { DigitalSignaturePad } from '../DigitalSignaturePad';
export { CompleteOrchestrator } from '../CompleteOrchestrator';

// Swiss Admin Autopilot
export { SwissAdminAutopilot } from './SwissAdminAutopilot';
export type { SwissAdminAutopilotProps } from './SwissAdminAutopilot';

export { EUmzugCHIntegration } from './EUmzugCHIntegration';
export type { EUmzugCHIntegrationProps } from './EUmzugCHIntegration';

export { SwissPostReminder } from './SwissPostReminder';
export type { SwissPostReminderProps } from './SwissPostReminder';

export { SerafeNotification } from './SerafeNotification';
export type { SerafeNotificationProps } from './SerafeNotification';

// After Move Care
export { AfterMoveCareSection } from './AfterMoveCareSection';
export type { AfterMoveCareSectionProps } from './AfterMoveCareSection';
