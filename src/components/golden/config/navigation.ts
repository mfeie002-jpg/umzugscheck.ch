/**
 * Golden Navigation Configuration
 * 
 * The "best-of" navigation config combining insights from all 17 variants:
 * - Action-first labels from Variant B & J (conversion-focused)
 * - Clear microcopy from Variant D & F (trust-building)
 * - Shorter labels for mobile from Variant E (mobile-first)
 * - Premium CTA cards from Variant J & P (high-converting)
 */

import { Calculator, ClipboardList, Box, Bot, Package } from "lucide-react";
import { MapPin, Truck } from "lucide-react";
import { Home, Trash2, Archive, CableCar, Briefcase } from "lucide-react";
import { Baby, Key, Mail, Wrench } from "lucide-react";
import { Sparkles, Star, Award, Users, HelpCircle } from "lucide-react";

export interface GoldenNavConfig {
  labels: {
    umzugPlanen: string;
    umzugsfirmen: string;
    services: string;
    ratgeber: string;
    soFunktionierts: string;
    cta: string;
    ctaShort: string;
  };
  microcopy: {
    umzugPlanen: string;
    umzugsfirmen: string;
    services: string;
    ratgeber: string;
    soFunktionierts: string;
  };
  trustSignals: Array<{
    icon: string;
    label: string;
    color: string;
  }>;
  ctaCard: {
    title: string;
    subtitle: string;
    buttonText: string;
    badges: string[];
  };
}

export const GOLDEN_NAV_CONFIG: GoldenNavConfig = {
  labels: {
    umzugPlanen: "Umzug planen",
    umzugsfirmen: "Firmen vergleichen",
    services: "Services",
    ratgeber: "Tipps & Hilfe",
    soFunktionierts: "So funktioniert's",
    cta: "Gratis Offerten",
    ctaShort: "Offerten",
  },
  microcopy: {
    umzugPlanen: "Kosten berechnen in 60 Sekunden",
    umzugsfirmen: "200+ geprüfte Partner vergleichen",
    services: "Reinigung, Lagerung, Entsorgung & mehr",
    ratgeber: "Checklisten, Tipps & Anleitungen",
    soFunktionierts: "Transparent von Anfrage bis Offerte",
  },
  trustSignals: [
    { icon: "Shield", label: "Geprüfte Firmen", color: "text-emerald-600" },
    { icon: "Star", label: "4.8★ Bewertung", color: "text-amber-500" },
    { icon: "Heart", label: "100% Gratis", color: "text-rose-500" },
  ],
  ctaCard: {
    title: "In 2 Minuten Klarheit",
    subtitle: "3–5 Offerten in 24–48h",
    buttonText: "Gratis Offerten holen",
    badges: ["Kostenlos", "Unverbindlich", "60 Sekunden"],
  },
};

export interface NavSection {
  id: string;
  label: string;
  tagline: string;
  items: Array<{
    icon: React.ElementType;
    title: string;
    description: string;
    href: string;
    badge?: string;
    badgeColor?: string;
  }>;
}

