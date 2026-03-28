/**
 * Persona Content Index - Central export for all persona content packs
 */

import type { PageKey, PersonaKey, PersonaContentPack } from '@/lib/persona-types';

// BG0 - Neutral Bulgarian
import { 
  bg0VisionContent, 
  bg0FamilyContent, 
  bg0InvestorenContent 
} from './persona-content-bg0';

// BG1 - Dimitar (Boxing/Detective)
import { 
  bg1VisionContent, 
  bg1FamilyContent, 
  bg1InvestorenContent 
} from './persona-content-bg1';

// BG2 - Fudely (Shopping/Cooking/Dancing)
import { 
  bg2VisionContent, 
  bg2FamilyContent, 
  bg2InvestorenContent 
} from './persona-content-bg2';

// BG3 - Martin (Gambling/Repair/E-bike)
import { 
  bg3VisionContent, 
  bg3FamilyContent, 
  bg3InvestorenContent 
} from './persona-content-bg3';

// IT - Morris (Italian Fun)
import { 
  itVisionContent, 
  itFamilyContent, 
  itInvestorenContent 
} from './persona-content-it';

// Content registry
const contentRegistry: Record<PersonaKey, Record<PageKey, PersonaContentPack>> = {
  bg0: {
    vision: bg0VisionContent,
    family: bg0FamilyContent,
    investoren: bg0InvestorenContent,
  },
  bg1: {
    vision: bg1VisionContent,
    family: bg1FamilyContent,
    investoren: bg1InvestorenContent,
  },
  bg2: {
    vision: bg2VisionContent,
    family: bg2FamilyContent,
    investoren: bg2InvestorenContent,
  },
  bg3: {
    vision: bg3VisionContent,
    family: bg3FamilyContent,
    investoren: bg3InvestorenContent,
  },
  it: {
    vision: itVisionContent,
    family: itFamilyContent,
    investoren: itInvestorenContent,
  },
};

/**
 * Get the content pack for a specific persona and page
 */
export function getPersonaContent(persona: PersonaKey, page: PageKey): PersonaContentPack {
  return contentRegistry[persona]?.[page] || contentRegistry.bg0[page];
}

/**
 * Get a specific section opener by section ID
 */
export function getSectionOpener(persona: PersonaKey, page: PageKey, sectionId: string) {
  const content = getPersonaContent(persona, page);
  return content.sectionOpeners.find(o => o.sectionId === sectionId);
}

/**
 * Get a specific CTA variant by index
 */
export function getCTAVariant(persona: PersonaKey, page: PageKey, index: number = 0) {
  const content = getPersonaContent(persona, page);
  return content.ctaVariants[index % content.ctaVariants.length];
}

/**
 * Get interrupt cards for injection after specific sections
 */
export function getInterruptCard(persona: PersonaKey, page: PageKey, afterSection: string) {
  const content = getPersonaContent(persona, page);
  return content.interruptCards.find(c => c.afterSection === afterSection);
}

/**
 * Get all narrator lines for a persona/page
 */
export function getNarratorLines(persona: PersonaKey, page: PageKey) {
  const content = getPersonaContent(persona, page);
  return content.narratorLines;
}

// Re-export types
export type { PersonaContentPack, PageKey, PersonaKey };
