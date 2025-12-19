import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Building2, 
  MessageSquare, 
  TrendingUp, 
  Brain, 
  Wrench,
  Download,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Settings,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { 
    title: "Dashboard", 
    href: "/admin", 
    icon: LayoutDashboard,
    exact: true
  },
  { 
    title: "Leads", 
    href: "/admin/leads", 
    icon: Users 
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
    title: "Analytics", 
    href: "/admin/analytics", 
    icon: TrendingUp 
  },
  { 
    title: "Funnel", 
    href: "/admin/funnel", 
    icon: TrendingUp 
  },
  { 
    title: "KI-Analytics", 
    href: "/admin/ml-analytics", 
    icon: Brain 
  },
  { 
    title: "Verfügbarkeit", 
    href: "/admin/availability", 
    icon: Calendar 
  },
  {
    type: "divider",
    title: "Entwickler"
  },
  { 
    title: "Tools & Downloads", 
    href: "/admin/tools", 
    icon: Wrench,
    highlight: true
  },
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
    return location.pathname.startsWith(href);
  };

  return (
    <aside className={cn(
      "bg-card border-r border-border h-screen sticky top-0 transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <Link to="/admin" className="font-bold text-lg text-primary">
            Admin
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {navItems.map((item, index) => {
          if (item.type === "divider") {
            return (
              <div key={index} className="my-4">
                {!collapsed && (
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {item.title}
                  </p>
                )}
                {collapsed && <div className="border-t border-border mx-2" />}
              </div>
            );
          }

          const Icon = item.icon!;
          const active = isActive(item.href!, item.exact);

          return (
            <Link
              key={item.href}
              to={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mb-1",
                "hover:bg-accent hover:text-accent-foreground",
                active && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                item.highlight && !active && "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.title : undefined}
            >
              <Icon className={cn("h-5 w-5 shrink-0", active && "text-primary-foreground")} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
            "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Zur Website" : undefined}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="text-sm">Zur Website</span>}
        </Link>
      </div>
    </aside>
  );
}
