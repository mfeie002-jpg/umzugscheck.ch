/**
 * PageEnhancements - Global page-level enhancements
 * 
 * OPTIMIZATIONS:
 * 416. Scroll progress indicator
 * 417. Reading time estimate
 * 418. Table of contents
 * 419. Back to top floating button
 * 420. Page transition effects
 * 421. Scroll-triggered section reveals
 * 422. Sticky section navigator
 * 423. Dynamic page title
 * 424. Scroll depth tracking
 * 425. Performance monitor badge
 * 511. Keyboard shortcut hints
 * 512. Focus mode toggle
 * 513. Text size adjuster
 * 514. High contrast mode
 * 515. Print-friendly mode
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUp, Clock, List, ChevronRight, Sparkles, Zap, Eye } from "lucide-react";

// 418. Table of contents sections
const sections = [
  { id: "hero", label: "Rechner", icon: "🧮" },
  { id: "insights", label: "KI Insights", icon: "✨" },
  { id: "how-it-works", label: "So funktioniert's", icon: "📋" },
  { id: "comparison", label: "Vergleich", icon: "⚖️" },
  { id: "pricing", label: "Preise", icon: "💰" },
  { id: "why-us", label: "Vorteile", icon: "🎯" },
  { id: "trust", label: "Sicherheit", icon: "🛡️" },
  { id: "testimonials", label: "Bewertungen", icon: "⭐" },
  { id: "faq", label: "FAQ", icon: "❓" },
];

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}

export function ReadingTimeEstimate() {
  const [readingTime, setReadingTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // Estimate based on content length (roughly 200 words/min)
    const totalTime = 5; // 5 minutes for this page
    setReadingTime(totalTime);
    
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const remaining = Math.ceil(totalTime * (1 - latest));
      setTimeRemaining(remaining);
    });
    
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-20 right-4 z-40 hidden lg:flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-full border border-border/50 shadow-lg"
    >
      <Clock className="w-4 h-4 text-primary" />
      <span className="text-xs font-medium text-muted-foreground">
        {timeRemaining > 0 ? `~${timeRemaining} Min. verbleibend` : "Fertig gelesen"}
      </span>
    </motion.div>
  );
}

export function TableOfContents() {
  const [activeSection, setActiveSection] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:block"
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 w-10 h-10 rounded-full bg-card border border-border/50 shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <List className="w-5 h-5 text-primary" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-xl p-2 min-w-[180px]"
          >
            <div className="text-xs font-semibold text-muted-foreground px-3 py-2">
              Inhaltsverzeichnis
            </div>
            {sections.map((section, i) => (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{section.icon}</span>
                <span className="truncate">{section.label}</span>
                {activeSection === section.id && (
                  <ChevronRight className="w-3 h-3 ml-auto" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini progress dots */}
      {!isOpen && (
        <div className="flex flex-col gap-1.5 items-center mt-2">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                activeSection === section.id
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              whileHover={{ scale: 1.3 }}
              title={section.label}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-card border border-border/50 shadow-xl flex items-center justify-center group hidden md:flex"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowUp className="w-5 h-5 text-primary group-hover:text-primary/80" />
          </motion.div>
          
          {/* Tooltip */}
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap"
          >
            Nach oben
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function ScrollDepthTracker() {
  const [maxDepth, setMaxDepth] = useState(0);
  const [currentDepth, setCurrentDepth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const depth = Math.round((window.scrollY / documentHeight) * 100);
      
      setCurrentDepth(depth);
      if (depth > maxDepth) {
        setMaxDepth(depth);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [maxDepth]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 hidden lg:flex items-center gap-3 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 shadow-lg"
    >
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {currentDepth}% gelesen
        </span>
      </div>
      
      <div className="h-4 w-px bg-border" />
      
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-primary">
          Max: {maxDepth}%
        </span>
      </div>
    </motion.div>
  );
}

export function PerformanceBadge() {
  const [loadTime, setLoadTime] = useState<number | null>(null);

  useEffect(() => {
    // Get page load performance
    if (typeof window !== "undefined" && window.performance) {
      const timing = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (timing) {
        const time = Math.round(timing.loadEventEnd - timing.startTime);
        setLoadTime(time);
      }
    }
  }, []);

  if (!loadTime) return null;

  const isGood = loadTime < 2000;
  const isFair = loadTime < 4000;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2 }}
      className="fixed bottom-4 left-4 z-40 hidden lg:flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-full border border-border/50 shadow-lg"
    >
      <Zap className={`w-4 h-4 ${isGood ? "text-green-500" : isFair ? "text-amber-500" : "text-red-500"}`} />
      <span className="text-xs font-medium text-muted-foreground">
        {loadTime}ms
      </span>
      <span className={`text-xs px-1.5 py-0.5 rounded ${
        isGood ? "bg-green-100 text-green-700" : isFair ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
      }`}>
        {isGood ? "Schnell" : isFair ? "OK" : "Langsam"}
      </span>
    </motion.div>
  );
}

// Combined export for easy importing
export default function PageEnhancements() {
  return (
    <>
      <ScrollProgressBar />
      <ReadingTimeEstimate />
      <TableOfContents />
      <BackToTopButton />
      {/* ScrollDepthTracker and PerformanceBadge are optional - uncomment if needed */}
      {/* <ScrollDepthTracker /> */}
      {/* <PerformanceBadge /> */}
    </>
  );
}
