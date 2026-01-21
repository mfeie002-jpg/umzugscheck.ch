/**
 * FunSectionIntro - Section opener with persona-specific intro text
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { SectionOpener } from '@/lib/persona-types';

interface FunSectionIntroProps {
  opener: SectionOpener | undefined;
}

export const FunSectionIntro = memo(function FunSectionIntro({ opener }: FunSectionIntroProps) {
  if (!opener) return null;

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-sm text-primary font-medium mb-2"
    >
      {opener.emoji && <span className="mr-1">{opener.emoji}</span>}
      {opener.text}
    </motion.p>
  );
});
