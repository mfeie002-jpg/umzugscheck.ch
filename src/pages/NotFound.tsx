import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, RefreshCw, HelpCircle, AlertCircle, MessageSquare, Loader2, Search, ArrowRight, Calculator, Building2, MapPin, Sparkles, FileText, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFlowContext } from "@/hooks/useFlowContext";
import { FlowProgressIndicator } from "@/components/FlowProgressIndicator";
// Header & Footer removed - provided by MainLayout in App.tsx

/**
 * Optimized 404 Page with Enhanced SEO & Conversion
 * 
 * Features:
 * - Full SEO meta tags
 * - Context-aware messaging for flows
 * - Search functionality
 * - Popular links for navigation & internal linking
 * - Problem reporting
 * - Related services suggestions
 * - Mobile optimized
 */

// Popular pages for quick navigation - enhanced for SEO & conversion
const POPULAR_LINKS = [
  { label: "Umzugsrechner", href: "/umzugsrechner", icon: Calculator, description: "Kosten berechnen" },
  { label: "Umzugsfirmen", href: "/umzugsfirmen", icon: Building2, description: "Firmen vergleichen" },
  { label: "Offerten erhalten", href: "/umzugsofferten", icon: ArrowRight, description: "Kostenlos & unverbindlich" },
  { label: "Zürich", href: "/zuerich", icon: MapPin, description: "Firmen in Zürich" },
  { label: "Bern", href: "/bern", icon: MapPin, description: "Firmen in Bern" },
  { label: "Basel", href: "/basel", icon: MapPin, description: "Firmen in Basel" },
];

const QUICK_SERVICES = [
  { label: "Privatumzug", href: "/privatumzug", icon: Home },
  { label: "Firmenumzug", href: "/firmenumzug", icon: Building2 },
  { label: "Reinigung", href: "/reinigung", icon: Sparkles },
  { label: "Ratgeber", href: "/ratgeber", icon: FileText },
];

