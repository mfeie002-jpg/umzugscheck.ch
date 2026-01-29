/**
 * useDynamicMobileMenu
 * 
 * Returns the correct mobile menu component based on the active navigation variant.
 * This ensures desktop and mobile navigation are always in sync during A/B testing.
 * 
 * Mobile Menu Mapping (17 variants):
 * - Variants 1-10 (ultimate, b-j): MobileMenuNew (reads dynamic labels from variant)
 * - Variant 11 (variant-k): MobileMenuV11 (Simpel & Clean)
 * - Variant 12 (variant-l): MobileMenuV12 (Best-of-Breed)
 * - Variant 13 (variant-m): MobileMenuV13 (Progressive Disclosure)
 * - Variant 14 (variant-n): MobileMenuV14 (2026 Design)
 * - Variant 15 (variant-o): MobileMenuV15 (ChatGPT Feedback v15)
 * - Variant 16 (variant-p): MobileMenuV16 (SEO-Optimiert 2026)
 * - Variant 17 (variant-17): MobileMenuNew (NavigationV17)
 */

import { useNavigationVariant } from "@/hooks/useNavigationVariant";
import { useLocation } from "react-router-dom";
import { useFlowPath } from "@/hooks/useUnifiedAB";
import { MobileMenuNew } from "@/components/MobileMenuNew";
import { MobileMenuV11 } from "@/components/navigation/MobileMenuV11";
import { MobileMenuV12 } from "@/components/navigation/MobileMenuV12";
import { MobileMenuV13 } from "@/components/navigation/MobileMenuV13";
import { MobileMenuV14 } from "@/components/navigation/MobileMenuV14";
import { MobileMenuV15 } from "@/components/navigation/MobileMenuV15";
import { MobileMenuV16 } from "@/components/navigation/MobileMenuV16";
import { useEffect, useState } from "react";

// Lucide icons for V14
import {
  ClipboardList, Calculator, Box, Bot, Package,
  MapPin, Building2, Sparkles, Trash2, Warehouse,
  Truck, Briefcase, Baby, Home, Mail, Scale, PiggyBank,
  HelpCircle, Star, Shield, Users, MessageCircle
} from "lucide-react";

interface DynamicMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================
// V14 Navigation Structure (2026 Design)
// ============================================
const NAV_STRUCTURE_V14 = [
  {
    label: "Umzug planen",
    tagline: "Tools, Tipps & Rechner für deinen Zügeltag",
    items: [
      { icon: ClipboardList, title: "Umzugscheckliste", href: "/checkliste" },
      { icon: Calculator, title: "Umzugskosten-Rechner", href: "/umzugsrechner" },
      { icon: Box, title: "Volumenrechner", href: "/volumenrechner" },
      { icon: Bot, title: "Digitaler Umzugsassistent (Beta)", href: "/assistent" },
      { icon: Package, title: "Packtipps & Tricks", href: "/ratgeber/packtipps" },
    ]
  },
  {
    label: "Umzugsfirmen",
    tagline: "200+ geprüfte Partner – Umzugsfirma finden & sparen",
    items: [
      { icon: MapPin, title: "Umzugsfirma Zürich", href: "/umzugsfirma-zuerich" },
      { icon: MapPin, title: "Umzugsfirma Bern", href: "/umzugsfirma-bern" },
      { icon: MapPin, title: "Umzugsfirma Basel", href: "/umzugsfirma-basel" },
      { icon: MapPin, title: "Umzugsfirma Luzern", href: "/umzugsfirma-luzern" },
      { icon: Building2, title: "Alle Umzugsfirmen (Regionen)", href: "/umzugsfirmen" },
    ]
  },
  {
    label: "Services",
    tagline: "Rundum-Service: Reinigung, Lagerung, Entsorgung & mehr",
    items: [
      { icon: Sparkles, title: "Umzugsreinigung (mit Abgabegarantie)", href: "/reinigung" },
      { icon: Trash2, title: "Entsorgung & Räumung", href: "/entsorgung" },
      { icon: Warehouse, title: "Lagerung & Einlagerung", href: "/lagerung" },
      { icon: Truck, title: "Möbellift mieten", href: "/moebellift" },
      { icon: Briefcase, title: "Firmenumzug (Büro & Geschäft)", href: "/firmenumzug" },
    ]
  },
  {
    label: "Ratgeber",
    tagline: "Tipps & Tricks für einen stressfreien Umzug",
    items: [
      { icon: Baby, title: "Umziehen mit Kindern & Haustieren", href: "/ratgeber/kinder-haustiere" },
      { icon: Home, title: "Wohnungsübergabe leicht gemacht", href: "/ratgeber/wohnungsuebergabe" },
      { icon: Mail, title: "Adressänderung & Ummelden", href: "/ratgeber/adressaenderung" },
      { icon: Scale, title: "DIY vs. Profi-Umzug", href: "/ratgeber/diy-vs-profi" },
      { icon: PiggyBank, title: "Umzugskosten sparen – Tipps vom Profi", href: "/ratgeber/kosten-sparen" },
    ]
  },
  {
    label: "So funktioniert's",
    tagline: "Stressfrei in 3 Schritten – so funktioniert Umzugscheck",
    items: [
      { icon: HelpCircle, title: "So funktioniert Umzugscheck (Ablauf)", href: "/so-funktionierts" },
      { icon: Star, title: "Kundenbewertungen & Erfahrungen", href: "/bewertungen" },
      { icon: Shield, title: "Geprüfte Umzugspartner (Qualität)", href: "/partner" },
      { icon: Users, title: "Über uns (Team & Kontakt)", href: "/ueber-uns" },
      { icon: MessageCircle, title: "FAQ/Hilfe", href: "/faq" },
    ]
  }
];

