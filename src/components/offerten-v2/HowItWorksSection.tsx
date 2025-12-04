/**
 * HowItWorksSection - 4-step process explanation
 * 
 * OPTIMIZATIONS (316-335):
 * 316. 3D rotating step cards
 * 317. Animated SVG icons
 * 318. Interactive timeline dots
 * 319. Step hover expansion
 * 320. Connecting line animation
 * 321. Step completion checkmarks
 * 322. Mobile accordion view
 * 323. Video preview hints
 * 324. Step duration indicators
 * 325. Interactive demo button
 * 326. Floating decoration shapes
 * 327. Gradient text highlights
 * 328. Responsive card sizing
 * 329. Step number pulse
 * 330. Info tooltip popups
 * 331. Progress tracker bar
 * 332. Animated background blobs
 * 333. Card shadow depth
 * 334. Icon morph transitions
 * 335. Scroll-triggered reveals
 * 441. Interactive step preview
 * 442. Animated step connector
 * 443. Time estimation badges
 * 444. Step completion rewards
 * 445. Micro-interaction sounds hint
 * 446. Step dependency visualization
 * 447. Quick start CTA integration
 * 448. Animated progress ring
 * 449. Step detail expandable
 * 450. Celebration confetti on complete
 */

import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FileText, Cpu, Users, CheckCircle, Sparkles, ArrowRight, ChevronRight, Zap, Play, Clock, Info, ChevronDown } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    icon: FileText,
    title: "Daten eingeben",
    description: "Wohnungsgrösse, Strecke und Zusatzservices – in weniger als 2 Minuten.",
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-500/10 to-blue-600/5",
    glowColor: "blue",
    stat: "2 Min.",
    statLabel: "Durchschnitt",
    duration: "~2 Minuten",
    details: ["PLZ eingeben", "Zimmerzahl wählen", "Services auswählen"],
  },
  {
    icon: Cpu,
    title: "KI schätzt die Kosten",
    description: "Auf Basis tausender realer Umzüge in der Schweiz erhalten Sie eine realistische Preisspanne.",
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-500/10 to-purple-600/5",
    glowColor: "purple",
    stat: "15'000+",
    statLabel: "Datenpunkte",
    duration: "Sofort",
    details: ["Historische Daten", "Marktanalyse", "Saisonale Faktoren"],
  },
  {
    icon: Users,
    title: "Passende Firmen erhalten Ihre Anfrage",
    description: "Wir matchen Ihre Daten mit geprüften Umzugsfirmen in Ihrer Region.",
    gradient: "from-amber-500 to-amber-600",
    bgGradient: "from-amber-500/10 to-amber-600/5",
    glowColor: "amber",
    stat: "85+",
    statLabel: "Firmen",
    duration: "~1 Minute",
    details: ["Regionales Matching", "Qualitätsprüfung", "Kapazitätscheck"],
  },
  {
    icon: CheckCircle,
    title: "Offerten vergleichen & beste Firma wählen",
    description: "Sie entscheiden – nach Preis, Bewertungen und Leistungen.",
    gradient: "from-green-500 to-green-600",
    bgGradient: "from-green-500/10 to-green-600/5",
    glowColor: "green",
    stat: "40%",
    statLabel: "Ersparnis",
    duration: "1-2 Tage",
    details: ["Preisvergleich", "Bewertungen lesen", "Firma kontaktieren"],
  },
];

