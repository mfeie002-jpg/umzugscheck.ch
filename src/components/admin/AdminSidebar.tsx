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
  Play,
  Video,
  Activity,
  Truck,
  Banknote,
  Network,
  Route,
  Database,
  FileCode,
  Palette,
  TestTube,
  Workflow,
  ListTodo,
  MailCheck,
  BookOpen,
  FolderArchive,
  Link as LinkIcon,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { getTooltipForRoute } from "@/lib/admin-handbook-data";

// ============================================================================
// COMPLETE ADMIN NAVIGATION - ALL FEATURES & TOOLS
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
  description?: string; // Added for enhanced tooltips
}

const navStructure: NavItem[] = [
  // ========== DASHBOARD ==========
  { 
    title: "Dashboard", 
    href: "/admin", 
    icon: LayoutDashboard,
    exact: true
  },
  
  // ========== COMMAND CENTERS (EXECUTIVE) ==========
  { type: "divider", title: "🎯 Command Centers" },
  { 
    title: "Unified Command Center", 
    href: "/internal/command-center", 
    icon: Target,
    highlight: true,
    badge: "HQ"
  },
  { 
    title: "Flow Command Center", 
    href: "/flow-command-center", 
    icon: Layers,
    external: true
  },
  { 
    title: "Finance & P&L", 
    href: "/internal/finance", 
    icon: Banknote,
    badge: "CFO"
  },
  { 
    title: "Paid Media Control", 
    href: "/internal/paid-media-control", 
    icon: TrendingUp
  },
  { 
    title: "90-Day Roadmap", 
    href: "/internal/launch-roadmap", 
    icon: Route
  },
  
  // ========== AI & AUTOMATION ==========
  { type: "divider", title: "🧠 AI & Automation" },
  { 
    title: "AI Command Center", 
    href: "/admin/ai-command", 
    icon: Brain,
    highlight: true,
    badge: "⚡"
  },
  { 
    title: "Task Queue (AI Autopilot)", 
    href: "/admin/task-queue", 
    icon: Bot,
    badge: "AUTO"
  },
  { 
    title: "1-Click ChatGPT Export", 
    href: "/admin/chatgpt", 
    icon: Rocket,
    badge: "NEU"
  },
  { 
    title: "ChatGPT LP Export", 
    href: "/admin/chatgpt-export", 
    icon: Send
  },
  { 
    title: "Prompt Library", 
    href: "/admin/ai-export", 
    icon: Copy
  },
  { 
    title: "Flow Generator", 
    href: "/admin/ai-command?tab=generator", 
    icon: Sparkles
  },

  // ========== LEAD & DISTRIBUTION ==========
  { type: "divider", title: "📞 Lead & Distribution" },
  { 
    title: "Lead Routing Brain", 
    href: "/internal/lead-routing", 
    icon: Route,
    badge: "AI"
  },
  { 
    title: "Lead Distribution", 
    href: "/internal/distribution", 
    icon: Network
  },
  { 
    title: "Partner Network", 
    href: "/internal/partners", 
    icon: Building2,
    badge: "B2B"
  },
  { 
    title: "Leads verwalten", 
    href: "/admin/leads", 
    icon: Users 
  },
  { 
    title: "Bieter-Aufträge", 
    href: "/admin/listings", 
    icon: Gavel
  },
  
  // ========== A/B TESTING & EXPERIMENTS ==========
  { type: "divider", title: "🧪 Testing & Experimente" },
  { 
    title: "A/B Testing", 
    href: "/admin/ab-testing", 
    icon: FlaskConical,
    highlight: true
  },
  { 
    title: "Varianten Testen", 
    href: "/admin/varianten-testen", 
    icon: TestTube
  },
  { 
    title: "Flow Tester", 
    href: "/flow-tester", 
    icon: Play,
    external: true
  },
  { 
    title: "V3 Varianten", 
    href: "/v3-varianten", 
    icon: GitCompare,
    external: true
  },
  { 
    title: "Mock Data", 
    href: "/admin/mock-data", 
    icon: Database
  },
  { 
    title: "Button Demo", 
    href: "/admin/buttons", 
    icon: Palette
  },
  
  // ========== SCREENSHOTS & CAPTURE ==========
  { type: "divider", title: "📸 Screenshots & Capture" },
  { 
    title: "Screenshot Machine", 
    href: "/admin/screenshots", 
    icon: Camera
  },
  { 
    title: "Screenshot Review", 
    href: "/admin/screenshot-review", 
    icon: Eye
  },
  { 
    title: "Flow Analysis Framework", 
    href: "/admin/analysis-framework", 
    icon: Workflow
  },
  { 
    title: "Flow Feedback Variants", 
    href: "/admin/flow-feedback-variants", 
    icon: GitCompare
  },
  { 
    title: "ZIP Export", 
    href: "/admin/zip-export", 
    icon: FolderArchive
  },
  
  // ========== ANALYTICS & REPORTS ==========
  { type: "divider", title: "📊 Analytics & Reports" },
  { 
    title: "Übersicht", 
    href: "/admin/analytics", 
    icon: BarChart3
  },
  { 
    title: "Funnel Analytics", 
    href: "/admin/funnel", 
    icon: Target
  },
  { 
    title: "Conversion Events", 
    href: "/admin/conversions", 
    icon: Zap
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
    title: "URL Tracking", 
    href: "/admin/url-tracking", 
    icon: LinkIcon
  },
  { 
    title: "Reports Generator", 
    href: "/admin/reports", 
    icon: FileText
  },
  { 
    title: "World Class Dashboard", 
    href: "/admin/world-class", 
    icon: Trophy
  },
  
  // ========== VIDEO ANALYSEN ==========
  { type: "divider", title: "🎬 Video-Analyse" },
  { 
    title: "Video-Analysen", 
    href: "/admin/video-analyses", 
    icon: Video,
    badge: "NEU",
    highlight: true
  },
  
  // ========== RELO-OS & JOURNEY ==========
  { type: "divider", title: "🚚 Relo-OS Journey" },
  { 
    title: "Relo-OS Phasen", 
    href: "/admin/relo-os-phases", 
    icon: Truck,
    highlight: true,
    badge: "DEV"
  },
  { 
    title: "Invisible Move Demo", 
    href: "/invisible-move-demo", 
    icon: Package,
    external: true
  },
  { 
    title: "Capabilities", 
    href: "/admin/capabilities", 
    icon: Shield
  },
  
  // ========== FIRMEN & PARTNER ==========
  { type: "divider", title: "🏢 Firmen & Partner" },
  { 
    title: "Firmen", 
    href: "/admin/companies", 
    icon: Building2 
  },
  { 
    title: "Partner (Providers)", 
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
    icon: CircleDollarSign 
  },
  { 
    title: "Dynamische Preise", 
    href: "/admin/dynamic-pricing", 
    icon: TrendingUp 
  },
  
  // ========== E-MAIL & AUTOMATIONS ==========
  { type: "divider", title: "📧 E-Mail & Automations" },
  { 
    title: "E-Mail Automation", 
    href: "/admin/email-automation", 
    icon: Mail 
  },
  { 
    title: "E-Mail Templates", 
    href: "/admin/email-templates", 
    icon: MailCheck 
  },
  
  // ========== LAUNCH & GROWTH ==========
  { type: "divider", title: "🚀 Launch & Growth" },
  { 
    title: "Go-Live Checklist", 
    href: "/admin/go-live", 
    icon: Rocket,
    badge: "✓"
  },
  { 
    title: "Post-Launch", 
    href: "/admin/post-launch", 
    icon: TrendingUp,
    badge: "LIVE"
  },
  { 
    title: "Phase 6 Features", 
    href: "/admin/phase-6", 
    icon: Sparkles
  },
  
  // ========== TOOLS & SETTINGS ==========
  { type: "divider", title: "🔧 Tools & Export" },
  { 
    title: "Admin Tools", 
    href: "/admin/tools", 
    icon: Wrench 
  },
  { 
    title: "Code Export", 
    href: "/admin/code-export", 
    icon: FileCode 
  },
  { 
    title: "Dokumentation", 
    href: "/admin/documentation", 
    icon: BookOpen 
  },
  { 
    title: "📖 Handbuch", 
    href: "/admin/handbuch", 
    icon: BookOpen,
    highlight: true,
    badge: "HILFE"
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
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className={cn(
      "bg-card border-r border-border h-screen sticky top-0 transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-72"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto shrink-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Quick Actions (visible when expanded) */}
      {!collapsed && (
        <div className="p-2 border-b border-border shrink-0">
          <div className="flex flex-wrap gap-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to="/internal/command-center"
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
                  >
                    <Target className="h-3 w-3" />
                    <span>Command</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Unified Command Center</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to="/admin/task-queue"
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 text-xs font-medium transition-colors"
                  >
                    <Bot className="h-3 w-3" />
                    <span>AI Tasks</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>AI Autopilot Task Queue</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to="/admin/ab-testing"
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-xs font-medium transition-colors"
                  >
                    <FlaskConical className="h-3 w-3" />
                    <span>A/B</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>A/B Testing</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2">
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
                    <span className="text-sm font-medium flex-1 truncate">{item.title}</span>
                    {item.external && (
                      <ChevronRight className="h-3 w-3 text-muted-foreground rotate-[-45deg] shrink-0" />
                    )}
                    {item.badge && (
                      <Badge variant="default" className="text-[9px] px-1 py-0 h-4 bg-orange-500 hover:bg-orange-500 shrink-0">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );

            // Wrap in tooltip - enhanced with description
            const tooltipDescription = item.href ? getTooltipForRoute(item.href) : null;
            
            if (collapsed) {
              return (
                <TooltipProvider key={item.href} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {NavContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <Badge variant="default" className="text-[9px] px-1 py-0 h-4 bg-orange-500">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {tooltipDescription && (
                          <span className="text-xs text-muted-foreground">{tooltipDescription}</span>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }

            // Also show tooltip on hover for expanded mode
            return (
              <TooltipProvider key={item.href} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {NavContent}
                  </TooltipTrigger>
                  {tooltipDescription && (
                    <TooltipContent side="right" className="max-w-xs">
                      <span className="text-xs">{tooltipDescription}</span>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-border shrink-0">
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