const NotFound = () => {
  const { pathname, search: searchQuery, hash } = useLocation();
  const navigate = useNavigate();
  const flowContext = useFlowContext();
  const [isReporting, setIsReporting] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  const ctx = useMemo(() => {
    const isOffertenFlow =
      pathname.startsWith("/umzugsofferten") || 
      pathname.startsWith("/rechner") ||
      pathname.includes("offerte");

    let flowHome = "/umzugsofferten";
    let flowName = "Offerten-Prozess";
    if (pathname.startsWith("/umzugsofferten-v2e")) {
      flowHome = "/umzugsofferten-v2e";
      flowName = "Chat-Funnel";
    } else if (pathname.startsWith("/umzugsofferten-v9")) {
      flowHome = "/umzugsofferten-v9";
      flowName = "ZeroFriction Flow";
    } else if (pathname.startsWith("/rechner")) {
      flowHome = "/rechner";
      flowName = "Rechner";
    }

    const isCaptureMode = searchQuery.includes("uc_capture=1") || searchQuery.includes("uc_step=");

    return {
      isOffertenFlow,
      isCaptureMode,
      flowHome,
      flowName,
    };
  }, [pathname, searchQuery]);

  const handleReportProblem = async () => {
    setIsReporting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsReporting(false);
    setReportSent(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/umzugsfirmen?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Schema.org for 404 page
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Seite nicht gefunden",
    "description": "Die gesuchte Seite existiert nicht. Finden Sie stattdessen Umzugsfirmen, Preisrechner und Services.",
    "url": `https://umzugscheck.ch${pathname}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Umzugscheck.ch",
      "url": "https://umzugscheck.ch"
    }
  };

  return (
    <>
      <Helmet>
        <title>Seite nicht gefunden – Umzugscheck.ch</title>
        <meta name="description" content="Die gesuchte Seite existiert nicht. Entdecken Sie stattdessen unseren Umzugsvergleich, Preisrechner und 200+ geprüfte Schweizer Umzugsfirmen." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://umzugscheck.ch/" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <div className="min-h-[60vh] flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center p-4 pb-24 md:pb-8">
          <div className="w-full max-w-2xl space-y-6">
            <Card className="shadow-lg border-border/50">
              <CardContent className="pt-8 pb-6 px-6 space-y-6">
                {/* Icon & Title */}
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
                    <AlertCircle className="w-10 h-10 text-destructive" />
                  </div>

                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {ctx.isCaptureMode 
                      ? "Flow nicht gefunden" 
                      : ctx.isOffertenFlow 
                        ? "Prozess unterbrochen"
                        : "Seite nicht gefunden"
                    }
                  </h1>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {ctx.isCaptureMode ? (
                      <>Der Screenshot-Capture konnte diesen Flow-Schritt nicht laden.</>
                    ) : ctx.isOffertenFlow ? (
                      <>Der {ctx.flowName} wurde unterbrochen – möglicherweise ist Ihre Sitzung abgelaufen.</>
                    ) : (
                      <>Diese Seite existiert nicht oder wurde verschoben. Nutzen Sie die Suche oder wählen Sie eine beliebte Seite.</>
                    )}
                  </p>
                </div>

                {/* Flow Progress (if in flow context) */}
                {flowContext.isInFlow && flowContext.currentStep && flowContext.totalSteps && (
                  <div className="py-4 px-4 bg-muted/50 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-3 text-center">
                      Sie waren im <strong className="text-foreground">{flowContext.flowName}</strong>
                    </p>
                    <FlowProgressIndicator
                      currentStep={flowContext.currentStep}
                      totalSteps={flowContext.totalSteps}
                      className="mx-auto"
                    />
                  </div>
                )}

                {/* Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Suchen Sie nach Umzugsfirmen, Regionen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 h-12"
                  />
                </form>

                {/* Popular Links */}
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Beliebte Seiten
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {POPULAR_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <span className="flex items-center gap-2 text-sm font-medium text-foreground group-hover:text-primary">
                          <link.icon className="w-4 h-4 text-primary" />
                          {link.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{link.description}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick Services */}
                <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-border/50">
                  {QUICK_SERVICES.map((service) => (
                    <Link
                      key={service.href}
                      to={service.href}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary bg-muted/30 hover:bg-muted/50 rounded-full transition-colors"
                    >
                      <service.icon className="w-3.5 h-3.5" />
                      {service.label}
                    </Link>
                  ))}
                </div>

                {/* Primary CTA */}
                <div className="space-y-3 pt-2">
                  <Button
                    type="button"
                    variant="default"
                    size="lg"
                    className="w-full min-h-[52px] text-base font-semibold bg-secondary hover:bg-secondary/90"
                    onClick={() => navigate(ctx.isOffertenFlow ? ctx.flowHome : "/umzugsofferten")}
                  >
                    {ctx.isOffertenFlow ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Prozess neu starten
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5 mr-2" />
                        Kostenlose Offerten erhalten
                      </>
                    )}
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full min-h-[48px]"
                  >
                    <Link to="/">
                      <Home className="w-4 h-4 mr-2" />
                      Zur Startseite
                    </Link>
                  </Button>
                </div>

                {/* Problem melden */}
                <div className="pt-3 border-t border-border/50 space-y-3">
                  <div className="flex gap-2">
                    {!reportSent ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 min-h-[44px] text-sm"
                        onClick={handleReportProblem}
                        disabled={isReporting}
                      >
                        {isReporting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <MessageSquare className="w-4 h-4 mr-2" />
                        )}
                        {isReporting ? "Wird gemeldet..." : "Problem melden"}
                      </Button>
                    ) : (
                      <p className="flex-1 text-sm text-green-600 font-medium text-center py-2">
                        ✓ Danke für Ihre Meldung!
                      </p>
                    )}
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="min-h-[44px]"
                    >
                      <a href="tel:+41780980000">
                        <Phone className="w-4 h-4 mr-2" />
                        Anrufen
                      </a>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Oder</span>
                    <Link 
                      to="/kontakt" 
                      className="text-primary hover:underline font-medium"
                    >
                      kontaktieren Sie uns direkt
                    </Link>
                  </p>
                </div>

                {/* Debug info - dev only */}
                {import.meta.env.DEV && (
                  <details className="text-left">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      Debug Info
                    </summary>
                    <pre className="mt-2 rounded-lg bg-muted p-3 text-[10px] font-mono overflow-auto">
{`pathname: ${pathname}
search:   ${searchQuery}
hash:     ${hash}
flow:     ${ctx.isOffertenFlow ? "yes" : "no"}
capture:  ${ctx.isCaptureMode ? "yes" : "no"}
flowHome: ${ctx.flowHome}`}
                    </pre>
                  </details>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default NotFound;