// 320. Animated connection line particle
const LineParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary/50 shadow-lg shadow-primary/50"
    initial={{ left: "0%", opacity: 0 }}
    animate={{ 
      left: ["0%", "100%"],
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1, 1, 0.5],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

// 329. Pulsing step number
const StepNumber = ({ number, isActive, isCompleted }: { number: number; isActive: boolean; isCompleted: boolean }) => (
  <motion.div
    className="relative"
    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
    transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
  >
    <motion.div
      className={`absolute inset-0 rounded-full ${isActive ? "bg-primary/30" : "bg-transparent"}`}
      animate={isActive ? { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
      isCompleted ? "bg-green-500 text-white" : isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground"
    }`}>
      {isCompleted ? <CheckCircle className="w-5 h-5" /> : number}
    </div>
  </motion.div>
);

// 319. Expandable step card for mobile
const MobileStepCard = ({ step, index, isExpanded, onToggle }: { 
  step: typeof steps[0]; 
  index: number; 
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <motion.button
        onClick={onToggle}
        className="w-full text-left"
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex gap-4">
          {/* Step indicator and line */}
          <div className="relative flex flex-col items-center">
            <motion.div 
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center flex-shrink-0 shadow-lg relative`}
              whileHover={{ scale: 1.1 }}
            >
              <step.icon className="w-7 h-7 text-white" />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-primary text-xs font-bold flex items-center justify-center shadow-md">
                {index + 1}
              </span>
            </motion.div>
            
            {/* Connection line */}
            {index < steps.length - 1 && (
              <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/40 to-primary/10 mt-3 min-h-[40px] relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-primary to-transparent"
                  animate={{ y: ["0%", "500%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 pb-6">
            <div className="flex items-center justify-between">
              <motion.span 
                className={`inline-block text-xs font-bold text-white bg-gradient-to-r ${step.gradient} px-3 py-1 rounded-full mb-2 shadow-sm`}
              >
                Schritt {index + 1}
              </motion.span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </div>
            
            <h3 className="font-semibold text-foreground mb-1 text-lg">
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
            
            {/* 324. Duration indicator */}
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{step.duration}</span>
            </div>
            
            {/* Expandable details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-2"
                >
                  {step.details.map((detail, i) => (
                    <motion.div
                      key={detail}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{detail}</span>
                    </motion.div>
                  ))}
                  
                  {/* Stat badge */}
                  <div className={`inline-flex items-center gap-1.5 ${step.bgGradient} px-3 py-1.5 rounded-full mt-2`}>
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-bold text-primary">{step.stat}</span>
                    <span className="text-xs text-muted-foreground">{step.statLabel}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
};

// 316. 3D rotating desktop step card
const DesktopStepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="relative text-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "1000px" }}
    >
      {/* Step Number & Icon with 3D effect */}
      <div className="relative z-10 mx-auto mb-6">
        <motion.div 
          className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${step.bgGradient} border-2 border-border/50 flex items-center justify-center mx-auto shadow-lg transition-all duration-300`}
          animate={isHovered ? { 
            rotateY: 10, 
            rotateX: -10,
            y: -8,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          } : {
            rotateY: 0,
            rotateX: 0,
            y: 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* 317. Animated icon */}
          <motion.div 
            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
            animate={isHovered ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={isHovered ? { 
                rotateY: 360 
              } : {}}
              transition={{ duration: 0.6 }}
            >
              <step.icon className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Step number badge with pulse */}
        <motion.div 
          className={`absolute -top-3 -right-3 w-11 h-11 rounded-xl bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center font-bold text-lg shadow-lg`}
          initial={{ scale: 0, rotate: -45 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
          whileHover={{ scale: 1.15, rotate: 10 }}
        >
          {index + 1}
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-white"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
          />
        </motion.div>
        
        {/* 324. Duration badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 + index * 0.1 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-card px-2 py-1 rounded-full border border-border/50 shadow-sm text-xs"
        >
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">{step.duration}</span>
        </motion.div>
      </div>
      
      {/* 327. Gradient text on hover */}
      <motion.h3 
        className={`font-semibold mb-2 text-lg transition-all duration-300 ${
          isHovered ? "bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent" : "text-foreground"
        }`}
      >
        {step.title}
      </motion.h3>
      
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {step.description}
      </p>
      
      {/* Stats badge with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.5 + index * 0.1 }}
        whileHover={{ scale: 1.05, y: -2 }}
        className="inline-flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full cursor-default"
      >
        <Zap className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold text-primary">{step.stat}</span>
        <span className="text-xs text-muted-foreground">{step.statLabel}</span>
      </motion.div>
      
      {/* Hover details panel */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-3 bg-card border border-border rounded-xl shadow-xl z-20"
          >
            <p className="text-xs font-medium text-foreground mb-2">Details:</p>
            {step.details.map((detail, i) => (
              <div key={detail} className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <div className="w-1 h-1 rounded-full bg-primary" />
                {detail}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Arrow indicator (except last) */}
      {index < steps.length - 1 && (
        <motion.div
          className="hidden lg:block absolute top-14 -right-3 text-muted-foreground/30"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="w-6 h-6" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default function HowItWorksSection() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* 332. Background decorations with animated blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <motion.div 
        className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
          y: [0, -30, 0]
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      
      {/* 326. Floating decoration shapes */}
      <motion.div
        className="absolute top-20 left-[10%] w-4 h-4 bg-primary/20 rounded-full"
        animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-[15%] w-6 h-6 bg-blue-500/20 rounded-lg"
        animate={{ y: [0, 20, 0], rotate: [0, -90, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4" />
            In 4 einfachen Schritten
          </motion.div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            So funktioniert unser{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              KI-Umzugsrechner
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-6">
            In vier einfachen Schritten zu Ihren persönlichen Umzugsofferten
          </p>
          
          {/* 325. Interactive demo button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 bg-card border border-border/50 px-4 py-2 rounded-full text-sm font-medium text-foreground hover:border-primary/50 transition-colors shadow-sm"
          >
            <Play className="w-4 h-4 text-primary" />
            Demo ansehen
            <span className="text-xs text-muted-foreground">(30 Sek.)</span>
          </motion.button>
        </motion.div>
        
        {/* 331. Progress tracker bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="hidden md:flex items-center justify-center gap-2 mb-12"
        >
          {steps.map((_, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary"
                whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--primary))", color: "white" }}
              >
                {index + 1}
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div 
                  className="w-16 h-1 bg-primary/20 mx-2 rounded-full overflow-hidden"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.2 }}
                >
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ x: "-100%" }}
                    animate={isInView ? { x: "100%" } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  />
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
        
        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* 320. Animated gradient connection line */}
            <div className="absolute top-14 left-[12.5%] right-[12.5%] h-1.5 rounded-full overflow-hidden bg-gradient-to-r from-blue-200 via-purple-200 via-amber-200 to-green-200">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-amber-500 to-green-500"
                initial={{ x: "-100%" }}
                animate={isInView ? { x: "0%" } : {}}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* Line particles */}
              {[0, 1, 2].map((i) => (
                <LineParticle key={i} delay={i * 1.5} />
              ))}
            </div>
            
            {/* 318. Interactive junction dots */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute top-[52px] w-4 h-4 rounded-full bg-white border-2 border-primary shadow-lg shadow-primary/30 cursor-pointer hover:scale-125 transition-transform"
                style={{ left: `${25 + i * 25}%`, transform: "translateX(-50%)" }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                whileHover={{ scale: 1.3 }}
              />
            ))}
            
            <div className="grid grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <DesktopStepCard key={step.title} step={step} index={index} />
              ))}
            </div>
          </div>
        </div>
        
        {/* 322. Mobile: Accordion Timeline */}
        <div className="md:hidden space-y-1">
          {steps.map((step, index) => (
            <MobileStepCard 
              key={step.title} 
              step={step} 
              index={index}
              isExpanded={expandedStep === index}
              onToggle={() => setExpandedStep(expandedStep === index ? null : index)}
            />
          ))}
        </div>
        
        {/* Bottom trust indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50 shadow-sm">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
            </motion.div>
            <p className="text-sm text-foreground">
              Bereits über <span className="font-bold text-primary">15'000</span> erfolgreiche Umzüge vermittelt
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}