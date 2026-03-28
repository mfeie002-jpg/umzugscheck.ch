/**
 * LOCAL TIPS SECTION
 * 
 * Display local moving tips in an accordion or card format
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Lightbulb, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface LocalTipsSectionProps {
  tips: string[];
  placeName: string;
  placeKind: 'canton' | 'city';
}

export const LocalTipsSection = memo(({ 
  tips, 
  placeName,
  placeKind,
}: LocalTipsSectionProps) => {
  const locationPrefix = placeKind === 'canton' ? 'im Kanton' : 'in';

  if (tips.length === 0) return null;

  return (
    <section id="tipps" className="py-16 md:py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-100 rounded-full mb-4">
            <Lightbulb className="w-7 h-7 text-yellow-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Lokale Tipps für Umzüge {locationPrefix} {placeName}
          </h2>
          <p className="text-muted-foreground">
            Insider-Wissen von unseren Experten
          </p>
        </motion.div>

        {/* Tips Grid for short lists */}
        {tips.length <= 5 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl"
              >
                <span className="w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                  {index + 1}
                </span>
                <p className="text-sm text-muted-foreground">{tip}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          // Accordion for longer lists
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="w-full space-y-2">
              {tips.map((tip, index) => (
                <AccordionItem
                  key={index}
                  value={`tip-${index}`}
                  className="bg-card border border-border rounded-xl px-4 data-[state=open]:shadow-sm transition-shadow"
                >
                  <AccordionTrigger className="text-left text-sm py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                        {index + 1}
                      </span>
                      <span className="line-clamp-1">{tip}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 pl-9">
                    {tip}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        )}
      </div>
    </section>
  );
});

LocalTipsSection.displayName = 'LocalTipsSection';
