/**
 * FunSectionIntro - Section opener with persona-specific intro text
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { PersonaKey, PageKey } from '@/lib/persona-types';
import { getSectionOpener } from '@/content/persona-content-index';

interface FunSectionIntroProps {
  persona: PersonaKey;
  page: PageKey;
  sectionId: string;
}

export const FunSectionIntro = memo(function FunSectionIntro({ persona, page, sectionId }: FunSectionIntroProps) {
  const opener = getSectionOpener(persona, page, sectionId);
  
  if (!opener) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-2"
    >
      <p className="text-sm text-primary font-medium text-center">
        {opener.emoji && <span className="mr-1">{opener.emoji}</span>}
        {opener.text}
      </p>
    </motion.div>
  );
});
