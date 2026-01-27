/**
 * GoldenNavigation - The optimized navigation component
 * 
 * Combines best patterns from all 17 navigation variants:
 * - Premium mega-dropdowns with trust signals (V16)
 * - Context-aware CTA labels (V16)
 * - Action-first labels (V-B, V-J)
 * - Mobile-first responsive design (V-E)
 * - Animated transitions (V17)
 */

import { useState, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Zap, Menu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderLogo } from "@/components/brand/HeaderLogo";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { GoldenDropdown } from "./GoldenDropdown";
import { GoldenMobileMenu } from "./GoldenMobileMenu";
import { GOLDEN_NAV_CONFIG, GOLDEN_NAV_SECTIONS } from "../config/navigation";
import { useFlowPath } from "@/hooks/useUnifiedAB";

export const GoldenNavigation = memo(() => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const flowPath = useFlowPath();

  // Context-aware CTA label based on current page
  const getCtaLabel = () => {
    if (location.pathname.includes('reinigung')) return 'Reinigungsofferte';
    if (location.pathname.includes('lagerung')) return 'Lagerungsofferte';
    if (location.pathname.includes('entsorgung')) return 'Entsorgungsofferte';
    if (location.pathname.includes('firmenumzug')) return 'Firmenofferte';
    return GOLDEN_NAV_CONFIG.labels.cta;
  };

  return (
    <>
      <header className="sticky top-0 z-[9998] w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-x-clip">
        {/* Premium gradient accent line - Brand colors only */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0050A8] via-[#E32026] to-[#0050A8]" />
        
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-5 xl:px-6 pl-[calc(1rem+env(safe-area-inset-left))] pr-[calc(1.5rem+env(safe-area-inset-right))]">
          {/* Logo */}
          <HeaderLogo size="md" showTagline={true} className="group" />

          {/* Desktop Navigation - Only show from xl breakpoint */}
          <nav className="hidden xl:flex items-center gap-0.5 flex-1 min-w-0 justify-center">
            {GOLDEN_NAV_SECTIONS.map((section) => (
              <div
                key={section.id}
                className="relative"
                onMouseEnter={() => setActiveDropdown(section.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 px-2 xl:px-3 py-2 rounded-lg text-[13px] 2xl:text-sm font-medium transition-all whitespace-nowrap",
                    "hover:bg-primary/10 hover:text-primary",
                    activeDropdown === section.id && "bg-primary/10 text-primary"
                  )}
                >
                  {section.label}
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    activeDropdown === section.id && "rotate-180"
                  )} />
                </button>

                {/* Golden Dropdown */}
                <AnimatePresence>
                  {activeDropdown === section.id && (
                    <GoldenDropdown 
                      section={section} 
                      onClose={() => setActiveDropdown(null)}
                      flowPath={flowPath}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Side: CTA + Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 flex-shrink-0">
            {/* Desktop CTA - Context-Aware (xl+) */}
            <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
              <Button 
                asChild 
                className="h-10 px-5 font-bold gap-2 rounded-xl bg-[#E32026] hover:bg-[#c91c21] text-white shadow-lg shadow-[#E32026]/20 hover:shadow-xl hover:shadow-[#E32026]/30 transition-all hover:scale-[1.02]"
              >
                <Link to={flowPath}>
                  <Zap className="w-4 h-4" />
                  {getCtaLabel()}
                </Link>
              </Button>
              <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                Gratis & unverbindlich
              </span>
            </div>

            {/* Mobile CTA (below xl) */}
            <Button 
              asChild 
              className="xl:hidden h-9 px-3 sm:px-4 font-bold gap-1.5 rounded-lg bg-[#E32026] hover:bg-[#c91c21] text-white text-sm whitespace-nowrap"
            >
              <Link to={flowPath}>
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">{GOLDEN_NAV_CONFIG.labels.cta}</span>
                <span className="sm:hidden">{GOLDEN_NAV_CONFIG.labels.ctaShort}</span>
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden h-9 w-9 rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menü öffnen</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <GoldenMobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
});

GoldenNavigation.displayName = "GoldenNavigation";
