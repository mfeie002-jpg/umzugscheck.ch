/**
 * V2.e Chat-Based Funnel - Conversational Moving Quote
 * 
 * Full conversational flow covering:
 * 1. Move type (Wohnung/Haus/Büro)
 * 2. Locations (Von/Nach)
 * 3. Apartment size
 * 4. Move date
 * 5. Services selection
 * 6. Price estimate reveal
 * 7. Company matching
 * 8. Contact & submission
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Bot, User, Home, Building2, Briefcase, MapPin, Calendar,
  Package, Brush, Trash2, Warehouse, Sparkles, ArrowRight, Check,
  Phone, Mail, Shield, Star, Clock, ChevronDown, Loader2, Users, Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { DEMO_COMPANIES, getCompaniesByRegion } from "@/data/companies";
import { getCantonFromZip } from "@/lib/zip-to-canton";
import { getCantonConfig } from "@/lib/cantonConfigMap";
import { cn } from "@/lib/utils";
import { ChatVideoAnalyzer } from "./ChatVideoAnalyzer";
import { useCaptureMode } from "@/hooks/use-capture-mode";
import { CaptureReadySentinel } from "@/components/CaptureReadySentinel";
// Types
interface Message {
  id: string;
  type: "bot" | "user" | "options" | "price" | "companies" | "contact" | "success" | "video";
  content: string;
  options?: ChatOption[];
  priceData?: PriceData;
  companies?: Company[];
  timestamp: Date;
  typing?: boolean;
}

interface ChatOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  sublabel?: string;
  selected?: boolean;
}

interface PriceData {
  min: number;
  max: number;
  services: string[];
  savings?: number;
}

interface Company {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  priceMin: number;
  priceMax: number;
  featured: boolean;
  badge?: string;
}

interface FormState {
  moveType: string;
  fromLocation: string;
  toLocation: string;
  apartmentSize: string;
  moveDate: string;
  moveDateFlexible: boolean;
  selectedServices: string[];
  selectedCompanies: string[];
  name: string;
  email: string;
  phone: string;
  videoAnalysis?: {
    itemCount: number;
    volumeEstimate: string;
    suggestedServices: string[];
    priceAdjustment: number;
  };
}

// Price calculation
const calculatePrice = (size: string, services: string[]): PriceData => {
  const basePrices: Record<string, { min: number; max: number }> = {
    "studio": { min: 480, max: 680 },
    "1-1.5": { min: 580, max: 850 },
    "2-2.5": { min: 780, max: 1200 },
    "3-3.5": { min: 980, max: 1600 },
    "4-4.5": { min: 1400, max: 2200 },
    "5+": { min: 1800, max: 3200 },
    "office": { min: 2500, max: 5000 },
  };

  const serviceAddons: Record<string, number> = {
    einpacken: 400,
    auspacken: 300,
    reinigung: 350,
    entsorgung: 200,
    lagerung: 150,
  };

  const base = basePrices[size] || { min: 900, max: 1500 };
  let min = base.min;
  let max = base.max;

  services.forEach(s => {
    if (serviceAddons[s]) {
      min += serviceAddons[s] * 0.8;
      max += serviceAddons[s] * 1.2;
    }
  });

  const bundleSavings = services.length >= 3 ? Math.round((min + max) / 2 * 0.15) : 0;

  return {
    min: Math.round(min - bundleSavings * 0.5),
    max: Math.round(max - bundleSavings * 0.5),
    services,
    savings: bundleSavings,
  };
};

// Get matching companies
const getMatchingCompanies = (fromZip: string, size: string): Company[] => {
  const cantonSlug = getCantonFromZip(fromZip);
  let companies: any[] = [];

  if (cantonSlug) {
    const config = getCantonConfig(cantonSlug);
    if (config?.companies?.length) {
      companies = config.companies.map((c, i) => ({
        id: `${cantonSlug}-${i}`,
        name: c.name,
        rating: c.rating,
        reviewCount: c.reviews,
        priceLevel: c.priceLevel,
        featured: c.sponsored,
        badge: c.badge,
      }));
    }
  }

  if (!companies.length) {
    companies = DEMO_COMPANIES.slice(0, 6).map(c => ({
      id: c.id,
      name: c.name,
      rating: c.rating,
      reviewCount: c.review_count,
      priceLevel: c.price_level,
      featured: c.is_featured,
    }));
  }

  // Add price estimates
  const basePrices: Record<string, { min: number; max: number }> = {
    "studio": { min: 480, max: 680 },
    "1-1.5": { min: 580, max: 850 },
    "2-2.5": { min: 780, max: 1200 },
    "3-3.5": { min: 980, max: 1600 },
    "4-4.5": { min: 1400, max: 2200 },
    "5+": { min: 1800, max: 3200 },
  };

  const base = basePrices[size] || { min: 900, max: 1500 };

  return companies.slice(0, 6).map(c => {
    const mult = c.priceLevel === "günstig" ? 0.85 : c.priceLevel === "premium" ? 1.2 : 1;
    return {
      ...c,
      priceMin: Math.round(base.min * mult),
      priceMax: Math.round(base.max * mult),
    };
  }).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
};

// Chat flow steps
type FlowStep = 
  | "welcome"
  | "moveType"
  | "fromLocation"
  | "toLocation"
  | "apartmentSize"
  | "videoOffer"
  | "moveDate"
  | "services"
  | "priceReveal"
  | "companies"
  | "contact"
  | "submitting"
  | "success";

export function ChatFunnelV2e() {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Capture mode for screenshot automation
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<FlowStep>("welcome");
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [formState, setFormState] = useState<FormState>(() => {
    // Pre-fill with demo data in capture mode
    if (isCaptureMode) {
      return {
        moveType: "wohnung",
        fromLocation: demoData.fromLocation,
        toLocation: demoData.toLocation,
        apartmentSize: demoData.apartmentSize,
        moveDate: "month",
        moveDateFlexible: false,
        selectedServices: demoData.selectedServices,
        selectedCompanies: demoData.selectedCompanies,
        name: demoData.name,
        email: demoData.email,
        phone: demoData.phone,
      };
    }
    return {
      moveType: "",
      fromLocation: "",
      toLocation: "",
      apartmentSize: "",
      moveDate: "",
      moveDateFlexible: false,
      selectedServices: ["umzug"],
      selectedCompanies: [],
      name: "",
      email: "",
      phone: "",
    };
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Add bot message with typing delay
  const addBotMessage = useCallback((
    content: string,
    options?: Partial<Message>,
    delay = 800
  ) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const id = `msg-${Date.now()}`;
      setMessages(prev => [...prev, {
        id,
        type: "bot",
        content,
        timestamp: new Date(),
        ...options,
      }]);
    }, delay);
  }, []);

  // Add user message
  const addUserMessage = useCallback((content: string) => {
    const id = `msg-${Date.now()}`;
    setMessages(prev => [...prev, {
      id,
      type: "user",
      content,
      timestamp: new Date(),
    }]);
  }, []);

  // Unified step mapping - single source of truth
  const STEP_MAP: Record<FlowStep, number> = {
    welcome: 0,
    moveType: 1,
    fromLocation: 2,
    toLocation: 3,
    apartmentSize: 4,
    videoOffer: 5,
    moveDate: 6,
    services: 7,
    priceReveal: 8,
    companies: 9,
    contact: 10,
    submitting: 11,
    success: 12,
  };

  const REVERSE_STEP_MAP: Record<number, FlowStep> = Object.fromEntries(
    Object.entries(STEP_MAP).map(([k, v]) => [v, k as FlowStep])
  ) as Record<number, FlowStep>;

  // Map capture step number to FlowStep
  const getFlowStepFromNumber = (stepNum: number): FlowStep => {
    return REVERSE_STEP_MAP[stepNum] || "moveType";
  };

  // Get step number for CaptureReadySentinel
  const getStepNumber = (): number => {
    return STEP_MAP[currentStep] || 1;
  };

  // Initialize chat - with capture mode support
  useEffect(() => {
    if (messages.length === 0) {
      // In capture mode, skip to the target step immediately
      if (isCaptureMode && captureStep !== null) {
        const targetStep = getFlowStepFromNumber(captureStep);
        setCurrentStep(targetStep);
        
        // Create minimal messages for the target step
        const stepMessages = generateMessagesForStep(targetStep);
        setMessages(stepMessages);
        return;
      }

      // Normal flow - First message
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([{
          id: `msg-${Date.now()}`,
          type: "bot",
          content: "Hallo! 👋 Ich bin Ihr persönlicher Umzugsberater. In nur 2 Minuten finde ich die besten Angebote für Sie.",
          timestamp: new Date(),
        }]);
        
        // Second message with options
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
              id: `msg-${Date.now()}`,
              type: "options" as const,
              content: "Was möchten Sie umziehen?",
              options: [
                { id: "wohnung", label: "Wohnung", icon: <Home className="w-5 h-5" /> },
                { id: "haus", label: "Haus", icon: <Building2 className="w-5 h-5" /> },
                { id: "buero", label: "Büro/Firma", icon: <Briefcase className="w-5 h-5" /> },
              ],
              timestamp: new Date(),
            }]);
            setCurrentStep("moveType");
          }, 800);
        }, 800);
      }, 500);
    }
  }, [isCaptureMode, captureStep]);

  // Generate messages for a specific step (for capture mode)
  // This creates a realistic conversation history leading up to the target step
  const generateMessagesForStep = (step: FlowStep): Message[] => {
    const messages: Message[] = [];
    const now = new Date();
    
    // Step 1: Always start with intro
    messages.push({
      id: "msg-intro",
      type: "bot",
      content: "Hallo! 👋 Ich bin Ihr persönlicher Umzugsberater. In nur 2 Minuten finde ich die besten Angebote für Sie.",
      timestamp: now,
    });

    // For moveType step, just show the options
    if (step === "moveType") {
      messages.push({
        id: "msg-movetype",
        type: "options",
        content: "Was möchten Sie umziehen?",
        options: [
          { id: "wohnung", label: "Wohnung", icon: <Home className="w-5 h-5" /> },
          { id: "haus", label: "Haus", icon: <Building2 className="w-5 h-5" /> },
          { id: "buero", label: "Büro/Firma", icon: <Briefcase className="w-5 h-5" /> },
        ],
        timestamp: now,
      });
      return messages;
    }

    // Step 2+: Add moveType selection and response
    messages.push({
      id: "msg-movetype",
      type: "options",
      content: "Was möchten Sie umziehen?",
      options: [
        { id: "wohnung", label: "Wohnung", icon: <Home className="w-5 h-5" />, selected: true },
        { id: "haus", label: "Haus", icon: <Building2 className="w-5 h-5" /> },
        { id: "buero", label: "Büro/Firma", icon: <Briefcase className="w-5 h-5" /> },
      ],
      timestamp: now,
    });
    messages.push({
      id: "msg-user-type",
      type: "user",
      content: "Wohnung",
      timestamp: now,
    });

    if (step === "fromLocation") {
      messages.push({
        id: "msg-from",
        type: "bot",
        content: "Super, ein Wohnungs-Umzug. Von welcher PLZ/Stadt ziehen Sie um?",
        timestamp: now,
      });
      return messages;
    }

    // Step 3+: Add from location
    messages.push({
      id: "msg-from",
      type: "bot",
      content: "Super, ein Wohnungs-Umzug. Von welcher PLZ/Stadt ziehen Sie um?",
      timestamp: now,
    });
    messages.push({
      id: "msg-user-from",
      type: "user",
      content: demoData.fromLocation,
      timestamp: now,
    });

    if (step === "toLocation") {
      messages.push({
        id: "msg-to",
        type: "bot",
        content: `Perfekt, ${demoData.fromCity}! Und wohin geht der Umzug?`,
        timestamp: now,
      });
      return messages;
    }

    // Step 4+: Add to location
    messages.push({
      id: "msg-to",
      type: "bot",
      content: `Perfekt, ${demoData.fromCity}! Und wohin geht der Umzug?`,
      timestamp: now,
    });
    messages.push({
      id: "msg-user-to",
      type: "user",
      content: demoData.toLocation,
      timestamp: now,
    });

    if (step === "apartmentSize") {
      messages.push({
        id: "msg-size",
        type: "options",
        content: `${demoData.fromCity} nach ${demoData.toCity} – wie gross ist Ihre Wohnung?`,
        options: [
          { id: "studio", label: "Studio", sublabel: "1 Zimmer" },
          { id: "2-2.5", label: "2-2.5 Zi.", sublabel: "Mittel" },
          { id: "3-3.5", label: "3-3.5 Zi.", sublabel: "Standard" },
          { id: "4-4.5", label: "4-4.5 Zi.", sublabel: "Gross" },
        ],
        timestamp: now,
      });
      return messages;
    }

    // Step 5+: Add apartment size
    messages.push({
      id: "msg-size",
      type: "options",
      content: `${demoData.fromCity} nach ${demoData.toCity} – wie gross ist Ihre Wohnung?`,
      options: [
        { id: "studio", label: "Studio", sublabel: "1 Zimmer" },
        { id: "2-2.5", label: "2-2.5 Zi.", sublabel: "Mittel" },
        { id: "3-3.5", label: "3-3.5 Zi.", sublabel: "Standard", selected: true },
        { id: "4-4.5", label: "4-4.5 Zi.", sublabel: "Gross" },
      ],
      timestamp: now,
    });
    messages.push({
      id: "msg-user-size",
      type: "user",
      content: "3-3.5 Zimmer",
      timestamp: now,
    });

    if (step === "videoOffer") {
      messages.push({
        id: "msg-video",
        type: "video",
        content: "Möchten Sie ein Video Ihrer Wohnung hochladen? So kann ich noch genauere Angebote ermitteln.",
        timestamp: now,
      });
      return messages;
    }

    // Step 6+: Skip video (common path)
    messages.push({
      id: "msg-video-skip",
      type: "bot",
      content: "Kein Problem, wir machen weiter ohne Video.",
      timestamp: now,
    });

    if (step === "moveDate") {
      messages.push({
        id: "msg-date",
        type: "options",
        content: "Wann soll der Umzug stattfinden?",
        options: [
          { id: "soon", label: "In den nächsten 2 Wochen" },
          { id: "month", label: "In 1-2 Monaten" },
          { id: "later", label: "In 3+ Monaten" },
          { id: "flexible", label: "Bin flexibel" },
        ],
        timestamp: now,
      });
      return messages;
    }

    // Step 7+: Add move date
    messages.push({
      id: "msg-date",
      type: "options",
      content: "Wann soll der Umzug stattfinden?",
      options: [
        { id: "soon", label: "In den nächsten 2 Wochen" },
        { id: "month", label: "In 1-2 Monaten", selected: true },
        { id: "later", label: "In 3+ Monaten" },
        { id: "flexible", label: "Bin flexibel" },
      ],
      timestamp: now,
    });
    messages.push({
      id: "msg-user-date",
      type: "user",
      content: "In 1-2 Monaten",
      timestamp: now,
    });

    if (step === "services") {
      messages.push({
        id: "msg-services",
        type: "options",
        content: "Welche Zusatzleistungen benötigen Sie? (Mehrfachauswahl möglich)",
        options: [
          { id: "umzug", label: "Umzug (Basis)", description: "Transport & Möbelaufbau", selected: true },
          { id: "einpacken", label: "Einpack-Service", description: "Wir packen alles ein" },
          { id: "reinigung", label: "Endreinigung", description: "Abgabegarantie" },
          { id: "entsorgung", label: "Entsorgung", description: "Möbel & Sperrgut" },
        ],
        timestamp: now,
      });
      return messages;
    }

    // Step 8+: Add services
    messages.push({
      id: "msg-services",
      type: "options",
      content: "Welche Zusatzleistungen benötigen Sie?",
      options: [
        { id: "umzug", label: "Umzug (Basis)", selected: true },
        { id: "einpacken", label: "Einpack-Service", selected: true },
        { id: "reinigung", label: "Endreinigung", selected: true },
      ],
      timestamp: now,
    });
    messages.push({
      id: "msg-user-services",
      type: "user",
      content: "Umzug, Einpacken, Reinigung",
      timestamp: now,
    });

    if (step === "priceReveal") {
      messages.push({
        id: "msg-price",
        type: "price",
        content: "Basierend auf Ihren Angaben habe ich die besten Angebote gefunden:",
        priceData: { min: 1280, max: 1950, services: ["umzug", "einpacken", "reinigung"], savings: 320 },
        timestamp: now,
      });
      return messages;
    }

    // Step 9+: Add price reveal
    messages.push({
      id: "msg-price",
      type: "price",
      content: "Basierend auf Ihren Angaben:",
      priceData: { min: 1280, max: 1950, services: ["umzug", "einpacken", "reinigung"], savings: 320 },
      timestamp: now,
    });
    messages.push({
      id: "msg-user-price",
      type: "user",
      content: "Zeig mir die Firmen",
      timestamp: now,
    });

    if (step === "companies") {
      messages.push({
        id: "msg-companies",
        type: "companies",
        content: "Hier sind die 5 besten Umzugsfirmen für Ihre Route:",
        companies: getMatchingCompanies(demoData.fromPostal, demoData.apartmentSize),
        timestamp: now,
      });
      return messages;
    }

    // Step 10: Contact
    messages.push({
      id: "msg-companies",
      type: "companies",
      content: "Hier sind die 5 besten Umzugsfirmen für Ihre Route:",
      companies: getMatchingCompanies(demoData.fromPostal, demoData.apartmentSize),
      timestamp: now,
    });
    messages.push({
      id: "msg-user-companies",
      type: "user",
      content: "3 Firmen ausgewählt",
      timestamp: now,
    });

    if (step === "contact") {
      messages.push({
        id: "msg-contact",
        type: "contact",
        content: "Ausgezeichnete Wahl! Wohin sollen wir die kostenlosen Offerten senden?",
        timestamp: now,
      });
      return messages;
    }

    return messages;
  };


  // Handle option selection
  const handleOptionSelect = (optionId: string, label: string) => {
    addUserMessage(label);

    const updateAndProceed = (field: keyof FormState, value: string | string[]) => {
      setFormState(prev => ({ ...prev, [field]: value }));
    };

    switch (currentStep) {
      case "moveType":
        updateAndProceed("moveType", optionId);
        setTimeout(() => {
          addBotMessage(
            optionId === "buero" 
              ? "Perfekt, ein Firmenumzug. Von welcher PLZ/Stadt ziehen Sie um?"
              : `Super, ein ${label}-Umzug. Von welcher PLZ/Stadt ziehen Sie um?`,
            {},
            600
          );
          setCurrentStep("fromLocation");
          setTimeout(() => inputRef.current?.focus(), 800);
        }, 400);
        break;

      case "apartmentSize":
        updateAndProceed("apartmentSize", optionId);
        setTimeout(() => {
          addBotMessage(
            "Möchten Sie ein Video Ihrer Wohnung hochladen? Unsere KI kann den Umfang genauer einschätzen.",
            { type: "video" },
            600
          );
          setCurrentStep("videoOffer");
        }, 400);
        break;

      case "videoOffer":
        // This case handles if user somehow selects an option here (shouldn't happen)
        break;

      case "moveDate": {
        setFormState(prev => ({
          ...prev,
          moveDate: optionId,
          moveDateFlexible: optionId === "flexible",
        }));
        
        setTimeout(() => {
          addBotMessage(
            "Welche Leistungen benötigen Sie? (Mehrfachauswahl möglich)",
            {
              type: "options",
              options: [
                { id: "umzug", label: "Umzug (Basis)", description: "Transport & Tragen", selected: true },
                { id: "einpacken", label: "Einpack-Service", description: "+CHF 300-500" },
                { id: "auspacken", label: "Auspack-Service", description: "+CHF 200-400" },
                { id: "reinigung", label: "Endreinigung", description: "+CHF 250-450" },
                { id: "entsorgung", label: "Entsorgung", description: "+CHF 150-300" },
                { id: "lagerung", label: "Zwischenlagerung", description: "+CHF 100-200/Mt" },
              ],
            },
            600
          );
          setCurrentStep("services");
        }, 400);
        break;
      }

      default:
        break;
    }
  };

  // Handle services selection (multi-select)
  const handleServicesConfirm = (selectedIds: string[]) => {
    const services = selectedIds.length ? selectedIds : ["umzug"];
    setFormState(prev => ({ ...prev, selectedServices: services }));
    
    const labels = services.map(id => {
      const map: Record<string, string> = {
        umzug: "Umzug",
        einpacken: "Einpacken",
        auspacken: "Auspacken",
        reinigung: "Reinigung",
        entsorgung: "Entsorgung",
        lagerung: "Lagerung",
      };
      return map[id] || id;
    });
    
    addUserMessage(labels.join(", "));

    // Calculate and show price
    setTimeout(() => {
      const priceData = calculatePrice(formState.apartmentSize, services);
      
      addBotMessage(
        "Basierend auf Ihren Angaben habe ich den Preis berechnet:",
        {
          type: "price",
          priceData,
        },
        800
      );

      // Then show companies
      setTimeout(() => {
        const fromZip = formState.fromLocation.split(" ")[0];
        const companies = getMatchingCompanies(fromZip, formState.apartmentSize);
        
        // Pre-select top 3
        const preSelected = companies.slice(0, 3).map(c => c.id);
        setFormState(prev => ({ ...prev, selectedCompanies: preSelected }));

        addBotMessage(
          `Ich habe ${companies.length} passende Firmen in Ihrer Region gefunden. Wählen Sie mindestens 3 für den Vergleich:`,
          {
            type: "companies",
            companies,
          },
          1000
        );
        setCurrentStep("companies");
      }, 1500);
    }, 600);

    setCurrentStep("priceReveal");
  };

  // Handle video analysis completion
  const handleVideoAnalysis = (result: { itemCount: number; volumeEstimate: string; suggestedServices: string[]; priceAdjustment: number }) => {
    setFormState(prev => ({ ...prev, videoAnalysis: result }));
    addUserMessage(`Video analysiert: ${result.itemCount} Gegenstände, ${result.volumeEstimate}`);
    
    // Add suggested services from AI
    if (result.suggestedServices.length > 0) {
      setFormState(prev => ({
        ...prev,
        selectedServices: [...new Set([...prev.selectedServices, ...result.suggestedServices])],
      }));
    }

    proceedToMoveDate();
  };

  // Handle video skip
  const handleVideoSkip = () => {
    addUserMessage("Übersprungen");
    proceedToMoveDate();
  };

  // Proceed to move date step
  const proceedToMoveDate = () => {
    setTimeout(() => {
      addBotMessage(
        "Wann soll der Umzug stattfinden?",
        {
          type: "options",
          options: [
            { id: "soon", label: "In den nächsten 2 Wochen", sublabel: "Dringend" },
            { id: "month", label: "In 1-2 Monaten", sublabel: "Geplant" },
            { id: "later", label: "In 3+ Monaten", sublabel: "Flexibel" },
            { id: "flexible", label: "Noch nicht sicher", sublabel: "Datum offen" },
          ],
        },
        600
      );
      setCurrentStep("moveDate");
    }, 400);
  };

  // Handle company selection confirmation
  const handleCompaniesConfirm = (selectedIds: string[]) => {
    if (selectedIds.length < 3) {
      addBotMessage("Bitte wählen Sie mindestens 3 Firmen für einen aussagekräftigen Vergleich.", {}, 300);
      return;
    }

    setFormState(prev => ({ ...prev, selectedCompanies: selectedIds }));
    addUserMessage(`${selectedIds.length} Firmen ausgewählt`);

    setTimeout(() => {
      addBotMessage(
        "Ausgezeichnet! Fast geschafft. Wohin sollen wir die Offerten senden?",
        { type: "contact" },
        600
      );
      setCurrentStep("contact");
    }, 400);
  };

  // Handle text input (locations)
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const value = inputValue.trim();
    setInputValue("");
    addUserMessage(value);

    switch (currentStep) {
      case "fromLocation":
        setFormState(prev => ({ ...prev, fromLocation: value }));
        setTimeout(() => {
          // Issue #7 - Add confirmation before next question
          const city = value.split(" ").slice(1).join(" ") || value;
          addBotMessage(`Alles klar, Start: ${city}. Und wohin geht der Umzug?`, {}, 600);
          setCurrentStep("toLocation");
          setTimeout(() => inputRef.current?.focus(), 800);
        }, 400);
        break;

      case "toLocation":
        setFormState(prev => ({ ...prev, toLocation: value }));
        setTimeout(() => {
          // Issue #7 - Add confirmation with both locations
          const fromCity = formState.fromLocation.split(" ").slice(1).join(" ") || formState.fromLocation;
          const toCity = value.split(" ").slice(1).join(" ") || value;
          
          const sizeOptions = formState.moveType === "buero"
            ? [
                { id: "small", label: "Klein (1-5 MA)", sublabel: "Einzelbüro" },
                { id: "medium", label: "Mittel (6-20 MA)", sublabel: "Büroetage" },
                { id: "large", label: "Gross (20+ MA)", sublabel: "Gebäude" },
              ]
            : [
                { id: "studio", label: "Studio", sublabel: "1 Zimmer" },
                { id: "1-1.5", label: "1-1.5 Zi.", sublabel: "Klein" },
                { id: "2-2.5", label: "2-2.5 Zi.", sublabel: "Mittel" },
                { id: "3-3.5", label: "3-3.5 Zi.", sublabel: "Standard" },
                { id: "4-4.5", label: "4-4.5 Zi.", sublabel: "Gross" },
                { id: "5+", label: "5+ Zi.", sublabel: "Sehr gross" },
              ];

          addBotMessage(
            `${fromCity} → ${toCity} – wie gross ist Ihre Wohnung?`,
            {
              type: "options",
              options: sizeOptions,
            },
            600
          );
          setCurrentStep("apartmentSize");
        }, 400);
        break;

      default:
        break;
    }
  };

  // Handle contact form submission
  const handleContactSubmit = (data: { name: string; email: string; phone: string }) => {
    setFormState(prev => ({ ...prev, ...data }));
    addUserMessage(`${data.name} - ${data.email}`);
    setCurrentStep("submitting");

    setTimeout(() => {
      addBotMessage(
        "Ihre Anfrage wird verarbeitet...",
        {},
        300
      );

      setTimeout(() => {
        setCurrentStep("success");
        
        // Navigate to confirmation
        const priceData = calculatePrice(formState.apartmentSize, formState.selectedServices);
        const params = new URLSearchParams({
          type: formState.moveType,
          from: formState.fromLocation,
          to: formState.toLocation,
          size: formState.apartmentSize,
          services: formState.selectedServices.join(","),
          companies: formState.selectedCompanies.join(","),
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          priceMin: priceData.min.toString(),
          priceMax: priceData.max.toString(),
          source: "chat-v2e",
        });

        navigate(`/umzugsofferten/bestaetigung?${params.toString()}`);
      }, 1500);
    }, 400);
  };

  // Render different message types - All 30 UX issues fixed
  const renderMessage = (message: Message) => {
    switch (message.type) {
      case "bot":
        return (
          /* Issue #18 - More vertical spacing between messages */
          <div className="flex gap-3 sm:gap-3.5 max-w-[95%] sm:max-w-[88%]">
            {/* Issue #12 - Larger, more distinct bot avatar */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-primary" />
            </div>
            {/* Issue #14 - Consistent rounded corners for all chat bubbles */}
            <div className="bg-muted/90 rounded-2xl rounded-tl-lg px-4 sm:px-5 py-3 sm:py-3.5 shadow-sm">
              {/* Issue #1, #3 - Better text wrapping and readable font size */}
              <p className="text-base sm:text-base leading-relaxed break-words overflow-wrap-anywhere hyphens-auto">{message.content}</p>
            </div>
          </div>
        );

      case "user":
        return (
          /* Issue #18 - Consistent spacing for user messages */
          <div className="flex justify-end pl-4 sm:pl-8">
            {/* Issue #8, #14, #17, #19 - Consistent rounded corners matching bot messages */}
            <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-lg px-4 sm:px-5 py-3 sm:py-3.5 max-w-[85%] sm:max-w-[80%] shadow-md">
              {/* Issue #1, #3 - Readable font size (min 16px on mobile) */}
              <p className="text-base sm:text-base leading-relaxed break-words overflow-wrap-anywhere">{message.content}</p>
            </div>
          </div>
        );

      case "options":
        return (
          <div className="flex gap-3 sm:gap-3.5 max-w-full">
            {/* Issue #12 - Larger bot avatar for better distinction */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0 space-y-4">
              {/* Issue #14 - Consistent chat bubble styling */}
              <div className="bg-muted/90 rounded-2xl rounded-tl-lg px-4 sm:px-5 py-3 sm:py-3.5 shadow-sm">
                {/* Issue #1, #3, #25 - Readable text with proper wrapping */}
                <p className="text-base sm:text-base leading-relaxed break-words overflow-wrap-anywhere hyphens-auto">{message.content}</p>
              </div>
              {currentStep === "services" ? (
                <ServicesSelector
                  options={message.options || []}
                  onConfirm={handleServicesConfirm}
                />
              ) : (
                /* Issue #2, #5, #10, #17, #24 - Consistent button grid with 44px+ touch targets */
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 w-full">
                  {message.options?.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id, opt.label)}
                      /* Issue #2 - Min 44x44px touch targets, better spacing */
                      className="flex items-center justify-center sm:justify-start gap-3 px-4 sm:px-5 py-4 min-h-[56px] sm:min-h-[60px] bg-card border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 active:scale-[0.98] transition-all group touch-manipulation shadow-sm"
                    >
                      {opt.icon && (
                        <span className="text-primary group-hover:text-primary transition-colors flex-shrink-0">
                          {opt.icon}
                        </span>
                      )}
                      <div className="text-center sm:text-left min-w-0">
                        {/* Issue #5 - Consistent button text styling */}
                        <div className="text-base font-semibold leading-tight text-foreground">{opt.label}</div>
                        {opt.sublabel && (
                          <div className="text-sm text-muted-foreground mt-0.5 leading-tight">{opt.sublabel}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "video":
        return (
          <div className="flex gap-2.5 sm:gap-3 max-w-full">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-muted/80 rounded-2xl rounded-tl-md px-3.5 sm:px-4 py-2.5 sm:py-3 mb-3 shadow-sm">
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {currentStep === "videoOffer" && (
                <ChatVideoAnalyzer 
                  onAnalysisComplete={handleVideoAnalysis}
                  onSkip={handleVideoSkip}
                />
              )}
            </div>
          </div>
        );

      case "price":
        return (
          <div className="flex gap-2.5 sm:gap-3 max-w-full">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-muted/80 rounded-2xl rounded-tl-md px-3.5 sm:px-4 py-2.5 sm:py-3 mb-3 shadow-sm">
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              <PriceRevealCard priceData={message.priceData!} />
            </div>
          </div>
        );

      case "companies":
        return (
          <div className="flex gap-2.5 sm:gap-3 max-w-full">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-muted/80 rounded-2xl rounded-tl-md px-3.5 sm:px-4 py-2.5 sm:py-3 mb-3 shadow-sm">
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              <CompanySelector
                companies={message.companies || []}
                initialSelected={formState.selectedCompanies}
                onConfirm={handleCompaniesConfirm}
              />
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="flex gap-2.5 sm:gap-3 max-w-full">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-muted/80 rounded-2xl rounded-tl-md px-3.5 sm:px-4 py-2.5 sm:py-3 mb-3 shadow-sm">
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              <ContactForm onSubmit={handleContactSubmit} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Progress calculation based on step
  const getProgress = (): number => {
    const steps: Record<FlowStep, number> = {
      welcome: 0,
      moveType: 10,
      fromLocation: 20,
      toLocation: 30,
      apartmentSize: 40,
      videoOffer: 50,
      moveDate: 55,
      services: 65,
      priceReveal: 75,
      companies: 85,
      contact: 95,
      submitting: 98,
      success: 100,
    };
    return steps[currentStep] || 0;
  };

  const progress = getProgress();

  // Show loading overlay between steps (when typing animation is happening)
  const showLoadingOverlay = isTyping;

  return (
    /* Issue #22 - Proper height calculation to avoid mobile nav overlap */
    <div className="flex flex-col h-[calc(100dvh-5rem)] sm:h-[calc(100vh-8rem)] md:h-[650px] bg-card rounded-2xl border border-border shadow-premium overflow-hidden max-w-full overflow-x-hidden relative">
      {/* Loading overlay between steps */}
      <AnimatePresence>
        {showLoadingOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-40 bg-background/60 backdrop-blur-[2px] flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="bg-card rounded-2xl shadow-lg border border-border px-6 py-4 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground font-medium">Bitte warten...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Issue #28 - More prominent progress bar at top */}
      <div className="bg-gradient-to-r from-primary/5 via-background to-secondary/5 border-b border-border flex-shrink-0">
        {/* Issue #28 - Taller, more visible progress bar */}
        <div className="h-3 bg-muted relative overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          {/* Progress percentage overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary-foreground drop-shadow-sm">{progress > 10 ? `${progress}%` : ''}</span>
          </div>
        </div>
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Issue #12 - Larger, more visible bot avatar */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              {/* Issue #8 - Consistent online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-green-500 border-2 border-background shadow-sm" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-foreground">Umzugs-Assistent</h3>
              {/* Issue #28 - Prominent progress display */}
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-700 dark:text-green-400 font-semibold">Online</span>
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
            </div>
          </div>
          {/* Issue #4, #7, #15, #16, #20 - Prominent, always-visible call CTA */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Issue #8 - Consistent badge on all screen sizes */}
            <Badge className="bg-green-600 text-white border-0 text-xs sm:text-sm font-bold px-2.5 py-1.5 shadow-md">
              <Shield className="w-3.5 h-3.5 mr-1" />
              <span className="hidden xs:inline">100% </span>Gratis
            </Badge>
            {/* Issue #4, #16 - Prominent call button with min 44x44 touch target */}
            <a 
              href="tel:+41445057070" 
              className="flex items-center gap-2 px-4 py-2.5 min-w-[48px] min-h-[48px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-sm sm:text-base font-bold transition-all touch-manipulation active:scale-95 shadow-lg"
              aria-label="Jetzt anrufen"
            >
              <Phone className="w-5 h-5" />
              <span className="hidden sm:inline">Anrufen</span>
            </a>
          </div>
        </div>
      </div>

      {/* Issue #18, #26 - More padding and spacing between messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 sm:py-5 space-y-5 sm:space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderMessage(msg)}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator with consistent styling */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 sm:gap-3.5"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-primary" />
            </div>
            <div className="bg-muted/90 rounded-2xl rounded-tl-lg px-4 py-3.5 shadow-sm">
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Issue #11, #23, #29, #30 - Better input with always-visible send button */}
      {(currentStep === "fromLocation" || currentStep === "toLocation") && (
        <form onSubmit={handleTextSubmit} className="p-4 sm:p-5 border-t border-border bg-card flex-shrink-0 safe-area-pb">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                /* Issue #11 - Different placeholder examples for from/to */
                placeholder={currentStep === "fromLocation" ? "z.B. 8048 Zürich" : "z.B. 3011 Bern"}
                className="pl-12 min-h-[56px] text-base border-2 focus:border-primary rounded-xl"
                autoFocus
              />
            </div>
            {/* Issue #29 - Always visible send button */}
            <Button 
              type="submit" 
              size="icon" 
              disabled={!inputValue.trim()} 
              className="min-w-[56px] min-h-[56px] bg-primary hover:bg-primary/90 rounded-xl shadow-md"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          {/* Issue #23 - Clear input feedback */}
          <p className="text-sm text-muted-foreground mt-2.5 text-center">
            {!inputValue.trim() 
              ? `Geben Sie ${currentStep === "fromLocation" ? "Ihren aktuellen" : "den neuen"} Standort ein` 
              : inputValue.length < 4 
                ? "Bitte vollständige PLZ oder Ortsname eingeben" 
                : "↵ Enter zum Absenden"
            }
          </p>
        </form>
      )}

      {/* Issue #2, #21 - Footer with proper touch targets (min 44px) */}
      <div className="px-4 sm:px-6 py-4 border-t border-border bg-muted/50 flex items-center justify-center gap-6 sm:gap-10 text-base text-foreground flex-shrink-0 safe-area-pb">
        <div className="flex items-center gap-2 min-h-[44px]">
          <Users className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">12k+</span>
          <span className="text-muted-foreground hidden sm:inline">Umzüge</span>
        </div>
        <div className="flex items-center gap-2 min-h-[44px]">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-foreground">4.8/5</span>
        </div>
        <div className="flex items-center gap-2 min-h-[44px]">
          <Clock className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">~2 Min.</span>
        </div>
      </div>

      {/* Capture-ready sentinel for screenshot automation */}
      <CaptureReadySentinel 
        step={getStepNumber()} 
        flow="v2e" 
        isReady={!isTyping && messages.length > 0}
      />
    </div>
  );
}

// Service details data
const SERVICE_DETAILS: Record<string, { bullets: string[]; duration?: string }> = {
  umzug: {
    bullets: ["Möbel tragen & transportieren", "Professionelles Team", "Versicherungsschutz inkl."],
    duration: "Je nach Grösse 3-8 Std."
  },
  einpacken: {
    bullets: ["Kartons & Verpackungsmaterial inkl.", "Sichere Polsterung für Zerbrechliches", "Systematische Beschriftung"],
    duration: "1-2 Tage vor Umzug"
  },
  auspacken: {
    bullets: ["Auspacken aller Kartons", "Entsorgung Verpackungsmaterial", "Möbel an Wunschplatz"],
    duration: "Am Umzugstag oder danach"
  },
  reinigung: {
    bullets: ["Abgabe-Reinigung inkl. Küche & Bad", "Fenster innen & aussen", "Abnahme-Garantie"],
    duration: "1 Tag nach Auszug"
  },
  entsorgung: {
    bullets: ["Möbel & Sperrmüll mitnehmen", "Fachgerechte Entsorgung", "Auf Wunsch Elektrogeräte"],
    duration: "Am Umzugstag"
  },
  lagerung: {
    bullets: ["Sichere Lagerboxen", "Klimatisiert & versichert", "Flexible Laufzeit"],
    duration: "Ab 1 Monat buchbar"
  },
};

// Services selector with multi-select and expandable details
function ServicesSelector({ 
  options, 
  onConfirm 
}: { 
  options: ChatOption[]; 
  onConfirm: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(["umzug"]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => {
    if (id === "umzug") return; // Base service always selected
    setSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpanded(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Issue #9 - Better scroll container with more gap */}
      <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-1 relative">
        {options.map(opt => {
          const details = SERVICE_DETAILS[opt.id];
          const isExpanded = expanded === opt.id;
          const isSelected = selected.includes(opt.id);
          
          return (
            <div key={opt.id} className="relative">
              {/* Issue #5, #13, #17, #24 - Consistent button styling with 44px+ touch targets */}
              <button
                onClick={() => toggle(opt.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 sm:px-5 py-4 min-h-[60px] rounded-xl border-2 transition-all text-left touch-manipulation active:scale-[0.98] shadow-sm",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                    : "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
                  isExpanded && "rounded-b-none"
                )}
              >
                <div className="flex-1 min-w-0 pr-3">
                  {/* Issue #5 - Consistent text sizing */}
                  <div className={cn(
                    "text-base font-semibold",
                    isSelected && "text-primary"
                  )}>{opt.label}</div>
                  {opt.description && (
                    <div className="text-sm text-muted-foreground mt-0.5">{opt.description}</div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {details && (
                    /* Issue #2 - 44px+ touch target for expand button */
                    <button
                      onClick={(e) => toggleExpand(e, opt.id)}
                      className="p-2.5 rounded-full hover:bg-muted transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label="Details anzeigen"
                    >
                      <ChevronDown className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform",
                        isExpanded && "rotate-180"
                      )} />
                    </button>
                  )}
                  {/* Issue #13, #17 - Larger, more prominent checkbox */}
                  <div className={cn(
                    "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                    isSelected
                      ? "border-primary bg-primary scale-110 shadow-md"
                      : "border-muted-foreground/40 bg-background"
                  )}>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </button>
              
              {/* Expandable details */}
              <AnimatePresence>
                {isExpanded && details && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={cn(
                      "px-4 sm:px-5 py-4 border-2 border-t-0 rounded-b-xl bg-muted/50",
                      isSelected ? "border-primary" : "border-border"
                    )}>
                      <ul className="space-y-2.5">
                        {details.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      {details.duration && (
                        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-border/50 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{details.duration}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      {/* Issue #13, #27 - Prominent, always-visible continue button */}
      <Button 
        onClick={() => onConfirm(selected)} 
        className="w-full min-h-[56px] touch-manipulation text-base font-bold shadow-lg"
        size="lg"
      >
        Weiter mit {selected.length} Leistung{selected.length !== 1 ? "en" : ""}
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}

// Price reveal card
function PriceRevealCard({ priceData }: { priceData: PriceData }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/20 p-5"
    >
      <div className="text-center mb-4">
        <div className="text-xs text-muted-foreground mb-1">Geschätzter Preis</div>
        <div className="text-3xl font-bold text-primary">
          CHF {priceData.min.toLocaleString()} – {priceData.max.toLocaleString()}
        </div>
        {priceData.savings && priceData.savings > 0 && (
          <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
            <Sparkles className="w-3 h-3 mr-1" />
            CHF {priceData.savings} Paket-Rabatt
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {priceData.services.map(s => (
          <Badge key={s} variant="outline" className="text-xs">
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
}

// Company selector - Mobile optimized with call CTA
function CompanySelector({
  companies,
  initialSelected,
  onConfirm,
}: {
  companies: Company[];
  initialSelected: string[];
  onConfirm: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCall = () => {
    window.location.href = "tel:+41445057070";
  };

  return (
    <div className="space-y-3">
      {/* Issue #4 - Prominent Call CTA with proper touch target */}
      <motion.button
        onClick={handleCall}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-base transition-colors touch-manipulation active:scale-[0.98] min-h-[56px] shadow-lg"
      >
        <Phone className="w-5 h-5" />
        <span>Jetzt anrufen: 044 505 70 70</span>
      </motion.button>
      
      <div className="text-center text-sm text-muted-foreground font-medium">
        oder online Offerten erhalten
      </div>

      {/* Issue #2, #6, #17 - Consistent company cards with 44px+ touch targets */}
      <div className="grid gap-2.5 max-h-[200px] sm:max-h-[240px] overflow-y-auto pr-1">
        {companies.slice(0, 5).map(company => (
          <button
            key={company.id}
            onClick={() => toggle(company.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 min-h-[56px] rounded-xl border-2 transition-all text-left touch-manipulation active:scale-[0.98]",
              selected.includes(company.id)
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            {/* Issue #17 - Larger, consistent checkbox */}
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
              selected.includes(company.id)
                ? "border-primary bg-primary"
                : "border-muted-foreground/40"
            )}>
              {selected.includes(company.id) && (
                <Check className="w-3.5 h-3.5 text-primary-foreground" />
              )}
            </div>

            {/* Company info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm truncate">{company.name}</span>
                {company.featured && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Premium</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span>{company.rating}</span>
                <span>·</span>
                <span>{company.reviewCount} Bew.</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-bold text-primary">
                CHF {company.priceMin}–{company.priceMax}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Issue #13 - Always visible continue button */}
      <Button
        onClick={() => onConfirm(selected)}
        disabled={selected.length < 3}
        className="w-full min-h-[56px] touch-manipulation text-base font-bold shadow-lg"
        size="lg"
      >
        {selected.length < 3 
          ? `Noch ${3 - selected.length} Firma(en) wählen`
          : `Mit ${selected.length} Firmen weiter`
        }
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}

// Contact form
function ContactForm({ 
  onSubmit 
}: { 
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !privacy) return;
    
    setIsSubmitting(true);
    onSubmit({ name, email, phone });
  };

  const isValid = name.trim() && email.includes("@") && privacy;

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-card rounded-xl border border-border p-4">
      <div className="space-y-2">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ihr Name"
            className="pl-10"
            required
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-Mail für Offerten"
            className="pl-10"
            required
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Telefon (optional)"
            className="pl-10"
          />
        </div>
      </div>

      <label className="flex items-start gap-3 text-xs text-muted-foreground cursor-pointer p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors touch-manipulation">
        <input
          type="checkbox"
          checked={privacy}
          onChange={(e) => setPrivacy(e.target.checked)}
          className="mt-0.5 w-5 h-5 rounded border-2 border-muted-foreground/30 checked:bg-primary checked:border-primary"
        />
        <span className="leading-relaxed">
          Ich akzeptiere die Datenschutzerklärung und möchte kostenlose Offerten erhalten.
        </span>
      </label>

      <Button 
        type="submit" 
        className="w-full min-h-[52px] touch-manipulation text-base font-semibold" 
        size="lg"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Wird gesendet...
          </>
        ) : (
          <>
            Offerten kostenlos erhalten
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground pt-1">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>SSL gesichert</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Antwort in 24h</span>
        </div>
      </div>
    </form>
  );
}

export default ChatFunnelV2e;
