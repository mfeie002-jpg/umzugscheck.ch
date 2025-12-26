import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Camera,
  Layers,
  Target,
  BarChart3,
  Users,
  Building2,
  CreditCard,
  Mail,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Zap,
  Rocket,
  Copy,
  GitCompare,
  Clock,
  Bot,
  Download,
  FileText,
  Globe,
  Search,
  Gauge,
  Shield,
  TrendingUp,
  Star,
  Play,
  ExternalLink
} from "lucide-react";

// ============================================================================
// ADMIN CAPABILITIES OVERVIEW
// Was ist alles möglich? Was kann man machen?
// ============================================================================

interface Capability {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  features: string[];
  whenToUse: string;
  badge?: string;
  isPremium?: boolean;
}

interface CapabilityCategory {
  title: string;
  description: string;
  icon: any;
  color: string;
  capabilities: Capability[];
}

const CAPABILITY_CATEGORIES: CapabilityCategory[] = [
  {
    title: "🧠 KI & Analyse",
    description: "Automatische Analysen mit ChatGPT, Claude, Gemini",
    icon: Brain,
    color: "from-purple-500/20 to-blue-500/20",
    capabilities: [
      {
        id: "ultimate-export",
        title: "1-Click Ultimate Export",
        description: "Alle 9 Flow-Varianten als ChatGPT-ready ZIP exportieren",
        icon: Rocket,
        href: "/admin/ai-command",
        badge: "⭐ EMPFOHLEN",
        features: [
          "9 Flows × ~5 Steps = 45+ Screenshots",
          "Desktop + Mobile pro Step",
          "Rendered HTML für Code-Analyse",
          "MASTER_PROMPT.md mit Anweisungen",
          "V10_SYNTHESIS.md für optimalen Flow",
          "Alles in einem ZIP"
        ],
        whenToUse: "Wöchentlich für umfassende Funnel-Analyse"
      },
      {
        id: "prompt-library",
        title: "Prompt Library",
        description: "7 spezialisierte Prompts für verschiedene Analysen",
        icon: Copy,
        href: "/admin/ai-export",
        features: [
          "Quick Analyse (2 Min)",
          "Deep Analyse (15 Min)",
          "Code Review",
          "SEO Audit",
          "Accessibility Check",
          "Performance Analyse",
          "Competitor Compare"
        ],
        whenToUse: "Für gezielte Einzelanalysen"
      },
      {
        id: "ml-analytics",
        title: "ML Analytics",
        description: "Machine Learning basierte Ranking-Optimierung",
        icon: Bot,
        href: "/admin/ml-analytics",
        features: [
          "Automatische Ranking-Vorschläge",
          "Conversion-Prognosen",
          "Lead-Qualität vorhersagen",
          "Preisoptimierung"
        ],
        whenToUse: "Für datengetriebene Entscheidungen"
      }
    ]
  },
  {
    title: "📸 Screenshots & Evidence",
    description: "Visuelle Dokumentation und Regression Testing",
    icon: Camera,
    color: "from-green-500/20 to-emerald-500/20",
    capabilities: [
      {
        id: "screenshot-machine",
        title: "Screenshot Machine",
        description: "Einzelne oder Bulk-Screenshots von URLs",
        icon: Camera,
        href: "/admin/screenshots",
        features: [
          "Single URL Capture",
          "Bulk-Capture (10+ URLs)",
          "Desktop, Tablet, Mobile",
          "Full-Page oder Viewport",
          "PNG/JPEG Export",
          "Supabase-Archivierung"
        ],
        whenToUse: "Für Dokumentation und Ad-hoc Checks"
      },
      {
        id: "auto-flow",
        title: "Auto-Flow Capture",
        description: "Alle Steps aller Flows automatisch erfassen",
        icon: Layers,
        href: "/admin/tools",
        features: [
          "9 Flow-Varianten",
          "Automatische Step-Erkennung",
          "Parallele Erfassung",
          "Meta-Daten Export",
          "Vergleichs-Modus"
        ],
        whenToUse: "Nach jedem Deploy für Vollständigkeit"
      },
      {
        id: "regression",
        title: "Regression Testing",
        description: "Visuelle Änderungen automatisch erkennen",
        icon: GitCompare,
        href: "/admin/tools?tab=regression",
        features: [
          "Baseline definieren",
          "Pixel-by-Pixel Diff",
          "Threshold konfigurieren",
          "E-Mail Alerts",
          "Historie einsehen"
        ],
        whenToUse: "CI/CD Integration, vor Releases"
      },
      {
        id: "html-analyzer",
        title: "HTML Analyzer",
        description: "Rendered vs Raw HTML für SEO/SPA-Analyse",
        icon: FileText,
        href: "/admin/tools?tab=seo",
        features: [
          "Raw HTML Capture",
          "Rendered HTML (nach JS)",
          "Diff-Ansicht",
          "SEO-Probleme erkennen",
          "SPA-Indexierung prüfen"
        ],
        whenToUse: "SEO-Audits, SPA-Debugging"
      }
    ]
  },
  {
    title: "🎯 Funnels & Conversion",
    description: "Optimiere deine Conversion-Rate",
    icon: Target,
    color: "from-orange-500/20 to-red-500/20",
    capabilities: [
      {
        id: "funnel-analytics",
        title: "Funnel Analytics",
        description: "Drop-offs, Time-on-Step, Conversion-Raten",
        icon: Target,
        href: "/admin/funnel",
        features: [
          "Step-by-Step Analyse",
          "Drop-off Erkennung",
          "Zeit pro Step",
          "Conversion pro Flow",
          "Geräte-Vergleich"
        ],
        whenToUse: "Täglich für Performance-Monitoring"
      },
      {
        id: "ab-testing",
        title: "A/B Testing",
        description: "Teste Varianten mit echten Nutzern",
        icon: Sparkles,
        href: "/admin/ab-testing",
        badge: "NEU",
        features: [
          "Varianten definieren",
          "Traffic-Split",
          "Statistische Signifikanz",
          "Auto-Winner",
          "Multi-Variant Tests"
        ],
        whenToUse: "Vor wichtigen Entscheidungen"
      },
      {
        id: "conversions",
        title: "Conversion Events",
        description: "Alle Conversion-Events tracken",
        icon: Zap,
        href: "/admin/conversions",
        features: [
          "Event-Tracking",
          "Funnel-Visualisierung",
          "Attribution",
          "Custom Events"
        ],
        whenToUse: "Setup und Debugging"
      }
    ]
  },
  {
    title: "📊 Analytics & Reports",
    description: "Daten-Insights und automatische Reports",
    icon: BarChart3,
    color: "from-blue-500/20 to-cyan-500/20",
    capabilities: [
      {
        id: "analytics",
        title: "Analytics Dashboard",
        description: "Übersicht aller wichtigen KPIs",
        icon: BarChart3,
        href: "/admin/analytics",
        features: [
          "Leads pro Tag/Woche/Monat",
          "Conversion-Raten",
          "Revenue Tracking",
          "Traffic Sources",
          "Geografische Verteilung"
        ],
        whenToUse: "Täglicher Health-Check"
      },
      {
        id: "pricing-analytics",
        title: "Preis-Analyse",
        description: "Historische Preise und Trends",
        icon: Gauge,
        href: "/admin/pricing-analytics",
        features: [
          "Durchschnittspreise",
          "Regionale Unterschiede",
          "Saisonale Trends",
          "Wettbewerber-Vergleich"
        ],
        whenToUse: "Quartalsweise Preis-Review"
      },
      {
        id: "reports",
        title: "Reports",
        description: "Automatische Berichte generieren",
        icon: FileText,
        href: "/admin/reports",
        features: [
          "Tages-/Wochen-/Monats-Reports",
          "PDF Export",
          "E-Mail Versand",
          "Custom Report Builder"
        ],
        whenToUse: "Stakeholder-Updates"
      }
    ]
  },
  {
    title: "👥 Verwaltung",
    description: "Leads, Firmen, Partner verwalten",
    icon: Users,
    color: "from-slate-500/20 to-gray-500/20",
    capabilities: [
      {
        id: "leads",
        title: "Lead-Management",
        description: "Alle eingehenden Anfragen",
        icon: Users,
        href: "/admin/leads",
        features: [
          "Lead-Liste mit Filter",
          "Status-Tracking",
          "Firmen-Zuweisung",
          "Qualitäts-Score",
          "CSV Export"
        ],
        whenToUse: "Täglich Leads reviewen"
      },
      {
        id: "companies",
        title: "Firmen-Verwaltung",
        description: "Partner-Umzugsfirmen verwalten",
        icon: Building2,
        href: "/admin/companies",
        features: [
          "Firmen-Profile",
          "Ranking-Management",
          "Featured-Status",
          "Regionen-Zuweisung",
          "Performance-Daten"
        ],
        whenToUse: "Wöchentlich Profile prüfen"
      },
      {
        id: "rankings",
        title: "Rankings",
        description: "Firmen-Reihenfolge steuern",
        icon: Star,
        href: "/admin/rankings",
        features: [
          "Drag & Drop Ranking",
          "Featured-Slots",
          "Regionale Rankings",
          "Automatische Sortierung"
        ],
        whenToUse: "Bei Onboarding neuer Partner"
      }
    ]
  },
  {
    title: "💰 Billing & Finance",
    description: "Abrechnungen und Zahlungen",
    icon: CreditCard,
    color: "from-green-500/20 to-emerald-500/20",
    capabilities: [
      {
        id: "billing",
        title: "Abrechnung",
        description: "Invoices und Zahlungen",
        icon: CreditCard,
        href: "/admin/billing",
        features: [
          "Invoice-Erstellung",
          "Zahlungs-Tracking",
          "Mehrere Billing-Modelle",
          "Automatische Abrechnung"
        ],
        whenToUse: "Monatliche Abrechnung"
      },
      {
        id: "subscriptions",
        title: "Abonnements",
        description: "Partner-Subscriptions verwalten",
        icon: TrendingUp,
        href: "/admin/subscriptions",
        features: [
          "Plan-Übersicht",
          "Upgrades/Downgrades",
          "Kündigungen",
          "Revenue-Übersicht"
        ],
        whenToUse: "Subscription-Management"
      },
      {
        id: "dynamic-pricing",
        title: "Dynamische Preise",
        description: "Automatische Preisanpassung",
        icon: Gauge,
        href: "/admin/dynamic-pricing",
        features: [
          "Demand-basierte Preise",
          "Regionale Unterschiede",
          "Saisonale Anpassung",
          "A/B Test für Preise"
        ],
        whenToUse: "Preis-Optimierung"
      }
    ]
  },
  {
    title: "⚙️ Automations",
    description: "Automatische Prozesse und Jobs",
    icon: Clock,
    color: "from-violet-500/20 to-purple-500/20",
    capabilities: [
      {
        id: "email-automation",
        title: "E-Mail Automation",
        description: "Automatische E-Mails versenden",
        icon: Mail,
        href: "/admin/email-automation",
        features: [
          "Trigger-basierte E-Mails",
          "Templates mit Variablen",
          "Follow-up Sequenzen",
          "Versand-Logs"
        ],
        whenToUse: "Lead-Nurturing automatisieren"
      },
      {
        id: "scheduled-jobs",
        title: "Scheduled Jobs",
        description: "Wiederkehrende Aufgaben",
        icon: Clock,
        href: "/admin/tools?tab=monitoring",
        features: [
          "Screenshot-Jobs",
          "Regression-Checks",
          "Report-Generierung",
          "Health-Checks"
        ],
        whenToUse: "Automatisches Monitoring"
      }
    ]
  },
  {
    title: "🔧 Export & Integration",
    description: "Code exportieren und integrieren",
    icon: Download,
    color: "from-amber-500/20 to-orange-500/20",
    capabilities: [
      {
        id: "code-export",
        title: "Full-Stack Export",
        description: "Komplettes Projekt exportieren",
        icon: Download,
        href: "/admin/code-export",
        features: [
          "Edge Functions Export",
          "Database Schema",
          "RLS Policies",
          "Setup-Anleitung",
          "1-Click Prompt"
        ],
        whenToUse: "Projekt klonen oder teilen"
      }
    ]
  }
];

