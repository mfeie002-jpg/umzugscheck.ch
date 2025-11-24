import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, TreePine, Truck, Package, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

const ecoFeatures = [
  {
    icon: Truck,
    title: "Elektro-Fahrzeuge",
    description: "Moderne E-Transporter für emissionsfreie Umzüge",
    badge: "CO₂-frei",
  },
  {
    icon: Package,
    title: "Mehrweg-Boxen",
    description: "Wiederverwendbare Umzugskartons statt Einweg",
    badge: "0% Abfall",
  },
  {
    icon: TreePine,
    title: "Baum-Pflanzung",
    description: "Für jeden Umzug pflanzen wir einen Baum",
    badge: "1 Baum = 1 Umzug",
  },
  {
    icon: Award,
    title: "Zertifiziert",
    description: "ISO 14001 Umweltmanagement-Zertifizierung",
    badge: "Geprüft",
  },
];

export const EcoFriendlyMoving = () => {
  const [distance, setDistance] = useState([50]);
  
  const calculateCO2 = (km: number) => {
    const standardCO2 = km * 0.27; // kg CO2 per km for standard diesel truck
    const ecoCO2 = 0; // Electric vehicle
    return {
      standard: Math.round(standardCO2),
      eco: ecoCO2,
      saved: Math.round(standardCO2),
      trees: Math.round(standardCO2 / 20), // ~20kg CO2 absorbed per tree per year
    };
  };

  const co2Data = calculateCO2(distance[0]);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Umweltfreundlich umziehen
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Schonen Sie die Umwelt mit unseren nachhaltigen Umzugslösungen
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* CO2 Calculator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-xl border-2 border-green-500/30">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                  CO₂-Fussabdruck Rechner
                </h3>

                {/* Distance Slider */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-semibold text-foreground">Umzugsdistanz</label>
                    <span className="text-2xl font-bold text-primary">{distance[0]} km</span>
                  </div>
                  <Slider
                    value={distance}
                    onValueChange={setDistance}
                    min={5}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Comparison */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Standard */}
                  <motion.div
                    key={`standard-${distance[0]}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl"
                  >
                    <h4 className="font-bold text-foreground mb-2">Standard Diesel-LKW</h4>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-600">{co2Data.standard}</span>
                      <span className="text-muted-foreground mb-1">kg CO₂</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Entspricht {co2Data.trees} Bäumen für 1 Jahr
                    </p>
                  </motion.div>

                  {/* Eco */}
                  <motion.div
                    key={`eco-${distance[0]}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border-2 border-green-500/30"
                  >
                    <h4 className="font-bold text-foreground mb-2">
                      Elektro-Umzug 🌱
                    </h4>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl font-bold text-green-600">{co2Data.eco}</span>
                      <span className="text-muted-foreground mb-1">kg CO₂</span>
                    </div>
                    <p className="text-sm text-green-600 font-semibold">
                      Sie sparen {co2Data.saved} kg CO₂! 🎉
                    </p>
                  </motion.div>
                </div>

                {/* Tree Visual */}
                <motion.div
                  key={`trees-${distance[0]}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-6 p-6 bg-green-50 dark:bg-green-950/20 rounded-2xl text-center"
                >
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(Math.min(co2Data.trees, 10))].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-2xl"
                      >
                        🌳
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-sm text-foreground font-semibold">
                    Wir pflanzen {Math.min(co2Data.trees, 10)} Bäume für diesen Umzug
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Eco Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecoFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center border-2 border-green-500/20 hover:border-green-500/40 transition-colors">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-7 h-7 text-green-600" />
                      </div>
                      <Badge variant="secondary" className="mb-3 bg-green-500/10 text-green-700 dark:text-green-400">
                        {feature.badge}
                      </Badge>
                      <h3 className="font-bold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
