/**
 * Capacity Radar System
 * Real-time availability tracking and urgency signals for providers
 */

export interface ProviderCapacity {
  providerId: string;
  currentJobs: number;
  maxCapacity: number;
  availableSlots: number;
  nextAvailableDate: Date;
  weeklyAvailability: WeeklySlot[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: Date;
}

export interface WeeklySlot {
  date: Date;
  dayOfWeek: string;
  availableSlots: number;
  bookedSlots: number;
  isFullyBooked: boolean;
}

export interface CapacityAlert {
  type: 'high_demand' | 'limited_availability' | 'last_slots' | 'fully_booked';
  message: string;
  urgencyScore: number; // 0-100
  expiresAt: Date;
}

/**
 * Calculate urgency level based on capacity metrics
 */
export function calculateUrgencyLevel(
  availableSlots: number,
  maxCapacity: number,
  daysUntilMove: number
): 'low' | 'medium' | 'high' | 'critical' {
  const utilizationRate = 1 - (availableSlots / maxCapacity);
  
  // Critical: Very high utilization + soon move date
  if (utilizationRate >= 0.9 && daysUntilMove <= 7) {
    return 'critical';
  }
  
  // High: High utilization or urgent timeline
  if (utilizationRate >= 0.75 || daysUntilMove <= 14) {
    return 'high';
  }
  
  // Medium: Moderate utilization
  if (utilizationRate >= 0.5 || daysUntilMove <= 30) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Generate urgency alert based on capacity
 */
export function generateCapacityAlert(
  capacity: ProviderCapacity,
  moveDate: Date
): CapacityAlert | null {
  const daysUntilMove = Math.ceil(
    (moveDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  
  const utilizationRate = 1 - (capacity.availableSlots / capacity.maxCapacity);
  
  // Fully booked for the period
  if (capacity.availableSlots === 0) {
    return {
      type: 'fully_booked',
      message: 'Ausgebucht für diesen Zeitraum',
      urgencyScore: 100,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }
  
  // Last slots available
  if (capacity.availableSlots <= 2) {
    return {
      type: 'last_slots',
      message: `Nur noch ${capacity.availableSlots} Plätze frei!`,
      urgencyScore: 85,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    };
  }
  
  // Limited availability
  if (utilizationRate >= 0.7) {
    return {
      type: 'limited_availability',
      message: 'Begrenzte Verfügbarkeit',
      urgencyScore: 65,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }
  
  // High demand period (e.g., end of month)
  const dayOfMonth = moveDate.getDate();
  if (dayOfMonth >= 25 || dayOfMonth <= 5) {
    return {
      type: 'high_demand',
      message: 'Hohe Nachfrage – schnell buchen!',
      urgencyScore: 50,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    };
  }
  
  return null;
}

/**
 * Generate weekly availability slots for a provider
 */
export function generateWeeklyAvailability(
  startDate: Date,
  baseCapacity: number = 3,
  bookedPercentage: number = 0.6
): WeeklySlot[] {
  const slots: WeeklySlot[] = [];
  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const dayOfWeek = date.getDay();
    
    // No availability on Sundays
    if (dayOfWeek === 0) {
      slots.push({
        date,
        dayOfWeek: dayNames[dayOfWeek],
        availableSlots: 0,
        bookedSlots: 0,
        isFullyBooked: true,
      });
      continue;
    }
    
    // Reduced capacity on Saturdays
    const dayCapacity = dayOfWeek === 6 ? Math.ceil(baseCapacity * 0.5) : baseCapacity;
    
    // Simulate booking patterns (end of month busier)
    const dayOfMonth = date.getDate();
    let adjustedBookedPct = bookedPercentage;
    if (dayOfMonth >= 25 || dayOfMonth <= 5) {
      adjustedBookedPct = Math.min(0.95, bookedPercentage + 0.25);
    }
    
    const bookedSlots = Math.floor(dayCapacity * adjustedBookedPct);
    const availableSlots = dayCapacity - bookedSlots;
    
    slots.push({
      date,
      dayOfWeek: dayNames[dayOfWeek],
      availableSlots,
      bookedSlots,
      isFullyBooked: availableSlots === 0,
    });
  }
  
  return slots;
}

/**
 * Calculate capacity score for ranking purposes
 */
export function calculateCapacityScore(
  capacity: ProviderCapacity,
  moveDate: Date
): number {
  const daysUntilMove = Math.ceil(
    (moveDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  
  // Base score from availability
  let score = (capacity.availableSlots / capacity.maxCapacity) * 50;
  
  // Bonus for quick availability
  if (capacity.nextAvailableDate <= moveDate) {
    score += 25;
  }
  
  // Urgency bonus (providers with limited slots might be more desirable)
  if (capacity.urgencyLevel === 'high') {
    score += 15;
  } else if (capacity.urgencyLevel === 'medium') {
    score += 10;
  }
  
  // Penalty for fully booked periods
  const bookedDays = capacity.weeklyAvailability.filter(s => s.isFullyBooked).length;
  score -= bookedDays * 2;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Get urgency color based on level
 */
export function getUrgencyColor(level: 'low' | 'medium' | 'high' | 'critical'): string {
  switch (level) {
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
  }
}

/**
 * Get urgency badge variant
 */
export function getUrgencyBadgeVariant(level: 'low' | 'medium' | 'high' | 'critical'): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (level) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
  }
}
