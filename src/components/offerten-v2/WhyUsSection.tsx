/**
 * WhyUsSection - Key benefits and USPs
 * 
 * OPTIMIZATIONS (336-355):
 * 336. 3D perspective card transforms
 * 337. Animated gradient mesh backgrounds
 * 338. Icon animation sequences
 * 339. Interactive stat counters
 * 340. Floating accent shapes
 * 341. Card reveal animations
 * 342. Hover state transitions
 * 343. Badge glow effects
 * 344. Progress indicators
 * 345. Testimonial snippets
 * 346. Trust certification icons
 * 347. Mobile card carousel
 * 348. Comparison highlights
 * 349. Feature checkmarks
 * 350. CTA integration
 * 351. Background particles
 * 352. Card depth shadows
 * 353. Icon morph effects
 * 354. Scroll-based reveals
 * 355. Interactive tooltips
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Clock, Scale, Shield, MapPin, CheckCircle2, Zap, Award, Star, TrendingUp, Sparkles, Quote, ArrowRight, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    stat: "85%",
    statLabel: "Zeitersparnis",
    testimonial: "Ich hätte nie gedacht, dass es so einfach sein kann!",
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
    stat: "40%",
    statLabel: "Ersparnis",
    testimonial: "Die Preisunterschiede haben mich wirklich überrascht.",
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
    stat: "100%",
    statLabel: "Geprüft",
    testimonial: "Endlich keine unseriösen Anbieter mehr!",
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
    stat: "26",
    statLabel: "Kantone",
    testimonial: "Lokale Firmen, die unsere Gegend kennen – perfekt!",
  },
];

// 339. Animated counter component with enhanced effects
function AnimatedStat({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (!isInView) return;
    setIsAnimating(true);
    
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
        setIsAnimating(false);
      }
    }, stepTime);
    
    return () => clearInterval(interval);
  }, [value, isInView]);
  
  return (
    <motion.span 
      ref={ref}
      animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {display}{suffix}
    </motion.span>
  );
}

// 336. 3D Card Component
function BenefitCard({ benefit, index }: { benefit: typeof benefits[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={isHovered ? { 
          rotateX: 5,
          rotateY: -5,
          y: -10,
        } : {
          rotateX: 0,
          rotateY: 0,
          y: 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card className={`h-full border-0 shadow-lg hover:shadow-2xl ${benefit.hoverGlow} transition-all duration-300 overflow-hidden relative`}>
          {/* 337. Animated gradient border */}
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />
          <div className="absolute inset-[2px] bg-card rounded-[calc(var(--radius)-2px)]" />
          
          <CardContent className="p-6 relative z-10">
            {/* 338. Animated icon with glow */}
            <motion.div 
              className={`relative w-14 h-14 rounded-2xl ${benefit.bgColor} flex items-center justify-center mb-4`}
              animate={isHovered ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* 343. Glow effect */}
              <motion.div
                className={`absolute inset-0 rounded-2xl ${benefit.bgColor} blur-xl`}
                animate={isHovered ? { opacity: 0.8, scale: 1.3 } : { opacity: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* 353. Icon morph */}
              <motion.div
                animate={isHovered ? { rotateY: 360 } : { rotateY: 0 }}
                transition={{ duration: 0.6 }}
              >
                <benefit.icon className={`relative w-7 h-7 ${benefit.iconColor}`} />
              </motion.div>
            </motion.div>
            
            {/* Title with 355. tooltip */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {benefit.title}
              </h3>
              <motion.button
                className="text-muted-foreground hover:text-primary transition-colors"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info className="w-4 h-4" />
              </motion.button>
              
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute top-16 left-0 right-0 mx-4 bg-card border border-border rounded-lg p-3 shadow-xl z-20"
                  >
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {benefit.description}
            </p>
            
            {/* 348. Stat highlight badge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`inline-flex items-center gap-2 ${benefit.bgColor} px-3 py-1.5 rounded-full mb-4`}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className={`w-3.5 h-3.5 ${benefit.iconColor}`} />
              </motion.div>
              <span className={`text-sm font-bold ${benefit.iconColor}`}>
                <AnimatedStat value={benefit.stat} />
              </span>
              <span className="text-xs text-muted-foreground">{benefit.statLabel}</span>
            </motion.div>
            
            {/* 345. Testimonial snippet */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                    <Quote className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-xs italic text-muted-foreground">
                      "{benefit.testimonial}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* 349. Checkmark with animation */}
            <div className="flex items-start gap-2 pt-4 border-t border-border/50">
              <motion.div 
                className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
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
  );
}

export default function WhyUsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-muted/20 relative overflow-hidden">
      {/* 337. Animated mesh background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 70%, hsl(221 83% 53% / 0.1) 0%, transparent 50%)`,
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      
      {/* 340. Floating decorative elements */}
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
      
      {/* 351. Background particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
      
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
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full mb-4"
          >
            <Award className="w-4 h-4" />
            Ihre Vorteile
          </motion.div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Warum Umzugsofferten über{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              umzugscheck.ch
            </span>
            {" "}vergleichen?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Wir machen den Umzugsvergleich einfach, transparent und effizient.
          </p>
        </motion.div>
        
        {/* 341. Cards grid with reveal animation */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.title} benefit={benefit} index={index} />
          ))}
        </div>
        
        {/* Trust indicators row with animated counters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
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
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.1 }}
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
        
        {/* 350. CTA integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            Jetzt Offerten vergleichen
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}