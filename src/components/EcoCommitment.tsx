import { motion } from "framer-motion";
import { Leaf, Recycle, TreeDeciduous, Award } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionBadge from "@/components/SectionBadge";

const EcoCommitment = () => {
  const ecoFeatures = [
    {
      icon: TreeDeciduous,
      title: "CO₂-Kompensation",
      description: "Wir kompensieren 100% unserer Fahrtemissionen durch Schweizer Klimaprojekte.",
    },
    {
      icon: Recycle,
      title: "Recycling-Priorität",
      description: "Umweltgerechte Entsorgung und Wiederverwertung von Altmöbeln.",
    },
    {
      icon: Leaf,
      title: "Nachhaltige Materialien",
      description: "Umzugsdecken statt Plastikfolie, recycelbare Kartons.",
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-forest/5 border-y border-forest/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="text-center lg:text-left lg:w-1/3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest/10 text-forest text-sm font-semibold mb-4">
                <Leaf className="h-4 w-4" />
                Umweltbewusst
              </div>
              <h3 className="text-xl lg:text-2xl font-display font-bold mb-3">
                Nachhaltig umziehen
              </h3>
              <p className="text-muted-foreground text-sm">
                Wir übernehmen Verantwortung für unsere Umwelt und handeln nachhaltig.
              </p>
            </div>
            
            <div className="flex-1 grid sm:grid-cols-3 gap-6">
              {ecoFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-6 w-6 text-forest" />
                  </div>
                  <h4 className="font-bold text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default EcoCommitment;