export const GOLDEN_NAV_SECTIONS: NavSection[] = [
  {
    id: "umzug-planen",
    label: "📋 Umzug planen",
    tagline: "Tools, Tipps & Rechner für deinen Zügeltag",
    items: [
      { icon: Calculator, title: "Umzugskosten-Rechner", description: "Was kostet dein Umzug? In 60 Sekunden.", href: "/preisrechner", badge: "Beliebt", badgeColor: "from-amber-500 to-orange-500" },
      { icon: ClipboardList, title: "Umzugscheckliste", description: "Schritt für Schritt stressfrei umziehen", href: "/checkliste", badge: "Top", badgeColor: "from-emerald-500 to-teal-500" },
      { icon: Box, title: "Volumenrechner", description: "Wie viel Platz braucht dein Haushalt?", href: "/volumenrechner" },
      { icon: Bot, title: "Digitaler Umzugsassistent", description: "KI-gestützter Umzugsplaner", href: "/assistent", badge: "Neu", badgeColor: "from-violet-500 to-purple-500" },
      { icon: Package, title: "Packtipps & Tricks", description: "Effizient & sicher verpacken", href: "/ratgeber/packtipps" },
    ],
  },
  {
    id: "umzugsfirmen",
    label: "🔍 Firmen vergleichen",
    tagline: "200+ geprüfte Partner – Umzugsfirma finden & sparen",
    items: [
      { icon: MapPin, title: "Umzugsfirma Zürich", description: "Top-Bewertungen in Zürich", href: "/umzugsfirmen/zuerich", badge: "★4.9" },
      { icon: MapPin, title: "Umzugsfirma Bern", description: "Beste Preise in Bern", href: "/umzugsfirmen/bern" },
      { icon: MapPin, title: "Umzugsfirma Basel", description: "Geprüfte Partner in Basel", href: "/umzugsfirmen/basel" },
      { icon: MapPin, title: "Umzugsfirma Luzern", description: "Zentralschweiz Experten", href: "/umzugsfirmen/luzern" },
      { icon: Truck, title: "Alle Umzugsfirmen", description: "Alle Regionen & Kantone", href: "/umzugsfirmen" },
    ],
  },
  {
    id: "services",
    label: "🛠️ Services",
    tagline: "Rundum-Service: Reinigung, Lagerung, Entsorgung & mehr",
    items: [
      { icon: Home, title: "Umzugsreinigung", description: "Mit Abgabegarantie – Depot zurück!", href: "/umzugsreinigung", badge: "Garantie", badgeColor: "from-emerald-500 to-green-500" },
      { icon: Trash2, title: "Entsorgung & Räumung", description: "Altes raus, Neues rein", href: "/entsorgung" },
      { icon: Archive, title: "Lagerung & Einlagerung", description: "Flexibel zwischenlagern", href: "/lagerung" },
      { icon: CableCar, title: "Möbellift mieten", description: "Grosses sicher transportieren", href: "/moebellift" },
      { icon: Briefcase, title: "Firmenumzug", description: "Büro & Geschäft professionell", href: "/firmenumzug" },
    ],
  },
  {
    id: "ratgeber",
    label: "📚 Tipps & Hilfe",
    tagline: "Tipps & Tricks für einen stressfreien Umzug",
    items: [
      { icon: Baby, title: "Umziehen mit Kindern & Haustieren", description: "Stressfrei für die ganze Familie", href: "/ratgeber/umziehen-mit-kindern" },
      { icon: Key, title: "Wohnungsübergabe leicht gemacht", description: "Depot zurück, garantiert!", href: "/ratgeber/wohnungsuebergabe" },
      { icon: Mail, title: "Adressänderung & Ummelden", description: "Alle Behördengänge im Griff", href: "/ratgeber/adressaenderung" },
      { icon: Wrench, title: "DIY vs. Profi-Umzug", description: "Selber machen oder Profis?", href: "/ratgeber/diy-vs-profi" },
      { icon: Calculator, title: "Umzugskosten sparen", description: "Tipps vom Profi für dein Budget", href: "/ratgeber/kosten-sparen" },
    ],
  },
  {
    id: "so-funktioniert",
    label: "⭐ So funktioniert's",
    tagline: "Stressfrei in 3 Schritten – so funktioniert Umzugscheck",
    items: [
      { icon: Sparkles, title: "So funktioniert Umzugscheck", description: "Dein Weg zur besten Offerte", href: "/so-funktioniert" },
      { icon: Star, title: "Kundenbewertungen", description: "Echte Erfahrungen lesen", href: "/bewertungen" },
      { icon: Award, title: "Geprüfte Umzugspartner", description: "Qualität die du spürst", href: "/qualitaet" },
      { icon: Users, title: "Über uns", description: "Das Team hinter Umzugscheck", href: "/ueber-uns" },
      { icon: HelpCircle, title: "FAQ & Hilfe", description: "Antworten auf deine Fragen", href: "/faq" },
    ],
  },
];
