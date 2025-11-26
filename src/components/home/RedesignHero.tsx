import { Button } from "@/components/ui/button";
import { Star, CheckCircle, TrendingDown, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RedesignHero = () => {
  const [fromPostal, setFromPostal] = useState("");
  const [toPostal, setToPostal] = useState("");
  const [rooms, setRooms] = useState("");
  const navigate = useNavigate();

  const handleCalculate = () => {
    if (fromPostal && toPostal && rooms) {
      navigate(`/rechner?from=${encodeURIComponent(fromPostal)}&to=${encodeURIComponent(toPostal)}&rooms=${rooms}`);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      {/* Emotional Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80&auto=format&fit=crop"
          alt="Professionelle Umzugshelfer"
          className="w-full h-full object-cover opacity-20"
          loading="eager"
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-4">
              Umzug zum <span className="text-primary">besten Preis</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl">
              Vergleichen Sie kostenlos Offerten von geprüften Schweizer Umzugsfirmen – in nur 2 Minuten
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 md:gap-6 mb-8 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-semibold">4.8 / 5</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span>15'000+ Umzüge</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-secondary" />
                <span>100% kostenlos</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/umzugsofferten">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-bold shadow-strong hover:shadow-accent transition-all"
                >
                  Jetzt vergleichen
                </Button>
              </Link>
              <Link to="/rechner">
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-semibold border-2"
                >
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: AI Calculator (3 Fields) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:ml-auto w-full max-w-md"
          >
            <div className="bg-card rounded-3xl shadow-strong p-6 md:p-8 border border-border/50">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Schnellrechner</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Von PLZ</label>
                  <Input 
                    placeholder="z.B. 8001"
                    value={fromPostal}
                    onChange={(e) => setFromPostal(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Nach PLZ</label>
                  <Input 
                    placeholder="z.B. 3011"
                    value={toPostal}
                    onChange={(e) => setToPostal(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Zimmer</label>
                  <Input 
                    type="number"
                    placeholder="z.B. 3"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    className="h-12"
                  />
                </div>

                <Button 
                  onClick={handleCalculate}
                  className="w-full h-12 text-base font-bold shadow-medium hover:shadow-strong transition-all"
                  disabled={!fromPostal || !toPostal || !rooms}
                >
                  Preis berechnen
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                ✓ Kostenlos & unverbindlich
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
