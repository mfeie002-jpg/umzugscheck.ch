/**
 * Navigation V15 - ChatGPT Feedback v15
 * 
 * 4 main sections (Mobile-first, Du-Form):
 * 1. Plane deinen Umzug - Tools, Checklisten & Tipps
 * 2. Offerten vergleichen - Gratis Offerten von geprüften Firmen
 * 3. So funktioniert's - In 3 Schritten zum Umzug
 * 4. Hilfe & Kontakt - FAQ & Support
 * + CTA: Kostenlos Offerten erhalten
 * 
 * Key Features:
 * - Du-Form für Schweizer Markt
 * - Emotionale, benefit-driven Microcopy
 * - 5-item Submenu für Offerten vergleichen
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronDown, 
  Menu, 
  ArrowRight,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderLogo } from "@/components/brand/HeaderLogo";
import { cn } from "@/lib/utils";
import { MobileMenuV15 } from "./MobileMenuV15";
import { useFlowPath } from "@/hooks/useUnifiedAB";

interface NavItem {
  label: string;
  tagline: string;
  emoji?: string;
  items: {
    emoji: string;
    title: string;
    description: string;
    href: string;
  }[];
}

const navStructure: NavItem[] = [
  {
    label: "Plane deinen Umzug",
    tagline: "Tools, Checklisten & Tipps, damit du stressfrei an alles denkst.",
    emoji: "📋",
    items: [
      { emoji: "✅", title: "Umzugscheckliste", description: "Alles auf einen Blick", href: "/checkliste" },
      { emoji: "🧮", title: "Umzugskosten-Rechner", description: "In 2 Min zum Richtpreis", href: "/umzugsrechner" },
      { emoji: "📦", title: "Volumenrechner", description: "Wie viel passt in den LKW?", href: "/volumenrechner" },
      { emoji: "🤖", title: "Digitaler Assistent", description: "Persönliche Tipps (Beta)", href: "/assistent" },
      { emoji: "🎁", title: "Packtipps", description: "So packst du richtig", href: "/ratgeber/packtipps" },
    ]
  },
  {
    label: "Offerten vergleichen",
    tagline: "Hol dir gratis Offerten von geprüften Umzugsfirmen & finde das beste Angebot.",
    emoji: "🔍",
    items: [
      { emoji: "🏠", title: "Privatumzug", description: "Zügle ohne Stress – Angebote für deinen Wohnungs- oder Hausumzug", href: "/privatumzug" },
      { emoji: "💼", title: "Büro & Firmenumzug", description: "Reibungsloser Geschäftsumzug – Offerten für Büro oder Firma", href: "/firmenumzug" },
      { emoji: "✨", title: "Umzug + Reinigung", description: "Komplett sorglos – inkl. Endreinigung durch Profis", href: "/umzug-mit-reinigung" },
      { emoji: "🌍", title: "Internationaler Umzug", description: "Von der Schweiz in die Welt – erfahrene Partner", href: "/international" },
      { emoji: "🏭", title: "Lagerung & Entsorgung", description: "Zwischenlagern oder Entsorgen leicht gemacht", href: "/lagerung-entsorgung" },
    ]
  },
  {
    label: "So funktioniert's",
    tagline: "In 3 Schritten zu deinem stressfreien Umzug – transparent, sicher und einfach erklärt.",
    emoji: "⭐",
    items: [
      { emoji: "❓", title: "Ablauf erklärt", description: "So funktioniert Umzugscheck", href: "/so-funktionierts" },
      { emoji: "⭐", title: "Kundenbewertungen", description: "Echte Erfahrungen lesen", href: "/bewertungen" },
      { emoji: "🛡️", title: "Geprüfte Partner", description: "Qualität die du vertrauen kannst", href: "/partner" },
      { emoji: "👥", title: "Über uns", description: "Unser Team & unsere Mission", href: "/ueber-uns" },
    ]
  },
  {
    label: "Hilfe & Kontakt",
    tagline: "Wir sind für dich da – FAQ, Tipps und persönlicher Support bei allen Umzugsfragen.",
    emoji: "📞",
    items: [
      { emoji: "💬", title: "Häufige Fragen (FAQ)", description: "Schnelle Antworten", href: "/faq" },
      { emoji: "📞", title: "Kontakt", description: "Wir helfen dir gerne", href: "/kontakt" },
      { emoji: "🆘", title: "Support", description: "Bei Problemen & Reklamationen", href: "/support" },
    ]
  },
  {
    label: "Für Anbieter",
    tagline: "Partner werden & täglich qualifizierte Umzugs-Leads erhalten.",
    emoji: "🏢",
    items: [
      { emoji: "🤝", title: "Partner werden", description: "Erhalte täglich qualifizierte Leads", href: "/fuer-firmen" },
      { emoji: "🔐", title: "Anbieter Login", description: "Zugang zu deinem Partner-Dashboard", href: "/anbieter-login" },
      { emoji: "💼", title: "Firmenumzug anfragen", description: "Relocation Service für Unternehmen", href: "/firmenumzug" },
      { emoji: "🧮", title: "Firmenumzug-Rechner", description: "Kosten für Büroumzug kalkulieren", href: "/firmenumzug-rechner" },
    ]
  }
];

export const NavigationV15 = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const flowPath = useFlowPath();

  return (
    <>
      <header className="sticky top-0 z-[9998] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-full px-3 sm:px-4 lg:px-6 flex h-16 items-center justify-between gap-2 min-w-0">
          {/* Logo - Show tagline always */}
          <HeaderLogo size="md" showTagline={true} className="flex-shrink-0" />

          {/* Desktop Navigation - Show from lg (1024px+) */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 2xl:gap-2 flex-1 min-w-0 overflow-visible">
            {navStructure.map((section) => (
              <div
                key={section.label}
                className="relative flex-shrink-0"
                onMouseEnter={() => setActiveDropdown(section.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 lg:gap-1.5 px-2 lg:px-3 py-2 h-10 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                    "hover:bg-accent hover:text-accent-foreground",
                    activeDropdown === section.label && "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="text-sm lg:text-base leading-none" aria-hidden="true">{section.emoji}</span>
                  <span className="leading-none hidden 2xl:inline">{section.label}</span>
                  <span className="leading-none 2xl:hidden">{section.label.split(' ')[0]}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200 flex-shrink-0",
                      activeDropdown === section.label && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown */}
                {activeDropdown === section.label && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 bg-black/10 z-[9998]"
                      onClick={() => setActiveDropdown(null)}
                    />
                    <div className="absolute top-full left-0 pt-2 z-[9999]">
                      <div className="bg-background border border-border rounded-xl shadow-2xl min-w-[380px] p-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                        {/* Tagline */}
                        <p className="text-sm text-muted-foreground mb-4 pb-3 border-b border-border leading-relaxed">
                          {section.tagline}
                        </p>

                        {/* Links */}
                        <div className="space-y-1">
                          {section.items.map((item) => (
                              <Link
                                key={item.href}
                                to={item.href}
                                className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors group"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors text-lg">
                                  {item.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-semibold text-foreground block">{item.title}</span>
                                  <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                              </Link>
                          ))}
                        </div>

                        {/* CTA in Dropdown */}
                        {section.label === "Offerten vergleichen" && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <Button asChild className="w-full font-semibold gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md shadow-secondary/20">
                              <Link to={flowPath}>
                                Gratis Offerten holen
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2 2xl:gap-3 flex-shrink-0">
            <Button
              asChild
              className="h-10 font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 text-xs lg:text-sm px-3 lg:px-4 whitespace-nowrap"
            >
              <Link to={flowPath}>
                <span className="hidden 2xl:inline">Kostenlos Offerten erhalten</span>
                <span className="2xl:hidden">Offerten</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile CTA + Menu Button - pushed to right */}
          <div className="lg:hidden flex items-center gap-2 ml-auto">
            <Button asChild size="sm" className="h-9 px-3 font-semibold gap-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20">
              <Link to={flowPath}>
                <Zap className="w-4 h-4" />
                Offerten
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menü öffnen</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenuV15
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navStructure={navStructure}
      />
    </>
  );
};
