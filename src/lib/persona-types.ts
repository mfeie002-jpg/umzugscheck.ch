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
  vipTitle: string;
  vipBadge: string;
}

export const PERSONA_INFO: Record<PersonaKey, PersonaInfo> = {
  bg0: {
    key: 'bg0',
    name: 'Неутрален',
    emoji: '🇧🇬',
    description: 'Стандартен изглед',
    themes: ['professional', 'neutral'],
    vipTitle: 'VIP Гост',
    vipBadge: '⭐ Първи Гледащ'
  },
  bg1: {
    key: 'bg1',
    name: 'Димитър',
    emoji: '🥊',
    description: 'Боксьор & Охрана',
    themes: ['boxing', 'paranoia', 'security', 'pasta', 'lotto'],
    vipTitle: 'Шампион VIP',
    vipBadge: '🏆 Защитник #1'
  },
  bg2: {
    key: 'bg2',
    name: 'Fudely',
    emoji: '💃',
    description: 'Шопинг & Танци',
    themes: ['shopping', 'cooking', 'dancing', 'rabbits', 'mercedes'],
    vipTitle: 'Кралица VIP',
    vipBadge: '👑 Стил Икона'
  },
  bg3: {
    key: 'bg3',
    name: 'Мартин',
    emoji: '🎰',
    description: 'Майстор & E-Bike',
    themes: ['gambling', 'repair', 'ebike', 'beer', 'dinosaurs'],
    vipTitle: 'Джакпот VIP',
    vipBadge: '🌟 Късметлия #1'
  },
  it: {
    key: 'it',
    name: 'Morris',
    emoji: '🇮🇹',
    description: 'Italiano Fun',
    themes: ['camping', 'cycling', 'cocacola', 'italy', 'kiosk'],
    vipTitle: 'VIP Italiano',
    vipBadge: '⭐ Prima Vista'
  }
};
