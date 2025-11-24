import { motion } from "framer-motion";
import { TrendingUp, Star, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  {
    value: "8.200+",
    label: "Erfolgreiche Umzüge",
    description: "Seit 2016",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    value: "4.9/5",
    label: "Kundenbewertung",
    description: "Aus echten Bewertungen",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    value: "98%",
    label: "Weiterempfehlungsrate",
    description: "Zufriedene Kunden",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    value: "< 2h",
    label: "Durchschnittliche Antwortzeit",
    description: "Schneller Service",
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

export const SuccessMetrics = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/10 to-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card">
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-7 h-7 ${metric.color}`} />
                    </div>
                    <motion.div
                      initial={{ scale: 1 }}
                      whileInView={{ scale: [1, 1.1, 1] }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    >
                      <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                        {metric.value}
                      </h3>
                    </motion.div>
                    <p className="font-semibold text-foreground mb-1">{metric.label}</p>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
