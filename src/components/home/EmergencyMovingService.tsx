import { motion } from "framer-motion";
import { Siren, Clock, Phone, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const EmergencyMovingService = () => {
  const features = [
    "Umzug innerhalb 24-48 Stunden",
    "Express-Offerte in unter 1 Stunde",
    "Verfügbarkeit auch an Wochenenden",
    "Prioritäts-Behandlung Ihrer Anfrage",
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="shadow-2xl border-2 border-red-500/30 bg-card">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center relative"
                  >
                    <Siren className="w-12 h-12 text-red-600" />
                    <motion.div
                      className="absolute inset-0 bg-red-500/30 rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <Badge className="mb-3 bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30">
                    <Clock className="w-3 h-3 mr-1" />
                    24/7 Verfügbar
                  </Badge>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                    Notfall-Umzug?
                  </h2>
                  
                  <p className="text-muted-foreground mb-6">
                    Wir organisieren Ihren dringenden Umzug – schnell, zuverlässig und professionell.
                  </p>

                  {/* Features */}
                  <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Button
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Jetzt anrufen
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-red-500/30"
                    >
                      Express-Offerte
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4">
                    📞 Hotline: +41 44 567 89 00 (24/7 erreichbar)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
