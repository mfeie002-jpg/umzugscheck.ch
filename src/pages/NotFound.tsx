import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, Calculator } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

export default function NotFound() {
  return (
    <>
      <SEOHead
        title="Seite nicht gefunden | Umzugscheck.ch"
        description="Die gesuchte Seite wurde nicht gefunden. Kehren Sie zur Startseite zurück oder nutzen Sie unseren Umzugsrechner."
        noindex={true}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-3xl font-semibold">Seite nicht gefunden</h2>
            <p className="text-muted-foreground text-lg">
              Die gesuchte Seite existiert leider nicht oder wurde verschoben.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Zur Startseite
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/rechner">
                <Calculator className="mr-2 h-5 w-5" />
                Zum Rechner
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/umzugsfirmen">
                <Search className="mr-2 h-5 w-5" />
                Firmen finden
              </Link>
            </Button>
          </div>

          <div className="pt-8 space-y-2">
            <p className="text-sm text-muted-foreground">Beliebte Seiten:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/preise" className="text-sm text-primary hover:underline">
                Preise
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/vergleich" className="text-sm text-primary hover:underline">
                Vergleich
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/offerte" className="text-sm text-primary hover:underline">
                Offerte anfragen
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/ratgeber" className="text-sm text-primary hover:underline">
                Ratgeber
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
