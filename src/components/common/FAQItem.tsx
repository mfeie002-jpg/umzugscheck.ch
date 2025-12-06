import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

export const FAQItem = memo(({
  question,
  answer,
  defaultOpen = false,
  className
}: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-b border-border last:border-0", className)}>
      <Button
        variant="ghost"
        className="w-full justify-between py-4 px-0 h-auto text-left font-semibold text-foreground hover:bg-transparent hover:text-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-sm sm:text-base">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-2",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </Button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

FAQItem.displayName = 'FAQItem';
