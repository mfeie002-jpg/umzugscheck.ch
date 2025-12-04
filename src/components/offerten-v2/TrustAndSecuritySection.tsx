/**
 * TrustAndSecuritySection - Data protection and transparency information
 * Addresses user concerns about data handling
 * 
 * OPTIMIZATIONS:
 * 85. Animated shield pulse effect
 * 86. Enhanced process step styling
 * 87. Gradient backgrounds with depth
 * 88. Better visual hierarchy
 * 89. Icon animations on hover
 * 90. Connection arrows with animation
 * 91. Trust badge enhancements
 * 92. Completion indicator animation
 */

import { motion } from "framer-motion";
import { Shield, Eye, Ban, Lock, CheckCircle2, ArrowRight, Fingerprint, Server, Sparkles } from "lucide-react";
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
  },
  {
    icon: Eye,
    title: "Transparente Weitergabe",
    description: "Sie sehen genau, welche Firmen Ihre Anfrage erhalten. Keine versteckten Empfänger.",
    gradient: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "#3b82f6",
    borderHover: "hover:border-blue-300",
  },
  {
    icon: Ban,
    title: "Keine Werbung von Dritten",
    description: "Keine Newsletter, keine Weitergabe an Marketingpartner. Nur relevante Umzugsofferten.",
    gradient: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "#a855f7",
    borderHover: "hover:border-purple-300",
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
  },
  { 
    step: 2, 
    icon: ArrowRight,
    title: "Übermittlung", 
    description: "Nur relevante Daten werden an ausgewählte Firmen gesendet",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    gradient: "from-purple-500 to-purple-600",
  },
  { 
    step: 3, 
    icon: Server,
    title: "Kontaktaufnahme", 
    description: "Firmen melden sich direkt bei Ihnen mit Offerten",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    gradient: "from-amber-500 to-amber-600",
  },
  { 
    step: 4, 
    icon: CheckCircle2,
    title: "Sie entscheiden", 
    description: "Keine Verpflichtung – wählen Sie frei oder lehnen Sie alle ab",
    color: "text-green-600",
    bgColor: "bg-green-100",
    gradient: "from-green-500 to-green-600",
  },
];

export default function TrustAndSecuritySection() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Animated shield icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 mb-4 relative"
          >
            <motion.div
              className="absolute inset-0 rounded-2xl bg-green-200"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
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
              <Lock className="w-8 h-8 text-green-600 relative z-10" />
            </motion.div>
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Sicherheit, Datenschutz & Transparenz
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Ihre Privatsphäre ist uns wichtig. So gehen wir mit Ihren Daten um.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {trustPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group"
            >
              <Card className={`h-full text-center border-2 border-border/50 ${point.borderHover} transition-all duration-300 overflow-hidden`}>
                <CardContent className="p-8">
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl ${point.bgColor} flex items-center justify-center mx-auto mb-5 relative`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
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
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Process Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
                <h3 className="font-semibold text-xl text-foreground">
                  Was passiert mit meinen Daten nach dem Absenden?
                </h3>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {processSteps.map((step, index) => (
                  <motion.div 
                    key={step.step}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="relative group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <motion.div 
                        className={`w-14 h-14 rounded-2xl ${step.bgColor} flex items-center justify-center mb-4 relative group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <step.icon className={`w-6 h-6 ${step.color}`} />
                        <motion.div 
                          className={`absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center font-bold text-sm shadow-lg`}
                          initial={{ scale: 0, rotate: -20 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                        >
                          {step.step}
                        </motion.div>
                      </motion.div>
                      <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    
                    {/* Connection arrow for desktop */}
                    {index < processSteps.length - 1 && (
                      <motion.div 
                        className="hidden lg:block absolute top-7 -right-3 w-6"
                        initial={{ opacity: 0, x: -5 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <ArrowRight className="w-5 h-5 text-primary/40" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* Completion message */}
              <motion.div 
                className="mt-8 pt-6 border-t border-border/50"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3 bg-green-50 text-green-800 px-5 py-3 rounded-xl border border-green-200">
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </motion.div>
                  <span className="text-sm font-medium">
                    Nach Abschluss des Umzugs werden Ihre Anfragedaten automatisch gelöscht.
                  </span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}