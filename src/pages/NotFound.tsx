import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, RefreshCw, HelpCircle, AlertTriangle } from "lucide-react";

/**
 * Improved 404 Page
 * 
 * Fixes:
 * - No step indicators on error pages (confusing)
 * - Clear, user-friendly messaging
 * - Single primary CTA (restart flow or go home)
 * - Removed confusing "Zurück" button
 * - Proper touch targets (min 48px)
 * - Context-aware messaging
 */
const NotFound = () => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

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
    if (pathname.startsWith("/umzugsofferten-v2e")) {
      flowHome = "/umzugsofferten-v2e";
    } else if (pathname.startsWith("/rechner")) {
      flowHome = "/rechner";
    }

    return {
      isOffertenFlow,
      flowHome,
    };
  }, [pathname]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-muted/40 to-background flex items-center justify-center p-4">
      <Card className="mx-auto max-w-md w-full shadow-lg border-border/50">
        <CardContent className="pt-8 pb-6 px-6 text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-muted-foreground" />
          </div>

          {/* Title - No step indicators! */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Seite nicht gefunden
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {ctx.isOffertenFlow ? (
                <>
                  Der Prozess wurde unterbrochen oder der Link ist nicht mehr gültig. 
                  Starten Sie einfach neu – Ihre Daten werden nicht gespeichert.
                </>
              ) : (
                <>
                  Diese Seite existiert nicht oder wurde verschoben. 
                  Kehren Sie zur Startseite zurück.
                </>
              )}
            </p>
          </div>

          {/* Primary CTA - Single, clear action */}
          <div className="space-y-3">
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

            {/* Secondary - Only home link, no confusing "back" button */}
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

          {/* Help option - subtle */}
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Probleme?</span>
              <Link 
                to="/kontakt" 
                className="text-primary hover:underline font-medium"
              >
                Kontaktieren Sie uns
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
search:   ${search}
hash:     ${hash}
flow:     ${ctx.isOffertenFlow ? "yes" : "no"}
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
