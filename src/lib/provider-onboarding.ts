/**
 * Provider Onboarding System
 * Streamlined registration flow for moving companies
 */

export interface ProviderOnboardingStep {
  id: string;
  title: string;
  description: string;
  fields: OnboardingField[];
  validation?: (data: Record<string, unknown>) => string[];
}

export interface OnboardingField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'multiselect' | 'textarea' | 'file' | 'checkbox' | 'number';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  helpText?: string;
}

export const PROVIDER_ONBOARDING_STEPS: ProviderOnboardingStep[] = [
  {
    id: 'company',
    title: 'Firmendaten',
    description: 'Grundlegende Informationen zu Ihrem Unternehmen',
    fields: [
      { name: 'companyName', label: 'Firmenname', type: 'text', required: true, placeholder: 'Muster Umzüge AG' },
      { name: 'legalForm', label: 'Rechtsform', type: 'select', required: true, options: [
        { value: 'ag', label: 'AG' },
        { value: 'gmbh', label: 'GmbH' },
        { value: 'einzelfirma', label: 'Einzelfirma' },
        { value: 'kollektiv', label: 'Kollektivgesellschaft' },
      ]},
      { name: 'foundedYear', label: 'Gründungsjahr', type: 'number', required: false, placeholder: '2010' },
      { name: 'employees', label: 'Anzahl Mitarbeiter', type: 'select', required: true, options: [
        { value: '1-5', label: '1-5' },
        { value: '6-20', label: '6-20' },
        { value: '21-50', label: '21-50' },
        { value: '50+', label: '50+' },
      ]},
      { name: 'uid', label: 'UID-Nummer', type: 'text', required: false, placeholder: 'CHE-123.456.789', helpText: 'Optional, aber empfohlen für Vertrauenswürdigkeit' },
    ],
  },
  {
    id: 'contact',
    title: 'Kontaktdaten',
    description: 'Wie können wir und Kunden Sie erreichen?',
    fields: [
      { name: 'contactName', label: 'Ansprechperson', type: 'text', required: true, placeholder: 'Max Muster' },
      { name: 'email', label: 'E-Mail', type: 'email', required: true, placeholder: 'info@muster-umzuege.ch' },
      { name: 'phone', label: 'Telefon', type: 'phone', required: true, placeholder: '+41 44 123 45 67' },
      { name: 'website', label: 'Website', type: 'text', required: false, placeholder: 'https://www.muster-umzuege.ch' },
      { name: 'address', label: 'Geschäftsadresse', type: 'text', required: true, placeholder: 'Musterstrasse 1, 8000 Zürich' },
    ],
  },
  {
    id: 'services',
    title: 'Dienstleistungen',
    description: 'Welche Services bieten Sie an?',
    fields: [
      { name: 'serviceTypes', label: 'Umzugsarten', type: 'multiselect', required: true, options: [
        { value: 'private', label: 'Privatumzüge' },
        { value: 'business', label: 'Firmenumzüge' },
        { value: 'international', label: 'Internationale Umzüge' },
        { value: 'senior', label: 'Seniorenumzüge' },
        { value: 'student', label: 'Studentenumzüge' },
      ]},
      { name: 'additionalServices', label: 'Zusatzleistungen', type: 'multiselect', required: false, options: [
        { value: 'packing', label: 'Ein- und Auspacken' },
        { value: 'furniture', label: 'Möbelmontage' },
        { value: 'cleaning', label: 'Endreinigung' },
        { value: 'disposal', label: 'Entsorgung' },
        { value: 'storage', label: 'Lagerung' },
        { value: 'piano', label: 'Klaviertransport' },
        { value: 'art', label: 'Kunsttransport' },
      ]},
      { name: 'regions', label: 'Einsatzgebiete', type: 'multiselect', required: true, options: [
        { value: 'zurich', label: 'Zürich' },
        { value: 'bern', label: 'Bern' },
        { value: 'basel', label: 'Basel' },
        { value: 'luzern', label: 'Luzern' },
        { value: 'stgallen', label: 'St. Gallen' },
        { value: 'aargau', label: 'Aargau' },
        { value: 'swiss', label: 'Ganze Schweiz' },
      ]},
      { name: 'priceLevel', label: 'Preissegment', type: 'select', required: true, options: [
        { value: 'budget', label: 'Budget (günstig)' },
        { value: 'standard', label: 'Standard (fair)' },
        { value: 'premium', label: 'Premium (hochwertig)' },
      ]},
    ],
  },
  {
    id: 'verification',
    title: 'Verifizierung',
    description: 'Dokumente für die Qualitätsprüfung',
    fields: [
      { name: 'insurance', label: 'Versicherungsnachweis', type: 'file', required: true, helpText: 'Haftpflichtversicherung (PDF)' },
      { name: 'businessLicense', label: 'Handelsregisterauszug', type: 'file', required: false, helpText: 'Optional, beschleunigt Verifizierung' },
      { name: 'certifications', label: 'Zertifizierungen', type: 'multiselect', required: false, options: [
        { value: 'iso9001', label: 'ISO 9001' },
        { value: 'fidi', label: 'FIDI-Zertifikat' },
        { value: 'vmu', label: 'VMU Mitglied' },
        { value: 'eco', label: 'Öko-Zertifikat' },
      ]},
      { name: 'acceptTerms', label: 'Ich akzeptiere die AGB und Partnerrichtlinien', type: 'checkbox', required: true },
      { name: 'acceptPrivacy', label: 'Ich akzeptiere die Datenschutzerklärung', type: 'checkbox', required: true },
    ],
  },
  {
    id: 'pricing',
    title: 'Abrechnungsmodell',
    description: 'Wählen Sie Ihr bevorzugtes Modell',
    fields: [
      { name: 'billingModel', label: 'Abrechnungsmodell', type: 'select', required: true, options: [
        { value: 'cpl', label: 'Cost-per-Lead (CHF 15-45 pro Anfrage)' },
        { value: 'subscription', label: 'Abo (CHF 299/Monat, unbegrenzt)' },
        { value: 'commission', label: 'Provision (5% vom Auftragswert)' },
      ], helpText: 'Kann später geändert werden' },
      { name: 'monthlyBudget', label: 'Monatliches Lead-Budget', type: 'select', required: false, options: [
        { value: '500', label: 'CHF 500' },
        { value: '1000', label: 'CHF 1\'000' },
        { value: '2500', label: 'CHF 2\'500' },
        { value: 'unlimited', label: 'Unbegrenzt' },
      ]},
      { name: 'sponsoredListing', label: 'Gesponserte Platzierung', type: 'checkbox', required: false, helpText: 'Top-Platzierung in Suchergebnissen (+CHF 199/Monat)' },
    ],
  },
];

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: string[];
  data: Record<string, unknown>;
  startedAt: Date;
  lastUpdated: Date;
}

