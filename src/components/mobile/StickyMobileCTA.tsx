import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface StickyMobileCTAProps {
  show: boolean;
  onClick: () => void;
  text?: string;
}

/**
 * Sticky CTA Button for Mobile
 * Appears above the bottom nav when user scrolls past hero
 * Follows mobile UX best practice: persistent, accessible CTA
 */
export const StickyMobileCTA = memo(function StickyMobileCTA({
  show,
  onClick,
  text = "Kostenlos Offerten erhalten"
}: StickyMobileCTAProps) {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-[68px] left-4 right-4 z-40"
        >
          <Button
            size="lg"
            onClick={onClick}
            className="w-full h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-cta font-bold text-base rounded-xl active:scale-[0.98] transition-transform"
          >
            {text}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
