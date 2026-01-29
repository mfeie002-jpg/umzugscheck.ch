/**
 * Neue Mobile Navigation mit Accordion-Struktur
 * 
 * Enhanced Mobile-First UX mit:
 * - Warm, welcoming design ("nicht wie Friedhof")
 * - Emotional trust signals & friendly messaging
 * - Smooth animations (framer-motion)
 * - Better touch targets (min 52px)
 * - Gradients & micro-interactions
 */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFlowPath } from "@/hooks/useUnifiedAB";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  X,
  Calculator,
  CheckSquare,
  Clock,
  Lightbulb,
  FileDown,
  Search,
  MapPin,
  Building2,
  Home,
  Globe,
  Sparkles,
  Wrench,
  Package,
  Trash2,
  Box,
  Truck,
  ParkingCircle,
  FileText,
  DollarSign,
  Calendar,
  Baby,
  Briefcase,
  LogIn,
  Star,
  HelpCircle,
  ArrowRight,
  Shield,
  BadgeCheck,
  Users,
  Zap,
  Heart,
  Phone,
  MessageCircle,
  Smile,
  PartyPopper,
  ThumbsUp,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Friendly welcome messages
const WELCOME_MESSAGES = [
  "Willkommen! 👋",
  "Schön, dass du da bist! ✨",
  "Hallo! Wie können wir helfen? 🏠",
];

