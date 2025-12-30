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
  Phone, Mail, Shield, Star, Clock, ChevronDown, Loader2, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { DEMO_COMPANIES, getCompaniesByRegion } from "@/data/companies";
import { getCantonFromZip } from "@/lib/zip-to-canton";
import { getCantonConfig } from "@/lib/cantonConfigMap";
import { cn } from "@/lib/utils";

// Types
interface Message {
  id: string;
  type: "bot" | "user" | "options" | "price" | "companies" | "contact" | "success";
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

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<FlowStep>("welcome");
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [formState, setFormState] = useState<FormState>({
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

  // Initialize chat
  useEffect(() => {
    if (messages.length === 0) {
      // First message
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
  }, []);

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
          addBotMessage("Verstanden! Und wohin geht der Umzug?", {}, 600);
          setCurrentStep("toLocation");
          setTimeout(() => inputRef.current?.focus(), 800);
        }, 400);
        break;

      case "toLocation":
        setFormState(prev => ({ ...prev, toLocation: value }));
        setTimeout(() => {
          const sizeOptions = formState.moveType === "buero"
            ? [
                { id: "small", label: "Klein (1-5 Mitarbeiter)", sublabel: "Einzelbüro" },
                { id: "medium", label: "Mittel (6-20 MA)", sublabel: "Büroetage" },
                { id: "large", label: "Gross (20+ MA)", sublabel: "Ganzes Gebäude" },
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
            "Wie gross ist Ihre Wohnung?",
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

  // Render different message types
  const renderMessage = (message: Message) => {
    switch (message.type) {
      case "bot":
        return (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        );

      case "user":
        return (
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        );

      case "options":
        return (
          <div className="flex gap-3 max-w-full">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm">{message.content}</p>
              </div>
              {currentStep === "services" ? (
                <ServicesSelector
                  options={message.options || []}
                  onConfirm={handleServicesConfirm}
                />
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {message.options?.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id, opt.label)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      {opt.icon && (
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          {opt.icon}
                        </span>
                      )}
                      <div className="text-left">
                        <div className="text-sm font-medium">{opt.label}</div>
                        {opt.sublabel && (
                          <div className="text-xs text-muted-foreground">{opt.sublabel}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "price":
        return (
          <div className="flex gap-3 max-w-full">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 mb-3">
                <p className="text-sm">{message.content}</p>
              </div>
              <PriceRevealCard priceData={message.priceData!} />
            </div>
          </div>
        );

      case "companies":
        return (
          <div className="flex gap-3 max-w-full">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 mb-3">
                <p className="text-sm">{message.content}</p>
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
          <div className="flex gap-3 max-w-full">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 mb-3">
                <p className="text-sm">{message.content}</p>
              </div>
              <ContactForm onSubmit={handleContactSubmit} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[600px] bg-card rounded-2xl border border-border shadow-premium overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Umzugs-Assistent</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-green-600" />
          <span className="hidden sm:inline">100% kostenlos</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {(currentStep === "fromLocation" || currentStep === "toLocation") && (
        <form onSubmit={handleTextSubmit} className="p-4 border-t border-border bg-background/50">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentStep === "fromLocation" ? "z.B. 8001 Zürich" : "z.B. 3011 Bern"}
                className="pl-10"
                autoFocus
              />
            </div>
            <Button type="submit" size="icon" disabled={!inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            PLZ oder Stadtname eingeben
          </p>
        </form>
      )}

      {/* Footer trust elements */}
      <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>12'547 Umzüge</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500" />
          <span>4.8/5 Bewertung</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>~2 Min.</span>
        </div>
      </div>
    </div>
  );
}

// Services selector with multi-select
function ServicesSelector({ 
  options, 
  onConfirm 
}: { 
  options: ChatOption[]; 
  onConfirm: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(["umzug"]);

  const toggle = (id: string) => {
    if (id === "umzug") return; // Base service always selected
    setSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-2">
      <div className="grid gap-2">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left",
              selected.includes(opt.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div>
              <div className="text-sm font-medium">{opt.label}</div>
              {opt.description && (
                <div className="text-xs text-muted-foreground">{opt.description}</div>
              )}
            </div>
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
              selected.includes(opt.id)
                ? "border-primary bg-primary"
                : "border-muted-foreground/30"
            )}>
              {selected.includes(opt.id) && (
                <Check className="w-3 h-3 text-primary-foreground" />
              )}
            </div>
          </button>
        ))}
      </div>
      <Button 
        onClick={() => onConfirm(selected)} 
        className="w-full"
      >
        Weiter mit {selected.length} Leistung{selected.length !== 1 ? "en" : ""}
        <ArrowRight className="w-4 h-4 ml-2" />
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

// Company selector
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

  return (
    <div className="space-y-3">
      <div className="grid gap-2 max-h-[280px] overflow-y-auto pr-1">
        {companies.map(company => (
          <button
            key={company.id}
            onClick={() => toggle(company.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
              selected.includes(company.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            {/* Checkbox */}
            <div className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
              selected.includes(company.id)
                ? "border-primary bg-primary"
                : "border-muted-foreground/30"
            )}>
              {selected.includes(company.id) && (
                <Check className="w-3 h-3 text-primary-foreground" />
              )}
            </div>

            {/* Company info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{company.name}</span>
                {company.featured && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    Premium
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span>{company.rating}</span>
                </div>
                <span>·</span>
                <span>{company.reviewCount} Bewertungen</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-semibold text-primary">
                CHF {company.priceMin}–{company.priceMax}
              </div>
              <div className="text-[10px] text-muted-foreground capitalize">
                {company.priceLevel}
              </div>
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={() => onConfirm(selected)}
        disabled={selected.length < 3}
        className="w-full"
      >
        {selected.length < 3 
          ? `Noch ${3 - selected.length} Firma(en) wählen`
          : `Mit ${selected.length} Firmen weiter`
        }
        <ArrowRight className="w-4 h-4 ml-2" />
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

      <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={privacy}
          onChange={(e) => setPrivacy(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          Ich akzeptiere die Datenschutzerklärung und möchte kostenlose Offerten erhalten.
        </span>
      </label>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Wird gesendet...
          </>
        ) : (
          <>
            Offerten kostenlos erhalten
            <ArrowRight className="w-4 h-4 ml-2" />
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
