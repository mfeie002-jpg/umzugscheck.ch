import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Box, ArrowLeft } from "lucide-react";

const StorageCalculator = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Link>

          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Box className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Lagerrechner
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Berechnen Sie Ihre Lagerkosten
            </p>

            <div className="bg-secondary/30 border border-border rounded-2xl p-8 mb-8">
              <p className="text-foreground mb-6">
                Dieser Rechner ist in Entwicklung und wird bald verfügbar sein. 
                Sie können uns bereits jetzt kontaktieren für ein individuelles Angebot.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/rechner">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Zum Umzugsrechner
                  </Button>
                </Link>
                <Link to="/kontakt">
                  <Button size="lg" variant="outline">
                    Kontakt aufnehmen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StorageCalculator;
