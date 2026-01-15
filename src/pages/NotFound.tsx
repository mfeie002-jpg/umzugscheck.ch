import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, RefreshCw, HelpCircle, AlertCircle, MessageSquare, Loader2, Search, ArrowRight, Calculator, Building2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * Improved 404 Page with Search & Popular Links
 * 
 * Features:
 * - Context-aware messaging for flows
 * - Search functionality
 * - Popular links for navigation
 * - Problem reporting
 * - Mobile optimized
 */

// Popular pages for quick navigation
const POPULAR_LINKS = [
  { label: "Umzugsrechner", href: "/umzugsrechner", icon: Calculator },
  { label: "Umzugsfirmen", href: "/umzugsfirmen", icon: Building2 },
  { label: "Offerten erhalten", href: "/umzugsofferten", icon: ArrowRight },
  { label: "Zürich", href: "/umzugsfirmen/zuerich", icon: MapPin },
];

const NotFound = () => {
  const { pathname, search: searchQuery, hash } = useLocation();
  const navigate = useNavigate();
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

    // Determine best flow home based on path
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

    // Check if this is a capture mode URL (internal tooling)
    const isCaptureMode = searchQuery.includes("uc_capture=1") || searchQuery.includes("uc_step=");

    return {
      isOffertenFlow,
      isCaptureMode,
      flowHome,
      flowName,
    };
  }, [pathname, searchQuery]);

  // Simulate problem reporting
  const handleReportProblem = async () => {
    setIsReporting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsReporting(false);
    setReportSent(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Redirect to a search or relevant page
      navigate(`/umzugsfirmen?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-muted/40 to-background flex items-center justify-center p-4 pb-24 md:pb-4">
      <Card className="mx-auto max-w-lg w-full shadow-lg border-border/50">
        <CardContent className="pt-8 pb-6 px-6 space-y-6">
          {/* Icon */}
          <div className="text-center">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>

            {/* Title */}
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
                <>
                  Der Screenshot-Capture konnte diesen Flow-Schritt nicht laden.
                  Bitte prüfen Sie die Flow-Konfiguration.
                </>
              ) : ctx.isOffertenFlow ? (
                <>
                  Der {ctx.flowName} wurde unterbrochen – möglicherweise ist Ihre Sitzung 
                  abgelaufen oder der Link nicht mehr gültig.
                </>
              ) : (
                <>
                  Diese Seite existiert nicht oder wurde verschoben. 
                  Nutzen Sie die Suche oder wählen Sie eine beliebte Seite.
                </>
              )}
            </p>
          </div>

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
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Beliebte Seiten
            </p>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
                >
                  <link.icon className="w-4 h-4 text-primary" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Primary CTA */}
          <div className="space-y-3 pt-2">
            <Button
              type="button"
              variant="default"
              size="lg"
              className="w-full min-h-[52px] text-base font-semibold"
              onClick={() => navigate(ctx.isOffertenFlow ? ctx.flowHome : "/")}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              {ctx.isOffertenFlow ? "Prozess neu starten" : "Zur Startseite"}
            </Button>

            {ctx.isOffertenFlow && (
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="w-full min-h-[48px] text-muted-foreground hover:text-foreground"
              >
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Zur Startseite
                </Link>
              </Button>
            )}
          </div>

          {/* Problem melden */}
          <div className="pt-2 border-t border-border/50 space-y-3">
            {!reportSent ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full min-h-[44px] text-sm"
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
              <p className="text-sm text-green-600 font-medium text-center">
                ✓ Danke für Ihre Meldung!
              </p>
            )}

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
    </main>
  );
};

export default NotFound;
