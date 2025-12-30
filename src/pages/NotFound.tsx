import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, RefreshCw, Route as RouteIcon } from "lucide-react";

const NotFound = () => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  const ctx = useMemo(() => {
    const params = new URLSearchParams(search);
    const step = params.get("uc_step") ?? params.get("step");
    const isOffertenFlow =
      pathname.startsWith("/umzugsofferten") || pathname.startsWith("/umzugsofferten-v2e");

    const flowHome = pathname.startsWith("/umzugsofferten-v2e") ? "/umzugsofferten-v2e" : "/umzugsofferten";

    return {
      isOffertenFlow,
      step,
      flowHome,
    };
  }, [pathname, search]);

  return (
    <main className="min-h-screen bg-muted/40">
      <section className="container mx-auto px-4 py-10">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="inline-flex items-center gap-1">
                  <RouteIcon className="h-3.5 w-3.5" />
                  404
                </Badge>
                {ctx.step && (
                  <Badge variant="outline">Schritt {ctx.step}</Badge>
                )}
              </div>
              {import.meta.env.DEV && (
                <Badge variant="outline" className="font-mono text-[10px]">
                  DEV
                </Badge>
              )}
            </div>

            <CardTitle className="text-2xl">Diese Seite wurde nicht gefunden</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Der Link scheint nicht (mehr) zu stimmen. Wenn Sie gerade im Offerten‑Flow waren, können Sie den Prozess
              direkt wieder starten – ohne Umwege.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="default"
                size="lg"
                className="min-h-[48px] flex-1"
                onClick={() => (ctx.isOffertenFlow ? navigate(ctx.flowHome) : navigate("/"))}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {ctx.isOffertenFlow ? "Flow neu starten" : "Zur Startseite"}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="min-h-[48px] flex-1"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>

              <Button asChild variant="ghost" size="lg" className="min-h-[48px] sm:flex-none">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
            </div>

            {import.meta.env.DEV && (
              <pre className="rounded-lg bg-card p-4 text-left text-xs opacity-80 overflow-auto">
{`Debug Location:\npathname: ${pathname}\nsearch:   ${search}\nhash:     ${hash}`}
              </pre>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default NotFound;
