import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Star, Shield, CheckCircle2, Users, Clock, Sparkles, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroFamilyMoving from "@/assets/hero-family-moving.jpg";
import { LiveActivityBadge } from "@/components/home/LiveActivityBadge";

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
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroFamilyMoving})` }}
      />
      
      {/* Gradient Overlay - reduced to make image more visible */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.1) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Column - Text & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* CHECK Badge - Brand Highlight - Floating */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -8, 0]
              }}
              transition={{ 
                opacity: { delay: 0.2, duration: 0.5 },
                scale: { delay: 0.2, duration: 0.5 },
                y: { delay: 0.7, duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="inline-flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-medium border border-border"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                <Check className="h-6 w-6 text-white stroke-[3]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Wir checken für Sie</p>
                <p className="text-sm font-bold text-foreground">200+ geprüfte Umzugsfirmen</p>
              </div>
            </motion.div>
            
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              <span className="text-foreground">Umzugsfirmen vergleichen.</span>
              <span className="block text-primary mt-2">In wenigen Minuten.</span>
            </h1>
            
            {/* Subheadline with CHECK emphasis */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Wir <span className="inline-flex items-center gap-1 text-secondary font-semibold"><CheckCircle2 className="h-5 w-5" />checken</span> für Sie: 
              AI-gestützte Analyse, geprüfte Schweizer Partner, transparente Offerten – kostenlos und unverbindlich.
            </p>
            
            {/* Trust Metrics Row with Checks */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-swiss-gold text-swiss-gold" />
                <span className="font-bold text-foreground">4.8/5</span>
                <span className="text-foreground/60">Bewertung</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span className="font-bold text-foreground">15'000+</span>
                <span className="text-foreground/60">Umzüge gecheckt</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-foreground/60">100% kostenlos</span>
              </div>
            </div>
            
            {/* Live Activity Badge */}
            <div className="pt-2">
              <LiveActivityBadge />
            </div>
            
            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-4 pt-2">
              <Link to="/umzugsofferten">
                <Button size="lg" className="h-12 lg:h-14 px-5 lg:px-8 text-base lg:text-lg font-semibold shadow-cta hover:shadow-lift hover:-translate-y-0.5 transition-all">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Jetzt checken lassen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/umzugsrechner">
                <Button size="lg" variant="secondary" className="h-12 lg:h-14 px-5 lg:px-8 text-base lg:text-lg font-semibold">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Right Column - Quick Quote Form - Floating */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: 1, 
              y: [0, -10, 0]
            }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.2 },
              y: { delay: 0.8, duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="bg-card rounded-2xl shadow-xl border border-border p-6 sm:p-8">
              <div className="space-y-5">
                {/* Form Header with Check */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
                    <Clock className="h-4 w-4" />
                    In 2 Minuten zum Vergleich
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    Kostenlos Offerten erhalten
                  </h2>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="from" className="text-foreground font-medium text-sm">Von (PLZ oder Ort)</Label>
                    <Input
                      id="from"
                      placeholder="z.B. 8001 Zürich"
                      value={fromPostal}
                      onChange={(e) => setFromPostal(e.target.value)}
                      className="h-12 text-base bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="to" className="text-foreground font-medium text-sm">Nach (PLZ oder Ort)</Label>
                    <Input
                      id="to"
                      placeholder="z.B. 3011 Bern"
                      value={toPostal}
                      onChange={(e) => setToPostal(e.target.value)}
                      className="h-12 text-base bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rooms" className="text-foreground font-medium text-sm">Wohnungsgrösse</Label>
                    <Select value={rooms} onValueChange={setRooms}>
                      <SelectTrigger className="h-12 text-base bg-background border-border/60">
                        <SelectValue placeholder="Wählen Sie..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
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
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all animate-pulse-subtle group"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Jetzt checken lassen</span>
                    <span className="sm:hidden">Checken</span>
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
                
                {/* Trust Microcopy with Checks */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-sm text-foreground/60">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Kostenlos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Unverbindlich
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-secondary" />
                    Datenschutz
                  </span>
                </div>
              </div>
            </div>
            
            {/* Mobile CTAs */}
            <div className="flex flex-col gap-3 mt-6 lg:hidden">
              <Link to="/umzugsrechner" className="w-full">
                <Button size="lg" variant="outline" className="w-full h-11 text-sm font-semibold border-2 hover:bg-primary/5">
                  Kosten berechnen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