export const AdminCapabilities = () => {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🚀 Was ist alles möglich?</h1>
        <p className="text-muted-foreground">
          Komplette Übersicht aller Admin-Funktionen mit Erklärungen, wann du was nutzen solltest.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">8</div>
            <div className="text-sm text-muted-foreground">Kategorien</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">25+</div>
            <div className="text-sm text-muted-foreground">Tools</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">9</div>
            <div className="text-sm text-muted-foreground">Flow-Varianten</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">∞</div>
            <div className="text-sm text-muted-foreground">Möglichkeiten</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="all">Alle</TabsTrigger>
          {CAPABILITY_CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.title} value={cat.title}>
              {cat.title.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          {CAPABILITY_CATEGORIES.map((category) => (
            <CategorySection key={category.title} category={category} />
          ))}
        </TabsContent>

        {CAPABILITY_CATEGORIES.map((category) => (
          <TabsContent key={category.title} value={category.title}>
            <CategorySection category={category} expanded />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const CategorySection = ({ category, expanded = false }: { category: CapabilityCategory; expanded?: boolean }) => {
  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-xl bg-gradient-to-r ${category.color}`}>
        <div className="flex items-center gap-3">
          <category.icon className="h-6 w-6" />
          <div>
            <h2 className="text-xl font-bold">{category.title}</h2>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.capabilities.map((cap) => (
          <CapabilityCard key={cap.id} capability={cap} expanded={expanded} />
        ))}
      </div>
    </div>
  );
};

const CapabilityCard = ({ capability, expanded }: { capability: Capability; expanded?: boolean }) => {
  return (
    <Card className="relative overflow-hidden hover:border-primary/50 transition-colors">
      {capability.badge && (
        <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          {capability.badge}
        </Badge>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <capability.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">{capability.title}</CardTitle>
            <CardDescription className="text-xs">{capability.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* When to use */}
        <div className="p-2 rounded bg-muted/50">
          <div className="text-xs text-muted-foreground">📅 Wann nutzen:</div>
          <div className="text-sm font-medium">{capability.whenToUse}</div>
        </div>

        {/* Features */}
        {expanded && (
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground mb-2">Features:</div>
            {capability.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        )}

        {/* Link */}
        <Link to={capability.href}>
          <Button variant="outline" size="sm" className="w-full gap-2">
            Öffnen <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default AdminCapabilities;
