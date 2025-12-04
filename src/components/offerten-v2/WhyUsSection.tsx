/**
 * WhyUsSection - Key benefits and USPs
 * 
 * OPTIMIZATIONS:
 * 81. 3D card hover with perspective
 * 82. Animated gradient borders
 * 83. Icon morphing animations
 * 84. Staggered reveal with better timing
 * 85. Trust indicator counter animation
 * 86. Better responsive grid
 * 87. Floating decorative elements
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Scale, Shield, MapPin, CheckCircle2, Zap, Award, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Clock,
    title: "Zeit sparen",
    description: "Ein Formular statt dutzende Telefonate und E-Mails. Erhalten Sie mehrere Angebote mit nur einer Anfrage.",
    checkmark: "Mehrere Offerten mit nur einer Anfrage",
    gradient: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    hoverGlow: "group-hover:shadow-blue-500/20",
  },
  {
    icon: Scale,
    title: "Fairer Marktvergleich",
    description: "Vergleichen Sie Preise und Leistungen verschiedener Anbieter transparent nebeneinander.",
    checkmark: "Transparente Angebote ohne versteckte Kosten",
    gradient: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    hoverGlow: "group-hover:shadow-purple-500/20",
  },
  {
    icon: Shield,
    title: "Geprüfte Anbieter",
    description: "Alle Umzugsfirmen durchlaufen unseren Qualitätscheck. Sie erhalten nur seriöse Angebote.",
    checkmark: "Nur Firmen, die unseren Kriterien entsprechen",
    gradient: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    hoverGlow: "group-hover:shadow-green-500/20",
  },
  {
    icon: MapPin,
    title: "Schweizer Fokus",
    description: "Lokale Expertise in allen 26 Kantonen. Anbieter kennen die regionalen Gegebenheiten.",
    checkmark: "Angebote aus Ihrer Region, in Ihrer Sprache",
    gradient: "from-primary to-primary/80",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
    hoverGlow: "group-hover:shadow-primary/20",
  },
];

// Animated counter component
function AnimatedStat({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");
  
  useEffect(() => {
    if (!isInView) return;
    
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    const duration = 1500;
    const steps = 40;
    const stepTime = duration / steps;
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      if (value.includes("/")) {
        setDisplay((numericValue * easeOut).toFixed(1));
      } else if (value.includes("+")) {
        setDisplay(Math.round(numericValue * easeOut) + "+");
      } else {
        setDisplay(value);
      }
      
      if (step >= steps) {
        clearInterval(interval);
        setDisplay(value);
      }
    }, stepTime);
    
    return () => clearInterval(interval);
  }, [value, isInView]);
  
  return <span ref={ref}>{display}{suffix}</span>;
}

export default function WhyUsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-muted/20 relative overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          y: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      
      {/* Decorative icons */}
      <motion.div
        className="absolute top-1/4 left-[10%] opacity-10"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <Star className="w-16 h-16 text-primary" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 right-[10%] opacity-10"
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <TrendingUp className="w-20 h-20 text-blue-500" />
      </motion.div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full mb-4"
          >
            <Award className="w-4 h-4" />
            Ihre Vorteile
          </motion.div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Warum Umzugsofferten über umzugscheck.ch vergleichen?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Wir machen den Umzugsvergleich einfach, transparent und effizient.
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group perspective-1000"
            >
              <motion.div
                whileHover={{ 
                  y: -10, 
                  rotateX: 5,
                  rotateY: -5,
                }}
                transition={{ duration: 0.3 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card className={`h-full border-0 shadow-lg hover:shadow-2xl ${benefit.hoverGlow} transition-all duration-300 overflow-hidden relative`}>
                  {/* Animated gradient border */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="absolute inset-[2px] bg-card rounded-[calc(var(--radius)-2px)]" />
                  
                  <CardContent className="p-6 relative z-10">
                    {/* Icon with glow */}
                    <motion.div 
                      className={`relative w-14 h-14 rounded-2xl ${benefit.bgColor} flex items-center justify-center mb-4`}
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Glow effect */}
                      <motion.div
                        className={`absolute inset-0 rounded-2xl ${benefit.bgColor} blur-xl opacity-0 group-hover:opacity-60`}
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <benefit.icon className={`relative w-7 h-7 ${benefit.iconColor}`} />
                    </motion.div>
                    
                    <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {benefit.description}
                    </p>
                    
                    {/* Checkmark with animation */}
                    <div className="flex items-start gap-2 pt-4 border-t border-border/50">
                      <motion.div 
                        className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      </motion.div>
                      <span className="text-sm font-medium text-foreground">
                        {benefit.checkmark}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        {/* Trust indicators row with animated counters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-4 md:gap-8"
        >
          {[
            { icon: Zap, text: "Schnelle Antworten", value: "< 24h" },
            { icon: Shield, text: "Geprüfte Partner", value: "100+" },
            { icon: Award, text: "Kundenzufriedenheit", value: "4.8/5" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.text}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex items-center gap-3 bg-card/80 backdrop-blur-sm px-5 py-3.5 rounded-xl border border-border/50 shadow-sm hover:shadow-lg transition-all"
            >
              <motion.div
                className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
                whileHover={{ rotate: 10 }}
              >
                <stat.icon className="w-5 h-5 text-primary" />
              </motion.div>
              <div>
                <div className="text-xl font-bold text-foreground">
                  <AnimatedStat value={stat.value} />
                </div>
                <div className="text-xs text-muted-foreground">{stat.text}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
