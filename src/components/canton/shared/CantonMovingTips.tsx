import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Clock, MapPin, FileText, Truck, Users } from "lucide-react";

interface CantonMovingTipsProps {
  cantonName: string;
  tips?: { icon: any; title: string; description: string }[];
}

const defaultTips = [
  { icon: Clock, title: "Früh planen", description: "Beginnen Sie 2-3 Monate vor dem Umzug mit der Planung" },
  { icon: MapPin, title: "Parkplatz reservieren", description: "Beantragen Sie rechtzeitig eine Halteverbotszone" },
  { icon: FileText, title: "Verträge kündigen", description: "Denken Sie an Strom, Internet und Versicherungen" },
  { icon: Truck, title: "Vergleichen lohnt sich", description: "Holen Sie mindestens 3 Offerten ein" },
  { icon: Users, title: "Helfer organisieren", description: "Familie und Freunde können beim Packen helfen" },
  { icon: Lightbulb, title: "Ausmisten", description: "Weniger Gepäck = günstigerer Umzug" },
];

export const CantonMovingTips = ({ cantonName, tips = defaultTips }: CantonMovingTipsProps) => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Umzugstipps für {cantonName}</h2>
        <p className="text-muted-foreground">Praktische Hinweise für einen stressfreien Umzug</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {tips.map((tip, i) => {
          const Icon = tip.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
