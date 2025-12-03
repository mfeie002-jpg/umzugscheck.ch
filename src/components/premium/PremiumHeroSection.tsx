import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Star, Shield, CheckCircle, Users, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const PremiumHeroSection = () => {
  const navigate = useNavigate();
  const [fromPostal, setFromPostal] = useState("");
  const [toPostal, setToPostal] = useState("");
  const [rooms, setRooms] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fromPostal) params.set("from", fromPostal);
    if (toPostal) params.set("to", toPostal);
    if (rooms) params.set("rooms", rooms);
    navigate(`/umzugsofferten?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-accent via-background to-muted">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Text & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-sm text-secondary font-medium">
              <Shield className="h-4 w-4" />
              <span>Schweizer Qualität seit 2020</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Umzugsfirmen vergleichen.
              <span className="block text-primary">In wenigen Minuten.</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Die intelligenteste Art, Ihren Umzug zu planen. AI-gestützte Analyse, 
              geprüfte Schweizer Partner, transparente Offerten – kostenlos und unverbindlich.
            </p>
            
            {/* Trust Metrics Row */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-swiss-gold text-swiss-gold" />
                <span className="font-semibold text-foreground">4.8/5</span>
                <span className="text-muted-foreground">Bewertung</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <span className="font-semibold text-foreground">15'000+</span>
                <span className="text-muted-foreground">Umzüge</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-muted-foreground">100% kostenlos</span>
              </div>
            </div>
            
            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-4 pt-4">
              <Link to="/umzugsofferten">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-copper hover:shadow-lift transition-all">
                  Jetzt Offerten vergleichen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/umzugsrechner">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-2">
                  Umzugskosten berechnen
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Right Column - Quick Quote Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-3xl shadow-deep border border-border/50 p-8 md:p-10">
              <div className="space-y-6">
                {/* Form Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 text-sm text-primary font-medium">
                    <Clock className="h-4 w-4" />
                    In 2 Minuten zum Vergleich
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Kostenlos Offerten erhalten
                  </h2>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="from" className="text-foreground font-medium">Von (PLZ oder Ort)</Label>
                    <Input
                      id="from"
                      placeholder="z.B. 8001 Zürich"
                      value={fromPostal}
                      onChange={(e) => setFromPostal(e.target.value)}
                      className="h-12 text-base bg-muted/50 border-border focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="to" className="text-foreground font-medium">Nach (PLZ oder Ort)</Label>
                    <Input
                      id="to"
                      placeholder="z.B. 3011 Bern"
                      value={toPostal}
                      onChange={(e) => setToPostal(e.target.value)}
                      className="h-12 text-base bg-muted/50 border-border focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rooms" className="text-foreground font-medium">Wohnungsgrösse</Label>
                    <Select value={rooms} onValueChange={setRooms}>
                      <SelectTrigger className="h-12 text-base bg-muted/50 border-border">
                        <SelectValue placeholder="Wählen Sie..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - 1.5 Zimmer</SelectItem>
                        <SelectItem value="2">2 - 2.5 Zimmer</SelectItem>
                        <SelectItem value="3">3 - 3.5 Zimmer</SelectItem>
                        <SelectItem value="4">4 - 4.5 Zimmer</SelectItem>
                        <SelectItem value="5">5+ Zimmer / Haus</SelectItem>
                        <SelectItem value="office">Büro / Firma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-14 text-lg font-semibold shadow-copper hover:shadow-lift transition-all"
                  >
                    Offerten vergleichen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
                
                {/* Trust Microcopy */}
                <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Kostenlos
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Unverbindlich
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-secondary" />
                      Datenschutz
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile CTAs */}
            <div className="flex flex-col gap-3 mt-6 lg:hidden">
              <Link to="/umzugsrechner" className="w-full">
                <Button size="lg" variant="outline" className="w-full h-12 font-semibold border-2">
                  Umzugskosten berechnen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
