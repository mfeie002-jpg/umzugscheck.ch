/**
 * FunInterruptCard - Small callout cards injected between sections
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { InterruptCard } from '@/lib/persona-types';

interface FunInterruptCardProps {
  card: InterruptCard;
}

export const FunInterruptCard = memo(function FunInterruptCard({ card }: FunInterruptCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-6"
    >
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{card.emoji}</span>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-foreground">{card.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{card.body}</p>
            <p className="text-xs text-primary mt-2 italic">💡 {card.truthNugget}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});
