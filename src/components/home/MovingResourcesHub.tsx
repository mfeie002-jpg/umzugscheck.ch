import { motion } from "framer-motion";
import { FileText, Download, BookOpen, Video, CheckSquare, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const resources = [
  {
    icon: CheckSquare,
    title: "Umzugs-Checkliste",
    description: "Schritt-für-Schritt Anleitung für Ihren perfekten Umzug",
    type: "PDF Download",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    link: "#",
  },
  {
    icon: Calculator,
    title: "Kosten-Rechner",
    description: "Berechnen Sie Ihre Umzugskosten in Sekunden",
    type: "Online Tool",
    color: "text-green-600",
    bgColor: "bg-green-100",
    link: "/rechner",
  },
  {
    icon: FileText,
    title: "Umzugs-Ratgeber",
    description: "Alles was Sie über Umzüge wissen müssen",
    type: "E-Book",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    link: "/blog",
  },
  {
    icon: Video,
    title: "Video-Tutorials",
    description: "Praktische Anleitungen für Ihren Umzug",
    type: "Videos",
    color: "text-red-600",
    bgColor: "bg-red-100",
    link: "#",
  },
  {
    icon: BookOpen,
    title: "Umzugs-Lexikon",
    description: "Alle Begriffe rund um's Umziehen erklärt",
    type: "Glossar",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    link: "#",
  },
  {
    icon: Download,
    title: "Vorlagen & Formulare",
    description: "Mietvertrag, Kündigung, Übergabeprotokoll & mehr",
    type: "Downloads",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    link: "#",
  },
];

export const MovingResourcesHub = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/10 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kostenlose Umzugs-Ressourcen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Alle Tools, Checklisten und Ratgeber die Sie für einen erfolgreichen Umzug benötigen
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 group">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-lg ${resource.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 ${resource.color}`} />
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                        {resource.type}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {resource.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    
                    <Link to={resource.link}>
                      <Button 
                        variant="outline" 
                        className="w-full border-primary/30 hover:bg-primary/5"
                      >
                        Mehr erfahren
                      </Button>
                    </Link>
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
          className="text-center mt-12"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Benötigen Sie persönliche Beratung?
              </h3>
              <p className="text-muted-foreground mb-6">
                Unser Expertenteam steht Ihnen jederzeit zur Verfügung
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Jetzt kontaktieren
                  </Button>
                </Link>
                <Link to="/rechner">
                  <Button size="lg" variant="outline" className="border-primary/30">
                    Preis berechnen
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
