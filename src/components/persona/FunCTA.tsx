/**
 * FunCTA - Persona-specific call-to-action button
 */

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { CTAVariant } from '@/lib/persona-types';

interface FunCTAProps {
  variant: CTAVariant | undefined;
  onClick?: () => void;
}

export const FunCTA = memo(function FunCTA({ variant, onClick }: FunCTAProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!variant) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        size="lg"
        onClick={onClick}
        className="gap-2 group"
      >
        {variant.label}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
      <p className="text-sm text-muted-foreground mt-2">{variant.sublabel}</p>
      {isHovered && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-primary mt-1"
        >
          {variant.hoverTease}
        </motion.p>
      )}
    </motion.div>
  );
});
