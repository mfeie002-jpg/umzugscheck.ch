import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Home, MapPin, ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";
import SectionBadge from "@/components/SectionBadge";

const MiniCalculator = () => {
  const [rooms, setRooms] = useState("3");
  const [distance, setDistance] = useState("local");
  const [extras, setExtras] = useState(false);

  const calculateEstimate = () => {
    const basePrice = parseInt(rooms) * 300;
    const distanceMultiplier = distance === "local" ? 1 : distance === "regional" ? 1.5 : 2;
    const extrasPrice = extras ? 500 : 0;
    const estimate = basePrice * distanceMultiplier + extrasPrice;
    return {
      min: Math.round(estimate * 0.8),
      max: Math.round(estimate * 1.2),
    };
  };

  const estimate = calculateEstimate();

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <SectionBadge>Schnellrechner</SectionBadge>
          <h2 className="text-balance font-display mt-4 text-2xl sm:text-3xl lg:text-4xl">
            Ihr <span className="text-gradient">Umzug</span> geschätzt in 10 Sekunden
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Erhalten Sie eine erste Kostenschätzung – kostenlos und unverbindlich.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <Card className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Home className="inline h-4 w-4 mr-1 text-alpine" />
                  Anzahl Zimmer
                </label>
                <Select value={rooms} onValueChange={setRooms}>
                  <SelectTrigger className="h-12 sm:h-12 min-h-[48px] text-base touch-manipulation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1" className="min-h-[44px] text-base">1 Zimmer</SelectItem>
                    <SelectItem value="2" className="min-h-[44px] text-base">2 Zimmer</SelectItem>
                    <SelectItem value="3" className="min-h-[44px] text-base">3 Zimmer</SelectItem>
                    <SelectItem value="4" className="min-h-[44px] text-base">4 Zimmer</SelectItem>
                    <SelectItem value="5" className="min-h-[44px] text-base">5+ Zimmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <MapPin className="inline h-4 w-4 mr-1 text-alpine" />
                  Distanz
                </label>
                <Select value={distance} onValueChange={setDistance}>
                  <SelectTrigger className="h-12 sm:h-12 min-h-[48px] text-base touch-manipulation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local" className="min-h-[44px] text-base">Lokal (bis 20 km)</SelectItem>
                    <SelectItem value="regional" className="min-h-[44px] text-base">Regional (20-50 km)</SelectItem>
                    <SelectItem value="national" className="min-h-[44px] text-base">National (50+ km)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-gradient-subtle rounded-xl p-4 sm:p-6 text-center mb-5 sm:mb-6">
              <p className="text-sm text-muted-foreground mb-2">Geschätzte Kosten</p>
              <motion.p
                key={`${rooms}-${distance}`}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-alpine"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                CHF {estimate.min.toLocaleString()} – {estimate.max.toLocaleString()}
              </motion.p>
              <p className="text-xs text-muted-foreground mt-2">
                *Richtwert. Für ein verbindliches Angebot kontaktieren Sie uns.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              <Link to="/contact" className="w-full">
                <Button size="lg" className="w-full bg-gradient-hero h-12 sm:h-12 min-h-[48px] text-base touch-manipulation">
                  Genaue Offerte anfragen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="tel:+41765681302" className="w-full">
                <Button size="lg" variant="outline" className="w-full border-2 h-12 sm:h-12 min-h-[48px] text-base touch-manipulation">
                  <Phone className="mr-2 h-5 w-5" />
                  Jetzt anrufen
                </Button>
              </a>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default MiniCalculator;
