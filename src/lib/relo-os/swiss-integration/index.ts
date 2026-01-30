/**
 * Swiss Integration Module
 * 
 * Handles Swiss-specific administrative tasks:
 * - eUmzugCH (eCH-0221) commune registration
 * - Swiss Post address forwarding
 * - Serafe/Billag notification
 * - Move Readiness Checker (NEW)
 * - Parking Permit Planner (NEW)
 * 
 * @see docs/VISION_COMPLETE.md
 */

// Core integrations
export * from './eumzug-ch';
export * from './swiss-post';

// Move Readiness Checker (Phase 1 Link-Magnet)
export * from './move-readiness';

// Parking Permit Planner (Phase 1 Link-Magnet)
export * from './parking-permit';

// Serafe integration (skeleton)
export const generateSerafeNotificationLink = (): string => {
  return 'https://www.serafe.ch/de/adressaenderung/';
};

// Combined Swiss Admin Autopilot
export interface SwissAdminAutopilotState {
  eumzug: {
    status: 'pending' | 'completed' | 'skipped';
    completedAt?: Date;
  };
  swissPost: {
    status: 'pending' | 'completed' | 'skipped';
    completedAt?: Date;
    forwardingActive?: boolean;
  };
  serafe: {
    status: 'pending' | 'completed' | 'skipped';
    completedAt?: Date;
  };
  moveReadiness: {
    status: 'pending' | 'completed' | 'skipped';
    completedAt?: Date;
    readinessScore?: number;
  };
  parkingPermit: {
    status: 'pending' | 'completed' | 'skipped';
    completedAt?: Date;
    permitApplied?: boolean;
  };
}

export const getSwissAdminProgress = (state: SwissAdminAutopilotState): number => {
  const tasks = [
    state.eumzug, 
    state.swissPost, 
    state.serafe,
    state.moveReadiness,
    state.parkingPermit
  ];
  const completed = tasks.filter(t => t?.status === 'completed' || t?.status === 'skipped').length;
  return Math.round((completed / tasks.length) * 100);
};
