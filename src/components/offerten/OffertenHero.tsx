import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Percent, Sparkles, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-family-moving.jpg";

const OffertenHero = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    rooms: "",
    moveDate: "",
    flexibleDates: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/rechner?from=${encodeURIComponent(formData.fromLocation)}&to=${encodeURIComponent(formData.toLocation)}`);
  };

  const trustBadges = [
    { icon: Shield, text: "Geprüfte Firmen" },
    { icon: Percent, text: "Bis zu 40 % sparen" },
    { icon: Sparkles, text: "100 % kostenlos" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
      
      <div className="container relative z-10 mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            {/* Label */}
            <span className="inline-block px-4 py-2 bg-primary/20 text-primary-foreground rounded-full text-sm font-medium mb-6 border border-primary/30">
              Umzug planen? Wir vergleichen für Sie.
            </span>
            
            {/* Headlines */}
            <h1 className="font-manrope text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2">
              Umzugsofferten vergleichen.
            </h1>
            <h2 className="font-manrope text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Kostenlos & unverbindlich.
            </h2>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
              Vergleichen Sie Offerten von über 200 geprüften Umzugsfirmen in der ganzen Schweiz. 
              Sie erhalten mehrere Angebote, sparen Zeit und bis zu 40 % der Umzugskosten.
            </p>
            
            {/* Bullet Points */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="text-white/90">Nur geprüfte Schweizer Umzugsfirmen</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Percent className="w-5 h-5 text-primary" />
                </div>
                <span className="text-white/90">Bis zu 40 % sparen dank Offertenvergleich</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="text-white/90">100 % kostenlos & unverbindlich</span>
              </li>
            </ul>

            {/* Trust Badges - Mobile */}
            <div className="flex flex-wrap gap-3 lg:hidden">
              {trustBadges.map((badge, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                >
                  <badge.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form 
              onSubmit={handleSubmit}
              className="bg-card rounded-3xl shadow-2xl p-6 md:p-8 border border-border"
            >
              <h3 className="font-manrope text-xl font-bold text-foreground mb-6">
                Jetzt kostenlose Offerten erhalten
              </h3>
              
              <div className="space-y-5">
                {/* From Location */}
                <div>
                  <Label htmlFor="fromLocation" className="text-sm font-medium text-foreground mb-2 block">
                    Start-PLZ / Ort
                  </Label>
                  <Input
                    id="fromLocation"
                    placeholder="z.B. 8001 Zürich"
                    value={formData.fromLocation}
                    onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                {/* To Location */}
                <div>
                  <Label htmlFor="toLocation" className="text-sm font-medium text-foreground mb-2 block">
                    Ziel-PLZ / Ort
                  </Label>
                  <Input
                    id="toLocation"
                    placeholder="z.B. 3001 Bern"
                    value={formData.toLocation}
                    onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                {/* Room Size */}
                <div>
                  <Label htmlFor="rooms" className="text-sm font-medium text-foreground mb-2 block">
                    Wohnungsgrösse
                  </Label>
                  <Select 
                    value={formData.rooms} 
                    onValueChange={(value) => setFormData({ ...formData, rooms: value })}
                  >
                    <SelectTrigger id="rooms" className="h-12 rounded-xl">
                      <SelectValue placeholder="Bitte wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-1.5">1–1.5-Zimmer</SelectItem>
                      <SelectItem value="2-2.5">2–2.5-Zimmer</SelectItem>
                      <SelectItem value="3-3.5">3–3.5-Zimmer</SelectItem>
                      <SelectItem value="4-4.5">4–4.5-Zimmer</SelectItem>
                      <SelectItem value="5.5+">5.5-Zimmer & grösser / Haus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Move Date */}
                <div>
                  <Label htmlFor="moveDate" className="text-sm font-medium text-foreground mb-2 block">
                    Umzugsdatum (optional)
                  </Label>
                  <Input
                    id="moveDate"
                    type="date"
                    value={formData.moveDate}
                    onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Flexible Dates */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="flexibleDates"
                    checked={formData.flexibleDates}
                    onCheckedChange={(checked) => setFormData({ ...formData, flexibleDates: checked as boolean })}
                  />
                  <Label htmlFor="flexibleDates" className="text-sm text-muted-foreground cursor-pointer">
                    Flexible Termine möglich
                  </Label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]"
                >
                  Jetzt Offerten erhalten
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                {/* Security Note */}
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Ihre Daten werden vertraulich behandelt und nur an passende Anbieter weitergegeben.
                  </span>
                </div>
              </div>
            </form>

            {/* Trust Badges - Desktop */}
            <div className="hidden lg:flex justify-center gap-4 mt-6">
              {trustBadges.map((badge, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-sm"
                >
                  <badge.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OffertenHero;
