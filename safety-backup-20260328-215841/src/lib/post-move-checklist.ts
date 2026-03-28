/**
 * Post-Move Checklist System
 * PWA-ready checklist for after-move tasks
 */

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueOffset: number; // Days after move
  estimatedMinutes: number;
  links?: { label: string; url: string }[];
  isOptional?: boolean;
}

export type ChecklistCategory = 
  | 'registration'
  | 'utilities'
  | 'insurance'
  | 'banking'
  | 'subscriptions'
  | 'home'
  | 'social';

export interface UserChecklistState {
  moveDate: Date;
  completedItems: string[];
  skippedItems: string[];
  notes: Record<string, string>;
  lastUpdated: Date;
}

export const CHECKLIST_CATEGORIES: Record<ChecklistCategory, { label: string; icon: string; color: string }> = {
  registration: { label: 'Anmeldung', icon: 'FileText', color: 'text-blue-600' },
  utilities: { label: 'Versorgung', icon: 'Zap', color: 'text-yellow-600' },
  insurance: { label: 'Versicherungen', icon: 'Shield', color: 'text-green-600' },
  banking: { label: 'Finanzen', icon: 'CreditCard', color: 'text-purple-600' },
  subscriptions: { label: 'Abos & Verträge', icon: 'RefreshCw', color: 'text-orange-600' },
  home: { label: 'Wohnung', icon: 'Home', color: 'text-teal-600' },
  social: { label: 'Soziales', icon: 'Users', color: 'text-pink-600' },
};

export const POST_MOVE_CHECKLIST: ChecklistItem[] = [
  // Registration (Priority: Immediate)
  {
    id: 'register-municipality',
    category: 'registration',
    title: 'Wohnsitz anmelden',
    description: 'Anmeldung bei der neuen Gemeinde innerhalb von 14 Tagen',
    priority: 'high',
    dueOffset: 14,
    estimatedMinutes: 30,
    links: [{ label: 'eUmzugCH', url: 'https://www.eumzug.swiss' }],
  },
  {
    id: 'deregister-old',
    category: 'registration',
    title: 'Alte Gemeinde abmelden',
    description: 'Abmeldung bei der alten Wohngemeinde',
    priority: 'high',
    dueOffset: 14,
    estimatedMinutes: 15,
  },
  {
    id: 'update-id',
    category: 'registration',
    title: 'Ausweis aktualisieren',
    description: 'ID/Pass mit neuer Adresse aktualisieren (falls nötig)',
    priority: 'medium',
    dueOffset: 30,
    estimatedMinutes: 45,
    isOptional: true,
  },
  
  // Utilities
  {
    id: 'electricity',
    category: 'utilities',
    title: 'Strom anmelden',
    description: 'Stromvertrag beim lokalen Anbieter abschliessen',
    priority: 'high',
    dueOffset: 0,
    estimatedMinutes: 15,
  },
  {
    id: 'internet',
    category: 'utilities',
    title: 'Internet & TV',
    description: 'Internet-Anschluss einrichten oder umziehen',
    priority: 'high',
    dueOffset: 7,
    estimatedMinutes: 20,
    links: [
      { label: 'Swisscom', url: 'https://www.swisscom.ch' },
      { label: 'Sunrise', url: 'https://www.sunrise.ch' },
    ],
  },
  {
    id: 'serafe',
    category: 'utilities',
    title: 'Serafe Adressänderung',
    description: 'Radio/TV-Gebühren Adresse aktualisieren',
    priority: 'medium',
    dueOffset: 30,
    estimatedMinutes: 10,
    links: [{ label: 'Serafe', url: 'https://www.serafe.ch' }],
  },
  
  // Insurance
  {
    id: 'health-insurance',
    category: 'insurance',
    title: 'Krankenkasse informieren',
    description: 'Neue Adresse und ggf. Prämienregion melden',
    priority: 'high',
    dueOffset: 30,
    estimatedMinutes: 15,
  },
  {
    id: 'household-insurance',
    category: 'insurance',
    title: 'Hausratversicherung anpassen',
    description: 'Versicherungssumme und Adresse aktualisieren',
    priority: 'medium',
    dueOffset: 14,
    estimatedMinutes: 20,
  },
  {
    id: 'liability-insurance',
    category: 'insurance',
    title: 'Privathaftpflicht aktualisieren',
    description: 'Adressänderung melden',
    priority: 'medium',
    dueOffset: 30,
    estimatedMinutes: 10,
  },
  
  // Banking
  {
    id: 'bank-address',
    category: 'banking',
    title: 'Bank Adresse ändern',
    description: 'Neue Adresse bei allen Banken hinterlegen',
    priority: 'high',
    dueOffset: 14,
    estimatedMinutes: 20,
  },
  {
    id: 'tax-office',
    category: 'banking',
    title: 'Steueramt informieren',
    description: 'Neue Adresse beim Steueramt melden',
    priority: 'medium',
    dueOffset: 30,
    estimatedMinutes: 15,
  },
  
  // Subscriptions
  {
    id: 'post-redirect',
    category: 'subscriptions',
    title: 'Post Nachsendeauftrag',
    description: 'Postweiterleitung für 6-12 Monate einrichten',
    priority: 'high',
    dueOffset: -7,
    estimatedMinutes: 10,
    links: [{ label: 'Post Umzug', url: 'https://www.post.ch/umzug' }],
  },
  {
    id: 'subscriptions',
    category: 'subscriptions',
    title: 'Zeitschriften & Abos',
    description: 'Lieferadressen für Abonnements aktualisieren',
    priority: 'low',
    dueOffset: 14,
    estimatedMinutes: 30,
  },
  {
    id: 'online-shops',
    category: 'subscriptions',
    title: 'Online-Shops aktualisieren',
    description: 'Adressen bei Amazon, Digitec, etc. ändern',
    priority: 'low',
    dueOffset: 30,
    estimatedMinutes: 20,
  },
  
  // Home
  {
    id: 'keys',
    category: 'home',
    title: 'Schlüssel übergeben/abholen',
    description: 'Alte Schlüssel abgeben, neue erhalten',
    priority: 'high',
    dueOffset: 0,
    estimatedMinutes: 30,
  },
  {
    id: 'meter-readings',
    category: 'home',
    title: 'Zählerstände dokumentieren',
    description: 'Strom, Wasser, Gas Zählerstände fotografieren',
    priority: 'high',
    dueOffset: 0,
    estimatedMinutes: 10,
  },
  {
    id: 'defects-protocol',
    category: 'home',
    title: 'Mängelprotokoll erstellen',
    description: 'Bestehende Schäden dokumentieren',
    priority: 'high',
    dueOffset: 3,
    estimatedMinutes: 45,
  },
  
  // Social
  {
    id: 'employer',
    category: 'social',
    title: 'Arbeitgeber informieren',
    description: 'HR über Adressänderung informieren',
    priority: 'high',
    dueOffset: 7,
    estimatedMinutes: 5,
  },
  {
    id: 'doctor',
    category: 'social',
    title: 'Neuen Hausarzt finden',
    description: 'Arzt in der Nähe suchen und anmelden',
    priority: 'medium',
    dueOffset: 30,
    estimatedMinutes: 30,
    isOptional: true,
  },
  {
    id: 'neighbours',
    category: 'social',
    title: 'Nachbarn kennenlernen',
    description: 'Sich bei den Nachbarn vorstellen',
    priority: 'low',
    dueOffset: 14,
    estimatedMinutes: 30,
    isOptional: true,
  },
];

