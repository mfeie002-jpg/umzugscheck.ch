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
      {/* Emotional Background - Right Side */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 z-0 hidden lg:block">
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80&auto=format&fit=crop"
          alt="Professionelle Umzugshelfer"
          className="w-full h-full object-cover opacity-30"
          loading="eager"
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Centered Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-4">
              Schweizer Umzug buchen – in <span className="text-primary">2 Minuten</span>, mit AI-Unterstützung
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Erhalte Sofort-Preise, geprüfte Firmen & transparente Vergleiche
            </p>

            {/* Centered AI Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-2xl mx-auto mb-8"
            >
              <div className="bg-card rounded-3xl shadow-strong p-6 md:p-8 border border-border/50">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">AI-Schnellrechner</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
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
                </div>

                <Button 
                  onClick={handleCalculate}
                  className="w-full h-14 text-lg font-bold shadow-medium hover:shadow-strong transition-all"
                  disabled={!fromPostal || !toPostal || !rooms}
                >
                  Sofort-Preis berechnen
                </Button>
              </div>
            </motion.div>

            {/* Trust Bar Below Calculator */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-semibold">⭐ 4.8 / 5</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span>15'000+ Umzüge</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-secondary" />
                <span>8 Jahre Erfahrung</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
