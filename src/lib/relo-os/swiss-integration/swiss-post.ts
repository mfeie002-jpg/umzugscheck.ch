/**
 * Swiss Post Address Change Integration
 * 
 * Handles mail forwarding (Nachsendung) automation
 * 
 * @see https://www.post.ch/de/briefe-versenden/adressaenderung
 */

export interface AddressChangeRequest {
  oldAddress: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  newAddress: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  moveDate: string; // ISO date
  forwardingDuration: '6_months' | '12_months' | '24_months';
  householdType: 'single' | 'family';
}

export interface SwissPostResponse {
  deepLink: string;
  estimatedCost: number; // CHF
  message: string;
}

/**
 * Swiss Post recommends ordering address change a few working days before moving
 */
export const getRecommendedOrderDate = (moveDate: Date): Date => {
  const orderDate = new Date(moveDate);
  // 7 days before move date (5 working days buffer)
  orderDate.setDate(orderDate.getDate() - 7);
  return orderDate;
};

/**
 * Generate deep link to Swiss Post address change form
 */
export const generateSwissPostLink = (request: AddressChangeRequest): SwissPostResponse => {
  // Swiss Post pricing (as of 2026)
  const pricing = {
    single: {
      '6_months': 35,
      '12_months': 55,
      '24_months': 95,
    },
    family: {
      '6_months': 55,
      '12_months': 85,
      '24_months': 145,
    },
  };
  
  const cost = pricing[request.householdType][request.forwardingDuration];
  
  const params = new URLSearchParams({
    plz_alt: request.oldAddress.postalCode,
    plz_neu: request.newAddress.postalCode,
    umzugsdatum: request.moveDate,
  });
  
  return {
    deepLink: `https://www.post.ch/de/briefe-versenden/adressaenderung?${params.toString()}`,
    estimatedCost: cost,
    message: `Nachsendung für ${request.forwardingDuration.replace('_', ' ')} bestellen (CHF ${cost}.-)`
  };
};

/**
 * Schedule T-7 reminder for Swiss Post address change
 */
export const scheduleSwissPostReminder = (moveDate: Date): { 
  reminderDate: Date; 
  isUrgent: boolean;
  daysUntilMove: number;
} => {
  const today = new Date();
  const reminderDate = getRecommendedOrderDate(moveDate);
  const daysUntilMove = Math.ceil((moveDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    reminderDate,
    isUrgent: daysUntilMove <= 7,
    daysUntilMove,
  };
};
