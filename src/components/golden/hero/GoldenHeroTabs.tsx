/**
 * GoldenHeroTabs - Optimized hero tabs component
 * 
 * Combines best patterns from TabHint A/B test variants:
 * - Clear method labels (Variant C)
 * - Animated hints (Variant B)
 * - Badge for alternatives (Variant D)
 * - Visual distinction between tabs
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Video, Bot, MessageCircle, 
  ChevronDown, Sparkles, CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GoldenTabHint } from "./GoldenTabHint";

interface TabConfig {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
  badgeColor?: string;
}

const HERO_TABS: TabConfig[] = [
  { 
    id: "form", 
    label: "Formular", 
    shortLabel: "Formular",
    icon: FileText, 
    description: "Klassisch in 60 Sekunden",
    badge: "Beliebt",
    badgeColor: "from-primary to-primary/80"
  },
  { 
    id: "video", 
    label: "Video-Analyse", 
    shortLabel: "Video",
    icon: Video, 
    description: "30-60 Sek. Video → KI-Preisschätzung",
    badge: "40% sparen",
    badgeColor: "from-emerald-500 to-teal-500"
  },
  { 
    id: "chat", 
    label: "KI-Chat", 
    shortLabel: "Chat",
    icon: Bot, 
    description: "Persönliche Beratung mit KI",
    badge: "Neu",
    badgeColor: "from-violet-500 to-purple-500"
  },
  { 
    id: "whatsapp", 
    label: "WhatsApp", 
    shortLabel: "WA",
    icon: MessageCircle, 
    description: "Bilder schicken, Offerte erhalten"
  },
];

interface GoldenHeroTabsProps {
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  showHint?: boolean;
  children?: (tabId: string) => React.ReactNode;
  className?: string;
}

export const GoldenHeroTabs = memo(({
  defaultTab = "form",
  onTabChange,
  showHint = true,
  children,
  className
}: GoldenHeroTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Method hint above tabs */}
      {showHint && <GoldenTabHint variant="label" position="above" />}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* Tab triggers */}
        <div className="relative">
          {showHint && <GoldenTabHint variant="badge" position="above" activeTab={activeTab} />}
          
          <TabsList className="w-full h-auto p-1.5 bg-muted/50 backdrop-blur-sm rounded-xl border border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-1">
            {HERO_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "relative w-full flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg min-h-[72px]",
                    "data-[state=active]:bg-background data-[state=active]:shadow-md",
                    "transition-all duration-200",
                    !isActive && "hover:bg-background/50"
                  )}
                >
                  <div className="relative">
                    <Icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                    {tab.badge && !isActive && (
                      <span className={cn(
                        "hidden xs:inline-flex absolute -top-2 -right-2 px-1.5 py-0.5 text-[8px] font-bold text-white rounded-full",
                        `bg-gradient-to-r ${tab.badgeColor || 'from-primary to-primary/80'}`
                      )}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  
                  <span className={cn(
                    "text-xs font-medium leading-tight",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>{HERO_TABS.find(t => t.id === activeTab)?.description}</span>
          </motion.div>
        </AnimatePresence>

        {/* Tab hint below */}
        {showHint && <GoldenTabHint variant="pulsing" position="below" />}

        {/* Tab content */}
        {HERO_TABS.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            {children?.(tab.id)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
});

GoldenHeroTabs.displayName = "GoldenHeroTabs";
