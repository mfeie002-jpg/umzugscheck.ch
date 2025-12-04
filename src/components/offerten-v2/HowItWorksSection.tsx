/**
 * HowItWorksSection - 4-step process explanation
 * Visual timeline on desktop, vertical on mobile
 * 
 * OPTIMIZATIONS:
 * 21. Pulsing dots on connection line
 * 22. Gradient backgrounds for step circles
 * 23. Hover scale effect on cards
 * 24. Better step number badges
 */

import { motion } from "framer-motion";
import { FileText, Cpu, Users, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Daten eingeben",
    description: "Wohnungsgrösse, Strecke und Zusatzservices – in weniger als 2 Minuten.",
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-500/10 to-blue-600/5",
  },
  {
    icon: Cpu,
    title: "KI schätzt die Kosten",
    description: "Auf Basis tausender realer Umzüge in der Schweiz erhalten Sie eine realistische Preisspanne.",
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-500/10 to-purple-600/5",
  },
  {
    icon: Users,
    title: "Passende Firmen erhalten Ihre Anfrage",
    description: "Wir matchen Ihre Daten mit geprüften Umzugsfirmen in Ihrer Region.",
    gradient: "from-amber-500 to-amber-600",
    bgGradient: "from-amber-500/10 to-amber-600/5",
  },
  {
    icon: CheckCircle,
    title: "Offerten vergleichen & beste Firma wählen",
    description: "Sie entscheiden – nach Preis, Bewertungen und Leistungen.",
    gradient: "from-green-500 to-green-600",
    bgGradient: "from-green-500/10 to-green-600/5",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4"
          >
            In 4 einfachen Schritten
          </motion.span>
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
            {/* Connection Line with gradient */}
            <div className="absolute top-14 left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-amber-500 to-green-500 rounded-full opacity-30" />
            
            {/* Pulsing dots on line */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute top-[52px] w-3 h-3 rounded-full bg-primary"
                style={{ left: `${25 + i * 25}%` }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
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
                  whileHover={{ y: -5 }}
                  className="relative text-center group"
                >
                  {/* Step Number & Icon */}
                  <div className="relative z-10 mx-auto mb-6">
                    <motion.div 
                      className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${step.bgGradient} border-2 border-border/50 flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                    <motion.div 
                      className={`absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center font-bold text-lg shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {index + 1}
                    </motion.div>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2 text-lg group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden space-y-6">
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
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                >
                  <step.icon className="w-7 h-7 text-white" />
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/40 to-primary/10 mt-3" />
                )}
              </div>
              <div className="pb-8 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold text-white bg-gradient-to-r ${step.gradient} px-3 py-1 rounded-full`}>
                    Schritt {index + 1}
                  </span>
                </div>
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
      </div>
    </section>
  );
}
