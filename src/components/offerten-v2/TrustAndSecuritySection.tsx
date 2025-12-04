/**
 * TrustAndSecuritySection - Data protection and transparency information
 * Addresses user concerns about data handling
 * 
 * OPTIMIZATIONS:
 * 29. Shield animation/pulse effect
 * 30. Better process step styling with icons
 * 31. Gradient backgrounds
 * 32. Improved visual hierarchy
 */

import { motion } from "framer-motion";
import { Shield, Eye, Ban, Lock, CheckCircle2, ArrowRight, Fingerprint, Server } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const trustPoints = [
  {
    icon: Shield,
    title: "Datenschutz nach Schweizer Standard",
    description: "Ihre Daten werden sicher verarbeitet und nur für die Offertenübermittlung verwendet.",
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Eye,
    title: "Transparente Weitergabe",
    description: "Sie sehen genau, welche Firmen Ihre Anfrage erhalten. Keine versteckten Empfänger.",
    gradient: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Ban,
    title: "Keine Werbung von Dritten",
    description: "Keine Newsletter, keine Weitergabe an Marketingpartner. Nur relevante Umzugsofferten.",
    gradient: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
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
  },
  { 
    step: 2, 
    icon: ArrowRight,
    title: "Übermittlung", 
    description: "Nur relevante Daten werden an ausgewählte Firmen gesendet",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  { 
    step: 3, 
    icon: Server,
    title: "Kontaktaufnahme", 
    description: "Firmen melden sich direkt bei Ihnen mit Offerten",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  { 
    step: 4, 
    icon: CheckCircle2,
    title: "Sie entscheiden", 
    description: "Keine Verpflichtung – wählen Sie frei oder lehnen Sie alle ab",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
];

export default function TrustAndSecuritySection() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 mb-4"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Lock className="w-8 h-8 text-green-600" />
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
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full text-center border-2 border-border/50 hover:border-green-200 transition-all duration-300 overflow-hidden">
                <CardContent className="p-8">
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl ${point.bgColor} flex items-center justify-center mx-auto mb-5`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <point.icon className={`w-8 h-8 bg-gradient-to-br ${point.gradient} bg-clip-text text-transparent`} style={{ color: point.gradient.includes('green') ? '#22c55e' : point.gradient.includes('blue') ? '#3b82f6' : '#a855f7' }} />
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
          <Card className="bg-gradient-to-br from-muted/80 to-muted/40 border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
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
                    className="relative"
                  >
                    <div className="flex flex-col items-center text-center">
                      <motion.div 
                        className={`w-14 h-14 rounded-2xl ${step.bgColor} flex items-center justify-center mb-4 relative`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <step.icon className={`w-6 h-6 ${step.color}`} />
                        <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center font-bold text-sm`}>
                          {step.step}
                        </div>
                      </motion.div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {step.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    
                    {/* Connection arrow for desktop */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-7 -right-3 w-6">
                        <ArrowRight className="w-5 h-5 text-muted-foreground/30" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-8 pt-6 border-t border-border/50"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3 bg-green-50 text-green-800 px-5 py-3 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
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
