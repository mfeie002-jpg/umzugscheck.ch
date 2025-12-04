/**
 * TrustAndSecuritySection - Data protection and transparency information
 * Addresses user concerns about data handling
 */

import { motion } from "framer-motion";
import { Shield, Eye, Ban, Lock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const trustPoints = [
  {
    icon: Shield,
    title: "Datenschutz nach Schweizer Standard",
    description: "Ihre Daten werden sicher verarbeitet und nur für die Offertenübermittlung verwendet.",
  },
  {
    icon: Eye,
    title: "Transparente Weitergabe",
    description: "Sie sehen genau, welche Firmen Ihre Anfrage erhalten. Keine versteckten Empfänger.",
  },
  {
    icon: Ban,
    title: "Keine Werbung von Dritten",
    description: "Keine Newsletter, keine Weitergabe an Marketingpartner. Nur relevante Umzugsofferten.",
  },
];

const processSteps = [
  { step: 1, title: "Matching", description: "KI findet passende Firmen basierend auf Ihren Kriterien" },
  { step: 2, title: "Übermittlung", description: "Nur relevante Daten werden an ausgewählte Firmen gesendet" },
  { step: 3, title: "Kontaktaufnahme", description: "Firmen melden sich direkt bei Ihnen mit Offerten" },
  { step: 4, title: "Sie entscheiden", description: "Keine Verpflichtung – wählen Sie frei oder lehnen Sie alle ab" },
];

export default function TrustAndSecuritySection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Sicherheit, Datenschutz & Transparenz
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
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
            >
              <Card className="h-full text-center border-2 border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <point.icon className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {point.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
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
          <Card className="bg-muted/50 border-0">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Was passiert mit meinen Daten nach dem Absenden?
                </h3>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {processSteps.map((step, index) => (
                  <div key={step.step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {step.step}
                      </div>
                      {index < processSteps.length - 1 && (
                        <div className="hidden lg:block w-full h-0.5 bg-primary/20 absolute top-4 left-1/2" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">
                        {step.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>
                    Nach Abschluss des Umzugs werden Ihre Anfragedaten automatisch gelöscht.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