// ============================================
// V15 Navigation Structure (ChatGPT Feedback v15)
// ============================================
const NAV_STRUCTURE_V15 = [
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
  }
];

// Context-aware CTA for V14
const getContextAwareCTA = (pathname: string): { label: string; href: string } => {
  if (pathname.includes('/reinigung')) {
    return { label: "Offerte für Reinigung", href: "/umzugsofferten?service=reinigung" };
  }
  if (pathname.includes('/entsorgung')) {
    return { label: "Offerte für Entsorgung", href: "/umzugsofferten?service=entsorgung" };
  }
  if (pathname.includes('/lagerung')) {
    return { label: "Offerte für Lagerung", href: "/umzugsofferten?service=lagerung" };
  }
  if (pathname.includes('/firmenumzug')) {
    return { label: "Firmenumzug anfragen", href: "/umzugsofferten?type=business" };
  }
  return { label: "Offerten erhalten", href: "/umzugsofferten" };
};

/**
 * Returns the appropriate mobile menu component based on active nav variant
 */
export const useDynamicMobileMenu = () => {
  const navVariant = useNavigationVariant();
  const location = useLocation();
  const variantId = navVariant.id;
  
  // Force re-render when variant changes by using a state counter
  const [, forceUpdate] = useState(0);
  
  useEffect(() => {
    const handleChange = () => {
      console.log('[useDynamicMobileMenu] Variant change detected, forcing re-render');
      forceUpdate(n => n + 1);
    };
    
    window.addEventListener('ab-state-changed', handleChange);
    window.addEventListener('nav-variant-changed', handleChange as EventListener);
    
    return () => {
      window.removeEventListener('ab-state-changed', handleChange);
      window.removeEventListener('nav-variant-changed', handleChange as EventListener);
    };
  }, []);

  console.log('[useDynamicMobileMenu] Current variant:', variantId);
  
  return { variantId, location, navVariant };
};

/**
 * Direct component export for simpler usage
 * This component uses the variant ID directly to render the correct mobile menu
 */
export const DynamicMobileMenu = ({ isOpen, onClose }: DynamicMobileMenuProps) => {
  const { variantId, location } = useDynamicMobileMenu();
  
  console.log('[DynamicMobileMenu] Rendering with variant:', variantId);
  
  // Variant 11: Simpel & Clean -> MobileMenuV11
  if (variantId === 'variant-k') {
    return <MobileMenuV11 isOpen={isOpen} onClose={onClose} key={`mobile-${variantId}`} />;
  }
  
  // Variant 12: Best-of-Breed -> MobileMenuV12
  if (variantId === 'variant-l') {
    return <MobileMenuV12 isOpen={isOpen} onClose={onClose} key={`mobile-${variantId}`} />;
  }
  
  // Variant 13: Progressive Disclosure -> MobileMenuV13
  if (variantId === 'variant-m') {
    return <MobileMenuV13 isOpen={isOpen} onClose={onClose} key={`mobile-${variantId}`} />;
  }
  
  // Variant 14: 2026 Design -> MobileMenuV14 with navStructure + ctaConfig
  if (variantId === 'variant-n') {
    const ctaConfig = getContextAwareCTA(location.pathname);
    return (
      <MobileMenuV14 
        isOpen={isOpen} 
        onClose={onClose} 
        navStructure={NAV_STRUCTURE_V14}
        ctaConfig={ctaConfig}
        key={`mobile-${variantId}`}
      />
    );
  }
  
  // Variant 15: ChatGPT Feedback v15 -> MobileMenuV15 with navStructure
  if (variantId === 'variant-o') {
    return (
      <MobileMenuV15 
        isOpen={isOpen} 
        onClose={onClose} 
        navStructure={NAV_STRUCTURE_V15}
        key={`mobile-${variantId}`}
      />
    );
  }
  
  // Variant 16: SEO-Optimiert 2026 -> MobileMenuV16
  if (variantId === 'variant-p') {
    return <MobileMenuV16 isOpen={isOpen} onClose={onClose} key={`mobile-${variantId}`} />;
  }
  
  // Variants 1-10 (ultimate, variant-b to variant-j) and variant-17
  // All use MobileMenuNew which reads dynamic labels from navVariant
  return <MobileMenuNew isOpen={isOpen} onClose={onClose} key={`mobile-${variantId}`} />;
};
