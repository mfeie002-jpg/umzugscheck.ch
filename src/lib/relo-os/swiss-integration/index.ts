/**
 * Swiss Integration Module
 * 
 * Handles Swiss-specific administrative tasks:
 * - eUmzugCH (eCH-0221) commune registration
 * - Swiss Post address forwarding
 * - Serafe/Billag notification
 */

export * from './eumzug-ch';
export * from './swiss-post';

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
}

export const getSwissAdminProgress = (state: SwissAdminAutopilotState): number => {
  const tasks = [state.eumzug, state.swissPost, state.serafe];
  const completed = tasks.filter(t => t.status === 'completed' || t.status === 'skipped').length;
  return Math.round((completed / tasks.length) * 100);
};
