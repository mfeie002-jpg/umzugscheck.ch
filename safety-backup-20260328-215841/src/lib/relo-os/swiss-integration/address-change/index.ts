/**
 * Address Change Module
 * 
 * Manages institution notifications for address changes
 */

export * from './types';
export * from './institutions';
export * from './email-templates';

import { AddressChangeTask, AddressChangeProgress } from './types';
import { SWISS_INSTITUTIONS, getCriticalInstitutions } from './institutions';

/**
 * Create initial address change task list
 */
export const createAddressChangeTasks = (
  includeOptional: boolean = true
): AddressChangeTask[] => {
  const institutions = includeOptional 
    ? SWISS_INSTITUTIONS 
    : SWISS_INSTITUTIONS.filter(i => i.priority !== 'optional');
  
  return institutions.map(institution => ({
    institution,
    status: 'pending',
  }));
};

/**
 * Calculate progress from tasks
 */
export const calculateProgress = (tasks: AddressChangeTask[]): AddressChangeProgress => {
  const completedCount = tasks.filter(t => 
    t.status === 'completed' || t.status === 'skipped'
  ).length;
  
  return {
    tasks,
    completedCount,
    totalCount: tasks.length,
    percentComplete: Math.round((completedCount / tasks.length) * 100),
  };
};

/**
 * Get recommended order for address changes
 * Critical items first, then by category
 */
export const getRecommendedOrder = (): string[] => {
  const critical = getCriticalInstitutions().map(i => i.id);
  const others = SWISS_INSTITUTIONS
    .filter(i => i.priority !== 'critical')
    .map(i => i.id);
  
  return [...critical, ...others];
};

/**
 * Estimate time to complete all address changes
 */
export const estimateCompletionTime = (tasks: AddressChangeTask[]): string => {
  const pendingCritical = tasks.filter(
    t => t.status === 'pending' && t.institution.priority === 'critical'
  ).length;
  
  const pendingOther = tasks.filter(
    t => t.status === 'pending' && t.institution.priority !== 'critical'
  ).length;
  
  // Estimate 15 min per critical, 5 min per other
  const totalMinutes = (pendingCritical * 15) + (pendingOther * 5);
  
  if (totalMinutes < 60) {
    return `ca. ${totalMinutes} Minuten`;
  }
  
  const hours = Math.round(totalMinutes / 60 * 10) / 10;
  return `ca. ${hours} Stunden`;
};
