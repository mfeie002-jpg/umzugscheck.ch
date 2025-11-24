import { motion } from "framer-motion";
import { Users, Award, Heart, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const teamMembers = [
  {
    name: "Familie Müller",
    role: "Gründer & Geschäftsführung",
    description: "Seit 2016 mit Herz und Leidenschaft für Ihren Umzug",
    icon: Heart,
  },
  {
    name: "Unser Team",
    role: "25+ Umzugsexperten",
    description: "Ausgebildete Profis mit jahrelanger Erfahrung",
    icon: Users,
  },
  {
    name: "Qualität",
    role: "Schweizer Präzision",
    description: "Zertifiziert & vollständig versichert",
    icon: Award,
  },
  {
    name: "Versicherung",
    role: "CHF 10 Mio. Deckung",
    description: "Ihr Eigentum ist in sicheren Händen",
    icon: Shield,
  },
];

export const TeamShowcase = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ihr familiengeführtes Umzugsunternehmen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mit über 8.200 erfolgreichen Umzügen seit 2016 behandeln wir jeden Umzug wie ein Meisterwerk
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-card">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{member.name}</h3>
                    <p className="text-primary font-semibold mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8">
              <p className="text-lg text-foreground leading-relaxed">
                <span className="font-bold text-primary">"Als Familienunternehmen</span> verstehen wir, wie wichtig 
                Ihr Zuhause für Sie ist. Deshalb behandeln wir jeden Umzug mit der gleichen Sorgfalt, 
                als würden wir unsere eigene Familie umziehen lassen."
              </p>
              <p className="mt-4 text-sm text-muted-foreground font-semibold">
                — Familie Müller, Gründer von Feierabend-Umzüge
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
