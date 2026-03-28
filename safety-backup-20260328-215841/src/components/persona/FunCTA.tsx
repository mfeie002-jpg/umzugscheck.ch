/**
 * FunCTA - Persona-specific call-to-action button
 */

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PersonaKey, PageKey } from '@/lib/persona-types';
import { getCTAVariant } from '@/content/persona-content-index';

interface FunCTAProps {
  persona: PersonaKey;
  page: PageKey;
  index?: number;
}

export const FunCTA = memo(function FunCTA({ persona, page, index = 0 }: FunCTAProps) {
  const variant = getCTAVariant(persona, page, index);
  const [isHovered, setIsHovered] = useState(false);

  if (!variant) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to="/vision" className="w-full sm:w-auto">
        <Button
          size="lg"
          className="w-full sm:w-auto min-h-[48px] gap-2 group"
        >
          <Rocket className="w-4 h-4" />
          {variant.label}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
      <div className="text-center sm:text-left">
        <p className="text-sm text-muted-foreground">{variant.sublabel}</p>
        {isHovered && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-primary mt-1"
          >
            {variant.hoverTease}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
});
