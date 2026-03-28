import { motion } from "framer-motion";
import { Award, Users, Truck, Star } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const milestones = [
  { year: "1984", event: "Firmengründung", icon: Award },
  { year: "1995", event: "10. Mitarbeiter", icon: Users },
  { year: "2005", event: "Eigene Fahrzeugflotte", icon: Truck },
  { year: "2015", event: "1000. Umzug", icon: Star },
  { year: "2020", event: "3. Generation", icon: Users },
  { year: "2024", event: "40 Jahre Erfahrung", icon: Award },
];

const CompanyMilestones = () => {
  return (
    <section className="py-16 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Unsere Geschichte
            </h2>
            <p className="text-muted-foreground">
              40 Jahre Familientradition im Umzugsgeschäft
            </p>
          </div>
        </AnimatedSection>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12 md:col-start-2"}`}
              >
                {/* Timeline dot */}
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground items-center justify-center z-10"
                  style={{ [index % 2 === 0 ? 'right' : 'left']: '-1.25rem' }}
                >
                  <milestone.icon className="w-5 h-5" />
                </div>

                <div className="bg-background rounded-xl p-5 border border-border shadow-sm">
                  <div className="flex items-center gap-3 md:hidden mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <milestone.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                  </div>
                  <span className="hidden md:block text-2xl font-bold text-primary mb-1">{milestone.year}</span>
                  <p className="text-foreground font-medium">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyMilestones;
