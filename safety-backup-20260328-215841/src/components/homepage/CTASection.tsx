import { memo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Confetti, 
  BorderBeam, 
  MagneticButton, 
  ShinyText, 
  AnimatedCheck,
  NumberTicker
} from "@/components/common";
import { ParticleField } from "@/components/common/ParticleField";
import { FloatingDock } from "@/components/common/FloatingDock";
import { Home, Calculator, Building2, Phone } from "lucide-react";

export const CTASection = memo(function CTASection() {
  const [showConfetti, setShowConfetti] = useState(false);
  
  const handleHover = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
  };

  const dockItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Calculator, label: "Rechner", href: "/umzugsrechner" },
    { icon: Building2, label: "Firmen", href: "/umzugsfirmen" },
    { icon: Phone, label: "Kontakt", href: "/kontakt" }
  ];

  return (
    <section className="py-16 md:py-24 relative">
      {/* Confetti Effect */}
      <Confetti trigger={showConfetti} />
      
      {/* Floating Dock Navigation */}
      <FloatingDock items={dockItems} className="hidden md:flex" />
      
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Multi-layer gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-secondary/90" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
          
          {/* Animated gradient orbs */}
          <motion.div
            className="absolute -top-20 -left-20 w-60 h-60 bg-white/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative p-8 md:p-14 text-center">
            {/* ParticleField Background */}
            <ParticleField 
              particleCount={30} 
              particleColor="hsl(0 0% 100%)" 
              speed={0.3} 
              className="opacity-30"
            />
            
            {/* Border Beam Effect */}
            <BorderBeam size={300} duration={20} />
          
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4" />
                <NumberTicker value={15000} suffix="+" className="font-bold" /> zufriedene Kunden
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Bereit für Ihren nächsten <ShinyText className="text-white">Umzug</ShinyText>?
              </h2>
              <p className="text-white/90 text-lg">
                In 2 Minuten zu Ihren kostenlosen Offerten von geprüften Schweizer Umzugsfirmen.
              </p>
              
              <MagneticButton strength={0.2}>
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-secondary hover:bg-white/90 font-bold text-base h-14 px-8 rounded-xl shadow-lift group"
                  onMouseEnter={handleHover}
                >
                  <Link to="/umzugsofferten">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Jetzt Offerten erhalten
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </MagneticButton>
              
              {/* Trust Points with Animated Checks */}
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <motion.div 
                  className="flex items-center gap-2 text-white/90 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <AnimatedCheck size={18} color="text-white" delay={0.4} />
                  100% kostenlos
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 text-white/90 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <AnimatedCheck size={18} color="text-white" delay={0.5} />
                  Unverbindlich
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 text-white/90 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <AnimatedCheck size={18} color="text-white" delay={0.6} />
                  In 2 Minuten fertig
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
