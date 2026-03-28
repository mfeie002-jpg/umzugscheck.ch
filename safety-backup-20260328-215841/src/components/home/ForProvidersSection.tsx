import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Users, CheckCircle } from "lucide-react";

export const ForProvidersSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-happy-teal/10 via-happy-purple/10 to-happy-pink/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Für Umzugsfirmen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Werden Sie Teil der führenden Schweizer Umzugsplattform und erhalten Sie qualifizierte Aufträge
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-10">
          {/* Benefit 1 */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-happy-yellow to-happy-coral flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Qualifizierte Leads
            </h3>
            <p className="text-sm text-muted-foreground">
              Erhalten Sie vorqualifizierte Anfragen von echten Umzugskunden
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-happy-teal to-happy-purple flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Performance-Marktplatz
            </h3>
            <p className="text-sm text-muted-foreground">
              Zahlen Sie nur für echte Aufträge – transparente ROI-Kontrolle
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-happy-pink to-happy-purple flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Mehr Sichtbarkeit
            </h3>
            <p className="text-sm text-muted-foreground">
              Präsentieren Sie Ihre Firma in allen 26 Schweizer Kantonen
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-happy-coral to-happy-yellow flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Fairer Qualitäts-Score
            </h3>
            <p className="text-sm text-muted-foreground">
              Profitieren Sie von unserem datenbasierten Bewertungssystem
            </p>
          </div>
        </div>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/fuer-firmen" className="no-underline">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-happy-coral to-happy-pink hover:opacity-90 text-white shadow-lg"
            >
              Anbieter werden
            </Button>
          </Link>
          <Link to="/fuer-firmen/preise" className="no-underline">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2"
            >
              Preise & Modelle
            </Button>
          </Link>
          <Link to="/provider-login" className="no-underline">
            <Button 
              variant="ghost" 
              size="lg"
            >
              Login für Partner
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
