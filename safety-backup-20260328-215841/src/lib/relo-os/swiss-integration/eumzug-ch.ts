/**
 * eUmzugCH Integration
 * 
 * Swiss eCH-0221 standard for electronic move notifications
 * Enables digital registration/deregistration with participating communes.
 * 
 * @see https://www.eumzug.swiss
 */

export interface PersonData {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date
  nationality: string; // ISO 3166-1 alpha-2
  ahvNumber?: string; // Swiss social security number
}

export interface Address {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  canton: string;
}

export interface EUmzugRequest {
  personData: PersonData;
  oldAddress: Address;
  newAddress: Address;
  moveDate: string; // ISO date
  householdMembers?: PersonData[];
}

export interface EUmzugResponse {
  supported: boolean;
  deepLink?: string;
  fallbackUrl?: string;
  message: string;
}

/**
 * Check if commune supports eUmzugCH
 * Not all Swiss communes participate in the electronic system
 */
export const checkEUmzugSupport = async (postalCode: string): Promise<boolean> => {
  // TODO: Implement API check against eUmzugCH registry
  // For now, return true for major cities
  const supportedPrefixes = ['80', '30', '40', '10', '60', '90']; // ZH, BE, BS, GE, LU, SG
  return supportedPrefixes.some(prefix => postalCode.startsWith(prefix));
};

/**
 * Generate deep link to eUmzugCH portal for the specific commune
 */
export const initiateEUmzug = async (request: EUmzugRequest): Promise<EUmzugResponse> => {
  const isSupported = await checkEUmzugSupport(request.newAddress.postalCode);
  
  if (!isSupported) {
    return {
      supported: false,
      fallbackUrl: 'https://www.ch.ch/de/umzug-melden/',
      message: 'Diese Gemeinde unterstützt eUmzug noch nicht. Bitte melden Sie sich direkt bei der Einwohnerkontrolle.'
    };
  }
  
  // Generate deep link with pre-filled data
  const params = new URLSearchParams({
    plz_neu: request.newAddress.postalCode,
    ort_neu: request.newAddress.city,
    umzugsdatum: request.moveDate,
  });
  
  return {
    supported: true,
    deepLink: `https://www.eumzug.swiss/eumzug/?${params.toString()}`,
    message: 'Klicken Sie hier, um Ihre Ummeldung digital zu erledigen.'
  };
};

/**
 * Get reminder date for commune registration
 * Swiss law requires registration within 14 days of moving
 */
export const getRegistrationDeadline = (moveDate: Date): Date => {
  const deadline = new Date(moveDate);
  deadline.setDate(deadline.getDate() + 14);
  return deadline;
};
