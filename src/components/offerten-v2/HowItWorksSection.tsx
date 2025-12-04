/**
 * HowItWorksSection - 4-step process explanation
 * 
 * OPTIMIZATIONS:
 * 74. Animated gradient line
 * 75. Icon glow effects
 * 76. Step completion animation
 * 77. Hover state improvements
 * 78. Mobile swipe indicator
 * 79. Better responsive typography
 * 80. Connection line particles
 * 168. Pulsing step numbers
 * 169. Animated icon backgrounds
 * 170. Completion celebration effect
 * 171. Step progress indicators
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Cpu, Users, CheckCircle, Sparkles, ArrowRight, ChevronRight, Zap } from "lucide-react";

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
  },
];

// 168. Animated particle on connection line with enhanced effects
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

// 169. Step number pulse animation
const StepNumber = ({ number, isActive }: { number: number; isActive: boolean }) => (
  <motion.div
    className="relative"
    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
    transition={{ duration: 1.5, repeat: Infinity }}
  >
    <motion.div
      className={`absolute inset-0 rounded-full ${isActive ? "bg-primary/30" : "bg-transparent"}`}
      animate={isActive ? { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
    }`}>
      {number}
    </div>
  </motion.div>
);

export default function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <motion.div 
        className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4" />
            In 4 einfachen Schritten
          </motion.div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            So funktioniert unser KI-Umzugsrechner
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            In vier einfachen Schritten zu Ihren persönlichen Umzugsofferten
          </p>
        </motion.div>
        
        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Animated gradient connection line */}
            <div className="absolute top-14 left-[12.5%] right-[12.5%] h-1.5 rounded-full overflow-hidden bg-gradient-to-r from-blue-200 via-purple-200 via-amber-200 to-green-200">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-amber-500 to-green-500"
                initial={{ x: "-100%" }}
                whileInView={{ x: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* Line particles */}
              {[0, 1, 2].map((i) => (
                <LineParticle key={i} delay={i * 1.5} />
              ))}
            </div>
            
            {/* Pulsing junction dots */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute top-[52px] w-4 h-4 rounded-full bg-white border-2 border-primary shadow-lg shadow-primary/30"
                style={{ left: `${25 + i * 25}%`, transform: "translateX(-50%)" }}
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 4px 6px -1px rgba(var(--primary), 0.1)",
                    "0 10px 15px -3px rgba(var(--primary), 0.3)",
                    "0 4px 6px -1px rgba(var(--primary), 0.1)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
            
            <div className="grid grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="relative text-center group"
                >
                  {/* Step Number & Icon */}
                  <div className="relative z-10 mx-auto mb-6">
                    <motion.div 
                      className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${step.bgGradient} border-2 border-border/50 flex items-center justify-center mx-auto shadow-lg transition-all duration-300`}
                      whileHover={{ 
                        y: -8, 
                        scale: 1.05,
                        boxShadow: `0 20px 40px -10px rgba(var(--${step.glowColor}-500), 0.3)`
                      }}
                    >
                      <motion.div 
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </motion.div>
                    </motion.div>
                    
                    {/* Step number badge */}
                    <motion.div 
                      className={`absolute -top-3 -right-3 w-11 h-11 rounded-xl bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center font-bold text-lg shadow-lg`}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      initial={{ scale: 0, rotate: -45 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                    >
                      {index + 1}
                    </motion.div>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2 text-lg group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {step.description}
                  </p>
                  
                  {/* 170. Step stats badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="inline-flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full"
                  >
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">{step.stat}</span>
                    <span className="text-xs text-muted-foreground">{step.statLabel}</span>
                  </motion.div>
                  
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
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden space-y-1">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex gap-4"
            >
              <div className="relative flex flex-col items-center">
                <motion.div 
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center flex-shrink-0 shadow-lg relative`}
                  whileHover={{ scale: 1.1 }}
                >
                  <step.icon className="w-7 h-7 text-white" />
                  
                  {/* Step number badge */}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-current text-xs font-bold flex items-center justify-center shadow-md">
                    {index + 1}
                  </span>
                </motion.div>
                
                {/* Animated connection line */}
                {index < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/40 to-primary/10 mt-3 relative overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-primary to-transparent"
                      animate={{ y: ["0%", "500%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                )}
              </div>
              
              <div className="pb-8 flex-1 pt-1">
                <motion.span 
                  className={`inline-block text-xs font-bold text-white bg-gradient-to-r ${step.gradient} px-3 py-1 rounded-full mb-2 shadow-sm`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                >
                  Schritt {index + 1}
                </motion.span>
                <h3 className="font-semibold text-foreground mb-1 text-lg">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom trust indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            Bereits über <span className="font-bold text-foreground">15'000</span> erfolgreiche Umzüge vermittelt
          </p>
        </motion.div>
      </div>
    </section>
  );
}
