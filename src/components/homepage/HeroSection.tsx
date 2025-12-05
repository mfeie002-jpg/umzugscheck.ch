import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Star, Shield, Users, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [apartmentSize, setApartmentSize] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/umzugsofferten?from=${encodeURIComponent(fromLocation)}&to=${encodeURIComponent(toLocation)}&size=${encodeURIComponent(apartmentSize)}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image with Overlays */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')",
          }}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
        {/* Dotted Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />
      </div>

      <div className="container relative z-10 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border shadow-soft"
            >
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-sm">
                <span className="font-medium">Wir checken für Sie</span>
                <span className="text-muted-foreground ml-2">• 200+ geprüfte Umzugsfirmen</span>
              </div>
            </motion.div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Umzugsfirmen vergleichen.
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-secondary">
                In wenigen Minuten.
              </h1>
            </div>

            {/* Subline */}
            <p className="text-lg text-muted-foreground max-w-lg">
              Wir{" "}
              <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-0.5 rounded-md font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                checken
              </span>{" "}
              für Sie: AI-gestützte Analyse, geprüfte Partner, transparente Offerten.
            </p>

            {/* Trust Row */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-border">
                <Star className="w-5 h-5 text-swiss-gold fill-swiss-gold" />
                <span className="text-sm font-semibold">4.8/5</span>
                <span className="text-xs text-muted-foreground">Bewertung</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-border">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold">15'000+</span>
                <span className="text-xs text-muted-foreground">Umzüge</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-border">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-semibold">0%</span>
                <span className="text-xs text-muted-foreground">kostenlos</span>
              </div>
            </div>

            {/* Live Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/30 rounded-full px-4 py-2 border border-green-200 dark:border-green-800"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                12 Offerten heute angefordert
              </span>
            </motion.div>
          </motion.div>

          {/* Right - Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="bg-card rounded-2xl border border-border shadow-premium p-6 md:p-8">
              {/* Form Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  In 2 Minuten zum Vergleich
                </div>
                <h2 className="text-xl md:text-2xl font-bold">
                  Kostenlos Offerten erhalten
                </h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Von (PLZ oder Ort)</label>
                  <Input
                    placeholder="z.B. 8001 oder Zürich"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nach (PLZ oder Ort)</label>
                  <Input
                    placeholder="z.B. 3011 oder Bern"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Wohnungsgrösse</label>
                  <Select value={apartmentSize} onValueChange={setApartmentSize}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Bitte wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-1.5">1 – 1.5 Zimmer</SelectItem>
                      <SelectItem value="2-2.5">2 – 2.5 Zimmer</SelectItem>
                      <SelectItem value="3-3.5">3 – 3.5 Zimmer</SelectItem>
                      <SelectItem value="4-4.5">4 – 4.5 Zimmer</SelectItem>
                      <SelectItem value="5+">5+ Zimmer / Haus</SelectItem>
                      <SelectItem value="office">Büro / Firma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-base shadow-cta"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Jetzt checken lassen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>

              {/* Trust Points */}
              <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  Kostenlos
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  Unverbindlich
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  Datenschutz
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