// Trust signals for mobile - more emotional
const TRUST_SIGNALS = [
  { icon: BadgeCheck, label: "Geprüft", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/50" },
  { icon: Star, label: "4.8★ Top", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/50" },
  { icon: Heart, label: "Gratis", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/50" },
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

const pulseVariants = {
  initial: { scale: 1 },
  pulse: { 
    scale: [1, 1.02, 1] as number[],
    transition: { duration: 2, repeat: Infinity }
  }
};

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
  const [welcomeMessage] = useState(() => 
    WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]
  );

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9990] lg:hidden"
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
              "bg-gradient-to-b from-background via-background to-primary/5 z-[9995] lg:hidden",
              "flex flex-col",
              "shadow-2xl"
            )}
          >
            {/* Enhanced Header - Warm & Friendly */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-b border-primary/10">
              {/* Welcome Banner */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-emerald-500/10 via-primary/10 to-amber-500/10"
              >
                <Smile className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{welcomeMessage}</span>
              </motion.div>

              {/* Logo & Close */}
              <div className="flex items-center justify-between px-4 py-3">
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/30">
                    <CheckCircle className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg leading-tight">
                      <span className="text-foreground">Umzugs</span>
                      <span className="text-primary">check</span>
                      <span className="text-muted-foreground text-sm">.ch</span>
                    </h2>
                    <p className="text-[11px] text-muted-foreground font-medium">🇨🇭 Dein Schweizer Umzugshelfer</p>
                  </div>
                </motion.div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-12 w-12 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors touch-manipulation"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Trust Micro-Bar - More Emotional */}
              <div className="flex items-center justify-center gap-3 py-2.5 px-4">
                {TRUST_SIGNALS.map((signal, i) => (
                  <motion.div
                    key={signal.label}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                      signal.bg
                    )}
                  >
                    <signal.icon className={cn("w-4 h-4", signal.color)} />
                    <span className="text-xs font-bold text-foreground">{signal.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Content - Scroll Area */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                {/* Friendly Quick Help Banner */}
                <motion.div 
                  custom={0}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-primary/10 to-amber-500/10 border border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">Brauchst du Hilfe? 💬</p>
                      <p className="text-xs text-muted-foreground">Wir sind freundlich und helfen gerne!</p>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="rounded-full h-10 px-4 font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900"
                      asChild
                    >
                      <Link to="/kontakt" onClick={onClose}>
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
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
                  {/* 1. Preise berechnen - Enhanced & Friendly */}
                  <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="umzug-planen" className="border-0 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-sm">
                      <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-primary/10 [&[data-state=open]]:bg-primary/15 touch-manipulation border-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/25">
                            <Calculator className="w-7 h-7 text-primary-foreground" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-base text-foreground">{navVariant.labels.preisrechner}</span>
                              <span className="text-xs bg-gradient-to-r from-primary/20 to-secondary/20 text-primary px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                                <Zap className="w-3 h-3" /> Beliebt
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

                  {/* 2. Firmen vergleichen - Enhanced & Friendly */}
                  <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="umzugsfirma-finden" className="border-0 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent shadow-sm">
                      <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-emerald-500/10 [&[data-state=open]]:bg-emerald-500/15 touch-manipulation border-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
                            <MapPin className="w-7 h-7 text-white" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-base text-foreground">{navVariant.labels.firmen}</span>
                              <span className="text-xs bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" /> 500+
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

                  {/* 3. Umzugs-Services - Enhanced & Friendly */}
                  <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="services" className="border-0 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent shadow-sm">
                      <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-purple-500/10 [&[data-state=open]]:bg-purple-500/15 touch-manipulation border-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/25">
                            <Package className="w-7 h-7 text-white" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-base text-foreground">{navVariant.labels.services}</span>
                              <span className="text-xs bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/50 dark:to-purple-950/50 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full font-bold">📦</span>
                            </div>
                            <span className="text-xs text-muted-foreground block mt-1 line-clamp-2">{navVariant.microcopy.services}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <ServicesContent onClose={onClose} />
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  {/* 4. Ratgeber - Enhanced & Friendly */}
                  <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="ratgeber" className="border-0 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent shadow-sm">
                      <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-amber-500/10 [&[data-state=open]]:bg-amber-500/15 touch-manipulation border-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25">
                            <Lightbulb className="w-7 h-7 text-white" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-base text-foreground">{navVariant.labels.ratgeber}</span>
                              <span className="text-xs bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/50 dark:to-amber-950/50 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full font-bold">📚</span>
                            </div>
                            <span className="text-xs text-muted-foreground block mt-1 line-clamp-2">{navVariant.microcopy.ratgeber}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <RatgeberContent onClose={onClose} />
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  {/* 5. Für Firmen - Enhanced & Friendly */}
                  <motion.div custom={5} variants={itemVariants} initial="hidden" animate="visible">
                    <AccordionItem value="fuer-firmen" className="border-0 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent shadow-sm">
                      <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-blue-500/10 [&[data-state=open]]:bg-blue-500/15 touch-manipulation border-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                            <Briefcase className="w-7 h-7 text-white" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-base text-foreground">{navVariant.labels.fuerFirmen}</span>
                              <span className="text-xs bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-950/50 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-bold">💼</span>
                            </div>
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

            {/* Enhanced Footer CTA - Warm & Inviting */}
            <div className="border-t-2 border-primary/10 bg-gradient-to-t from-primary/10 via-background to-background safe-area-inset-bottom">
              {/* Friendly trust bar */}
              <div className="flex items-center justify-center gap-4 py-3 px-4">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <Shield className="w-4 h-4 text-emerald-600" /> Gratis
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/50">
                  <Zap className="w-4 h-4 text-amber-500" /> 2 Min
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/50">
                  <Heart className="w-4 h-4 text-rose-500" /> Swiss
                </span>
              </div>
              
              <div className="px-4 pb-4">
                <motion.div
                  variants={pulseVariants}
                  initial="initial"
                  animate="pulse"
                >
                  <Link to={flowPath} onClick={onClose}>
                    <Button 
                      className="w-full h-16 min-h-[64px] text-lg font-bold bg-gradient-to-r from-primary via-primary to-emerald-500 hover:opacity-95 text-primary-foreground shadow-xl shadow-primary/30 rounded-2xl touch-manipulation transition-all active:scale-[0.98]"
                      size="lg"
                    >
                      <CheckCircle className="w-6 h-6 mr-2" />
                      {navVariant.labels.cta}
                      <ArrowRight className="w-6 h-6 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
                
                <p className="text-xs text-center text-muted-foreground mt-3 font-medium">
                  ✨ Unverbindlich • 3–5 Offerten in 24h • 100% kostenlos
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
