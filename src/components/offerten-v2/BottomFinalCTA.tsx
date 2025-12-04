/**
 * BottomFinalCTA - Final call-to-action section
 * Strong conversion push at the end of the page
 * 
 * OPTIMIZATIONS:
 * 53. Animated background with floating shapes
 * 54. Urgency element with live counter
 * 55. Enhanced badge animations
 * 56. 3D button effect with shadow
 * 57. Animated trust indicators
 * 58. Pulsing CTA glow
 * 59. Better visual hierarchy with gradients
 * 60. Floating icon decorations
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUp, 
  Sparkles, 
  CheckCircle2, 
  Shield, 
  Clock, 
  Award,
  Users,
  TrendingUp,
  Zap,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Floating decoration icons
const floatingIcons = [
  { Icon: Package, x: "10%", y: "20%", delay: 0 },
  { Icon: Shield, x: "85%", y: "15%", delay: 0.5 },
  { Icon: Users, x: "15%", y: "70%", delay: 1 },
  { Icon: TrendingUp, x: "90%", y: "75%", delay: 1.5 },
];

export default function BottomFinalCTA() {
  const [activeUsers, setActiveUsers] = useState(23);
  
  // Simulate live user count
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newValue = prev + change;
        return Math.min(Math.max(newValue, 18), 35);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Decorative blur elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      {/* Floating icons */}
      {floatingIcons.map(({ Icon, x, y, delay }, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:block"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.15, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
        >
          <Icon className="w-12 h-12 text-primary" />
        </motion.div>
      ))}
      
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Live activity indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-6 border border-green-200"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm font-medium">
              <span className="font-bold">{activeUsers}</span> Personen vergleichen gerade
            </span>
          </motion.div>
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full mb-8 border border-primary/20"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span className="text-sm font-semibold">Kostenlos & unverbindlich</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Bereit für Ihren Umzug?
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Geben Sie Ihre Daten einmal ein und erhalten Sie mehrere Offerten von 
            Umzugsfirmen, die zu Ihnen passen.
          </p>
          
          {/* CTA Button with glow */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              {/* Pulsing glow effect */}
              <motion.div
                className="absolute inset-0 bg-primary rounded-xl blur-xl"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <Button
                size="lg"
                onClick={scrollToTop}
                className="relative bg-primary hover:bg-primary/90 text-lg px-10 h-14 shadow-2xl shadow-primary/30 font-semibold"
              >
                <Zap className="w-5 h-5 mr-2" />
                Jetzt Umzug berechnen & Offerten erhalten
                <ArrowUp className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
          
          {/* Trust indicators with animations */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {[
              { icon: Clock, text: "In unter 2 Minuten", color: "blue" },
              { icon: Shield, text: "100% kostenlos", color: "green" },
              { icon: Award, text: "Nur geprüfte Firmen", color: "amber" },
            ].map((item, index) => (
              <motion.div 
                key={item.text} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2.5 text-muted-foreground"
              >
                <motion.div 
                  className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </motion.div>
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom reassurance */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground mt-8"
          >
            Bereits über <span className="font-bold text-foreground">15'000</span> erfolgreiche Umzüge vermittelt
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}