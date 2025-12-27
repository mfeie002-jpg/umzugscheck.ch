import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Home,
  Users, 
  Building2, 
  MessageSquare, 
  TrendingUp, 
  Brain, 
  Wrench,
  Download,
  Camera,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  FlaskConical,
  DollarSign,
  CreditCard,
  Mail,
  Trophy,
  FileText,
  Gauge,
  Sparkles,
  Gavel,
  Package,
  Rocket,
  Eye,
  History,
  GitCompare,
  Zap,
  Bot,
  Send,
  Copy,
  Layers,
  Settings,
  Shield,
  Clock,
  AlertTriangle,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

// ============================================================================
// NEW STRUCTURED NAVIGATION - VORZEIGEMODEL ARCHITECTURE
// ============================================================================

interface NavItem {
  title: string;
  href?: string;
  icon?: any;
  badge?: string;
  highlight?: boolean;
  exact?: boolean;
  external?: boolean;
  type?: 'divider';
}

const navStructure: NavItem[] = [
  // ========== DASHBOARD ==========
  { 
    title: "Dashboard", 
    href: "/admin", 
    icon: LayoutDashboard,
    exact: true
  },
  
  // ========== AI COMMAND CENTER (HERO) ==========
  { type: "divider", title: "🧠 AI Command Center" },
  { 
    title: "Flow Automation", 
    href: "/admin/tools?tab=flow-automation", 
    icon: Zap,
    highlight: true,
    badge: "🚀"
  },
  { 
    title: "KI-Zentrale", 
    href: "/admin/ai-command", 
    icon: Brain,
    highlight: true,
    badge: "⚡"
  },
  { 
    title: "1-Click Export", 
    href: "/admin/chatgpt", 
    icon: Rocket,
    highlight: true,
    badge: "NEU"
  },
  { 
    title: "Flow Generator", 
    href: "/admin/ai-command?tab=generator", 
    icon: Sparkles,
    badge: "AI"
  },
  { 
    title: "Prompt Library", 
    href: "/admin/ai-export", 
    icon: Copy
  },
  
  // ========== CAPTURE & EVIDENCE ==========
  { type: "divider", title: "📸 Capture & Evidence" },
  { 
    title: "Screenshot Machine", 
    href: "/admin/screenshots", 
    icon: Camera
  },
  { 
    title: "Auto-Flow Capture", 
    href: "/admin/tools", 
    icon: Layers
  },
  { 
    title: "HTML Analyzer", 
    href: "/admin/tools?tab=seo", 
    icon: FileText
  },
  { 
    title: "Regression Tests", 
    href: "/admin/tools?tab=regression", 
    icon: GitCompare
  },
  
  // ========== FUNNELS & UX ==========
  { type: "divider", title: "🎯 Funnels & UX" },
  { 
    title: "Varianten Testen", 
    href: "/admin/varianten-testen", 
    icon: Layers,
    highlight: true,
    badge: "HUB"
  },
  { 
    title: "Flow Tester", 
    href: "/flow-tester", 
    icon: Play,
    external: true  // Opens in new tab
  },
  { 
    title: "V3 Varianten", 
    href: "/v3-varianten", 
    icon: GitCompare,
    external: true
  },
  { 
    title: "Funnel Analytics", 
    href: "/admin/funnel", 
    icon: Target
  },
  { 
    title: "A/B Tests", 
    href: "/admin/ab-testing", 
    icon: FlaskConical
  },
  { 
    title: "Conversion Events", 
    href: "/admin/conversions", 
    icon: Zap
  },
  
  // ========== ANALYTICS & REPORTS ==========
  { type: "divider", title: "📊 Analytics & Reports" },
  { 
    title: "Übersicht", 
    href: "/admin/analytics", 
    icon: BarChart3
  },
  { 
    title: "ML Analytics", 
    href: "/admin/ml-analytics", 
    icon: Bot
  },
  { 
    title: "Preisanalyse", 
    href: "/admin/pricing-analytics", 
    icon: Gauge
  },
  { 
    title: "Reports", 
    href: "/admin/reports", 
    icon: FileText
  },
  
  // ========== VERWALTUNG ==========
  { type: "divider", title: "👥 Verwaltung" },
  { 
    title: "Leads", 
    href: "/admin/leads", 
    icon: Users 
  },
  { 
    title: "Bieter-Aufträge", 
    href: "/admin/listings", 
    icon: Gavel,
    badge: "NEU"
  },
  { 
    title: "Firmen", 
    href: "/admin/companies", 
    icon: Building2 
  },
  { 
    title: "Partner", 
    href: "/admin/providers", 
    icon: Building2 
  },
  { 
    title: "Bewertungen", 
    href: "/admin/reviews", 
    icon: MessageSquare 
  },
  { 
    title: "Rankings", 
    href: "/admin/rankings", 
    icon: Trophy 
  },
  { 
    title: "Verfügbarkeit", 
    href: "/admin/availability", 
    icon: Calendar 
  },
  
  // ========== BILLING & FINANCE ==========
  { type: "divider", title: "💰 Billing & Finance" },
  { 
    title: "Abrechnung", 
    href: "/admin/billing", 
    icon: CreditCard 
  },
  { 
    title: "Abos", 
    href: "/admin/subscriptions", 
    icon: DollarSign 
  },
  { 
    title: "Dynamische Preise", 
    href: "/admin/dynamic-pricing", 
    icon: TrendingUp 
  },
  
  // ========== AUTOMATIONS ==========
  { type: "divider", title: "⚙️ Automations" },
  { 
    title: "E-Mail Automation", 
    href: "/admin/email-automation", 
    icon: Mail 
  },
  { 
    title: "Scheduled Jobs", 
    href: "/admin/tools?tab=monitoring", 
    icon: Clock 
  },
  
  // ========== SETTINGS ==========
  { type: "divider", title: "🔧 Settings & Admin" },
  { 
    title: "Code Export", 
    href: "/admin/code-export", 
    icon: Download 
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    // Handle query params in href
    const [path] = href.split('?');
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={cn(
      "bg-card border-r border-border h-screen sticky top-0 transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg">Admin</span>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Quick Actions (visible when expanded) */}
      {!collapsed && (
        <div className="p-2 border-b border-border">
          <div className="flex flex-wrap gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to="/admin/ai-command"
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
                  >
                    <Rocket className="h-3 w-3" />
                    <span>AI Export</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>1-Click ChatGPT Export</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to="/admin/screenshots"
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-xs font-medium transition-colors"
                  >
                    <Camera className="h-3 w-3" />
                    <span>Capture</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Screenshot Machine</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {navStructure.map((item, index) => {
          if (item.type === "divider") {
            return (
              <div key={index} className="my-3">
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {item.title}
                  </p>
                )}
                {collapsed && <div className="border-t border-border mx-2" />}
              </div>
            );
          }

          const Icon = item.icon!;
          const active = isActive(item.href!, item.exact);

          const linkProps = item.external 
            ? { to: item.href!, target: "_blank", rel: "noopener noreferrer" }
            : { to: item.href! };

          const NavContent = (
            <Link
              key={item.href}
              {...linkProps}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-0.5 relative",
                "hover:bg-accent hover:text-accent-foreground",
                active && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                item.highlight && !active && "bg-gradient-to-r from-primary/10 to-orange-500/10 text-primary border border-primary/20 hover:from-primary/20 hover:to-orange-500/20",
                collapsed && "justify-center px-2"
              )}
            >
              {item.highlight && !collapsed && !active && (
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-orange-500" />
              )}
              <Icon className={cn(
                "h-4 w-4 shrink-0", 
                active && "text-primary-foreground",
                item.highlight && !active && "text-primary"
              )} />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1">{item.title}</span>
                  {item.external && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground rotate-[-45deg]" />
                  )}
                  {item.badge && (
                    <Badge variant="default" className="text-[9px] px-1 py-0 h-4 bg-orange-500 hover:bg-orange-500">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );

          // Wrap in tooltip for collapsed mode
          if (collapsed) {
            return (
              <TooltipProvider key={item.href} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {NavContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-2">
                    {item.title}
                    {item.badge && (
                      <Badge variant="default" className="text-[9px] px-1 py-0 h-4 bg-orange-500">
                        {item.badge}
                      </Badge>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return NavContent;
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
            "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Zur Website" : undefined}
        >
          <Home className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="text-sm">Zur Website</span>}
        </Link>
      </div>
    </aside>
  );
}
