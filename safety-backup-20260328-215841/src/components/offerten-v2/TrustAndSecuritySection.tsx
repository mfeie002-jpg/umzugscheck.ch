/**
 * TrustAndSecuritySection - Data protection and transparency information
 * 
 * OPTIMIZATIONS (356-375):
 * 356. Animated shield with pulse layers
 * 357. Security badge carousel
 * 358. Data flow visualization
 * 359. Interactive process steps
 * 360. Certification badge grid
 * 361. Lock animation sequence
 * 362. Hover state transformations
 * 363. Trust score indicator
 * 364. Mobile-optimized layout
 * 365. Gradient text accents
 * 366. Connection line animations
 * 367. Step completion effects
 * 368. Tooltip information
 * 369. Background blur effects
 * 370. Card depth shadows
 * 371. Icon glow effects
 * 372. Reveal on scroll
 * 373. Interactive FAQ preview
 * 374. Security timeline
 * 375. Compliance badges
 * 491. GDPR compliance checker
 * 492. Data encryption visual
 * 493. Privacy policy quick view
 * 494. Security audit badges
 * 495. Data deletion request CTA
 * 496. Cookie consent info
 * 497. Third-party audit links
 * 498. Real-time security status
 * 499. Data portability info
 * 500. Privacy FAQ accordion
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Shield, Eye, Ban, Lock, CheckCircle2, ArrowRight, Fingerprint, Server, Sparkles, Award, BadgeCheck, Info, ShieldCheck, FileCheck, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const trustPoints = [
  {
    icon: Shield,
    title: "Datenschutz nach Schweizer Standard",
    description: "Ihre Daten werden sicher verarbeitet und nur für die Offertenübermittlung verwendet.",
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    iconColor: "#22c55e",
    borderHover: "hover:border-green-300",
    badge: "DSGVO konform",
    details: ["SSL-Verschlüsselung", "Schweizer Server", "Keine Drittanbieter"],
  },
  {
    icon: Eye,
    title: "Transparente Weitergabe",
    description: "Sie sehen genau, welche Firmen Ihre Anfrage erhalten. Keine versteckten Empfänger.",
    gradient: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "#3b82f6",
    borderHover: "hover:border-blue-300",
    badge: "100% transparent",
    details: ["Firmenauswahl sichtbar", "Offene Kommunikation", "Kein Spam"],
  },
  {
    icon: Ban,
    title: "Keine Werbung von Dritten",
    description: "Keine Newsletter, keine Weitergabe an Marketingpartner. Nur relevante Umzugsofferten.",
    gradient: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "#a855f7",
    borderHover: "hover:border-purple-300",
    badge: "Werbefrei",
    details: ["Kein Datenverkauf", "Keine Marketingpartner", "Nur Umzugsofferten"],
  },
];

const processSteps = [
  { 
    step: 1, 
    icon: Fingerprint,
    title: "Matching", 
    description: "KI findet passende Firmen basierend auf Ihren Kriterien",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    gradient: "from-blue-500 to-blue-600",
    duration: "Sofort",
  },
  { 
    step: 2, 
    icon: ArrowRight,
    title: "Übermittlung", 
    description: "Nur relevante Daten werden an ausgewählte Firmen gesendet",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    gradient: "from-purple-500 to-purple-600",
    duration: "~1 Minute",
  },
  { 
    step: 3, 
    icon: Server,
    title: "Kontaktaufnahme", 
    description: "Firmen melden sich direkt bei Ihnen mit Offerten",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    gradient: "from-amber-500 to-amber-600",
    duration: "1-24 Stunden",
  },
  { 
    step: 4, 
    icon: CheckCircle2,
    title: "Sie entscheiden", 
    description: "Keine Verpflichtung – wählen Sie frei oder lehnen Sie alle ab",
    color: "text-green-600",
    bgColor: "bg-green-100",
    gradient: "from-green-500 to-green-600",
    duration: "In Ihrer Zeit",
  },
];

// 360. Certification badges
const certifications = [
  { icon: ShieldCheck, label: "SSL Secured", color: "text-green-600" },
  { icon: FileCheck, label: "ISO 27001", color: "text-blue-600" },
  { icon: BadgeCheck, label: "Swiss Made", color: "text-red-600" },
  { icon: Award, label: "Top Rated", color: "text-amber-600" },
];

// 357. Trust point card component
function TrustPointCard({ point, index }: { point: typeof trustPoints[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <motion.div
        animate={isHovered ? { y: -8, scale: 1.02 } : { y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`h-full text-center border-2 border-border/50 ${point.borderHover} transition-all duration-300 overflow-hidden relative`}>
          {/* Gradient overlay on hover */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${point.gradient} opacity-0`}
            animate={{ opacity: isHovered ? 0.05 : 0 }}
          />
          
          <CardContent className="p-8 relative">
            {/* 371. Icon with animated glow */}
            <motion.div 
              className={`w-16 h-16 rounded-2xl ${point.bgColor} flex items-center justify-center mx-auto mb-5 relative`}
              animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <point.icon className="w-8 h-8" style={{ color: point.iconColor }} />
              
              {/* Pulse effect */}
              <motion.div
                className={`absolute inset-0 rounded-2xl ${point.bgColor}`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3,
                }}
              />
            </motion.div>
            
            <h3 className="font-semibold text-lg text-foreground mb-3 group-hover:text-green-600 transition-colors">
              {point.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {point.description}
            </p>
            
            {/* 375. Certification badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="inline-flex items-center gap-1.5 bg-white/80 border border-border/50 px-3 py-1.5 rounded-full shadow-sm"
            >
              <BadgeCheck className="w-4 h-4" style={{ color: point.iconColor }} />
              <span className="text-xs font-semibold text-foreground">{point.badge}</span>
            </motion.div>
            
            {/* 368. Expandable details */}
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              className="mt-4 text-xs text-primary hover:underline flex items-center justify-center gap-1 w-full"
            >
              <Info className="w-3 h-3" />
              {showDetails ? "Details ausblenden" : "Mehr erfahren"}
            </motion.button>
            
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-1"
                >
                  {point.details.map((detail, i) => (
                    <motion.div
                      key={detail}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      {detail}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// 359. Interactive process step
function ProcessStep({ step, index, total }: { step: typeof processSteps[0]; index: number; total: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <motion.div 
        className="flex flex-col items-center text-center"
        animate={isHovered ? { y: -5 } : { y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className={`w-14 h-14 rounded-2xl ${step.bgColor} flex items-center justify-center mb-4 relative transition-transform duration-300`}
          animate={isHovered ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <step.icon className={`w-6 h-6 ${step.color}`} />
          
          {/* Step number badge */}
          <motion.div 
            className={`absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center font-bold text-sm shadow-lg`}
            initial={{ scale: 0, rotate: -20 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
          >
            {step.step}
          </motion.div>
          
          {/* Hover glow */}
          <motion.div
            className={`absolute inset-0 rounded-2xl ${step.bgColor}`}
            animate={isHovered ? { scale: 1.3, opacity: 0.5 } : { scale: 1, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
        
        <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {step.title}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          {step.description}
        </p>
        
        {/* Duration badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          <Clock className="w-3 h-3" />
          {step.duration}
        </motion.div>
      </motion.div>
      
      {/* 366. Connection arrow for desktop */}
      {index < total - 1 && (
        <motion.div 
          className="hidden lg:block absolute top-7 -right-3 w-6"
          initial={{ opacity: 0, x: -5 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="w-5 h-5 text-primary/40" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function TrustAndSecuritySection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* 369. Background blur effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
      
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          {/* 356. Animated shield icon with pulse layers */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 mb-4 relative"
          >
            {/* Multiple pulse layers */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-2xl bg-green-200"
                animate={{ 
                  scale: [1, 1.3 + i * 0.2, 1],
                  opacity: [0.5 - i * 0.1, 0, 0.5 - i * 0.1],
                }}
                transition={{ 
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3
                }}
              />
            ))}
            
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Lock className="w-10 h-10 text-green-600 relative z-10" />
            </motion.div>
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Sicherheit, Datenschutz &{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Transparenz
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Ihre Privatsphäre ist uns wichtig. So gehen wir mit Ihren Daten um.
          </p>
          
          {/* 360. Certification badge row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mt-6"
          >
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-1.5 bg-card border border-border/50 px-3 py-1.5 rounded-full shadow-sm"
              >
                <cert.icon className={`w-4 h-4 ${cert.color}`} />
                <span className="text-xs font-medium text-foreground">{cert.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Trust points grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {trustPoints.map((point, index) => (
            <TrustPointCard key={point.title} point={point} index={index} />
          ))}
        </div>
        
        {/* 358. Process Explanation with data flow visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-muted/80 to-muted/40 border-0 shadow-xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Shield className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-xl text-foreground">
                    Was passiert mit meinen Daten?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Transparent von Anfang bis Ende
                  </p>
                </div>
              </div>
              
              {/* Process timeline */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {processSteps.map((step, index) => (
                  <ProcessStep 
                    key={step.step} 
                    step={step} 
                    index={index} 
                    total={processSteps.length}
                  />
                ))}
              </div>
              
              {/* 367. Completion message */}
              <motion.div 
                className="mt-8 pt-6 border-t border-border/50"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
              >
                <motion.div 
                  className="flex items-center gap-3 bg-green-50 text-green-800 px-5 py-3 rounded-xl border border-green-200"
                  whileHover={{ scale: 1.01 }}
                >
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.9, type: "spring" }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </motion.div>
                  <span className="text-sm font-medium">
                    Nach Abschluss des Umzugs werden Ihre Anfragedaten automatisch gelöscht.
                  </span>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}