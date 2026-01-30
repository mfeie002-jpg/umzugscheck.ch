/**
 * Neue Mobile Navigation mit Accordion-Struktur
 * 
 * Clean Swiss Mobile-First UX mit:
 * - Semantic design tokens
 * - Smooth animations (framer-motion)
 * - Better touch targets (min 52px)
 */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFlowPath } from "@/hooks/useUnifiedAB";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X,
  Calculator,
  Lightbulb,
  MapPin,
  Package,
  Briefcase,
  Star,
  ArrowRight,
  Shield,
  BadgeCheck,
  Zap,
  Heart,
  Phone,
  MessageCircle,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNavigationVariant } from "@/hooks/useNavigationVariant";
import { 
  PreisrechnerContent, 
  FirmenContent, 
  ServicesContent, 
  RatgeberContent, 
  FuerFirmenContent 
} from "@/components/mobile-menu/MobileMenuVariantContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Trust signals for mobile - clean Swiss design
const TRUST_SIGNALS = [
  { icon: BadgeCheck, label: "Geprüft", color: "text-primary" },
  { icon: Star, label: "4.8★ Top", color: "text-primary" },
  { icon: Heart, label: "Gratis", color: "text-primary" },
];

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

const menuVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
      duration: 0.3
    }
  },
  exit: { 
    x: "100%", 
    transition: { type: "spring" as const, damping: 30, stiffness: 350 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.3 }
  })
} as const;

interface MobileMenuNewProps {
  isOpen: boolean;
  onClose: () => void;
}

// Removed - now in MobileMenuVariantContent.tsx

