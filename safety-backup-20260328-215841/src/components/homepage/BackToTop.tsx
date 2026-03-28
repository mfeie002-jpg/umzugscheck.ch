import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setProgress(latest);
      setIsVisible(latest > 0.2);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 right-4 md:bottom-6 md:right-6 z-30"
        >
          <Button
            size="icon"
            className="rounded-full w-12 h-12 bg-card text-foreground border border-border shadow-medium hover:shadow-lift relative overflow-hidden"
            onClick={scrollToTop}
          >
            {/* Progress Ring */}
            <svg 
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 48 48"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={126}
                strokeDashoffset={126 - (126 * progress)}
                className="transition-all duration-100"
              />
            </svg>
            <ArrowUp className="w-5 h-5 relative z-10" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
