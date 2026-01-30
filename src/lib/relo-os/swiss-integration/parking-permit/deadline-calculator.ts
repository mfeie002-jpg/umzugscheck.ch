/**
 * Deadline Calculator
 * 
 * Calculates permit application deadlines considering Swiss business days
 */

/**
 * Swiss public holidays (federal level)
 * Note: Cantonal holidays vary - this is a simplified version
 */
const SWISS_HOLIDAYS_2026 = [
  '2026-01-01', // Neujahr
  '2026-01-02', // Berchtoldstag (many cantons)
  '2026-04-03', // Karfreitag
  '2026-04-06', // Ostermontag
  '2026-05-14', // Auffahrt
  '2026-05-25', // Pfingstmontag
  '2026-08-01', // Bundesfeiertag
  '2026-12-25', // Weihnachten
  '2026-12-26', // Stephanstag
];

/**
 * Check if a date is a Swiss public holiday
 */
const isSwissHoliday = (date: Date): boolean => {
  const dateStr = date.toISOString().split('T')[0];
  return SWISS_HOLIDAYS_2026.includes(dateStr);
};

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/**
 * Check if a date is a business day
 */
const isBusinessDay = (date: Date): boolean => {
  return !isWeekend(date) && !isSwissHoliday(date);
};

/**
 * Subtract business days from a date
 */
export const subtractBusinessDays = (fromDate: Date, days: number): Date => {
  const result = new Date(fromDate);
  let remainingDays = days;
  
  while (remainingDays > 0) {
    result.setDate(result.getDate() - 1);
    if (isBusinessDay(result)) {
      remainingDays--;
    }
  }
  
  return result;
};

/**
 * Add business days to a date
 */
export const addBusinessDays = (fromDate: Date, days: number): Date => {
  const result = new Date(fromDate);
  let remainingDays = days;
  
  while (remainingDays > 0) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result)) {
      remainingDays--;
    }
  }
  
  return result;
};

/**
 * Calculate the deadline for submitting a parking permit application
 * 
 * @param moveDate - The planned move date
 * @param leadTimeDays - Required lead time in business days
 * @returns The deadline date for application submission
 */
export const calculatePermitDeadline = (moveDate: Date, leadTimeDays: number): Date => {
  // Need to subtract lead time + 3 days for sign placement
  const signPlacementDays = 3;
  const totalLeadTime = leadTimeDays + signPlacementDays;
  
  return subtractBusinessDays(moveDate, totalLeadTime);
};

/**
 * Get the number of days until a deadline
 */
export const getDaysUntilDeadline = (deadline: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const deadlineClean = new Date(deadline);
  deadlineClean.setHours(0, 0, 0, 0);
  
  const diffTime = deadlineClean.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if a deadline is urgent (less than 5 days away)
 */
export const isPermitUrgent = (deadline: Date): boolean => {
  return getDaysUntilDeadline(deadline) < 5;
};

/**
 * Check if a deadline has passed
 */
export const isDeadlinePassed = (deadline: Date): boolean => {
  return getDaysUntilDeadline(deadline) < 0;
};

/**
 * Format deadline for display
 */
export const formatDeadline = (deadline: Date, locale: string = 'de-CH'): string => {
  return deadline.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get recommended application date (with buffer)
 */
export const getRecommendedApplicationDate = (
  moveDate: Date, 
  leadTimeDays: number
): Date => {
  // Add 3 extra business days as buffer
  const bufferDays = 3;
  const totalDays = leadTimeDays + 3 + bufferDays; // lead + sign placement + buffer
  
  return subtractBusinessDays(moveDate, totalDays);
};

/**
 * Calculate business days between two dates
 */
export const countBusinessDays = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const current = new Date(startDate);
  
  while (current < endDate) {
    if (isBusinessDay(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};