export const MobileMenuNew = ({ isOpen, onClose }: MobileMenuNewProps) => {
  const location = useLocation();
  const navVariant = useNavigationVariant();
  const flowPath = useFlowPath();
  const [searchTerm, setSearchTerm] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);

  // Reset when menu opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setOpenAccordion(undefined);
    }
  }, [isOpen]);

  // Close only when route actually changes while menu is open
  const lastPathRef = useRef(location.pathname);
  useEffect(() => {
    if (!isOpen) {
      lastPathRef.current = location.pathname;
      return;
    }
    if (lastPathRef.current !== location.pathname) {
      lastPathRef.current = location.pathname;
      onClose();
    }
  }, [isOpen, location.pathname, onClose]);

  // Search state is passed to FirmenContent component

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with warm blur */}
          <motion.div 
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Menu Panel - Warm & Welcoming */}
          <motion.div 
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed inset-y-0 right-0 w-full max-w-[360px]",
               "bg-gradient-to-b from-background via-background to-primary/5 z-[10005] lg:hidden",
              "flex flex-col",
              "shadow-2xl"
            )}
          >
            {/* Clean Header - Swiss Design */}
            <div className="border-b border-border/50 bg-card">
              {/* Trust Micro-Bar - Clean */}
              <div className="flex items-center justify-center gap-4 py-2.5 bg-muted/50">
                {TRUST_SIGNALS.map((signal, i) => (
                  <motion.div
                    key={signal.label}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center gap-1.5"
                  >
                    <signal.icon className={cn("w-4 h-4", signal.color)} />
                    <span className="text-xs font-semibold text-foreground">{signal.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Title & Close - No duplicate logo */}
              <div className="flex items-center justify-between px-4 py-3">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-base font-bold text-foreground">Menü</h2>
                  <p className="text-[11px] text-muted-foreground">Navigation & Services</p>
                </motion.div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-11 w-11 rounded-lg hover:bg-muted transition-colors touch-manipulation"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content - Scroll Area */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                {/* Clean Quick Help Banner */}
                <motion.div 
                  custom={0}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-4 p-3 rounded-xl bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Brauchst du Hilfe?</p>
                      <p className="text-xs text-muted-foreground">Wir beraten dich gerne kostenlos!</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 rounded-lg hover:bg-muted"
                      asChild
                    >
                      <Link to="/kontakt" onClick={onClose}>
                        <MessageCircle className="w-5 h-5 text-primary" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>

                <Accordion 
                  type="single" 
                  collapsible 
                  value={openAccordion}
                  onValueChange={(value) => {
                    console.log('[MobileMenuNew] Accordion value changed to:', value);
                    setOpenAccordion(value);
                  }}
                  className="space-y-3"
                >
                  {/* 1. Preise berechnen - Clean Swiss Design */}
                  <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="umzug-planen" className="border border-border/50 rounded-xl overflow-hidden shadow-sm">
                      <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-primary/5 touch-manipulation border-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-border/40 flex items-center justify-center flex-shrink-0">
                            <Calculator className="w-6 h-6" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-base text-foreground">{navVariant.labels.preisrechner}</span>
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-md font-bold">
                                Beliebt
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground block mt-1 line-clamp-2">{navVariant.microcopy.preisrechner}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <PreisrechnerContent onClose={onClose} variant={navVariant} />
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  {/* 2. Firmen vergleichen - Clean Swiss Design */}
                  <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="umzugsfirma-finden" className="border border-border/50 rounded-xl overflow-hidden shadow-sm">
                      <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-primary/5 touch-manipulation border-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-border/40 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-base text-foreground">{navVariant.labels.firmen}</span>
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-md font-bold">
                                500+
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground block mt-1 line-clamp-2">{navVariant.microcopy.firmen}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <FirmenContent 
                          onClose={onClose} 
                          searchTerm={searchTerm} 
                          setSearchTerm={setSearchTerm}
                          variant={navVariant}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  {/* 3. Umzugs-Services - Clean Swiss Design */}
                  <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="services" className="border border-border/50 rounded-xl overflow-hidden shadow-sm">
                      <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-primary/5 touch-manipulation border-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-border/40 flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6" />
                          </div>
                          <div className="text-left min-w-0">
                            <span className="font-bold text-base text-foreground">{navVariant.labels.services}</span>
                            <span className="text-xs text-muted-foreground block mt-1 line-clamp-2">{navVariant.microcopy.services}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <ServicesContent onClose={onClose} />
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  {/* 4. Ratgeber - Clean Swiss Design */}
                  <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="ratgeber" className="border border-border/50 rounded-xl overflow-hidden shadow-sm">
                      <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-primary/5 touch-manipulation border-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-border/40 flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-6 h-6" />
                          </div>
                          <div className="text-left min-w-0">
                            <span className="font-bold text-base text-foreground">{navVariant.labels.ratgeber}</span>
                            <span className="text-xs text-muted-foreground block mt-1 line-clamp-2">{navVariant.microcopy.ratgeber}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <RatgeberContent onClose={onClose} />
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  {/* 5. Für Firmen - Clean Swiss Design */}
                  <motion.div custom={5} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="fuer-firmen" className="border border-border/50 rounded-xl overflow-hidden shadow-sm">
                      <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-primary/5 touch-manipulation border-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div className="text-left min-w-0">
                            <span className="font-bold text-base text-foreground">{navVariant.labels.fuerFirmen}</span>
                            <span className="text-xs text-muted-foreground block mt-1 line-clamp-2">{navVariant.microcopy.fuerFirmen}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <FuerFirmenContent onClose={onClose} />
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                </Accordion>
              </div>
            </ScrollArea>

            {/* Clean Footer CTA */}
            <div className="border-t border-border/50 bg-card safe-area-inset-bottom">
              {/* Trust bar */}
              <div className="flex items-center justify-center gap-4 py-3 px-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Gratis</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>2 Min</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Heart className="w-4 h-4 text-primary" />
                  <span>Swiss</span>
                </div>
              </div>
              
              <div className="px-4 pb-4">
                <Link to={flowPath} onClick={onClose}>
                  <Button 
                    className="w-full h-14 min-h-[56px] text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg rounded-xl touch-manipulation transition-all active:scale-[0.98]"
                    size="lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {navVariant.labels.cta}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                
                <p className="text-xs text-center text-muted-foreground mt-2.5 font-medium">
                  Unverbindlich • 3–5 Offerten in 24h
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Enhanced Helper Components with emoji & description support
interface MobileMenuItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge?: string;
  emoji?: string;
  description?: string;
  onClick: () => void;
}

const MobileMenuItem = ({ to, icon: Icon, title, badge, emoji, description, onClick }: MobileMenuItemProps) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-background/80 active:bg-accent transition-all group touch-manipulation min-h-[56px] border border-transparent hover:border-border/50 hover:shadow-sm"
  >
    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/10 transition-all shadow-sm">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <span className="text-sm font-bold group-hover:text-primary transition-colors block">{title}</span>
      {description && (
        <span className="text-xs text-muted-foreground block mt-0.5">{description}</span>
      )}
    </div>
    {emoji && <span className="text-lg">{emoji}</span>}
    {badge && (
      <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-sm">
        {badge}
      </span>
    )}
  </Link>
);

interface MobileMenuItemCompactProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  emoji?: string;
  onClick: () => void;
}

const MobileMenuItemCompact = ({ to, icon: Icon, title, emoji, onClick }: MobileMenuItemCompactProps) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-background/80 active:bg-accent transition-all group touch-manipulation min-h-[52px] border border-border/30 hover:border-border hover:shadow-sm bg-background/50"
  >
    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
    <span className="text-xs font-bold truncate group-hover:text-primary transition-colors flex-1">{title}</span>
    {emoji && <span className="text-sm">{emoji}</span>}
  </Link>
);
