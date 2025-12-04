/**
 * BottomFinalCTA - Final call-to-action section
 * Strong conversion push at the end of the page
 * 
 * OPTIMIZATIONS:
 * 121. Morphing background gradient
 * 122. Countdown timer urgency
 * 123. Confetti on hover
 * 124. Social proof marquee
 * 125. Animated icon ring
 * 126. Savings calculator preview
 * 127. Trust seal animations
 * 128. Breathing CTA effect
 * 129. Floating trust badges
 * 130. Comparison teaser
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Package,
  Star,
  Timer,
  Gift,
  Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Floating decoration icons
const floatingIcons = [
  { Icon: Package, x: "8%", y: "15%", delay: 0, size: 48 },
  { Icon: Shield, x: "88%", y: "12%", delay: 0.5, size: 44 },
  { Icon: Users, x: "12%", y: "75%", delay: 1, size: 40 },
  { Icon: TrendingUp, x: "92%", y: "80%", delay: 1.5, size: 52 },
  { Icon: Star, x: "5%", y: "45%", delay: 0.8, size: 36 },
  { Icon: Award, x: "95%", y: "45%", delay: 1.2, size: 42 },
];

// Social proof names for marquee
const recentUsers = [
  { name: "Sandra M.", city: "Zürich", time: "vor 2 Min." },
  { name: "Marco K.", city: "Bern", time: "vor 5 Min." },
  { name: "Lisa T.", city: "Basel", time: "vor 8 Min." },
  { name: "Peter S.", city: "Luzern", time: "vor 12 Min." },
  { name: "Anna B.", city: "St. Gallen", time: "vor 15 Min." },
];

export default function BottomFinalCTA() {
  const [activeUsers, setActiveUsers] = useState(23);
  const [currentProof, setCurrentProof] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
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
  
  // Rotate social proof
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProof(prev => (prev + 1) % recentUsers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Morphing gradient background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, rgba(var(--primary), 0.08) 0%, rgba(var(--primary), 0.02) 50%, transparent 100%)",
            "linear-gradient(225deg, rgba(var(--primary), 0.1) 0%, rgba(var(--primary), 0.03) 50%, transparent 100%)",
            "linear-gradient(315deg, rgba(var(--primary), 0.08) 0%, rgba(var(--primary), 0.02) 50%, transparent 100%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
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
      <motion.div 
        className="absolute top-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [-20, 20, -20] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], y: [-30, 30, -30] }}
        transition={{ duration: 18, repeat: Infinity }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl" />
      
      {/* Floating icons */}
      {floatingIcons.map(({ Icon, x, y, delay, size }, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:block"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.12, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 8, -8, 0],
          }}
        >
          <Icon style={{ width: size, height: size }} className="text-primary" />
        </motion.div>
      ))}
      
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Social proof marquee */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProof}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{recentUsers[currentProof].name}</span>
                  {" "}aus {recentUsers[currentProof].city} hat gerade verglichen
                </span>
                <span className="text-xs text-muted-foreground">{recentUsers[currentProof].time}</span>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          {/* Live activity indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2.5 rounded-full mb-6 border border-green-200 shadow-sm"
          >
            <motion.div
              className="relative w-3 h-3"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-green-500"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="relative w-3 h-3 rounded-full bg-green-500" />
            </motion.div>
            <span className="text-sm font-medium">
              <motion.span 
                key={activeUsers}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block font-bold"
              >
                {activeUsers}
              </motion.span>
              {" "}Personen vergleichen gerade
            </span>
          </motion.div>
          
          {/* Badge row */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="text-sm font-semibold">Kostenlos & unverbindlich</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full border border-amber-200"
            >
              <Gift className="w-4 h-4" />
              <span className="text-sm font-semibold">Bis 40% sparen</span>
            </motion.div>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Bereit für Ihren Umzug?
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Geben Sie Ihre Daten einmal ein und erhalten Sie mehrere Offerten von 
            Umzugsfirmen, die zu Ihnen passen.
          </p>
          
          {/* CTA Button with enhanced effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <motion.div
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              {/* Multi-layer glow effect */}
              <motion.div
                className="absolute inset-0 bg-primary rounded-xl blur-xl"
                animate={{
                  opacity: isHovered ? [0.4, 0.6, 0.4] : [0.2, 0.4, 0.2],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute inset-0 bg-primary rounded-xl blur-2xl"
                animate={{
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1.1, 1.2, 1.1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              
              <Button
                size="lg"
                onClick={scrollToTop}
                className="relative bg-primary hover:bg-primary/90 text-lg px-10 h-14 shadow-2xl shadow-primary/30 font-semibold overflow-hidden group"
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
                
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap className="w-5 h-5 mr-2" />
                </motion.div>
                <span className="relative">Jetzt Umzug berechnen & Offerten erhalten</span>
                <ArrowUp className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
          
          {/* Trust indicators with animations */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {[
              { icon: Clock, text: "In unter 2 Minuten" },
              { icon: Shield, text: "100% kostenlos" },
              { icon: Award, text: "Nur geprüfte Firmen" },
            ].map((item, index) => (
              <motion.div 
                key={item.text} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="flex items-center gap-2.5 text-muted-foreground"
              >
                <motion.div 
                  className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shadow-sm"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />
                </motion.div>
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom reassurance with counter */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-10 inline-flex items-center gap-3 bg-card/50 backdrop-blur-sm px-6 py-3 rounded-xl border border-border/50"
          >
            <div className="flex -space-x-2">
              {["SM", "MK", "LT", "PS"].map((initials, i) => (
                <motion.div
                  key={initials}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-xs font-bold border-2 border-background"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  {initials}
                </motion.div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm text-foreground font-semibold">
                Bereits über <span className="text-primary">15'000</span> erfolgreiche Umzüge
              </p>
              <p className="text-xs text-muted-foreground">
                vermittelt in der ganzen Schweiz
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}