/**
 * Get items by category
 */
export function getItemsByCategory(category: ChecklistCategory): ChecklistItem[] {
  return POST_MOVE_CHECKLIST.filter(item => item.category === category);
}

/**
 * Get items due by date
 */
export function getItemsDueBy(moveDate: Date, daysAfter: number): ChecklistItem[] {
  return POST_MOVE_CHECKLIST.filter(item => item.dueOffset <= daysAfter);
}

/**
 * Calculate progress
 */
export function calculateProgress(state: UserChecklistState): {
  total: number;
  completed: number;
  percentage: number;
  overdue: number;
} {
  const requiredItems = POST_MOVE_CHECKLIST.filter(i => !i.isOptional);
  const completed = requiredItems.filter(i => 
    state.completedItems.includes(i.id) || state.skippedItems.includes(i.id)
  ).length;
  
  const now = new Date();
  const daysSinceMove = Math.floor((now.getTime() - state.moveDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const overdue = requiredItems.filter(i => 
    i.dueOffset < daysSinceMove && 
    !state.completedItems.includes(i.id) && 
    !state.skippedItems.includes(i.id)
  ).length;

  return {
    total: requiredItems.length,
    completed,
    percentage: Math.round((completed / requiredItems.length) * 100),
    overdue,
  };
}

/**
 * Save state to localStorage
 */
export function saveChecklistState(state: UserChecklistState): void {
  localStorage.setItem('postMoveChecklist', JSON.stringify({
    ...state,
    moveDate: state.moveDate.toISOString(),
    lastUpdated: new Date().toISOString(),
  }));
}

/**
 * Load state from localStorage
 */
export function loadChecklistState(): UserChecklistState | null {
  const saved = localStorage.getItem('postMoveChecklist');
  if (!saved) return null;
  
  try {
    const parsed = JSON.parse(saved);
    return {
      ...parsed,
      moveDate: new Date(parsed.moveDate),
      lastUpdated: new Date(parsed.lastUpdated),
    };
  } catch {
    return null;
  }
}
