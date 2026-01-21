/**
 * Persona System Types
 * Supports BG0-BG3 Bulgarian personas + IT Italian fun mode
 */

export type PageKey = 'vision' | 'family' | 'investoren';
export type PersonaKey = 'bg0' | 'bg1' | 'bg2' | 'bg3' | 'it';
export type VisionLanguage = 'de' | 'bg' | 'it';

export interface SectionOpener {
  id: string;
  sectionId: string;
  text: string;
  emoji?: string;
}

export interface MicroTooltip {
  id: string;
  targetId: string;
  text: string;
}

export interface CTAVariant {
  id: string;
  label: string;
  sublabel: string;
  hoverTease: string;
}

export interface InterruptCard {
  id: string;
  title: string;
  body: string;
  emoji: string;
  truthNugget: string;
  afterSection: string;
}

export interface VisualPrompt {
  id: string;
  imagePrompt: string;
  styleNotes: string;
  altText: string;
  whereToUse: string;
}

export interface NarratorLine {
  id: string;
  text: string;
  triggerSection?: string;
}

export interface PersonaContentPack {
  sectionOpeners: SectionOpener[];
  microTooltips: MicroTooltip[];
  ctaVariants: CTAVariant[];
  interruptCards: InterruptCard[];
  visualPrompts: VisualPrompt[];
  narratorLines: NarratorLine[];
}

export interface PersonaInfo {
  key: PersonaKey;
  name: string;
  emoji: string;
  description: string;
  themes: string[];
}

export const PERSONA_INFO: Record<PersonaKey, PersonaInfo> = {
  bg0: {
    key: 'bg0',
    name: 'Неутрален',
    emoji: '🇧🇬',
    description: 'Стандартен професионален тон',
    themes: ['professional', 'neutral']
  },
  bg1: {
    key: 'bg1',
    name: 'Димитър',
    emoji: '🥊',
    description: 'Боксьор, детектив, 50г.',
    themes: ['boxing', 'paranoia', 'security', 'pasta', 'lotto']
  },
  bg2: {
    key: 'bg2',
    name: 'Fudely',
    emoji: '💅',
    description: 'Готвачка, танцьорка, 31г.',
    themes: ['shopping', 'cooking', 'dancing', 'rabbits', 'mercedes']
  },
  bg3: {
    key: 'bg3',
    name: 'Мартин',
    emoji: '🎰',
    description: 'Майстор, баща, e-bike фен',
    themes: ['gambling', 'repair', 'ebike', 'beer', 'dinosaurs']
  },
  it: {
    key: 'it',
    name: 'Morris',
    emoji: '🇮🇹',
    description: 'Campeggio, mamma, 51 anni',
    themes: ['camping', 'cycling', 'cocacola', 'italy', 'kiosk']
  }
};
