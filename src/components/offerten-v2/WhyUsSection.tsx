/**
 * WhyUsSection - Key benefits and USPs with green checkmarks
 * Builds trust and highlights platform advantages
 * 
 * OPTIMIZATIONS:
 * 25. Hover 3D tilt effect
 * 26. Animated border gradient on hover
 * 27. Icon pulse animation
 * 28. Better visual hierarchy
 */

import { motion } from "framer-motion";
import { Clock, Scale, Shield, MapPin, CheckCircle2, Zap, Award } from "lucide-react";
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
  },
  {
    icon: Scale,
    title: "Fairer Marktvergleich",
    description: "Vergleichen Sie Preise und Leistungen verschiedener Anbieter transparent nebeneinander.",
    checkmark: "Transparente Angebote ohne versteckte Kosten",
    gradient: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Shield,
    title: "Geprüfte Anbieter",
    description: "Alle Umzugsfirmen durchlaufen unseren Qualitätscheck. Sie erhalten nur seriöse Angebote.",
    checkmark: "Nur Firmen, die unseren Kriterien entsprechen",
    gradient: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: MapPin,
    title: "Schweizer Fokus",
    description: "Lokale Expertise in allen 26 Kantonen. Anbieter kennen die regionalen Gegebenheiten.",
    checkmark: "Angebote aus Ihrer Region, in Ihrer Sprache",
    gradient: "from-primary to-primary/80",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-muted/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4"
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                {/* Hover gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="absolute inset-[2px] bg-card rounded-[calc(var(--radius)-2px)]" />
                
                <CardContent className="p-6 relative z-10">
                  <motion.div 
                    className={`w-14 h-14 rounded-2xl ${benefit.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <benefit.icon className={`w-7 h-7 ${benefit.iconColor}`} />
                  </motion.div>
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {benefit.description}
                  </p>
                  <div className="flex items-start gap-2 pt-4 border-t border-border/50">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {benefit.checkmark}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Trust indicators row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10"
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
              className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-5 py-3 rounded-xl border border-border/50"
            >
              <stat.icon className="w-5 h-5 text-primary" />
              <div>
                <div className="text-lg font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.text}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