export const calculateOnboardingProgress = (progress: OnboardingProgress): number => {
  const totalSteps = PROVIDER_ONBOARDING_STEPS.length;
  return Math.round((progress.completedSteps.length / totalSteps) * 100);
};

export const getNextStep = (progress: OnboardingProgress): ProviderOnboardingStep | null => {
  const currentStepIndex = progress.currentStep;
  if (currentStepIndex >= PROVIDER_ONBOARDING_STEPS.length) return null;
  return PROVIDER_ONBOARDING_STEPS[currentStepIndex];
};

export const validateStep = (stepId: string, data: Record<string, unknown>): string[] => {
  const step = PROVIDER_ONBOARDING_STEPS.find(s => s.id === stepId);
  if (!step) return ['Step nicht gefunden'];
  
  const errors: string[] = [];
  
  step.fields.forEach(field => {
    if (field.required) {
      const value = data[field.name];
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        errors.push(`${field.label} ist erforderlich`);
      }
    }
  });
  
  // Email validation
  if (data.email && typeof data.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Ungültige E-Mail-Adresse');
    }
  }
  
  // Phone validation (Swiss format)
  if (data.phone && typeof data.phone === 'string') {
    const phoneRegex = /^(\+41|0)[0-9\s]{9,14}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      errors.push('Ungültige Telefonnummer');
    }
  }
  
  return errors;
};

export const ONBOARDING_BENEFITS = [
  { icon: 'Users', title: '15\'000+ Anfragen/Jahr', description: 'Zugang zu qualifizierten Leads' },
  { icon: 'Star', title: 'Bewertungssystem', description: 'Bauen Sie Ihre Reputation auf' },
  { icon: 'Shield', title: 'Verifiziertes Profil', description: 'Vertrauenswürdigkeit steigern' },
  { icon: 'TrendingUp', title: 'Analytics Dashboard', description: 'Performance in Echtzeit' },
  { icon: 'Headphones', title: 'Partner-Support', description: 'Dedizierter Ansprechpartner' },
  { icon: 'Zap', title: 'Schnelle Integration', description: 'In 24h online' },
];
